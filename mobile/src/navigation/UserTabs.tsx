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
          backgroundColor: "#ffffff",
          borderTopColor: "#e2e8f0",
          paddingBottom: 8,
          paddingTop: 8,
          height: 64,
        },
        tabBarShowLabel: true,
        tabBarActiveTintColor: "#0f766e",
        tabBarInactiveTintColor: "#94a3b8",
        tabBarLabelStyle: { fontSize: 11, fontWeight: "700", fontFamily: "Plus Jakarta Sans" },
        tabBarIcon: ({ color, size, focused }) => {
          const icons: Record<string, typeof Home> = {
            DashboardTab: Home,
            ExploreTab: Search,
            CreateReportTab: Plus,
            ProfileTab: User,
          };
          const Icon = icons[route.name];
          if (route.name === "CreateReportTab") {
            return (
              <View
                style={{
                  backgroundColor: "#0f766e",
                  width: 48,
                  height: 48,
                  borderRadius: 24,
                  alignItems: "center",
                  justifyContent: "center",
                  marginTop: -16,
                  shadowColor: "#0f766e",
                  shadowOpacity: 0.3,
                  shadowRadius: 8,
                  shadowOffset: { width: 0, height: 4 },
                  elevation: 6,
                }}
              >
                <Icon size={24} color="#fff" />
              </View>
            );
          }
          return (
            <View
              className={`rounded-xl px-3 py-1.5 ${focused ? "bg-primary-soft" : ""}`}
            >
              <Icon size={size} color={color} />
            </View>
          );
        },
      })}
    >
      <Tab.Screen name="DashboardTab" component={DashboardStack} options={{ title: "Home" }} />
      <Tab.Screen name="ExploreTab" component={ExploreStack} options={{ title: "Jelajahi" }} />
      <Tab.Screen name="CreateReportTab" component={CreateReportScreen} options={{ title: "Buat" }} />
      <Tab.Screen name="ProfileTab" component={ProfileScreen} options={{ title: "Profil" }} />
    </Tab.Navigator>
  );
}
