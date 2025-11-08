import { StyleSheet } from 'react-native';
import { colors } from '../../core/constants/colors';
import { POPPINS } from '../../core/constants/poppins';

export const ButtonStyle = StyleSheet.create({
  button: {
    width: '100%',
    height: 72,
    backgroundColor: colors.primary,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontFamily: POPPINS.medium,
    fontSize: 16,
    color: colors.white,
  },
});
