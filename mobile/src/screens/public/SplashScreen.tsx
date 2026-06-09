import { View, Text, TouchableOpacity, Animated, ActivityIndicator, Image, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowRight, LogIn, Compass } from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { PublicStackParamList } from "../../navigation/PublicNavigator";
import { useEffect, useRef, useState } from "react";
import { colors } from "../../theme";

type Nav = NativeStackNavigationProp<PublicStackParamList, "Splash">;

const { width } = Dimensions.get("window");

export default function SplashScreen() {
  const navigation = useNavigation<Nav>();
  const [loading, setLoading] = useState(true);
  const fadeContent = useRef(new Animated.Value(0)).current;
  const slideLogo = useRef(new Animated.Value(30)).current;
  const slideText = useRef(new Animated.Value(40)).current;
  const slideButtons = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!loading) {
      Animated.stagger(120, [
        Animated.parallel([
          Animated.timing(fadeContent, { toValue: 1, duration: 600, useNativeDriver: true }),
          Animated.timing(slideLogo, { toValue: 0, duration: 600, useNativeDriver: true }),
        ]),
        Animated.timing(slideText, { toValue: 0, duration: 500, useNativeDriver: true }),
        Animated.timing(slideButtons, { toValue: 0, duration: 500, useNativeDriver: true }),
      ]).start();
    }
  }, [loading, fadeContent, slideLogo, slideText, slideButtons]);

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-background items-center justify-center">
        <Image
          source={require("../../../assets/images/porlapor_logo.png")}
          style={{ width: 220, height: 60, marginBottom: 24 }}
          resizeMode="contain"
        />
        <ActivityIndicator size="large" color={colors.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top", "bottom"]}>
      <View className="flex-1">
        {/* Hero Section */}
        <View className="flex-1 bg-primary relative overflow-hidden">
          {/* Background image */}
          <Image
            source={require("../../../assets/images/hero_bg.jpg")}
            style={{ position: "absolute", width: "100%", height: "100%", opacity: 0.15 }}
            resizeMode="cover"
          />

          {/* Decorative blobs */}
          <View
            className="absolute rounded-full"
            style={{
              width: width * 0.8,
              height: width * 0.8,
              top: -width * 0.3,
              right: -width * 0.3,
              backgroundColor: "rgba(30, 58, 138, 0.4)",
            }}
          />
          <View
            className="absolute rounded-full"
            style={{
              width: width * 0.6,
              height: width * 0.6,
              bottom: -width * 0.15,
              left: -width * 0.2,
              backgroundColor: "rgba(30, 58, 138, 0.3)",
            }}
          />

          {/* Content */}
          <View className="flex-1 px-7 justify-end pb-12 relative z-10">
            <Animated.View style={{ opacity: fadeContent, transform: [{ translateY: slideLogo }] }}>
              <Image
                source={require("../../../assets/images/porlapor_logo.png")}
                style={{ width: 140, height: 40, marginBottom: 28 }}
                resizeMode="contain"
              />
            </Animated.View>

            <Animated.View style={{ opacity: fadeContent, transform: [{ translateY: slideText }] }}>
              <Text className="font-sans text-[32px] font-bold text-white leading-tight mb-3 tracking-tight">
                Suara Anda{"\n"}Membawa{" "}
                <Text className="text-on-primary-container">Perubahan</Text>
              </Text>
              <Text className="font-body text-[15px] text-white/75 leading-relaxed max-w-[300px]">
                Bergabunglah dengan ribuan masyarakat dalam menciptakan layanan publik yang lebih baik dan transparan.
              </Text>
            </Animated.View>
          </View>
        </View>

        {/* Action Section */}
        <Animated.View
          style={{ opacity: fadeContent, transform: [{ translateY: slideButtons }] }}
          className="px-7 pt-8 pb-6 bg-background"
        >
          <TouchableOpacity
            onPress={() => navigation.navigate("Register")}
            activeOpacity={0.85}
            className="bg-primary py-4 rounded-2xl flex-row items-center justify-center gap-2.5 mb-3"
            style={{
              shadowColor: colors.primary,
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.25,
              shadowRadius: 16,
              elevation: 8,
            }}
          >
            <Text className="font-sans text-[15px] font-bold text-on-primary">Buat Akun Baru</Text>
            <ArrowRight size={18} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate("Login")}
            activeOpacity={0.85}
            className="border-2 border-outline-variant py-4 rounded-2xl flex-row items-center justify-center gap-2.5 mb-3 bg-surface-container-lowest"
          >
            <LogIn size={18} color={colors.primary} />
            <Text className="font-sans text-[15px] font-bold text-primary">Masuk</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate("Main")}
            activeOpacity={0.7}
            className="py-3 flex-row items-center justify-center gap-2"
          >
            <Compass size={15} color={colors.onSurfaceVariant} />
            <Text className="font-body text-sm font-semibold text-on-surface-variant">
              Jelajahi Tanpa Masuk
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}
