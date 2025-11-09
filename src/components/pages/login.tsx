import AsyncStorage from '@react-native-async-storage/async-storage';
import { Globe, InfoIcon, User } from "lucide-react-native";
import { useMemo, useState } from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import { colors } from '../../core/constants/colors';
import { ActionButtonInteface } from '../../core/interface/action-button-interface';
import { loginStyle } from '../../styles/login/login-style';
import { ActionButton } from '../buttons/action-button';
import { ButtonCore } from '../buttons/button-core';
import api from '../conexao/api';
import { ToastNotify } from '../ElementosForm/Toast';
import { Input } from '../input/input';
import { Texto } from '../texto';

export default function Login({ navigation }: any) {
  const {
    section,
    wrapper,
    container,
    text,
    title,
    loginWrapper,
    forgotPasswordText,
    buttonWrapper,
    clickHereWrapper,
    actionButtonWrapper,
    justiceWrapper,
  } = loginStyle;
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (username === '' || password === '') {
      ToastNotify({
        type: 'error',
        title: 'Erro!',
        message: 'Usuário e Senha nao podem estar vazios',
        time: 1500,
      });
      return;
    }

    try {
      const res = await api.post('login/', {
        username,
        password,
      });

      const { access, refresh } = res.data;

      await AsyncStorage.setItem('accessToken', access);
      await AsyncStorage.setItem('refreshToken', refresh);

      ToastNotify({
        type: 'success',
        title: 'Sucesso!',
        message: `Seja Bem-Vindo ${username}`,
        time: 1500,
      });
      navigation.navigate('Dashboard');
    } catch {
      ToastNotify({
        type: 'error',
        title: 'Erro!',
        message: 'Usuário ou senha incorretos!',
        time: 2500,
      });
    }
  };

  const values = useMemo<ActionButtonInteface[]>(
    () => [
      {
        icon: Globe,
        description: 'Website',
      },
      {
        icon: User,
        description: 'Suporte',
      },
      {
        icon: InfoIcon,
        description: 'Sobre nós',
      },
    ],
    [],
  );

  return (
    <ScrollView
      id="login-section"
      style={section}
      keyboardShouldPersistTaps="handled"
    >
      <View style={wrapper}>
        <View style={container}>
          <Texto style={text}>Bem-vindo ao Amparo.</Texto>
          <InfoIcon color={colors.neutral[500]} size={16} />
        </View>
        <Texto style={title}>Acesse sua conta aqui.</Texto>
      </View>

      <View style={loginWrapper}>
        <Input
          label="Login"
          placeholder="Login"
          value={username}
          onChangeText={setUsername}
        />
        <Input
          label="Senha"
          placeholder="Senha"
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity activeOpacity={0.6}>
          <Texto style={forgotPasswordText} align="right">
            Esqueceu sua senha?
          </Texto>
        </TouchableOpacity>

        <View style={buttonWrapper}>
          <ButtonCore onPress={handleLogin}>Entrar</ButtonCore>
        </View>

        <View style={clickHereWrapper}>
          <Texto>Ainda não possui uma conta? </Texto>
          <Texto style={forgotPasswordText}>Toque aqui</Texto>
        </View>
      </View>

      <View style={actionButtonWrapper}>
        <ActionButton values={values} />
      </View>

      <View style={justiceWrapper}>
        <Texto align="center">
          © 2025 Amparo. Todos os direitos reservados.
        </Texto>
      </View>
    </ScrollView>
  );
}
