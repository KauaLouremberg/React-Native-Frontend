import { Globe } from 'lucide-react-native';
import { TouchableOpacity } from 'react-native';
import { ActionButtonInteface } from '../../core/interface/action-button-interface';
import { actionButton } from '../../styles/button/action-button';
import { Texto } from '../texto';

type ActionButtonProp = {
  values: ActionButtonInteface[];
};

export function ActionButton({ values }: ActionButtonProp) {
  const { button, text, icon } = actionButton;

  return values.map(({ icon: Icon = Globe, description }, idx) => (
    <TouchableOpacity style={button} activeOpacity={0.6} key={idx}>
      <Icon size={24} style={icon} />
      <Texto style={text}>{description}</Texto>
    </TouchableOpacity>
  ));
}
