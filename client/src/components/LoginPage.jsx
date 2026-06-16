import { useState } from 'react';
import { useNavigate } from 'react-router';

function LoginPage({ handleLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    setErrorMsg('');

    const success = await handleLogin({
      username: email,
      password: password
    });

    if (success) {
      navigate('/setup');
    } else {
      setErrorMsg('Invalid email or password.');
    }
  };

  return (
    <section className="auth-card">
      <div className="page-heading">
        <p className="eyebrow">Registered users only</p>
        <h2>Login</h2>
        <p>
          Enter your credentials to start a new game and view the ranking.
        </p>
      </div>

      {errorMsg && (
        <p className="login-error">
          {errorMsg}
        </p>
      )}

      <form className="login-form" onSubmit={handleSubmit}>
        <label>
          Email
          <input
            type="email"
            placeholder="name@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </label>

        <label>
          Password
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </label>

        <button type="submit" className="primary-action">
          Login
        </button>
      </form>
    </section>
  );
}

export default LoginPage;