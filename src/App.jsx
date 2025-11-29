import { Navigate, Route, Routes } from 'react-router-dom';
import LoginPage from './modules/auth/LoginPage.jsx';
import DashboardLayout from './modules/dashboard/DashboardLayout.jsx';
import RoleProtectedRoute from './modules/auth/RoleProtectedRoute.jsx';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/admin"
        element={
          <RoleProtectedRoute allowedRoles={["Administrador"]}>
            <DashboardLayout role="Administrador" />
          </RoleProtectedRoute>
        }
      />
      <Route
        path="/tecnico"
        element={
          <RoleProtectedRoute allowedRoles={["Técnico"]}>
            <DashboardLayout role="Técnico" />
          </RoleProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
