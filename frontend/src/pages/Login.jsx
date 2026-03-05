import { useEffect } from 'react';
import { useAuth } from '@nishant625/auth-react';

function Login() {
  const { login } = useAuth();

  useEffect(() => {
    login();
  }, []);

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h2>Redirecting to login...</h2>
      <p>Please wait while we redirect you to the authorization server.</p>
    </div>
  );
}

export default Login;
