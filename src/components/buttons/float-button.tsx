import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function FloatButton({
  title = 'Botão',
  onPress,
  backgroundColor = '#007AFF',
  color = '#fff',
  position,
  style,
}: any) {
  return (
    <View
      style={[
        styles.container,
        position === 'bottom' && styles.bottom,
        position === 'top' && styles.top,
        position === 'floating' && styles.floating,
      ]}
    >
      <TouchableOpacity
        style={[styles.button, style, { backgroundColor }]}
        onPress={onPress}
        activeOpacity={0.8}
      >
        <Text style={[styles.text, { color }]}>{title}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottom: {
    bottom: 10,
  },
  top: {
    top: 0,
  },
  floating: {
    bottom: 20,
    right: 20,
    alignItems: 'flex-end',
  },
  button: {
    width: '90%',
    height: 45,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
  },
  text: {
    fontSize: 15,
    fontWeight: 'bold',
  },
});
