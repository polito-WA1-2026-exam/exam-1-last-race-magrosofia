import { Badge, Card, Col, Row } from 'react-bootstrap';

function InstructionsPage() {
  const phases = [
    {
      title: 'Setup',
      text: 'Study the complete metro network with all stations, connections and lines.'
    },
    {
      title: 'Planning',
      text: 'Build the route by selecting the segments in sequence before the timer expires.'
    },
    {
      title: 'Execution',
      text: 'If the route is valid, the journey is executed step by step with random events.'
    },
    {
      title: 'Result',
      text: 'The final score is based on the coins left at the end of the game.'
    }
  ];

  const rules = [
    'The game starts with 20 coins.',
    'The player has 90 seconds to plan the route.',
    'The route must start from the assigned starting station.',
    'The route must end at the assigned destination station.',
    'Each segment can be selected only once.',
    'The same station may be visited more than once.',
    'Line changes are allowed only at interchange stations.',
    'If time runs out, the selected route is submitted automatically.',
    'Invalid or incomplete routes obtain a final score of zero.',
    'Registered users can play multiple games and appear in the ranking.'
  ];

  return (
    <section className="page-card">
      <div className="mb-4">
        <h2 className="text-white fw-bold mb-3">
          Game Instructions
        </h2>

        <p className="text-secondary mb-0">
          Last Race is a single-player game where the player must plan and
          execute a valid route through a metro network, reaching the assigned
          destination with the highest possible score.
        </p>
      </div>

      <Row className="g-3 mb-4">
        {phases.map((phase, index) => (
          <Col md={6} key={phase.title}>
            <Card className="bg-dark text-light border-secondary h-100">
              <Card.Body>
                <Badge bg="danger" className="mb-2">
                  Phase {index + 1}
                </Badge>

                <Card.Title as="h3" className="h5">
                  {phase.title}
                </Card.Title>

                <Card.Text className="text-secondary mb-0">
                  {phase.text}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Card className="bg-dark text-light border-secondary">
        <Card.Body>
          <Card.Title as="h3" className="h5 mb-3">
            Main rules
          </Card.Title>

          <Row className="g-2">
            {rules.map((rule, index) => (
              <Col md={6} key={rule}>
                <div className="border border-secondary rounded-3 p-3 h-100">
                  <Badge bg="secondary" className="me-2">
                    {index + 1}
                  </Badge>

                  <span className="text-light">
                    {rule}
                  </span>
                </div>
              </Col>
            ))}
          </Row>
        </Card.Body>
      </Card>
    </section>
  );
}

export default InstructionsPage;