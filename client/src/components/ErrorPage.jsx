import { Button, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router';

function ErrorPage() {
  const navigate = useNavigate();

  return (
    <section className="page-card text-center">
      <Card.Body>
        <h1 className="text-white fw-bold">
          Page not found
        </h1>

        <p className="text-secondary">
          The requested page does not exist.
        </p>

        <Button
          variant="danger"
          onClick={() => navigate('/')}
        >
          Back to Home
        </Button>
      </Card.Body>
    </section>
  );
}

export default ErrorPage;