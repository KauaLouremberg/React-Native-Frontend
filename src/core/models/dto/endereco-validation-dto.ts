import z from 'zod';
import { enderecoValidationSchema } from '../validation-schemas/endereco-validation-schema';

export type EnderecoValidationDto = z.infer<typeof enderecoValidationSchema>;
