import React from 'react';
import { useNavigate } from 'react-router';
import moleLogo from '../assets/mole.svg';

const Header = (props) => {
  const navigate = useNavigate();

  return (
    <header className="app-header">
      <div className="header-left">
        <button
          type="button"
          className="brand-button"
          onClick={() => navigate('/')}
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
          className="nav-button"
          onClick={() => navigate('/')}
        >
          Home
        </button>

        <button
          type="button"
          className="nav-button"
          onClick={() => navigate('/instructions')}
        >
          Instructions
        </button>

        {props.user && (
          <>
            <button
              type="button"
              className="nav-button"
              onClick={() => navigate('/setup')}
            >
              New Game
            </button>

            <button
              type="button"
              className="nav-button"
              onClick={() => navigate('/ranking')}
            >
              Ranking
            </button>
          </>
        )}

        {!props.user ? (
          <button
            type="button"
            className="nav-button"
            onClick={() => navigate('/login')}
          >
            Login
          </button>
        ) : (
          <button
            type="button"
            className="nav-button"
            onClick={props.onLogout}
          >
            Logout
          </button>
        )}
      </nav>
    </header>
  );
};

export default Header;