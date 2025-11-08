import { View } from 'react-native';
import { loginStyle } from '../../styles/login/login-style';
import { Texto } from '../texto';

export default function Login() {
  const { section, text } = loginStyle;

  return (
    <View id="login-section" style={section}>
      <View>
        <Texto style={text}>Bem-vindo ao Amparo.</Texto>
      </View>
    </View>
  );
}
