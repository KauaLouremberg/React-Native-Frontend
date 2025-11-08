import Toast from "react-native-toast-message";

interface toast {
  type: string;
  title: string;
  message: string;
  time?: number;
}

/**
 *  type: Tipo da notificacao
 *  - success → sucesso (verde)
 *  - error → erro (vermelho)
 *  - info → informativo (azul)
 * 
 *  title: Titulo da notificacao
 * 
 *  message: Mensagem da notificacao
 * 
 *  time: Tempo que a notificacao vai ficar visivel
 *  - 4000 → 4 Segundos | padrao (4000)
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