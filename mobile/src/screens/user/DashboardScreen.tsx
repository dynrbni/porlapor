import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, Animated } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MapPin, Pencil, Plus } from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { UserStackParamList } from "../../navigation/UserTabs";
import { useQuery } from "@tanstack/react-query";
import { getMyReports } from "../../api/reports";
import type { Report } from "../../types";
import { useState, useRef } from "react";
import { useAuth } from "../../context/AuthContext";
import { StitchHeader } from "../../components/ui/StitchHeader";
import { StitchReportCard } from "../../components/ui/StitchReportCard";
import { colors } from "../../theme";
import { Modal, Pressable } from "react-native";

type Nav = NativeStackNavigationProp<UserStackParamList, "Dashboard">;
type Filter = "semua" | "menunggu" | "diproses" | "selesai";

const FILTERS: { key: Filter; label: string }[] = [
  { key: "semua", label: "Semua" },
  { key: "menunggu", label: "Menunggu" },
  { key: "diproses", label: "Diproses" },
  { key: "selesai", label: "Selesai" },
];

const LOCATIONS = [
  { id: "Semua Lokasi", label: "Semua Lokasi" },
  { id: "Jakarta Selatan", label: "Jakarta Selatan" },
  { id: "Jakarta Pusat", label: "Jakarta Pusat" },
  { id: "Jakarta Barat", label: "Jakarta Barat" },
  { id: "Jakarta Timur", label: "Jakarta Timur" },
  { id: "Jakarta Utara", label: "Jakarta Utara" },
];

