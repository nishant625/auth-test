import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Callback() {
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  useEffect(() => {
    handleCallback();
  }, []);

  const handleCallback = async () => {
    try {
      const params = new URLSearchParams(window.location.search);
      const code = params.get('code');
      const returnedState = params.get('state');

      if (!code) {
        setError('No authorization code received');
        return;
      }

      // Verify state to prevent CSRF
      const storedState = sessionStorage.getItem('oauth_state');
      if (!storedState || returnedState !== storedState) {
        setError('State mismatch — possible CSRF attack');
        return;
      }

      const codeVerifier = sessionStorage.getItem('pkce_verifier');
      if (!codeVerifier) {
        setError('No code verifier found in storage');
        return;
      }

      const tokenResponse = await fetch(`${import.meta.env.VITE_AUTH_SERVER_URL}/oauth/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          code: code,
          redirect_uri: import.meta.env.VITE_REDIRECT_URI,
          client_id: import.meta.env.VITE_CLIENT_ID,
          code_verifier: codeVerifier,
          client_secret: import.meta.env.VITE_CLIENT_SECRET
        }).toString(),
      });

      if (!tokenResponse.ok) {
        const errorData = await tokenResponse.json();
        setError(`Token exchange failed: ${errorData.error || tokenResponse.statusText}`);
        return;
      }

      const tokenData = await tokenResponse.json();

      localStorage.setItem('access_token', tokenData.access_token);
      if (tokenData.refresh_token) {
        localStorage.setItem('refresh_token', tokenData.refresh_token);
      }

      // Clean up PKCE/state from sessionStorage
      sessionStorage.removeItem('pkce_verifier');
      sessionStorage.removeItem('oauth_state');

      // Redirect to home page
      navigate('/');
    } catch (err) {
      setError(`Error: ${err.message}`);
    }
  };

  if (error) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', color: 'red' }}>
        <h2>Authentication Error</h2>
        <p>{error}</p>
        <button onClick={() => navigate('/login')}>Try Again</button>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h2>Processing authentication...</h2>
      <p>Please wait while we complete your login.</p>
    </div>
  );
}

export default Callback;
