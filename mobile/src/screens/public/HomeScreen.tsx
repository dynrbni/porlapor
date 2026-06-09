import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, Dimensions } from "react-native";
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
          <TouchableOpacity
            onPress={() => navigation.navigate("Login")}
            activeOpacity={0.85}
            className="bg-primary px-4 py-2.5 rounded-full flex-row items-center gap-1.5"
            style={{
              shadowColor: colors.primary,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.2,
              shadowRadius: 8,
              elevation: 4,
            }}
          >
            <LogIn size={14} color="#fff" />
            <Text className="text-on-primary font-body text-xs font-bold">Masuk</Text>
          </TouchableOpacity>
        }
      />

      <ScrollView className="flex-1" contentContainerClassName="px-5 pb-28 pt-5" showsVerticalScrollIndicator={false}>
        {/* Hero Card */}
        <View
          className="mb-7 rounded-2xl overflow-hidden bg-surface-container-lowest border border-outline-variant p-6 relative"
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.05,
            shadowRadius: 12,
            elevation: 3,
          }}
        >
          {/* Decorative circles */}
          <View
            className="absolute rounded-full"
            style={{
              width: 160,
              height: 160,
              top: -50,
              right: -30,
              backgroundColor: "rgba(30, 58, 138, 0.05)",
            }}
          />
          <View className="relative z-10">
            <Text className="font-sans text-[24px] font-bold text-on-surface leading-tight mb-3 tracking-tight">
              Layanan Pengaduan Publik{" "}
              <Text className="text-primary">Terbuka & Transparan.</Text>
            </Text>
            <Text className="font-body text-sm text-on-surface-variant leading-relaxed mb-6">
              Sampaikan laporan, aspirasi, permintaan, informasi, maupun pengaduan langsung kepada instansi berwenang.
            </Text>
            <View className="flex-row gap-3">
              <TouchableOpacity
                onPress={() => navigation.navigate("Login")}
                activeOpacity={0.85}
                className="flex-1 bg-primary py-3.5 rounded-2xl flex-row items-center justify-center gap-1.5"
                style={{
                  shadowColor: colors.primary,
                  shadowOffset: { width: 0, height: 6 },
                  shadowOpacity: 0.2,
                  shadowRadius: 12,
                  elevation: 6,
                }}
              >
                <Text className="font-body text-sm font-bold text-on-primary">Tulis Laporan</Text>
                <ArrowRight size={16} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => navigation.navigate("Register")}
                activeOpacity={0.85}
                className="flex-1 border-2 border-outline-variant py-3.5 rounded-2xl items-center bg-surface-container-lowest"
              >
                <Text className="font-body text-sm font-bold text-primary">Daftar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Section Title */}
        <Text className="font-sans text-lg font-bold text-on-surface mb-4 tracking-tight">Laporan Terbaru</Text>

        {/* Report Cards */}
        {isLoading ? (
          <ActivityIndicator size="large" color={colors.primary} className="py-12" />
        ) : (
          <View className="gap-5">
            {reports.map((r) => (
              <StitchReportCard key={r.id} report={r} onPress={() => navigation.navigate("ReportDetail", { reportId: r.id })} />
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
