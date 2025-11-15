import { CardStyleInterpolators } from "@react-navigation/stack";

export function directionTransition(SCREEN_ORDER: string | any[]) {
  return ({ route, navigation }: any) => {
    const state = navigation.getState();

    const slideFromLeft = ({ current, layouts }: any) => {
      return {
        cardStyle: {
          transform: [
            {
              translateX: current.progress.interpolate({
                inputRange: [0, 1],
                outputRange: [-layouts.screen.width, 0],
              }),
            },
          ],
        },
      };
    };

    if (!state || !state.routes || state.index == null) {
      return {
        gestureEnabled: true,
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      };
    }

    const currentRoute = state.routes[state.index].name;

    const currentIndex = SCREEN_ORDER.indexOf(currentRoute);
    const nextIndex = SCREEN_ORDER.indexOf(route.name);

    if (nextIndex > currentIndex) {
      return {
        gestureEnabled: true,
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      };
    }

    if (nextIndex < currentIndex) {
      return {
        gestureEnabled: true,
        cardStyleInterpolator: slideFromLeft,
      };
    }

    return {
      gestureEnabled: true,
      cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
    };
  };
}
