import { View, Text, FlatList, TouchableOpacity, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useQuery } from "@tanstack/react-query";
import { getReports } from "../../api/reports";
import type { AgencyStackParamList } from "../../navigation/AgencyTabs";
import ReportCard from "../../components/ReportCard";

type Nav = NativeStackNavigationProp<AgencyStackParamList, "Reports">;

export default function ReportsScreen() {
  const navigation = useNavigation<Nav>();
  const { data, refetch, isLoading } = useQuery({
    queryKey: ["agency-reports"],
    queryFn: () => getReports({ limit: 50 }),
  });

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-slate-900">
      <View className="px-6 py-4">
        <Text className="text-2xl font-bold text-slate-800 dark:text-white">
          Laporan
        </Text>
        <Text className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Kelola laporan yang masuk
        </Text>
      </View>

      <FlatList
        data={data?.data ?? []}
        keyExtractor={(item) => item.id}
        contentContainerClassName="px-6 pb-6"
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={refetch} />
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("ReportDetail", { reportId: item.id })
            }
          >
            <ReportCard report={item} />
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text className="text-center text-slate-400 mt-10">
            Belum ada laporan
          </Text>
        }
      />
    </SafeAreaView>
  );
}
