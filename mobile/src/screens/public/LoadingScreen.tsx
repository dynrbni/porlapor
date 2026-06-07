import { View, ActivityIndicator, Text } from "react-native";

export default function LoadingScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-white dark:bg-slate-900">
      <ActivityIndicator size="large" color="#0f766e" />
      <Text className="mt-4 text-slate-500 dark:text-slate-400 font-medium">
        Memuat...
      </Text>
    </View>
  );
}
