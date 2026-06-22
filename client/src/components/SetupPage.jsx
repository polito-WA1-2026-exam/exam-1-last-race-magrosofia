import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { Alert, Button, Card, Spinner } from 'react-bootstrap';

import API from '../API/API.js';
import GameNetworkMap from './GameNetworkMap.jsx';

function SetupPage({ setMessage }) {
// network contains the metro data loaded from the server.
// loading, startingGame and error decide what the user sees while data is loading,
// a new game is being created, or something goes wrong.
  const [network, setNetwork] = useState(null);
  const [loading, setLoading] = useState(true);
  const [startingGame, setStartingGame] = useState(false);
  const [error, setError] = useState('');

// Used after game creation to move to the planning route without reloading the page.
  const navigate = useNavigate();

// Loads the full network when the setup page is opened.
  useEffect(() => {
  
    const loadNetwork = async () => {
      try {
        const networkData = await API.getNetwork();
        setNetwork(networkData);
      } catch (err) {
        setError('Unable to load the metro network.');
        setMessage?.({
          type: 'danger',
          text: 'Unable to load the metro network.'
        });
      } finally {
        setLoading(false);
      }
    };

    loadNetwork();

  }, [setMessage]);
  
  const handleStartGame = async () => {
    setStartingGame(true);
    setError('');
    try {
      const gameData = await API.startNewGame();
      navigate(`/game/${gameData.gameId}/planning`, {
        state: { gameData }
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
      <Card bg="dark" text="light" border="secondary" className="page-card">
        <Card.Body>
          <Spinner animation="border" size="sm" className="me-2" />
          Loading network...
        </Card.Body>
      </Card>
    );
  }
 return (
  <Card bg="dark" text="light" border="secondary" className="page-card">
    <Card.Body>
      <div className="d-flex justify-content-between align-items-start mb-4 gap-4">
        <div>
            <p className="text-danger fw-bold text-uppercase small mb-1">
            Setup phase
            </p>

            <Card.Title as="h2" className="text-white fw-bold mb-2">
            Study the full network
            </Card.Title>

            <Card.Text className="text-secondary mb-0">
            This is the only phase where lines and connections are visible.
            Once the game starts, the planning map will show only station names.
            </Card.Text>
        </div>

        <Button
            variant="danger"
            onClick={handleStartGame}
            disabled={startingGame || !network}
            className="flex-shrink-0"
        >
            {startingGame ? 'Starting...' : 'Start Planning'}
        </Button>
    </div>
      {error && (
        <Alert variant="danger">
          {error}
        </Alert>
      )}
      {network && (
        <>
          <GameNetworkMap
            stations={network.stations}
            segments={network.segments}
            showConnections={true}
          />
          <div className="d-flex flex-wrap gap-2 mt-3">
            {network.lines.map((line) => (
              <span
                key={line.id}
                className="badge bg-secondary d-inline-flex align-items-center gap-2 px-3 py-2"
              >
                <span
                  style={{
                    backgroundColor: line.color,
                    width: '34px',
                    height: '7px',
                    borderRadius: '999px',
                    display: 'inline-block'
                  }}
                />
                {line.name}
              </span>
            ))}
          </div>
        </>
      )}
    </Card.Body>
  </Card>
);
}
export default SetupPage;