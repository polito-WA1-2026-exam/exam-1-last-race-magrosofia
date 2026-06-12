import sqlite from 'sqlite3';
import crypto from 'crypto';

// Open the database
const db = new sqlite.Database('db.sqlite', (err) => {
  if (err) throw err;
});

// ========== USER FUNCTIONS ==========
//For login purpose
const getUser = (email, password) => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT id, email, password_hash, salt
      FROM users
      WHERE email = ?
    `;
    db.get(sql, [email], (err, row) => {
        //case 1: error
      if (err) {
        reject(err);
        //case 2: user not registered yet
      } else if (row === undefined) {
        resolve(false);
      } else {
        //case 3: user registered
        const user = {
          id: row.id,
          email: row.email
        };
        crypto.scrypt(password, row.salt, 32, (err, hashedPassword) => {
          if (err) {
            reject(err);
            return;
          }
          const storedHash = Buffer.from(row.password_hash, 'hex');
          //check if both hash are the same
          if (
            storedHash.length !== hashedPassword.length ||
            !crypto.timingSafeEqual(storedHash, hashedPassword)
          ) {
            resolve(false);
          } else {
            resolve(user);
          }
        });
      }
    });
  });
};

// ========== NETWORK FUNCTIONS ==========
//Retrieves all stations
const getStations = () => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT id, name, is_interchange
      FROM stations
      ORDER BY name
    `;

    db.all(sql, [], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows.map((s) => ({
          id: s.id,
          name: s.name,
          isInterchange: s.is_interchange === 1
        })));
      }
    });
  });
};

//Retrieves all metro lines
const getLines = () => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT id, name, color
      FROM lines
      ORDER BY id
    `;

    db.all(sql, [], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows.map((l) => ({
          id: l.id,
          name: l.name,
          color: l.color
        })));
      }
    });
  });
};

//Retrieves the whole network, in particular:
//Retrieve all segments with the names of their two endpoint stations
//and the metro line they belong to, to build the full network map.
const getFullNetwork = () => {
  return new Promise((resolve, reject) => {
    //executes in parallel both getStations() and getLines()
    Promise.all([getStations(), getLines()])
      .then(([stations, lines]) => {
        const sql = `
          SELECT
            seg.id AS segment_id,

            s1.id AS station1_id,
            s1.name AS station1_name,

            s2.id AS station2_id,
            s2.name AS station2_name,

            l.id AS line_id,
            l.name AS line_name,
            l.color AS line_color

          FROM segments seg
          JOIN stations s1 ON seg.station1 = s1.id
          JOIN stations s2 ON seg.station2 = s2.id
          JOIN lines l ON seg.line = l.id
          ORDER BY seg.id
        `;

        db.all(sql, [], (err, rows) => {
          if (err) {
            reject(err);
          } else {
            const segments = rows.map((r) => ({
              id: r.segment_id,
              station1: {
                id: r.station1_id,
                name: r.station1_name
              },
              station2: {
                id: r.station2_id,
                name: r.station2_name
              },
              line: {
                id: r.line_id,
                name: r.line_name,
                color: r.line_color
              }
            }));
            resolve({
              stations,
              lines,
              segments
            });
          }
        });
      })
      .catch((err) => reject(err));
  });
};

// Used in the planning phase:
// It does not expose line information to the client but only the stations 
// and the list of the segments.
const getPlanningNetwork = () => {
  return new Promise((resolve, reject) => {
    const stationsSql = `
      SELECT id, name
      FROM stations
      ORDER BY name
    `;

    const segmentsSql = `
      SELECT
        seg.id AS segment_id,

        s1.id AS station1_id,
        s1.name AS station1_name,

        s2.id AS station2_id,
        s2.name AS station2_name

      FROM segments seg
      JOIN stations s1 ON seg.station1 = s1.id
      JOIN stations s2 ON seg.station2 = s2.id
      ORDER BY seg.id
    `;
    db.all(stationsSql, [], (err, stationRows) => {
      if (err) {
        reject(err);
        return;
      }
      db.all(segmentsSql, [], (err, segmentRows) => {
        if (err) {
          reject(err);
          return;
        }
        const stations = stationRows.map((s) => ({
          id: s.id,
          name: s.name
        }));
        const segments = segmentRows.map((r) => ({
          id: r.segment_id,
          station1: {
            id: r.station1_id,
            name: r.station1_name
          },
          station2: {
            id: r.station2_id,
            name: r.station2_name
          }
        }));
        resolve({
          stations,
          segments
        });
      });
    });
  });
};

// Helper function useful to retrieve "raw" segments (the id of a pair of stations).
const getRawSegments = () => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT id, station1, station2, line
      FROM segments
    `;
    db.all(sql, [], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows.map((s) => ({
          id: s.id,
          station1: s.station1,
          station2: s.station2,
          line: s.line
        })));
      }
    });
  });
};

//Function used when the user submits the route. 
const getSegmentsByIds = (segmentIds) => {
  return new Promise((resolve, reject) => {
    //case 1: empty route
    if (!Array.isArray(segmentIds) || segmentIds.length === 0) {
      resolve([]);
      return;
    }
    //used because the number of segments is not always the same.
    const placeholders = segmentIds.map(() => '?').join(',');
    const sql = `
      SELECT
        seg.id AS segment_id,
        seg.line AS line,

        s1.id AS station1_id,
        s1.name AS station1_name,
        s1.is_interchange AS station1_is_interchange,

        s2.id AS station2_id,
        s2.name AS station2_name,
        s2.is_interchange AS station2_is_interchange

      FROM segments seg
      JOIN stations s1 ON seg.station1 = s1.id
      JOIN stations s2 ON seg.station2 = s2.id
      WHERE seg.id IN (${placeholders})
    `;
    db.all(sql, segmentIds, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows.map((r) => ({
          id: r.segment_id,
          line: r.line,
          station1: {
            id: r.station1_id,
            name: r.station1_name,
            isInterchange: r.station1_is_interchange === 1
          },
          station2: {
            id: r.station2_id,
            name: r.station2_name,
            isInterchange: r.station2_is_interchange === 1
          }
        })));
      }
    });
  });
};

