import { ERRORS } from '../constants/errors';

type ErrorTypes = keyof typeof ERRORS;
type Params = {
  replacements?: Record<string, string>;
};

export function getErrorLabel(errorType: ErrorTypes, params?: Params) {
  if (!params) {
    params = { replacements: {} };
  }
  const replacements: Record<string, string> = params.replacements || {};
  const errorMapper = new Map<ErrorTypes, string>([
    ['required_field', ERRORS.required_field],
    ['field_max_length', ERRORS.field_max_length],
    ['invalid_date', ERRORS.invalid_date],
  ]);

  let errorLabel = errorMapper.get(errorType) || '';
  if (!errorLabel) {
    throw new Error(`Error type "${errorType}" not found`);
  }

  for (const [key, value] of Object.entries(replacements)) {
    errorLabel = errorLabel.replaceAll(`{${key}}`, value);
  }
  return errorLabel;
}
