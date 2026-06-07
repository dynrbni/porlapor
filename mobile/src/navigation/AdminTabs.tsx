import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import OverviewScreen from "../screens/admin/OverviewScreen";
import ReportsScreen from "../screens/admin/ReportsScreen";
import CategoriesScreen from "../screens/admin/CategoriesScreen";
import AgenciesScreen from "../screens/admin/AgenciesScreen";
import UsersScreen from "../screens/admin/UsersScreen";
import ProfileScreen from "../screens/admin/ProfileScreen";
import ReportDetailScreen from "../screens/public/ReportDetailScreen";

export type AdminTabsParamList = {
  OverviewTab: undefined;
  ReportsTab: undefined;
  CategoriesTab: undefined;
  AgenciesTab: undefined;
  UsersTab: undefined;
  ProfileTab: undefined;
};

export type AdminStackParamList = {
  Overview: undefined;
  Reports: undefined;
  Categories: undefined;
  Agencies: undefined;
  Users: undefined;
  Profile: undefined;
  ReportDetail: { reportId: string };
};

const Tab = createBottomTabNavigator<AdminTabsParamList>();
const Stack = createNativeStackNavigator<AdminStackParamList>();

function ReportsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Reports" component={ReportsScreen} />
      <Stack.Screen name="ReportDetail" component={ReportDetailScreen} />
    </Stack.Navigator>
  );
}

export default function AdminTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          const icons: Record<string, keyof typeof Ionicons.glyphMap> = {
            OverviewTab: "stats-chart",
            ReportsTab: "document-text",
            CategoriesTab: "folder",
            AgenciesTab: "business",
            UsersTab: "people",
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
        options={{ title: "Dashboard" }}
      />
      <Tab.Screen
        name="ReportsTab"
        component={ReportsStack}
        options={{ title: "Laporan" }}
      />
      <Tab.Screen
        name="CategoriesTab"
        component={CategoriesScreen}
        options={{ title: "Kategori" }}
      />
      <Tab.Screen
        name="AgenciesTab"
        component={AgenciesScreen}
        options={{ title: "Instansi" }}
      />
      <Tab.Screen
        name="UsersTab"
        component={UsersScreen}
        options={{ title: "Pengguna" }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{ title: "Profil" }}
      />
    </Tab.Navigator>
  );
}
