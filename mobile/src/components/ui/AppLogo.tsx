import { View, Text } from "react-native";

type Size = "sm" | "md" | "lg" | "xl";

const sizes: Record<Size, { outer: string; inner: string; text: string }> = {
  sm: { outer: "w-8 h-8 rounded-lg", inner: "w-5 h-5 rounded-md", text: "text-[10px]" },
  md: { outer: "w-10 h-10 rounded-xl", inner: "w-7 h-7 rounded-lg", text: "text-xs" },
  lg: { outer: "w-14 h-14 rounded-2xl", inner: "w-10 h-10 rounded-xl", text: "text-sm" },
  xl: { outer: "w-28 h-28 rounded-full", inner: "w-20 h-20 rounded-full", text: "text-3xl" },
};

export function AppLogo({ size = "md", showLabel = false }: { size?: Size; showLabel?: boolean }) {
  const s = sizes[size];
  return (
    <View className="flex-row items-center gap-2.5">
      <View className={`${s.outer} bg-primary-soft items-center justify-center`}>
        <View className={`${s.inner} bg-primary items-center justify-center`}>
          <Text className={`text-on-primary font-sans font-bold ${s.text}`}>PL</Text>
        </View>
      </View>
      {showLabel && (
        <Text className="font-sans text-lg font-bold text-primary">PorLapor</Text>
      )}
    </View>
  );
}
