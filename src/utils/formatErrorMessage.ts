import { ZodError } from 'zod';
import { fromZodError } from 'zod-validation-error';

export default function formatErrorMessage(error: ZodError) {
  return fromZodError(error, { maxIssuesInMessage: 2, prefix: '', prefixSeparator: '' }).message;
}
