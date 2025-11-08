import Toast from "react-native-toast-message";

interface toast {
  type: string;
  title: string;
  message: string;
  time?: number;
}

/**
 *
 *  - success → sucesso (verde)
 *  - error → erro (vermelho)
 *  - info → informativo (azul)
 *
 */
export const ToastNotify = ({type, title, message, time}: toast) => {
  return Toast.show({
    type: type,
    text1: title,
    text2: message,
    visibilityTime: time ? time : 4000
  });
}