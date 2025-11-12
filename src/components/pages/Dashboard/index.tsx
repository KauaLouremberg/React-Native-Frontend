import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setUser } from '../../../store/userSlice';
import api from '../../conexao/api';
import { Texto } from '../../texto';

export default function Dashboard() {
  const dispatch = useDispatch();
  const [userPerfil, setUserPerfil] = useState<any>();

  useEffect(() => {
    api
      .get('user/')
      .then((res: any) => {
        setUserPerfil({
          id: res.data.id,
          nome: res.data.nome,
          perfil: res.data.perfil,
        });
        dispatch(setUser(userPerfil));
      })
      .catch(err => console.log(err));
  }, [dispatch, userPerfil]);

  return (
    <>
      <Texto>teste</Texto>
    </>
  );
}
