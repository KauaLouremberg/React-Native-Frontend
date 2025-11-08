import { StyleSheet } from 'react-native';
import { colors } from '../../core/constants/colors';
import { POPPINS } from '../../core/constants/poppins';

export const loginStyle = StyleSheet.create({
  section: {
    flex: 1,
    paddingTop: 40,
    paddingHorizontal: 24,
  },
  wrapper: {
    gap: 20,
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  text: {
    color: colors.neutral[500],
    fontFamily: POPPINS.medium,
  },
  title: {
    width: 224,
    fontSize: 24,
    fontFamily: POPPINS.medium,
    color: colors.heading,
  },
  loginWrapper: {
    marginTop: 50,
    gap: 24,
  },
  forgotPasswordText: {
    color: colors.primary,
    fontFamily: POPPINS.medium,
    fontSize: 13,
  },
  buttonWrapper: {
    marginTop: 8,
  },
  clickHereWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
});
