import { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, TextInput, Image, ActivityIndicator, Share } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  MapPin, CheckCircle2, Clock, MessageCircle, ThumbsUp, Send, Verified, User,
} from "lucide-react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getReportById, addComment, toggleLike } from "../../api/reports";
import { useAuth } from "../../context/AuthContext";
import { StitchHeader } from "../../components/ui/StitchHeader";
import { timeAgo, statusLabels, colors } from "../../theme";

const timelineSteps = [
  { key: "IN_PROGRESS", label: "Diteruskan ke Instansi Terkait" },
  { key: "IN_REVIEW", label: "Ditinjau oleh Admin" },
  { key: "PENDING", label: "Laporan diterima" },
];

export default function ReportDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute<any>();
  const { reportId } = route.params;
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [commentText, setCommentText] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["report", reportId],
    queryFn: () => getReportById(reportId),
  });

  const commentMut = useMutation({
    mutationFn: () => addComment(reportId, commentText),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["report", reportId] }); setCommentText(""); },
  });

  const likeMut = useMutation({
    mutationFn: () => toggleLike(reportId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["report", reportId] }),
  });

  const report = data?.data;
  const isLiked = report?.likes?.some((l) => l.userId === user?.id);
  const shortId = report?.id?.substring(0, 7).toUpperCase() || "";
  const currentIdx = report ? timelineSteps.findIndex((s) => s.key === report.status) : -1;

  const handleShare = async () => {
    try {
      await Share.share({ message: `${report?.title}\n${report?.description}`, title: report?.title });
    } catch {}
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-background items-center justify-center">
        <ActivityIndicator size="large" color={colors.primary} />
      </SafeAreaView>
    );
  }

  if (!report) {
    return (
      <SafeAreaView className="flex-1 bg-background items-center justify-center px-6">
        <Text className="font-sans text-lg font-bold text-on-surface">Laporan tidak ditemukan</Text>
        <TouchableOpacity onPress={() => navigation.goBack()} className="mt-4 bg-primary px-5 py-2.5 rounded-xl">
          <Text className="text-on-primary font-bold">Kembali</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const statusLabel = statusLabels[report.status] || report.status;

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <StitchHeader variant="detail" title={`Detail Laporan #${shortId}`} onBack={() => navigation.goBack()} onShare={handleShare} />

      <ScrollView className="flex-1" contentContainerClassName="pb-8" showsVerticalScrollIndicator={false}>
        <View className="relative mx-4 mt-4 rounded-xl overflow-hidden border border-outline-variant" style={{ aspectRatio: 4 / 3 }}>
          {report.imageUrl ? (
            <Image source={{ uri: report.imageUrl }} className="w-full h-full" resizeMode="cover" />
          ) : (
            <View className="w-full h-full bg-surface-variant items-center justify-center">
              <MapPin size={40} color={colors.outline} />
            </View>
          )}
          <View className="absolute top-3 left-3 px-3 py-1 rounded-full flex-row items-center gap-1.5" style={{ backgroundColor: colors.warningBg, borderWidth: 1, borderColor: colors.warningBorder }}>
            <Clock size={14} color={colors.warningText} />
            <Text className="font-body text-xs font-semibold" style={{ color: colors.warningText }}>{statusLabel.toUpperCase()}</Text>
          </View>
        </View>

        <View className="bg-surface-container-lowest mx-4 mt-4 rounded-xl border border-outline-variant p-4 shadow-sm">
          <View className="flex-row justify-between items-start gap-3 mb-2">
            <Text className="font-sans text-xl font-semibold text-on-surface flex-1">{report.title}</Text>
            <Text className="font-body text-xs text-outline">{timeAgo(report.createdAt)}</Text>
          </View>
          <Text className="font-body text-base text-on-surface-variant leading-relaxed mb-3">{report.description}</Text>
          <View className="flex-row flex-wrap gap-2">
            <View className="bg-surface-container px-3 py-1 rounded-full flex-row items-center gap-1">
              <Text className="font-body text-xs font-semibold text-primary">{report.category?.name || "Umum"}</Text>
            </View>
            {report.address && (
              <View className="bg-surface-container px-3 py-1 rounded-full flex-row items-center gap-1">
                <MapPin size={12} color={colors.primary} />
                <Text className="font-body text-xs font-semibold text-primary" numberOfLines={1}>{report.address.split(",")[0]}</Text>
              </View>
            )}
          </View>
        </View>

        <View className="bg-surface-container-lowest mx-4 mt-3 rounded-xl border border-outline-variant p-4">
          <Text className="font-body text-sm font-semibold text-on-surface mb-3">Lokasi Kejadian</Text>
          <View className="h-40 bg-surface-variant rounded-lg items-center justify-center border border-outline-variant mb-2">
            <MapPin size={32} color={colors.error} />
            <Text className="font-body text-xs text-on-surface-variant mt-2">{report.latitude?.toFixed(4)}, {report.longitude?.toFixed(4)}</Text>
          </View>
          <Text className="font-body text-sm text-on-surface-variant mt-2">{report.address}</Text>
        </View>

        {report.officialNotes && report.officialNotes.length > 0 && (
          <View className="bg-surface-container-high mx-4 mt-3 rounded-xl border-l-4 border-primary p-4 overflow-hidden">
            <View className="flex-row items-center gap-2 mb-2">
              <Verified size={18} color={colors.primary} />
              <Text className="font-body text-sm font-semibold text-primary">Tanggapan Resmi</Text>
            </View>
            {report.officialNotes.map((note) => (
              <View key={note.id}>
                <Text className="font-body text-sm text-on-surface leading-relaxed">{note.content}</Text>
                <Text className="font-body text-xs text-outline mt-1">Dibalas: {new Date(note.createdAt).toLocaleString("id-ID")}</Text>
              </View>
            ))}
          </View>
        )}

        <View className="bg-surface-container-lowest mx-4 mt-3 rounded-xl border border-outline-variant p-4">
          <View className="flex-row items-center gap-2 mb-4">
            <Clock size={18} color={colors.primary} />
            <Text className="font-body text-sm font-semibold text-on-surface">Status Laporan</Text>
          </View>
          <View className="pl-6 border-l-2 border-dashed border-outline-variant">
            {timelineSteps.map((step, idx) => {
              const isActive = idx === currentIdx;
              const isDone = idx > currentIdx;
              const label = step.key === "IN_PROGRESS" && report.agency ? `Diteruskan ke ${report.agency.name}` : step.label;
              return (
                <View key={step.key} className="relative mb-6">
                  <View className={`absolute -left-[31px] w-4 h-4 rounded-full items-center justify-center ${isDone ? "bg-tertiary-fixed" : isActive ? "bg-surface border-2 border-primary" : "bg-outline-variant"}`}>
                    {isDone && <CheckCircle2 size={10} color={colors.onTertiaryFixed} />}
                    {isActive && <View className="w-2 h-2 rounded-full bg-primary" />}
                  </View>
                  <Text className={`font-body text-sm font-semibold ${isActive ? "text-primary" : "text-on-surface"}`}>{label}</Text>
                </View>
              );
            })}
          </View>
        </View>

        <View className="bg-surface-container-lowest mx-4 mt-3 rounded-xl border border-outline-variant overflow-hidden">
          <View className="p-4 border-b border-outline-variant flex-row items-center justify-between">
            <View className="flex-row items-center gap-2">
              <MessageCircle size={18} color={colors.primary} />
              <Text className="font-body text-sm font-semibold text-on-surface">Diskusi Publik</Text>
            </View>
            <View className="bg-surface-container px-2.5 py-1 rounded-full">
              <Text className="font-body text-xs text-outline">{report.comments?.length || 0} Komentar</Text>
            </View>
          </View>

          <View className="p-4">
            <TouchableOpacity
              onPress={() => user ? likeMut.mutate() : navigation.navigate("Login" as never)}
              disabled={likeMut.isPending}
              className="flex-row items-center gap-2 self-start px-3 py-1.5 rounded-full border border-outline-variant mb-4"
            >
              <ThumbsUp size={18} color={isLiked ? colors.primary : colors.onSurfaceVariant} />
              <Text className="font-body text-xs font-semibold text-primary">Dukung Laporan ({report._count?.likes ?? 0})</Text>
            </TouchableOpacity>

            {(report.comments || []).map((c) => (
              <View key={c.id} className="flex-row gap-3 mb-4">
                <View className="w-8 h-8 rounded-full bg-surface-container items-center justify-center">
                  <Text className="font-body text-xs font-bold text-primary">{(c.author.name || "U").charAt(0)}</Text>
                </View>
                <View className="flex-1">
                  <View className="bg-surface-container-low rounded-lg p-3 border border-surface-container-highest rounded-tl-none">
                    <Text className="font-body text-xs font-semibold text-on-surface mb-1">{c.author.name}</Text>
                    <Text className="font-body text-sm text-on-surface-variant">{c.content}</Text>
                  </View>
                  <Text className="font-body text-[11px] text-outline mt-1 ml-1">{timeAgo(c.createdAt)}</Text>
                </View>
              </View>
            ))}

            {user ? (
              <View className="flex-row gap-2 pt-4 border-t border-outline-variant">
                <TextInput value={commentText} onChangeText={setCommentText} placeholder="Tulis komentar..." placeholderTextColor="#94a3b8" className="flex-1 bg-surface-container-low border border-outline-variant rounded-full px-4 py-2.5 font-body text-sm text-on-surface" />
                <TouchableOpacity onPress={() => commentMut.mutate()} disabled={!commentText.trim()} className="w-10 h-10 rounded-full bg-primary items-center justify-center" style={{ opacity: !commentText.trim() ? 0.5 : 1 }}>
                  <Send size={16} color="#fff" />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity onPress={() => navigation.navigate("Login" as never)} className="bg-primary-fixed rounded-xl p-4 items-center mt-2">
                <Text className="font-body text-sm font-bold text-primary">Masuk untuk berkomentar</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
