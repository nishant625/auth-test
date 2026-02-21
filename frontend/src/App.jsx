import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Callback from './pages/Callback';
import ProductManager from './pages/ProductManager';

function App() {
  // Check if user is authenticated
  const isAuthenticated = () => {
    return !!localStorage.getItem('access_token');
  };

  // Protected route wrapper
  const ProtectedRoute = ({ children }) => {
    return isAuthenticated() ? children : <Navigate to="/login" replace />;
  };

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/callback" element={<Callback />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <ProductManager />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
