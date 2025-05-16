import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import ErrorBoundary from './components/ErrorBoundary';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ProjectDetails from './pages/ProjectDetails';
import Unauthorized from './pages/Unauthorized';
import { AuthProvider } from './contexts/AuthContext';

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <ToastContainer />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            
            {/* Editor Routes */}
            <Route 
              path="/editor/dashboard" 
              element={
                <ProtectedRoute allowedRoles={['editor']}>
                  <Dashboard role="editor" />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/editor/projects/:projectId" 
              element={
                <ProtectedRoute 
                  allowedRoles={['editor']} 
                  requireProjectAccess={true}
                >
                  <ProjectDetails role="editor" />
                </ProtectedRoute>
              } 
            />

            {/* Youtuber Routes */}
            <Route 
              path="/youtuber/dashboard" 
              element={
                <ProtectedRoute allowedRoles={['youtuber']}>
                  <Dashboard role="youtuber" />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/youtuber/projects/:projectId" 
              element={
                <ProtectedRoute 
                  allowedRoles={['youtuber']} 
                  requireProjectAccess={true}
                >
                  <ProjectDetails role="youtuber" />
                </ProtectedRoute>
              } 
            />

            {/* Redirect root to login */}
            <Route path="/" element={<Login />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App; 