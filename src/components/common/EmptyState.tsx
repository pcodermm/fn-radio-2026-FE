interface EmptyStateProps {
  title: string;
  description: string;
}

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <section className="feedback-card">
      <span className="feedback-badge">Empty</span>
      <h2>{title}</h2>
      <p>{description}</p>
    </section>
  );
}
