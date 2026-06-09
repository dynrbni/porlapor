import { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, TextInput, Image, ActivityIndicator, Share } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  MapPin, CheckCircle2, Clock, MessageCircle, ThumbsUp, Send, Verified, User, ShieldCheck
} from "lucide-react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getReportById, addComment, toggleLike } from "../../api/reports";
import { getPhotoUrl } from "../../api/client";
import { useAuth } from "../../context/AuthContext";
import { StitchHeader } from "../../components/ui/StitchHeader";
import { timeAgo, statusLabels, colors } from "../../theme";



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

  const getTimelineSteps = (status: string) => {
    const steps = [
      { key: "PENDING", label: "Laporan Diterima", active: false, done: false, isError: false },
    ];
    
    if (status === "PENDING") {
      steps[0].active = true;
      return steps.reverse();
    }
    steps[0].done = true;

    steps.push({ key: "IN_REVIEW", label: "Ditinjau oleh Admin", active: false, done: false, isError: false });
    if (status === "IN_REVIEW") {
      steps[1].active = true;
      return steps.reverse();
    }
    steps[1].done = true;

    if (status === "REJECTED") {
      steps.push({ key: "REJECTED", label: "Laporan Ditolak", active: true, done: false, isError: true });
      return steps.reverse();
    }

    steps.push({ key: "IN_PROGRESS", label: report?.agency ? `Diteruskan ke ${report.agency.name}` : "Diproses oleh Instansi", active: false, done: false, isError: false });
    if (status === "IN_PROGRESS") {
      steps[2].active = true;
      return steps.reverse();
    }
    steps[2].done = true;

    if (status === "RESOLVED") {
      steps.push({ key: "RESOLVED", label: "Laporan Selesai", active: true, done: false, isError: false });
      return steps.reverse();
    }

    return steps.reverse();
  };

  const dynamicTimeline = report ? getTimelineSteps(report.status) : [];

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
        <Text className="font-sans text-xl font-bold text-on-surface mb-2">Laporan Tidak Ditemukan</Text>
        <Text className="font-body text-sm text-on-surface-variant text-center mb-8">Laporan yang Anda cari mungkin telah dihapus atau tidak tersedia.</Text>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="bg-primary px-8 h-14 rounded-full items-center justify-center shadow-lg shadow-primary/30"
          activeOpacity={0.85}
        >
          <Text className="text-white font-sans text-[15px] font-bold tracking-wide">Kembali ke Beranda</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const statusLabel = statusLabels[report.status] || report.status;

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <StitchHeader variant="detail" title={`#${shortId}`} onBack={() => navigation.goBack()} onShare={handleShare} />

      <ScrollView className="flex-1" contentContainerClassName="pb-12" showsVerticalScrollIndicator={false}>
        {/* Image Card */}
        <View className="relative mx-5 mt-5 rounded-[28px] overflow-hidden border border-outline-variant/30" style={{ aspectRatio: 4 / 3, backgroundColor: "#f1f5f9" }}>
          {report.imageUrl ? (
            <Image source={{ uri: getPhotoUrl(report.imageUrl) || undefined }} className="w-full h-full" resizeMode="cover" />
          ) : (
            <View className="w-full h-full items-center justify-center">
              <View className="w-20 h-20 rounded-full bg-surface-container items-center justify-center mb-4">
                <MapPin size={32} color={colors.outline} />
              </View>
              <Text className="font-sans text-sm font-bold text-on-surface-variant">Tidak ada foto lampiran</Text>
            </View>
          )}
          {/* Status Badge Overlaid on Image */}
          <View
            className="absolute top-4 left-4 px-4 py-2 rounded-full flex-row items-center gap-2 shadow-sm"
            style={{ backgroundColor: "rgba(255, 255, 255, 0.95)" }}
          >
            <View className={`w-2.5 h-2.5 rounded-full ${report.status === "RESOLVED" ? "bg-tertiary" : "bg-warning"}`} />
            <Text className="font-sans text-[11px] font-bold tracking-wider text-on-surface">{statusLabel.toUpperCase()}</Text>
          </View>
        </View>

        {/* Report Info Card */}
        <View
          className="bg-surface-container-lowest mx-5 mt-5 rounded-[28px] border border-outline-variant/30 p-7"
          style={{ shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 16, elevation: 4 }}
        >
          <View className="flex-row justify-between items-start gap-4 mb-3">
            <Text className="font-sans text-2xl font-bold text-on-surface flex-1 leading-snug tracking-tight">{report.title}</Text>
          </View>
          
          <View className="flex-row items-center gap-2 mb-5">
            <Clock size={14} color={colors.outline} />
            <Text className="font-body text-xs font-semibold text-outline tracking-wide">{timeAgo(report.createdAt)}</Text>
          </View>

          <Text className="font-body text-[15px] text-on-surface-variant leading-relaxed mb-6">{report.description}</Text>
          
          <View className="flex-row flex-wrap gap-2.5 border-t border-outline-variant/40 pt-5">
            <View className="bg-primary/10 px-4 py-2 rounded-xl flex-row items-center gap-1.5 border border-primary/20">
              <Text className="font-sans text-xs font-bold text-primary tracking-wide">{report.category?.name?.toUpperCase() || "UMUM"}</Text>
            </View>
            {report.address && (
              <View className="bg-surface-container-low px-4 py-2 rounded-xl flex-row items-center gap-1.5 border border-outline-variant/50 max-w-[65%]">
                <MapPin size={14} color={colors.onSurfaceVariant} />
                <Text className="font-sans text-xs font-bold text-on-surface-variant tracking-wide" numberOfLines={1}>{report.address.split(",")[0]}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Location Map Card */}
        <View
          className="bg-surface-container-lowest mx-5 mt-5 rounded-[28px] border border-outline-variant/30 p-7"
          style={{ shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 16, elevation: 4 }}
        >
          <Text className="font-sans text-lg font-bold text-on-surface mb-4 tracking-tight">Lokasi Kejadian</Text>
          <View className="h-44 bg-surface-container-low rounded-[20px] items-center justify-center border border-outline-variant/50 mb-4 overflow-hidden relative">
            {/* Fake Map Pattern Background */}
            <View className="absolute inset-0 opacity-[0.03]" style={{ backgroundColor: "#000" }} />
            <View className="w-16 h-16 bg-error/10 rounded-full items-center justify-center mb-2">
              <MapPin size={32} color={colors.error} />
            </View>
            <Text className="font-body text-xs font-bold text-on-surface-variant mt-2 tracking-wider">{report.latitude?.toFixed(4)}, {report.longitude?.toFixed(4)}</Text>
          </View>
          <Text className="font-body text-[13px] text-on-surface-variant leading-relaxed">{report.address}</Text>
        </View>

        {/* Official Notes */}
        {report.officialNotes && report.officialNotes.length > 0 && (
          <View
            className="mx-5 mt-5 rounded-[28px] border border-tertiary-fixed/40 p-7 bg-tertiary/5 relative overflow-hidden"
          >
            <View className="absolute top-0 right-0 w-32 h-32 bg-tertiary/5 rounded-full -mt-10 -mr-10" />
            <View className="flex-row items-center gap-3 mb-4">
              <View className="w-10 h-10 bg-tertiary-fixed rounded-full items-center justify-center">
                <ShieldCheck size={20} color={colors.onTertiaryFixed} />
              </View>
              <Text className="font-sans text-lg font-bold text-on-surface tracking-tight">Tanggapan Resmi</Text>
            </View>
            {report.officialNotes.map((note) => (
              <View key={note.id} className="bg-white/60 p-5 rounded-2xl border border-tertiary/10 mb-2">
                <View className="flex-row items-center gap-2 mb-2">
                  <View className="w-6 h-6 bg-tertiary/20 rounded-full items-center justify-center">
                    <ShieldCheck size={12} color={colors.onTertiaryFixed} />
                  </View>
                  <Text className="font-sans text-xs font-bold text-tertiary">{note.author?.name || "Admin"}</Text>
                </View>
                <Text className="font-body text-sm text-on-surface leading-relaxed font-medium">{note.content}</Text>
                <View className="flex-row items-center gap-1.5 mt-3 pt-3 border-t border-tertiary/10">
                  <Clock size={12} color={colors.outline} />
                  <Text className="font-sans text-[10px] font-bold text-outline tracking-wider uppercase">Dibalas: {new Date(note.createdAt).toLocaleString("id-ID")}</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Timeline Card */}
        <View
          className="bg-surface-container-lowest mx-5 mt-5 rounded-[28px] border border-outline-variant/30 p-7"
          style={{ shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 16, elevation: 4 }}
        >
          <View className="flex-row items-center gap-3 mb-7">
            <View className="w-10 h-10 bg-primary/10 rounded-full items-center justify-center">
              <Clock size={20} color={colors.primary} />
            </View>
            <Text className="font-sans text-lg font-bold text-on-surface tracking-tight">Riwayat Status</Text>
          </View>
          <View className="pl-6 border-l-[3px] border-outline-variant/30 ml-2">
            {dynamicTimeline.map((step, idx) => {
              const { isActive, isDone, isError } = { isActive: step.active, isDone: step.done, isError: step.isError };
              
              let circleClass = "bg-outline-variant/50";
              if (isDone) circleClass = "bg-tertiary-fixed";
              else if (isError) circleClass = "bg-error border-[4px] border-error/30 shadow-sm";
              else if (isActive) circleClass = "bg-surface border-[4px] border-primary shadow-sm";

              return (
                <View key={step.key} className="relative mb-7">
                  <View className={`absolute -left-[34px] w-[22px] h-[22px] rounded-full items-center justify-center ${circleClass}`}>
                    {isDone && <CheckCircle2 size={14} color={colors.onTertiaryFixed} />}
                    {isError && <CheckCircle2 size={14} color="#fff" />}
                  </View>
                  <Text className={`font-sans text-[15px] pl-3 ${isActive ? "font-bold text-primary" : isDone ? "font-bold text-on-surface" : "font-semibold text-outline"} ${isError ? "text-error" : ""}`}>{step.label}</Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Comments Card */}
        <View
          className="bg-surface-container-lowest mx-5 mt-5 rounded-[28px] border border-outline-variant/30 overflow-hidden"
          style={{ shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 16, elevation: 4 }}
        >
          <View className="px-7 py-6 border-b border-outline-variant/30 flex-row items-center justify-between bg-surface-container/30">
            <View className="flex-row items-center gap-3">
              <MessageCircle size={20} color={colors.primary} />
              <Text className="font-sans text-lg font-bold text-on-surface tracking-tight">Diskusi Publik</Text>
            </View>
            <View className="bg-primary/10 px-4 py-1.5 rounded-full border border-primary/20">
              <Text className="font-sans text-xs text-primary font-bold tracking-wide">{report.comments?.length || 0} Komentar</Text>
            </View>
          </View>

          <View className="p-7">
            {/* Like Button */}
            <TouchableOpacity
              onPress={() => user ? likeMut.mutate() : navigation.navigate("Login" as never)}
              disabled={likeMut.isPending}
              activeOpacity={0.7}
              className={`flex-row items-center justify-center gap-2 w-full h-14 rounded-full border-2 mb-8 transition-colors ${
                isLiked ? "border-primary bg-primary/5" : "border-outline-variant/50 bg-transparent"
              }`}
            >
              <ThumbsUp size={18} color={isLiked ? colors.primary : colors.onSurfaceVariant} />
              <Text className={`font-sans text-[15px] font-bold tracking-wide ${isLiked ? "text-primary" : "text-on-surface-variant"}`}>
                Dukung Laporan Ini ({report._count?.likes ?? 0})
              </Text>
            </TouchableOpacity>

            {/* Comment List */}
            {(report.comments || []).map((c) => {
              const commenterName = c.author?.name?.trim() ? c.author.name : "Pengguna Anonim";
              const initial = commenterName.charAt(0).toUpperCase();
              return (
                <View key={c.id} className="flex-row gap-4 mb-6">
                  <View className="w-11 h-11 rounded-full bg-surface-container items-center justify-center border border-outline-variant/30">
                    <Text className="font-sans text-sm font-bold text-primary">{initial}</Text>
                  </View>
                  <View className="flex-1">
                    <View className="bg-surface-container-low rounded-[20px] p-4 border border-outline-variant/40 rounded-tl-none shadow-sm">
                      <Text className="font-sans text-sm font-bold text-on-surface mb-1.5">{commenterName}</Text>
                      <Text className="font-body text-[13px] text-on-surface-variant leading-relaxed">{c.content}</Text>
                    </View>
                    <Text className="font-sans text-[10px] font-bold text-outline mt-2 ml-2 tracking-wider">{timeAgo(c.createdAt).toUpperCase()}</Text>
                  </View>
                </View>
              );
            })}

            {/* Comment Input */}
            {user ? (
              <View className="flex-row gap-3 pt-5 border-t border-outline-variant/30 mt-2">
                <TextInput
                  value={commentText}
                  onChangeText={setCommentText}
                  placeholder="Tambahkan komentar..."
                  placeholderTextColor="#94a3b8"
                  className="flex-1 bg-surface-container-low border border-outline-variant/50 rounded-full pl-6 pr-4 h-14 font-body text-sm text-on-surface"
                />
                <TouchableOpacity
                  onPress={() => commentMut.mutate()}
                  disabled={!commentText.trim()}
                  activeOpacity={0.85}
                  className="w-14 h-14 rounded-full bg-primary items-center justify-center shadow-lg shadow-primary/30"
                  style={{ opacity: !commentText.trim() ? 0.5 : 1 }}
                >
                  <Send size={18} color="#fff" style={{ marginLeft: -2 }} />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                onPress={() => navigation.navigate("Login" as never)}
                activeOpacity={0.85}
                className="bg-primary/5 border border-primary/20 rounded-2xl p-5 items-center mt-4"
              >
                <Text className="font-sans text-sm font-bold text-primary tracking-wide">Masuk untuk ikut berdiskusi</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
