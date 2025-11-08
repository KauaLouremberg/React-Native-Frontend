import { StyleSheet } from 'react-native';
import { colors } from '../../core/constants/colors';
import { POPPINS } from '../../core/constants/poppins';

export const loginStyle = StyleSheet.create({
  section: {
    paddingTop: 40,
    paddingHorizontal: 24,
  },
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  text: {
    color: colors.neutral[500],
    fontFamily: POPPINS.medium,
  },
});
