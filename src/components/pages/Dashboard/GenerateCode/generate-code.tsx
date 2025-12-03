import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Clipboard } from 'lucide-react-native';
import { useCallback, useEffect, useState } from 'react';
import {
  Dimensions,
  NativeModules,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';
import { useSelector } from 'react-redux';
import { colors } from '../../../../core/constants/colors';
import store from '../../../../store';
import { setUserType } from '../../../../store/userTypeSlice';
import { loginStyle } from '../../../../styles/login/login-style';
import FloatButton from '../../../buttons/float-button';
import api from '../../../conexao/api';
import OtpInput from '../../../ElementosForm/OtpInput';
import SpinningIcon from '../../../ElementosForm/SpinningIcon';
import { ToastNotify } from '../../../ElementosForm/Toast';
import { Texto } from '../../../texto';

export default function GenerateCode() {
  const [codigoAmp, setCodigoAmp] = useState();
  const { width } = Dimensions.get('window');
  const [isLoadingSendCode, setIsLoadingSendCode] = useState<boolean>(false);
  const { ClipboardModule } = NativeModules;
  const [isValid, setIsValid] = useState<any>();
  const [codigoCompleto, setCodigoCompleto] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigation<any>();

  const usuario = useSelector((state: any) => state.user);

  const {
      title,
    } = loginStyle;

  const GenNewCode = () => {
    setLoading(true);

    api.get("ampcodigo/")
    .then((res) => {
      setCodigoAmp(res.data);
      setLoading(false);
    })
    .catch((err) => {
      setLoading(false);
      console.warn(err);
    })
  }

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

  const loadUserType = async (isActiveRef?: { current: boolean }) => {
    try {
      const responseInfo = await api.get('information/');
      if (isActiveRef && !isActiveRef.current) return;

      const infoData = responseInfo.data;
      const typePayload = {
        responsavel_id: infoData.responsavel_id,
        responsavel_name: infoData.responsavel_name,
        amparado_id: infoData.amparado_id,
        amparado_name: infoData.amparado_name,
      };

      store.dispatch(setUserType(typePayload));
    } catch (err) {
      console.warn('loadUserType failed', err);

      const typePayload = {
        responsavel_id: null,
        responsavel_name: null,
        amparado_id: null,
        amparado_name: null,
      };

      store.dispatch(setUserType(typePayload));
    }
  };

  useFocusEffect(
    useCallback(() => {
      const isActiveRef = { current: true };
      loadUserType(isActiveRef);
      return () => {
        isActiveRef.current = false;
      };
     }, [usuario.is_amparado, codigoAmp])
   );

  useEffect(() => {
    if (usuario.is_amparado && !codigoAmp) {
      createCodigo();
    }
  }, [usuario.is_amparado, codigoAmp]);

  const enviaCodigo = async () => {
    setIsLoadingSendCode(true);
    try {
      await api.post('responsavel/', { id: codigoCompleto });

      ToastNotify({
        type: 'success',
        title: 'Sucesso!',
        message: 'Vinculo criado com sucesso!',
        time: 2500,
      });
      setIsValid('');

      await loadUserType();
    } catch (err) {
      ToastNotify({
        type: 'error',
        title: 'Erro!',
        message: 'Ocorreu um erro ao criar o Vinculo!',
        time: 2500,
      });
    } finally {
      setIsLoadingSendCode(false);
    }
  };

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
          {usuario.is_amparado ? (<>
            <Texto style={[title, { left: 20, top: 35 }]}>
                 Código de Vinculação
             </Texto>
             <View 
               style={{
                 justifyContent: 'center',
                 alignItems: 'center',
                 flex: 0.75, 
             }}>
              <TouchableOpacity 
                style={{
                justifyContent: 'center',
                backgroundColor: colors.input,
                bottom: 30,
                borderWidth: 0.5,
                width: width * 0.8, 
                height: width * 0.13,
                borderRadius: 6
              }}
              >
                <Texto style={{ 
                  alignSelf: 'center',
                  letterSpacing: 25,
                  fontSize: 20,
                  fontWeight: 'bold',
                }}>
                  {codigoAmp}
                </Texto>
              </TouchableOpacity>
              <View 
                style={{ 
                  backgroundColor: colors.input,
                  padding: 10,
                  borderRadius: 6,
                  borderWidth: 0.8
                }}>
                <TouchableOpacity onPress={() => ClipboardModule.copy(codigoAmp)}>
                  <Clipboard />
                </TouchableOpacity>
              </View>
              <Texto style={{top: 10}}>Copiar Código</Texto>

                <TouchableOpacity 
                  disabled={loading}
                  onPress={() => GenNewCode()}
                >
                <View 
                  style={{ 
                    backgroundColor: !loading ? colors.primaryLight : 'grey',
                    borderRadius: 6,
                    top: 50,
                    width: width * 0.5,
                    height: width * 0.10,
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                  >
                    <Texto style={{color: colors.white}}>{!loading ? "Gerar Código" : <SpinningIcon text={false} color={colors.white} />}</Texto>
                </View>
                </TouchableOpacity>
            </View>
           </>) : (
            <View style={styles.wrapperNaoAmparado}>
              <Texto style={[title, {left: 20}]}>
                Vinculação de Amparado
              </Texto>
              <View style={{justifyContent: 'center', flex: 0.8, alignItems: 'center'}}>
                <OtpInput
                  length={6}
                  onKeyboardHide={() => {
                    isValid !== 'green' ? setIsValid(null) : null;
                  }}
                  onComplete={(e: any) => {
                    verifyCodigo(e);
                  }}
                  color={isValid}
                />
                <TouchableOpacity
                  onPress={() => enviaCodigo()}
                  disabled={isValid !== 'green'} 
                  style={{ 
                    backgroundColor: isValid === 'green' ? colors.primaryLight : 'grey', 
                    width: width * 0.5, 
                    height: width * 0.1, 
                    top: 45, 
                    borderRadius: 6,
                    justifyContent: 'center',
                  }}>

                  <View 
                    style={{ 
                      alignItems: 'center'
                    }}
                  >
                    <Texto 
                      style={{
                        color: colors.white
                      }}>
                        {!isLoading ? "Vincular Amparado" : <SpinningIcon text={false} color={colors.white} />}
                    </Texto>
                  </View>
                </TouchableOpacity>
                
              </View>
              <Texto style={{justifyContent: 'center', alignSelf: 'center', fontSize: 15, flex: 0.35 }}>
                Insira o código gerado na conta do Amparado!
              </Texto>
            </View>
          )}
          <FloatButton
            onPress={() => navigate.goBack()}
            title={"Voltar"}
            type='submit'
            position={'bottom'}
          />
          </>)}
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
    paddingVertical: 40,
  },
  botaoEnviar: {
    width: '100%',
    backgroundColor: colors.primaryLight
  },
});
