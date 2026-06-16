import { useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router';

const INITIAL_COINS = 20;

function formatCost(cost) {
  if (cost > 0) {
    return `+${cost}`;
  }

  return String(cost);
}

function ExecutionPage() {
  const { gameId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const gameData = location.state?.gameData ?? null;
  const routeResult = location.state?.routeResult ?? null;
  const automaticSubmission = Boolean(location.state?.automaticSubmission);

  const [visibleSteps, setVisibleSteps] = useState(0);

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

  if (!routeResult || Number(gameId) !== routeResult.gameId) {
    return (
      <section className="page-card game-page">
        <div className="page-heading">
          <p className="eyebrow">Execution phase</p>
          <h2>Execution data not available</h2>
          <p>
            Complete the planning phase first. Direct access to this route is not
            part of the normal game flow.
          </p>
        </div>

        <button
          type="button"
          className="primary-action"
          onClick={() => navigate('/setup')}
        >
          Start New Game
        </button>
      </section>
    );
  }

  if (!routeResult.validRoute) {
    return (
      <section className="page-card game-page">
        <div className="page-heading">
          <p className="eyebrow">Execution skipped</p>
          <h2>Invalid route</h2>
          <p>
            The route cannot be executed. The player loses all coins and obtains
            a final score of zero.
          </p>
        </div>

        {automaticSubmission && (
          <p className="game-warning">
            The route was submitted automatically because the planning timer ended.
          </p>
        )}

        <div className="invalid-route-panel">
          <strong>Reason</strong>
          <p>
            {routeResult.reason || 'The submitted route is invalid or incomplete.'}
          </p>
        </div>

        <button
          type="button"
          className="primary-action"
          onClick={goToResult}
        >
          View Result
        </button>
      </section>
    );
  }

  const allStepsVisible = visibleSteps >= executionSteps.length;

  return (
    <section className="page-card game-page execution-page">
      <div className="execution-header">
        <div>
          <p className="eyebrow">Execution phase</p>
          <h2>Travel step by step</h2>
          <p>
            The route has been validated. Reveal each segment to see the random
            event and the updated number of coins.
          </p>
        </div>

        <div className="coins-panel">
          <span>Coins</span>
          <strong>{currentCoins}</strong>
        </div>
      </div>

      {automaticSubmission && (
        <p className="game-warning">
          The route was submitted automatically because the planning timer ended.
        </p>
      )}

      <div className="execution-steps">
        {executionSteps.slice(0, visibleSteps).map((step) => (
          <article key={step.stepNumber} className="execution-step-card">
            <span className="step-number">Step {step.stepNumber}</span>

            <h3>
              {step.segment.station1} → {step.segment.station2}
            </h3>

            <p>{step.event.description}</p>

            <div className="step-footer">
              <span
                className={
                  step.event.cost >= 0
                    ? 'event-cost positive'
                    : 'event-cost negative'
                }
              >
                {formatCost(step.event.cost)} coins
              </span>

              <strong>{step.coinsAfterStep} coins left</strong>
            </div>
          </article>
        ))}
      </div>

      {visibleSteps === 0 && (
        <p className="empty-route">
          The journey is ready. Reveal the first segment to start the execution.
        </p>
      )}

      {!allStepsVisible ? (
        <button
          type="button"
          className="primary-action"
          onClick={() => setVisibleSteps((oldValue) => oldValue + 1)}
        >
          Reveal Next Step
        </button>
      ) : (
        <button
          type="button"
          className="primary-action"
          onClick={goToResult}
        >
          View Final Result
        </button>
      )}
    </section>
  );
}

export default ExecutionPage;