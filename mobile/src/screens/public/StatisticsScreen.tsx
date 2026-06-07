import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeft, FileText, Building2, Users, Activity, CheckCircle2, Clock } from "lucide-react-native";
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
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-row items-center px-5 py-3 bg-surface border-b border-outline-variant">
        <TouchableOpacity onPress={() => navigation.goBack()} className="p-1">
          <ArrowLeft size={24} color="#444651" />
        </TouchableOpacity>
        <Text className="flex-1 font-sans text-lg font-bold text-on-surface ml-3">
          Statistik
        </Text>
      </View>

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#00236f" />
        </View>
      ) : !data?.data ? (
        <View className="flex-1 items-center justify-center">
          <Text className="font-body text-base text-on-surface-variant">Data tidak tersedia</Text>
        </View>
      ) : (
        <ScrollView contentContainerClassName="p-5">
          <View className="flex-row flex-wrap gap-4 mb-8">
            <StatCard
              icon={FileText}
              label="Total Laporan"
              value={data.data.totalReports}
              bg="bg-primary-fixed"
              textColor="text-primary"
            />
            <StatCard
              icon={Building2}
              label="Instansi"
              value={data.data.totalAgencies}
              bg="bg-secondary-fixed"
              textColor="text-on-secondary-fixed"
            />
            <StatCard
              icon={Users}
              label="Pengguna"
              value={data.data.totalUsers}
              bg="bg-surface-container"
              textColor="text-on-surface-variant"
            />
          </View>

          <Text className="font-sans text-lg font-bold text-on-surface mb-4">
            Laporan per Status
          </Text>
          {data.data.reportsByStatus.map((s) => (
            <View
              key={s.status}
              className="flex-row justify-between bg-surface-container-lowest rounded-xl px-5 py-4 mb-2 border border-outline-variant"
            >
              <Text className="font-body text-base text-on-surface-variant capitalize">
                {s.status.replace("_", " ")}
              </Text>
              <Text className="font-sans text-lg font-bold text-on-surface font-bold">{s.count}</Text>
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
  bg,
  textColor,
}: {
  icon: any;
  label: string;
  value: number;
  bg: string;
  textColor: string;
}) {
  return (
    <View className={`rounded-xl p-5 w-[47%] border border-outline-variant ${bg}`}>
      <Icon size={24} color="#00236f" />
      <Text className="font-sans text-3xl font-bold text-on-surface mt-2">{value}</Text>
      <Text className={`font-body text-xs font-semibold ${textColor}`}>{label}</Text>
    </View>
  );
}
