import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SplashScreen from "../screens/public/SplashScreen";
import PublicTabs from "./PublicTabs";
import LoginScreen from "../screens/public/LoginScreen";
import RegisterScreen from "../screens/public/RegisterScreen";
import ReportDetailScreen from "../screens/public/ReportDetailScreen";

export type PublicStackParamList = {
  Splash: undefined;
  Main: undefined;
  Login: undefined;
  Register: undefined;
  ReportDetail: { reportId: string };
};

const Stack = createNativeStackNavigator<PublicStackParamList>();

export default function PublicNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, animation: "slide_from_right" }}>
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Main" component={PublicTabs} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="ReportDetail" component={ReportDetailScreen} />
    </Stack.Navigator>
  );
}
