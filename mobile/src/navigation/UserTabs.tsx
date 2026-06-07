import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { View } from "react-native";
import DashboardScreen from "../screens/user/DashboardScreen";
import CreateReportScreen from "../screens/user/CreateReportScreen";
import ExploreScreen from "../screens/user/ExploreScreen";
import ProfileScreen from "../screens/user/ProfileScreen";
import ReportDetailScreen from "../screens/public/ReportDetailScreen";
import { Home, Search, Plus, User } from "lucide-react-native";

export type UserStackParamList = {
  Dashboard: undefined;
  CreateReport: undefined;
  Explore: undefined;
  Profile: undefined;
  ReportDetail: { reportId: string };
};

const Stack = createNativeStackNavigator<UserStackParamList>();
const Tab = createBottomTabNavigator();

function DashboardStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, animation: "slide_from_right" }}>
      <Stack.Screen name="Dashboard" component={DashboardScreen} />
      <Stack.Screen name="CreateReport" component={CreateReportScreen} />
      <Stack.Screen name="ReportDetail" component={ReportDetailScreen} />
    </Stack.Navigator>
  );
}

function ExploreStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, animation: "slide_from_right" }}>
      <Stack.Screen name="Explore" component={ExploreScreen} />
      <Stack.Screen name="ReportDetail" component={ReportDetailScreen} />
    </Stack.Navigator>
  );
}

export default function UserTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#f8f9ff",
          borderTopColor: "#c5c5d3",
          paddingBottom: 8,
          paddingTop: 8,
          height: 64,
        },
        tabBarShowLabel: true,
        tabBarActiveTintColor: "#00236f",
        tabBarInactiveTintColor: "#757682",
        tabBarLabelStyle: { fontSize: 11, fontWeight: "600", fontFamily: "Inter" },
        tabBarIcon: ({ color, size, focused }) => {
          const icons: Record<string, typeof Home> = {
            DashboardTab: Home,
            ExploreTab: Search,
            CreateReportTab: Plus,
            ProfileTab: User,
          };
          const Icon = icons[route.name];
          return (
            <View
              className={`rounded-full px-4 py-1 ${focused ? "bg-primary-container" : ""}`}
            >
              <Icon size={size} color={color} />
            </View>
          );
        },
      })}
    >
      <Tab.Screen name="DashboardTab" component={DashboardStack} options={{ title: "Home" }} />
      <Tab.Screen name="ExploreTab" component={ExploreStack} options={{ title: "Search" }} />
      <Tab.Screen name="CreateReportTab" component={CreateReportScreen} options={{ title: "Lapor" }} />
      <Tab.Screen name="ProfileTab" component={ProfileScreen} options={{ title: "Profile" }} />
    </Tab.Navigator>
  );
}
