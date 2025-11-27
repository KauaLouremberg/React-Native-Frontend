import { LoaderCircle } from 'lucide-react-native';
import React, { useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';
import { colors } from '../../../core/constants/colors';
import { Texto } from '../../texto';

export default function SpinningIcon({
  size = 24,
  color = colors.primary,
  style,
}: any) {
  const spinValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 1200,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );

    animation.start();

    return () => animation.stop();
  }, [spinValue]);

  const rotate = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Animated.View
      style={[
        {
          width: '100%',
          height: size,
          justifyContent: 'center',
          alignItems: 'center',
        },
        style,
      ]}
    >
      <Animated.View
        style={{
          transform: [{ rotate }],
        }}
      >
        <LoaderCircle size={size * 1.2} color={color} />
      </Animated.View>
      <Texto style={{ color: colors.heading }}>
        Estamos preparando o sistema para você!
      </Texto>
    </Animated.View>
  );
}
