import api from '../../../../components/conexao/api';
import { RegisterValidationDto } from '../../../models/dto/register-validation-dto';

export async function amparadoRequest(data: RegisterValidationDto) {
  try {
    const result = await api.post('amparado/', data);
    return result.data;
    
  } catch (error: any) {
    console.error('Erro ao criar amparado:', error);
    throw error;
  }
}
