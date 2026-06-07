import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import { getReportById } from "../../api/reports";

export default function ReportDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute<any>();
  const { reportId } = route.params;

  const { data } = useQuery({
    queryKey: ["report", reportId],
    queryFn: () => getReportById(reportId),
  });

  const report = data?.data;

  if (!report) return null;

  const statusColors: Record<string, string> = {
    PENDING: "bg-yellow-100 text-yellow-700",
    IN_REVIEW: "bg-blue-100 text-blue-700",
    IN_PROGRESS: "bg-indigo-100 text-indigo-700",
    RESOLVED: "bg-green-100 text-green-700",
    REJECTED: "bg-red-100 text-red-700",
  };

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-slate-900">
      <ScrollView>
        <View className="flex-row items-center px-6 py-4">
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons
              name="arrow-back"
              size={24}
              className="text-slate-600 dark:text-slate-300"
            />
          </TouchableOpacity>
          <Text className="flex-1 text-lg font-bold text-slate-800 dark:text-white ml-4">
            Detail Laporan
          </Text>
        </View>

        <View className="px-6 pb-6">
          <Text className="text-xl font-bold text-slate-800 dark:text-white mb-2">
            {report.title}
          </Text>
          <View className="flex-row items-center gap-2 mb-4">
            <View
              className={`px-3 py-1 rounded-full ${
                statusColors[report.status]?.split(" ")[0] ?? "bg-slate-100"
              }`}
            >
              <Text
                className={`text-xs font-medium ${
                  statusColors[report.status]?.split(" ")[1] ??
                  "text-slate-600"
                }`}
              >
                {report.status.replace("_", " ")}
              </Text>
            </View>
            <Text className="text-xs text-slate-400">
              {new Date(report.createdAt).toLocaleDateString("id-ID", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </Text>
          </View>

          <Text className="text-slate-600 dark:text-slate-300 leading-6 mb-4">
            {report.description}
          </Text>

          {report.user && (
            <View className="flex-row items-center gap-3 bg-slate-50 dark:bg-slate-800 rounded-xl p-3 mb-4">
              <Ionicons name="person-circle" size={36} color="#94a3b8" />
              <View>
                <Text className="font-medium text-slate-800 dark:text-white text-sm">
                  {report.user.name}
                </Text>
                <Text className="text-xs text-slate-400">Pelapor</Text>
              </View>
            </View>
          )}

          {report.agency && (
            <View className="bg-teal-50 dark:bg-teal-950/30 rounded-xl p-3 mb-4">
              <Text className="text-xs text-teal-600 dark:text-teal-400 font-medium mb-1">
                Ditindaklanjuti oleh
              </Text>
              <Text className="font-medium text-teal-800 dark:text-teal-200 text-sm">
                {report.agency.name}
              </Text>
            </View>
          )}

          {report.comments && report.comments.length > 0 && (
            <>
              <Text className="font-bold text-slate-800 dark:text-white mb-3 mt-2">
                Komentar ({report._count?.comments ?? report.comments.length})
              </Text>
              {report.comments.map((c) => (
                <View
                  key={c.id}
                  className="bg-slate-50 dark:bg-slate-800 rounded-xl p-3 mb-2"
                >
                  <View className="flex-row items-center gap-2 mb-1">
                    <Text className="font-medium text-slate-800 dark:text-white text-sm">
                      {c.author?.name ?? "Anonymous"}
                    </Text>
                    <Text className="text-xs text-slate-400">
                      {new Date(c.createdAt).toLocaleDateString("id-ID")}
                    </Text>
                  </View>
                  <Text className="text-slate-600 dark:text-slate-300 text-sm">
                    {c.content}
                  </Text>
                </View>
              ))}
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
