import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { Report } from "../types";

export default function ReportCard({ report }: { report: Report }) {
  const statusColors: Record<string, string> = {
    PENDING: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300",
    IN_REVIEW: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
    IN_PROGRESS:
      "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300",
    RESOLVED: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
    REJECTED: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
  };

  return (
    <View className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4 mb-3">
      <Text className="font-semibold text-slate-800 dark:text-white mb-1">
        {report.title}
      </Text>
      <Text className="text-sm text-slate-500 mb-3" numberOfLines={2}>
        {report.description}
      </Text>
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-3">
          <View
            className={`px-3 py-1 rounded-full ${
              statusColors[report.status]?.split(" ")[0] ?? "bg-slate-200"
            }`}
          >
            <Text
              className={`text-xs font-medium ${
                statusColors[report.status]?.split(" ")[1] ?? "text-slate-600"
              }`}
            >
              {report.status.replace("_", " ")}
            </Text>
          </View>
          {report.category && (
            <Text className="text-xs text-slate-400">
              {report.category.name}
            </Text>
          )}
        </View>
        <View className="flex-row items-center gap-2">
          <View className="flex-row items-center gap-1">
            <Ionicons name="chatbubble-outline" size={12} color="#94a3b8" />
            <Text className="text-xs text-slate-400">
              {report._count?.comments ?? 0}
            </Text>
          </View>
          <View className="flex-row items-center gap-1">
            <Ionicons name="heart-outline" size={12} color="#94a3b8" />
            <Text className="text-xs text-slate-400">
              {report._count?.likes ?? 0}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}
