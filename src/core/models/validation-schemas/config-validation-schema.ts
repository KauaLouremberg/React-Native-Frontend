import { z } from 'zod';
import { getErrorLabel } from '../../errors/get-error-label';

export const configValidationSchema = z.object({
  cpf: z
    .string()
    .min(11, getErrorLabel('field_min_length', { replacements: { min: '11'} }))
    .max(
      11,
      getErrorLabel('field_max_length', { replacements: { max: '11' } }),
    ),
  tipo_conta: z
    .string()
    .min(1, getErrorLabel('required_field')),

  sexo: z
    .string()
    .min(1, getErrorLabel('required_field')),

  data_nascimento: z
    .date()
    .min(1, getErrorLabel('required_field'))
});
