import { useNavigate } from 'react-router';
import { Button, Card, Col, Row } from 'react-bootstrap';

import HeroMetroMap from './MetroMap';

const HomePage = (props) => {
  const navigate = useNavigate();

  return (
    <section className="d-flex flex-column gap-4">
      <div className="hero-card">
        <HeroMetroMap />

        <div className="hero-content">
          <div className="metro-lines">
            <span className="line red"></span>
            <span className="line blue"></span>
            <span className="line green"></span>
            <span className="line yellow"></span>
          </div>

          <h2>Find the route before time runs out.</h2>

          <p className="hero-text">
            Explore the metro network, plan a valid path from your starting
            station to your destination, and try to finish the journey with as
            many coins as possible.
          </p>

          <div className="d-flex gap-3 flex-wrap">
            <Button
              variant="danger"
              onClick={() => navigate('/instructions')}
            >
              Read Instructions
            </Button>

            {!props.user ? (
              <Button
                variant="outline-light"
                onClick={() => navigate('/login')}
              >
                Login to Play
              </Button>
            ) : (
              <Button
                variant="outline-light"
                onClick={() => navigate('/setup')}
              >
                Start New Game
              </Button>
            )}
          </div>
        </div>
      </div>

      <Row className="g-3">
        <Col md={4}>
          <Card className="bg-dark text-light border-secondary h-100">
            <Card.Body>
              <Card.Title as="h3" className="h5">
                Plan
              </Card.Title>

              <Card.Text className="text-secondary">
                Study the stations and select the segments of your route in the
                correct order before the 90-second timer expires.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="bg-dark text-light border-secondary h-100">
            <Card.Body>
              <Card.Title as="h3" className="h5">
                Travel
              </Card.Title>

              <Card.Text className="text-secondary">
                If your route is valid, the journey is executed step by step.
                Each segment may trigger a random event.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="bg-dark text-light border-secondary h-100">
            <Card.Body>
              <Card.Title as="h3" className="h5">
                Score
              </Card.Title>

              <Card.Text className="text-secondary">
                The final score is based on the coins left at the end of the
                game. Registered users appear in the ranking with their best
                result.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </section>
  );
};

export default HomePage;