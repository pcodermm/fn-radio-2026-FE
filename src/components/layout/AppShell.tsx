import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';

import { useAuth } from '../../features/auth/useAuth';
import { useAppSettings } from '../../features/settings/useAppSettings';
import { env } from '../../lib/env';

function getNavClassName({ isActive }: { isActive: boolean }) {
  return `nav-link${isActive ? ' is-active' : ''}`;
}

export function AppShell() {
  const navigate = useNavigate();
  const auth = useAuth();
  const { settings } = useAppSettings();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const appName = settings.app_name || 'FN Radio';

  async function handleLogout() {
    setIsLoggingOut(true);

    try {
      await auth.logout();
      navigate('/');
    } finally {
      setIsLoggingOut(false);
    }
  }

  return (
    <div className="app-shell">
      <header className="site-header">
        <div className="shell site-header-inner">
          <NavLink className="brand-mark" to="/">
            <span className="brand-mark-badge">LIVE</span>
            <span>
              <strong>{appName}</strong>
              <small>Myanmar sessions, stories, and late-night signal</small>
            </span>
          </NavLink>
          <nav className="site-nav" aria-label="Primary">
            <NavLink className={getNavClassName} to="/" end>
              Home
            </NavLink>
            <NavLink className={getNavClassName} to="/blogs">
              Blogs
            </NavLink>
            <NavLink className={getNavClassName} to="/podcasts">
              Podcasts
            </NavLink>
            {auth.isAuthenticated ? (
              <NavLink className={getNavClassName} to="/profile">
                Profile
              </NavLink>
            ) : null}
          </nav>
          <div className="site-actions">
            {auth.isAuthenticated ? (
              <>
                <span className="user-ping">
                  <span className="user-ping-dot" />
                  {auth.user?.name}
                </span>
                <button
                  className="button button-secondary"
                  disabled={isLoggingOut}
                  onClick={handleLogout}
                  type="button"
                >
                  {isLoggingOut ? 'Signing out...' : 'Logout'}
                </button>
              </>
            ) : (
              <>
                <NavLink className="button button-secondary" to="/login">
                  Login
                </NavLink>
                <NavLink className="button button-primary" to="/register">
                  Join FN Radio
                </NavLink>
              </>
            )}
          </div>
        </div>
      </header>
      <main className="shell page-shell">
        <Outlet />
      </main>
      <footer className="site-footer">
        <div className="shell site-footer-inner">
          <div>
            <p className="footer-title">{appName}</p>
            <p className="footer-copy">
              Designed around the darker broadcast tone of the FN Radio Myanmar
              channel while staying aligned with the public API and trusted-device auth
              flow.
            </p>
          </div>
          <div className="footer-links">
            {settings.contact_email ? (
              <a href={`mailto:${settings.contact_email}`}>{settings.contact_email}</a>
            ) : null}
            {settings.facebook_url ? (
              <a href={settings.facebook_url} rel="noreferrer" target="_blank">
                Facebook
              </a>
            ) : null}
            <span>v{env.appVersion}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
