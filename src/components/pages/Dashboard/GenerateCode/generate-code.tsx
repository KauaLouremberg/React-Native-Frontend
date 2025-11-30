import { Clipboard as ClipBoard } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import {
  NativeModules,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
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
  const { ClipboardModule } = NativeModules;

  const usuario = useSelector((state: any) => state.user);

  const createCodigo = () => {
    api
      .get('ampcodigo/?code=true')
      .then(res => setCodigoAmp(res.data))
      .catch(err => console.error('ocorreu um erro', err));
  };

  console.log('Código: ', codigoAmp);

  const enviaCodigo = () => {
    setIsLoadingSendCode(false);
    api
      .post('responsavel/', { id: codigoEnvio })
      .then(res => console.info('enviado com sucesso', res))
      .catch(err => console.error('algo deu errado', err))
      .finally(() => setIsLoadingSendCode(true));
  };

  useEffect(() => {
    if (usuario.is_amparado || !codigoAmp) {
      createCodigo();
    }
  }, [usuario.is_amparado, codigoAmp]);

  return (
    <View style={styles.container}>
      {usuario.is_amparado ? (
        <View style={styles.wrapperAmparado}>
          <View style={styles.codigoBox}>
            <View style={styles.contentRow}>
              <Texto style={styles.codigoValor}>{codigoAmp}</Texto>

              <TouchableOpacity
                onPress={() => ClipboardModule.copy(codigoAmp)}
                style={[styles.iconButton]}
              >
                <ClipBoard size={18} color={colors.white} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.textWrapper}>
            <Texto style={styles.text}>
              Este código é um código de vinculação. Copie o código, e no
              celular do responsável, insira o código para realizar a
              vinculação.
            </Texto>
          </View>
        </View>
      ) : (
        <View style={styles.wrapperNaoAmparado}>
          <Input
            label="Enviar codigo (responsavel)"
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
          <Texto style={styles.text}>
            Emita o código de vinculação no celular do amparado. Após a geração
            do código, insira o código para realizar a vinculação.
          </Texto>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 15,
    flex: 1,
  },
  wrapperAmparado: {
    justifyContent: 'center',
    flex: 1,
    alignItems: 'center',
  },
  codigoBox: {
    backgroundColor: colors.primaryLight,
    borderRadius: '100%',
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    paddingHorizontal: 45,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  codigoValor: {
    color: colors.white,
    textAlign: 'center',
    marginRight: 5,
  },
  iconButton: {
    padding: 0,
  },
  textWrapper: {
    position: 'absolute',
    bottom: 40,
    width: '100%',
    alignItems: 'center',
  },
  text: {
    textAlign: 'center',
  },
  wrapperNaoAmparado: {
    height: '100%',
    justifyContent: 'center',
    marginTop: 40,
    gap: 40,
    width: '100%',
  },
  botaoEnviar: {
    width: '100%',
  },
});
