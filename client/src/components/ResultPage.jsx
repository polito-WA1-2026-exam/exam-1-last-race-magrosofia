import { useLocation, useNavigate, useParams } from 'react-router';
import { Alert, Badge, Button, Card, Col, ListGroup, Row } from 'react-bootstrap';

function ResultPage() {
  const { gameId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const gameData = location.state?.gameData ?? null;
  const routeResult = location.state?.routeResult ?? null;
  const automaticSubmission = Boolean(location.state?.automaticSubmission);

  if (!routeResult || Number(gameId) !== routeResult.gameId) {
    return (
      <section className="page-card">
        <div className="mb-4">
            <p className="text-danger fw-bold text-uppercase small mb-1">
                Result phase
            </p>

            <h2 className="text-white fw-bold mb-2">
                Result data not available
            </h2>

            <p className="text-secondary mb-0">
                Complete a game first. Direct access to this route is not part of the
                normal game flow.
            </p>
        </div>

        <Button
          variant="danger"
          onClick={() => navigate('/setup')}
        >
          Start New Game
        </Button>
      </section>
    );
  }

  const validRoute = routeResult.validRoute;
  const finalScore = routeResult.finalScore ?? 0;
  const executionSteps = routeResult.execution ?? [];

  return (
    <section className="page-card">
      <div className="d-flex justify-content-between align-items-start mb-4">
        <div>
          <p className="text-danger fw-bold text-uppercase small mb-1">
            Result phase
          </p>

          <h2 className="text-white fw-bold mb-2">
            Game completed
          </h2>

          <p className="text-secondary mb-0">
            The final score is the number of coins remaining after the route
            execution. Negative values are stored as zero.
          </p>
        </div>

        <Card className="bg-dark text-light border-secondary text-center">
          <Card.Body className="px-4 py-3">
            <small className="text-secondary text-uppercase fw-bold">
              Final score
            </small>

            <div className="fs-1 fw-bold">
              {finalScore}
            </div>

            <small className="text-secondary">
              coins
            </small>
          </Card.Body>
        </Card>
      </div>

      {automaticSubmission && (
        <Alert variant="warning">
          The route was submitted automatically because the planning timer ended.
        </Alert>
      )}

      <Row className="g-3 mb-4">
        <Col>
          <Card className="bg-dark text-light border-secondary">
            <Card.Body>
              <small className="text-secondary">Status</small>

              <div>
                <Badge bg={validRoute ? 'success' : 'danger'}>
                  {validRoute ? 'Valid route' : 'Invalid route'}
                </Badge>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col>
          <Card className="bg-dark text-light border-secondary">
            <Card.Body>
              <small className="text-secondary">Start</small>
              <div className="fw-bold">
                {gameData?.startStation?.name ?? '-'}
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col>
          <Card className="bg-dark text-light border-secondary">
            <Card.Body>
              <small className="text-secondary">Destination</small>
              <div className="fw-bold">
                {gameData?.destinationStation?.name ?? '-'}
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col>
          <Card className="bg-dark text-light border-secondary">
            <Card.Body>
              <small className="text-secondary">Executed steps</small>
              <div className="fw-bold">
                {executionSteps.length}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {!validRoute && (
        <Alert variant="danger">
          <strong>Reason: </strong>
          {routeResult.reason || 'The submitted route was invalid or incomplete.'}
        </Alert>
      )}

      {validRoute && executionSteps.length > 0 && (
        <Card className="bg-dark text-light border-secondary mb-4">
          <Card.Body>
            <Card.Title as="h3" className="h5 mb-3">
              Journey summary
            </Card.Title>

            <ListGroup variant="flush">
              {executionSteps.map((step) => (
                <ListGroup.Item
                  key={step.stepNumber}
                  className="bg-transparent text-light border-secondary d-flex justify-content-between"
                >
                  <span>
                    {step.stepNumber}. {step.segment.station1} → {step.segment.station2}
                  </span>

                  <strong>
                    {step.coinsAfterStep} coins
                  </strong>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Card.Body>
        </Card>
      )}

      <div className="d-flex gap-2">
        <Button
          variant="danger"
          onClick={() => navigate('/setup')}
        >
          Start New Game
        </Button>

        <Button
          variant="outline-light"
          onClick={() => navigate('/ranking')}
        >
          View Ranking
        </Button>
      </div>
    </section>
  );
}

export default ResultPage;