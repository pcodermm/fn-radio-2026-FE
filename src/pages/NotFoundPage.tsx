import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <section className="feedback-card">
      <span className="feedback-badge">404</span>
      <h1>That frequency does not exist.</h1>
      <p>The requested page was not found in the frontend router.</p>
      <Link className="button button-primary" to="/">
        Return home
      </Link>
    </section>
  );
}
