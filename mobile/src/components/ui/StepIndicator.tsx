import { View, Text } from "react-native";

type Step = { id: number; label: string };

type Props = {
  steps: Step[];
  current: number;
  subtitle?: string;
};

export function StepIndicator({ steps, current, subtitle }: Props) {
  return (
    <View className="mb-5">
      {subtitle && (
        <View className="flex-row justify-between mb-2">
          <Text className="font-body text-xs font-semibold text-primary">
            Langkah {current} dari {steps.length}
          </Text>
          <Text className="font-body text-xs text-on-surface-variant">{subtitle}</Text>
        </View>
      )}
      {!subtitle && (
        <View className="flex-row items-center gap-2 mb-3">
          {steps.map((s, i) => (
            <View key={s.id} className="flex-row items-center gap-2 flex-1">
              <View className="flex-row items-center gap-1.5">
                <View
                  className={`w-6 h-6 rounded-full items-center justify-center ${
                    current > s.id
                      ? "bg-primary"
                      : current === s.id
                      ? "bg-primary"
                      : "bg-surface-variant"
                  }`}
                >
                  <Text
                    className={`text-[11px] font-bold ${
                      current >= s.id ? "text-on-primary" : "text-on-surface-variant"
                    }`}
                  >
                    {current > s.id ? "✓" : s.id}
                  </Text>
                </View>
                <Text
                  className={`text-xs font-semibold ${
                    current >= s.id ? "text-primary" : "text-on-surface-variant"
                  }`}
                >
                  {s.label}
                </Text>
              </View>
              {i < steps.length - 1 && (
                <View className="flex-1 h-px bg-outline-variant overflow-hidden">
                  <View
                    className="h-full bg-primary"
                    style={{ width: current > s.id ? "100%" : "0%" }}
                  />
                </View>
              )}
            </View>
          ))}
        </View>
      )}
      {subtitle && (
        <View className="flex-row gap-2">
          {steps.map((s) => (
            <View
              key={s.id}
              className={`h-2 flex-1 rounded-full ${current >= s.id ? "bg-primary" : "bg-surface-variant"}`}
            />
          ))}
        </View>
      )}
    </View>
  );
}
