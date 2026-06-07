import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { User } from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { PublicStackParamList } from "../../navigation/PublicNavigator";
import { useQuery } from "@tanstack/react-query";
import { getReports, getStats } from "../../api/reports";
import type { Report } from "../../types";

type Nav = NativeStackNavigationProp<PublicStackParamList, "Home">;

export default function HomeScreen() {
  const navigation = useNavigation<Nav>();
  const { data: reportsData, isLoading } = useQuery({
    queryKey: ["recent-reports"],
    queryFn: () => getReports({ limit: 6 }),
  });
  const { data: statsData, isLoading: statsLoading } = useQuery({
    queryKey: ["stats"],
    queryFn: getStats,
  });

  const reports = reportsData?.data ?? [];

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <ScrollView contentContainerClassName="p-5 pb-8" showsVerticalScrollIndicator={false}>
        {/* Header greeting */}
        <View className="flex-row items-center justify-between mb-4">
          <Text className="font-sans text-2xl font-extrabold text-on-surface">Halo, Warga!</Text>
          <View className="w-10 h-10 bg-primary-soft rounded-full items-center justify-center">
            <User size={20} color="#007AFF" />
          </View>
        </View>

        {/* Impact card */}
        <View className="bg-white rounded-2xl p-5 mb-4 border border-outline-variant shadow-soft">
          <Text className="font-sans text-base font-bold text-on-surface">Dampak Komunitas</Text>
          {statsLoading ? (
            <ActivityIndicator size="small" color="#007AFF" className="mt-2" />
          ) : (
            <Text className="font-sans text-3xl font-extrabold text-primary mt-2">
              {statsData?.data?.totalReports?.toLocaleString() ?? "0"} Laporan diselesaikan bulan ini
            </Text>
          )}
        </View>

        {/* Filter tabs – placeholder, no actual filtering logic */}
        <View className="flex-row justify-between mb-4">
          {[
            "Semua",
            "Menunggu",
            "Diproses",
            "Selesai",
          ].map((label) => (
            <TouchableOpacity
              key={label}
              className="flex-1 mx-0.5 bg-primary-soft rounded-xl py-2"
            >
              <Text className="text-center font-sans text-sm font-bold text-primary">{label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Recent reports list */}
        {isLoading ? (
          <View className="flex-1 items-center justify-center py-10">
            <ActivityIndicator size="large" color="#007AFF" />
          </View>
        ) : reports.length > 0 ? (
          reports.map((r) => (
            <TouchableOpacity
              key={r.id}
              onPress={() => navigation.navigate("ReportDetail", { reportId: r.id })}
              className="bg-white rounded-2xl p-4 mb-3 border border-outline-variant shadow-sm"
            >
              <Text className="font-sans text-base font-extrabold text-on-surface">{r.title}</Text>
              {r.description ? (
                <Text className="font-body text-sm text-on-surface-variant mt-1" numberOfLines={2}>
                  {r.description}
                </Text>
              ) : null}
            </TouchableOpacity>
          ))
        ) : (
          <Text className="text-center text-on-surface-variant">Tidak ada laporan.</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
