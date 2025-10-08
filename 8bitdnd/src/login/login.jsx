import React from 'react';
import { useNavigate } from 'react-router-dom';
import './login.css';

export function Login() {
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    // Add authentication logic here if needed
    navigate('/tabletop');
  }

  return (
    <main>
      <div className="landscape-warning">
        For best experience, please rotate your device to landscape mode.
      </div>
      <h1 className="big-title">8-Bit DND</h1>
      <h1 className="secondary-title">Welcome to DND made simple</h1>
      <h3>Login or create your account below</h3>
      <form id="login-form" onSubmit={handleSubmit}>
        <div style={{ marginBottom: '0em' }}></div>
        <div>
          <input type="text" placeholder="email@example.com" />
        </div>
        <div>
          <input type="password" placeholder="password" />
        </div>
        <div style={{ marginBottom: '1em' }}></div>
        <button type="submit">Login</button>
        <button type="button" onClick={() => navigate('/tabletop')}>Create</button>
      </form>
    </main>
  );
}