import { StyleSheet } from 'react-native';
import { colors } from '../../core/constants/colors';
import { POPPINS } from '../../core/constants/poppins';

export const inputStyle = StyleSheet.create({
  container: {
    gap: 4,
  },
  label: {
    fontFamily: POPPINS.medium,
    color: colors.heading,
    fontSize: 14,
  },
  textContainer: {
    position: 'relative',
    width: '100%',
  },
  input: {
    width: '100%',
    paddingLeft: 24,
    paddingRight: 48,
    height: 64,
    borderWidth: 1,
    borderRadius: 16,
    borderColor: colors.border,
    backgroundColor: colors.input,
    fontFamily: POPPINS.regular,
    color: colors.neutral[500],
  },
  inputFocused: {
    borderColor: colors.primaryLight,
  },
  icon: {
    position: 'absolute',
    right: 16,
    top: '50%',
    transform: [{ translateY: -12 }],
  },
  errorMessage: {
    color: colors.danger,
    fontFamily: POPPINS.regular,
    fontSize: 14,
  },
});
