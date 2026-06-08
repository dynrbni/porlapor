import { View, Text, TouchableOpacity, type ReactNode } from "react-native";
import { Bell, ArrowLeft, Share2 } from "lucide-react-native";
import { colors } from "../../theme";

type Props = {
  variant?: "main" | "flow" | "detail";
  title?: string;
  onBack?: () => void;
  onShare?: () => void;
  rightAction?: ReactNode;
};

export function StitchHeader({ variant = "main", title, onBack, onShare, rightAction }: Props) {
  if (variant === "flow") {
    return (
      <View className="flex-row items-center px-4 h-16 bg-surface border-b border-outline-variant/30">
        <TouchableOpacity onPress={onBack} className="w-10 h-10 items-center justify-center rounded-full">
          <ArrowLeft size={24} color={colors.onSurface} />
        </TouchableOpacity>
        <Text className="flex-1 text-center font-sans text-lg font-semibold text-on-surface" numberOfLines={1}>
          {title}
        </Text>
        <View className="w-10" />
      </View>
    );
  }

  if (variant === "detail") {
    return (
      <View className="flex-row items-center px-4 h-16 bg-surface shadow-sm">
        <TouchableOpacity onPress={onBack} className="p-2 rounded-full">
          <ArrowLeft size={22} color={colors.primary} />
        </TouchableOpacity>
        <Text className="flex-1 text-center font-sans text-base font-bold text-primary px-2" numberOfLines={1}>
          {title}
        </Text>
        {onShare ? (
          <TouchableOpacity onPress={onShare} className="p-2 rounded-full">
            <Share2 size={22} color={colors.onSurfaceVariant} />
          </TouchableOpacity>
        ) : (
          <View className="w-10" />
        )}
      </View>
    );
  }

  return (
    <View className="flex-row items-center justify-between px-4 h-16 bg-surface shadow-sm">
      <View className="flex-row items-center gap-2">
        <View className="w-8 h-8 rounded-lg bg-primary items-center justify-center">
          <Text className="text-on-primary font-sans text-xs font-bold">PL</Text>
        </View>
        <Text className="font-sans text-lg font-bold text-primary">PorLapor</Text>
      </View>
      {rightAction ?? (
        <TouchableOpacity className="p-2 rounded-full">
          <Bell size={22} color={colors.onSurfaceVariant} />
        </TouchableOpacity>
      )}
    </View>
  );
}
