import { View, Text, TouchableOpacity, Image, ImageBackground } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowRight, ShieldCheck, MessageSquare } from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { PublicStackParamList } from "../../navigation/PublicNavigator";

type Nav = NativeStackNavigationProp<PublicStackParamList, "Splash">;

export default function SplashScreen() {
  const navigation = useNavigation<Nav>();

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top", "bottom"]}>
      <View className="flex-1">
        <View className="h-[55%] relative overflow-hidden">
          <ImageBackground
            source={require("../../../assets/images/hero_bg.jpg")}
            className="w-full h-full"
            resizeMode="cover"
          >
            <View className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/5 to-black/40" />
          </ImageBackground>

          <View className="absolute top-6 left-6 bg-white rounded-2xl p-3 shadow-lg">
            <View className="w-10 h-10 bg-primary rounded-xl items-center justify-center relative">
              <MessageSquare size={20} color="#fff" fill="#fff" />
              <View className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-secondary items-center justify-center" />
            </View>
          </View>
        </View>

        <View className="flex-1 px-8 pt-8 pb-6 bg-white">
          <View className="items-center gap-3 mb-8">
            <Text className="font-sans text-3xl font-extrabold text-on-surface text-center leading-tight">
              Selamat Datang di <Text className="text-primary">PorLapor</Text>
            </Text>
            <Text className="font-body text-base text-on-surface-variant text-center leading-relaxed max-w-sm">
              Suarakan aspirasi Anda, bangun kota yang lebih baik bersama.
            </Text>
          </View>

          <View className="gap-3 mb-auto">
            <TouchableOpacity
              onPress={() => navigation.navigate("Home")}
              activeOpacity={0.85}
              className="bg-primary py-4 rounded-2xl items-center flex-row justify-center gap-2 shadow-md"
            >
              <Text className="text-on-primary font-sans text-base font-bold">Mulai Sekarang</Text>
              <ArrowRight size={20} color="#fff" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.navigate("Login")}
              activeOpacity={0.85}
              className="bg-white border-2 border-primary py-4 rounded-2xl items-center"
            >
              <Text className="text-primary font-sans text-base font-bold">Masuk</Text>
            </TouchableOpacity>
          </View>

          <View className="flex-row items-center justify-center gap-2 pt-4">
            <ShieldCheck size={16} color="#0f766e" />
            <Text className="font-body text-xs font-medium text-on-surface-variant">
              Layanan Resmi Pengaduan Masyarakat
            </Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
