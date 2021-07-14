import React from 'react';

function Login() {
  const login = () => {
  }
  const logout = () => {
  }
  return (
    <div>
      <input type="button" onClick={login} value="Login with Google" />
      <input type="button" onClick={logout} value="Logout" />
    </div>
  );
}

export default Login;
