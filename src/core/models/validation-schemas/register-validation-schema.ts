import { z } from 'zod';
import { getErrorLabel } from '../../errors/get-error-label';

export const registerValidationSchema = z.object({
  email: z
    .string()
    .trim()
    .email({ message: 'Email inválido' })
    .transform((v) => v.toLowerCase()),
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