export default function DashboardScreen() {
  const navigation = useNavigation<Nav>();
  const { user } = useAuth();
  const [activeFilter, setActiveFilter] = useState<Filter>("semua");
  const [locationFilter, setLocationFilter] = useState("Semua Lokasi");
  const [pickerOpen, setPickerOpen] = useState(false);
  const scrollY = useRef(new Animated.Value(0)).current;
  const scrollYClamped = Animated.diffClamp(scrollY, 0, 100);
  const translateY = scrollYClamped.interpolate({
    inputRange: [0, 100],
    outputRange: [0, 150],
  });

  const { data, isLoading } = useQuery({
    queryKey: ["my-reports-dashboard", user?.id],
    queryFn: () => getMyReports(user?.id as string, { limit: 50 }),
    enabled: !!user?.id,
  });

  const reports = (data?.data ?? []) as Report[];

  const filtered = reports.filter((r) => {
    if (activeFilter === "menunggu") return r.status === "PENDING" || r.status === "IN_REVIEW";
    if (activeFilter === "diproses") return r.status === "IN_PROGRESS";
    if (activeFilter === "selesai") return r.status === "RESOLVED";
    return true;
  });

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <StitchHeader onNotificationPress={() => navigation.navigate("Notifications")} />

      <Animated.ScrollView 
        className="flex-1" 
        contentContainerClassName="px-5 pb-32 pt-5" 
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
      >
        {/* Hero Card */}
        <View
          className="mb-8 relative overflow-hidden rounded-[28px] bg-primary p-7"
          style={{
            shadowColor: colors.primary,
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.25,
            shadowRadius: 16,
            elevation: 8,
          }}
        >
          {/* Decorative circles */}
          <View
            className="absolute rounded-full"
            style={{
              width: 240,
              height: 240,
              top: -80,
              right: -60,
              backgroundColor: "rgba(255, 255, 255, 0.08)",
            }}
          />
          <View
            className="absolute rounded-full"
            style={{
              width: 140,
              height: 140,
              bottom: -40,
              right: 40,
              backgroundColor: "rgba(255, 255, 255, 0.05)",
            }}
          />

          <View className="relative z-10">
            <Text className="font-sans text-2xl font-bold text-white mb-2 tracking-tight">
              Laporan Terkini
            </Text>
            <Text className="font-body text-sm text-primary-fixed-dim mb-6 leading-relaxed pr-8">
              Pantau dan dukung laporan masyarakat di sekitar Anda untuk lingkungan yang lebih baik.
            </Text>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setPickerOpen(true)}
              className="flex-row items-center gap-2 bg-white/20 rounded-full px-5 py-2.5 self-start"
            >
              <MapPin size={14} color="#ffffff" />
              <Text className="font-sans text-xs font-bold text-white tracking-wide">{locationFilter}</Text>
              <Pencil size={12} color="#ffffff" style={{ marginLeft: 2 }} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Filter Tabs */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-6 -mx-5">
          <View className="flex-row gap-3 px-5">
            {FILTERS.map((f) => {
              const isActive = activeFilter === f.key;
              return (
                <TouchableOpacity
                  key={f.key}
                  onPress={() => setActiveFilter(f.key)}
                  activeOpacity={0.8}
                  className={`flex-row justify-center items-center rounded-[14px] px-6 h-11 border ${
                    isActive
                      ? "bg-primary border-primary"
                      : "bg-surface-container-lowest border-outline-variant/60"
                  }`}
                  style={[
                    { minWidth: 100 },
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
                    {f.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>

        {/* Content */}
        {isLoading ? (
          <ActivityIndicator size="large" color={colors.primary} className="py-16" />
        ) : filtered.length > 0 ? (
          <View className="gap-5">
            {filtered.map((r) => (
              <StitchReportCard
                key={r.id}
                report={r}
                onPress={() => navigation.navigate("ReportDetail", { reportId: r.id })}
              />
            ))}
          </View>
        ) : (
          <View
            className="items-center py-20 px-8 rounded-3xl border-2 border-dashed border-outline-variant/50 bg-surface-container-lowest mt-2 mx-1"
          >
            <View className="w-16 h-16 rounded-full bg-surface-container mb-4 items-center justify-center">
              <Plus size={28} color={colors.outline} />
            </View>
            <Text className="font-sans text-lg font-bold text-on-surface mb-2 text-center">Belum Ada Laporan</Text>
            <Text className="font-body text-sm text-on-surface-variant text-center leading-relaxed">
              {user?.name ? `Halo ${user.name}, jadilah yang pertama untuk melaporkan masalah.` : "Jadilah yang pertama untuk melaporkan masalah."}
            </Text>
          </View>
        )}

        {/* Load More */}
        {filtered.length > 0 && (
          <TouchableOpacity
            className="mt-8 self-center px-8 py-3 rounded-full border-2 border-outline-variant/50 bg-surface-container-lowest"
            activeOpacity={0.7}
          >
            <Text className="font-sans text-sm font-bold text-primary tracking-wide">Muat Lebih Banyak</Text>
          </TouchableOpacity>
        )}
      </Animated.ScrollView>

      {/* FAB */}
      <Animated.View style={{ transform: [{ translateY }], zIndex: 50 }} className="absolute bottom-24 right-5">
        <TouchableOpacity
          onPress={() => navigation.navigate("CreateReport")}
          activeOpacity={0.9}
          className="flex-row items-center gap-2.5 bg-primary h-14 px-7 rounded-full"
          style={{
            shadowColor: colors.primary,
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.35,
            shadowRadius: 16,
            elevation: 10,
          }}
        >
          <Plus size={22} color="#fff" />
          <Text className="font-sans text-sm font-bold text-white tracking-wide">Buat Laporan</Text>
        </TouchableOpacity>
      </Animated.View>

      <PickerModal 
        visible={pickerOpen} 
        title="Pilih Lokasi" 
        onClose={() => setPickerOpen(false)} 
        items={LOCATIONS.map(l => ({ 
          id: l.id, 
          label: l.label, 
          selected: locationFilter === l.id, 
          onSelect: () => { setLocationFilter(l.id); setPickerOpen(false); } 
        }))} 
      />
    </SafeAreaView>
  );
}

function PickerModal({ visible, title, onClose, items, skipLabel, onSkip }: any) {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <Pressable className="flex-1 bg-black/60 justify-end" onPress={onClose}>
        <Pressable className="bg-surface-container-lowest rounded-t-[32px] p-7 max-h-[75%]" onPress={(e) => e.stopPropagation()}>
          <View className="w-12 h-1.5 bg-outline-variant/50 rounded-full self-center mb-6" />
          <Text className="font-sans text-xl font-bold text-on-surface mb-6 tracking-tight">{title}</Text>
          {skipLabel && onSkip && (
            <TouchableOpacity onPress={onSkip} className="py-3 mb-3 border border-outline-variant/50 rounded-xl items-center bg-surface-container-low" activeOpacity={0.7}>
              <Text className="font-sans text-sm font-bold text-on-surface-variant tracking-wide">{skipLabel}</Text>
            </TouchableOpacity>
          )}
          <ScrollView showsVerticalScrollIndicator={false}>
            {items.map((item: any) => (
              <TouchableOpacity
                key={item.id}
                onPress={item.onSelect}
                activeOpacity={0.7}
                className={`px-5 py-4 rounded-2xl mb-2 border ${item.selected ? "bg-primary/10 border-primary" : "bg-surface-container-low border-transparent"}`}
              >
                <Text className={`font-sans text-[15px] ${item.selected ? "font-bold text-primary" : "font-medium text-on-surface"}`}>{item.label}</Text>
              </TouchableOpacity>
            ))}
            <View className="h-8" />
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
