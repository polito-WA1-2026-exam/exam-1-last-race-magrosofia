import { Alert, Container } from 'react-bootstrap';

import Header from './Header';
import Footer from './Footer';

function Layout({ user, onLogout, message, setMessage, children }) {
  return (
    <div className="app-layout">
      <Header
        user={user}
        onLogout={onLogout}
      />

      <Container as="main" className="flex-grow-1 py-4">
        {message && (
          <Alert
            variant={message.type}
            dismissible
            onClose={() => setMessage(null)}
          >
            {message.text}
          </Alert>
        )}

        {children}
      </Container>

      <Footer />
    </div>
  );
}

export default Layout;