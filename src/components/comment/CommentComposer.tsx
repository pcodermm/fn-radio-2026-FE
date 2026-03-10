import { FormEvent, useEffect, useId, useState } from 'react';

import { FieldError } from '../common/FieldError';
import { FormErrorSummary } from '../common/FormErrorSummary';
import type { AppError } from '../../lib/errors';

interface CommentComposerProps {
  title: string;
  submitLabel: string;
  placeholder: string;
  isSubmitting: boolean;
  error: AppError | null;
  onSubmit: (body: string) => Promise<void>;
  resetSignal: number;
  onCancel?: () => void;
  compact?: boolean;
  autoFocus?: boolean;
}

export function CommentComposer({
  title,
  submitLabel,
  placeholder,
  isSubmitting,
  error,
  onSubmit,
  resetSignal,
  onCancel,
  compact = false,
  autoFocus = false,
}: CommentComposerProps) {
  const bodyId = useId();
  const [body, setBody] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    setBody('');
    setLocalError(null);
  }, [resetSignal]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextBody = body.trim();

    if (!nextBody) {
      setLocalError('Write something before posting.');
      return;
    }

    setLocalError(null);
    await onSubmit(nextBody);
  }

  return (
    <form
      className={`comment-composer${compact ? ' comment-composer-compact' : ''}`}
      onSubmit={handleSubmit}
    >
      <div className="section-heading">
        <div>
          <span className="eyebrow">{title}</span>
          <h2>{compact ? 'Keep the thread moving' : 'Add your voice'}</h2>
        </div>
      </div>
      {error && !error.errors?.body ? (
        <FormErrorSummary errors={error.errors} message={error.message} />
      ) : null}
      <label className="field-group" htmlFor={bodyId}>
        <span>Message</span>
        <textarea
          autoFocus={autoFocus}
          id={bodyId}
          onChange={(event) => setBody(event.target.value)}
          placeholder={placeholder}
          rows={compact ? 3 : 5}
          value={body}
        />
        <FieldError messages={error?.errors?.body || (localError ? [localError] : undefined)} />
      </label>
      <div className="comment-composer-actions">
        {onCancel ? (
          <button className="button button-secondary" onClick={onCancel} type="button">
            Cancel
          </button>
        ) : null}
        <button className="button button-primary" disabled={isSubmitting} type="submit">
          {isSubmitting ? 'Sending...' : submitLabel}
        </button>
      </div>
    </form>
  );
}
