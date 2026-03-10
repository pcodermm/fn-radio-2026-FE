interface FieldErrorProps {
  messages?: string[];
}

export function FieldError({ messages }: FieldErrorProps) {
  if (!messages?.length) {
    return null;
  }

  return <p className="field-error">{messages[0]}</p>;
}
