import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  ImageBackground,
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
  LogIn,
  Building2,
  BarChart3,
  Clock,
  AlertCircle,
  FileCheck,
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
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-5 pt-4 pb-3 bg-white flex-row justify-between items-center">
          <Image
            source={require("../../../assets/images/porlapor_logo.png")}
            className="h-10 w-auto"
            resizeMode="contain"
          />
          <TouchableOpacity
            onPress={() => navigation.navigate("Login")}
            className="bg-primary px-5 py-2.5 rounded-xl flex-row items-center gap-2"
          >
            <LogIn size={16} color="#fff" />
            <Text className="text-on-primary font-sans text-sm font-bold">Masuk</Text>
          </TouchableOpacity>
        </View>

        <View className="relative overflow-hidden mx-5 mt-2 rounded-3xl shadow-md">
          <ImageBackground
            source={require("../../../assets/images/hero_bg.jpg")}
            className="w-full"
            style={{ aspectRatio: 16 / 11 }}
            resizeMode="cover"
          >
            <View className="absolute inset-0 bg-primary/85" />
            <View className="absolute inset-0 p-6 justify-end">
              <Text className="font-sans text-3xl font-extrabold text-white mb-2 leading-tight">
                Layanan Pengaduan{"\n"}
                Publik <Text className="text-secondary-fixed">Terbuka & Transparan.</Text>
              </Text>
              <Text className="font-body text-sm text-white/90 leading-relaxed mb-5">
                Sampaikan laporan, aspirasi, maupun pengaduan langsung kepada instansi berwenang.
              </Text>
              <TouchableOpacity
                onPress={() => navigation.navigate("Login")}
                activeOpacity={0.85}
                className="bg-white py-3 px-5 rounded-2xl flex-row items-center justify-center gap-2 self-start"
              >
                <Text className="text-primary font-sans text-sm font-bold">Tulis Laporan Baru</Text>
                <ArrowRight size={16} color="#007AFF" />
              </TouchableOpacity>
            </View>
          </ImageBackground>
        </View>

        <View className="px-5 mt-5">
          <View className="bg-white rounded-2xl border border-outline-variant p-4 flex-row items-center gap-2 shadow-sm">
            <View className="flex-1 flex-row items-center bg-surface-container-low rounded-xl px-3.5 py-2.5">
              <Search size={18} color="#94a3b8" />
              <TextInput
                value={searchId}
                onChangeText={setSearchId}
                placeholder="Lacak ID Laporan..."
                placeholderTextColor="#94a3b8"
                className="flex-1 ml-2.5 font-body text-sm text-on-surface"
              />
            </View>
            <TouchableOpacity
              onPress={handleSearch}
              disabled={searching}
              activeOpacity={0.85}
              className="bg-primary px-5 py-2.5 rounded-xl items-center justify-center"
            >
              {searching ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text className="text-on-primary font-sans text-sm font-bold">Cari</Text>
              )}
            </TouchableOpacity>
          </View>

          {searchErr ? (
            <View className="mt-3 bg-error-container border border-red-200 rounded-xl p-3">
              <Text className="text-red-700 text-sm font-medium">{searchErr}</Text>
            </View>
          ) : null}

          {searchResult ? (
            <SearchResultCard
              report={searchResult}
              onPress={() =>
                navigation.navigate("ReportDetail", { reportId: searchResult.id })
              }
            />
          ) : null}
        </View>

        <View className="px-5 mt-6 flex-row gap-3">
          <TouchableOpacity
            onPress={() => navigation.navigate("Statistics")}
            activeOpacity={0.85}
            className="flex-1 bg-white border border-outline-variant rounded-2xl p-4 flex-row items-center gap-3 shadow-sm"
          >
            <View className="w-11 h-11 bg-primary-soft rounded-xl items-center justify-center">
              <BarChart3 size={22} color="#007AFF" />
            </View>
            <View className="flex-1">
              <Text className="font-sans text-sm font-bold text-on-surface">Statistik</Text>
              <Text className="font-body text-[11px] text-on-surface-variant">Lihat data</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate("Agencies")}
            activeOpacity={0.85}
            className="flex-1 bg-white border border-outline-variant rounded-2xl p-4 flex-row items-center gap-3 shadow-sm"
          >
            <View className="w-11 h-11 bg-secondary-soft rounded-xl items-center justify-center">
              <Building2 size={22} color="#2563eb" />
            </View>
            <View className="flex-1">
              <Text className="font-sans text-sm font-bold text-on-surface">Instansi</Text>
              <Text className="font-body text-[11px] text-on-surface-variant">Berwenang</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View className="px-5 mt-8">
          <Text className="font-sans text-2xl font-extrabold text-on-surface mb-2">
            Mekanisme Penanganan
          </Text>
          <Text className="font-body text-sm text-on-surface-variant mb-6 leading-relaxed">
            Kami menerapkan standar resolusi transparan. Setiap tindak lanjut dari instansi tercatat dan dapat dipantau.
          </Text>

          {[
            {
              no: "01",
              title: "Pencatatan",
              desc: "Tuliskan rincian keluhan atau aspirasi. Lengkapi detail kronologi dan lokasi.",
              icon: FileText,
              bg: "bg-primary-soft",
              color: "#007AFF",
            },
            {
              no: "02",
              title: "Verifikasi",
              desc: "Tim verifikator memvalidasi kelengkapan berkas selambatnya 3 hari kerja.",
              icon: ClipboardCheck,
              bg: "bg-secondary-soft",
              color: "#2563eb",
            },
            {
              no: "03",
              title: "Tindak Lanjut",
              desc: "Instansi terkait memberikan respon dan menyelesaikan pengaduan sesuai wewenangnya.",
              icon: Wrench,
              bg: "bg-warning-soft",
              color: "#d97706",
            },
            {
              no: "04",
              title: "Status Selesai",
              desc: "Laporan ditutup. Pemohon dapat menilai kinerja tim penyelidik.",
              icon: CheckCircle2,
              bg: "bg-success-soft",
              color: "#059669",
            },
          ].map((step, i) => (
            <View key={step.no} className="flex-row gap-3 mb-5">
              <View className="items-center">
                <View className={`w-12 h-12 ${step.bg} rounded-2xl items-center justify-center`}>
                  <step.icon size={22} color={step.color} />
                </View>
                {i < 3 && (
                  <View className="w-0.5 flex-1 bg-outline-variant mt-2 mb-0 min-h-[24px]" />
                )}
              </View>
              <View className="flex-1 bg-white border border-outline-variant rounded-2xl p-4">
                <View className="flex-row items-center gap-2 mb-1">
                  <Text className="font-sans text-xl font-extrabold text-outline-variant tracking-tight">
                    {step.no}
                  </Text>
                  <View className="h-0.5 w-6 bg-primary rounded-full" />
                </View>
                <Text className="font-sans text-base font-bold text-on-surface mb-1">
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
          <View className="px-5 mt-6">
            <View className="flex-row justify-between items-end mb-4">
              <View className="flex-1">
                <Text className="font-sans text-2xl font-extrabold text-on-surface mb-1">
                  Laporan Terbaru
                </Text>
                <Text className="font-body text-sm text-on-surface-variant">
                  Pantau laporan terkini dari masyarakat.
                </Text>
              </View>
            </View>

            {reports.map((report) => (
              <TouchableOpacity
                key={report.id}
                onPress={() =>
                  navigation.navigate("ReportDetail", { reportId: report.id })
                }
                activeOpacity={0.85}
                className="bg-white border border-outline-variant rounded-2xl p-4 mb-3 shadow-sm"
              >
                <View className="flex-row justify-between items-start mb-2.5">
                  <StatusBadge status={report.status} />
                  <Text className="font-body text-[11px] text-on-surface-variant font-mono">
                    #{report.id?.slice(0, 8)}
                  </Text>
                </View>
                <Text className="font-sans text-base font-bold text-on-surface mb-1.5" numberOfLines={2}>
                  {report.title}
                </Text>
                <Text className="font-body text-sm text-on-surface-variant mb-3" numberOfLines={2}>
                  {report.description}
                </Text>
                <View className="flex-row items-center justify-between pt-3 border-t border-outline-variant">
                  {report.address ? (
                    <View className="flex-row items-center flex-1 mr-2">
                      <MapPin size={13} color="#94a3b8" />
                      <Text className="font-body text-xs text-on-surface-variant ml-1.5" numberOfLines={1}>
                        {report.address}
                      </Text>
                    </View>
                  ) : (
                    <View className="flex-1" />
                  )}
                  <Text className="font-body text-xs text-on-surface-variant">
                    {new Date(report.createdAt).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                    })}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <View className="px-5 pb-8 mt-8 items-center">
          <Text className="text-on-surface-variant font-body text-xs">
            © {new Date().getFullYear()} PorLapor. All rights reserved.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, any> = {
    PENDING: { bg: "bg-warning-soft", text: "text-warning", icon: Clock, label: "Menunggu" },
    IN_REVIEW: { bg: "bg-secondary-soft", text: "text-secondary", icon: AlertCircle, label: "Ditinjau" },
    IN_PROGRESS: { bg: "bg-secondary-soft", text: "text-secondary", icon: AlertCircle, label: "Diproses" },
    RESOLVED: { bg: "bg-success-soft", text: "text-success", icon: CheckCircle2, label: "Selesai" },
    REJECTED: { bg: "bg-error-container", text: "text-error", icon: AlertCircle, label: "Ditolak" },
  };
  const c = config[status] || config.PENDING;
  const Icon = c.icon;
  return (
    <View className={`${c.bg} px-2.5 py-1 rounded-full flex-row items-center gap-1.5`}>
      <Icon size={12} color="#0f172a" />
      <Text className={`${c.text} font-body text-[11px] font-bold`}>{c.label}</Text>
    </View>
  );
}

function SearchResultCard({ report, onPress }: { report: Report; onPress: () => void }) {
  return (
    <View className="mt-3 border-2 border-primary bg-primary-soft/40 rounded-2xl p-4">
      <StatusBadge status={report.status} />
      <Text className="font-sans text-base font-bold text-on-surface mt-3 mb-3">
        {report.title}
      </Text>
      <View className="flex-row items-center gap-2 mb-2">
        <Calendar size={13} color="#64748b" />
        <Text className="font-body text-xs text-on-surface-variant">
          {new Date(report.createdAt).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </Text>
      </View>
      {report.category ? (
        <View className="flex-row items-center gap-2 mb-2">
          <Tag size={13} color="#64748b" />
          <Text className="font-body text-xs text-on-surface-variant">{report.category.name}</Text>
        </View>
      ) : null}
      {report.address ? (
        <View className="flex-row items-center gap-2 mb-3">
          <MapPin size={13} color="#64748b" />
          <Text className="font-body text-xs text-on-surface-variant" numberOfLines={1}>
            {report.address}
          </Text>
        </View>
      ) : null}
      <TouchableOpacity onPress={onPress} activeOpacity={0.85} className="bg-primary py-2.5 rounded-xl items-center mt-1">
        <Text className="text-on-primary font-sans text-sm font-bold">Lihat Detail Lengkap</Text>
      </TouchableOpacity>
    </View>
  );
}
