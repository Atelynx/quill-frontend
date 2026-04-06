import { Navigate, Route, Routes } from 'react-router-dom';
import { AuthPage } from '../../modules/auth/pages/AuthPage';
import { DashboardPage } from '../../modules/dashboard/pages/DashboardPage';

export function AppRouter() {
  return (
    <Routes>
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/" element={<DashboardPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
