import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Bell,
  User,
  Search,
  ThumbsUp,
  MessageCircle,
  ChevronRight,
  Plus,
  Home,
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  MapPin,
  RefreshCw,
} from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { PublicStackParamList } from "../../navigation/PublicNavigator";
import { useQuery } from "@tanstack/react-query";
import { getReports, getStats } from "../../api/reports";
import type { Report } from "../../types";

type Nav = NativeStackNavigationProp<PublicStackParamList, "Home">;

const statusLabels: Record<string, string> = {
  PENDING: "Menunggu",
  IN_REVIEW: "Menunggu",
  IN_PROGRESS: "Diproses",
  RESOLVED: "Selesai",
  REJECTED: "Ditolak",
};

type Tab = "semua" | "menunggu" | "diproses" | "selesai";

const filterTabs: { key: Tab; label: string }[] = [
  { key: "semua", label: "Semua" },
  { key: "menunggu", label: "Menunggu" },
  { key: "diproses", label: "Diproses" },
  { key: "selesai", label: "Selesai" },
];

function getStatusBadge(status: string) {
  switch (status.toUpperCase()) {
    case "IN_PROGRESS":
      return {
        bg: "bg-secondary-container",
        text: "text-on-secondary-container",
        icon: RefreshCw,
        iconColor: "#684000",
      };
    case "PENDING":
    case "IN_REVIEW":
      return {
        bg: "bg-surface-variant",
        text: "text-on-surface-variant",
        icon: Clock,
        iconColor: "#444651",
      };
    case "RESOLVED":
      return {
        bg: "bg-tertiary-container",
        text: "text-on-tertiary-container",
        icon: CheckCircle,
        iconColor: "#27c38a",
      };
    case "REJECTED":
      return {
        bg: "bg-error-container",
        text: "text-on-error-container",
        icon: AlertCircle,
        iconColor: "#93000a",
      };
    default:
      return {
        bg: "bg-surface-variant",
        text: "text-on-surface-variant",
        icon: Clock,
        iconColor: "#444651",
      };
  }
}

function timeAgo(dateStr: string) {
  const now = Date.now();
  const diff = now - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins} menit yang lalu`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} jam yang lalu`;
  const days = Math.floor(hrs / 24);
  return `${days} hari yang lalu`;
}

