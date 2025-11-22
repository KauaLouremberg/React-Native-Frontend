import z from 'zod';
import { configValidationSchema } from '../validation-schemas/config-validation-schema';

export type ConfigValidationDto = z.infer<typeof configValidationSchema>;