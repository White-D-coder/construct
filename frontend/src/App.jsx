import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import LandingPage from './pages/LandingPage';
import AdminDashboard from './pages/AdminDashboard';
import PrivateRoute from './components/PrivateRoute';

const AppRoutes = () => {
  const { user, loading } = useAuth();

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;

  return (
    <Routes>
      <Route path="/" element={!user ? <LandingPage /> : <Navigate to={user.role === 'admin' ? "/admin" : "/dashboard"} />} />
      <Route path="/login" element={!user ? <Login /> : <Navigate to={user.role === 'admin' ? "/admin" : "/dashboard"} />} />
      <Route path="/register" element={!user ? <Register /> : <Navigate to={user.role === 'admin' ? "/admin" : "/dashboard"} />} />

      {/* User Routes */}
      <Route path="/dashboard" element={
        <PrivateRoute>
          {user?.role === 'admin' ? <Navigate to="/admin" /> : <Dashboard />}
        </PrivateRoute>
      } />

      {/* Admin Routes */}
      <Route path="/admin" element={
        <PrivateRoute>
          {user?.role === 'admin' ? <AdminDashboard /> : <Navigate to="/dashboard" />}
        </PrivateRoute>
      } />
    </Routes>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;
