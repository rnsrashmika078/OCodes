tsx
// @jsx jsx
import { jsx } from 'theme-ui';
import React from 'react';

interface Props {
  username: string;
  password: string;
}

const Login: React.FC<Props> = ({ username, password }) => (
  <div>
    <h1>Login</h1>
    <form>
      <label>Username:</label>
      <input type="text" value={username} />
      <br />
      <label>Password:</label>
      <input type="password" value={password} />
      <br />
      <button>Login</button>
    </form>
  </div>
);


