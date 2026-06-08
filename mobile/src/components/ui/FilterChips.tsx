import { ScrollView, View, Text, TouchableOpacity } from "react-native";

type Props<T extends string> = {
  options: { key: T; label: string }[];
  active: T;
  onChange: (key: T) => void;
};

export function FilterChips<T extends string>({ options, active, onChange }: Props<T>) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4 -mx-4">
      <View className="flex-row gap-2 px-4">
        {options.map((opt) => {
          const isActive = active === opt.key;
          return (
            <TouchableOpacity
              key={opt.key}
              onPress={() => onChange(opt.key)}
              activeOpacity={0.8}
              className={`px-4 py-2 rounded-full ${
                isActive ? "bg-primary" : "bg-surface border border-outline-variant"
              }`}
            >
              <Text
                className={`font-body text-xs font-semibold ${
                  isActive ? "text-on-primary" : "text-on-surface-variant"
                }`}
              >
                {opt.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </ScrollView>
  );
}
