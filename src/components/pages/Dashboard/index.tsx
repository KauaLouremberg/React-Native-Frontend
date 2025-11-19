import { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setUser } from '../../../store/userSlice';
import api from '../../conexao/api';
import { Texto } from '../../texto';

export default function Dashboard() {
  const dispatch = useDispatch();
  const [userPerfil, setUserPerfil] = useState<any>();
  console.log(userPerfil)

    const onReceive = useCallback((data: any) => {
      const user = {
        id: data.id,
        nome: data.nome,
        perfil: data.perfil,
      };

      setUserPerfil(user);
      dispatch(setUser(user));
    }, [dispatch]);


  useEffect(() => {
    api.get('user/')
      .then((res) => {
        onReceive(res.data);
        setTimeout(() => {
        // enviarNotificacao(8); Exemplo de Uso para notificacao, 8 = id do usuario que vai receber a notificacao
      }, 5000);
      })
  }, []);

  return (
    <>
      <Texto>teste</Texto>
    </>
  );
}
