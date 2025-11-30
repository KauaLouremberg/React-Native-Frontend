import { Clipboard as ClipBoard } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { NativeModules, StyleSheet, TouchableOpacity, View } from 'react-native';
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
              <View style={styles.contentRow}>
                <Texto style={styles.codigoValor}>{codigoAmp}</Texto>
                
                <TouchableOpacity onPress={() => ClipboardModule.copy(codigoAmp)} style={[styles.iconButton]}>
                  <ClipBoard size={18} color={colors.white} />
                </TouchableOpacity>
              </View>
            </View>
          )}
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
    flexDirection: 'row',
    alignItems: 'center',
  },
  codigoBox: {
    backgroundColor: colors.primaryLight,
    borderRadius: 999,
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
  wrapperNaoAmparado: {
    marginTop: 100,
    width: '100%',
  },
  botaoEnviar: {
    width: '100%',
    marginTop: 10,
  },
});