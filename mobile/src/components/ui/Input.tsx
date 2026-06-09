import { View, TextInput, TouchableOpacity, Text, type TextInputProps } from "react-native";
import type { LucideIcon } from "lucide-react-native";
import { colors } from "../../theme";

type Props = TextInputProps & {
  icon?: LucideIcon;
  label?: string;
  hint?: string;
  error?: string;
  rightElement?: React.ReactNode;
  onRightPress?: () => void;
};

export function Input({
  icon: Icon,
  label,
  hint,
  error,
  rightElement,
  onRightPress,
  className,
  ...props
}: Props) {
  return (
    <View className="mb-4">
      {label && (
        <Text className="font-body text-xs font-semibold text-on-surface mb-2 uppercase tracking-wide">
          {label}
        </Text>
      )}
      <View
        className={`flex-row items-center bg-surface border rounded-xl px-4 ${
          error ? "border-error" : "border-outline-variant"
        }`}
      >
        {Icon && <Icon size={18} color={colors.onSurfaceVariant} />}
        <TextInput
          placeholderTextColor="#94a3b8"
          className={`flex-1 py-3.5 font-body text-base text-on-surface ${Icon ? "ml-3" : ""} ${className ?? ""}`}
          {...props}
        />
        {rightElement && (
          <TouchableOpacity onPress={onRightPress} disabled={!onRightPress}>
            {rightElement}
          </TouchableOpacity>
        )}
      </View>
      {hint && !error && (
        <Text className="font-body text-[11px] text-on-surface-variant mt-1.5">{hint}</Text>
      )}
      {error && <Text className="font-body text-[11px] text-error mt-1.5">{error}</Text>}
    </View>
  );
}
