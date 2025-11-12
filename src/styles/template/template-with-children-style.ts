import { StyleSheet } from 'react-native';
import { colors } from '../../core/constants/colors';

export const TemplateWithChildrenStyle = StyleSheet.create({
  wrapper: {
    flex: 1,
    flexDirection: 'column',
  },
  content: {
    flex: 1,
  },
  footer: {
    width: '100%',
    backgroundColor: colors.white,
    height: 72,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 64,
  },
  touchable: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
