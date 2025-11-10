import { z } from 'zod';
import { getErrorLabel } from '../../../components/core/errors/get-error-label';

export const loginValidationSchema = z.object({
  username: z
    .string()
    .min(1, getErrorLabel('required_field'))
    .max(
      50,
      getErrorLabel('field_max_length', { replacements: { max: '50' } }),
    ),
  password: z
    .string()
    .min(1, getErrorLabel('required_field'))
    .max(
      50,
      getErrorLabel('field_max_length', { replacements: { max: '50' } }),
    ),
});
