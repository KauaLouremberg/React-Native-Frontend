import { PropsWithChildren } from 'react';
import { Text, TextProps } from 'react-native';
import { TextAlignOptions } from '../core/types/text-align-options';
import { textoStyle } from '../styles/texto/texto-style';

export interface DescriptionProps extends TextProps {
  align?: TextAlignOptions;
}

export function Texto({
  children,
  style,
  align,
  ...rest
}: PropsWithChildren<DescriptionProps>) {
  return (
    <Text style={[textoStyle({ align }), style]} {...rest}>
      {children}
    </Text>
  );
}
