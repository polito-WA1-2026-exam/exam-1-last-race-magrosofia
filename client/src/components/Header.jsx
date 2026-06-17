import { useLocation, useNavigate } from 'react-router';
import { Container, Nav, Navbar } from 'react-bootstrap';

import moleLogo from '../assets/mole.svg';

function Header({ user, onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const navClass = (path) => (
    isActive(path) ? 'nav-link-custom active' : 'nav-link-custom'
  );

  return (
    <Navbar
        bg="dark"
        className="border-bottom border-light border-opacity-25 shadow-sm"
        data-bs-theme="dark"
        >
      <Container fluid className="px-4">
        <Navbar.Brand
          role="button"
          onClick={() => navigate('/')}
          className="d-flex align-items-end gap-1 m-0"
        >
          <img
            src={moleLogo}
            alt="Mole Antonelliana"
            style={{
              width: '72px',
              height: '72px',
              maxWidth: '72px',
              maxHeight: '72px',
              objectFit: 'contain',
              display: 'block',
              flexShrink: 0
            }}
          />

          <span
            className="fw-bold lh-1 mb-1 ms-1"
            style={{ fontSize: '2rem' }}
        >
            Last Race - Turin Edition
        </span>
        </Navbar.Brand>

        <Nav className="ms-auto align-items-center gap-3">
          <Nav.Link
            className={navClass('/')}
            onClick={() => navigate('/')}
          >
            Home
          </Nav.Link>

          <Nav.Link
            className={navClass('/instructions')}
            onClick={() => navigate('/instructions')}
          >
            Instructions
          </Nav.Link>

          {user && (
            <>
              <Nav.Link
                className={navClass('/setup')}
                onClick={() => navigate('/setup')}
              >
                New Game
              </Nav.Link>

              <Nav.Link
                className={navClass('/ranking')}
                onClick={() => navigate('/ranking')}
              >
                Ranking
              </Nav.Link>
            </>
          )}

          {!user ? (
            <Nav.Link
              className={navClass('/login')}
              onClick={() => navigate('/login')}
            >
              Login
            </Nav.Link>
          ) : (
            <Nav.Link
              className="nav-link-custom"
              onClick={onLogout}
            >
              Logout
            </Nav.Link>
          )}
        </Nav>
      </Container>
    </Navbar>
  );
}

export default Header;