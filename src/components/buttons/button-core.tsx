import React from 'react';
import { Text, TouchableOpacity, TouchableOpacityProps } from 'react-native';
import { ButtonStyle } from '../../styles/button/ button';

export interface ButtonCoreProps extends TouchableOpacityProps {
  children: React.ReactNode;
}

export function ButtonCore({ children, style, ...rest }: ButtonCoreProps) {
  const { button, title } = ButtonStyle;

  return (
    <TouchableOpacity activeOpacity={0.8} style={[button, style]} {...rest}>
      <Text style={title}>{children}</Text>
    </TouchableOpacity>
  );
}
