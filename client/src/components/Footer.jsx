import { Container, Stack } from 'react-bootstrap';

function Footer() {
  return (
    <footer className="bg-black border-top border-secondary py-3">
      <Container fluid className="px-5">
        <Stack direction="horizontal" className="justify-content-between">
          <span className="text-secondary text-uppercase small fw-bold">
            Last Race
          </span>

          <span className="text-secondary text-uppercase small">
            Web Applications I - Exam Project
          </span>
        </Stack>
      </Container>
    </footer>
  );
}

export default Footer;