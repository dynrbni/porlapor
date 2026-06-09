import { View, Text, TouchableOpacity, Image } from "react-native";
import { Clock, ThumbsUp, MessageCircle, CheckCircle, Hourglass, RefreshCw, ArrowRight, MapPin } from "lucide-react-native";
import { getPhotoUrl } from "../../api/client";
import type { Report } from "../../types";
import {
  timeAgo,
  statusLabels,
  getCategoryBadgeStyle,
  getStatusBadgeStyle,
  colors,
} from "../../theme";

type Props = {
  report: Report;
  onPress: () => void;
};

function StatusIcon({ status }: { status: string }) {
  const s = status.toUpperCase();
  const style = getStatusBadgeStyle(s);
  const size = 13;
  if (s === "RESOLVED") return <CheckCircle size={size} color={style.iconColor} />;
  if (s === "IN_PROGRESS") return <RefreshCw size={size} color={style.iconColor} />;
  return <Hourglass size={size} color={style.iconColor} />;
}

export function StitchReportCard({ report, onPress }: Props) {
  const catStyle = getCategoryBadgeStyle(report.category?.name);
  const statusStyle = getStatusBadgeStyle(report.status);
  const statusLabel = statusLabels[report.status.toUpperCase()] || report.status;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.9}
      className="bg-surface-container-lowest rounded-3xl border border-outline-variant/60 overflow-hidden mb-2"
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 16,
        elevation: 4,
      }}
    >
      {/* Image Container with Top-Radius */}
      {report.imageUrl && (
        <View className="w-full h-48 overflow-hidden bg-surface-container-low">
          <Image
            source={{ uri: getPhotoUrl(report.imageUrl)! }}
            className="w-full h-full"
            resizeMode="cover"
          />
        </View>
      )}

      <View className="p-5">
        {/* Badges Row */}
        <View className="flex-row justify-between items-start mb-3.5 gap-2">
          <View className={`flex-row items-center gap-1.5 px-3 py-1.5 rounded-xl ${statusStyle.bg}`}>
            <StatusIcon status={report.status} />
            <Text className={`font-sans text-xs font-bold tracking-wider ${statusStyle.text}`}>
              {statusLabel}
            </Text>
          </View>
          {report.category?.name && (
            <View className="px-3 py-1.5 rounded-xl bg-surface-container-low border border-outline-variant/50">
              <Text className="font-sans text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
                {report.category.name}
              </Text>
            </View>
          )}
        </View>

        {/* Title */}
        <Text className="font-sans text-lg font-bold text-on-surface mb-2.5 leading-snug tracking-tight" numberOfLines={2}>
          {report.title}
        </Text>

        {/* Description */}
        {report.description && (
          <Text className="font-body text-sm text-on-surface-variant leading-relaxed mb-4" numberOfLines={2}>
            {report.description}
          </Text>
        )}

        {/* Meta Row */}
        <View className="flex-row items-center gap-4 mt-auto pt-1">
          {report.address && (
            <View className="flex-row items-center gap-1.5 flex-1">
              <MapPin size={14} color={colors.outline} />
              <Text className="font-body text-xs font-medium text-outline" numberOfLines={1}>
                {report.address.split(",")[0]}
              </Text>
            </View>
          )}
          <View className="flex-row items-center gap-1.5 bg-surface-container-lowest px-2 py-1 rounded-md border border-outline-variant/30">
            <Clock size={12} color={colors.outline} />
            <Text className="font-body text-[11px] font-semibold text-outline">{timeAgo(report.createdAt)}</Text>
          </View>
        </View>
      </View>

      {/* Footer Actions */}
      <View className="bg-surface-container-low/50 px-5 py-4 border-t border-outline-variant/40 flex-row items-center justify-between">
        <View className="flex-row items-center gap-6">
          <View className="flex-row items-center gap-2">
            <ThumbsUp size={16} color={colors.onSurfaceVariant} />
            <Text className="font-sans text-sm font-bold text-on-surface-variant">
              {report._count?.likes ?? 0}
            </Text>
          </View>
          <View className="flex-row items-center gap-2">
            <MessageCircle size={16} color={colors.onSurfaceVariant} />
            <Text className="font-sans text-sm font-bold text-on-surface-variant">
              {report._count?.comments ?? 0}
            </Text>
          </View>
        </View>
        <View className="flex-row items-center gap-1.5 bg-primary/10 px-3 py-1.5 rounded-full">
          <Text className="font-sans text-xs font-bold text-primary">Detail</Text>
          <ArrowRight size={14} color={colors.primary} />
        </View>
      </View>
    </TouchableOpacity>
  );
}
