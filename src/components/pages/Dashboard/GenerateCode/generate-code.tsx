import { useState } from 'react';
import { View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { ButtonCore } from '../../../buttons/button-core';
import api from '../../../conexao/api';
import { Input } from '../../../input/input';
import { Texto } from '../../../texto';

export default function GenerateCode() {
  const dispatch = useDispatch();
  const token = useSelector((state: any) => state.user.token);
  const [codigoAmp, setCodigoAmp] = useState();
  const [codigoEnvio, setCodigoEnvio] = useState<any>();
  const user = useSelector((state: any) => state.user);

  // const onReceive = useCallback(
  //   (data: any) => {
  //     const user = {
  //       id: data.data.id,
  //       nome: data.data.nome,
  //       token: token,
  //       is_amparado: data.data.is_amparado,
  //       has_perfil: data.has_perfil ? data.has_perfil : false
  //     };

  //     console.log('user', user)

  //     dispatch(setUser(user));
  //   },
  //   [dispatch],
  // ); 

  // const onReceiveInformation = useCallback(
  //   (data: any) => {
  //     const user = {
  //       responsavel_id: data.responsavel_id,
  //       amparado_id: data.amparado_id,
  //     };

  //     dispatch(setUserType(user));
  //   },
  //   [dispatch],
  // );

  // useEffect(() => {
  //   if (token) {
  //     api.get('user/').then(res => {
  //       onReceive(res.data);
  //     });
  //   }
  // }, [token]);

  // useEffect(() => {
  //   if (user) {
  //     api.get('information/').then(res => {
  //       onReceiveInformation(res.data);
  //     });
  //   }
  // }, [user]);

  const createCodigo = () => {
    api
      .get('ampcodigo/')
      .then(res => setCodigoAmp(res.data))
      .catch(err => console.error('ocorreu um erro', err));
  };

  const enviaCodigo = () => {
    api
      .post('responsavel/', { id: codigoEnvio })
      .then(res => console.info('enviado com sucesso', res))
      .catch(err => console.error('algo deu errado', err));
  };

  return (
    <View
      style={{
        width: '100%',
        paddingHorizontal: 15
      }}
    >

      <View style={{ 
        marginTop: 60,
        width: '100%',
        
        height: 60,
      }}>
        {
          !!codigoAmp &&
          <View
            style={{
              backgroundColor: '#075be32a',
              borderColor: '#075be3',
              borderWidth: 1 ,
              borderRadius: 5,
              alignSelf: 'flex-start',
              padding: 4,


              margin: 'auto'
            }}
          >
            <Texto 
              style={{
                width: '100%',
                textAlign: 'center',
              }}
            > 
              Código de convite:
            </Texto>
            <Texto 
              style={{
                width: '100%',
                margin: 'auto',
                textAlign: 'center',
                fontWeight: '700'
              }}
            > 
              {codigoAmp}
            </Texto>

          </View>
        }
      </View>


      <View style={{ 
        marginTop: 50,
        width: '100%'
      }}>
        <Texto>
          Gerar codigo (amparado) - deve ser bloqueado se o usuario for
          responsavel - nao tem problema em gerar mais de uma vez
        </Texto>
        <ButtonCore onPress={() => createCodigo()} style={{ width: '100%', marginTop: 10 }}>
          Gerar código
        </ButtonCore>
      </View>

      <View style={{ 
        marginTop: 100,
        width: '100%',
      }}>
        <Input
          label="Enviar codigo (responsavel) - deve ser bloqueado se o usuario for amparado"
          placeholder="Digite o codigo"
          value={codigoEnvio}
          onChangeText={setCodigoEnvio}
        />
        <ButtonCore onPress={() => enviaCodigo()} style={{ width: '100%', marginTop: 10 }}>
          Enviar código
        </ButtonCore>
      </View>
    </View>
  );
}
