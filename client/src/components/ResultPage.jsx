import { useLocation, useNavigate, useParams } from 'react-router';

function ResultPage() {
  const { gameId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const gameData = location.state?.gameData ?? null;
  const routeResult = location.state?.routeResult ?? null;
  const automaticSubmission = Boolean(location.state?.automaticSubmission);

  if (!routeResult || Number(gameId) !== routeResult.gameId) {
    return (
      <section className="page-card game-page">
        <div className="page-heading">
          <p className="eyebrow">Result phase</p>
          <h2>Result data not available</h2>
          <p>
            Complete a game first. Direct access to this route is not part of the
            normal game flow.
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

  const validRoute = routeResult.validRoute;
  const finalScore = routeResult.finalScore ?? 0;
  const executionSteps = routeResult.execution ?? [];

  return (
    <section className="page-card game-page result-page">
      <div className="result-header">
        <div>
          <p className="eyebrow">Result phase</p>
          <h2>Game completed</h2>

          <p>
            The game has ended. The final score is the number of coins remaining
            after the route execution. Negative values are stored as zero.
          </p>
        </div>

        <div className={validRoute ? 'final-score-box' : 'final-score-box failed'}>
          <span>Final score</span>
          <strong>{finalScore}</strong>
          <small>coins</small>
        </div>
      </div>

      {automaticSubmission && (
        <p className="game-warning">
          The route was submitted automatically because the planning timer ended.
        </p>
      )}

      <div className="result-summary-grid">
        <article className="result-summary-card">
          <span>Status</span>
          <strong className={validRoute ? 'result-valid' : 'result-invalid'}>
            {validRoute ? 'Valid route' : 'Invalid route'}
          </strong>
        </article>

        <article className="result-summary-card">
          <span>Start</span>
          <strong>{gameData?.startStation?.name ?? '-'}</strong>
        </article>

        <article className="result-summary-card">
          <span>Destination</span>
          <strong>{gameData?.destinationStation?.name ?? '-'}</strong>
        </article>

        <article className="result-summary-card">
          <span>Executed steps</span>
          <strong>{executionSteps.length}</strong>
        </article>
      </div>

      {!validRoute && (
        <div className="invalid-route-panel">
          <strong>Reason</strong>
          <p>
            {routeResult.reason || 'The submitted route was invalid or incomplete.'}
          </p>
        </div>
      )}

      {validRoute && executionSteps.length > 0 && (
        <div className="result-details-card">
          <h3>Journey summary</h3>

          <ol className="result-step-list">
            {executionSteps.map((step) => (
              <li key={step.stepNumber}>
                <span>
                  {step.segment.station1} → {step.segment.station2}
                </span>

                <strong>
                  {step.coinsAfterStep} coins
                </strong>
              </li>
            ))}
          </ol>
        </div>
      )}

      <div className="result-actions">
        <button
          type="button"
          className="primary-action"
          onClick={() => navigate('/setup')}
        >
          Start New Game
        </button>

        <button
          type="button"
          className="secondary-action"
          onClick={() => navigate('/ranking')}
        >
          View Ranking
        </button>
      </div>
    </section>
  );
}

export default ResultPage;