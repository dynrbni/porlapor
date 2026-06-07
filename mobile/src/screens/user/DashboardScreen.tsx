import { View, Text, FlatList, TouchableOpacity, RefreshControl, ScrollView, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Inbox, Activity, CheckCircle2, Plus, MapPin, MessageCircle, ThumbsUp, Home, Bell, Clock, AlertCircle } from "lucide-react-native";
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

const statusConfig: Record<string, { bg: string; text: string; icon: any; label: string }> = {
  PENDING: { bg: "bg-warning-soft", text: "text-warning", icon: Clock, label: "Menunggu" },
  IN_REVIEW: { bg: "bg-secondary-soft", text: "text-secondary", icon: AlertCircle, label: "Ditinjau" },
  IN_PROGRESS: { bg: "bg-secondary-soft", text: "text-secondary", icon: Activity, label: "Diproses" },
  RESOLVED: { bg: "bg-success-soft", text: "text-success", icon: CheckCircle2, label: "Selesai" },
  REJECTED: { bg: "bg-error-container", text: "text-error", icon: AlertCircle, label: "Ditolak" },
};

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
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerClassName="pb-28"
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refetch} tintColor="#007AFF" />}
        ListHeaderComponent={
          <View>
            <View className="flex-row items-center justify-between px-5 pt-3 pb-2 bg-white">
              <View className="flex-row items-center gap-3">
                <View className="w-11 h-11 bg-primary-soft rounded-full items-center justify-center">
                  <Text className="text-primary font-sans text-base font-extrabold">
                    {user?.name?.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase() || "U"}
                  </Text>
                </View>
                <View>
                  <Text className="font-body text-xs text-on-surface-variant">Halo,</Text>
                  <Text className="font-sans text-base font-bold text-on-surface" numberOfLines={1}>
                    {user?.name || "Pengguna"}
                  </Text>
                </View>
              </View>
              <TouchableOpacity className="w-11 h-11 bg-white border border-outline-variant rounded-full items-center justify-center">
                <Bell size={18} color="#475569" />
              </TouchableOpacity>
            </View>

            <View className="mx-5 mb-4 mt-2 relative overflow-hidden rounded-3xl bg-primary p-5 shadow-soft">
              <View className="relative z-10">
                <Text className="font-sans text-2xl font-extrabold text-white mb-1">Laporan Terkini</Text>
                <Text className="font-body text-sm text-white/85 mb-4 leading-relaxed">
                  Pantau dan dukung laporan masyarakat di sekitar Anda.
                </Text>
                <TouchableOpacity
                  onPress={() => navigation.navigate("CreateReport")}
                  activeOpacity={0.85}
                  className="bg-white py-2.5 px-4 rounded-xl flex-row items-center justify-center gap-2 self-start"
                >
                  <Plus size={16} color="#007AFF" />
                  <Text className="text-primary font-sans text-sm font-bold">Buat Laporan</Text>
                </TouchableOpacity>
              </View>
              <View className="absolute -right-12 -top-12 w-40 h-40 bg-white/10 rounded-full" />
              <View className="absolute -bottom-8 right-8 w-24 h-24 bg-white/10 rounded-full" />
            </View>

            <View className="flex-row gap-3 mx-5 mb-4">
              <StatCard icon={Inbox} label="Total" value={total} bg="bg-white" textColor="text-on-surface-variant" iconBg="bg-primary-soft" iconColor="#007AFF" />
              <StatCard icon={Activity} label="Diproses" value={proses + menunggu} bg="bg-white" textColor="text-on-surface-variant" iconBg="bg-secondary-soft" iconColor="#2563eb" />
              <StatCard icon={CheckCircle2} label="Selesai" value={selesai} bg="bg-white" textColor="text-on-surface-variant" iconBg="bg-success-soft" iconColor="#059669" />
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="px-5 mb-2">
              <View className="flex-row gap-2">
                {tabs.map((t) => (
                  <TouchableOpacity
                    key={t.key}
                    onPress={() => setTab(t.key)}
                    activeOpacity={0.7}
                    className={`px-4 py-2.5 rounded-full ${tab === t.key ? "bg-primary" : "bg-white border border-outline-variant"}`}
                  >
                    <Text className={`font-body text-xs font-semibold ${tab === t.key ? "text-on-primary" : "text-on-surface-variant"}`}>
                      {t.label} · {t.count}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigation.navigate("ReportDetail", { reportId: item.id })} activeOpacity={0.85}>
            <ReportCardItem report={item} />
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View className="items-center mt-12 px-8">
            <View className="w-16 h-16 bg-primary-soft rounded-full items-center justify-center mb-4">
              <Inbox size={32} color="#007AFF" />
            </View>
            <Text className="text-on-surface font-sans text-base font-bold mb-1">Belum ada laporan</Text>
            <Text className="text-on-surface-variant font-body text-sm text-center mb-5">
              Mulai buat laporan pertamamu untuk mengawal perubahan.
            </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate("CreateReport")}
              activeOpacity={0.85}
              className="bg-primary py-3 px-6 rounded-2xl flex-row items-center gap-2"
            >
              <Plus size={16} color="#fff" />
              <Text className="text-on-primary font-sans text-sm font-bold">Buat Laporan Baru</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </SafeAreaView>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  bg,
  textColor,
  iconBg,
  iconColor,
}: {
  icon: any;
  label: string;
  value: number;
  bg: string;
  textColor: string;
  iconBg: string;
  iconColor: string;
}) {
  return (
    <View className={`flex-1 ${bg} rounded-2xl p-3.5 border border-outline-variant shadow-sm`}>
      <View className={`w-9 h-9 ${iconBg} rounded-lg items-center justify-center mb-2.5`}>
        <Icon size={18} color={iconColor} />
      </View>
      <Text className="text-xl font-extrabold text-on-surface">{value}</Text>
      <Text className={`text-xs font-semibold ${textColor}`}>{label}</Text>
    </View>
  );
}

