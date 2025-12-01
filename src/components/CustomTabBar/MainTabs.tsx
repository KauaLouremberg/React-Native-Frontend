import { createStackNavigator } from '@react-navigation/stack';
import { BookMarked, Home, MapPin, Settings } from 'lucide-react-native';
import { CustomTabBar } from '.';
import Tab from '../TabNavigator';

import Configuracoes from '../pages/Configuracoes';
import Dashboard from '../pages/Dashboard';
import MapScreen from '../pages/Dashboard/MapScreen';
import { MarkedsPage } from '../pages/Markeds/page';

const DashboardStack = createStackNavigator();

export function DashboardStackScreen() {
  return (
    <DashboardStack.Navigator screenOptions={{ headerShown: false }}>
      <DashboardStack.Screen name="Dashboard" component={Dashboard} />
    </DashboardStack.Navigator>
  );
}

const MapaStack = createStackNavigator();

export function MapaStackScreen() {
  return (
    <MapaStack.Navigator screenOptions={{ headerShown: false }}>
      <MapaStack.Screen name="Mapa" component={MapScreen} />
    </MapaStack.Navigator>
  );
}

const ConfigStack = createStackNavigator();

export function ConfigStackScreen() {
  return (
    <ConfigStack.Navigator screenOptions={{ headerShown: false }}>
      <ConfigStack.Screen name="Configuracoes" component={Configuracoes} />
    </ConfigStack.Navigator>
  );
}

const MarkedsStack = createStackNavigator();

export function MarkedsStackScreen() {
  return (
    <MarkedsStack.Navigator screenOptions={{ headerShown: false }}>
      <MarkedsStack.Screen name="Marcacoes" component={MarkedsPage} />
    </MarkedsStack.Navigator>
  );
}

export function MainTabs() {
  return (
    <Tab.Navigator
      tabBar={props => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardStackScreen}
        options={{ tabBarIcon: Home }}
      />

      <Tab.Screen
        name="Mapa"
        component={MapaStackScreen}
        options={{ tabBarIcon: MapPin }}
      />

      <Tab.Screen
        name="Bookmarks"
        component={MarkedsStackScreen}
        options={{ tabBarIcon: BookMarked }}
      />

      <Tab.Screen
        name="Configuracoes"
        component={ConfigStackScreen}
        options={{ tabBarIcon: Settings }}
      />
    </Tab.Navigator>
  );
}
