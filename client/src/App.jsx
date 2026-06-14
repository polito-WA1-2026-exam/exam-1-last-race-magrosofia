import { useState } from 'react';
import './App.css';

import Layout from './components/Layout';
import HomePage from './components/HomePage';
import InstructionsPage from './components/InstructionPage';
import LoginPage from './components/LoginPage';

function App() {
  const [user, setUser] = useState(null);
  const [currentPage, setCurrentPage] = useState('home');

  function handleNavigate(page) {
    setCurrentPage(page);
  }

  function handleLogout() {
    setUser(null);
    setCurrentPage('home');
  }

  function renderPage() {
    switch (currentPage) {
      case 'home':
        return <HomePage user={user} onNavigate={handleNavigate} />;

      case 'instructions':
        return <InstructionsPage />;

      case 'login':
        return <LoginPage />;

      case 'setup':
        return (
          <section className="page-card">
            <h2>Setup Page</h2>
            <p>This is a placeholder for the future setup page.</p>
          </section>
        );

      case 'ranking':
        return (
          <section className="page-card">
            <h2>Ranking Page</h2>
            <p>This is a placeholder for the future ranking page.</p>
          </section>
        );

      default:
        return <HomePage user={user} onNavigate={handleNavigate} />;
    }
  }

  return (
    <Layout
      user={user}
      currentPage={currentPage}
      onNavigate={handleNavigate}
      onLogout={handleLogout}
    >
      {renderPage()}
    </Layout>
  );
}

export default App;