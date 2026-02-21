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
      // Get authorization code from URL
      const params = new URLSearchParams(window.location.search);
      const code = params.get('code');

      if (!code) {
        setError('No authorization code received');
        return;
      }

      // Retrieve code_verifier from localStorage
      const codeVerifier = localStorage.getItem('pkce_verifier');

      if (!codeVerifier) {
        setError('No code verifier found in storage');
        return;
      }

      // Exchange code for token
      const tokenResponse = await fetch('http://localhost:4000/oauth/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          code: code,
          redirect_uri: 'http://localhost:3000/callback',
          client_id: 'my-app',
          code_verifier: codeVerifier,
        }).toString(),
      });

      if (!tokenResponse.ok) {
        const errorData = await tokenResponse.json();
        setError(`Token exchange failed: ${errorData.error || tokenResponse.statusText}`);
        return;
      }

      const tokenData = await tokenResponse.json();

      // Save access token to localStorage
      localStorage.setItem('access_token', tokenData.access_token);

      // Clean up PKCE verifier
      localStorage.removeItem('pkce_verifier');

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
