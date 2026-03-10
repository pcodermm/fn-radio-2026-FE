import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { FieldError } from '../components/common/FieldError';
import { FormErrorSummary } from '../components/common/FormErrorSummary';
import { useAuth } from '../features/auth/useAuth';
import type { AppError } from '../lib/errors';

export function RegisterPage() {
  const auth = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<AppError | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      await auth.register(form);
      setError(null);
      navigate('/profile', { replace: true });
    } catch (requestError) {
      setError(requestError as AppError);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="auth-panel">
      <div className="auth-copy">
        <span className="eyebrow">Register</span>
        <h1>Create your FN Radio account.</h1>
        <p>
          Registration uses the backend contract directly and includes the trusted
          device payload required for web clients.
        </p>
      </div>
      <form className="auth-form" onSubmit={handleSubmit}>
        {error ? <FormErrorSummary errors={error.errors} message={error.message} /> : null}
        <label className="field-group">
          <span>Name</span>
          <input
            autoComplete="name"
            onChange={(event) =>
              setForm((current) => ({ ...current, name: event.target.value }))
            }
            value={form.name}
          />
          <FieldError messages={error?.errors?.name} />
        </label>
        <label className="field-group">
          <span>Email</span>
          <input
            autoComplete="email"
            onChange={(event) =>
              setForm((current) => ({ ...current, email: event.target.value }))
            }
            type="email"
            value={form.email}
          />
          <FieldError messages={error?.errors?.email} />
        </label>
        <label className="field-group">
          <span>Password</span>
          <input
            autoComplete="new-password"
            onChange={(event) =>
              setForm((current) => ({ ...current, password: event.target.value }))
            }
            type="password"
            value={form.password}
          />
          <FieldError messages={error?.errors?.password} />
        </label>
        <label className="field-group">
          <span>Confirm password</span>
          <input
            autoComplete="new-password"
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                password_confirmation: event.target.value,
              }))
            }
            type="password"
            value={form.password_confirmation}
          />
          <FieldError messages={error?.errors?.password_confirmation} />
        </label>
        <button className="button button-primary button-full" disabled={isSubmitting} type="submit">
          {isSubmitting ? 'Creating account...' : 'Register'}
        </button>
      </form>
    </section>
  );
}
