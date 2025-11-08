import { InfoIcon } from 'lucide-react-native';
import { View } from 'react-native';
import { colors } from '../../core/constants/colors';
import { loginStyle } from '../../styles/login/login-style';
import { Texto } from '../texto';

export default function Login() {
  const { section, container, text } = loginStyle;

  return (
    <View id="login-section" style={section}>
      <View style={container}>
        <Texto style={text}>Bem-vindo ao Amparo.</Texto>
        <InfoIcon color={colors.neutral[500]} size={16} />
      </View>
    </View>
  );
}
