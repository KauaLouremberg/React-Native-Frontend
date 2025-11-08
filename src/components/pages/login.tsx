import { InfoIcon } from 'lucide-react-native';
import { View } from 'react-native';
import { colors } from '../../core/constants/colors';
import { loginStyle } from '../../styles/login/login-style';
import { Input } from '../input/input';
import { Texto } from '../texto';

export default function Login() {
  const {
    section,
    wrapper,
    container,
    text,
    title,
    loginWrapper,
    forgotPasswordText,
  } = loginStyle;

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
        <Input label="Login" placeholder="Login" />
        <Input label="Senha" placeholder="Senha" isPassword />
        <Texto style={forgotPasswordText} align="right">
          Esqueceu sua senha?
        </Texto>
      </View>
    </View>
  );
}
