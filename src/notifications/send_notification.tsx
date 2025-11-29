import api from "../components/conexao/api";

export async function enviarNotificacao(targetUserId: any) {
  try {
    const response = await api.post("send/", {
      target_user_id: targetUserId,
    });

    return response.data;
  } catch (err: any) {
    return err;
  }
}
