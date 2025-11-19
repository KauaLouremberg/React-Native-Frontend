import messaging from '@react-native-firebase/messaging';
import api from '../components/conexao/api';
import { pedirPermissaoNotificacao } from './get_permission';

export async function registerDevice() {
  try {
    await pedirPermissaoNotificacao()
    
    const fcmToken = await messaging().getToken();

    await api.post("register/", {
      fcm_token: fcmToken
    });

    console.log("Device registrado com sucesso:", fcmToken);
    return fcmToken;

  } catch (err) {
    console.log("Erro ao registrar device:", err);
    return null;
  }
}
