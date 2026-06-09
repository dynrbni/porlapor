import { View, Text, ScrollView, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FileText, Building2, Users, BarChart3 } from "lucide-react-native";
import { useQuery } from "@tanstack/react-query";
import { getStats } from "../../api/reports";
import { StitchHeader } from "../../components/ui/StitchHeader";
import { colors, statusLabels } from "../../theme";

export default function StatisticsScreen() {
  const { data, isLoading } = useQuery({
    queryKey: ["reports-stats-api"],
    queryFn: getStats,
  });

  const stats = data?.data;

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <StitchHeader />

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <ScrollView contentContainerClassName="px-5 pb-28 pt-5" showsVerticalScrollIndicator={false}>
          <Text className="font-sans text-2xl font-bold text-on-surface mb-1 tracking-tight">Statistik Laporan</Text>
          <Text className="font-body text-sm text-on-surface-variant mb-6 leading-relaxed">
            Ringkasan data pengaduan masyarakat
          </Text>

          {/* Stat Cards Grid */}
          <View className="flex-row flex-wrap gap-3 mb-6">
            <StatCard icon={FileText} label="Total Laporan" value={stats?.totalReports ?? 0} accent="#2563eb" />
            <StatCard icon={Building2} label="Instansi Aktif" value={stats?.totalAgencies ?? 0} accent="#059669" />
            <StatCard icon={Users} label="Pengguna" value={stats?.totalUsers ?? 0} accent="#d97706" />
          </View>

          {/* Status Breakdown Card */}
          <View
            className="bg-surface-container-lowest rounded-2xl border border-outline-variant p-6 mb-5"
            style={{ shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 12, elevation: 3 }}
          >
            <View className="flex-row items-center gap-2.5 mb-5">
              <BarChart3 size={18} color={colors.primary} />
              <Text className="font-sans text-base font-bold text-on-surface">Berdasarkan Status</Text>
            </View>
            {(stats?.reportsByStatus ?? []).map((item) => {
              const total = stats?.totalReports || 1;
              const pct = Math.round((item.count / total) * 100);
              return (
                <View key={item.status} className="mb-4">
                  <View className="flex-row justify-between mb-1.5">
                    <Text className="font-body text-sm text-on-surface">{statusLabels[item.status] || item.status}</Text>
                    <Text className="font-sans text-sm font-bold text-primary">{item.count}</Text>
                  </View>
                  <View className="h-2.5 bg-surface-container-low rounded-full overflow-hidden">
                    <View
                      className="h-full rounded-full"
                      style={{
                        width: `${pct}%`,
                        backgroundColor: colors.primary,
                      }}
                    />
                  </View>
                </View>
              );
            })}
          </View>

          {/* Quick Summary Card */}
          <View
            className="bg-primary rounded-2xl p-6 relative overflow-hidden"
            style={{ shadowColor: colors.primary, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 16, elevation: 8 }}
          >
            {/* Decorative circle */}
            <View
              className="absolute rounded-full"
              style={{ width: 140, height: 140, top: -50, right: -30, backgroundColor: "rgba(255,255,255,0.08)" }}
            />
            <Text className="font-sans text-base font-bold text-on-primary mb-4">Ringkasan Cepat</Text>
            <View className="flex-row justify-between">
              <QuickStat label="Total" value={stats?.totalReports ?? 0} />
              <QuickStat label="Instansi" value={stats?.totalAgencies ?? 0} />
              <QuickStat label="Pengguna" value={stats?.totalUsers ?? 0} />
            </View>
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

function StatCard({ icon: Icon, label, value, accent }: { icon: any; label: string; value: number; accent: string }) {
  return (
    <View
      className="w-[47%] bg-surface-container-lowest rounded-2xl p-5 border border-outline-variant"
      style={{ shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 12, elevation: 3 }}
    >
      <View className="w-11 h-11 rounded-2xl items-center justify-center mb-3" style={{ backgroundColor: `${accent}12` }}>
        <Icon size={20} color={accent} />
      </View>
      <Text className="font-body text-xs text-on-surface-variant mb-1">{label}</Text>
      <Text className="font-sans text-2xl font-bold text-on-surface tracking-tight">{value}</Text>
    </View>
  );
}

function QuickStat({ label, value }: { label: string; value: number }) {
  return (
    <View className="items-center">
      <Text className="font-sans text-xl font-bold text-on-primary">{value}</Text>
      <Text className="font-body text-[11px] text-on-primary-container mt-0.5">{label}</Text>
    </View>
  );
}
