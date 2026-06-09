import { View, Text, TouchableOpacity, Image } from "react-native";
import type { ReactNode } from "react";
import { Bell, ArrowLeft, Share2 } from "lucide-react-native";
import { colors } from "../../theme";

type Props = {
  variant?: "main" | "flow" | "detail";
  title?: string;
  onBack?: () => void;
  onShare?: () => void;
  onNotificationPress?: () => void;
  rightAction?: ReactNode;
};

export function StitchHeader({ variant = "main", title, onBack, onShare, onNotificationPress, rightAction }: Props) {
  if (variant === "flow") {
    return (
      <View
        className="flex-row items-center px-5 h-16 bg-surface-container-lowest"
        style={{
          borderBottomWidth: 1,
          borderBottomColor: "rgba(197, 197, 211, 0.3)",
        }}
      >
        <TouchableOpacity
          onPress={onBack}
          className="w-10 h-10 items-center justify-center rounded-full"
          activeOpacity={0.7}
        >
          <ArrowLeft size={22} color={colors.onSurface} />
        </TouchableOpacity>
        <Text className="flex-1 text-center font-sans text-base font-semibold text-on-surface" numberOfLines={1}>
          {title}
        </Text>
        <View className="w-10" />
      </View>
    );
  }

  if (variant === "detail") {
    return (
      <View
        className="flex-row items-center px-5 h-16 bg-surface-container-lowest"
        style={{
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.04,
          shadowRadius: 8,
          elevation: 3,
          borderBottomWidth: 1,
          borderBottomColor: "rgba(197, 197, 211, 0.2)",
        }}
      >
        <TouchableOpacity onPress={onBack} className="p-2 -ml-1 rounded-full" activeOpacity={0.7}>
          <ArrowLeft size={22} color={colors.primary} />
        </TouchableOpacity>
        <Text className="flex-1 text-center font-sans text-base font-bold text-primary px-3" numberOfLines={1}>
          {title}
        </Text>
        {onShare ? (
          <TouchableOpacity onPress={onShare} className="p-2 -mr-1 rounded-full" activeOpacity={0.7}>
            <Share2 size={20} color={colors.onSurfaceVariant} />
          </TouchableOpacity>
        ) : (
          <View className="w-10" />
        )}
      </View>
    );
  }

  // Main variant (default)
  return (
    <View
      className="flex-row items-center justify-between px-5 h-16 bg-surface-container-lowest"
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 8,
        elevation: 3,
        borderBottomWidth: 1,
        borderBottomColor: "rgba(197, 197, 211, 0.15)",
      }}
    >
      <View className="flex-row items-center">
        <Image
          source={require("../../../assets/images/porlapor_logo.png")}
          style={{ width: 140, height: 40 }}
          resizeMode="contain"
        />
      </View>
      {rightAction ?? (
        <TouchableOpacity
          onPress={onNotificationPress}
          className="w-10 h-10 items-center justify-center rounded-full bg-surface-container-low"
          activeOpacity={0.7}
        >
          <Bell size={20} color={colors.onSurfaceVariant} />
        </TouchableOpacity>
      )}
    </View>
  );
}
