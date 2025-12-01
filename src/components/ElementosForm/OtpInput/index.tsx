import React, { useRef, useState } from "react";
import { StyleSheet, TextInput, useWindowDimensions, View } from "react-native";

export default function OtpInput({
  length = 6,
  onComplete,
  onChange,
  color = ''
}: any) {
  const { width } = useWindowDimensions();

  const totalSpacing = 12 * (length - 1);
  const boxSize = (width - totalSpacing - 55) / length;
  const size = Math.min(boxSize, 60);

  const [values, setValues] = useState(Array(length).fill(""));
  const inputsRef = useRef<any>([]);

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
        <TextInput
          key={index}
          ref={(ref) => (inputsRef.current[index] = ref) as any}
          style={[
            styles.box,
            { width: size, height: size, borderRadius: size * 0.25, borderColor: color},
          ]}
          value={values[index]}
          keyboardType="numeric"
          maxLength={1}
          onChangeText={(t) => handleChange(t, index)}
          onKeyPress={(e) => handleKeyPress(e, index)}
        />
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
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#fff",
    textAlign: "center",
    fontSize: 20,
    fontWeight: "500",
  },
});
