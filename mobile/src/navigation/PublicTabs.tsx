import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../screens/public/HomeScreen";
import AgenciesScreen from "../screens/public/AgenciesScreen";
import StatisticsScreen from "../screens/public/StatisticsScreen";
import { tabBarScreenOptions } from "./tabBarOptions";

const Tab = createBottomTabNavigator();

export default function PublicTabs() {
  return (
    <Tab.Navigator screenOptions={tabBarScreenOptions}>
      <Tab.Screen name="HomeTab" component={HomeScreen} options={{ title: "Beranda" }} />
      <Tab.Screen name="AgenciesTab" component={AgenciesScreen} options={{ title: "Instansi" }} />
      <Tab.Screen name="StatisticsTab" component={StatisticsScreen} options={{ title: "Statistik" }} />
    </Tab.Navigator>
  );
}
