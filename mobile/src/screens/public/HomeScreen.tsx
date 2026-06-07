import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { PublicStackParamList } from "../../navigation/PublicNavigator";

type Nav = NativeStackNavigationProp<PublicStackParamList, "Home">;

export default function HomeScreen() {
  const navigation = useNavigation<Nav>();

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-slate-900">
      <ScrollView className="flex-1">
        <View className="px-6 pt-4 pb-2">
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-2xl font-bold text-slate-800 dark:text-white">
                Lapor!
              </Text>
              <Text className="text-sm text-slate-500 dark:text-slate-400">
                Portal Pengaduan Masyarakat
              </Text>
            </View>
            <View className="flex-row gap-2">
              <TouchableOpacity
                onPress={() => navigation.navigate("Login")}
                className="bg-teal-600 px-5 py-2.5 rounded-xl"
              >
                <Text className="text-white font-semibold">Masuk</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => navigation.navigate("Register")}
                className="bg-slate-100 dark:bg-slate-800 px-5 py-2.5 rounded-xl"
              >
                <Text className="text-slate-700 dark:text-slate-200 font-semibold">
                  Daftar
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View className="px-6 py-6">
          <View className="bg-teal-50 dark:bg-teal-950/30 rounded-2xl p-6 mb-6">
            <Text className="text-lg font-bold text-teal-800 dark:text-teal-200 mb-2">
              Selamat Datang di Portal Pengaduan
            </Text>
            <Text className="text-teal-700 dark:text-teal-300 text-sm leading-5">
              Laporkan permasalahan di sekitar Anda dan bantu kami menciptakan
              lingkungan yang lebih baik.
            </Text>
          </View>

          <Text className="text-lg font-bold text-slate-800 dark:text-white mb-4">
            Layanan
          </Text>
          <View className="flex-row flex-wrap gap-4">
            <ServiceCard
              icon="megaphone"
              label="Buat Laporan"
              desc="Laporkan masalah baru"
              onPress={() => navigation.navigate("Login")}
            />
            <ServiceCard
              icon="business"
              label="Instansi"
              desc="Lihat instansi terkait"
              onPress={() => navigation.navigate("Agencies")}
            />
            <ServiceCard
              icon="stats-chart"
              label="Statistik"
              desc="Data dan grafik laporan"
              onPress={() => navigation.navigate("Statistik")}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function ServiceCard({
  icon,
  label,
  desc,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  desc: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="bg-slate-50 dark:bg-slate-800 rounded-xl p-5 w-[47%]"
    >
      <View className="bg-teal-100 dark:bg-teal-900/50 w-11 h-11 rounded-xl items-center justify-center mb-3">
        <Ionicons name={icon} size={22} color="#0f766e" />
      </View>
      <Text className="font-semibold text-slate-800 dark:text-white mb-1">
        {label}
      </Text>
      <Text className="text-xs text-slate-500 dark:text-slate-400">{desc}</Text>
    </TouchableOpacity>
  );
}
