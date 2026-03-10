import type { ReactElement } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

import { LoadingState } from '../../components/common/LoadingState';
import { useAuth } from './useAuth';

interface GuardProps {
  children: ReactElement;
}

export function RequireAuth({ children }: GuardProps) {
  const auth = useAuth();
  const location = useLocation();

  if (auth.isInitializing) {
    return <LoadingState title="Restoring your session" />;
  }

  if (!auth.isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: `${location.pathname}${location.search}` }}
      />
    );
  }

  return children;
}

export function GuestOnly({ children }: GuardProps) {
  const auth = useAuth();

  if (auth.isInitializing) {
    return <LoadingState title="Checking your session" />;
  }

  if (auth.isAuthenticated) {
    return <Navigate to="/profile" replace />;
  }

  return children;
}
