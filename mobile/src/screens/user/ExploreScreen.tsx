import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Search, MapPin, MessageCircle, ThumbsUp, Clock, Activity, CheckCircle2, Inbox } from "lucide-react-native";
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
    <SafeAreaView className="flex-1 bg-background">
      <View className="bg-surface-container-lowest border-b border-outline-variant/30 px-5 pt-4 pb-4">
        <Text className="font-sans text-2xl font-bold text-primary mb-4">Jelajahi</Text>
        <View className="flex-row items-center bg-surface-container rounded-xl px-4 h-12 border border-outline-variant">
          <Search size={18} color="#757682" />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Cari laporan..."
            placeholderTextColor="#757682"
            className="flex-1 ml-3 font-body text-base text-on-surface"
          />
        </View>
      </View>

      <FlatList
        data={reports}
        keyExtractor={(item) => item.id}
        contentContainerClassName="px-5 pb-6 mt-4"
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={refetch} tintColor="#00236f" />
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("ReportDetail", { reportId: item.id })
            }
            className="bg-surface-container-lowest rounded-xl p-4 mb-3 border border-outline-variant shadow-sm"
          >
            <View className="flex-row justify-between items-start mb-2">
              <StatusBadge status={item.status} />
              {item.category && (
                <Text className="font-body text-xs font-semibold text-on-surface-variant uppercase">
                  {item.category.name}
                </Text>
              )}
            </View>
            <Text className="font-sans text-lg font-bold text-on-surface mb-2">
              {item.title}
            </Text>
            <Text className="font-body text-sm text-on-surface-variant leading-relaxed mb-3" numberOfLines={3}>
              {item.description}
            </Text>
            <View className="pt-3 border-t border-outline-variant flex-row items-center justify-between">
              <View className="flex-row items-center gap-1 flex-1">
                <MapPin size={14} color="#757682" />
                <Text className="font-body text-xs font-semibold text-on-surface-variant flex-1" numberOfLines={1}>
                  {item.address || `${item.latitude}, ${item.longitude}`}
                </Text>
              </View>
              <View className="flex-row items-center gap-3">
                <View className="flex-row items-center gap-1">
                  <MessageCircle size={14} color="#757682" />
                  <Text className="font-body text-xs font-semibold text-on-surface-variant font-semibold">{item._count?.comments ?? 0}</Text>
                </View>
                <View className="flex-row items-center gap-1">
                  <ThumbsUp size={14} color="#757682" />
                  <Text className="font-body text-xs font-semibold text-on-surface-variant font-semibold">{item._count?.likes ?? 0}</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text className="text-center text-on-surface-variant mt-10 font-body text-base">
            {search ? "Laporan tidak ditemukan" : "Belum ada laporan"}
          </Text>
        }
      />
    </SafeAreaView>
  );
}

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, any> = {
    PENDING: { bg: "bg-surface-variant", text: "text-on-surface-variant", label: "Menunggu" },
    IN_REVIEW: { bg: "bg-primary-fixed", text: "text-on-primary-fixed", label: "Ditinjau" },
    IN_PROGRESS: { bg: "bg-secondary-container", text: "text-on-secondary-container", label: "Diproses" },
    RESOLVED: { bg: "bg-tertiary-fixed", text: "text-on-tertiary-fixed", label: "Selesai" },
    REJECTED: { bg: "bg-error-container", text: "text-on-error-container", label: "Ditolak" },
  };
  const c = config[status] || config.PENDING;
  return (
    <View className={`${c.bg} px-2.5 py-1 rounded`}>
      <Text className={`${c.text} font-body text-xs font-semibold`}>{c.label}</Text>
    </View>
  );
}
