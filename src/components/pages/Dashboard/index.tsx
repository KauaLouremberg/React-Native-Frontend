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
      .then((res) => onReceive(res.data));
  }, []);

  return (
    <>
      <Texto>teste</Texto>
    </>
  );
}
