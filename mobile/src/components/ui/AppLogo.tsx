import { View, Image } from "react-native";

type Size = "sm" | "md" | "lg" | "xl";

const sizes: Record<Size, { outer: string; inner: string; text: string }> = {
  sm: { outer: "w-8 h-8 rounded-lg", inner: "w-5 h-5 rounded-md", text: "text-[10px]" },
  md: { outer: "w-10 h-10 rounded-xl", inner: "w-7 h-7 rounded-lg", text: "text-xs" },
  lg: { outer: "w-14 h-14 rounded-2xl", inner: "w-10 h-10 rounded-xl", text: "text-sm" },
  xl: { outer: "w-28 h-28 rounded-full", inner: "w-20 h-20 rounded-full", text: "text-3xl" },
};

export function AppLogo({ size = "md", showLabel = false }: { size?: Size; showLabel?: boolean }) {
  const sizeMap: Record<Size, { width: number; height: number }> = {
    sm: { width: 100, height: 28 },
    md: { width: 140, height: 40 },
    lg: { width: 180, height: 50 },
    xl: { width: 260, height: 72 },
  };
  const s = sizeMap[size];
  
  return (
    <View className="flex-row items-center justify-center">
      <Image 
        source={require("../../../assets/images/porlapor_logo.png")} 
        style={{ width: s.width, height: s.height }} 
        resizeMode="contain" 
      />
    </View>
  );
}
