import { FormEvent, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { FieldError } from '../components/common/FieldError';
import { FormErrorSummary } from '../components/common/FormErrorSummary';
import { useAuth } from '../features/auth/useAuth';
import type { AppError } from '../lib/errors';

export function LoginPage() {
  const auth = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<AppError | null>(null);

  const nextPath = (location.state as { from?: string } | null)?.from || '/profile';

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      await auth.login({ email, password });
      setError(null);
      navigate(nextPath, { replace: true });
    } catch (requestError) {
      setError(requestError as AppError);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="auth-panel">
      <div className="auth-copy">
        <span className="eyebrow">Login</span>
        <h1>Reconnect your FN Radio account.</h1>
        <p>
          Sign in with your email and password. The app will attach your stored web
          device ID and app version automatically.
        </p>
      </div>
      <form className="auth-form" onSubmit={handleSubmit}>
        {error ? <FormErrorSummary errors={error.errors} message={error.message} /> : null}
        <label className="field-group">
          <span>Email</span>
          <input
            autoComplete="email"
            onChange={(event) => setEmail(event.target.value)}
            type="email"
            value={email}
          />
          <FieldError messages={error?.errors?.email} />
        </label>
        <label className="field-group">
          <span>Password</span>
          <input
            autoComplete="current-password"
            onChange={(event) => setPassword(event.target.value)}
            type="password"
            value={password}
          />
          <FieldError messages={error?.errors?.password} />
        </label>
        <button className="button button-primary button-full" disabled={isSubmitting} type="submit">
          {isSubmitting ? 'Signing in...' : 'Login'}
        </button>
      </form>
    </section>
  );
}