function ReportCardItem({ report }: { report: Report }) {
  const s = statusConfig[report.status] || statusConfig.PENDING;
  const Icon = s.icon;

  return (
    <View className="bg-white rounded-2xl mx-5 mb-3 border border-outline-variant shadow-sm overflow-hidden">
      <View className="p-4">
        <View className="flex-row justify-between items-start mb-2.5">
          <View className={`px-2.5 py-1 rounded-lg ${s.bg} flex-row items-center gap-1.5`}>
            <Icon size={12} color="#0f172a" />
            <Text className={`${s.text} text-[11px] font-bold`}>{s.label}</Text>
          </View>
          {report.category && (
            <Text className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wide">
              {report.category.name}
            </Text>
          )}
        </View>
        <Text className="font-sans text-base font-bold text-on-surface mb-1.5">{report.title}</Text>
        <Text className="font-body text-sm text-on-surface-variant leading-relaxed mb-3" numberOfLines={2}>
          {report.description}
        </Text>
        <View className="flex-row items-center justify-between pt-3 border-t border-outline-variant">
          <View className="flex-row items-center gap-1.5 flex-1 mr-2">
            <MapPin size={13} color="#94a3b8" />
            <Text className="font-body text-xs text-on-surface-variant" numberOfLines={1}>
              {report.address || `${report.latitude}, ${report.longitude}`}
            </Text>
          </View>
          <View className="flex-row items-center gap-3">
            <View className="flex-row items-center gap-1">
              <MessageCircle size={13} color="#94a3b8" />
              <Text className="font-body text-xs text-on-surface-variant font-semibold">{report._count?.comments ?? 0}</Text>
            </View>
            <View className="flex-row items-center gap-1">
              <ThumbsUp size={13} color="#94a3b8" />
              <Text className="font-body text-xs text-on-surface-variant font-semibold">{report._count?.likes ?? 0}</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}
