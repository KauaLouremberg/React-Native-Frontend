import { createStackNavigator } from '@react-navigation/stack';
import Configuracoes from '../pages/Configuracoes';
import Dashboard from '../pages/Dashboard';
import MapScreen from '../pages/Dashboard/MapScreen';

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
