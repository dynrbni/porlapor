import { View, Text, FlatList, TouchableOpacity, RefreshControl, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Inbox, Activity, CheckCircle2, Plus, MapPin, MessageCircle, ThumbsUp, Home, Bell, Clock } from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getReports } from "../../api/reports";
import { useAuth } from "../../context/AuthContext";
import type { UserStackParamList } from "../../navigation/UserTabs";
import type { Report } from "../../types";

type Nav = NativeStackNavigationProp<UserStackParamList, "Dashboard">;
type Tab = "semua" | "menunggu" | "proses" | "selesai";

export default function DashboardScreen() {
  const navigation = useNavigation<Nav>();
  const { user } = useAuth();
  const [tab, setTab] = useState<Tab>("semua");

  const { data, refetch, isLoading } = useQuery({
    queryKey: ["my-reports"],
    queryFn: () => getReports({ userId: user?.id, limit: 50 }),
  });

  const reports = data?.data ?? [];
  const myReports = reports;
  const total = myReports.length;
  const menunggu = myReports.filter((r) => r.status === "PENDING" || r.status === "IN_REVIEW").length;
  const proses = myReports.filter((r) => r.status === "IN_PROGRESS").length;
  const selesai = myReports.filter((r) => r.status === "RESOLVED").length;

  const filtered = myReports.filter((r) => {
    if (tab === "menunggu") return r.status === "PENDING" || r.status === "IN_REVIEW";
    if (tab === "proses") return r.status === "IN_PROGRESS";
    if (tab === "selesai") return r.status === "RESOLVED" || r.status === "REJECTED";
    return true;
  });

  const tabs: Array<{ key: Tab; label: string; count: number }> = [
    { key: "semua", label: "Semua", count: total },
    { key: "menunggu", label: "Menunggu", count: menunggu },
    { key: "proses", label: "Diproses", count: proses },
    { key: "selesai", label: "Selesai", count: selesai },
  ];

  return (
    <SafeAreaView className="flex-1 bg-background">
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerClassName="pb-28"
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refetch} tintColor="#00236f" />}
        ListHeaderComponent={
          <View>
            <View className="flex-row items-center justify-between px-5 pt-4 pb-3">
              <View className="flex-row items-center gap-2">
                <View className="w-8 h-8 rounded-full bg-primary-container items-center justify-center">
                  <Home size={18} color="#90a8ff" />
                </View>
                        <Text className="font-sans text-lg font-bold text-primary">PorLapor</Text>
              </View>
              <TouchableOpacity className="p-2 rounded-full hover:bg-surface-container">
                <Bell size={20} color="#444651" />
              </TouchableOpacity>
            </View>

            <View className="mx-5 mb-5 relative overflow-hidden rounded-xl bg-surface-container-high p-4 border border-outline-variant">
              <View className="relative z-10">
                <Text className="font-sans text-2xl font-bold text-primary mb-2">Laporan Terkini</Text>
                <Text className="font-body text-base text-on-surface-variant mb-3">
                  Pantau dan dukung laporan masyarakat di sekitar Anda.
                </Text>
                <View className="flex-row items-center gap-2 bg-surface rounded-full px-4 py-2 border border-outline-variant self-start">
                  <MapPin size={14} color="#757682" />
                  <Text className="font-body text-xs text-on-surface-variant">Jakarta Selatan</Text>
                </View>
              </View>
              <View className="absolute -right-16 -top-16 w-48 h-48 bg-primary-container opacity-10 rounded-full" />
              <View className="absolute -bottom-8 right-8 w-32 h-32 bg-secondary-container opacity-10 rounded-full" />
            </View>

            <View className="flex-row gap-2 mx-5 mb-4">
              <StatBadge icon={Inbox} label="Total" value={total} bg="bg-surface-container" textColor="text-on-surface-variant" valueColor="text-on-surface" />
              <StatBadge icon={Activity} label="Diproses" value={proses + menunggu} bg="bg-secondary-fixed" textColor="text-on-secondary-fixed" valueColor="text-on-surface" />
              <StatBadge icon={CheckCircle2} label="Selesai" value={selesai} bg="bg-tertiary-fixed" textColor="text-on-tertiary-fixed" valueColor="text-on-surface" />
            </View>

            <View className="mx-5 mb-4">
              <TouchableOpacity
                onPress={() => navigation.navigate("CreateReport" as never)}
                className="bg-primary py-3.5 rounded-full flex-row items-center justify-center gap-2 shadow-md active:opacity-80"
              >
                <Plus size={20} color="#fff" />
                <Text className="text-on-primary font-sans text-sm font-semibold">Buat Laporan Baru</Text>
              </TouchableOpacity>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="px-5 mb-4">
              <View className="flex-row gap-2">
                {tabs.map((t) => (
                  <TouchableOpacity
                    key={t.key}
                    onPress={() => setTab(t.key)}
                    className={`px-4 py-2 rounded-full ${
                      tab === t.key
                        ? "bg-primary"
                        : "bg-surface border border-outline-variant"
                    }`}
                  >
                    <Text className={`font-body text-xs font-semibold ${tab === t.key ? "text-on-primary" : "text-on-surface-variant"}`}>
                      {t.label} ({t.count})
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigation.navigate("ReportDetail", { reportId: item.id })}>
            <ReportCardItem report={item} />
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View className="items-center mt-16">
            <Inbox size={48} color="#c5c5d3" />
            <Text className="text-on-surface-variant mt-4 font-medium">Belum ada laporan</Text>
            <TouchableOpacity onPress={() => navigation.navigate("CreateReport" as never)} className="bg-primary px-6 py-3 rounded-full mt-4">
              <Text className="text-on-primary font-bold">Buat Laporan Baru</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </SafeAreaView>
  );
}

function StatBadge({ icon: Icon, label, value, bg, textColor, valueColor }: { icon: any; label: string; value: number; bg: string; textColor: string; valueColor: string }) {
  return (
    <View className={`flex-1 ${bg} rounded-xl p-3`}>
      <Text className={`text-lg font-bold ${valueColor}`}>{value}</Text>
      <Text className={`text-xs font-bold ${textColor}`}>{label}</Text>
    </View>
  );
}

function ReportCardItem({ report }: { report: Report }) {
  const getStatusStyle = (status: string) => {
    switch (status) {
      case "PENDING":
      case "IN_REVIEW":
        return { bg: "bg-surface-variant", text: "text-on-surface-variant", icon: Clock };
      case "IN_PROGRESS":
        return { bg: "bg-secondary-container", text: "text-on-secondary-container", icon: Activity };
      case "RESOLVED":
        return { bg: "bg-tertiary-fixed", text: "text-on-tertiary-fixed", icon: CheckCircle2 };
      case "REJECTED":
        return { bg: "bg-error-container", text: "text-on-error-container", icon: Inbox };
      default:
        return { bg: "bg-surface-variant", text: "text-on-surface-variant", icon: Clock };
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "PENDING": return "Menunggu";
      case "IN_REVIEW": return "Ditinjau";
      case "IN_PROGRESS": return "Diproses";
      case "RESOLVED": return "Selesai";
      case "REJECTED": return "Ditolak";
      default: return status;
    }
  };

  const s = getStatusStyle(report.status);

  return (
    <View className="bg-surface-container-lowest rounded-xl mx-5 mb-3 border border-outline-variant shadow-sm overflow-hidden">
      <View className="p-4">
        <View className="flex-row justify-between items-start mb-2">
          <View className={`px-2 py-1 rounded ${s.bg} flex-row items-center gap-1`}>
            <Text className={`${s.text} text-xs font-bold`}>{getStatusLabel(report.status)}</Text>
          </View>
          {report.category && (
            <Text className="text-xs font-bold text-on-surface-variant uppercase">{report.category.name}</Text>
          )}
        </View>
        <Text className="font-sans text-lg font-bold text-on-surface mb-1">{report.title}</Text>
        <Text className="font-body text-sm text-on-surface-variant leading-relaxed mb-3" numberOfLines={3}>
          {report.description}
        </Text>
        <View className="flex-row items-center justify-between pt-3 border-t border-outline-variant">
          <View className="flex-row items-center gap-1 flex-1">
            <MapPin size={14} color="#757682" />
            <Text className="font-body text-xs text-on-surface-variant" numberOfLines={1}>
              {report.address || `${report.latitude}, ${report.longitude}`}
            </Text>
          </View>
          <View className="flex-row items-center gap-3">
            <View className="flex-row items-center gap-1">
              <MessageCircle size={14} color="#757682" />
              <Text className="font-body text-xs text-on-surface-variant font-semibold">{report._count?.comments ?? 0}</Text>
            </View>
            <View className="flex-row items-center gap-1">
              <ThumbsUp size={14} color="#757682" />
              <Text className="font-body text-xs text-on-surface-variant font-semibold">{report._count?.likes ?? 0}</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}
