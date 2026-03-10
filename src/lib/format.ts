const longDateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
});

export function formatDate(value: string | null): string {
  if (!value) {
    return 'Unscheduled';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return longDateFormatter.format(date);
}

export function formatCount(value: number): string {
  return new Intl.NumberFormat('en-US').format(value);
}
