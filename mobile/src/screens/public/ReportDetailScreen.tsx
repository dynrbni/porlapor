import { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, TextInput, Image, ActivityIndicator, Share, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ArrowLeft, Calendar, MapPin, MessageCircle, ThumbsUp, Send, Clock, CheckCircle2, ShieldAlert,
  Image as ImageIcon, Share2, FileText
} from "lucide-react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getReportById, addComment, toggleLike } from "../../api/reports";
import { useAuth } from "../../context/AuthContext";

const statusConfig: Record<string, { label: string; bg: string; text: string; icon: any }> = {
  PENDING: { label: "Menunggu", bg: "bg-warning-soft", text: "text-warning", icon: Clock },
  IN_REVIEW: { label: "Ditinjau", bg: "bg-secondary-soft", text: "text-secondary", icon: Clock },
  IN_PROGRESS: { label: "Diproses", bg: "bg-secondary-soft", text: "text-secondary", icon: Clock },
  RESOLVED: { label: "Selesai", bg: "bg-success-soft", text: "text-success", icon: CheckCircle2 },
  REJECTED: { label: "Ditolak", bg: "bg-error-container", text: "text-error", icon: ShieldAlert },
};

const timelineSteps = [
  { key: "PENDING", label: "Laporan Diterima" },
  { key: "IN_REVIEW", label: "Ditinjau Admin" },
  { key: "IN_PROGRESS", label: "Diteruskan ke Instansi" },
  { key: "RESOLVED", label: "Laporan Selesai" },
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
  const isLiked = report?.likes?.some((l) => l.userId === user?.id);
  const currentStepIdx = report ? timelineSteps.findIndex(s => s.key === report.status) : 0;

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Laporan: ${report?.title || ""}\n${report?.description || ""}`,
        title: report?.title || "Laporan PorLapor",
      });
    } catch {}
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-background">
        <View className="flex-1 items-center justify-center"><ActivityIndicator size="large" color="#0f766e" /></View>
      </SafeAreaView>
    );
  }

  if (!report) {
    return (
      <SafeAreaView className="flex-1 bg-background">
        <View className="flex-1 items-center justify-center px-5">
          <ShieldAlert size={40} color="#dc2626" />
          <Text className="font-sans text-lg font-extrabold text-on-surface mt-3">Laporan tidak ditemukan</Text>
          <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.85} className="mt-4 bg-primary px-5 py-2.5 rounded-2xl">
            <Text className="text-on-primary font-sans text-sm font-bold">Kembali</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <View className="flex-row items-center px-5 py-3 bg-white border-b border-outline-variant">
        <TouchableOpacity onPress={() => navigation.goBack()} className="w-9 h-9 items-center justify-center rounded-full bg-surface-container">
          <ArrowLeft size={18} color="#0f172a" />
        </TouchableOpacity>
        <Text className="flex-1 text-center font-sans text-base font-extrabold text-on-surface px-3" numberOfLines={1}>
          Detail Laporan
        </Text>
        <TouchableOpacity onPress={handleShare} className="w-9 h-9 items-center justify-center rounded-full bg-surface-container">
          <Share2 size={16} color="#475569" />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="bg-white mx-5 mt-4 rounded-2xl border border-outline-variant shadow-sm overflow-hidden">
          {report.imageUrl ? (
            <View className="relative">
              <Image source={{ uri: report.imageUrl }} className="w-full h-56" resizeMode="cover" />
              {status && (
                <View className={`absolute top-4 left-4 ${status.bg} px-3 py-1.5 rounded-full flex-row items-center gap-1.5 shadow-sm`}>
                  <Text className={`${status.text} font-body text-xs font-bold`}>{status.label}</Text>
                </View>
              )}
            </View>
          ) : (
            <View className="h-40 bg-surface-container-low items-center justify-center">
              <ImageIcon size={48} color="#cbd5e1" />
            </View>
          )}

          <View className="p-5">
            <Text className="font-sans text-xl font-extrabold text-on-surface mb-2">{report.title}</Text>
            <Text className="font-body text-sm text-on-surface-variant leading-relaxed mb-4">{report.description}</Text>

            <View className="flex-row flex-wrap gap-2">
              <View className="bg-primary-soft px-3 py-1.5 rounded-full flex-row items-center gap-1.5">
                <FileText size={13} color="#0f766e" />
                <Text className="font-body text-xs font-bold text-primary">{report.category?.name || "Umum"}</Text>
              </View>
              {report.address ? (
                <View className="bg-secondary-soft px-3 py-1.5 rounded-full flex-row items-center gap-1.5">
                  <MapPin size={13} color="#2563eb" />
                  <Text className="font-body text-xs font-bold text-secondary" numberOfLines={1}>
                    {report.address.split(",")[0]}
                  </Text>
                </View>
              ) : null}
            </View>
          </View>
        </View>

        <View className="bg-white mx-5 mt-3 rounded-2xl border border-outline-variant shadow-sm p-5">
          <View className="flex-row items-center gap-2 mb-3">
            <View className="w-8 h-8 bg-secondary-soft rounded-lg items-center justify-center">
              <MapPin size={16} color="#2563eb" />
            </View>
            <Text className="font-sans text-base font-extrabold text-on-surface">Lokasi Kejadian</Text>
          </View>
          <View className="h-32 bg-surface-container-low rounded-xl items-center justify-center mb-2 border border-outline-variant">
            <MapPin size={28} color="#94a3b8" />
            <Text className="font-body text-xs text-on-surface-variant mt-1.5 font-mono">
              {report.latitude}, {report.longitude}
            </Text>
          </View>
          <Text className="font-body text-sm text-on-surface-variant" numberOfLines={2}>
            {report.address || `${report.latitude}, ${report.longitude}`}
          </Text>
        </View>

        {report.officialNotes && report.officialNotes.length > 0 && (
          <View className="bg-primary-soft mx-5 mt-3 rounded-2xl border-l-4 border-primary p-5">
            <View className="flex-row items-center gap-2 mb-3">
              <View className="w-8 h-8 bg-primary rounded-lg items-center justify-center">
                <ShieldAlert size={16} color="#fff" />
              </View>
              <Text className="font-sans text-base font-extrabold text-primary">Tanggapan Resmi</Text>
            </View>
            {report.officialNotes.map((note) => (
              <View key={note.id} className="mb-2.5 last:mb-0">
                <Text className="font-body text-sm text-on-surface leading-relaxed">{note.content}</Text>
                <Text className="font-body text-xs text-on-surface-variant mt-1">
                  {note.author?.name} · {new Date(note.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "short" })}
                </Text>
              </View>
            ))}
          </View>
        )}

        <View className="bg-white mx-5 mt-3 rounded-2xl border border-outline-variant shadow-sm p-5">
          <View className="flex-row items-center gap-2 mb-4">
            <View className="w-8 h-8 bg-primary-soft rounded-lg items-center justify-center">
              <Clock size={16} color="#0f766e" />
            </View>
            <Text className="font-sans text-base font-extrabold text-on-surface">Status Laporan</Text>
          </View>
          <View className="pl-7 border-l-2 border-dashed border-outline-variant">
            {timelineSteps.map((step, idx) => {
              const isCompleted = idx < currentStepIdx;
              const isCurrent = idx === currentStepIdx;
              return (
                <View key={step.key} className={`relative mb-6 last:mb-0 ${!isCompleted && !isCurrent ? "opacity-40" : ""}`}>
                  <View className={`absolute -left-[34px] w-5 h-5 rounded-full items-center justify-center z-10 ${isCompleted ? "bg-success" : isCurrent ? "bg-white border-2 border-primary" : "bg-outline-variant border-2 border-outline-variant"}`}>
                    {isCompleted && <CheckCircle2 size={12} color="#fff" />}
                    {isCurrent && <View className="w-2 h-2 rounded-full bg-primary" />}
                  </View>
                  <View>
                    <Text className={`font-sans text-sm font-bold ${isCurrent ? "text-primary" : "text-on-surface"}`}>
                      {step.label}
                    </Text>
                    {isCurrent && status && (
                      <View className={`${status.bg} px-2 py-0.5 rounded mt-1 self-start`}>
                        <Text className={`${status.text} text-[10px] font-bold uppercase tracking-wider`}>
                          {status.label}
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        <View className="bg-white mx-5 mt-3 rounded-2xl border border-outline-variant shadow-sm overflow-hidden mb-6">
          <View className="p-5 border-b border-outline-variant">
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center gap-2">
                <View className="w-8 h-8 bg-secondary-soft rounded-lg items-center justify-center">
                  <MessageCircle size={16} color="#2563eb" />
                </View>
                <Text className="font-sans text-base font-extrabold text-on-surface">Diskusi Publik</Text>
              </View>
              <Text className="font-body text-xs font-bold text-on-surface-variant bg-surface-container-low px-2.5 py-1 rounded-full">
                {report.comments?.length || 0}
              </Text>
            </View>
          </View>

          <View className="p-5">
            <TouchableOpacity
              onPress={() => likeMut.mutate()}
              disabled={!user || likeMut.isPending}
              activeOpacity={0.7}
              className={`flex-row items-center gap-2 px-4 py-2.5 rounded-full mb-4 self-start border-2 ${isLiked ? "bg-primary-soft border-primary" : "bg-white border-outline"}`}
            >
              <ThumbsUp size={14} color={isLiked ? "#0f766e" : "#475569"} />
              <Text className={`font-body text-xs font-bold ${isLiked ? "text-primary" : "text-on-surface-variant"}`}>
                Dukung · {report._count?.likes ?? 0}
              </Text>
            </TouchableOpacity>

            {(!report.comments || report.comments.length === 0) ? (
              <View className="bg-surface-container-low rounded-xl border border-dashed border-outline-variant p-5 items-center mb-4">
                <MessageCircle size={20} color="#94a3b8" />
                <Text className="font-body text-xs text-on-surface-variant mt-2">Belum ada diskusi.</Text>
              </View>
            ) : (
              <View className="mb-4">
                {report.comments.map((c) => (
                  <View key={c.id} className="flex-row gap-2.5 mb-3">
                    <View className={`w-8 h-8 rounded-full items-center justify-center ${c.author.role === "USER" ? "bg-primary-soft" : "bg-secondary"}`}>
                      <Text className={`font-body text-xs font-bold ${c.author.role === "USER" ? "text-primary" : "text-on-secondary"}`}>
                        {(c.author.name || "U").charAt(0).toUpperCase()}
                      </Text>
                    </View>
                    <View className="flex-1">
                      <View className="bg-surface-container-low rounded-xl p-3 rounded-tl-none border border-outline-variant">
                        <Text className="font-body text-xs font-bold text-on-surface mb-0.5">{c.author.name}</Text>
                        <Text className="font-body text-sm text-on-surface-variant">{c.content}</Text>
                      </View>
                      <Text className="font-body text-[11px] text-on-surface-variant mt-1 ml-1">
                        {new Date(c.createdAt).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            )}

            {user ? (
              <View className="flex-row gap-2 pt-4 border-t border-outline-variant">
                <TextInput
                  value={commentText}
                  onChangeText={setCommentText}
                  placeholder="Tulis komentar..."
                  placeholderTextColor="#94a3b8"
                  className="flex-1 bg-surface-container-low border border-outline-variant rounded-full px-4 py-2.5 font-body text-sm text-on-surface"
                />
                <TouchableOpacity
                  onPress={() => commentMut.mutate()}
                  disabled={!commentText.trim() || commentMut.isPending}
                  activeOpacity={0.85}
                  className="w-10 h-10 rounded-full bg-primary items-center justify-center disabled:opacity-50 shadow-soft"
                >
                  <Send size={16} color="#fff" />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity onPress={() => navigation.navigate("Login" as never)} activeOpacity={0.85} className="bg-primary-soft rounded-xl p-4 items-center">
                <Text className="font-sans text-sm font-bold text-primary">Login untuk berkomentar</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
