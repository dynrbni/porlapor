import { TouchableOpacity, Text, ActivityIndicator } from "react-native";
import type { ReactNode } from "react";
import { colors } from "../../theme";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "danger";

type Props = {
  label: string;
  onPress: () => void;
  variant?: Variant;
  loading?: boolean;
  disabled?: boolean;
  icon?: ReactNode;
  iconRight?: ReactNode;
  fullWidth?: boolean;
  size?: "sm" | "md" | "lg";
};

const variants: Record<Variant, string> = {
  primary: "bg-primary",
  secondary: "bg-primary-container",
  outline: "bg-surface border-2 border-primary",
  ghost: "bg-surface-container-low border border-outline-variant",
  danger: "bg-error-container",
};

const textVariants: Record<Variant, string> = {
  primary: "text-on-primary",
  secondary: "text-on-primary-container",
  outline: "text-primary",
  ghost: "text-on-surface",
  danger: "text-error",
};

const sizes = {
  sm: "py-2.5 px-4 rounded-xl",
  md: "py-3.5 px-5 rounded-2xl",
  lg: "py-4 px-6 rounded-2xl",
};

export function Button({
  label,
  onPress,
  variant = "primary",
  loading = false,
  disabled = false,
  icon,
  iconRight,
  fullWidth = true,
  size = "md",
}: Props) {
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.85}
      className={`flex-row items-center justify-center gap-2 ${variants[variant]} ${sizes[size]} ${fullWidth ? "w-full" : ""}`}
      style={{ opacity: isDisabled ? 0.55 : 1 }}
    >
      {loading ? (
        <ActivityIndicator color={variant === "outline" ? colors.primary : colors.onPrimary} size="small" />
      ) : (
        <>
          {icon}
          <Text className={`font-sans font-bold ${textVariants[variant]} ${size === "sm" ? "text-sm" : "text-base"}`}>
            {label}
          </Text>
          {iconRight}
        </>
      )}
    </TouchableOpacity>
  );
}