// ========== GAME FUNCTIONS ==========
//Start a new game.
const createGame = (userId, startStation, destinationStation) => {
  return new Promise((resolve, reject) => {
    //Creates the timestamp of the start of the game
    const startedAt = new Date().toISOString();
    const sql = `
      INSERT INTO games (
        user_id,
        start_station,
        destination_station,
        started_at,
        completed_at,
        valid_route,
        final_coins
      )
      VALUES (?, ?, ?, ?, NULL, NULL, NULL)
    `;

    db.run(sql, [userId, startStation, destinationStation, startedAt], function (err) {
      if (err) {
        reject(err);
      } else {
        resolve({
          gameId: this.lastID,
          userId,
          startStation,
          destinationStation,
          startedAt
        });
      }
    });
  });
};

// Retrieve a game by its id to check ownership, completion status,
// and the assigned start and destination stations before processing the route.
const getGameById = (gameId) => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT
        id,
        user_id,
        start_station,
        destination_station,
        started_at,
        completed_at,
        valid_route,
        final_coins
      FROM games
      WHERE id = ?
    `;

    db.get(sql, [gameId], (err, row) => {
        //case 1: error of the db
      if (err) {
        reject(err);
        //case 2: no games in the db with gameId
      } else if (row === undefined) {
        resolve(null);
      } else {
        //case 3: game found int he db
        resolve({
          id: row.id,
          userId: row.user_id,
          startStation: row.start_station,
          destinationStation: row.destination_station,
          startedAt: row.started_at,
          completedAt: row.completed_at,
          validRoute: row.valid_route === null ? null : row.valid_route === 1,
          finalCoins: row.final_coins
        });
      }
    });
  });
};

// Saves the whole route submitted by the user inside the table game_segments
const insertGameSegments = (gameId, route) => {
  return new Promise((resolve, reject) => {
    const sql = `
      INSERT INTO game_segments (
        game_id,
        step_number,
        segment_id,
        event_id,
        actual_coins
      )
      VALUES (?, ?, ?, NULL, NULL)
    `;
    db.serialize(() => {
      db.run('BEGIN TRANSACTION', (err) => {
        if (err) {
          reject(err);
          return;
        }
        const insertNext = (index) => {
          if (index === route.length) {
            db.run('COMMIT', (err) => {
              if (err) {
                reject(err);
              } else {
                resolve(true);
              }
            });
            return;
          }
          db.run(sql, [gameId, index + 1, route[index]], function (err) {
            if (err) {
              db.run('ROLLBACK', () => reject(err));
              return;
            }
            insertNext(index + 1);
          });
        };
        insertNext(0);
      });
    });
  });
};

//Pick a random event among the possible ones inside the table events
const getRandomEvent = () => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT id, description, cost
      FROM events
      ORDER BY RANDOM()
      LIMIT 1
    `;
    db.get(sql, [], (err, row) => {
      if (err) {
        reject(err);
      } else if (row === undefined) {
        resolve(null);
      } else {
        resolve({
          id: row.id,
          description: row.description,
          cost: row.cost
        });
      }
    });
  });
};

//Used during the execution phase: it applies the event and its cost to the segment
const updateGameSegmentExecution = (gameId, stepNumber, eventId, actualCoins) => {
  return new Promise((resolve, reject) => {
    const sql = `
      UPDATE game_segments
      SET event_id = ?,
          actual_coins = ?
      WHERE game_id = ?
        AND step_number = ?
    `;
    db.run(sql, [eventId, actualCoins, gameId, stepNumber], function (err) {
      if (err) {
        reject(err);
      } else {
        resolve(this.changes > 0);
      }
    });
  });
};

//Set the end time of the game and upload the final parameters
const completeGame = (gameId, validRoute, finalCoins) => {
  return new Promise((resolve, reject) => {
    const completedAt = new Date().toISOString();
    const sql = `
      UPDATE games
      SET valid_route = ?,
          final_coins = ?,
          completed_at = ?
      WHERE id = ?
    `;
    db.run(sql, [validRoute ? 1 : 0, finalCoins, completedAt, gameId], function (err) {
      if (err) {
        reject(err);
      } else {
        resolve({
          success: this.changes > 0,
          completedAt
        });
      }
    });
  });
};

// ========== RANKING FUNCTIONS ==========
//Retrieves a rank of the best score of all saved games
const getRanking = () => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT
        u.id AS user_id,
        u.email AS email,
        MAX(g.final_coins) AS best_score
      FROM users u
      JOIN games g ON g.user_id = u.id
      WHERE g.completed_at IS NOT NULL
      GROUP BY u.id, u.email
      ORDER BY best_score DESC, u.email ASC
    `;
    db.all(sql, [], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows.map((r) => ({
          userId: r.user_id,
          email: r.email,
          bestScore: r.best_score
        })));
      }
    });
  });
};

const DAO = {
  getUser,

  getStations,
  getLines,
  getFullNetwork,
  getPlanningNetwork,
  getRawSegments,
  getSegmentsByIds,

  createGame,
  getGameById,
  insertGameSegments,
  getRandomEvent,
  updateGameSegmentExecution,
  completeGame,

  getRanking
};

export default DAO;

