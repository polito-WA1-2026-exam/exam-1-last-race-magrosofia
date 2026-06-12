import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import passport from 'passport';
import LocalStrategy from 'passport-local';
import session from 'express-session';
import path from 'path';
import { fileURLToPath } from 'url';
import dao from './dao.js';

const app = express();
const port = 3001;

const INITIAL_COINS = 20;
const PLANNING_TIME_LIMIT_SECONDS = 90;

// ========== MIDDLEWARE ==========
app.use(express.json());
app.use(morgan('dev'));

const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.use(express.static(path.join(__dirname, 'public')));

const corsOptions = {
  origin: 'http://localhost:5173',
  optionsSuccessStatus: 200,
  credentials: true
};
app.use(cors(corsOptions));

app.use(session({
  secret: 'ciau',
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({ error: 'Not authenticated' });
};

passport.use(new LocalStrategy(async function verify(username, password, cb) {
    const user = await dao.getUser(username, password);
    if(!user)
        return cb(null, false, 'Incorrect username or password.');
    return cb(null, user);
}));

passport.serializeUser(function (user, cb) {
  cb(null, user);
});

passport.deserializeUser(function (user, cb) {
  return cb(null, user);
});

// ========== USER MANAGEMENT APIs ==========
//Login
app.post('/api/sessions', passport.authenticate('local'), (req,res) => {
    res.status(201).json(req.user);
});

//If user is already authenticated
app.get('/api/sessions/current', (req, res) => {
  if(req.isAuthenticated()) {
    res.json(req.user);}
  else
    res.status(401).json({error: 'Not authenticated'});
});

//Logout
app.delete('/api/sessions/current', (req, res) => {
  req.logout(() => {
    res.end();
  });
});

// ========== GAME LOGIC HELPERS ==========
function toPublicStation(station) {
  return {
    id: station.id,
    name: station.name
  };
}

//It builds the metro graph
function buildAdjacency(rawSegments) {
  const adjacency = new Map();
  for (const segment of rawSegments) {
    if (!adjacency.has(segment.station1)) {
      adjacency.set(segment.station1, []);
    }
    if (!adjacency.has(segment.station2)) {
      adjacency.set(segment.station2, []);
    }
    adjacency.get(segment.station1).push(segment.station2);
    adjacency.get(segment.station2).push(segment.station1);
  }
  return adjacency;
}

//It builds the minimum number of segments between start and destination station
function shortestDistance(startStationId, destinationStationId, rawSegments) {
  const adjacency = buildAdjacency(rawSegments);
  const queue = [
    {
      stationId: startStationId,
      distance: 0
    }
  ];
  const visited = new Set([startStationId]);
  while (queue.length > 0) {
    const current = queue.shift();
    if (current.stationId === destinationStationId) {
      return current.distance;
    }
    const neighbors = adjacency.get(current.stationId) || [];
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push({
          stationId: neighbor,
          distance: current.distance + 1
        });
      }
    }
  }
  return Infinity;
}

//It sets start and destination stations, using shortestDistance 
// in order to respect the minimum distance between them.
function chooseStartAndDestination(stations, rawSegments) {
  const candidates = [];
  for (const start of stations) {
    for (const destination of stations) {
      if (start.id === destination.id) {
        continue;
      }
      const distance = shortestDistance(start.id, destination.id, rawSegments);
      if (distance >= 3 && distance !== Infinity) {
        candidates.push({
          startStation: toPublicStation(start),
          destinationStation: toPublicStation(destination)
        });
      }
    }
  }
  if (candidates.length === 0) {
    throw new Error('No valid start/destination pair found');
  }
  const randomIndex = Math.floor(Math.random() * candidates.length);
  return candidates[randomIndex];
}

//It builds the exact order of the segments submitted by the user
function orderSegmentsAccordingToRoute(route, segments) {
  const segmentsById = new Map();
  for (const segment of segments) {
    segmentsById.set(segment.id, segment);
  }
  return route.map((segmentId) => segmentsById.get(segmentId));
}


// Validate the route selected by the user according to the game rules
function validateRoute(game, route, orderedSegments) {
  if (route.length === 0) {
    return {
      valid: false,
      reason: 'The route is empty.'
    };
  }
  // Each segment can be selected only once.
  const uniqueSegments = new Set(route);
  if (uniqueSegments.size !== route.length) {
    return {
      valid: false,
      reason: 'The same segment cannot be selected more than once.'
    };
  }
  //Initial state
  let currentStationId = game.startStation;
  let previousLine = null;
  for (const segment of orderedSegments) {
    // The next selected segment must contain the station where the player currently is.
    // Otherwise, the route is not continuous.
    if (!segment.containsStation(currentStationId)) {
      return {
        valid: false,
        reason: 'The selected segments are not consecutive.'
      };
    }
    const currentStation = segment.getStation(currentStationId);
    if (previousLine !== null && previousLine !== segment.line) {
      if (!currentStation.isInterchange) {
        return {
          valid: false,
          reason: 'Line changes are allowed only at interchange stations.'
        };
      }
    }
    currentStationId = segment.getOtherStationId(currentStationId);
    previousLine = segment.line;
  }
  // the player must be located at the assigned destination station.
  if (currentStationId !== game.destinationStation) {
    return {
      valid: false,
      reason: 'The route does not reach the destination station.'
    };
  }
  // If all checks passed, the route is valid.
  return {
    valid: true,
    reason: null
  };
}

