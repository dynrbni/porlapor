import { View, Text, FlatList, TextInput, RefreshControl, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Search } from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useState, useMemo, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getReports } from "../../api/reports";
import { getCategories } from "../../api/categories";
import type { UserStackParamList } from "../../navigation/UserTabs";
import type { Report } from "../../types";
import { StitchHeader } from "../../components/ui/StitchHeader";
import { StitchReportCard } from "../../components/ui/StitchReportCard";
import { colors } from "../../theme";

type Nav = NativeStackNavigationProp<UserStackParamList, "Explore">;

export default function ExploreScreen() {
  const navigation = useNavigation<Nav>();
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(timer);
  }, [search]);

  const { data, refetch, isLoading, isRefetching } = useQuery({
    queryKey: ["all-reports", debouncedSearch],
    queryFn: () => getReports({ search: debouncedSearch || undefined, limit: 50 }),
  });

  const { data: categoriesData } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  const CATEGORIES = useMemo(() => {
    const cats = categoriesData?.data?.map((c: any) => c.name) || [];
    return ["Semua", ...cats];
  }, [categoriesData]);

  const allReports = (data?.data ?? []) as Report[];
  const reports = useMemo(() => {
    let filtered = allReports;
    if (selectedCategory !== "Semua") {
      filtered = filtered.filter((r) => r.category?.name === selectedCategory);
    }
    
    if (search) {
      const lowerQuery = search.toLowerCase();
      filtered = filtered.filter(
        (r) =>
          r.title?.toLowerCase().includes(lowerQuery) ||
          r.description?.toLowerCase().includes(lowerQuery) ||
          r.user?.name?.toLowerCase().includes(lowerQuery)
      );
    }
    
    return filtered;
  }, [allReports, selectedCategory, search]);

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <StitchHeader onNotificationPress={() => navigation.navigate("Notifications")} />

      {/* Search Bar */}
      <View className="px-5 pt-6 pb-4">
        <View
          className="flex-row items-center bg-surface-container-lowest border border-outline-variant rounded-2xl px-5 h-14"
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.05,
            shadowRadius: 12,
            elevation: 2,
          }}
        >
          <Search size={20} color={colors.outline} />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Cari laporan..."
            placeholderTextColor="#94a3b8"
            className="flex-1 ml-3 font-body text-sm text-on-surface h-full"
          />
        </View>
      </View>

      {/* Category Filter */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="pb-4">
        <View className="flex-row gap-3 px-5">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <TouchableOpacity
                key={cat}
                onPress={() => setSelectedCategory(cat)}
                activeOpacity={0.8}
                className={`flex-row justify-center items-center rounded-[14px] px-6 h-11 border ${
                  isActive
                    ? "bg-primary border-primary"
                    : "bg-surface-container-lowest border-outline-variant/60"
                }`}
                style={[
                  { minWidth: 110 },
                  isActive ? {
                    shadowColor: colors.primary,
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.25,
                    shadowRadius: 8,
                    elevation: 5,
                  } : undefined
                ]}
              >
                <Text
                  numberOfLines={1}
                  className={`font-sans text-sm font-semibold tracking-wide ${
                    isActive ? "text-on-primary" : "text-on-surface-variant"
                  }`}
                >
                  {cat}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {/* Report List */}
      <FlatList
        data={reports}
        keyExtractor={(item) => item.id}
        contentContainerClassName="px-5 pb-28 pt-3 gap-5"
        refreshControl={
          <RefreshControl
            refreshing={isLoading || isRefetching}
            onRefresh={refetch}
            tintColor={colors.primary}
          />
        }
        renderItem={({ item }) => (
          <StitchReportCard
            report={item}
            onPress={() => navigation.navigate("ReportDetail", { reportId: item.id })}
          />
        )}
        ListEmptyComponent={
          <View className="items-center py-20 px-8 rounded-3xl border-2 border-dashed border-outline-variant/50 bg-surface-container-lowest mt-4 mx-1">
            <View className="w-16 h-16 rounded-full bg-surface-container mb-4 items-center justify-center">
              <Search size={28} color={colors.outline} />
            </View>
            <Text className="font-sans text-lg font-bold text-on-surface mb-2 text-center">
              {search ? "Laporan Tidak Ditemukan" : "Belum Ada Laporan"}
            </Text>
            <Text className="font-body text-sm text-on-surface-variant text-center leading-relaxed">
              {search
                ? "Coba gunakan kata kunci lain atau periksa kembali ejaan Anda."
                : "Jadilah yang pertama untuk melaporkan masalah di sekitar Anda."}
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}