import { useEffect, useState } from 'react';
import { Alert, Button, Card, Spinner, Table } from 'react-bootstrap';

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
      <Card bg="dark" text="light" border="secondary">
        <Card.Body>
          <Spinner animation="border" size="sm" className="me-2" />
          Loading ranking...
        </Card.Body>
      </Card>
    );
  }

  return (
    <Card bg="dark" text="light" border="secondary">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-start mb-4">
          <div>
            <p className="eyebrow">General ranking</p>
            <Card.Title as="h2">Best players</Card.Title>
            <Card.Text className="text-secondary">
              The ranking shows the best score achieved by each registered user.
            </Card.Text>
          </div>

          <Button variant="outline-light" onClick={loadRanking}>
            Refresh
          </Button>
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
          <Table striped bordered hover variant="dark" responsive>
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
                  <td>#{index + 1}</td>
                  <td>{entry.email}</td>
                  <td>
                    <strong>{entry.bestScore}</strong> coins
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card.Body>
    </Card>
  );
}

export default RankingPage;