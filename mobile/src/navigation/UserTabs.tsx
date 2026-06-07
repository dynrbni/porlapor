import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import DashboardScreen from "../screens/user/DashboardScreen";
import CreateReportScreen from "../screens/user/CreateReportScreen";
import ExploreScreen from "../screens/user/ExploreScreen";
import ProfileScreen from "../screens/user/ProfileScreen";
import ReportDetailScreen from "../screens/public/ReportDetailScreen";
import { Home, Plus, Search, User } from "lucide-react-native";

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
          backgroundColor: "#fff",
          borderTopColor: "#e2e8f0",
          paddingBottom: 8,
          paddingTop: 8,
          height: 64,
        },
        tabBarActiveTintColor: "#0f766e",
        tabBarInactiveTintColor: "#94a3b8",
        tabBarLabelStyle: { fontSize: 11, fontWeight: "600" },
        tabBarIcon: ({ color, size }) => {
          const icons: Record<string, typeof Home> = {
            DashboardTab: Home,
            ExploreTab: Search,
            CreateReportTab: Plus,
            ProfileTab: User,
          };
          const Icon = icons[route.name];
          return <Icon size={size} stroke={color} />;
        },
      })}
    >
      <Tab.Screen name="DashboardTab" component={DashboardStack} options={{ title: "Beranda" }} />
      <Tab.Screen name="ExploreTab" component={ExploreStack} options={{ title: "Jelajahi" }} />
      <Tab.Screen name="CreateReportTab" component={CreateReportScreen} options={{ title: "Lapor" }} />
      <Tab.Screen name="ProfileTab" component={ProfileScreen} options={{ title: "Profil" }} />
    </Tab.Navigator>
  );
}
