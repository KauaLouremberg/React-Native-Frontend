import { StyleSheet } from 'react-native';
import { colors } from '../../core/constants/colors';
import { POPPINS } from '../../core/constants/poppins';
import { hexToRgba } from '../../core/utils/hex-to-rbg';

export const actionButton = StyleSheet.create({
  button: {
    width: 80,
    height: 80,
    borderWidth: 1,
    borderColor: hexToRgba(colors.border, 0.16),
    borderRadius: 8,
    backgroundColor: hexToRgba(colors.secondaryForeground, 0.04),
    gap: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: 24,
    color: colors.secondaryForeground,
  },
  text: {
    fontFamily: POPPINS.regular,
    fontSize: 12,
    color: colors.secondaryForeground,
  },
});
