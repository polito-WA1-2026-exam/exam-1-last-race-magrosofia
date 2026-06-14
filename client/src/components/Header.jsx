import moleLogo from '../assets/mole.svg';

function Header({ user, currentPage, onNavigate, onLogout }) {
  return (
    <header className="app-header">
      <div className="header-left">
        <button
          type="button"
          className="brand-button"
          onClick={() => onNavigate('home')}
        >
          <img
            src={moleLogo}
            alt="Mole Antonelliana"
            className="brand-logo"
          />

          <span className="brand-text">Last Race - Turin Edition</span>
        </button>
      </div>

      <nav className="header-nav">
        <button
          type="button"
          className={`nav-button ${currentPage === 'home' ? 'active' : ''}`}
          onClick={() => onNavigate('home')}
        >
          Home
        </button>

        <button
          type="button"
          className={`nav-button ${currentPage === 'instructions' ? 'active' : ''}`}
          onClick={() => onNavigate('instructions')}
        >
          Instructions
        </button>

        {!user ? (
          <button
            type="button"
            className={`nav-button ${currentPage === 'login' ? 'active' : ''}`}
            onClick={() => onNavigate('login')}
          >
            Login
          </button>
        ) : (
          <button
            type="button"
            className="nav-button"
            onClick={onLogout}
          >
            Logout
          </button>
        )}
      </nav>
    </header>
  );
}

export default Header;