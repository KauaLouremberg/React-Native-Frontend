import z from 'zod';
import { registerValidationSchema } from '../validation-schemas/register-validation-schema';

export type RegisterValidationDto = z.infer<typeof registerValidationSchema>;