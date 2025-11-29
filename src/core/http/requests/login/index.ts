import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../../../components/conexao/api';
import TrackingService from '../../../../components/pages/Dashboard/MapScreen/trackingService';
import { registerDevice } from '../../../../notifications/fcm';
import store from '../../../../store';
import { setUser } from '../../../../store/userSlice';
import { setUserType } from '../../../../store/userTypeSlice';
import { LoginValidationDto } from '../../../models/dto/login-validation-dto';

export async function loginRequest(data: LoginValidationDto) {
  try {
    const result = await api.post('login/', data);
    const { access, refresh } = result.data;

    await AsyncStorage.setItem('accessToken', access);
    await AsyncStorage.setItem('refreshToken', refresh);

    store.dispatch(setUser({ token: access }));

    const token = await AsyncStorage.getItem('accessToken');

    if (token) {
      const responseUser = await api.get('user/');
      const has_perfil = responseUser.data.has_perfil ? responseUser.data.has_perfil : false;
      const userData = has_perfil ? responseUser.data.data : responseUser.data;

      const userPayload = {
        id: userData.id,
        nome: userData.nome,
        token: token,
        is_amparado: userData.is_amparado,
        has_perfil: has_perfil,
      };

      store.dispatch(setUser(userPayload));

      if (userPayload.has_perfil) {
        const responseInfo = await api.get('information/');
        const infoData = responseInfo.data;

        const typePayload = {
          responsavel_id: infoData.responsavel_id,
          amparado_id: infoData.amparado_id,
        };

        store.dispatch(setUserType(typePayload));
      }
    }

    await registerDevice();
    await TrackingService.start();

    return result.data;

  } catch (error: any) {
      console.error('Erro ao fazer login:', error);
    throw error;
  }
}
