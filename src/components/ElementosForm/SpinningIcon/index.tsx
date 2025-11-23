import React, { useEffect, useRef } from "react";
import { Animated, Easing } from "react-native";
import AntDesign from "react-native-vector-icons/AntDesign";

export default function SpinningIcon({ size = 24, color = "#fff", style }: any) {
  const spinValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 800,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const rotate = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <Animated.View
      style={[{
        width: size,
        height: size,
        justifyContent: "center",
        alignItems: "center",
        transform: [{ rotate }],
      },
      style
    ]}
    >
      <AntDesign name="loading1" size={size * 0.8} color={color} />
    </Animated.View>
  );
}
