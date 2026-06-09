import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Bell, BellDot, CheckCircle2, Circle } from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getNotifications, markAsRead, markAllAsRead, type AppNotification } from "../../api/notifications";
import { StitchHeader } from "../../components/ui/StitchHeader";
import { colors, timeAgo } from "../../theme";
import type { UserStackParamList } from "../../navigation/UserTabs";

type Nav = NativeStackNavigationProp<UserStackParamList, "Notifications">;

export default function NotificationScreen() {
  const navigation = useNavigation<Nav>();
  const queryClient = useQueryClient();

  const { data, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ["notifications"],
    queryFn: getNotifications,
    refetchInterval: 15000,
  });

  const readMut = useMutation({
    mutationFn: markAsRead,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notifications"] }),
  });

  const readAllMut = useMutation({
    mutationFn: markAllAsRead,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notifications"] }),
  });

  const notifications: AppNotification[] = data?.data || [];
  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handlePress = (n: AppNotification) => {
    if (!n.isRead) readMut.mutate(n.id);
    if (n.reportId) {
      navigation.navigate("ReportDetail", { reportId: n.reportId });
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <StitchHeader variant="flow" title="Notifikasi" onBack={() => navigation.goBack()} />

      <View className="flex-row items-center justify-between px-6 py-4 bg-surface-container-lowest border-b border-outline-variant/30">
        <View className="flex-row items-center gap-2">
          {unreadCount > 0 ? (
            <BellDot size={20} color={colors.primary} />
          ) : (
            <Bell size={20} color={colors.onSurfaceVariant} />
          )}
          <Text className="font-sans text-[15px] font-bold text-on-surface">
            {unreadCount > 0 ? `${unreadCount} Belum Dibaca` : "Semua Dibaca"}
          </Text>
        </View>
        {unreadCount > 0 && (
          <TouchableOpacity onPress={() => readAllMut.mutate()} disabled={readAllMut.isPending} activeOpacity={0.7}>
            <Text className="font-sans text-[13px] font-bold text-primary tracking-wide">Tandai Semua Dibaca</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView
        className="flex-1"
        contentContainerClassName={notifications.length === 0 ? "flex-1" : "pb-12"}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} colors={[colors.primary]} />
        }
      >
        {isLoading && !isRefetching ? (
          <ActivityIndicator size="large" color={colors.primary} className="mt-12" />
        ) : notifications.length === 0 ? (
          <View className="flex-1 items-center justify-center px-8">
            <View className="w-20 h-20 bg-surface-container rounded-full items-center justify-center mb-5">
              <Bell size={32} color={colors.outline} />
            </View>
            <Text className="font-sans text-lg font-bold text-on-surface mb-2 tracking-tight">Tidak Ada Notifikasi</Text>
            <Text className="font-body text-sm text-on-surface-variant text-center leading-relaxed">
              Anda belum memiliki pemberitahuan apa pun saat ini.
            </Text>
          </View>
        ) : (
          <View className="px-5 pt-4 gap-3">
            {notifications.map((n) => (
              <TouchableOpacity
                key={n.id}
                onPress={() => handlePress(n)}
                activeOpacity={0.8}
                className={`rounded-2xl p-5 border ${
                  n.isRead ? "bg-surface-container-lowest border-outline-variant/30" : "bg-primary/5 border-primary/20 shadow-sm"
                }`}
              >
                <View className="flex-row items-start gap-4">
                  <View className={`w-10 h-10 rounded-full items-center justify-center mt-0.5 ${n.isRead ? "bg-surface-container" : "bg-primary/10"}`}>
                    <Bell size={18} color={n.isRead ? colors.onSurfaceVariant : colors.primary} />
                  </View>
                  <View className="flex-1">
                    <View className="flex-row items-start justify-between gap-2 mb-1.5">
                      <Text className={`flex-1 font-sans text-sm ${n.isRead ? "font-semibold text-on-surface" : "font-bold text-primary"}`}>
                        {n.type === "new_report" ? "Laporan Baru" : n.type === "comment" ? "Komentar Baru" : n.type === "like" ? "Dukungan Baru" : n.type === "status_change" ? "Pembaruan Status" : "Notifikasi"}
                      </Text>
                      <Text className="font-sans text-[10px] font-bold text-outline tracking-wider mt-0.5">
                        {timeAgo(n.createdAt).toUpperCase()}
                      </Text>
                    </View>
                    <Text className="font-body text-[13px] text-on-surface-variant leading-relaxed">
                      {n.message}
                    </Text>
                  </View>
                  {!n.isRead && (
                    <View className="w-2.5 h-2.5 bg-primary rounded-full mt-2" />
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
