import { useEffect, useState } from 'react';
import { Alert, Badge, Card, Spinner, Table } from 'react-bootstrap';

import API from '../API/API.js';

function RankingPage({ setMessage }) {
  const [ranking, setRanking] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadRanking = async () => {
    setLoading(true);
    setError('');

    try {
      const rankingData = await API.getRanking();
      setRanking(rankingData);
    } catch (err) {
      setError('Unable to load the ranking.');
      setMessage?.({
        type: 'danger',
        text: 'Unable to load the ranking.'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRanking();
  }, []);

  if (loading) {
    return (
      <section className="page-card">
        <Spinner animation="border" size="sm" className="me-2" />
        Loading ranking...
      </section>
    );
  }

  return (
    <section className="page-card">
      <div className="d-flex justify-content-between align-items-start mb-4">
        <div>
          <p className="text-danger fw-bold text-uppercase small mb-1">
            General ranking
          </p>

          <h2 className="text-white fw-bold mb-2">
            Best players
          </h2>

          <p className="text-secondary mb-0">
            The ranking shows the best score achieved by each registered user.
          </p>
        </div>
      </div>
      {error && (
        <Alert variant="danger">
          {error}
        </Alert>
      )}
      {!error && ranking.length === 0 && (
        <Alert variant="secondary">
          No completed games yet.
        </Alert>
      )}
      {!error && ranking.length > 0 && (
        <Card className="bg-dark text-light border-secondary">
          <Card.Body>
            <Table striped bordered hover variant="dark" responsive className="mb-0">
              <thead>
                <tr>
                  <th>Position</th>
                  <th>User</th>
                  <th>Best score</th>
                </tr>
              </thead>
              <tbody>
                {ranking.map((entry, index) => (
                  <tr key={entry.userId}>
                    <td>
                      <Badge bg={index === 0 ? 'warning' : 'secondary'}>
                        #{index + 1}
                      </Badge>
                    </td>

                    <td>{entry.email}</td>

                    <td>
                      <strong>{entry.bestScore}</strong> coins
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      )}
    </section>
  );
}

export default RankingPage;