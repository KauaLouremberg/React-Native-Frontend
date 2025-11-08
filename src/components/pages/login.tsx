import AsyncStorage from '@react-native-async-storage/async-storage';
import { InfoIcon } from 'lucide-react-native';
import { useState } from 'react';
import { Button, View } from 'react-native';
import { colors } from '../../core/constants/colors';
import { loginStyle } from '../../styles/login/login-style';
import api from '../conexao/api';
import { ToastNotify } from '../ElementosForm/Toast';
import { Input } from '../input/input';
import { Texto } from '../texto';

export default function Login({ navigation }: any) {
  const { section, wrapper, container, text, title, loginWrapper } = loginStyle;
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const res = await api.post('login/', {
        username,
        password,
      });

      const { access, refresh } = res.data;

      await AsyncStorage.setItem('accessToken', access);
      await AsyncStorage.setItem('refreshToken', refresh);

      ToastNotify({ type: 'success', title: 'Sucesso!', message: `Seja Bem-Vindo ${username}` });
      navigation.navigate('Dashboard');
    } catch (err: any) {
      ToastNotify({ type: 'error', title: 'Erro!', message: 'Usuário ou senha incorretos!' });
    }
  };

  return (
    <View id="login-section" style={section}>
      <View style={wrapper}>
        <View style={container}>
          <Texto style={text}>Bem-vindo ao Amparo.</Texto>
          <InfoIcon color={colors.neutral[500]} size={16} />
        </View>
        <Texto style={title}>Acesse sua conta aqui.</Texto>
      </View>

      <View style={loginWrapper}>
        <Input label="Login" placeholder="Login" value={username} onChangeText={setUsername} />
        <Input label="Senha" placeholder="Senha" value={password} onChangeText={setPassword}/>
        <Button title="Logar" onPress={handleLogin} />
      </View>
    </View>
  );
}   
