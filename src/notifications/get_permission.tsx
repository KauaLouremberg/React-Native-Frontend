import messaging from '@react-native-firebase/messaging';
import { PermissionsAndroid, Platform } from "react-native";

export async function pedirPermissaoNotificacao() {
  if (Platform.Version as any >= 33) {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
    );

    if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
      console.log("Permissão de notificação NEGADA");
      return false;
    }
  }

  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  console.log("Permissões concedidas:", enabled);

  return enabled;
}
