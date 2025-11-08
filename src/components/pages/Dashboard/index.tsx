import { Button } from "react-native";
import api from "../../conexao/api";

export default function Dashboard() {

//   async function criarUsuario() {
//   try {
//     const response = await api.post('/autenticacao/', {
//       nome: 'kaua',
//       email: 'kaualouremberg@gmail.com',
//     });
//     console.log(response.data);
//   } catch (err: any) {
//     console.error(err.response?.data || err.message);
//   }
// }

const criarUsuario = async() => {
  try {
    const response = await api.post('/autenticacao/', {
      nome: 'kaua',
      email: 'kaualouremberg@gmail.com',
    });
    console.log(response.data)
  } catch (err: any) {
    console.error(err.reponse?.data)
  }
}

  return <>
    <Button title="Teste Api" onPress={() => criarUsuario()} />
  </>;
}
