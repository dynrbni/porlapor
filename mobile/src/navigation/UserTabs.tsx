import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import DashboardScreen from "../screens/user/DashboardScreen";
import ExploreScreen from "../screens/user/ExploreScreen";
import CreateReportScreen from "../screens/user/CreateReportScreen";
import ProfileScreen from "../screens/user/ProfileScreen";
import ReportDetailScreen from "../screens/public/ReportDetailScreen";

export type UserTabsParamList = {
  DashboardTab: undefined;
  ExploreTab: undefined;
  CreateReportTab: undefined;
  ProfileTab: undefined;
};

export type UserStackParamList = {
  Dashboard: undefined;
  Explore: undefined;
  CreateReport: undefined;
  Profile: undefined;
  ReportDetail: { reportId: string };
};

const Tab = createBottomTabNavigator<UserTabsParamList>();
const Stack = createNativeStackNavigator<UserStackParamList>();

function DashboardStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Dashboard" component={DashboardScreen} />
      <Stack.Screen name="ReportDetail" component={ReportDetailScreen} />
    </Stack.Navigator>
  );
}

function ExploreStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
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
        tabBarIcon: ({ color, size }) => {
          const icons: Record<string, keyof typeof Ionicons.glyphMap> = {
            DashboardTab: "home",
            ExploreTab: "search",
            CreateReportTab: "add-circle",
            ProfileTab: "person",
          };
          return <Ionicons name={icons[route.name]} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#0f766e",
        tabBarInactiveTintColor: "#94a3b8",
      })}
    >
      <Tab.Screen
        name="DashboardTab"
        component={DashboardStack}
        options={{ title: "Beranda" }}
      />
      <Tab.Screen
        name="ExploreTab"
        component={ExploreStack}
        options={{ title: "Jelajahi" }}
      />
      <Tab.Screen
        name="CreateReportTab"
        component={CreateReportScreen}
        options={{ title: "Lapor" }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{ title: "Profil" }}
      />
    </Tab.Navigator>
  );
}
