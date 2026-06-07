import { View, Text, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import { getStats } from "../../api/users";

export default function StatistikScreen() {
  const navigation = useNavigation();
  const { data } = useQuery({
    queryKey: ["stats"],
    queryFn: getStats,
  });

  if (!data) return null;

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-slate-900">
      <ScrollView contentContainerClassName="px-6 py-6">
        <View className="flex-row items-center mb-6">
          <Ionicons
            name="arrow-back"
            size={24}
            className="text-slate-600 dark:text-slate-300 mr-4"
            onPress={() => navigation.goBack()}
          />
          <Text className="text-lg font-bold text-slate-800 dark:text-white">
            Statistik
          </Text>
        </View>

        <View className="flex-row flex-wrap gap-4 mb-8">
          <StatCard
            icon="document-text"
            label="Total Laporan"
            value={data.totalReports}
            color="bg-blue-50 dark:bg-blue-900/30"
            iconColor="text-blue-600"
          />
          <StatCard
            icon="business"
            label="Instansi"
            value={data.totalAgencies}
            color="bg-teal-50 dark:bg-teal-900/30"
            iconColor="text-teal-600"
          />
          <StatCard
            icon="people"
            label="Pengguna"
            value={data.totalUsers}
            color="bg-purple-50 dark:bg-purple-900/30"
            iconColor="text-purple-600"
          />
        </View>

        <Text className="text-base font-bold text-slate-800 dark:text-white mb-4">
          Laporan per Status
        </Text>
        {data.reportsByStatus.map((s) => (
          <View
            key={s.status}
            className="flex-row justify-between bg-slate-50 dark:bg-slate-800 rounded-xl px-4 py-3 mb-2"
          >
            <Text className="text-slate-700 dark:text-slate-300 capitalize">
              {s.status}
            </Text>
            <Text className="font-bold text-slate-800 dark:text-white">
              {s.count}
            </Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

function StatCard({
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
      <Text className="text-sm text-slate-500 dark:text-slate-400">{label}</Text>
    </View>
  );
}
