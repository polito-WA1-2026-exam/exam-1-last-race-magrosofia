function LoginPage() {
  return (
    <section className="auth-card">
      <div className="page-heading">
        <p className="eyebrow">Registered users only</p>
        <h2>Login</h2>
        <p>
          Enter your credentials to start a new game and view the ranking.
        </p>
      </div>

      <form className="login-form">
        <label>
          Email
          <input type="email" placeholder="name@example.com" />
        </label>

        <label>
          Password
          <input type="password" placeholder="Enter your password" />
        </label>

        <button type="submit" className="primary-action">
          Login
        </button>
      </form>
    </section>
  );
}

export default LoginPage;