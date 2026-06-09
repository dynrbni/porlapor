import { View, Text } from "react-native";
import { Clock, CheckCircle, XCircle } from "lucide-react-native";
import { statusLabels, getStatusBadgeStyle } from "../../theme";

type Props = { status: string; compact?: boolean };

function StatusIcon({ status, color }: { status: string; color: string }) {
  const s = status.toUpperCase();
  const size = 10;
  if (s === "RESOLVED") return <CheckCircle size={size} color={color} />;
  if (s === "REJECTED") return <XCircle size={size} color={color} />;
  return <Clock size={size} color={color} />;
}

export function StatusBadge({ status, compact }: Props) {
  const key = status.toUpperCase();
  const style = getStatusBadgeStyle(key);
  const label = statusLabels[key] || status;

  return (
    <View className={`flex-row items-center gap-1 ${style.bg} ${compact ? "px-2 py-0.5" : "px-2.5 py-1"} rounded-full`}>
      <StatusIcon status={key} color={style.iconColor} />
      <Text className={`font-body font-semibold ${style.text} ${compact ? "text-[10px]" : "text-xs"}`}>
        {label}
      </Text>
    </View>
  );
}
