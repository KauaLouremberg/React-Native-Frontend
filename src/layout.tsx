import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { KeyboardAvoidingView, Platform } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { Provider } from 'react-redux';

import Configuracoes from './components/pages/Configuracoes';
import Dashboard from './components/pages/Dashboard';
import MapScreen from './components/pages/Dashboard/MapScreen';
import Login from './components/pages/login';
import { TemplateWithChildren } from './components/TemplateComponent';
import store from './store';
import { gestureStyle } from './styles/gesture/gesture-style';
import { keyboardStyle } from './styles/keyboard/keyboard-style';
import { safeAreaStyle } from './styles/safe-area/safe-area-style';

const withTemplate = (Component: React.ComponentType) => {
  return (props: any) => (
    <TemplateWithChildren navigation={props.navigation}>
      <Component {...props} />
    </TemplateWithChildren>
  );
};

function App() {
  const Stack = createNativeStackNavigator();

  const { keyboard: Keyboard } = keyboardStyle;
  const { safeArea: SafeArea } = safeAreaStyle;
  const { gesture: Gesture } = gestureStyle;

  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <GestureHandlerRootView style={Gesture}>
          <SafeAreaView style={SafeArea} edges={['bottom', 'left', 'right']}>
            <KeyboardAvoidingView
              style={Keyboard}
              behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
              <NavigationContainer>
                <Stack.Navigator initialRouteName="Login">
                  <Stack.Screen
                    name="Login"
                    component={Login}
                    options={{
                      headerShown: false,
                      gestureEnabled: true,
                      fullScreenGestureEnabled: true,
                      animation: Platform.select({
                        ios: 'default',
                        android: 'slide_from_right',
                      }),
                    }}
                  />
                  <Stack.Screen
                    name="Dashboard"
                    component={withTemplate(Dashboard)}
                    options={{
                      headerShown: false,
                      gestureEnabled: true,
                      fullScreenGestureEnabled: true,
                      animation: Platform.select({
                        ios: 'default',
                        android: 'default',
                      }),
                    }}
                  />
                  <Stack.Screen
                    name="Configuracoes"
                    component={withTemplate(Configuracoes)}
                    options={{
                      headerShown: false,
                      gestureEnabled: true,
                      fullScreenGestureEnabled: true,
                      animation: Platform.select({
                        ios: 'default',
                        android: 'slide_from_right',
                      }),
                    }}
                  />

                  <Stack.Screen
                    name="Mapa"
                    component={withTemplate(MapScreen)}
                    options={{
                      headerShown: false,
                      gestureEnabled: true,
                      fullScreenGestureEnabled: true,
                      animation: Platform.select({
                        ios: 'default',
                        android: 'slide_from_right',
                      }),
                    }}
                  />
                </Stack.Navigator>
              </NavigationContainer>
              <Toast />
            </KeyboardAvoidingView>
          </SafeAreaView>
        </GestureHandlerRootView>
      </Provider>
    </QueryClientProvider>
  );
}
export default App;
