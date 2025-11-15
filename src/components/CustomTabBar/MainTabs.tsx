import { BookMarked, Home, MapPin, Settings } from "lucide-react-native";
import { CustomTabBar } from ".";
import { ConfigStackScreen, DashboardStackScreen, MapaStackScreen } from "../PagesStack";
import Tab from "../TabNavigator";


export function MainTabs() {
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardStackScreen}
        options={{
          tabBarIcon: Home,
        }}
      />

      <Tab.Screen
        name="Mapa"
        component={MapaStackScreen}
        options={{
          tabBarIcon: MapPin,
        }}
      />

      <Tab.Screen
        name="Bookmarks"
        component={DashboardStackScreen}
        options={{
          tabBarIcon: BookMarked,
        }}
      />

      <Tab.Screen
        name="Configuracoes"
        component={ConfigStackScreen}
        options={{
          tabBarIcon: Settings,
        }}
      />
    </Tab.Navigator>
  );
}
