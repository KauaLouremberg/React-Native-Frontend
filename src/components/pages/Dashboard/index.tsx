import { useCallback, useEffect, useState } from 'react';
import { View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '../../../store/userSlice';
import { setUserType } from '../../../store/userTypeSlice';
import { ButtonCore } from '../../buttons/button-core';
import api from '../../conexao/api';
import { Input } from '../../input/input';
import { Texto } from '../../texto';

export default function Dashboard() {
  const dispatch = useDispatch();
  const token = useSelector((state: any) => state.user.token);
  const [codigoAmp, setCodigoAmp] = useState();
  const [codigoEnvio, setCodigoEnvio] = useState<any>();
  const user = useSelector((state: any) => state.user)
  const userType = useSelector((state: any) => state.userType)

  console.log(user, 'usuario')
  console.log(userType, 'typeuser')

    const onReceive = useCallback((data: any) => {
      const user = {
        id: data.id,
        nome: data.nome,
        token: token,
        is_amparado: data.is_amparado
      };

      dispatch(setUser(user));
    }, [dispatch]);

    const onReceiveInformation = useCallback((data: any) => {
      const user = {
        responsavel_id: data.responsavel_id,
        amparado_id: data.amparado_id
      };

      dispatch(setUserType(user));
    }, [dispatch]);


  useEffect(() => {
    if (token) {
      api.get('user/')
        .then((res) => {
          onReceive(res.data);
        })
      }
    
  }, [token]);

  useEffect(() => {
    if (user) {
      api.get('information/')
      .then((res) => {
        onReceiveInformation(res.data)
      })
    }
  }, [user])

  const createCodigo = () => {
    api.get("ampcodigo/")
    .then((res) => setCodigoAmp(res.data))
    .catch((err) => console.error('ocorreu um erro', err))
  }

  const enviaCodigo = () => {
      api.post("responsavel/", {id: codigoEnvio})
    .then((res) => console.info('enviado com sucesso', res))
    .catch((err) => console.error('algo deu errado', err))
  }

  return (
    <View>
      <Texto> {codigoAmp}</Texto>
 
      <View style={{marginTop: 100, width: 300}}>
        <Texto>Gerar codigo (amparado) - deve ser bloqueado se o usuario for responsavel - nao tem problema em gerar mais de uma vez</Texto>
        <ButtonCore onPress={() => createCodigo()} style={{width: 300}}>Gerar codigo</ButtonCore>
      </View>

      <View style={{marginTop: 100, width: 300}}>
        <Input label='Enviar codigo (responsavel) - deve ser bloqueado se o usuario for amparado' placeholder='Digite o codigo' value={codigoEnvio} onChangeText={setCodigoEnvio}></Input>
        <ButtonCore onPress={() => enviaCodigo()} style={{width: 300}}>Gerar codigo</ButtonCore>
      </View>
    </View>
  );
}
