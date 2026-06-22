import { useEffect, useState } from 'react';
import { Navigate, Route, Routes, useNavigate } from 'react-router';

import './App.css';

import Layout from './components/Layout';
import HomePage from './components/HomePage';
import InstructionsPage from './components/InstructionPage';
import LoginPage from './components/LoginPage';
import SetupPage from './components/SetupPage';
import PlanningPage from './components/PlanningPage';
import ExecutionPage from './components/ExecutionPage';
import ResultPage from './components/ResultPage';
import RankingPage from './components/RankingPage';
import ErrorPage from './components/ErrorPage';

import API from './API/API.js';

function App() {
// user and loggedIn represent the current authentication status.
// message is used for user feedback.
// loading prevents rendering routes before the initial session check is completed.
  const [user, setUser] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(true);

// This avoids full page reloads and keeps the application as a SPA
  const navigate = useNavigate();

// Checks the existing server session when the app is loaded.
// This restores the logged-in user after a page refresh.
  useEffect(() => {
  const checkAuth = async () => {
    setLoading(true);

    try {
      const userData = await API.getCurrentUser();

      if (userData) {
        setUser(userData);
        setLoggedIn(true);
      } else {
        setUser(null);
        setLoggedIn(false);
      }
    } catch (err) {
      setUser(null);
      setLoggedIn(false);
    } finally {
      setLoading(false);
    }
  };

  checkAuth();
}, []);

// Login handler passed to LoginPage.
  const handleLogin = async (credentials) => {
    try {
      const userData = await API.login(credentials);

      setUser(userData);
      setLoggedIn(true);

      setMessage(null);

      navigate('/setup');
      return true;
    } catch (err) {
      setMessage({
        type: 'danger',
        text: 'Invalid email or password.'
      });

      return false;
    }
  };

  // Logout handler passed to the layout/header.
  const handleLogout = async () => {
    try {
      await API.logout();

      setUser(null);
      setLoggedIn(false);

      setMessage({
        type: 'info',
        text: 'Logout successful.'
      });

      navigate('/');
    } catch (err) {
      setMessage({
        type: 'danger',
        text: 'Logout failed.'
      });
    }
  };

  if (loading) {
    return (
      <div className="loading-page">
        Loading...
      </div>
    );
  }

  return (
    <Layout
      user={user}
      loggedIn={loggedIn}
      onLogout={handleLogout}
      message={message}
      setMessage={setMessage}
    >
      <Routes>
        <Route
          path="/"
          element={
            <HomePage loggedIn={loggedIn} user={user} />
          }
        />

        <Route
          path="/instructions"
          element={
            <InstructionsPage />
          }
        />

        <Route
          path="/login"
          element={
            loggedIn ? (
              <Navigate to="/setup" replace />
            ) : (
              <LoginPage
                handleLogin={handleLogin}
                setMessage={setMessage}
              />
            )
          }
        />

        <Route
          path="/setup"
          element={
            loggedIn ? (
              <SetupPage setMessage={setMessage} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/game/:gameId/planning"
          element={
            loggedIn ? (
              <PlanningPage setMessage={setMessage} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/game/:gameId/execution"
          element={
            loggedIn ? (
              <ExecutionPage setMessage={setMessage} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/game/:gameId/result"
          element={
            loggedIn ? (
              <ResultPage setMessage={setMessage} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/ranking"
          element={
            loggedIn ? (
              <RankingPage setMessage={setMessage} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="*"
          element={
            <ErrorPage />
          }
        />
      </Routes>
    </Layout>
  );
}

export default App;