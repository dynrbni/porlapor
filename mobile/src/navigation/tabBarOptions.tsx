import { View } from "react-native";
import type { BottomTabNavigationOptions } from "@react-navigation/bottom-tabs";
import { colors } from "../theme";

export const tabBarScreenOptions = ({
  route,
}: {
  route: { name: string };
}): BottomTabNavigationOptions => ({
  headerShown: false,
  tabBarStyle: {
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.outlineVariant,
    height: 72,
    paddingBottom: 10,
    paddingTop: 8,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    elevation: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
  },
  tabBarShowLabel: true,
  tabBarActiveTintColor: colors.onPrimaryContainer,
  tabBarInactiveTintColor: colors.onSurfaceVariant,
  tabBarLabelStyle: {
    fontSize: 11,
    fontWeight: "500",
    fontFamily: "Inter",
    marginTop: 2,
  },
  tabBarIcon: ({ color, focused }) => {
    const { Home, Search, User, Building2, BarChart3 } = require("lucide-react-native");
    const icons: Record<string, typeof Home> = {
      DashboardTab: Home,
      ExploreTab: Search,
      ProfileTab: User,
      HomeTab: Home,
      AgenciesTab: Building2,
      StatisticsTab: BarChart3,
    };
    const Icon = icons[route.name];
    if (!Icon) return null;

    if (focused) {
      return (
        <View className="bg-primary-container rounded-full px-5 py-1.5 items-center justify-center min-w-[56px]">
          <Icon size={22} color={colors.onPrimaryContainer} strokeWidth={2.5} />
        </View>
      );
    }

    return (
      <View className="px-4 py-1.5 items-center justify-center">
        <Icon size={22} color={color} />
      </View>
    );
  },
});
