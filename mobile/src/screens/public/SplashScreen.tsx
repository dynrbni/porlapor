import { View, Text, TouchableOpacity, Animated, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowRight, LogIn, Compass } from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { PublicStackParamList } from "../../navigation/PublicNavigator";
import { useEffect, useRef, useState } from "react";
import { colors } from "../../theme";

type Nav = NativeStackNavigationProp<PublicStackParamList, "Splash">;

export default function SplashScreen() {
  const navigation = useNavigation<Nav>();
  const [loading, setLoading] = useState(true);
  const fade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!loading) {
      Animated.timing(fade, { toValue: 1, duration: 500, useNativeDriver: true }).start();
    }
  }, [loading, fade]);

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-background items-center justify-center">
        <View className="w-20 h-20 rounded-2xl bg-primary items-center justify-center mb-4">
          <Text className="text-on-primary font-sans text-3xl font-bold">PL</Text>
        </View>
        <Text className="font-sans text-2xl font-bold text-primary mb-6">PorLapor</Text>
        <ActivityIndicator size="large" color={colors.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top", "bottom"]}>
      <Animated.View className="flex-1" style={{ opacity: fade }}>
        <View className="flex-1 bg-primary px-6 justify-end pb-10">
          <View className="w-12 h-12 rounded-xl bg-white/20 items-center justify-center mb-6">
            <Text className="text-white font-sans text-lg font-bold">PL</Text>
          </View>
          <Text className="font-sans text-3xl font-bold text-white leading-tight mb-3">
            Layanan Pengaduan Publik{"\n"}
            <Text className="text-on-primary-container">Terbuka & Transparan</Text>
          </Text>
          <Text className="font-body text-base text-white/80 leading-relaxed">
            Sampaikan laporan, aspirasi, dan pengaduan langsung kepada instansi berwenang.
          </Text>
        </View>

        <View className="px-6 py-8 gap-3 bg-background">
          <TouchableOpacity
            onPress={() => navigation.navigate("Register")}
            className="bg-primary py-4 rounded-xl flex-row items-center justify-center gap-2"
          >
            <Text className="font-sans text-base font-bold text-on-primary">Buat Akun Baru</Text>
            <ArrowRight size={18} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate("Login")}
            className="border-2 border-outline-variant py-4 rounded-xl flex-row items-center justify-center gap-2"
          >
            <LogIn size={18} color={colors.primary} />
            <Text className="font-sans text-base font-bold text-primary">Masuk</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate("Main")}
            className="py-3 flex-row items-center justify-center gap-2"
          >
            <Compass size={16} color={colors.onSurfaceVariant} />
            <Text className="font-body text-sm font-semibold text-on-surface-variant">Jelajahi Tanpa Masuk</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </SafeAreaView>
  );
}
