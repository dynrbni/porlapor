import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import DashboardScreen from "../screens/user/DashboardScreen";
import CreateReportScreen from "../screens/user/CreateReportScreen";
import ExploreScreen from "../screens/user/ExploreScreen";
import ProfileScreen from "../screens/user/ProfileScreen";
import ReportDetailScreen from "../screens/public/ReportDetailScreen";
import NotificationScreen from "../screens/user/NotificationScreen";
import { tabBarScreenOptions } from "./tabBarOptions";

export type UserStackParamList = {
  Dashboard: undefined;
  CreateReport: undefined;
  Explore: undefined;
  Profile: undefined;
  Notifications: undefined;
  ReportDetail: { reportId: string };
};

const Stack = createNativeStackNavigator<UserStackParamList>();
const Tab = createBottomTabNavigator();

function DashboardStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, animation: "slide_from_right" }}>
      <Stack.Screen name="Dashboard" component={DashboardScreen} />
      <Stack.Screen name="CreateReport" component={CreateReportScreen} />
      <Stack.Screen name="Notifications" component={NotificationScreen} />
      <Stack.Screen name="ReportDetail" component={ReportDetailScreen} />
    </Stack.Navigator>
  );
}

function ExploreStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, animation: "slide_from_right" }}>
      <Stack.Screen name="Explore" component={ExploreScreen} />
      <Stack.Screen name="Notifications" component={NotificationScreen} />
      <Stack.Screen name="ReportDetail" component={ReportDetailScreen} />
    </Stack.Navigator>
  );
}

export default function UserTabs() {
  return (
    <Tab.Navigator screenOptions={tabBarScreenOptions}>
      <Tab.Screen name="DashboardTab" component={DashboardStack} options={{ title: "Home" }} />
      <Tab.Screen name="ExploreTab" component={ExploreStack} options={{ title: "Search" }} />
      <Tab.Screen name="ProfileTab" component={ProfileScreen} options={{ title: "Profile" }} />
    </Tab.Navigator>
  );
}
