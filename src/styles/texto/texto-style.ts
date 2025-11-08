import sv from 'style-variants';
import { colors } from '../../core/constants/colors';
import { POPPINS } from '../../core/constants/poppins';

export const textoStyle = sv({
  base: {
    color: colors.neutral[900],
    fontSize: 14,
    fontFamily: POPPINS.regular,
    lineHeight: 25,
  },
  variants: {
    align: {
      left: {
        textAlign: 'left',
      },
      right: {
        textAlign: 'right',
      },
      center: {
        textAlign: 'center',
      },
    },
  },
  defaultVariants: {
    align: 'left',
  },
});
