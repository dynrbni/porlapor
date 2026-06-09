import { useAuth } from "../context/AuthContext";
import PublicNavigator from "./PublicNavigator";
import UserTabs from "./UserTabs";

export default function RootNavigator() {
  const { user, isLoading, isAuthenticated } = useAuth();

  if (isLoading) return null;
  if (!isAuthenticated) return <PublicNavigator />;
  return <UserTabs />;
}
