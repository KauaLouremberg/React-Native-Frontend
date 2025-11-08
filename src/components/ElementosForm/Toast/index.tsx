import Toast from "react-native-toast-message";

interface toast {
  type: string;
  title: string;
  message: string;
}

/**
 *
 *  - success → sucesso (verde)
 *  - error → erro (vermelho)
 *  - info → informativo (azul)
 *
 */
export const ToastNotify = ({type, title, message}: toast) => {
  return Toast.show({
    type: type,
    text1: title,
    text2: message,
  });
}