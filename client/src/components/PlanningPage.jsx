import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router';

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
      <section className="page-card game-page">
        <div className="page-heading">
          <p className="eyebrow">Planning phase</p>
          <h2>Game data not available</h2>
          <p>
            Start a new game from the setup page. Direct access to this route is
            not part of the normal game flow.
          </p>
        </div>

        <button
          type="button"
          className="primary-action"
          onClick={() => navigate('/setup')}
        >
          Go to Setup
        </button>
      </section>
    );
  }

  const selectedSet = new Set(selectedRoute);
  const timerClassName = remainingSeconds <= 10 ? 'timer-box danger' : 'timer-box';

  return (
    <section className="page-card game-page planning-page">
      <div className="planning-topbar">
        <div>
          <p className="eyebrow">Planning phase</p>
          <h2>Build your route</h2>
        </div>

        <div className={timerClassName}>
          <span>{remainingSeconds}</span>
          seconds
        </div>
      </div>

      <div className="mission-panel">
        <div>
          <span className="mission-label">Start</span>
          <strong>{gameData.startStation.name}</strong>
        </div>

        <div>
          <span className="mission-label">Destination</span>
          <strong>{gameData.destinationStation.name}</strong>
        </div>

        <div>
          <span className="mission-label">Selected segments</span>
          <strong>{selectedRoute.length}</strong>
        </div>
      </div>

      {error && <p className="game-error">{error}</p>}

      <div className="planning-layout">
        <div>
          <GameNetworkMap
            stations={gameData.stations}
            segments={[]}
            showConnections={false}
            startStation={gameData.startStation}
            destinationStation={gameData.destinationStation}
          />

          <div className="route-builder-card">
            <div className="route-builder-header">
              <h3>Selected route</h3>

              <div className="route-actions">
                <button
                  type="button"
                  className="secondary-small-action"
                  onClick={handleUndo}
                  disabled={selectedRoute.length === 0 || submitting}
                >
                  Undo last
                </button>

                <button
                  type="button"
                  className="secondary-small-action"
                  onClick={handleClear}
                  disabled={selectedRoute.length === 0 || submitting}
                >
                  Clear
                </button>
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

            <button
              type="button"
              className="primary-action submit-route-button"
              onClick={() => submitRoute(selectedRoute, false)}
              disabled={submitting}
            >
              {submitting ? 'Submitting...' : 'Submit Route'}
            </button>
          </div>
        </div>

        <aside className="segment-picker-card">
          <h3>Available segments</h3>
          <p>
            Select the pairs in the exact travel order. Each segment can be used
            only once.
          </p>

          <div className="segment-list">
            {gameData.segments.map((segment) => (
              <button
                key={segment.id}
                type="button"
                className={
                  selectedSet.has(segment.id)
                    ? 'segment-button selected'
                    : 'segment-button'
                }
                onClick={() => handleAddSegment(segment.id)}
                disabled={selectedSet.has(segment.id) || submitting}
              >
                <span>{formatSegment(segment)}</span>
                {selectedSet.has(segment.id) && <strong>Selected</strong>}
              </button>
            ))}
          </div>
        </aside>
      </div>
    </section>
  );
}

export default PlanningPage;