import { Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from './hooks/useAppStore';
import { fetchCurrentUser } from './store/authSlice';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AlertHistory from './pages/AlertHistory';
import ShelterMap from './pages/ShelterMap';
import VolunteerDashboard from './pages/VolunteerDashboard';
import ResourceDashboard from './pages/ResourceDashboard';
import AdminDashboard from './pages/AdminDashboard';
import { UserRole } from './types';

function ProtectedRoute({ children, roles }: { children: React.ReactNode; roles?: UserRole[] }) {
  const { user } = useAppSelector((state) => state.auth);
  if (roles && user && !roles.includes(user.role)) {
    return <Navigate to="/" />;
  }
  return <>{children}</>;
}

function App() {
  const dispatch = useAppDispatch();
  const { token, user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (token && !user) {
      dispatch(fetchCurrentUser());
    }
  }, [dispatch, token, user]);

  return (
    <Routes>
      <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
      <Route path="/register" element={!user ? <Register /> : <Navigate to="/" />} />
      <Route
        path="/"
        element={user ? <Layout /> : <Navigate to="/login" />}
      >
        <Route index element={<Dashboard />} />
        <Route path="alerts" element={<AlertHistory />} />
        <Route path="shelters" element={<ShelterMap />} />
        <Route path="volunteer" element={<VolunteerDashboard />} />
        <Route path="resources" element={<ResourceDashboard />} />
        <Route
          path="admin"
          element={
            <ProtectedRoute roles={[UserRole.ADMIN]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
      </Route>
    </Routes>
  );
}

export default App;
