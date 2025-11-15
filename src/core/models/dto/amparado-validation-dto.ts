import z from 'zod';
import { registerValidationSchema } from '../validation-schemas/register-validation-schema';

export type AmparadoValidationDto = z.infer<typeof registerValidationSchema>;