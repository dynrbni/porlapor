import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MapPin, Pencil, Plus } from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { UserStackParamList } from "../../navigation/UserTabs";
import { useQuery } from "@tanstack/react-query";
import { getMyReports } from "../../api/reports";
import type { Report } from "../../types";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { StitchHeader } from "../../components/ui/StitchHeader";
import { StitchReportCard } from "../../components/ui/StitchReportCard";
import { colors } from "../../theme";

type Nav = NativeStackNavigationProp<UserStackParamList, "Dashboard">;
type Filter = "semua" | "menunggu" | "diproses" | "selesai";

const FILTERS: { key: Filter; label: string }[] = [
  { key: "semua", label: "Semua" },
  { key: "menunggu", label: "Menunggu" },
  { key: "diproses", label: "Diproses" },
  { key: "selesai", label: "Selesai" },
];

export default function DashboardScreen() {
  const navigation = useNavigation<Nav>();
  const { user } = useAuth();
  const [activeFilter, setActiveFilter] = useState<Filter>("semua");

  const { data, isLoading } = useQuery({
    queryKey: ["my-reports-dashboard"],
    queryFn: () => getMyReports({ limit: 50 }),
  });

  const reports = (data?.data ?? []) as Report[];

  const filtered = reports.filter((r) => {
    if (activeFilter === "menunggu") return r.status === "PENDING" || r.status === "IN_REVIEW";
    if (activeFilter === "diproses") return r.status === "IN_PROGRESS";
    if (activeFilter === "selesai") return r.status === "RESOLVED";
    return true;
  });

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <StitchHeader />

      <ScrollView className="flex-1" contentContainerClassName="px-4 pb-32 pt-4" showsVerticalScrollIndicator={false}>
        <View className="mb-6 relative overflow-hidden rounded-xl bg-surface-container-high border border-outline-variant p-5 shadow-sm">
          <View className="absolute -right-16 -top-16 w-48 h-48 bg-primary-container opacity-10 rounded-full" />
          <View className="absolute -bottom-8 right-4 w-32 h-32 bg-secondary-container opacity-10 rounded-full" />
          <View className="relative z-10">
            <Text className="font-sans text-2xl font-bold text-primary mb-2">Laporan Terkini</Text>
            <Text className="font-body text-base text-on-surface-variant mb-4 leading-relaxed">
              Pantau dan dukung laporan masyarakat di sekitar Anda untuk lingkungan yang lebih baik.
            </Text>
            <View className="flex-row items-center gap-2 bg-surface rounded-full px-4 py-2 border border-outline-variant self-start">
              <MapPin size={14} color={colors.onSurfaceVariant} />
              <Text className="font-body text-xs text-on-surface-variant">Jakarta Selatan</Text>
              <Pencil size={12} color={colors.primary} />
            </View>
          </View>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4 -mx-4">
          <View className="flex-row gap-3 px-4 pb-2 border-b border-outline-variant">
            {FILTERS.map((f) => (
              <TouchableOpacity
                key={f.key}
                onPress={() => setActiveFilter(f.key)}
                className={`px-4 py-2 rounded-full ${
                  activeFilter === f.key
                    ? "bg-primary"
                    : "bg-surface border border-outline-variant"
                }`}
              >
                <Text
                  className={`font-body text-sm font-semibold ${
                    activeFilter === f.key ? "text-on-primary" : "text-on-surface-variant"
                  }`}
                >
                  {f.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        {isLoading ? (
          <ActivityIndicator size="large" color={colors.primary} className="py-16" />
        ) : filtered.length > 0 ? (
          <View className="gap-4">
            {filtered.map((r) => (
              <StitchReportCard
                key={r.id}
                report={r}
                onPress={() => navigation.navigate("ReportDetail", { reportId: r.id })}
              />
            ))}
          </View>
        ) : (
          <View className="items-center py-16 px-6">
            <Text className="font-sans text-base font-bold text-on-surface mb-1">Belum ada laporan</Text>
            <Text className="font-body text-sm text-on-surface-variant text-center">
              {user?.name ? `Halo ${user.name}, buat laporan pertama Anda.` : "Buat laporan pertama Anda."}
            </Text>
          </View>
        )}

        {filtered.length > 0 && (
          <TouchableOpacity className="mt-6 self-center px-6 py-2 rounded-full border border-outline-variant">
            <Text className="font-body text-sm font-semibold text-primary">Muat Lebih Banyak</Text>
          </TouchableOpacity>
        )}
      </ScrollView>

      <TouchableOpacity
        onPress={() => navigation.navigate("CreateReport")}
        activeOpacity={0.9}
        className="absolute bottom-24 right-4 flex-row items-center gap-2 bg-primary h-14 px-6 rounded-full"
        style={{
          shadowColor: colors.primary,
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.2,
          shadowRadius: 16,
          elevation: 8,
        }}
      >
        <Plus size={22} color="#fff" />
        <Text className="font-body text-sm font-semibold text-on-primary">Buat Laporan</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
