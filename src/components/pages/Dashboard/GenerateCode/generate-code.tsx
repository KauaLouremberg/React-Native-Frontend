import { Clipboard as ClipBoard, Frown } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import {
  NativeModules,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSelector } from 'react-redux';
import { colors } from '../../../../core/constants/colors';
import { loginStyle } from '../../../../styles/login/login-style';
import { ButtonCore } from '../../../buttons/button-core';
import api from '../../../conexao/api';
import OtpInput from '../../../ElementosForm/OtpInput';
import SpinningIcon from '../../../ElementosForm/SpinningIcon';
import { ToastNotify } from '../../../ElementosForm/Toast';
import { Texto } from '../../../texto';

export default function GenerateCode() {
  const [codigoAmp, setCodigoAmp] = useState();
  const [isLoadingSendCode, setIsLoadingSendCode] = useState<boolean>(false);
  const { ClipboardModule } = NativeModules;
  const [isValid, setIsValid] = useState<any>();
  const [codigoCompleto, setCodigoCompleto] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const usuario = useSelector((state: any) => state.user);
  const userType = useSelector((state: any) => state.userType);

  const {
      title,
    } = loginStyle;

  const createCodigo = () => {
    setIsLoadingSendCode(true);

    try {
      api.get("ampcodigo/?code=True")
      .then((res) => {
        setCodigoAmp(res.data);
        setIsLoadingSendCode(false);
      })
      .catch((err) => {
        api.get("ampcodigo/")
        .then((res) => {
          setCodigoAmp(res.data);
          setIsLoadingSendCode(false);
        }
      )
      .catch((error) => {
        console.warn(error);
        setIsLoadingSendCode(false);
      })
      })
    } catch {
      setIsLoadingSendCode(false);
    }
  }

  const enviaCodigo = () => {
    setIsLoadingSendCode(true);

    api
      .post('responsavel/', { id: codigoCompleto })
      .then(res => {
        ToastNotify({
          type: 'success',
          title: 'Sucesso!',
          message: 'Vinculo criado com sucesso!',
          time: 2500,
        });
        setIsValid('');
      })
      .catch(err => 
        ToastNotify({
          type: 'error',
          title: 'Erro!',
          message: 'Ocorreu um erro ao criar o Vinculo!',
          time: 2500,
        })
      )
      .finally(() => setIsLoadingSendCode(false));
  };

  const verifyCodigo = (codigo: any) => {
    setIsLoading(true);

    api
      .get(`ampcodigo/?verify=${codigo}`)
      .then(res => {
        setIsValid('green');
        setCodigoCompleto(codigo);
        setIsLoading(false);
      })
      .catch(() => {
        setIsValid('red')
        setIsLoading(false);

        ToastNotify({
          type: 'error',
          title: 'Erro!',
          message: 'Não existe nenhum amparado com o código informado!',
          time: 2500,
        })
      });
  };


  useEffect(() => {
    if (usuario.is_amparado && !codigoAmp) {
      createCodigo();
    }
  }, [usuario.is_amparado, codigoAmp]);

  return (
    <View style={styles.container}>
      {isLoadingSendCode ? (
        <>
          <View style={styles.spinner}>
            <SpinningIcon color={colors.primary} size={40} />
          </View>
        </>
      ) : (
        <>
        {usuario.has_perfil && userType.amparado_id && userType.responsavel_id ? 
          (
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
              <Frown 
                color={colors.primaryLight} 
                size={32} 
                style={{justifyContent: 'center', alignSelf: 'center', marginBottom: 10}}
              />
              <Texto 
                style={{
                  justifyContent: 'center',
                  alignSelf: 'center', 
                  fontSize: 15,
                  color: colors.primaryLight
                }}>
                Tela não finalizada
              </Texto>
          </View>
          ) : (<>
            {usuario.is_amparado ? (
            <View style={styles.wrapperAmparado}>
              
              <View style={styles.codigoBox}>
                <View style={styles.contentRow}>
                  <Texto style={styles.codigoValor}>{codigoAmp}</Texto>

                  <TouchableOpacity
                    onPress={() => ClipboardModule.copy(codigoAmp)}
                    style={[styles.iconButton]}
                  >
                    <ClipBoard size={20} color={colors.white} />
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
              <Texto style={[title, {left: 20}]}>
                Vinculação de Amparado
              </Texto>
              <OtpInput
                length={6}
                onComplete={(e: any) => {
                  verifyCodigo(e);
                }}
                color={isValid}
              />
              <Texto style={{justifyContent: 'center', alignSelf: 'center', fontSize: 15 }}>
                Insira o código gerado na conta do Amparado!
              </Texto>
              {isLoading && (
                <View style={{position: 'absolute', marginTop: "100%", marginLeft: "45%"}}>
                  <SpinningIcon text={false} color={colors.primaryLight} size={25} />
                </View>
              )}
          
              <View style={styles.wrapperButton}>
                <ButtonCore
                  disabled={isLoadingSendCode || isValid !== "green" ? true : false}
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
            </View>
          )}
          </>)}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  spinner: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
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
    paddingHorizontal: 65,
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
    fontSize: 18
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

  wrapperButton: {
    width: "100%",
    paddingHorizontal: 15,
  },
  text: {
    textAlign: 'center',
  },
  wrapperNaoAmparado: {
    flex: 1,
    justifyContent: "space-between",
    paddingVertical: 40,
  },
  botaoEnviar: {
    width: '100%',
    backgroundColor: colors.primaryLight
  },
});
