function InstructionsPage() {
  return (
    <section className="page-card">
      <div className="page-heading">
        <p className="eyebrow">Public page</p>
        <h2>Game Instructions</h2>
        <p>
          Last Race is a single-player game where the player must plan and
          execute a valid route through a metro network, reaching the assigned
          destination with the highest possible score.
        </p>
      </div>

      <div className="rules-grid">
        <article className="rule-box">
          <h3>1. Setup</h3>
          <p>
            The player sees the complete metro network, including all stations,
            connections, and metro lines. This phase is used to study the map
            before starting the game.
          </p>
        </article>

        <article className="rule-box">
          <h3>2. Planning</h3>
          <p>
            The player receives a random starting station and a random
            destination station. During this phase, the map shows only the
            station names, without the connecting lines.
          </p>
        </article>

        <article className="rule-box">
          <h3>3. Execution</h3>
          <p>
            The submitted route is validated by the application. If it is valid,
            the journey is executed step by step and a random event is applied
            to each segment.
          </p>
        </article>

        <article className="rule-box">
          <h3>4. Result</h3>
          <p>
            The final score corresponds to the coins left at the end of the
            game. Invalid or incomplete routes receive a final score of zero.
          </p>
        </article>
      </div>

      <div className="rules-section">
        <h3>Main rules</h3>

        <ul>
          <li>The game starts with 20 coins.</li>
          <li>The route must start from the assigned starting station.</li>
          <li>The route must end at the assigned destination station.</li>
          <li>
            The player has 90 seconds to select the route segments in sequence.
          </li>
          <li>
            If time runs out, the route built so far is submitted automatically.
          </li>
          <li>Each segment can be selected only once.</li>
          <li>
            The same station may be visited more than once, if the route remains
            valid.
          </li>
          <li>Line changes are allowed only at interchange stations.</li>
          <li>
            During execution, each segment may trigger a positive, negative, or
            neutral event.
          </li>
          <li>
            If the final amount of coins is negative, the stored score is zero.
          </li>
          <li>Anonymous users can only read the instructions.</li>
          <li>
            Registered users can play multiple games and appear in the ranking
            with their best result.
          </li>
        </ul>
      </div>
    </section>
  );
}

export default InstructionsPage;