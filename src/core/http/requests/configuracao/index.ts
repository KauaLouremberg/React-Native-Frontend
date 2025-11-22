import api from '../../../../components/conexao/api';
import { ConfigValidationDto } from '../../../models/dto/config-validation-dto';

export async function perfilRequest() {
  try {
    const result = await api.get('perfil/');

    return result.data;
  } catch (error: any) {
    console.error('Erro ao fazer requisicao:', error);
    throw error;
  }
}

export async function configRequest(data: ConfigValidationDto) {
  
  try {
    const result = await api.post('perfil/', data);

    return result.data;
  } catch (error: any) {
    console.error('Erro ao fazer requisicao:', error);
    throw error;
  }
}
