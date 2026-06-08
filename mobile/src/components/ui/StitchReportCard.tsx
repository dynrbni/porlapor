import { View, Text, TouchableOpacity, Image } from "react-native";
import { Clock, ThumbsUp, MessageCircle, CheckCircle, Hourglass, RefreshCw } from "lucide-react-native";
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
  const size = 14;
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
      className="bg-surface-container-lowest rounded-xl border border-outline-variant overflow-hidden shadow-sm"
    >
      {report.imageUrl ? (
        <Image source={{ uri: report.imageUrl }} className="w-full h-40" resizeMode="cover" />
      ) : null}

      <View className="p-4 flex-1">
        <View className="flex-row justify-between items-start mb-2 gap-2">
          {report.category?.name ? (
            <View className={`px-2 py-1 rounded ${catStyle.bg}`}>
              <Text className={`font-body text-[11px] font-semibold ${catStyle.text}`}>
                {report.category.name}
              </Text>
            </View>
          ) : (
            <View />
          )}
          <View className={`flex-row items-center gap-1 px-2 py-1 rounded ${statusStyle.bg}`}>
            <StatusIcon status={report.status} />
            <Text className={`font-body text-[11px] font-semibold ${statusStyle.text}`}>
              {statusLabel}
            </Text>
          </View>
        </View>

        <Text className="font-sans text-lg font-semibold text-on-surface mb-2 leading-snug">
          {report.title}
        </Text>

        <View className="flex-row items-center gap-1 mb-2">
          <Clock size={14} color={colors.outline} />
          <Text className="font-body text-xs text-outline">{timeAgo(report.createdAt)}</Text>
        </View>

        {report.description ? (
          <Text className="font-body text-sm text-on-surface-variant leading-relaxed" numberOfLines={3}>
            {report.description}
          </Text>
        ) : null}
      </View>

      <View className="bg-surface-container-low px-4 py-3 border-t border-outline-variant flex-row items-center justify-between">
        <View className="flex-row items-center gap-4">
          <View className="flex-row items-center gap-1">
            <ThumbsUp size={18} color={colors.onSurfaceVariant} />
            <Text className="font-body text-xs text-on-surface-variant">{report._count?.likes ?? 0}</Text>
          </View>
          <View className="flex-row items-center gap-1">
            <MessageCircle size={18} color={colors.onSurfaceVariant} />
            <Text className="font-body text-xs text-on-surface-variant">{report._count?.comments ?? 0}</Text>
          </View>
        </View>
        <Text className="font-body text-xs font-semibold text-primary">Lihat Detail</Text>
      </View>
    </TouchableOpacity>
  );
}
