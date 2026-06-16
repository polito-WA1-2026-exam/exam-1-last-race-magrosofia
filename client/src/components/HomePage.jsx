import { useNavigate } from 'react-router';
import HeroMetroMap from './MetroMap';

const HomePage = (props) => {
  const navigate = useNavigate();

  return (
    <section className="home-page">
      <div className="hero-card">
        <HeroMetroMap />

        <div className="hero-content">
          <div className="metro-lines">
            <span className="line red"></span>
            <span className="line blue"></span>
            <span className="line green"></span>
            <span className="line yellow"></span>
          </div>

          <p className="eyebrow">Last Race - Turin Edition</p>

          <h2>Find the route before time runs out.</h2>

          <p className="hero-text">
            Explore the metro network, plan a valid path from your starting
            station to your destination, and try to finish the journey with as
            many coins as possible.
          </p>

          <div className="hero-actions">
            <button
              type="button"
              className="primary-action"
              onClick={() => navigate('/instructions')}
            >
              Read Instructions
            </button>

            {!props.user ? (
              <button
                type="button"
                className="secondary-action"
                onClick={() => navigate('/login')}
              >
                Login to Play
              </button>
            ) : (
              <button
                type="button"
                className="secondary-action"
                onClick={() => navigate('/setup')}
              >
                Start New Game
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="home-grid">
        <article className="info-card">
          <h3>Plan</h3>
          <p>
            Study the stations and select the segments of your route in the
            correct order before the 90-second timer expires.
          </p>
        </article>

        <article className="info-card">
          <h3>Travel</h3>
          <p>
            If your route is valid, the journey is executed step by step. Each
            segment may trigger a random event.
          </p>
        </article>

        <article className="info-card">
          <h3>Score</h3>
          <p>
            The final score is based on the coins left at the end of the game.
            Registered users appear in the ranking with their best result.
          </p>
        </article>
      </div>
    </section>
  );
};

export default HomePage;