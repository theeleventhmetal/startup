import React from 'react';
import './login.css';

import { Unauthenticated } from './unauthenticated';
import { AuthState } from './authState';

export function Login({ userName, authState, onAuthChange }) {
  return (
    <main>
      {authState === AuthState.Unauthenticated && (
        <Unauthenticated
          userName={userName}
          onLogin={(loginUserName) => {
            onAuthChange(loginUserName, AuthState.Authenticated);
            // Navigation happens in unauthenticated component
          }}
        />
      )}
      {/* Authenticated component removed - goes straight to tabletop */}
    </main>
  );
}