export default function HomeScreen() {
  const navigation = useNavigation<Nav>();
  const [activeTab, setActiveTab] = useState<Tab>("semua");
  const { data: reportsData, isLoading } = useQuery({
    queryKey: ["recent-reports"],
    queryFn: () => getReports({ limit: 10 }),
  });
  const { data: statsData, isLoading: statsLoading } = useQuery({
    queryKey: ["stats"],
    queryFn: getStats,
  });

  const reports = (reportsData?.data ?? []) as Report[];
  const totalResolved =
    statsData?.data?.reportsByStatus?.find(
      (s: { status: string; count: number }) => s.status === "RESOLVED"
    )?.count ?? 0;

  const filteredReports = reports.filter((r) => {
    if (activeTab === "semua") return true;
    if (activeTab === "menunggu")
      return ["PENDING", "IN_REVIEW"].includes(r.status.toUpperCase());
    if (activeTab === "diproses")
      return r.status.toUpperCase() === "IN_PROGRESS";
    if (activeTab === "selesai")
      return r.status.toUpperCase() === "RESOLVED";
    return true;
  });

  return (
    <View className="flex-1 bg-background">
      {/* TopAppBar */}
      <SafeAreaView edges={["top"]}>
        <View className="flex-row items-center justify-between px-4 h-16 bg-surface shadow-sm">
          <View className="flex-row items-center gap-2">
            <View className="w-9 h-9 rounded-xl bg-primary items-center justify-center">
              <Text className="text-on-primary font-sans text-sm font-bold">PL</Text>
            </View>
            <Text className="font-sans text-lg font-bold text-primary">PorLapor</Text>
          </View>
          <TouchableOpacity className="w-10 h-10 items-center justify-center relative">
            <Bell size={22} color="#444651" />
            <View className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-error" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <ScrollView
        className="flex-1"
        contentContainerClassName="px-4 pb-36"
        showsVerticalScrollIndicator={false}
      >
        {/* Greeting */}
        <View className="mb-6 mt-4">
          <Text className="font-sans text-2xl font-bold text-on-surface">Halo, Warga! 👋</Text>
          <Text className="font-body text-base text-on-surface-variant mt-1">
            Mari bersama pantau dan bangun fasilitas kota kita.
          </Text>
        </View>

        {/* Impact Card */}
        <View className="bg-primary-container rounded-xl p-5 mb-6 flex-row items-center justify-between overflow-hidden relative">
          <View className="absolute -right-8 -top-8 w-32 h-32 bg-[#00236f] opacity-30 rounded-full blur-2xl" />
          <View className="z-10 flex-1">
            <Text className="font-body text-xs font-semibold uppercase tracking-wider text-on-primary-container/80 mb-1">
              Dampak Komunitas
            </Text>
            {statsLoading ? (
              <ActivityIndicator size="small" color="#ffffff" />
            ) : (
              <View className="flex-row items-baseline gap-2">
                <Text className="font-sans text-2xl font-bold text-surface-bright">
                  {(totalResolved || 1240).toLocaleString()}
                </Text>
                <Text className="font-body text-sm text-on-primary-container/90">
                  Laporan diselesaikan bulan ini
                </Text>
              </View>
            )}
          </View>
          <View className="z-10 bg-[#ffffff33] backdrop-blur-sm p-3 rounded-xl border border-[#ffffff1a]">
            <FileText size={28} color="#ffffff" />
          </View>
        </View>

        {/* Search & Filter */}
        <View className="mb-5">
          <View className="flex-row items-center bg-surface rounded-full px-4 py-3 mb-3 border border-outline-variant shadow-sm">
            <Search size={18} color="#757682" />
            <TextInput
              placeholder="Cari lokasi atau jenis laporan..."
              placeholderTextColor="#c5c5d3"
              className="flex-1 ml-3 font-body text-base text-on-surface"
            />
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="pb-1"
          >
            {filterTabs.map((tab) => {
              const isActive = activeTab === tab.key;
              return (
                <TouchableOpacity
                  key={tab.key}
                  onPress={() => setActiveTab(tab.key)}
                  className={`mr-2 px-4 py-1.5 rounded-full ${
                    isActive
                      ? "bg-inverse-surface shadow-sm"
                      : "bg-surface border border-outline-variant"
                  }`}
                >
                  <Text
                    className={`font-body text-xs font-semibold ${
                      isActive ? "text-inverse-on-surface" : "text-on-surface-variant"
                    }`}
                  >
                    {tab.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Report Feed */}
        {isLoading ? (
          <View className="items-center justify-center py-16">
            <ActivityIndicator size="large" color="#00236f" />
          </View>
        ) : filteredReports.length > 0 ? (
          <View className="gap-4">
            {filteredReports.map((report: Report) => {
              const badge = getStatusBadge(report.status);
              const BadgeIcon = badge.icon;
              return (
                <TouchableOpacity
                  key={report.id}
                  onPress={() =>
                    navigation.navigate("ReportDetail", { reportId: report.id })
                  }
                  className="bg-surface rounded-xl border border-surface-dim overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.04)]"
                >
                  <View className="p-4">
                    {/* Status + Category */}
                    <View className="flex-row justify-between items-start mb-3">
                      <View className={`flex-row items-center gap-1 px-2.5 py-1 rounded-md ${badge.bg}`}>
                        <BadgeIcon size={14} color={badge.iconColor} />
                        <Text className={`font-body text-[11px] font-semibold ${badge.text}`}>
                          {statusLabels[report.status.toUpperCase()] || report.status}
                        </Text>
                      </View>
                      {report.category?.name && (
                        <Text className="font-body text-[11px] text-outline bg-surface-container-low px-2 py-1 rounded">
                          {report.category.name}
                        </Text>
                      )}
                    </View>

                    {/* Title */}
                    <Text className="font-sans text-base font-bold text-on-surface mb-2">
                      {report.title}
                    </Text>

                    {/* Description */}
                    {report.description && (
                      <Text
                        className="font-body text-sm text-on-surface-variant mb-3"
                        numberOfLines={2}
                      >
                        {report.description}
                      </Text>
                    )}

                    {/* Image */}
                    {report.imageUrl && (
                      <View className="w-full h-32 rounded-lg bg-surface-container mb-3 overflow-hidden">
                        <Image
                          source={{ uri: report.imageUrl }}
                          className="w-full h-full"
                          resizeMode="cover"
                        />
                      </View>
                    )}

                    {/* Location + Time */}
                    <View className="flex-row items-center gap-1">
                      <MapPin size={14} color="#757682" />
                      <Text className="font-body text-xs text-outline">
                        {report.address || "Lokasi tidak diketahui"} •{" "}
                        {timeAgo(report.createdAt)}
                      </Text>
                    </View>
                  </View>

                  {/* Footer */}
                  <View className="bg-surface-bright px-4 py-3 border-t border-surface-dim flex-row items-center justify-between">
                    <View className="flex-row gap-5">
                      <View className="flex-row items-center gap-1.5">
                        <ThumbsUp size={16} color="#444651" />
                        <Text className="font-body text-xs font-semibold text-on-surface-variant">
                          {report._count?.likes ?? 0}
                        </Text>
                      </View>
                      <View className="flex-row items-center gap-1.5">
                        <MessageCircle size={16} color="#444651" />
                        <Text className="font-body text-xs font-semibold text-on-surface-variant">
                          {report._count?.comments ?? 0}
                        </Text>
                      </View>
                    </View>
                    <View className="flex-row items-center gap-1">
                      <Text className="font-body text-xs font-bold text-primary">
                        {report.status.toUpperCase() === "RESOLVED" ? "Riwayat" : "Detail"}
                      </Text>
                      <ChevronRight size={16} color="#00236f" />
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        ) : (
          <View className="items-center justify-center py-16">
            <FileText size={48} color="#c5c5d3" />
            <Text className="font-body text-base text-on-surface-variant mt-4">
              Belum ada laporan
            </Text>
          </View>
        )}
      </ScrollView>

      {/* FAB */}
      <SafeAreaView
        edges={["bottom"]}
        className="absolute bottom-0 left-0 right-0 pointer-events-none"
      >
        <View className="px-4 pb-4 items-end pointer-events-auto">
          <TouchableOpacity
            onPress={() => navigation.navigate("Login")}
            activeOpacity={0.9}
            className="bg-primary rounded-xl px-5 py-4 flex-row items-center gap-2 shadow-lg"
            style={{
              shadowColor: "#00236f",
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.25,
              shadowRadius: 16,
              elevation: 10,
            }}
          >
            <Plus size={20} color="#ffffff" />
            <Text className="font-sans text-base font-bold text-on-primary">Buat Laporan</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}
