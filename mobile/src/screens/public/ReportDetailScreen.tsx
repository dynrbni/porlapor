import { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, TextInput, Image, ActivityIndicator, Share, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ArrowLeft, Calendar, MapPin, MessageCircle, ThumbsUp, Send, Clock, CheckCircle2, ShieldAlert,
  Image as ImageIcon, User, Share2, Sparkles, FileText
} from "lucide-react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getReportById, addComment, toggleLike } from "../../api/reports";
import { useAuth } from "../../context/AuthContext";
import type { Report } from "../../types";

const statusConfig: Record<string, { label: string; bg: string; text: string; icon: any }> = {
  PENDING: { label: "Menunggu", bg: "bg-surface-variant", text: "text-on-surface-variant", icon: Clock },
  IN_REVIEW: { label: "Ditinjau", bg: "bg-primary-fixed", text: "text-on-primary-fixed", icon: Clock },
  IN_PROGRESS: { label: "Diproses", bg: "bg-secondary-container", text: "text-on-secondary-container", icon: Clock },
  RESOLVED: { label: "Selesai", bg: "bg-tertiary-fixed", text: "text-on-tertiary-fixed", icon: CheckCircle2 },
  REJECTED: { label: "Ditolak", bg: "bg-error-container", text: "text-on-error-container", icon: ShieldAlert },
};

const timelineSteps = [
  { key: "PENDING", label: "Laporan diterima" },
  { key: "IN_REVIEW", label: "Ditinjau oleh Admin" },
  { key: "IN_PROGRESS", label: "Diteruskan ke Instansi" },
  { key: "RESOLVED", label: "Laporan selesai" },
];

