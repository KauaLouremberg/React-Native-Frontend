'use client';
import { Eye, EyeOff } from 'lucide-react-native';
import React, { Fragment, useState } from 'react';
import {
  Keyboard,
  Platform,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { colors } from '../../core/constants/colors';
import { inputStyle } from '../../styles/input/input';
import { Texto } from '../texto';

export interface InputInterface extends TextInputProps {
  label: string;
  placeholder?: string;
  isPassword?: boolean;
  error?: string;
  variant?: 'form' | 'small' | string;
  maxLength?: number;
  inputMode?: 'text' | 'decimal' | 'numeric' | 'tel' | 'search' | 'email' | 'url' |  any;
}

/**
 * @Params
 * 
 * @String Label => Titulo acima do input
 * @String PlaceHolder => Valor de dentro do input
 * @Boolean isPassword => Alternar modo do input para senha
 * @String error => Mensagem de erro abaixo do input
 * @String variant => form | small
 * @String maxLength => Quantidade maxima de caracteres
 * @String inputMode => Modes do input (text | decimal | numeric | tel | search | email | url) 
 */

export function Input({
  label,
  placeholder,
  style,
  isPassword = false,
  error,
  variant,
  maxLength,
  inputMode,
  ...rest
}: InputInterface) {
  const {
    container,
    label: Label,
    input,
    textContainer,
    icon,
    inputFocused,
    errorMessage,
  } = inputStyle;

  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  return (
    <Fragment>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={container}>
          <Texto style={Label}>{label}</Texto>

          <View style={textContainer}>
            <TextInput
              selectionColor={colors.primaryLight}
              style={[
                input,
                isFocused ? inputFocused : null,
                variant ? (inputStyle as any)[variant] : null,
                style,
              ]}
              placeholder={placeholder}
              placeholderTextColor={colors.neutral[500]}
              autoCorrect={false}
              spellCheck={false}
              inputMode={inputMode ? inputMode : 'text'}
              maxLength={maxLength ? maxLength : 255}
              underlineColorAndroid="transparent"
              autoComplete="off"
              importantForAutofill="no"
              secureTextEntry={isPassword && !showPassword}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              {...(Platform.OS === 'android'
                ? {
                    includeFontPadding: false,
                    allowFontScaling: false,
                  }
                : {
                    allowFontScaling: false,
                  })}
              {...rest}
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
            {error && <Texto style={errorMessage}>{error}</Texto>}
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Fragment>
  );
}
