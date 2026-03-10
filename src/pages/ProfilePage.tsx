import { useAuth } from '../features/auth/useAuth';
import { getAppVersion, getDeviceName, getOrCreateDeviceId } from '../lib/device';
import { formatDate } from '../lib/format';

export function ProfilePage() {
  const auth = useAuth();
  const user = auth.user;

  return (
    <div className="page-stack">
      <section className="page-hero">
        <span className="eyebrow">Profile</span>
        <h1>Authenticated session synced with the FN Radio backend.</h1>
        <p>
          This page reflects the current user returned by `GET /api/auth/me` and the
          persisted trusted-device details used on authenticated requests.
        </p>
      </section>

      <section className="profile-grid">
        <article className="section-card">
          <span className="eyebrow">Account</span>
          <h2>{user?.name}</h2>
          <dl className="data-list">
            <div>
              <dt>Email</dt>
              <dd>{user?.email}</dd>
            </div>
            <div>
              <dt>Role</dt>
              <dd>{user?.role}</dd>
            </div>
            <div>
              <dt>Status</dt>
              <dd>{user?.status}</dd>
            </div>
            <div>
              <dt>Created</dt>
              <dd>{formatDate(user?.created_at || null)}</dd>
            </div>
            <div>
              <dt>Last login</dt>
              <dd>{formatDate(user?.last_login_at || null)}</dd>
            </div>
          </dl>
        </article>

        <article className="section-card">
          <span className="eyebrow">Trusted device</span>
          <h2>Web client metadata</h2>
          <dl className="data-list">
            <div>
              <dt>Platform</dt>
              <dd>web</dd>
            </div>
            <div>
              <dt>Device ID</dt>
              <dd className="break-copy">{getOrCreateDeviceId()}</dd>
            </div>
            <div>
              <dt>Device name</dt>
              <dd>{getDeviceName()}</dd>
            </div>
            <div>
              <dt>App version</dt>
              <dd>{getAppVersion()}</dd>
            </div>
          </dl>
        </article>
      </section>
    </div>
  );
}
