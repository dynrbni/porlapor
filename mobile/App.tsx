import "./global.css";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import * as SplashScreen from "expo-splash-screen";
import { AuthProvider, useAuth } from "./src/context/AuthContext";
import RootNavigator from "./src/navigation/RootNavigator";
import { useEffect, useState, Component, type ReactNode } from "react";
import { View, Text, ActivityIndicator, TouchableOpacity } from "react-native";
import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
  Poppins_800ExtraBold,
} from "@expo-google-fonts/poppins";
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
} from "@expo-google-fonts/inter";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 2, staleTime: 1000 * 60 * 2 },
  },
});

class ErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean; error: Error | null }
> {
  state: { hasError: boolean; error: Error | null } = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center", padding: 24, backgroundColor: "#f8f9ff" }}>
          <Text style={{ fontSize: 18, fontWeight: "700", color: "#ba1a1a", marginBottom: 8 }}>
            Terjadi Kesalahan
          </Text>
          <Text style={{ fontSize: 13, color: "#64748b", textAlign: "center", marginBottom: 16 }}>
            {this.state.error?.message}
          </Text>
          <TouchableOpacity
            onPress={() => this.setState({ hasError: false, error: null })}
            style={{
              backgroundColor: "#00236f",
              paddingHorizontal: 24,
              paddingVertical: 12,
              borderRadius: 12,
            }}
          >
            <Text style={{ color: "#fff", fontWeight: "700" }}>Coba Lagi</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return this.props.children;
  }
}

function AppContent() {
  const { isLoading } = useAuth();
  const [ready, setReady] = useState(false);

  const [fontsLoaded] = useFonts({
    Poppins: Poppins_400Regular,
    "Poppins-Medium": Poppins_500Medium,
    "Poppins-SemiBold": Poppins_600SemiBold,
    "Poppins-Bold": Poppins_700Bold,
    "Poppins-ExtraBold": Poppins_800ExtraBold,
    Inter: Inter_400Regular,
    "Inter-Medium": Inter_500Medium,
    "Inter-SemiBold": Inter_600SemiBold,
  });

  useEffect(() => {
    if (!isLoading && fontsLoaded) {
      try {
        SplashScreen.hideAsync();
      } catch {}
      setReady(true);
    }
  }, [isLoading, fontsLoaded]);

  if (!ready) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#f8f9ff" }}>
        <ActivityIndicator size="large" color="#00236f" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <RootNavigator />
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider style={{ flex: 1 }}>
          <View style={{ flex: 1 }}>
            <QueryClientProvider client={queryClient}>
              <AuthProvider>
                <AppContent />
              </AuthProvider>
            </QueryClientProvider>
          </View>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </ErrorBoundary>
  );
}
