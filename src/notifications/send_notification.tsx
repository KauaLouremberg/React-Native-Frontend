import api from "../components/conexao/api";

export async function enviarNotificacao(targetUserId: any) {
  try {
    const response = await api.post("send/", {
      target_user_id: targetUserId,
    });
    console.log("Notificação enviada:", response.data);
  } catch (err: any) {
    console.log("Erro ao enviar notificação:", err.response?.data || err);
  }
}
