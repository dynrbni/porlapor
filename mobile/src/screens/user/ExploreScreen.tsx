import { View, Text, FlatList, TouchableOpacity, TextInput, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getReports } from "../../api/reports";
import type { UserStackParamList } from "../../navigation/UserTabs";
import ReportCard from "../../components/ReportCard";

type Nav = NativeStackNavigationProp<UserStackParamList, "Explore">;

export default function ExploreScreen() {
  const navigation = useNavigation<Nav>();
  const [search, setSearch] = useState("");
  const { data, refetch, isLoading } = useQuery({
    queryKey: ["reports", search],
    queryFn: () => getReports({ search, limit: 50 }),
  });

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-slate-900">
      <View className="px-6 py-4">
        <Text className="text-2xl font-bold text-slate-800 dark:text-white mb-4">
          Jelajahi
        </Text>
        <View className="flex-row items-center bg-slate-100 dark:bg-slate-800 rounded-xl px-4 mb-4">
          <Ionicons name="search" size={20} color="#94a3b8" />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Cari laporan..."
            placeholderTextColor="#94a3b8"
            className="flex-1 ml-2 py-3 text-slate-800 dark:text-white"
          />
        </View>
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
            {search ? "Laporan tidak ditemukan" : "Belum ada laporan"}
          </Text>
        }
      />
    </SafeAreaView>
  );
}
