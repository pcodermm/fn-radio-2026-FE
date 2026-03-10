interface LoadingStateProps {
  title?: string;
  description?: string;
}

export function LoadingState({
  title = 'Tuning the signal',
  description = 'Pulling the latest audio stories and updates from FN Radio.',
}: LoadingStateProps) {
  return (
    <section className="feedback-card" aria-live="polite">
      <div className="loading-orbit" aria-hidden="true" />
      <h2>{title}</h2>
      <p>{description}</p>
    </section>
  );
}
