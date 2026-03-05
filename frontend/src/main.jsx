import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from '@nishant625/auth-react'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider
        clientId={import.meta.env.VITE_CLIENT_ID}
        authServerUrl={import.meta.env.VITE_AUTH_SERVER_URL}
        redirectUri={import.meta.env.VITE_REDIRECT_URI}
        clientSecret={import.meta.env.VITE_CLIENT_SECRET}
      >
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
