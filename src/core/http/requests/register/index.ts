import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../../../components/conexao/api';
import { LoginValidationDto } from '../../../models/dto/login-validation-dto';

export async function registerRequest(data: LoginValidationDto) {
  try {
    await AsyncStorage.removeItem('accessToken');

    const result = await api.post('createuser/', data);

    return result.data;
  } catch (error: any) {
    console.error('Erro ao fazer registro:', error);
    throw error;
  }
}
