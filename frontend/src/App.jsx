import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@nishant625/auth-react';
import Login from './pages/Login';
import ProductManager from './pages/ProductManager';

function App() {
  const { isAuthenticated, isLoading,user } = useAuth();
  console.log("user",user)

  if (isLoading) return null;

  const ProtectedRoute = ({ children }) => {
    return isAuthenticated ? children : <Navigate to="/login" replace />;
  };

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/callback" element={<Navigate to="/" replace />} />
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
