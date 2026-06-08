import { View, Text, type ReactNode } from "react-native";

type Props = {
  badge?: string;
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  variant?: "primary" | "container";
};

export function HeroCard({ badge, title, subtitle, actions, variant = "primary" }: Props) {
  const bg = variant === "primary" ? "bg-primary" : "bg-primary-container";

  return (
    <View className={`${bg} rounded-2xl p-6 relative overflow-hidden min-h-[160px]`}>
      <View className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full" />
      <View className="absolute -bottom-10 -left-10 w-32 h-32 bg-white/10 rounded-full" />
      <View className="relative z-10">
        {badge && (
          <View className="self-start px-3 py-1 bg-white/20 rounded-full mb-3">
            <Text className="font-body text-[11px] font-semibold text-white">{badge}</Text>
          </View>
        )}
        <Text className="font-sans text-2xl font-bold text-white mb-2 leading-tight">{title}</Text>
        {subtitle && (
          <Text className="font-body text-sm text-white/85 mb-4 leading-relaxed">{subtitle}</Text>
        )}
        {actions}
      </View>
    </View>
  );
}
