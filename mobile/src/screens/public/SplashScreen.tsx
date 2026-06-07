import { useEffect } from "react";
import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { PublicStackParamList } from "../../navigation/PublicNavigator";

type Nav = NativeStackNavigationProp<PublicStackParamList, "Splash">;

export default function SplashScreen() {
  const navigation = useNavigation<Nav>();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace("Home");
    }, 2000);
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <SafeAreaView className="flex-1 bg-surface">
      <View className="flex-1 items-center justify-center px-8">
        <View className="items-center gap-6">
          <View className="w-20 h-20 bg-primary rounded-2xl items-center justify-center shadow-lg">
            <Text className="text-on-primary font-sans text-3xl font-bold">P</Text>
          </View>
          <View className="items-center gap-2">
            <Text className="font-sans text-4xl font-bold text-primary tracking-tight">
              PorLapor
            </Text>
            <Text className="font-body text-base text-on-surface-variant text-center">
              From the City Government
            </Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
