import { lazy, Suspense } from 'react';
import { Navigate, useRoutes } from 'react-router-dom';
import { useAuth } from '../auth/hooks/use-auth';
import { auth, admin } from '../../shared/content/strings';
import { loadingScreen } from '../../shared/design-system/layout';
const AuthPage = lazy(() =>
  import('../auth/pages/AuthPage').then((module) => ({ default: module.AuthPage })),
);
const DashboardPage = lazy(() =>
  import('../dashboard/DashboardPage').then((module) => ({ default: module.DashboardPage })),
);
const SettingsPage = lazy(() =>
  import('../settings/pages/SettingsPage').then((module) => ({ default: module.SettingsPage })),
);
const WatchlistPage = lazy(() =>
  import('../watchlist/pages/WatchlistPage').then((module) => ({ default: module.WatchlistPage })),
);
const FriendsPage = lazy(() =>
  import('../friends/pages/FriendsPage').then((module) => ({ default: module.FriendsPage })),
);
const NotFound = lazy(() => import('../not-found/NotFound'));

function ProtectedRoute({ element }: { element: React.ReactNode }) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  return element;
}

function AdminRoute({ element }: { element: React.ReactNode }) {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  if (user?.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return element;
}

export function AppRouter() {
  return (
    <Suspense fallback={<div className={loadingScreen}>{auth.loading}</div>}>
      {useRoutes([
        { path: '/auth', element: <AuthPage /> },
        { path: '/home', element: <Navigate to="/auth" replace /> },
        { path: '/test', element: <Navigate to="/auth" replace /> },
        {
          path: '/dashboard',
          element: <ProtectedRoute element={<DashboardPage />} />,
        },
        {
          path: '/settings',
          element: <ProtectedRoute element={<SettingsPage />} />,
        },
        {
          path: '/watchlist',
          element: <ProtectedRoute element={<WatchlistPage />} />,
        },
        {
          path: '/friends',
          element: <ProtectedRoute element={<FriendsPage />} />,
        },
        {
          path: '/admin/config',
          element: <AdminRoute element={<div>{admin.config.title}</div>} />,
        },
        {
          path: '/admin/snapshots',
          element: <AdminRoute element={<div>{admin.snapshots.title}</div>} />,
        },
        { path: '/', element: <Navigate to="/auth" replace /> },
        { path: '*', element: <NotFound /> },
      ])}
    </Suspense>
  );
}
