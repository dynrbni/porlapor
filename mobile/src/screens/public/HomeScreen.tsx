import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LogIn, ArrowRight } from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";
import type { CompositeNavigationProp } from "@react-navigation/native";
import type { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { PublicStackParamList } from "../../navigation/PublicNavigator";
import { useQuery } from "@tanstack/react-query";
import { getReports } from "../../api/reports";
import type { Report } from "../../types";
import { StitchHeader } from "../../components/ui/StitchHeader";
import { StitchReportCard } from "../../components/ui/StitchReportCard";
import { colors } from "../../theme";

type Nav = CompositeNavigationProp<
  BottomTabNavigationProp<Record<string, undefined>, "HomeTab">,
  NativeStackNavigationProp<PublicStackParamList>
>;

export default function HomeScreen() {
  const navigation = useNavigation<Nav>();
  const { data, isLoading } = useQuery({
    queryKey: ["recent-reports"],
    queryFn: () => getReports({ limit: 10 }),
  });
  const reports = (data?.data ?? []) as Report[];

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <StitchHeader
        rightAction={
          <TouchableOpacity onPress={() => navigation.navigate("Login")} className="bg-primary px-4 py-2 rounded-full flex-row items-center gap-1">
            <LogIn size={14} color="#fff" />
            <Text className="text-on-primary font-body text-xs font-semibold">Masuk</Text>
          </TouchableOpacity>
        }
      />

      <ScrollView className="flex-1" contentContainerClassName="px-4 pb-28 pt-4" showsVerticalScrollIndicator={false}>
        <View className="mb-6 rounded-xl overflow-hidden bg-white border border-outline-variant p-6">
          <Text className="font-sans text-2xl font-extrabold text-on-surface leading-tight mb-3">
            Layanan Pengaduan Publik{" "}
            <Text className="text-primary">Terbuka & Transparan.</Text>
          </Text>
          <Text className="font-body text-sm text-on-surface-variant leading-relaxed mb-5">
            Sampaikan laporan, aspirasi, permintaan, informasi, maupun pengaduan langsung kepada instansi berwenang.
          </Text>
          <View className="flex-row gap-2">
            <TouchableOpacity onPress={() => navigation.navigate("Login")} className="flex-1 bg-primary py-3 rounded-xl flex-row items-center justify-center gap-1">
              <Text className="font-body text-sm font-bold text-on-primary">Tulis Laporan</Text>
              <ArrowRight size={16} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate("Register")} className="flex-1 border-2 border-outline-variant py-3 rounded-xl items-center">
              <Text className="font-body text-sm font-bold text-primary">Daftar</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text className="font-sans text-lg font-bold text-on-surface mb-4">Laporan Terbaru</Text>

        {isLoading ? (
          <ActivityIndicator size="large" color={colors.primary} className="py-12" />
        ) : (
          <View className="gap-4">
            {reports.map((r) => (
              <StitchReportCard key={r.id} report={r} onPress={() => navigation.navigate("ReportDetail", { reportId: r.id })} />
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
