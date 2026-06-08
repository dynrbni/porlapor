import { View, Text } from "react-native";
import type { LucideIcon } from "lucide-react-native";
import { colors } from "../../theme";

type Props = {
  icon: LucideIcon;
  title: string;
  description?: string;
};

export function EmptyState({ icon: Icon, title, description }: Props) {
  return (
    <View className="items-center py-16 px-8">
      <View className="w-16 h-16 rounded-2xl bg-surface-container-low items-center justify-center mb-4">
        <Icon size={28} color={colors.onSurfaceVariant} />
      </View>
      <Text className="font-sans text-base font-bold text-on-surface mb-1 text-center">{title}</Text>
      {description && (
        <Text className="font-body text-sm text-on-surface-variant text-center leading-relaxed">
          {description}
        </Text>
      )}
    </View>
  );
}
