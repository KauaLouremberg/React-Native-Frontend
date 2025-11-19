import 'react-native-reanimated';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { KeyboardAvoidingView, Platform } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { Provider } from 'react-redux';

import Register from './components/pages/Dashboard/Register';
import Login from './components/pages/login';
import store from './store';

import notifee, { AndroidImportance } from '@notifee/react-native';
import { useEffect } from 'react';
import { MainTabs } from './components/CustomTabBar/MainTabs';
import Amparado from './components/pages/Amparado';
import { directionTransition } from './components/TabNavigator/transition';
import { gestureStyle } from './styles/gesture/gesture-style';
import { keyboardStyle } from './styles/keyboard/keyboard-style';
import { safeAreaStyle } from './styles/safe-area/safe-area-style';

const Stack = createStackNavigator();

export const SCREEN_ORDER = ['Login', 'Register', 'Dashboard', 'Mapa', 'Configuracoes'];

function App() {
  const queryClient = new QueryClient();

  const { keyboard: Keyboard } = keyboardStyle;
  const { safeArea: SafeArea } = safeAreaStyle;
  const { gesture: Gesture } = gestureStyle;

  async function configureNotificationChannel() {
    await notifee.createChannel({
      id: 'amparo_channel',
      name: 'Amparo',
      importance: AndroidImportance.HIGH,
      sound: 'default',
    });
  }

  useEffect(() => {
    configureNotificationChannel();
  }, []);

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
                <Stack.Navigator
                  initialRouteName="Login"
                  screenOptions={directionTransition(SCREEN_ORDER)}
                >
                  <Stack.Screen
                    name="Login"
                    component={Login}
                    options={{ headerShown: false }}
                  />

                  <Stack.Screen
                    name="Register"
                    component={Register}
                    options={{ headerShown: false }}
                  />

                  <Stack.Screen
                    name="Amparado-Register"
                    component={Amparado}
                    options={{ headerShown: false}}
                  />
                  
                  <Stack.Screen
                    name="MainTabs"
                    component={MainTabs}
                    options={{ headerShown: false }}
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
