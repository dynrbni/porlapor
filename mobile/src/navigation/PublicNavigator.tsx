import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SplashScreen from "../screens/public/SplashScreen";
import HomeScreen from "../screens/public/HomeScreen";
import LoginScreen from "../screens/public/LoginScreen";
import RegisterScreen from "../screens/public/RegisterScreen";
import AgenciesScreen from "../screens/public/AgenciesScreen";
import StatisticsScreen from "../screens/public/StatisticsScreen";
import ReportDetailScreen from "../screens/public/ReportDetailScreen";

export type PublicStackParamList = {
  Splash: undefined;
  Home: undefined;
  Login: undefined;
  Register: undefined;
  Agencies: undefined;
  Statistics: undefined;
  ReportDetail: { reportId: string };
};

const Stack = createNativeStackNavigator<PublicStackParamList>();

export default function PublicNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, animation: "slide_from_right" }}>
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="Agencies" component={AgenciesScreen} />
      <Stack.Screen name="Statistics" component={StatisticsScreen} />
      <Stack.Screen name="ReportDetail" component={ReportDetailScreen} />
    </Stack.Navigator>
  );
}
