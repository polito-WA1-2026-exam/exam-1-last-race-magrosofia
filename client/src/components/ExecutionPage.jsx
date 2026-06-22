import { useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router';
import { Alert, Badge, Button, Card, Col, ListGroup, Row } from 'react-bootstrap';

const INITIAL_COINS = 20;

function formatCost(cost) {
  if (cost > 0) {
    return `+${cost}`;
  }

  return String(cost);
}

function ExecutionPage() {
// gameId comes from the URL.
// location.state contains the route result passed by PlanningPage.
// navigate is used to move to the result page or back to setup.
  const { gameId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

// Data passed by the planning phase.
  const gameData = location.state?.gameData ?? null;
  const routeResult = location.state?.routeResult ?? null;
  const automaticSubmission = Boolean(location.state?.automaticSubmission);

// Controls how many server-generated execution steps are currently visible.
  const [visibleSteps, setVisibleSteps] = useState(0);

// Execution steps returned by the server, one for each selected segment.
  const executionSteps = routeResult?.execution ?? [];

  const currentCoins = useMemo(() => {
    if (!routeResult?.validRoute || visibleSteps === 0) {
      return INITIAL_COINS;
    }

    return executionSteps[visibleSteps - 1]?.coinsAfterStep ?? INITIAL_COINS;
  }, [executionSteps, routeResult, visibleSteps]);

  const goToResult = () => {
    navigate(`/game/${routeResult.gameId}/result`, {
      state: {
        gameData,
        routeResult,
        automaticSubmission
      }
    });
  };

// Fallback for direct access or page refresh.
  if (!routeResult || Number(gameId) !== routeResult.gameId) {
    return (
      <section className="page-card">
        <div className="mb-4">
            <p className="text-danger fw-bold text-uppercase small mb-1">
                Execution phase
            </p>
            <h2 className="text-white fw-bold mb-2">
                Execution data not available
            </h2>
            <p className="text-secondary mb-0">
                Complete the planning phase first. Direct access to this route is not
                part of the normal game flow.
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

// If the server marked the route as invalid, execution is skipped
// and the final score is zero.
  if (!routeResult.validRoute) {
    return (
      <section className="page-card">
        <p className="text-danger fw-bold text-uppercase small mb-1">
          Execution skipped
        </p>

        <h2 className="text-white fw-bold">
          Invalid route
        </h2>

        <p className="text-secondary">
          The route cannot be executed. The player loses all coins and obtains
          a final score of zero.
        </p>

        {automaticSubmission && (
          <Alert variant="warning">
            The route was submitted automatically because the planning timer ended.
          </Alert>
        )}

        <Alert variant="danger">
          <strong>Reason: </strong>
          {routeResult.reason || 'The submitted route is invalid or incomplete.'}
        </Alert>

        <Button
          variant="danger"
          onClick={goToResult}
        >
          View Result
        </Button>
      </section>
    );
  }

// Checks whether all execution steps have already been revealed.
  const allStepsVisible = visibleSteps >= executionSteps.length;

  return (
    <section className="page-card">
      <div className="d-flex justify-content-between align-items-start mb-4">
        <div>
          <p className="text-danger fw-bold text-uppercase small mb-1">
            Execution phase
          </p>

          <h2 className="text-white fw-bold mb-2">
            Travel step by step
          </h2>

          <p className="text-secondary mb-0">
            The route has been validated. Reveal each segment to see the random
            event and the updated number of coins.
          </p>
        </div>

        <Card className="bg-dark text-light border-secondary text-center">
          <Card.Body className="px-4 py-3">
            <small className="text-secondary text-uppercase fw-bold">
              Coins
            </small>

            <div className="fs-2 fw-bold">
              {currentCoins}
            </div>
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
              <small className="text-secondary">Visible steps</small>
              <div className="fw-bold">
                {visibleSteps} / {executionSteps.length}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {visibleSteps === 0 && (
        <Alert variant="secondary">
          The journey is ready. Reveal the first segment to start the execution.
        </Alert>
      )}

      {visibleSteps > 0 && (
        <ListGroup className="mb-4">
          {executionSteps.slice(0, visibleSteps).map((step) => (
            <ListGroup.Item
              key={step.stepNumber}
              className="bg-dark text-light border-secondary"
            >
              <div className="d-flex justify-content-between align-items-start gap-3">
                <div>
                  <Badge bg="secondary" className="mb-2">
                    Step {step.stepNumber}
                  </Badge>

                  <h3 className="h5 mb-2">
                    {step.segment.station1} → {step.segment.station2}
                  </h3>

                  <p className="text-secondary mb-0">
                    {step.event.description}
                  </p>
                </div>

                <div className="text-end">
                  <Badge
                    bg={step.event.cost >= 0 ? 'success' : 'danger'}
                    className="mb-2"
                  >
                    {formatCost(step.event.cost)} coins
                  </Badge>

                  <div className="fw-bold">
                    {step.coinsAfterStep} coins left
                  </div>
                </div>
              </div>
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}

      {!allStepsVisible ? (
        <Button
          variant="danger"
          onClick={() => setVisibleSteps((oldValue) => oldValue + 1)}
        >
          Reveal Next Step
        </Button>
      ) : (
        <Button
          variant="danger"
          onClick={goToResult}
        >
          View Final Result
        </Button>
      )}
    </section>
  );
}

export default ExecutionPage;