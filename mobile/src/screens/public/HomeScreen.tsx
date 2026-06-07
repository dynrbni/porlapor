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
  MapPin,
  Calendar,
  Tag,
  ArrowLeft,
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
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-5 pt-4 pb-16">
          <View className="flex-row justify-between items-center mb-8">
            <View className="flex-row items-center gap-2">
              <View className="w-8 h-8 rounded-full bg-primary-container items-center justify-center">
                <Search size={18} color="#90a8ff" />
              </View>
              <View>
                <Text className="font-sans text-lg font-bold text-primary">PorLapor</Text>
                <Text className="font-body text-sm text-on-surface-variant">Layanan Pengaduan Publik</Text>
              </View>
            </View>
            <TouchableOpacity
              onPress={() => navigation.navigate("Login")}
              className="bg-primary px-5 py-2.5 rounded-full"
            >
              <Text className="text-on-primary font-sans text-sm font-semibold">Masuk</Text>
            </TouchableOpacity>
          </View>

          <View className="relative overflow-hidden rounded-xl bg-surface-container-high p-5 border border-outline-variant mb-6">
            <View className="relative z-10">
              <Text className="font-sans text-2xl font-bold text-primary mb-3">
                Layanan Pengaduan Publik{" "}
                <Text className="text-secondary">Terbuka & Transparan.</Text>
              </Text>
              <Text className="font-body text-base text-on-surface-variant leading-relaxed mb-6">
                Sampaikan laporan, aspirasi, permintaan, informasi, maupun pengaduan
                langsung kepada instansi berwenang.
              </Text>

              <TouchableOpacity
                onPress={() => navigation.navigate("Login")}
                className="bg-primary py-3.5 px-6 rounded-full flex-row items-center justify-center mb-4 shadow-md"
              >
                <Text className="text-on-primary font-sans text-sm font-semibold mr-2">
                  Tulis Laporan Baru
                </Text>
                <ArrowRight size={20} color="#fff" />
              </TouchableOpacity>

              <View className="flex-row gap-2">
                <View className="flex-1 relative">
                  <Search
                    size={18}
                    color="#757682"
                    style={{ position: "absolute", left: 14, top: 14, zIndex: 1 }}
                  />
                  <TextInput
                    value={searchId}
                    onChangeText={setSearchId}
                    placeholder="Lacak ID Laporan..."
                    placeholderTextColor="#757682"
                    className="flex-1 bg-surface border border-outline-variant rounded-xl pl-10 pr-4 py-3.5 font-body text-base text-on-surface"
                  />
                </View>
                <TouchableOpacity
                  onPress={handleSearch}
                  disabled={searching}
                  className="bg-primary px-5 rounded-xl items-center justify-center"
                >
                  <Text className="text-on-primary font-sans text-sm font-semibold">
                    {searching ? "..." : "Cari"}
                  </Text>
                </TouchableOpacity>
              </View>

              {searchErr ? (
                <View className="mt-4 bg-error-container border border-error-container rounded-xl p-4">
                  <Text className="text-on-error-container text-sm font-medium">
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
            <View className="absolute -right-20 -top-20 w-48 h-48 bg-primary-container opacity-10 rounded-full" />
            <View className="absolute -bottom-10 right-10 w-32 h-32 bg-secondary-container opacity-10 rounded-full" />
          </View>
        </View>

        <View className="px-5 pb-16">
          <Text className="font-sans text-2xl font-bold text-on-surface mb-2">
            Mekanisme Penanganan
          </Text>
          <Text className="font-body text-base text-on-surface-variant mb-10 leading-relaxed">
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
                <View className="w-12 h-12 bg-primary-fixed rounded-2xl items-center justify-center">
                  <step.icon size={24} color="#00236f" />
                </View>
                {i < 3 && (
                  <View className="w-0.5 flex-1 bg-primary-fixed-dim mt-2 rounded-full min-h-[32px]" />
                )}
              </View>
              <View className="flex-1 pb-2">
                <View className="flex-row items-center gap-2 mb-1">
                  <Text className="font-sans text-3xl font-black text-outline-variant tracking-tighter">
                    {step.no}
                  </Text>
                  <View className="h-0.5 w-8 bg-secondary rounded-full" />
                </View>
                <Text className="font-sans text-lg font-bold text-on-surface mb-1">
                  {step.title}
                </Text>
                <Text className="font-body text-sm text-on-surface-variant leading-relaxed">
                  {step.desc}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {reports.length > 0 && (
          <View className="px-5 pb-16">
            <Text className="font-sans text-2xl font-bold text-on-surface mb-2">
              Laporan Terbaru
            </Text>
            <Text className="font-body text-base text-on-surface-variant mb-8">
              Pantau berbagai laporan yang baru saja disampaikan oleh masyarakat.
            </Text>

            {reports.map((report) => (
              <TouchableOpacity
                key={report.id}
                onPress={() =>
                  navigation.navigate("ReportDetail", {
                    reportId: report.id,
                  })
                }
                className="bg-surface-container-lowest border border-outline-variant rounded-xl p-4 mb-4 shadow-sm"
              >
                <View className="flex-row justify-between items-start mb-3">
                  <StatusBadge status={report.status} />
                  <Text className="font-body text-xs text-outline font-mono">
                    #{report.id}
                  </Text>
                </View>
                <Text className="font-sans text-lg font-bold text-on-surface mb-2">
                  {report.title}
                </Text>
                <Text className="font-body text-sm text-on-surface-variant mb-4" numberOfLines={3}>
                  {report.description}
                </Text>
                <View className="pt-3 border-t border-outline-variant">
                  {report.address ? (
                    <View className="flex-row items-center mb-2">
                      <MapPin size={14} color="#757682" />
                      <Text className="font-body text-xs text-on-surface-variant ml-1.5" numberOfLines={1}>
                        {report.address}
                      </Text>
                    </View>
                  ) : null}
                  <View className="flex-row justify-between items-center">
                    <Text className="font-body text-xs text-outline">
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

        <View className="px-5 pb-8 items-center">
          <Text className="text-outline font-body text-xs">
            &copy; {new Date().getFullYear()} PorLapor. All rights reserved.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, any> = {
    PENDING: { bg: "bg-surface-variant", text: "text-on-surface-variant", label: "Menunggu" },
    IN_REVIEW: { bg: "bg-primary-fixed", text: "text-on-primary-fixed", label: "Ditinjau" },
    IN_PROGRESS: { bg: "bg-secondary-container", text: "text-on-secondary-container", label: "Diproses" },
    RESOLVED: { bg: "bg-tertiary-fixed", text: "text-on-tertiary-fixed", label: "Selesai" },
    REJECTED: { bg: "bg-error-container", text: "text-on-error-container", label: "Ditolak" },
  };
  const c = config[status] || config.PENDING;
  return (
    <View className={`${c.bg} px-3 py-1 rounded-full`}>
      <Text className={`${c.text} font-body text-xs font-semibold`}>{c.label}</Text>
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
    <View className="mt-4 border-2 border-secondary bg-secondary-fixed/30 rounded-xl p-5">
      <View className="flex-row items-center gap-2 mb-3">
        <StatusBadge status={report.status} />
      </View>
      <Text className="font-sans text-lg font-bold text-on-surface mb-3">
        {report.title}
      </Text>
      <View className="mb-4">
        <View className="flex-row items-center gap-2 mb-2">
          <Calendar size={14} color="#757682" />
          <Text className="font-body text-xs font-semibold text-on-surface-variant">
            {new Date(report.createdAt).toLocaleDateString("id-ID")}
          </Text>
        </View>
        {report.category ? (
          <View className="flex-row items-center gap-2 mb-2">
            <Tag size={14} color="#757682" />
            <Text className="font-body text-xs text-on-surface-variant">
              {report.category.name}
            </Text>
          </View>
        ) : null}
        {report.address ? (
          <View className="flex-row items-center gap-2">
            <MapPin size={14} color="#757682" />
            <Text className="font-body text-xs font-semibold text-on-surface-variant" numberOfLines={1}>
              {report.address}
            </Text>
          </View>
        ) : null}
      </View>
      <TouchableOpacity
        onPress={onPress}
        className="bg-primary py-3 rounded-xl items-center"
      >
        <Text className="text-on-primary font-sans text-sm font-semibold">
          Lihat Detail Lengkap
        </Text>
      </TouchableOpacity>
    </View>
  );
}
