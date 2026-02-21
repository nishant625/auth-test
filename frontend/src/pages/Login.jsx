import { useEffect } from 'react';

function Login() {
  useEffect(() => {
    initiateOAuthFlow();
  }, []);

  const generateRandomString = (length) => {
    const array = new Uint8Array(length);
    window.crypto.getRandomValues(array);
    return base64UrlEncode(array);
  };

  const base64UrlEncode = (buffer) => {
    const base64 = btoa(String.fromCharCode(...buffer));
    return base64
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  };

  const sha256 = async (plain) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(plain);
    const hash = await window.crypto.subtle.digest('SHA-256', data);
    return new Uint8Array(hash);
  };

  const initiateOAuthFlow = async () => {
    const codeVerifier = generateRandomString(32);
    const hashed = await sha256(codeVerifier);
    const codeChallenge = base64UrlEncode(hashed);
    const state = generateRandomString(16);

    localStorage.setItem('pkce_verifier', codeVerifier);
    localStorage.setItem('oauth_state', state);

    const params = new URLSearchParams({
      response_type: 'code',
      client_id: 'my-app',
      redirect_uri: 'http://localhost:3000/callback',
      code_challenge: codeChallenge,
      code_challenge_method: 'S256',
      scope: 'read write',
      state: state
    });

    const authUrl = `http://localhost:4000/oauth/authorize?${params.toString()}`;
    window.location.href = authUrl;
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h2>Redirecting to login...</h2>
      <p>Please wait while we redirect you to the authorization server.</p>
    </div>
  );
}

export default Login;
