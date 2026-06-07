import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ArrowRight,
  Search,
  FileText,
  ClipboardCheck,
  Wrench,
  CheckCircle2,
  Clock,
  MapPin,
  Calendar,
  Tag,
  AlertCircle,
} from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { PublicStackParamList } from "../../navigation/PublicNavigator";
import { useQuery } from "@tanstack/react-query";
import { getReports, getReportById } from "../../api/reports";
import type { Report } from "../../types";

type Nav = NativeStackNavigationProp<PublicStackParamList, "Home">;

export default function HomeScreen() {
  const navigation = useNavigation<Nav>();
  const [searchId, setSearchId] = useState("");
  const [searchResult, setSearchResult] = useState<Report | null>(null);
  const [searching, setSearching] = useState(false);
  const [searchErr, setSearchErr] = useState("");

  const { data: reportsData } = useQuery({
    queryKey: ["recent-reports"],
    queryFn: () => getReports({ limit: 6 }),
  });

  const reports = reportsData?.data ?? [];

  async function handleSearch() {
    if (!searchId.trim()) return;
    setSearching(true);
    setSearchErr("");
    setSearchResult(null);
    try {
      const res = await getReportById(searchId.trim());
      setSearchResult(res.data);
    } catch {
      setSearchErr("Laporan tidak ditemukan");
    } finally {
      setSearching(false);
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Hero */}
        <View className="px-6 pt-4 pb-16">
          <View className="flex-row justify-between items-center mb-8">
            <View>
              <Text className="text-3xl font-extrabold text-slate-900 tracking-tight">
                PorLapor
              </Text>
              <Text className="text-slate-500 font-medium mt-1">
                Layanan Pengaduan Publik
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => navigation.navigate("Login")}
              className="bg-teal-600 px-5 py-2.5 rounded-xl"
            >
              <Text className="text-white font-bold text-sm">Masuk</Text>
            </TouchableOpacity>
          </View>

          <Text className="text-4xl font-extrabold text-slate-900 leading-tight mb-3">
            Layanan Pengaduan Publik{" "}
            <Text className="text-teal-600">Terbuka & Transparan.</Text>
          </Text>
          <Text className="text-base text-slate-600 leading-relaxed mb-8">
            Sampaikan laporan, aspirasi, permintaan, informasi, maupun pengaduan
            langsung kepada instansi berwenang.
          </Text>

          <TouchableOpacity
            onPress={() => navigation.navigate("Login")}
            className="bg-teal-600 py-4 px-6 rounded-2xl flex-row items-center justify-center mb-4 shadow-lg shadow-teal-500/25"
          >
            <Text className="text-white font-bold text-lg mr-2">
              Tulis Laporan Baru
            </Text>
            <ArrowRight size={20} color="#fff" />
          </TouchableOpacity>

          <View className="flex-row gap-2">
            <View className="flex-1 relative">
              <Search
                size={18}
                color="#94a3b8"
                style={{ position: "absolute", left: 14, top: 16, zIndex: 1 }}
              />
              <TextInput
                value={searchId}
                onChangeText={setSearchId}
                placeholder="Lacak ID Laporan..."
                placeholderTextColor="#94a3b8"
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-4 text-slate-900 font-medium"
              />
            </View>
            <TouchableOpacity
              onPress={handleSearch}
              disabled={searching}
              className="bg-slate-900 px-5 rounded-xl items-center justify-center"
            >
              <Text className="text-white font-bold">
                {searching ? "..." : "Cari"}
              </Text>
            </TouchableOpacity>
          </View>

          {searchErr ? (
            <View className="mt-4 bg-red-50 border border-red-200 rounded-xl p-4">
              <Text className="text-red-700 text-sm font-medium">
                {searchErr}
              </Text>
            </View>
          ) : null}

          {searchResult ? (
            <SearchResultCard
              report={searchResult}
              onPress={() =>
                navigation.navigate("ReportDetail", {
                  reportId: searchResult.id,
                })
              }
            />
          ) : null}
        </View>

        {/* How It Works */}
        <View className="px-6 pb-16">
          <Text className="text-3xl font-extrabold text-slate-900 mb-2">
            Mekanisme Penanganan
          </Text>
          <Text className="text-slate-500 mb-10 leading-relaxed">
            Kami menerapkan standar resolusi transparan. Setiap tindak lanjut
            dari instansi tercatat dan dapat dipantau langsung oleh pelapor.
          </Text>

          {[
            {
              no: "01",
              title: "Pencatatan",
              desc: "Tuliskan rincian keluhan atau aspirasi. Lengkapi detail kronologi dan lokasi.",
              icon: FileText,
            },
            {
              no: "02",
              title: "Verifikasi",
              desc: "Tim verifikator memvalidasi kelengkapan berkas selambatnya 3 hari kerja.",
              icon: ClipboardCheck,
            },
            {
              no: "03",
              title: "Tindak Lanjut",
              desc: "Instansi terkait memberikan respon dan menyelesaikan pengaduan sesuai wewenangnya.",
              icon: Wrench,
            },
            {
              no: "04",
              title: "Status Selesai",
              desc: "Laporan ditutup. Pemohon diberikan akses untuk menilai kinerja tim penyelidik.",
              icon: CheckCircle2,
            },
          ].map((step, i) => (
            <View key={step.no} className="flex-row gap-4 mb-8">
              <View className="items-center">
                <View className="w-12 h-12 bg-teal-50 rounded-2xl items-center justify-center">
                  <step.icon size={24} color="#0f766e" />
                </View>
                {i < 3 && (
                  <View className="w-0.5 flex-1 bg-teal-200 mt-2 rounded-full min-h-[32px]" />
                )}
              </View>
              <View className="flex-1 pb-2">
                <View className="flex-row items-center gap-2 mb-1">
                  <Text className="text-3xl font-black text-slate-100 tracking-tighter">
                    {step.no}
                  </Text>
                  <View className="h-0.5 w-8 bg-teal-500 rounded-full" />
                </View>
                <Text className="text-lg font-bold text-slate-900 mb-1">
                  {step.title}
                </Text>
                <Text className="text-slate-500 leading-relaxed text-sm">
                  {step.desc}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Recent Reports */}
        {reports.length > 0 && (
          <View className="px-6 pb-16">
            <Text className="text-3xl font-extrabold text-slate-900 mb-2">
              Laporan Terbaru
            </Text>
            <Text className="text-slate-500 mb-8">
              Pantau berbagai laporan yang baru saja disampaikan oleh
              masyarakat.
            </Text>

            {reports.map((report) => (
              <TouchableOpacity
                key={report.id}
                onPress={() =>
                  navigation.navigate("ReportDetail", {
                    reportId: report.id,
                  })
                }
                className="bg-white border border-slate-200 rounded-2xl p-5 mb-4 shadow-sm"
              >
                <View className="flex-row justify-between items-start mb-3">
                  <StatusBadge status={report.status} />
                  <Text className="text-xs text-slate-400 font-mono">
                    #{report.id}
                  </Text>
                </View>
                <Text className="text-lg font-bold text-slate-900 mb-2">
                  {report.title}
                </Text>
                <Text className="text-sm text-slate-600 mb-4" numberOfLines={3}>
                  {report.description}
                </Text>
                <View className="pt-3 border-t border-slate-100">
                  {report.address ? (
                    <View className="flex-row items-center mb-2">
                      <MapPin size={14} color="#94a3b8" />
                      <Text className="text-xs text-slate-500 ml-1.5" numberOfLines={1}>
                        {report.address}
                      </Text>
                    </View>
                  ) : null}
                  <View className="flex-row justify-between items-center">
                    <Text className="text-xs text-slate-400">
                      {new Date(report.createdAt).toLocaleDateString("id-ID", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Footer */}
        <View className="px-6 pb-8 items-center">
          <Text className="text-slate-400 text-xs">
            &copy; {new Date().getFullYear()} PorLapor. All rights reserved.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, any> = {
    PENDING: { bg: "bg-amber-100", text: "text-amber-700", label: "Menunggu" },
    IN_REVIEW: { bg: "bg-blue-100", text: "text-blue-700", label: "Ditinjau" },
    IN_PROGRESS: { bg: "bg-blue-100", text: "text-blue-700", label: "Diproses" },
    RESOLVED: { bg: "bg-emerald-100", text: "text-emerald-700", label: "Selesai" },
    REJECTED: { bg: "bg-red-100", text: "text-red-700", label: "Ditolak" },
  };
  const c = config[status] || config.PENDING;
  return (
    <View className={`${c.bg} px-3 py-1 rounded-full`}>
      <Text className={`${c.text} text-xs font-bold`}>{c.label}</Text>
    </View>
  );
}

function SearchResultCard({
  report,
  onPress,
}: {
  report: Report;
  onPress: () => void;
}) {
  return (
    <View className="mt-4 border-2 border-teal-200 bg-teal-50 rounded-2xl p-5">
      <View className="flex-row items-center gap-2 mb-3">
        <StatusBadge status={report.status} />
      </View>
      <Text className="text-xl font-bold text-slate-900 mb-3">
        {report.title}
      </Text>
      <View className="space-y-2 mb-4">
        <View className="flex-row items-center gap-2">
          <Calendar size={14} color="#64748b" />
          <Text className="text-xs text-slate-600">
            {new Date(report.createdAt).toLocaleDateString("id-ID")}
          </Text>
        </View>
        {report.category ? (
          <View className="flex-row items-center gap-2">
            <Tag size={14} color="#64748b" />
            <Text className="text-xs text-slate-600">
              {report.category.name}
            </Text>
          </View>
        ) : null}
        {report.address ? (
          <View className="flex-row items-center gap-2">
            <MapPin size={14} color="#64748b" />
            <Text className="text-xs text-slate-600" numberOfLines={1}>
              {report.address}
            </Text>
          </View>
        ) : null}
      </View>
      <TouchableOpacity
        onPress={onPress}
        className="bg-teal-600 py-3 rounded-xl items-center"
      >
        <Text className="text-white font-bold text-sm">
          Lihat Detail Lengkap
        </Text>
      </TouchableOpacity>
    </View>
  );
}
