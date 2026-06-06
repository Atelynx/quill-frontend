import { lazy, Suspense } from 'react';
import { Navigate, useRoutes } from 'react-router-dom';
import { useAuth } from '../auth/hooks/use-auth';
import { loadingScreen } from '../../shared/design-system/layout';
const AuthPage = lazy(() =>
  import('../auth/pages/AuthPage').then((module) => ({ default: module.AuthPage })),
);
const DashboardPage = lazy(() =>
  import('../dashboard/DashboardPage').then((module) => ({ default: module.DashboardPage })),
);
const NotFound = lazy(() => import('../not-found/NotFound'));

function ProtectedRoute({ element }: { element: React.ReactNode }) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  return element;
}

export function AppRouter() {
  return (
    <Suspense fallback={<div className={loadingScreen}>Cargando...</div>}>
      {useRoutes([
        { path: '/auth', element: <AuthPage /> },
        { path: '/home', element: <Navigate to="/auth" replace /> },
        { path: '/test', element: <Navigate to="/auth" replace /> },
        {
          path: '/dashboard',
          element: <ProtectedRoute element={<DashboardPage />} />,
        },
        { path: '/', element: <Navigate to="/auth" replace /> },
        { path: '*', element: <NotFound /> },
      ])}
    </Suspense>
  );
}
