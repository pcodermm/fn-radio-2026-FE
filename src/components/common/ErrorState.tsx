interface ErrorStateProps {
  title?: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function ErrorState({
  title = 'Signal lost',
  message,
  actionLabel = 'Try again',
  onAction,
}: ErrorStateProps) {
  return (
    <section className="feedback-card feedback-card-error" role="alert">
      <span className="feedback-badge">Error</span>
      <h2>{title}</h2>
      <p>{message}</p>
      {onAction ? (
        <button className="button button-primary" onClick={onAction} type="button">
          {actionLabel}
        </button>
      ) : null}
    </section>
  );
}
