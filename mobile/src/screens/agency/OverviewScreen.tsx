import { View, Text, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { getStats } from "../../api/users";
import { getReports } from "../../api/reports";

export default function OverviewScreen() {
  const { data: stats } = useQuery({
    queryKey: ["stats"],
    queryFn: getStats,
  });

  const { data: reports } = useQuery({
    queryKey: ["agency-reports"],
    queryFn: () => getReports({ limit: 5 }),
  });

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-slate-900">
      <ScrollView contentContainerClassName="px-6 py-6">
        <Text className="text-2xl font-bold text-slate-800 dark:text-white mb-2">
          Ringkasan
        </Text>
        <Text className="text-sm text-slate-500 dark:text-slate-400 mb-6">
          Pantau laporan yang masuk ke instansi Anda
        </Text>

        {stats && (
          <View className="flex-row flex-wrap gap-4 mb-8">
            <StatBadge
              icon="document-text"
              label="Total Laporan"
              value={stats.totalReports}
              color="bg-blue-50 dark:bg-blue-900/30"
              iconColor="text-blue-600"
            />
            <StatBadge
              icon="checkmark-circle"
              label="Selesai"
              value={
                stats.reportsByStatus?.find((s) => s.status === "RESOLVED")
                  ?.count ?? 0
              }
              color="bg-green-50 dark:bg-green-900/30"
              iconColor="text-green-600"
            />
            <StatBadge
              icon="time"
              label="Pending"
              value={
                stats.reportsByStatus?.find((s) => s.status === "PENDING")
                  ?.count ?? 0
              }
              color="bg-yellow-50 dark:bg-yellow-900/30"
              iconColor="text-yellow-600"
            />
          </View>
        )}

        <Text className="text-base font-bold text-slate-800 dark:text-white mb-4">
          Laporan Terbaru
        </Text>
        {reports?.data?.map((report) => (
          <View
            key={report.id}
            className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4 mb-3"
          >
            <Text className="font-semibold text-slate-800 dark:text-white">
              {report.title}
            </Text>
            <Text className="text-sm text-slate-500 mt-1" numberOfLines={2}>
              {report.description}
            </Text>
            <View className="flex-row items-center justify-between mt-3">
              <View className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 rounded-full">
                <Text className="text-xs font-medium text-yellow-700 dark:text-yellow-300">
                  {report.status}
                </Text>
              </View>
              <Text className="text-xs text-slate-400">
                {new Date(report.createdAt).toLocaleDateString("id-ID")}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

function StatBadge({
  icon,
  label,
  value,
  color,
  iconColor,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: number;
  color: string;
  iconColor: string;
}) {
  return (
    <View className={`rounded-xl p-4 w-[47%] ${color}`}>
      <Ionicons name={icon} size={24} className={iconColor} />
      <Text className="text-2xl font-bold text-slate-800 dark:text-white mt-2">
        {value}
      </Text>
      <Text className="text-sm text-slate-500">{label}</Text>
    </View>
  );
}
