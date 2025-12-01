import 'react-native-reanimated';

import messaging from '@react-native-firebase/messaging';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppState, KeyboardAvoidingView, Platform } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

import Register from './components/pages/Dashboard/Register';
import Login from './components/pages/login';

import notifee, { AndroidImportance } from '@notifee/react-native';
import { useEffect } from 'react';
import { MainTabs } from './components/CustomTabBar/MainTabs';
import Amparado from './components/pages/Amparado';
import AuthLoading from './components/pages/AuthLoading';
import TrackingService from './components/pages/Dashboard/MapScreen/trackingService';
import { Requisitions } from './components/PagesStack';
import { directionTransition } from './components/TabNavigator/transition';
import { gestureStyle } from './styles/gesture/gesture-style';
import { keyboardStyle } from './styles/keyboard/keyboard-style';
import { safeAreaStyle } from './styles/safe-area/safe-area-style';

const Stack = createStackNavigator();

export const SCREEN_ORDER = ['AuthLoading', 'Login', 'Register', 'Dashboard', 'Mapa', 'Configuracoes'];

let currentState = AppState.currentState;

AppState.addEventListener("change", (nextState) => {

  if (nextState === "background") {
    console.log("App em background → iniciar serviço nativo");
    TrackingService.startNative();
  }

  if (currentState === "background" && nextState === "active") {
    console.log("App voltou ao foreground → parar serviço nativo");
    TrackingService.stopNative();
  }

  currentState = nextState;
});

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

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log("Notificação recebida em foreground:", remoteMessage);

      await notifee.displayNotification({
        title: remoteMessage.notification?.title || 'Nova Notificação',
        body: remoteMessage.notification?.body || 'Você recebeu uma nova mensagem.',
        android: {
          channelId: 'amparo_channel',
          importance: AndroidImportance.HIGH,
          pressAction: { id: 'default' },
          smallIcon: 'ic_location'
        },
      });
    });

    return unsubscribe;
  }, [messaging]);


  return (
    <QueryClientProvider client={queryClient}>
        <GestureHandlerRootView style={Gesture}>
          <SafeAreaView style={SafeArea} edges={['bottom', 'left', 'right']}>
            <KeyboardAvoidingView
              style={Keyboard}
              behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
              <NavigationContainer>
                <Stack.Navigator
                  initialRouteName={'AuthLoading'}
                  screenOptions={directionTransition(SCREEN_ORDER)}
                >

                  <Stack.Screen
                    name="AuthLoading"
                    component={AuthLoading}
                    options={{ headerShown: false }}
                  />

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
                    name="Requisitions"
                    component={Requisitions}
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
    </QueryClientProvider>
  );
}

export default App;
