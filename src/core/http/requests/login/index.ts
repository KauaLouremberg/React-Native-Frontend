import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../../../components/conexao/api';
import { registerDevice } from '../../../../notifications/fcm';
import { LoginValidationDto } from '../../../models/dto/login-validation-dto';

export async function loginRequest(data: LoginValidationDto) {
  try {
    const result = await api.post('login/', data);

    const { access, refresh } = result.data;

    await AsyncStorage.setItem('accessToken', access);
    await AsyncStorage.setItem('refreshToken', refresh);
    
    await registerDevice();

    return result.data;
  } catch (error: any) {
    console.error('Erro ao fazer login:', error);
    throw error;
  }
}
