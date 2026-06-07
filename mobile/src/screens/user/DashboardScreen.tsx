import { View, Text, FlatList, TouchableOpacity, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Inbox, Activity, CheckCircle2, Plus, Sparkles, MapPin, MessageCircle, ThumbsUp, Home, User, Bell } from "lucide-react-native";
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
    { key: "proses", label: "Proses", count: proses },
    { key: "selesai", label: "Selesai", count: selesai },
  ];

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="bg-surface-container-lowest border-b border-outline-variant/30 px-5 pt-4 pb-3">
        <View className="flex-row items-center justify-between mb-1">
          <View>
            <Text className="text-xs font-bold uppercase tracking-widest text-primary">Dashboard Warga</Text>
            <Text className="text-2xl font-bold text-on-surface mt-1 font-sans">
              Halo, {user?.name || "Pengguna"}
            </Text>
            <Text className="text-sm text-on-surface-variant mt-0.5">
              Pantau dan dukung laporan masyarakat.
            </Text>
          </View>
          <TouchableOpacity className="w-9 h-9 rounded-full bg-surface-container-high items-center justify-center">
            <Bell size={18} color="#444651" />
          </TouchableOpacity>
        </View>

        <View className="flex-row gap-2 mt-4">
          <StatBadge icon={Inbox} label="Total" value={total} bg="bg-primary-fixed" textColor="text-primary" />
          <StatBadge icon={Activity} label="Diproses" value={proses + menunggu} bg="bg-secondary-fixed" textColor="text-on-secondary-fixed" />
          <StatBadge icon={CheckCircle2} label="Selesai" value={selesai} bg="bg-tertiary-fixed" textColor="text-on-tertiary-fixed" />
        </View>
      </View>

      <View className="px-5 mt-3">
        <TouchableOpacity
          onPress={() => navigation.navigate("CreateReport" as never)}
          className="bg-primary py-3.5 rounded-full flex-row items-center justify-center gap-2 shadow-md active:opacity-80"
        >
          <Plus size={20} color="#fff" />
          <Text className="text-on-primary font-bold">Buat Laporan Baru</Text>
        </TouchableOpacity>
      </View>

      <View className="px-5 mt-5 mb-2">
        <View className="flex-row bg-surface-container rounded-full p-1">
          {tabs.map((t) => (
            <TouchableOpacity
              key={t.key}
              onPress={() => setTab(t.key)}
              className={`flex-1 py-2.5 rounded-full ${tab === t.key ? "bg-surface-container-lowest shadow-sm" : ""}`}
            >
              <Text className={`text-center text-xs font-bold ${tab === t.key ? "text-primary" : "text-on-surface-variant"}`}>
                {t.label} ({t.count})
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerClassName="px-5 pb-24 mt-1"
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refetch} tintColor="#00236f" />}
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

function StatBadge({ icon: Icon, label, value, bg, textColor }: { icon: any; label: string; value: number; bg: string; textColor: string }) {
  return (
    <View className={`flex-1 ${bg} rounded-xl p-3`}>
      <Text className="text-lg font-bold text-on-surface">{value}</Text>
      <Text className={`text-xs font-bold ${textColor}`}>{label}</Text>
    </View>
  );
}

function ReportCardItem({ report }: { report: Report }) {
  const getStatusStyle = (status: string) => {
    switch (status) {
      case "PENDING":
      case "IN_REVIEW":
        return { bg: "bg-surface-variant", text: "text-on-surface-variant" };
      case "IN_PROGRESS":
        return { bg: "bg-secondary-container", text: "text-on-secondary-container" };
      case "RESOLVED":
        return { bg: "bg-tertiary-fixed", text: "text-on-tertiary-fixed" };
      case "REJECTED":
        return { bg: "bg-error-container", text: "text-on-error-container" };
      default:
        return { bg: "bg-surface-variant", text: "text-on-surface-variant" };
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
    <View className="bg-surface-container-lowest rounded-xl p-4 mb-3 border border-outline-variant shadow-sm">
      <View className="flex-row justify-between items-start mb-2">
        <View className={`px-2 py-1 rounded ${s.bg}`}>
          <Text className={`${s.text} text-xs font-bold`}>{getStatusLabel(report.status)}</Text>
        </View>
        {report.category && (
          <Text className="text-xs font-bold text-on-surface-variant uppercase">{report.category.name}</Text>
        )}
      </View>
      <Text className="text-lg font-bold text-on-surface mb-1 font-sans">{report.title}</Text>
      <Text className="text-sm text-on-surface-variant leading-relaxed mb-3" numberOfLines={3}>
        {report.description}
      </Text>
      <View className="flex-row items-center justify-between pt-3 border-t border-outline-variant/30">
        <View className="flex-row items-center gap-1 flex-1">
          <MapPin size={14} color="#757682" />
          <Text className="text-xs text-on-surface-variant" numberOfLines={1}>
            {report.address || `${report.latitude}, ${report.longitude}`}
          </Text>
        </View>
        <View className="flex-row items-center gap-3">
          <View className="flex-row items-center gap-1">
            <MessageCircle size={14} color="#757682" />
            <Text className="text-xs text-on-surface-variant font-semibold">{report._count?.comments ?? 0}</Text>
          </View>
          <View className="flex-row items-center gap-1">
            <ThumbsUp size={14} color="#757682" />
            <Text className="text-xs text-on-surface-variant font-semibold">{report._count?.likes ?? 0}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}
