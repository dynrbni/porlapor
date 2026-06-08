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
        <ScrollView contentContainerClassName="px-4 pb-28 pt-4" showsVerticalScrollIndicator={false}>
          <Text className="font-sans text-2xl font-bold text-on-surface mb-1">Statistik Laporan</Text>
          <Text className="font-body text-sm text-on-surface-variant mb-6">Ringkasan data pengaduan masyarakat</Text>

          <View className="flex-row flex-wrap gap-3 mb-6">
            <StatCard icon={FileText} label="Total Laporan" value={stats?.totalReports ?? 0} />
            <StatCard icon={Building2} label="Instansi Aktif" value={stats?.totalAgencies ?? 0} />
            <StatCard icon={Users} label="Pengguna" value={stats?.totalUsers ?? 0} />
          </View>

          <View className="bg-surface-container-lowest rounded-xl border border-outline-variant p-5 mb-5">
            <View className="flex-row items-center gap-2 mb-4">
              <BarChart3 size={18} color={colors.primary} />
              <Text className="font-sans text-base font-bold text-on-surface">Per Status</Text>
            </View>
            {(stats?.reportsByStatus ?? []).map((item) => {
              const total = stats?.totalReports || 1;
              const pct = Math.round((item.count / total) * 100);
              return (
                <View key={item.status} className="mb-3">
                  <View className="flex-row justify-between mb-1">
                    <Text className="font-body text-sm text-on-surface">{statusLabels[item.status] || item.status}</Text>
                    <Text className="font-sans text-sm font-bold text-primary">{item.count}</Text>
                  </View>
                  <View className="h-2 bg-surface-variant rounded-full overflow-hidden">
                    <View className="h-full bg-primary rounded-full" style={{ width: `${pct}%` }} />
                  </View>
                </View>
              );
            })}
          </View>

          <View className="bg-primary rounded-xl p-5">
            <Text className="font-sans text-base font-bold text-on-primary mb-3">Ringkasan Cepat</Text>
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

function StatCard({ icon: Icon, label, value }: { icon: any; label: string; value: number }) {
  return (
    <View className="w-[47%] bg-surface-container-lowest rounded-xl p-4 border border-outline-variant">
      <View className="w-10 h-10 bg-surface-container rounded-xl items-center justify-center mb-3">
        <Icon size={20} color={colors.primary} />
      </View>
      <Text className="font-body text-xs text-on-surface-variant mb-1">{label}</Text>
      <Text className="font-sans text-2xl font-bold text-on-surface">{value}</Text>
    </View>
  );
}

function QuickStat({ label, value }: { label: string; value: number }) {
  return (
    <View className="items-center">
      <Text className="font-sans text-lg font-bold text-on-primary">{value}</Text>
      <Text className="font-body text-[11px] text-on-primary-container">{label}</Text>
    </View>
  );
}
