import { View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowRight, ShieldCheck } from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { PublicStackParamList } from "../../navigation/PublicNavigator";

type Nav = NativeStackNavigationProp<PublicStackParamList, "Splash">;

export default function SplashScreen() {
  const navigation = useNavigation<Nav>();

  return (
    <SafeAreaView className="flex-1 bg-surface">
      <View className="flex-1 justify-center px-8">
        <View className="items-center gap-4 mb-12">
          <View className="w-20 h-20 bg-primary rounded-2xl items-center justify-center shadow-lg">
            <Text className="text-on-primary font-sans text-3xl font-bold">P</Text>
          </View>
          <Text className="font-sans text-3xl font-bold text-primary text-center leading-tight">
            Selamat Datang di{"\n"}PorLapor
          </Text>
          <Text className="font-body text-base text-on-surface-variant text-center leading-relaxed max-w-sm">
            Suarakan aspirasi Anda, bangun kota yang lebih baik bersama.
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => navigation.navigate("Home")}
          className="bg-primary py-4 rounded-full items-center flex-row justify-center gap-2 shadow-md mb-4"
        >
          <Text className="text-on-primary font-sans text-sm font-semibold">Mulai Sekarang</Text>
          <ArrowRight size={20} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate("Login")}
          className="items-center py-2"
        >
          <Text className="font-sans text-base font-bold text-primary">Masuk</Text>
        </TouchableOpacity>
      </View>

      <View className="flex-row items-center justify-center gap-2 pb-8">
        <ShieldCheck size={16} color="#757682" />
        <Text className="font-body text-xs text-outline">Layanan Resmi Pengaduan Masyarakat</Text>
      </View>
    </SafeAreaView>
  );
}
