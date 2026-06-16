import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

import API from '../API/API.js';
import GameNetworkMap from './GameNetworkMap.jsx';

function SetupPage({ setMessage }) {
  const [network, setNetwork] = useState(null);
  const [loading, setLoading] = useState(true);
  const [startingGame, setStartingGame] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    let ignore = false;

    const loadNetwork = async () => {
      setLoading(true);
      setError('');

      try {
        const networkData = await API.getNetwork();

        if (!ignore) {
          setNetwork(networkData);
        }
      } catch (err) {
        if (!ignore) {
          setError('Unable to load the metro network.');
          setMessage?.({
            type: 'danger',
            text: 'Unable to load the metro network.'
          });
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    loadNetwork();

    return () => {
      ignore = true;
    };
  }, [setMessage]);

  const handleStartGame = async () => {
    setStartingGame(true);
    setError('');

    try {
      const gameData = await API.startNewGame();

      navigate(`/game/${gameData.gameId}/planning`, {
        state: {
          gameData
        }
      });
    } catch (err) {
      setError('Unable to start a new game.');
      setMessage?.({
        type: 'danger',
        text: 'Unable to start a new game.'
      });
      setStartingGame(false);
    }
  };

  if (loading) {
    return (
      <section className="page-card">
        <p className="eyebrow">Setup</p>
        <h2>Loading network...</h2>
      </section>
    );
  }

  return (
    <section className="page-card game-page">
      <div className="page-heading game-heading-row">
        <div>
          <p className="eyebrow">Setup phase</p>
          <h2>Study the full network</h2>
          <p>
            This is the only phase where lines and connections are visible.
            Once the game starts, the planning map will show only station names.
          </p>
        </div>

        <button
          type="button"
          className="primary-action"
          onClick={handleStartGame}
          disabled={startingGame || !network}
        >
          {startingGame ? 'Starting...' : 'Start Planning'}
        </button>
      </div>

      {error && <p className="game-error">{error}</p>}

      {network && (
        <>
          <GameNetworkMap
            stations={network.stations}
            segments={network.segments}
            showConnections={true}
          />

          <div className="line-legend">
            {network.lines.map((line) => (
              <span key={line.id} className="line-legend-item">
                <span
                  className="line-legend-color"
                  style={{ backgroundColor: line.color }}
                ></span>
                {line.name}
              </span>
            ))}
          </div>
        </>
      )}
    </section>
  );
}

export default SetupPage;