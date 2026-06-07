import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Search, MapPin } from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getReports } from "../../api/reports";
import type { UserStackParamList } from "../../navigation/UserTabs";
import type { Report } from "../../types";

type Nav = NativeStackNavigationProp<UserStackParamList, "Explore">;

export default function ExploreScreen() {
  const navigation = useNavigation<Nav>();
  const [search, setSearch] = useState("");

  const { data, refetch, isLoading } = useQuery({
    queryKey: ["all-reports", search],
    queryFn: () => getReports({ search: search || undefined, limit: 50 }),
  });

  const reports = data?.data ?? [];

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <View className="bg-white px-6 pt-6 pb-4">
        <Text className="text-2xl font-extrabold text-slate-900 mb-4">
          Jelajahi
        </Text>
        <View className="flex-row items-center bg-slate-100 rounded-2xl px-4">
          <Search size={18} color="#94a3b8" />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Cari laporan..."
            placeholderTextColor="#94a3b8"
            className="flex-1 ml-3 py-3.5 text-slate-900"
          />
        </View>
      </View>

      <FlatList
        data={reports}
        keyExtractor={(item) => item.id}
        contentContainerClassName="px-6 pb-6 mt-4"
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={refetch} />
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("ReportDetail", { reportId: item.id })
            }
            className="bg-white rounded-2xl p-5 mb-3 border border-slate-100 shadow-sm"
          >
            <View className="flex-row justify-between items-start mb-3">
              <StatusBadge status={item.status} />
              {item.category && (
                <Text className="text-xs font-bold text-slate-400 uppercase">
                  {item.category.name}
                </Text>
              )}
            </View>
            <Text className="text-lg font-extrabold text-slate-900 mb-2">
              {item.title}
            </Text>
            <Text className="text-sm text-slate-500 leading-relaxed mb-4" numberOfLines={3}>
              {item.description}
            </Text>
            <View className="pt-3 border-t border-slate-100">
              <View className="flex-row items-center gap-1">
                <MapPin size={14} color="#94a3b8" />
                <Text className="text-xs text-slate-400 flex-1" numberOfLines={1}>
                  {item.address || `${item.latitude}, ${item.longitude}`}
                </Text>
              </View>
              <Text className="text-xs text-slate-400 mt-1">
                {new Date(item.createdAt).toLocaleDateString("id-ID", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </Text>
            </View>
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

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, any> = {
    PENDING: { bg: "bg-amber-100", text: "text-amber-700", label: "Menunggu" },
    IN_REVIEW: { bg: "bg-blue-100", text: "text-blue-700", label: "Ditinjau" },
    IN_PROGRESS: { bg: "bg-blue-100", text: "text-blue-700", label: "Diproses" },
    RESOLVED: {
      bg: "bg-emerald-100",
      text: "text-emerald-700",
      label: "Selesai",
    },
    REJECTED: { bg: "bg-red-100", text: "text-red-700", label: "Ditolak" },
  };
  const c = config[status] || config.PENDING;
  return (
    <View className={`${c.bg} px-2.5 py-1 rounded-lg`}>
      <Text className={`${c.text} text-xs font-bold`}>{c.label}</Text>
    </View>
  );
}
