import { StyleSheet } from 'react-native';
import { colors } from '../../core/constants/colors';

const { white } = colors;

export const safeAreaStyle = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: white,
  },
});
