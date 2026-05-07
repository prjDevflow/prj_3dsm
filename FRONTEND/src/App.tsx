import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login/page';
import Dashboard from './pages/Dashboard/page';
import Leads from './pages/Leads/page';
import LeadDetails from './pages/LeadDetails/page';
import Profile from './pages/Profile/page';
import Settings from './pages/Settings/page';
import Clients from './pages/Clients/page';
import Users from './pages/Users/page';
import Teams from './pages/Teams/page';
import Logs from './pages/Logs/page';
import { loadSettings, applySettings } from './services/settingsService';

function App() {
  useEffect(() => {
    applySettings(loadSettings());
  }, []);

  return (
    <BrowserRouter>
      <AuthProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/leads"
              element={
                <ProtectedRoute>
                  <Leads />
                </ProtectedRoute>
              }
            />
            <Route
              path="/leads/:id"
              element={
                <ProtectedRoute>
                  <LeadDetails />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute requiredRoles={['admin', 'gerente_geral']}>
                  <Settings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/users"
              element={
                <ProtectedRoute requiredRoles={['admin']}>
                  <Users />
                </ProtectedRoute>
              }
            />
            <Route
              path="/teams"
              element={
                <ProtectedRoute requiredRoles={['admin', 'gerente_geral', 'gerente']}>
                  <Teams />
                </ProtectedRoute>
              }
            />
            <Route
              path="/logs"
              element={
                <ProtectedRoute requiredRoles={['admin']}>
                  <Logs />
                </ProtectedRoute>
              }
            />
            <Route
              path="/clients"
              element={
                <ProtectedRoute requiredRoles={['admin', 'atendente', 'gerente', 'gerente_geral']}>
                  <Clients />
                </ProtectedRoute>
              }
            />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;