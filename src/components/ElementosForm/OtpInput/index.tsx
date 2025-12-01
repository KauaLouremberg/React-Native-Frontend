import React, { useRef, useState } from "react";
import { Animated, StyleSheet, TextInput, useWindowDimensions, View } from "react-native";

export default function OtpInput({
  length = 6,
  onComplete,
  onChange,
  color = "#0066FF",
  autoFocus = true,
}: any) {
  const { width } = useWindowDimensions();

  const totalSpacing = 12 * (length - 1);
  const boxSize = (width - totalSpacing - 55) / length;
  const size = Math.min(boxSize, 60);

  const [values, setValues] = useState(Array(length).fill(""));
  const [focusedIndex, setFocusedIndex] = useState<number | null>(0);
  const inputsRef = useRef<any>([]);

  const scales = useRef(
    Array(length)
      .fill(0)
      .map(() => new Animated.Value(1))
  ).current;

  function animate(index: number, to: number) {
    Animated.spring(scales[index], {
      toValue: to,
      useNativeDriver: true,
      speed: 12,
      bounciness: 6,
    }).start();
  }

  function handleChange(text: any, index: any) {
    const newValues = [...values];
    newValues[index] = text.slice(-1);
    setValues(newValues);

    onChange && onChange(newValues.join(""));

    if (text && index < length - 1) {
      inputsRef.current[index + 1].focus();
    }

    if (newValues.every((v) => v !== "")) {
      onComplete && onComplete(newValues.join(""));
    }
  }

  function handleKeyPress(e: any, index: any) {
    if (
      e.nativeEvent.key === "Backspace" &&
      values[index] === "" &&
      index > 0
    ) {
      inputsRef.current[index - 1].focus();
    }
  }

  return (
    <View style={styles.container}>
      {Array.from({ length }).map((_, index) => (
        <Animated.View
          key={index}
          style={{
            transform: [{ scale: scales[index] }],
          }}
        >
          <TextInput
            ref={(ref) => (inputsRef.current[index] = ref) as any}
            style={[
              styles.box,
              {
                width: size,
                height: size,
                borderRadius: size * 0.25,
                borderColor:
                  color,
                borderWidth: focusedIndex === index ? 2 : 1,
              },
            ]}
            value={values[index]}
            maxLength={1}
            autoFocus={autoFocus && index === 0}
            onFocus={() => {
              setFocusedIndex(index);
              animate(index, 1.1);
            }}
            onBlur={() => {
              animate(index, 1);
              setFocusedIndex(null);
            }}
            onChangeText={(t) => handleChange(t, index)}
            onKeyPress={(e) => handleKeyPress(e, index)}
          />
        </Animated.View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 12,
    justifyContent: "center",
    marginVertical: 5,
  },
  box: {
    backgroundColor: "#fff",
    textAlign: "center",
    fontSize: 20,
    fontWeight: "500",
  },
});