// ========== GAME APIs ==========
// GET /api/network: Retrieves the whole network
app.get('/api/network', isLoggedIn, async (req, res) => {
  try {
    const network = await dao.getFullNetwork();
    return res.status(200).json(network);
  } catch (err) {
    console.error('Error retrieving network:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/games: Creates a new game
app.post('/api/games', isLoggedIn, async (req, res) => {
  try {
    const stations = await dao.getStations();
    const rawSegments = await dao.getRawSegments();
    const { startStation, destinationStation } = chooseStartAndDestination(
      stations,
      rawSegments
    );
    const game = await dao.createGame(
      req.user.id,
      startStation.id,
      destinationStation.id
    );
    const planningNetwork = await dao.getPlanningNetwork();
    return res.status(201).json({
      gameId: game.gameId,
      startStation,
      destinationStation,
      startedAt: game.startedAt,
      timeLimit: PLANNING_TIME_LIMIT_SECONDS,
      stations: planningNetwork.stations,
      segments: planningNetwork.segments
    });
  } catch (err) {
    console.error('Error creating game:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/games/:gameId/route: Completes the game
app.post('/api/games/:gameId/route', isLoggedIn, async (req, res) => {
  try {
    const gameId = Number(req.params.gameId);
    const route = req.body.route;
    if (!Number.isInteger(gameId) || gameId <= 0) {
      return res.status(400).json({ error: 'Invalid game id' });
    }
    if (!Array.isArray(route)) {
      return res.status(400).json({ error: 'Route must be an array' });
    }
    if (!route.every((segmentId) => Number.isInteger(segmentId) && segmentId > 0)) {
      return res.status(400).json({
        error: 'Route must contain only positive integer segment ids'
      });
    }
    const game = await dao.getGameById(gameId);
    if (!game) {
      return res.status(404).json({ error: 'Game not found' });
    }
    if (!game.belongsTo(req.user.id)) {
      return res.status(403).json({
        error: 'Game does not belong to the authenticated user'
      });
    }
    if (game.isCompleted()) {
      return res.status(409).json({ error: 'Game already completed' });
    }
    const expired = game.isExpired(PLANNING_TIME_LIMIT_SECONDS);
    if (expired) {
      await dao.completeGame(gameId, false, 0);
      return res.status(200).json({
        gameId,
        validRoute: false,
        finalScore: 0,
        expired: true,
        reason: 'Planning time expired.',
        execution: []
      });
    }
    const routeSegments = await dao.getSegmentsByIds(route);
    const orderedSegments = orderSegmentsAccordingToRoute(route, routeSegments);
    if (orderedSegments.some((segment) => segment === undefined)) {
      return res.status(400).json({
        error: 'Route contains an unknown segment id'
      });
    }
    await dao.insertGameSegments(gameId, route);
    const validation = validateRoute(game, route, orderedSegments);
    if (!validation.valid) {
      await dao.completeGame(gameId, false, 0);
      return res.status(200).json({
        gameId,
        validRoute: false,
        finalScore: 0,
        expired,
        reason: validation.reason,
        execution: []
      });
    }
    let coins = INITIAL_COINS;
    const execution = [];
    for (let i = 0; i < orderedSegments.length; i++) {
      const segment = orderedSegments[i];
      const event = await dao.getRandomEvent();
      if (!event) {
        throw new Error('No events available in the database');
      }
      coins += event.cost;
      await dao.updateGameSegmentExecution(
        gameId,
        i + 1,
        event.id,
        coins
      );
      execution.push({
        stepNumber: i + 1,
        segment: {
          id: segment.id,
          station1: segment.station1.name,
          station2: segment.station2.name
        },
        event: {
          description: event.description,
          cost: event.cost
        },
        coinsAfterStep: coins
      });
    }
    const finalScore = Math.max(0, coins);
    await dao.completeGame(gameId, true, finalScore);
    return res.status(200).json({
      gameId,
      validRoute: true,
      finalScore,
      expired,
      execution
    });
  } catch (err) {
    console.error('Error submitting route:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});


// GET /api/ranking
app.get('/api/ranking', isLoggedIn, async (req, res) => {
  try {
    const ranking = await dao.getRanking();
    return res.status(200).json(ranking);
  } catch (err) {
    console.error('Error retrieving ranking:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// ========== ERROR HANDLING ==========
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  return res.status(500).json({ error: 'Internal server error' });
});

// ========== SERVER ACTIVATION ==========
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

