import {
  NavigationContainer,
  type DefaultTheme,
} from "@react-navigation/native";
import { useAuth } from "../context/AuthContext";
import { useColorScheme } from "nativewind";
import PublicNavigator from "./PublicNavigator";
import UserTabs from "./UserTabs";
import AgencyTabs from "./AgencyTabs";
import AdminTabs from "./AdminTabs";
import LoadingScreen from "../screens/public/LoadingScreen";

export default function RootNavigator() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const { colorScheme } = useColorScheme();

  if (isLoading) return <LoadingScreen />;

  const theme: typeof DefaultTheme = {
    dark: colorScheme === "dark",
    colors: {
      primary: "#0f766e",
      background: colorScheme === "dark" ? "#0f172a" : "#f8fafc",
      card: colorScheme === "dark" ? "#1e293b" : "#ffffff",
      text: colorScheme === "dark" ? "#f1f5f9" : "#0f172a",
      border: colorScheme === "dark" ? "#334155" : "#e2e8f0",
      notification: "#ef4444",
    },
    fonts: {
      regular: { fontFamily: "Plus Jakarta Sans", fontWeight: "400" },
      medium: { fontFamily: "Plus Jakarta Sans", fontWeight: "500" },
      bold: { fontFamily: "Plus Jakarta Sans", fontWeight: "700" },
      heavy: { fontFamily: "Plus Jakarta Sans", fontWeight: "800" },
    },
  };

  return (
    <NavigationContainer theme={theme}>
      {!isAuthenticated ? (
        <PublicNavigator />
      ) : user?.role === "ADMIN" || user?.role === "SUPERADMIN" ? (
        <AdminTabs />
      ) : user?.role === "AGENCY" ? (
        <AgencyTabs />
      ) : (
        <UserTabs />
      )}
    </NavigationContainer>
  );
}
