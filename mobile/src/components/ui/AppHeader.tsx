import { View, Text, TouchableOpacity } from "react-native";
import type { ReactNode } from "react";
import { ArrowLeft } from "lucide-react-native";
import { AppLogo } from "./AppLogo";
import { colors } from "../../theme";

type Props = {
  title?: string;
  showLogo?: boolean;
  onBack?: () => void;
  rightAction?: ReactNode;
  variant?: "default" | "transparent";
};

export function AppHeader({ title, showLogo = true, onBack, rightAction, variant = "default" }: Props) {
  const bg = variant === "transparent" ? "bg-transparent" : "bg-surface border-b border-outline-variant/40";

  return (
    <View className={`flex-row items-center px-4 h-14 ${bg}`}>
      <View className="w-20 flex-row items-center">
        {onBack ? (
          <TouchableOpacity
            onPress={onBack}
            activeOpacity={0.7}
            className="w-9 h-9 rounded-xl bg-surface-container-low items-center justify-center"
          >
            <ArrowLeft size={20} color={colors.primary} />
          </TouchableOpacity>
        ) : showLogo ? (
          <AppLogo size="sm" showLabel />
        ) : null}
      </View>

      <View className="flex-1 items-center justify-center px-2">
        {title ? (
          <Text className="font-sans text-base font-bold text-on-surface" numberOfLines={1}>
            {title}
          </Text>
        ) : showLogo && onBack ? (
          <AppLogo size="sm" showLabel />
        ) : null}
      </View>

      <View className="w-20 flex-row items-center justify-end">{rightAction}</View>
    </View>
  );
}
