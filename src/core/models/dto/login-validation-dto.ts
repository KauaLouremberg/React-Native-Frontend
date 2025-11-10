import z from 'zod';
import { loginValidationSchema } from '../validation-schemas/login-validation-schema';

export type LoginValidationDto = z.infer<(typeof loginValidationSchema)[]>;
