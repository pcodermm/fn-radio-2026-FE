import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { AppShell } from '../components/layout/AppShell';
import { GuestOnly, RequireAuth } from '../features/auth/AuthRouteGuards';
import { BlogDetailPage } from '../pages/BlogDetailPage';
import { BlogsPage } from '../pages/BlogsPage';
import { HomePage } from '../pages/HomePage';
import { LoginPage } from '../pages/LoginPage';
import { NotFoundPage } from '../pages/NotFoundPage';
import { PodcastDetailPage } from '../pages/PodcastDetailPage';
import { PodcastsPage } from '../pages/PodcastsPage';
import { ProfilePage } from '../pages/ProfilePage';
import { RegisterPage } from '../pages/RegisterPage';

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppShell />} path="/">
          <Route element={<HomePage />} index />
          <Route element={<BlogsPage />} path="blogs" />
          <Route element={<BlogDetailPage />} path="blogs/:slug" />
          <Route element={<PodcastsPage />} path="podcasts" />
          <Route element={<PodcastDetailPage />} path="podcasts/:slug" />
          <Route
            element={
              <GuestOnly>
                <LoginPage />
              </GuestOnly>
            }
            path="login"
          />
          <Route
            element={
              <GuestOnly>
                <RegisterPage />
              </GuestOnly>
            }
            path="register"
          />
          <Route
            element={
              <RequireAuth>
                <ProfilePage />
              </RequireAuth>
            }
            path="profile"
          />
          <Route element={<NotFoundPage />} path="*" />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
