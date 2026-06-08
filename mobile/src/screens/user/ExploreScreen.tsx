import { View, Text, FlatList, TextInput, RefreshControl, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Search } from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getReports } from "../../api/reports";
import type { UserStackParamList } from "../../navigation/UserTabs";
import type { Report } from "../../types";
import { StitchHeader } from "../../components/ui/StitchHeader";
import { StitchReportCard } from "../../components/ui/StitchReportCard";
import { colors } from "../../theme";

type Nav = NativeStackNavigationProp<UserStackParamList, "Explore">;

const CATEGORIES = ["Semua", "Infrastruktur", "Lingkungan", "Kebersihan", "Transportasi", "Ketertiban"];

export default function ExploreScreen() {
  const navigation = useNavigation<Nav>();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");

  const { data, refetch, isLoading, isRefetching } = useQuery({
    queryKey: ["all-reports", search],
    queryFn: () => getReports({ search: search || undefined, limit: 50 }),
  });

  const allReports = (data?.data ?? []) as Report[];
  const reports = useMemo(() => {
    if (selectedCategory === "Semua") return allReports;
    return allReports.filter((r) => r.category?.name === selectedCategory);
  }, [allReports, selectedCategory]);

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <StitchHeader />

      <View className="px-4 pt-3 pb-2">
        <View className="flex-row items-center bg-surface-container-lowest border border-outline-variant rounded-xl px-3 h-11">
          <Search size={16} color={colors.onSurfaceVariant} />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Cari laporan..."
            placeholderTextColor="#94a3b8"
            className="flex-1 ml-2 font-body text-sm text-on-surface"
          />
        </View>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="pb-2">
        <View className="flex-row gap-2 px-4">
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat}
              onPress={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full ${selectedCategory === cat ? "bg-primary" : "bg-surface border border-outline-variant"}`}
            >
              <Text className={`font-body text-xs font-semibold ${selectedCategory === cat ? "text-on-primary" : "text-on-surface-variant"}`}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <FlatList
        data={reports}
        keyExtractor={(item) => item.id}
        contentContainerClassName="px-4 pb-28 pt-2 gap-4"
        refreshControl={<RefreshControl refreshing={isLoading || isRefetching} onRefresh={refetch} tintColor={colors.primary} />}
        renderItem={({ item }) => (
          <StitchReportCard report={item} onPress={() => navigation.navigate("ReportDetail", { reportId: item.id })} />
        )}
        ListEmptyComponent={
          <View className="items-center py-16">
            <Text className="font-sans text-sm font-bold text-on-surface">{search ? "Laporan tidak ditemukan" : "Belum ada laporan"}</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}