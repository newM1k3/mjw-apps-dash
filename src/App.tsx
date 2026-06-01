import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { usePocketBase } from './hooks/usePocketBase';
import AuthGuard from './components/AuthGuard';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import UpgradePrompt from './pages/UpgradePrompt';

function RootRedirect() {
  const { user, loading } = usePocketBase();
  if (loading) return null;
  return <Navigate to={user ? '/dashboard' : '/login'} replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RootRedirect />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <AuthGuard>
              <Dashboard />
            </AuthGuard>
          }
        />
        <Route
          path="/upgrade"
          element={
            <AuthGuard>
              <UpgradePrompt />
            </AuthGuard>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
