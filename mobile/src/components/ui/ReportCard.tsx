import { View, Text, TouchableOpacity } from "react-native";
import { MapPin, ThumbsUp, MessageCircle, ArrowRight } from "lucide-react-native";
import type { Report } from "../../types";
import { StatusBadge } from "./StatusBadge";
import { timeAgo } from "../../theme";
import { colors } from "../../theme";

type Props = {
  report: Report;
  onPress: () => void;
  variant?: "default" | "compact";
};

export function ReportCard({ report, onPress, variant = "default" }: Props) {
  const initials = report.user?.name?.charAt(0)?.toUpperCase() || "?";

  if (variant === "compact") {
    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.85}
        className="bg-surface rounded-2xl p-3.5 mb-3 border border-outline-variant"
      >
        <View className="flex-row items-center justify-between mb-2">
          {report.category?.name && (
            <View className="px-2 py-0.5 rounded-lg bg-surface-variant">
              <Text className="font-body text-[10px] font-semibold text-on-surface-variant">
                {report.category.name}
              </Text>
            </View>
          )}
          <StatusBadge status={report.status} compact />
        </View>
        <Text className="font-sans text-sm font-bold text-on-surface mb-2" numberOfLines={2}>
          {report.title}
        </Text>
        <View className="flex-row items-center gap-1 mb-1">
          <MapPin size={11} color={colors.onSurfaceVariant} />
          <Text className="font-body text-[10px] text-on-surface-variant flex-1" numberOfLines={1}>
            {report.address || `${report.latitude}, ${report.longitude}`}
          </Text>
        </View>
        <View className="flex-row items-center gap-1">
          <ThumbsUp size={11} color={colors.onSurfaceVariant} />
          <Text className="font-body text-[10px] text-on-surface-variant font-semibold">
            {report._count?.likes ?? 0}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      className="bg-surface border border-outline-variant rounded-2xl overflow-hidden shadow-sm"
    >
      <View className="p-4">
        <View className="flex-row items-center gap-3 mb-3">
          <View className="w-10 h-10 rounded-full bg-primary-soft items-center justify-center">
            <Text className="text-primary font-sans text-sm font-bold">{initials}</Text>
          </View>
          <View className="flex-1">
            <Text className="font-body text-sm font-semibold text-on-surface">
              {report.user?.name || "Anonim"}
            </Text>
            <Text className="font-body text-[11px] text-on-surface-variant mt-0.5">
              {timeAgo(report.createdAt)}
            </Text>
          </View>
          <StatusBadge status={report.status} compact />
        </View>

        <View className="flex-row flex-wrap gap-2 mb-2">
          {report.category?.name && (
            <View className="px-2.5 py-1 bg-surface-variant rounded-lg">
              <Text className="font-body text-[10px] font-semibold text-on-surface-variant">
                {report.category.name}
              </Text>
            </View>
          )}
          {report.address && (
            <View className="px-2.5 py-1 bg-surface-variant rounded-lg flex-row items-center gap-1">
              <MapPin size={10} color={colors.onSurfaceVariant} />
              <Text className="font-body text-[10px] text-on-surface-variant" numberOfLines={1}>
                {report.address.split(",")[0]}
              </Text>
            </View>
          )}
        </View>

        <Text className="font-sans text-base font-bold text-on-surface mb-1.5">{report.title}</Text>
        {report.description && (
          <Text className="font-body text-sm text-on-surface-variant leading-relaxed" numberOfLines={3}>
            {report.description}
          </Text>
        )}
      </View>

      <View className="bg-surface-container-low px-4 py-3 flex-row items-center justify-between border-t border-outline-variant/50">
        <View className="flex-row items-center gap-4">
          <View className="flex-row items-center gap-1">
            <ThumbsUp size={14} color={colors.onSurfaceVariant} />
            <Text className="font-body text-xs text-on-surface-variant">{report._count?.likes ?? 0}</Text>
          </View>
          <View className="flex-row items-center gap-1">
            <MessageCircle size={14} color={colors.onSurfaceVariant} />
            <Text className="font-body text-xs text-on-surface-variant">{report._count?.comments ?? 0}</Text>
          </View>
        </View>
        <View className="flex-row items-center gap-1">
          <Text className="font-body text-xs font-bold text-primary">Detail</Text>
          <ArrowRight size={12} color={colors.primary} />
        </View>
      </View>
    </TouchableOpacity>
  );
}
