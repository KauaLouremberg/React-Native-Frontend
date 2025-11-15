import { CommonActions, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import {
  BookMarked,
  Home,
  LucideIcon,
  MapPin,
  Settings,
} from 'lucide-react-native';
import React, { useMemo } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { colors } from '../../core/constants/colors';
import { TemplateWithChildrenStyle } from '../../styles/template/template-with-children-style';

type FooterType = {
  icon: LucideIcon;
  route: string;
  fn: () => void;
};

interface TemplateWithChildrenProp {
  children: React.ReactNode;
  navigation: StackNavigationProp<any>;
}

const { wrapper, footer, touchable } = TemplateWithChildrenStyle;

function navigateWithTransition(navigation: StackNavigationProp<any>, target: string, current: string) {
  if (target === current) return;

  navigation.dispatch(
    CommonActions.navigate({
      name: target,
      key: `${target}-${Date.now()}`,
    } as any),
  );
}

export function TemplateWithChildren({
  children,
  navigation,
}: TemplateWithChildrenProp) {
  const route = useRoute();

  const FOOTER_MAP = useMemo<FooterType[]>(
    () => [
      {
        icon: Home,
        route: 'Dashboard',
        fn: () => navigateWithTransition(navigation, 'Dashboard', route.name),
      },
      {
        icon: MapPin,
        route: 'Mapa',
        fn: () => navigateWithTransition(navigation, 'Mapa', route.name),
      },
      {
        icon: BookMarked,
        route: 'Bookmarks',
        fn: () => null,
      },
      {
        icon: Settings,
        route: 'Configuracoes',
        fn: () => navigateWithTransition(navigation, 'Configuracoes', route.name),
      },
    ],
    [navigation, route.name],
  );

  return (
    <View style={wrapper}>
      <View style={TemplateWithChildrenStyle.content}>{children}</View>

      <View>
        <View style={footer}>
          {FOOTER_MAP.map(({ icon: Icon, fn, route: routeName }, idx) => {
            const isActive = route.name === routeName;

            return (
              <TouchableOpacity key={idx} style={touchable} onPress={fn}>
                <View>
                  <Icon
                    size={24}
                    color={isActive ? colors.primaryLight : colors.neutral[500]}
                  />
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </View>
  );
}
