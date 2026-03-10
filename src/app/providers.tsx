import { AuthProvider } from '../features/auth/AuthProvider';
import { AppRouter } from './router';

export function AppProviders() {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
}
