import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Search, MapPin, MessageCircle, ThumbsUp, Clock, Activity, CheckCircle2, AlertCircle, Inbox } from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getReports } from "../../api/reports";
import type { UserStackParamList } from "../../navigation/UserTabs";
import type { Report } from "../../types";

type Nav = NativeStackNavigationProp<UserStackParamList, "Explore">;

const statusConfig: Record<string, { bg: string; text: string; icon: any; label: string }> = {
  PENDING: { bg: "bg-warning-soft", text: "text-warning", icon: Clock, label: "Menunggu" },
  IN_REVIEW: { bg: "bg-secondary-soft", text: "text-secondary", icon: AlertCircle, label: "Ditinjau" },
  IN_PROGRESS: { bg: "bg-secondary-soft", text: "text-secondary", icon: Activity, label: "Diproses" },
  RESOLVED: { bg: "bg-success-soft", text: "text-success", icon: CheckCircle2, label: "Selesai" },
  REJECTED: { bg: "bg-error-container", text: "text-error", icon: AlertCircle, label: "Ditolak" },
};

export default function ExploreScreen() {
  const navigation = useNavigation<Nav>();
  const [search, setSearch] = useState("");

  const { data, refetch, isLoading } = useQuery({
    queryKey: ["all-reports", search],
    queryFn: () => getReports({ search: search || undefined, limit: 50 }),
  });

  const reports = data?.data ?? [];

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <View className="bg-white border-b border-outline-variant px-5 pt-3 pb-4">
        <Text className="font-sans text-2xl font-extrabold text-on-surface mb-3">Jelajahi</Text>
        <View className="flex-row items-center bg-surface-container-low rounded-2xl px-4 h-12 border border-outline-variant">
          <Search size={18} color="#94a3b8" />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Cari laporan..."
            placeholderTextColor="#94a3b8"
            className="flex-1 ml-3 font-body text-base text-on-surface"
          />
        </View>
      </View>

      <FlatList
        data={reports}
        keyExtractor={(item) => item.id}
        contentContainerClassName="px-5 pb-6 mt-4"
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={refetch} tintColor="#007AFF" />
        }
        renderItem={({ item }) => {
          const s = statusConfig[item.status] || statusConfig.PENDING;
          const Icon = s.icon;
          return (
            <TouchableOpacity
              onPress={() => navigation.navigate("ReportDetail", { reportId: item.id })}
              activeOpacity={0.85}
              className="bg-white rounded-2xl p-4 mb-3 border border-outline-variant shadow-sm"
            >
              <View className="flex-row justify-between items-start mb-2.5">
                <View className={`px-2.5 py-1 rounded-lg ${s.bg} flex-row items-center gap-1.5`}>
                  <Icon size={12} color="#0f172a" />
                  <Text className={`${s.text} text-[11px] font-bold`}>{s.label}</Text>
                </View>
                {item.category && (
                  <Text className="font-body text-[11px] font-bold text-on-surface-variant uppercase tracking-wide">
                    {item.category.name}
                  </Text>
                )}
              </View>
              <Text className="font-sans text-base font-bold text-on-surface mb-1.5">
                {item.title}
              </Text>
              <Text className="font-body text-sm text-on-surface-variant leading-relaxed mb-3" numberOfLines={2}>
                {item.description}
              </Text>
              <View className="pt-3 border-t border-outline-variant flex-row items-center justify-between">
                <View className="flex-row items-center gap-1.5 flex-1 mr-2">
                  <MapPin size={13} color="#94a3b8" />
                  <Text className="font-body text-xs text-on-surface-variant" numberOfLines={1}>
                    {item.address || `${item.latitude}, ${item.longitude}`}
                  </Text>
                </View>
                <View className="flex-row items-center gap-3">
                  <View className="flex-row items-center gap-1">
                    <MessageCircle size={13} color="#94a3b8" />
                    <Text className="font-body text-xs text-on-surface-variant font-semibold">{item._count?.comments ?? 0}</Text>
                  </View>
                  <View className="flex-row items-center gap-1">
                    <ThumbsUp size={13} color="#94a3b8" />
                    <Text className="font-body text-xs text-on-surface-variant font-semibold">{item._count?.likes ?? 0}</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={
          <View className="items-center mt-16">
            <View className="w-16 h-16 bg-primary-soft rounded-full items-center justify-center mb-3">
              <Inbox size={28} color="#007AFF" />
            </View>
            <Text className="text-on-surface font-sans text-sm font-bold mb-1">
              {search ? "Laporan tidak ditemukan" : "Belum ada laporan"}
            </Text>
            <Text className="text-on-surface-variant font-body text-xs text-center px-8">
              {search ? "Coba kata kunci lain" : "Jelajahi laporan yang dikirimkan oleh pengguna lain"}
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}
