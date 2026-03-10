import { flattenValidationErrors } from '../../lib/errors';
import type { ValidationErrors } from '../../types/api';

interface FormErrorSummaryProps {
  message: string;
  errors?: ValidationErrors;
}

export function FormErrorSummary({ message, errors }: FormErrorSummaryProps) {
  const validationMessages = flattenValidationErrors(errors);

  return (
    <div className="form-alert" role="alert">
      <strong>{message}</strong>
      {validationMessages.length ? (
        <ul>
          {validationMessages.map((validationMessage) => (
            <li key={validationMessage}>{validationMessage}</li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
