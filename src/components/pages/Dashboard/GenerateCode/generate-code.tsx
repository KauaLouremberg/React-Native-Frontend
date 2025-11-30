import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';
import { colors } from '../../../../core/constants/colors';
import { ButtonCore } from '../../../buttons/button-core';
import api from '../../../conexao/api';
import SpinningIcon from '../../../ElementosForm/SpinningIcon';
import { Input } from '../../../input/input';
import { Texto } from '../../../texto';

export default function GenerateCode() {
  const [codigoAmp, setCodigoAmp] = useState();
  const [codigoEnvio, setCodigoEnvio] = useState<any>();
  const [isLoadingSendCode, setIsLoadingSendCode] = useState<boolean>(false);

  const usuario = useSelector((state: any) => state.user);

  const createCodigo = () => {
    api
      .get('ampcodigo/')
      .then(res => setCodigoAmp(res.data))
      .catch(err => console.error('ocorreu um erro', err));
  };

  const enviaCodigo = () => {
    setIsLoadingSendCode(false);
    api
      .post('responsavel/', { id: codigoEnvio })
      .then(res => console.info('enviado com sucesso', res))
      .catch(err => console.error('algo deu errado', err))
      .finally(() => setIsLoadingSendCode(true));
  };

  useEffect(() => {
    if (usuario.is_amparado) {
      createCodigo();
    }
  }, [usuario.is_amparado]);

  return (
    <View style={styles.container}>
      {usuario.is_amparado ? (
        <View style={styles.wrapperAmparado}>
          {!!codigoAmp && (
            <View style={styles.codigoBox}>
              <Texto style={styles.codigoValor}>{codigoAmp}</Texto>
            </View>
          )}
        </View>
      ) : (
        <View style={styles.wrapperNaoAmparado}>
          <Input
            label="Enviar codigo (responsavel) - deve ser bloqueado se o usuario for amparado"
            placeholder="Digite o codigo"
            value={codigoEnvio}
            onChangeText={setCodigoEnvio}
          />
          <ButtonCore
            disabled={isLoadingSendCode}
            onPress={() => enviaCodigo()}
            style={styles.botaoEnviar}
          >
            {isLoadingSendCode ? (
              <SpinningIcon text={false} color="white" />
            ) : (
              'Enviar código'
            )}
          </ButtonCore>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 15,
  },

  wrapperAmparado: {
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },

  codigoBox: {
    backgroundColor: colors.primaryLight,
    borderRadius: '100%',
    alignSelf: 'flex-start',
    paddingVertical: 80,
    paddingHorizontal: 60,
    margin: 'auto',
  },

  codigoValor: {
    width: '100%',
    margin: 'auto',
    color: colors.white,
    textAlign: 'center',
  },

  wrapperNaoAmparado: {
    marginTop: 100,
    width: '100%',
  },

  botaoEnviar: {
    width: '100%',
    marginTop: 10,
  },
});
