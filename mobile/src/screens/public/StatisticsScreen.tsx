import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeft, FileText, Building2, Users } from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import { getStats } from "../../api/reports";

export default function StatisticsScreen() {
  const navigation = useNavigation();
  const { data, isLoading } = useQuery({
    queryKey: ["stats"],
    queryFn: getStats,
  });

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <View className="flex-row items-center px-6 py-4 bg-white border-b border-slate-100">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeft size={24} stroke="#475569" />
        </TouchableOpacity>
        <Text className="flex-1 text-lg font-bold text-slate-900 ml-4">
          Statistik
        </Text>
      </View>

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#0f766e" />
        </View>
      ) : !data?.data ? (
        <View className="flex-1 items-center justify-center">
          <Text className="text-slate-400">Data tidak tersedia</Text>
        </View>
      ) : (
        <ScrollView contentContainerClassName="p-6">
          <View className="flex-row flex-wrap gap-4 mb-8">
            <StatCard
              icon={FileText}
              label="Total Laporan"
              value={data.data.totalReports}
              color="bg-blue-50"
              iconColor="#2563eb"
            />
            <StatCard
              icon={Building2}
              label="Instansi"
              value={data.data.totalAgencies}
              color="bg-teal-50"
              iconColor="#0f766e"
            />
            <StatCard
              icon={Users}
              label="Pengguna"
              value={data.data.totalUsers}
              color="bg-purple-50"
              iconColor="#9333ea"
            />
          </View>

          <Text className="text-base font-bold text-slate-900 mb-4">
            Laporan per Status
          </Text>
          {data.data.reportsByStatus.map((s) => (
            <View
              key={s.status}
              className="flex-row justify-between bg-white rounded-2xl px-5 py-4 mb-2 border border-slate-100"
            >
              <Text className="text-slate-700 font-medium capitalize">
                {s.status.replace("_", " ")}
              </Text>
              <Text className="font-bold text-slate-900">{s.count}</Text>
            </View>
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  color,
  iconColor,
}: {
  icon: any;
  label: string;
  value: number;
  color: string;
  iconColor: string;
}) {
  return (
    <View className={`rounded-2xl p-5 w-[47%] ${color}`}>
      <Icon size={24} stroke={iconColor} />
      <Text className="text-3xl font-bold text-slate-900 mt-2">{value}</Text>
      <Text className="text-sm text-slate-500 font-medium">{label}</Text>
    </View>
  );
}
