import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import Header from './components/HeaderComponent';
import Configuracoes from './components/pages/Configuracoes';
import Dashboard from './components/pages/Dashboard';
import Login from './components/pages/login';
import { gestureStyle } from './styles/gesture/gesture-style';
import { keyboardStyle } from './styles/keyboard/keyboard-style';
import { safeAreaStyle } from './styles/safe-area/safe-area-style';

function App() {
  const Stack = createNativeStackNavigator();

  const { keyboard: Keyboard } = keyboardStyle;
  const { safeArea: SafeArea } = safeAreaStyle;
  const { gesture: Gesture } = gestureStyle;
  const [currentRoute, setCurrentRoute] = useState<string | undefined>('Login');

  return (
    <GestureHandlerRootView style={Gesture}>
      <SafeAreaView style={SafeArea} edges={['bottom', 'left', 'right']}>
        <KeyboardAvoidingView
          style={Keyboard}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <NavigationContainer
            onReady={() => setCurrentRoute('Login')}
            onStateChange={(state) => {
              const route = state?.routes[state.index];
              setCurrentRoute(route?.name);
            }}
            >
              
            {currentRoute !== 'Login' && <Header />}
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
                component={Dashboard}
                options={{
                  headerShown: false,
                  headerTransparent: true,
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
                component={Configuracoes}
                options={{
                  headerShown: false,
                  headerTransparent: true,
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
  );
}
export default App;
