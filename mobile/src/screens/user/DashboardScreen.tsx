import { View, Text, FlatList, TouchableOpacity, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useQuery } from "@tanstack/react-query";
import { getMyReports } from "../../api/reports";
import type { UserStackParamList } from "../../navigation/UserTabs";
import ReportCard from "../../components/ReportCard";

type Nav = NativeStackNavigationProp<UserStackParamList, "Dashboard">;

export default function DashboardScreen() {
  const navigation = useNavigation<Nav>();
  const { data, refetch, isLoading } = useQuery({
    queryKey: ["my-reports"],
    queryFn: () => getMyReports({ limit: 10 }),
  });

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-slate-900">
      <View className="px-6 py-4">
        <Text className="text-2xl font-bold text-slate-800 dark:text-white">
          Laporanku
        </Text>
        <Text className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Pantau laporan yang telah Anda buat
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
          <View className="items-center mt-20">
            <Ionicons name="document-text-outline" size={48} color="#cbd5e1" />
            <Text className="text-slate-400 mt-4">Belum ada laporan</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate("CreateReport" as never)}
              className="bg-teal-600 px-6 py-3 rounded-xl mt-4"
            >
              <Text className="text-white font-semibold">Buat Laporan Baru</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </SafeAreaView>
  );
}
