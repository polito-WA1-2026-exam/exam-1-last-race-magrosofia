import Header from './Header';
import Footer from './Footer';

function Layout({ user, currentPage, onNavigate, onLogout, children }) {
  return (
    <div className="app-layout">
      <Header
        user={user}
        currentPage={currentPage}
        onNavigate={onNavigate}
        onLogout={onLogout}
      />

      <main className="app-main">
        {children}
      </main>

      <Footer />
    </div>
  );
}

export default Layout;