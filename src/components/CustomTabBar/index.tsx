import { TouchableOpacity, View } from "react-native";
import { colors } from "../../core/constants/colors";
import { TemplateWithChildrenStyle } from "../../styles/template/template-with-children-style";

export function CustomTabBar({ state, descriptors, navigation }: any) {

  const { footer, touchable } = TemplateWithChildrenStyle;
  
  return (
    <View style={footer}>
      {state.routes.map((route: any, index: any) => {
        const isFocused = state.index === index;
        const { options } = descriptors[route.key];
        const Icon = options.tabBarIcon;

        const onPress = () => {
          if (!isFocused) {
            navigation.navigate(route.name);
          }
        };

        return (
          <TouchableOpacity key={route.key} style={touchable} onPress={onPress}>
            <Icon size={24} color={isFocused ? colors.primaryLight : colors.neutral[500]} />
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
