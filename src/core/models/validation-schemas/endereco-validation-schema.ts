import { z } from 'zod';
import { getErrorLabel } from '../../errors/get-error-label';

export const enderecoValidationSchema = z.object({
  estado: z
    .string()
    .min(1, getErrorLabel('required_field'))
    .max(
      255,
      getErrorLabel('field_max_length', { replacements: { max: '255' } }),
    ),
  cidade: z
    .string()
    .min(1, getErrorLabel('required_field'))
    .max(
      255,
      getErrorLabel('field_max_length', { replacements: { max: '255' } }),
    ),
  cep: z
    .string()
    .min(1, getErrorLabel('required_field'))
    .max(
      9,
      getErrorLabel('field_max_length', { replacements: { max: '9' } }),
    ),
  bairro: z
    .string()
    .min(1, getErrorLabel('required_field'))
    .max(
      255,
      getErrorLabel('field_max_length', { replacements: { max: '255' } }),
    ),
  rua: z
    .string()
    .min(1, getErrorLabel('required_field'))
    .max(
      255,
      getErrorLabel('field_max_length', { replacements: { max: '255' } }),
    ),
  numero: z
    .string().optional()
});
