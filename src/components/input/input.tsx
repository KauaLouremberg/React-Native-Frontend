import { TextInput, TextInputProps, View } from 'react-native';
import { colors } from '../../core/constants/colors';
import { inputStyle } from '../../styles/input/input';
import { Texto } from '../texto';

export interface InputInterface extends TextInputProps {
  label: string;
  placeholder: string;
}

export function Input({ label, placeholder, style, ...rest }: InputInterface) {
  const { container, label: Label, input } = inputStyle;

  return (
    <View style={container}>
      <Texto style={Label}>{label}</Texto>

      <TextInput
        style={[input, style]}
        {...rest}
        placeholder={placeholder}
        placeholderTextColor={colors.neutral[500]}
        autoCorrect={false}
        spellCheck={false}
        underlineColorAndroid="transparent"
        autoComplete="off"
        importantForAutofill="no"
        keyboardType="visible-password"
      />
    </View>
  );
}
