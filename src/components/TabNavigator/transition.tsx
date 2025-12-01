import { CardStyleInterpolators } from "@react-navigation/stack";

export function directionTransition(SCREEN_ORDER: string[]) {
  return ({ route, navigation }: any) => {
    const state = navigation.getState();

    if (
      !state ||
      !state.routes ||
      state.index == null ||
      !SCREEN_ORDER.includes(route.name)
    ) {
      return {
        animationEnabled: false,
      };
    }

    const currentRoute = state.routes[state.index].name;
    const currentIndex = SCREEN_ORDER.indexOf(currentRoute);
    const nextIndex = SCREEN_ORDER.indexOf(route.name);

    const slideFromLeft = ({ current, layouts }: any) => ({
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
    });

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

    // fallback
    return {
      gestureEnabled: true,
      cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
    };
  };
}
