import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router';
import { Alert, Button, Card, Col, Row } from 'react-bootstrap';

import API from '../API/API.js';
import GameNetworkMap from './GameNetworkMap.jsx';

function formatSegment(segment) {
  return `${segment.station1.name} — ${segment.station2.name}`;
}

function computeRemainingSeconds(startedAt, timeLimit) {
  const start = new Date(startedAt).getTime();

  if (Number.isNaN(start)) {
    return timeLimit;
  }

  const elapsed = Math.floor((Date.now() - start) / 1000);
  return Math.max(0, timeLimit - elapsed);
}

function PlanningPage({ setMessage }) {
  const { gameId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const gameData = location.state?.gameData ?? null;

  const [selectedRoute, setSelectedRoute] = useState([]);
  const [remainingSeconds, setRemainingSeconds] = useState(() => (
    gameData ? computeRemainingSeconds(gameData.startedAt, gameData.timeLimit) : 0
  ));
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const routeRef = useRef(selectedRoute);
  const submittedRef = useRef(false);

  useEffect(() => {
    routeRef.current = selectedRoute;
  }, [selectedRoute]);

  const selectedSegments = useMemo(() => {
    if (!gameData) {
      return [];
    }

    const segmentsById = new Map(
      gameData.segments.map((segment) => [segment.id, segment])
    );

    return selectedRoute
      .map((segmentId) => segmentsById.get(segmentId))
      .filter(Boolean);
  }, [gameData, selectedRoute]);

  const submitRoute = async (routeToSubmit, automatic = false) => {
    if (!gameData || submittedRef.current) {
      return;
    }

    submittedRef.current = true;
    setSubmitting(true);
    setError('');

    try {
      const routeResult = await API.submitRoute(gameData.gameId, routeToSubmit);

      navigate(`/game/${gameData.gameId}/execution`, {
        state: {
          gameData,
          routeResult,
          submittedRoute: routeToSubmit,
          automaticSubmission: automatic
        }
      });
    } catch (err) {
      submittedRef.current = false;
      setSubmitting(false);
      setError('Unable to submit the selected route.');
      setMessage?.({
        type: 'danger',
        text: 'Unable to submit the selected route.'
      });
    }
  };

  useEffect(() => {
    if (!gameData) {
      return undefined;
    }

    const intervalId = setInterval(() => {
      const nextRemainingSeconds = computeRemainingSeconds(
        gameData.startedAt,
        gameData.timeLimit
      );

      setRemainingSeconds(nextRemainingSeconds);

      if (nextRemainingSeconds === 0 && !submittedRef.current) {
        submitRoute(routeRef.current, true);
      }
    }, 250);

    return () => clearInterval(intervalId);
  }, [gameData]);

  const handleAddSegment = (segmentId) => {
    setSelectedRoute((oldRoute) => {
      if (oldRoute.includes(segmentId)) {
        return oldRoute;
      }

      return [...oldRoute, segmentId];
    });
  };

  const handleUndo = () => {
    setSelectedRoute((oldRoute) => oldRoute.slice(0, -1));
  };

  const handleClear = () => {
    setSelectedRoute([]);
  };

  if (!gameData || Number(gameId) !== gameData.gameId) {
    return (
      <section className="page-card">
        <div className="mb-4">
            <p className="text-danger fw-bold text-uppercase small mb-1">
                Planning phase
            </p>

            <h2 className="text-white fw-bold mb-2">
                Game data not available
            </h2>

            <p className="text-secondary mb-0">
                Start a new game from the setup page. Direct access to this route is
                not part of the normal game flow.
            </p>
        </div>
        
        <Button
          variant="danger"
          onClick={() => navigate('/setup')}
        >
          Go to Setup
        </Button>
      </section>
    );
  }

  const selectedSet = new Set(selectedRoute);
  const timerVariant = remainingSeconds <= 10 ? 'danger' : 'secondary';

  return (
    <section className="page-card">
      <div className="d-flex justify-content-between align-items-start mb-4">
        <div>
          <p className="text-danger fw-bold text-uppercase small mb-1">
            Planning phase
          </p>

          <h2 className="text-white fw-bold mb-0">
            Build your route
          </h2>
        </div>

        <Alert variant={timerVariant} className="text-center mb-0 px-4 py-2">
          <strong className="fs-4 d-block">{remainingSeconds}</strong>
          <small>seconds</small>
        </Alert>
      </div>

      <Row className="g-3 mb-4">
        <Col>
          <Card className="bg-dark text-light border-secondary">
            <Card.Body>
              <small className="text-secondary">Start</small>
              <div className="fw-bold">{gameData.startStation.name}</div>
            </Card.Body>
          </Card>
        </Col>

        <Col>
          <Card className="bg-dark text-light border-secondary">
            <Card.Body>
              <small className="text-secondary">Destination</small>
              <div className="fw-bold">{gameData.destinationStation.name}</div>
            </Card.Body>
          </Card>
        </Col>

        <Col>
          <Card className="bg-dark text-light border-secondary">
            <Card.Body>
              <small className="text-secondary">Selected segments</small>
              <div className="fw-bold">{selectedRoute.length}</div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {error && (
        <Alert variant="danger">
          {error}
        </Alert>
      )}

      <Row className="g-4">
        <Col lg={8}>
          <GameNetworkMap
            stations={gameData.stations}
            segments={[]}
            showConnections={false}
            startStation={gameData.startStation}
            destinationStation={gameData.destinationStation}
          />

          <Card className="bg-dark text-light border-secondary mt-3">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h3 className="h5 mb-0">Selected route</h3>

                <div className="d-flex gap-2">
                  <Button
                    variant="outline-light"
                    size="sm"
                    onClick={handleUndo}
                    disabled={selectedRoute.length === 0 || submitting}
                  >
                    Undo last
                  </Button>

                  <Button
                    variant="outline-light"
                    size="sm"
                    onClick={handleClear}
                    disabled={selectedRoute.length === 0 || submitting}
                  >
                    Clear
                  </Button>
                </div>
              </div>

              {selectedSegments.length === 0 ? (
                <p className="empty-route">No segment selected yet.</p>
              ) : (
                <ol className="selected-route-list">
                  {selectedSegments.map((segment) => (
                    <li key={segment.id}>{formatSegment(segment)}</li>
                  ))}
                </ol>
              )}

              <Button
                variant="danger"
                className="mt-3"
                onClick={() => submitRoute(selectedRoute, false)}
                disabled={submitting}
              >
                {submitting ? 'Submitting...' : 'Submit Route'}
              </Button>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4}>
          <Card className="bg-dark text-light border-secondary">
            <Card.Body>
              <h3 className="h5">Available segments</h3>

              <p className="text-secondary">
                Select the pairs in the exact travel order. Each segment can be
                used only once.
              </p>

              <div className="segment-scroll">
                {gameData.segments.map((segment) => (
                  <Button
                    key={segment.id}
                    variant={selectedSet.has(segment.id) ? 'secondary' : 'outline-light'}
                    className="w-100 mb-2 text-start"
                    onClick={() => handleAddSegment(segment.id)}
                    disabled={selectedSet.has(segment.id) || submitting}
                  >
                    {formatSegment(segment)}
                  </Button>
                ))}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </section>
  );
}

export default PlanningPage;