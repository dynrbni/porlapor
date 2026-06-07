import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import OverviewScreen from "../screens/agency/OverviewScreen";
import ReportsScreen from "../screens/agency/ReportsScreen";
import ProfileScreen from "../screens/agency/ProfileScreen";
import ReportDetailScreen from "../screens/public/ReportDetailScreen";

export type AgencyTabsParamList = {
  OverviewTab: undefined;
  ReportsTab: undefined;
  ProfileTab: undefined;
};

export type AgencyStackParamList = {
  Overview: undefined;
  Reports: undefined;
  Profile: undefined;
  ReportDetail: { reportId: string };
};

const Tab = createBottomTabNavigator<AgencyTabsParamList>();
const Stack = createNativeStackNavigator<AgencyStackParamList>();

function ReportsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Reports" component={ReportsScreen} />
      <Stack.Screen name="ReportDetail" component={ReportDetailScreen} />
    </Stack.Navigator>
  );
}

export default function AgencyTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          const icons: Record<string, keyof typeof Ionicons.glyphMap> = {
            OverviewTab: "grid",
            ReportsTab: "document-text",
            ProfileTab: "person",
          };
          return <Ionicons name={icons[route.name]} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#0f766e",
        tabBarInactiveTintColor: "#94a3b8",
      })}
    >
      <Tab.Screen
        name="OverviewTab"
        component={OverviewScreen}
        options={{ title: "Ringkasan" }}
      />
      <Tab.Screen
        name="ReportsTab"
        component={ReportsStack}
        options={{ title: "Laporan" }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{ title: "Profil" }}
      />
    </Tab.Navigator>
  );
}