export default function ReportDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute<any>();
  const { reportId } = route.params;
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [commentText, setCommentText] = useState("");

  const { data, isLoading } = useQuery({ queryKey: ["report", reportId], queryFn: () => getReportById(reportId) });

  const commentMut = useMutation({
    mutationFn: () => addComment(reportId, commentText),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["report", reportId] }); setCommentText(""); },
  });

  const likeMut = useMutation({
    mutationFn: () => toggleLike(reportId),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["report", reportId] }); },
  });

  const report = data?.data;
  const status = report ? statusConfig[report.status] || statusConfig.PENDING : null;
  const StatusIcon = status?.icon;
  const isLiked = report?.likes?.some((l) => l.userId === user?.id);

  const currentStepIdx = report ? timelineSteps.findIndex(s => s.key === report.status) : 0;

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Laporan: ${report?.title || ""}\n${report?.description || ""}\n\nLink: ${Platform.OS === "web" ? window.location.href : reportId}`,
        title: report?.title || "Laporan PorLapor",
      });
    } catch {}
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-background">
        <View className="flex-1 items-center justify-center"><ActivityIndicator size="large" color="#00236f" /></View>
      </SafeAreaView>
    );
  }

  if (!report) {
    return (
      <SafeAreaView className="flex-1 bg-background">
        <View className="flex-1 items-center justify-center px-5">
          <ShieldAlert size={40} color="#ba1a1a" />
          <Text className="text-lg font-bold text-on-surface mt-3 font-sans">Laporan tidak ditemukan</Text>
          <TouchableOpacity onPress={() => navigation.goBack()} className="mt-4 bg-primary px-5 py-2 rounded-full">
            <Text className="text-on-primary font-bold">Kembali</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-row items-center px-5 py-3 bg-surface-container-lowest border-b border-outline-variant/30">
        <TouchableOpacity onPress={() => navigation.goBack()} className="p-1">
          <ArrowLeft size={24} color="#0b1c30" />
        </TouchableOpacity>
        <Text className="flex-1 text-lg font-bold text-on-surface ml-3 font-sans">Detail Laporan</Text>
        <TouchableOpacity onPress={handleShare} className="p-2">
          <Share2 size={20} color="#444651" />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="bg-surface-container-lowest mx-5 mt-4 rounded-xl border border-outline-variant shadow-sm overflow-hidden">
          {report.imageUrl ? (
            <Image source={{ uri: report.imageUrl }} className="w-full h-56" resizeMode="cover" />
          ) : (
            <View className="h-40 bg-surface-container items-center justify-center">
              <ImageIcon size={48} color="#757682" opacity={0.5} />
            </View>
          )}

          <View className="p-4">
            <View className="flex-row justify-between items-start mb-3">
              <Text className="text-lg font-bold text-on-surface flex-1 mr-3 font-sans">{report.title}</Text>
              {status && StatusIcon && (
                <View className={`${status.bg} px-2.5 py-1 rounded-full flex-row items-center gap-1`}>
                  <StatusIcon size={14} color={status.text.includes("primary") ? "#00236f" : status.text.includes("secondary") ? "#855300" : "#444651"} />
                  <Text className={`${status.text} text-xs font-bold`}>{status.label}</Text>
                </View>
              )}
            </View>
            <Text className="text-sm text-on-surface-variant leading-6 mb-4">{report.description}</Text>

            <View className="flex-row flex-wrap gap-2 mb-2">
              <View className="bg-surface-container px-3 py-1.5 rounded-full flex-row items-center gap-1">
                <FileText size={14} color="#00236f" />
                <Text className="text-xs font-semibold text-primary">{report.category?.name || "Umum"}</Text>
              </View>
              <View className="bg-surface-container px-3 py-1.5 rounded-full flex-row items-center gap-1">
                <MapPin size={14} color="#00236f" />
                <Text className="text-xs font-semibold text-primary">{report.address?.split(",")[0] || "Lokasi"}</Text>
              </View>
            </View>
          </View>
        </View>

        <View className="bg-surface-container-lowest mx-5 mt-3 rounded-xl border border-outline-variant shadow-sm p-4">
          <View className="flex-row items-center gap-2 mb-3">
            <MapPin size={16} color="#00236f" />
            <Text className="font-bold text-sm text-on-surface">Lokasi Kejadian</Text>
          </View>
          <View className="h-40 bg-surface-variant rounded-lg items-center justify-center mb-2 border border-outline-variant">
            <MapPin size={32} color="#757682" />
            <Text className="text-xs text-on-surface-variant mt-1">{report.latitude}, {report.longitude}</Text>
          </View>
          <Text className="text-xs text-on-surface-variant">{report.address || `${report.latitude}, ${report.longitude}`}</Text>
        </View>

        {report.officialNotes && report.officialNotes.length > 0 && (
          <View className="bg-surface-container-high mx-5 mt-3 rounded-xl border-l-4 border-primary p-4">
            <Text className="font-bold text-sm text-primary mb-2">Tanggapan Resmi</Text>
            {report.officialNotes.map((note) => (
              <View key={note.id} className="mb-2 last:mb-0">
                <Text className="text-sm text-on-surface">{note.content}</Text>
                <Text className="text-xs text-outline mt-1">{note.author?.name} • {new Date(note.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "short" })}</Text>
              </View>
            ))}
          </View>
        )}

        <View className="bg-surface-container-lowest mx-5 mt-3 rounded-xl border border-outline-variant shadow-sm p-4">
          <Text className="font-bold text-sm text-on-surface mb-3 flex-row items-center gap-1">
            Status Laporan
          </Text>
          <View className="pl-5 border-l-2 border-dashed border-outline-variant">
            {timelineSteps.map((step, idx) => {
              const isCompleted = idx < currentStepIdx;
              const isCurrent = idx === currentStepIdx;
              return (
                <View key={step.key} className={`flex-row items-start mb-4 last:mb-0 ${!isCompleted && !isCurrent ? "opacity-50" : ""}`}>
                  <View className={`w-4 h-4 rounded-full items-center justify-center -ml-[23px] mt-0.5 ${isCompleted ? "bg-tertiary-fixed" : isCurrent ? "bg-surface-container-lowest border-2 border-primary" : "bg-surface-variant border-2 border-outline-variant"}`}>
                    {isCompleted && <CheckCircle2 size={12} color="#00311f" />}
                    {isCurrent && <View className="w-2 h-2 rounded-full bg-primary" />}
                  </View>
                  <View className="ml-3">
                    <Text className={`text-xs font-bold ${isCurrent ? "text-primary" : "text-on-surface"}`}>{step.label}</Text>
                    {isCurrent && (
                      <View className={`${status?.bg} px-2 py-0.5 rounded mt-0.5`}>
                        <Text className={`${status?.text} text-[10px] font-bold`}>{status?.label}</Text>
                      </View>
                    )}
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        <View className="bg-surface-container-lowest mx-5 mt-3 rounded-xl border border-outline-variant shadow-sm overflow-hidden mb-6">
          <View className="p-4 border-b border-outline-variant/30">
            <View className="flex-row items-center justify-between">
              <Text className="font-bold text-sm text-on-surface">Diskusi Publik</Text>
              <Text className="text-xs text-on-surface-variant bg-surface-container px-2 py-1 rounded-full">
                {report.comments?.length || 0} Komentar
              </Text>
            </View>
          </View>

          <View className="p-4">
            <TouchableOpacity
              onPress={() => likeMut.mutate()}
              disabled={!user || likeMut.isPending}
              className={`flex-row items-center gap-1.5 px-3 py-2 rounded-full mb-3 ${isLiked ? "bg-primary-fixed" : "bg-surface-container"}`}
            >
              <ThumbsUp size={16} color={isLiked ? "#00236f" : "#444651"} fill={isLiked ? "#00236f" : "transparent"} />
              <Text className={`text-xs font-semibold ${isLiked ? "text-primary" : "text-on-surface-variant"}`}>
                Dukung ({report._count?.likes ?? 0})
              </Text>
            </TouchableOpacity>

            {(!report.comments || report.comments.length === 0) ? (
              <View className="bg-surface-container-low rounded-lg border border-dashed border-outline-variant p-5 items-center mb-3">
                <MessageCircle size={20} color="#757682" />
                <Text className="text-xs text-on-surface-variant mt-2">Belum ada diskusi.</Text>
              </View>
            ) : (
              <View className="mb-3 space-y-3">
                {report.comments.map((c) => (
                  <View key={c.id} className="flex-row gap-2">
                    <View className={`w-7 h-7 rounded-full items-center justify-center ${c.author.role === "USER" ? "bg-surface-container" : "bg-primary"}`}>
                      <Text className={`text-xs font-bold ${c.author.role === "USER" ? "text-primary" : "text-on-primary"}`}>
                        {(c.author.name || "U").charAt(0).toUpperCase()}
                      </Text>
                    </View>
                    <View className="flex-1">
                      <View className="bg-surface-container-low rounded-lg p-3 border border-surface-container-highest">
                        <Text className="text-xs font-bold text-on-surface mb-0.5">{c.author.name}</Text>
                        <Text className="text-xs text-on-surface-variant">{c.content}</Text>
                      </View>
                      <Text className="text-[10px] text-outline mt-1 ml-1">
                        {new Date(c.createdAt).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            )}

            {user ? (
              <View className="flex-row gap-2 pt-3 border-t border-outline-variant/30">
                <TextInput
                  value={commentText}
                  onChangeText={setCommentText}
                  placeholder="Tulis komentar..."
                  placeholderTextColor="#757682"
                  className="flex-1 bg-surface-container-low border border-outline-variant rounded-full px-4 py-2 text-xs text-on-surface"
                />
                <TouchableOpacity
                  onPress={() => commentMut.mutate()}
                  disabled={!commentText.trim() || commentMut.isPending}
                  className="w-9 h-9 rounded-full bg-primary items-center justify-center disabled:opacity-50"
                >
                  <Send size={16} color="#fff" />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity onPress={() => navigation.navigate("Login" as never)} className="bg-surface-container rounded-lg p-4 items-center">
                <Text className="text-sm font-semibold text-primary">Login untuk berkomentar</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
