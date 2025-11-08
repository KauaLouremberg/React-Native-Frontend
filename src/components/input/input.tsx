import { Eye, EyeOff } from 'lucide-react-native';
import React, { useState } from 'react';
import {
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
} from 'react-native';
import { colors } from '../../core/constants/colors';
import { inputStyle } from '../../styles/input/input';
import { Texto } from '../texto';

export interface InputInterface extends TextInputProps {
  label: string;
  placeholder: string;
  isPassword?: boolean;
}

export function Input({
  label,
  placeholder,
  style,
  isPassword = false,
  ...rest
}: InputInterface) {
  const { container, label: Label, input, textContainer, icon } = inputStyle;

  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={container}>
      <Texto style={Label}>{label}</Texto>

      <View style={textContainer}>
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
          secureTextEntry={isPassword && !showPassword}
        />

        {isPassword && (
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={icon}
          >
            {showPassword ? (
              <EyeOff size={20} color={colors.neutral[500]} />
            ) : (
              <Eye size={20} color={colors.neutral[500]} />
            )}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
