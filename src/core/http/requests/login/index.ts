import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../../../components/conexao/api';
import TrackingService from '../../../../components/pages/Dashboard/MapScreen/trackingService';
import { registerDevice } from '../../../../notifications/fcm';
import store from '../../../../store';
import { setUser } from '../../../../store/userSlice';
import { LoginValidationDto } from '../../../models/dto/login-validation-dto';

export async function loginRequest(data: LoginValidationDto) {
  try {
    const result = await api.post('login/', data);

    const { access, refresh } = result.data;

    store.dispatch(setUser({token: access}));
    await AsyncStorage.setItem('accessToken', access);
    await AsyncStorage.setItem('refreshToken', refresh);
    
    await registerDevice();
    await TrackingService.start();

    return result.data;
  } catch (error: any) {
    console.error('Erro ao fazer login:', error);
    throw error;
  }
}
