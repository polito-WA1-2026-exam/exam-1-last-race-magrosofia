function InstructionsPage() {
  return (
    <section className="page-card">
      <div className="page-heading">
        <p className="eyebrow">Public page</p>
        <h2>Game Instructions</h2>
        <p>
          Last Race is a single-player game where the player must plan a valid
          route through a metro network and reach the destination with the
          highest possible score.
        </p>
      </div>

      <div className="rules-grid">
        <article className="rule-box">
          <h3>1. Setup</h3>
          <p>
            The player sees the complete metro network, including stations,
            connections, and lines.
          </p>
        </article>

        <article className="rule-box">
          <h3>2. Planning</h3>
          <p>
            The player has 90 seconds to build a route from the assigned start
            station to the assigned destination station.
          </p>
        </article>

        <article className="rule-box">
          <h3>3. Execution</h3>
          <p>
            The submitted route is validated. If it is valid, random events are
            applied to each segment.
          </p>
        </article>

        <article className="rule-box">
          <h3>4. Result</h3>
          <p>
            The final score is shown. Invalid or incomplete routes receive a
            score of zero.
          </p>
        </article>
      </div>

      <div className="rules-section">
        <h3>Main rules</h3>

        <ul>
          <li>The route must start from the assigned starting station.</li>
          <li>The route must end at the assigned destination station.</li>
          <li>Each segment can be selected only once.</li>
          <li>Line changes are allowed only at interchange stations.</li>
          <li>Anonymous users can only read the instructions.</li>
        </ul>
      </div>
    </section>
  );
}

export default InstructionsPage;