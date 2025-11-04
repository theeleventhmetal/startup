import React from 'react';
import { useNavigate } from 'react-router-dom';

export function Unauthenticated(props) {
  const [userName, setUserName] = React.useState(props.userName || '');
  const [password, setPassword] = React.useState('');
  const [displayError, setDisplayError] = React.useState(null);

  async function loginUser() {
    loginOrCreate(`/api/auth/login`);
  }
    

  async function createUser() {
    loginOrCreate(`/api/auth/create`);
  }
    

  async function loginOrCreate(endpoint) {
    const response = await fetch(endpoint, {
      method: 'post',
      body: JSON.stringify({ email: userName, password: password }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    });
    if (response?.status === 200) {
      localStorage.setItem('userName', userName);
      props.onLogin(userName);
    } else {
      const body = await response.json();
      setDisplayError(`⚠ Error: ${body.msg}`);
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    loginUser();
  };

  return (
    <>
      <div className="landscape-warning">
        For best experience, please rotate your device to landscape mode.
      </div>
      <h1 className="big-title">8-Bit DND</h1>
      <h1 className="secondary-title">Welcome to DND made simple</h1>
      <h3>Login or create your account below</h3>
      
      <form id="login-form" onSubmit={handleSubmit}>
        <div style={{ marginBottom: '0em' }}></div>
        
        <div>
          <input 
            type="text" 
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="email@example.com"
            required
          />
        </div>
        
        <div>
          <input 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="password"
            required
          />
        </div>
        
        <div style={{ marginBottom: '1em' }}></div>
        
        <button 
          type="submit"
          disabled={!userName || !password}
        >
          Login
        </button>
        
        <button 
          type="button" 
          onClick={() => createUser()}
          disabled={!userName || !password}
        >
          Create
        </button>
      </form>

      {displayError && (
        <div className="error-message" style={{ color: 'red', marginTop: '1em' }}>
          {displayError}
        </div>
      )}
    </>
  );
}