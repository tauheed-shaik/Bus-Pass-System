import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext, AuthProvider } from './context/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Pages
import Login from './pages/Login';
import Signup from './pages/Signup';
import StudentDashboard from './pages/StudentDashboard';
import AdminDashboard from './pages/AdminDashboard';
import ApplyPass from './pages/ApplyPass';
import ManageRoutes from './pages/ManageRoutes';
import VerifyNFC from './pages/VerifyNFC';
import Navbar from './components/Navbar';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading } = useContext(AuthContext);
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (adminOnly && user.role !== 'admin') return <Navigate to="/" />;
  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-slate-50">
          <Navbar />
          <div className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />

              <Route path="/" element={
                <ProtectedRoute>
                  <StudentDashboard />
                </ProtectedRoute>
              } />

              <Route path="/apply" element={
                <ProtectedRoute>
                  <ApplyPass />
                </ProtectedRoute>
              } />

              <Route path="/admin" element={
                <ProtectedRoute adminOnly={true}>
                  <AdminDashboard />
                </ProtectedRoute>
              } />

              <Route path="/admin/routes" element={
                <ProtectedRoute adminOnly={true}>
                  <ManageRoutes />
                </ProtectedRoute>
              } />

              <Route path="/verify-nfc" element={<VerifyNFC />} />
            </Routes>
          </div>
          <ToastContainer position="top-right" autoClose={3000} />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
