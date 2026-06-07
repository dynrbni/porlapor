import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeft, FileText, Building2, Users, Activity, CheckCircle2, Clock, AlertCircle, TrendingUp } from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import { getStats } from "../../api/reports";

const statusLabels: Record<string, string> = {
  PENDING: "Menunggu",
  IN_REVIEW: "Ditinjau",
  IN_PROGRESS: "Diproses",
  RESOLVED: "Selesai",
  REJECTED: "Ditolak",
};

const statusStyle: Record<string, { bg: string; text: string; bar: string }> = {
  PENDING: { bg: "bg-warning-soft", text: "text-warning", bar: "bg-warning" },
  IN_REVIEW: { bg: "bg-secondary-soft", text: "text-secondary", bar: "bg-secondary" },
  IN_PROGRESS: { bg: "bg-secondary-soft", text: "text-secondary", bar: "bg-secondary" },
  RESOLVED: { bg: "bg-success-soft", text: "text-success", bar: "bg-success" },
  REJECTED: { bg: "bg-error-container", text: "text-error", bar: "bg-error" },
};

export default function StatisticsScreen() {
  const navigation = useNavigation();
  const { data, isLoading } = useQuery({
    queryKey: ["stats"],
    queryFn: getStats,
  });

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <View className="flex-row items-center px-5 py-3 bg-white border-b border-outline-variant">
        <TouchableOpacity onPress={() => navigation.goBack()} className="w-9 h-9 items-center justify-center rounded-full bg-surface-container">
          <ArrowLeft size={18} color="#0f172a" />
        </TouchableOpacity>
        <Text className="flex-1 font-sans text-lg font-extrabold text-on-surface ml-3">
          Statistik
        </Text>
      </View>

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#0f766e" />
        </View>
      ) : !data?.data ? (
        <View className="flex-1 items-center justify-center">
          <Text className="font-body text-base text-on-surface-variant">Data tidak tersedia</Text>
        </View>
      ) : (
        <ScrollView contentContainerClassName="p-5 pb-8" showsVerticalScrollIndicator={false}>
          <View className="mb-3">
            <Text className="font-sans text-2xl font-extrabold text-on-surface">Ringkasan Data</Text>
            <Text className="font-body text-sm text-on-surface-variant mt-1">Statistik terkini layanan pengaduan.</Text>
          </View>

          <View className="gap-3 mb-6">
            <StatCard
              icon={FileText}
              label="Total Laporan"
              value={data.data.totalReports}
              iconBg="bg-primary-soft"
              iconColor="#0f766e"
            />
            <View className="flex-row gap-3">
              <View className="flex-1">
                <StatCard
                  icon={Building2}
                  label="Instansi"
                  value={data.data.totalAgencies}
                  iconBg="bg-secondary-soft"
                  iconColor="#2563eb"
                  compact
                />
              </View>
              <View className="flex-1">
                <StatCard
                  icon={Users}
                  label="Pengguna"
                  value={data.data.totalUsers}
                  iconBg="bg-success-soft"
                  iconColor="#059669"
                  compact
                />
              </View>
            </View>
          </View>

          <View className="flex-row items-center justify-between mb-3">
            <Text className="font-sans text-lg font-extrabold text-on-surface">Status Laporan</Text>
          </View>

          {data.data.reportsByStatus.map((s) => {
            const c = statusStyle[s.status] || statusStyle.PENDING;
            const total = data.data.reportsByStatus.reduce((acc, x) => acc + x.count, 0) || 1;
            const pct = Math.round((s.count / total) * 100);
            return (
              <View
                key={s.status}
                className="bg-white rounded-2xl p-4 mb-3 border border-outline-variant shadow-sm"
              >
                <View className="flex-row items-center justify-between mb-2.5">
                  <View className="flex-row items-center gap-2.5">
                    <View className={`w-8 h-8 rounded-lg items-center justify-center ${c.bg}`}>
                      <View className={`w-2 h-2 rounded-full ${c.bar}`} />
                    </View>
                    <Text className="font-sans text-sm font-bold text-on-surface">
                      {statusLabels[s.status] || s.status}
                    </Text>
                  </View>
                  <View className="flex-row items-baseline gap-1.5">
                    <Text className="font-sans text-lg font-extrabold text-on-surface">{s.count}</Text>
                    <Text className="font-body text-xs text-on-surface-variant">{pct}%</Text>
                  </View>
                </View>
                <View className="h-2 bg-surface-container-low rounded-full overflow-hidden">
                  <View className={`h-full ${c.bar} rounded-full`} style={{ width: `${pct}%` }} />
                </View>
              </View>
            );
          })}

          {data.data.reportsByAgency && data.data.reportsByAgency.length > 0 && (
            <View className="mt-2">
              <Text className="font-sans text-lg font-extrabold text-on-surface mb-3">Per Instansi</Text>
              {data.data.reportsByAgency.map((a, idx) => (
                <View
                  key={idx}
                  className="flex-row items-center justify-between bg-white rounded-xl px-4 py-3 mb-2 border border-outline-variant"
                >
                  <Text className="font-body text-sm text-on-surface flex-1 mr-2" numberOfLines={1}>
                    {a.agencyName}
                  </Text>
                  <View className="bg-primary-soft px-2.5 py-1 rounded-full">
                    <Text className="font-body text-xs font-bold text-primary">{a.count}</Text>
                  </View>
                </View>
              ))}
            </View>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  iconBg,
  iconColor,
  compact,
}: {
  icon: any;
  label: string;
  value: number;
  iconBg: string;
  iconColor: string;
  compact?: boolean;
}) {
  return (
    <View className="bg-white rounded-2xl border border-outline-variant shadow-sm p-4">
      <View className="flex-row items-center gap-3">
        <View className={`w-11 h-11 ${iconBg} rounded-xl items-center justify-center`}>
          <Icon size={20} color={iconColor} />
        </View>
        <View className="flex-1">
          <Text className="font-body text-xs text-on-surface-variant">{label}</Text>
          <Text className="font-sans text-2xl font-extrabold text-on-surface">{value}</Text>
        </View>
      </View>
    </View>
  );
}
