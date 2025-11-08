import { LucideIcon } from 'lucide-react-native';
import { TouchableOpacityProps } from 'react-native';

export interface ActionButtonInteface extends TouchableOpacityProps {
  icon: LucideIcon;
  description: string;
}
