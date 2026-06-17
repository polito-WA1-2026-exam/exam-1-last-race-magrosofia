import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Button, Col, Form, Row } from 'react-bootstrap';

function LoginPage({ handleLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    const success = await handleLogin({
        username: email,
        password: password
    });

    if (success) {
        navigate('/setup');
    }
    };

  return (
  <section
    className="page-card mx-auto text-light"
    style={{
      maxWidth: '760px',
      marginTop: '4rem'
    }}
  >
      <Row className="g-4 align-items-center">
        <Col md={5}>
          <h2 className="text-white fw-bold mb-3">
            Login
          </h2>

          <p className="text-secondary mb-0">
            Sign in to start a new race, save your score and compete in the
            general ranking.
          </p>
        </Col>

        <Col md={7}>

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="login-email">
              <Form.Label className="text-light fw-semibold">
                Email
              </Form.Label>

              <Form.Control
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-4" controlId="login-password">
              <Form.Label className="text-light fw-semibold">
                Password
              </Form.Label>

              <Form.Control
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
            </Form.Group>

            <Button
              type="submit"
              variant="danger"
              className="w-100 fw-bold"
            >
              Login
            </Button>
          </Form>
        </Col>
      </Row>
    </section>
  );
}

export default LoginPage;