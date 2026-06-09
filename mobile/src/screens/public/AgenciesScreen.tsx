import { useState, useMemo } from "react";
import { View, Text, TextInput, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Search, Building2, ShieldCheck, CheckCircle2 } from "lucide-react-native";
import { StitchHeader } from "../../components/ui/StitchHeader";
import { colors } from "../../theme";

interface Agency {
  id: string;
  name: string;
  description: string;
  category: string;
  reportsHandled: number;
  responseRate: number;
  color: string;
}

const agencies: Agency[] = [
  { id: "1", name: "Dinas Kebersihan", description: "Pengelolaan sampah, kebersihan lingkungan, dan drainase kota", category: "Kebersihan", reportsHandled: 1240, responseRate: 92, color: "#059669" },
  { id: "2", name: "Dinas Pekerjaan Umum", description: "Infrastruktur jalan, jembatan, dan bangunan publik", category: "Infrastruktur", reportsHandled: 980, responseRate: 85, color: "#2563eb" },
  { id: "3", name: "Dinas Perhubungan", description: "Lalu lintas, angkutan umum, dan perparkiran", category: "Transportasi", reportsHandled: 760, responseRate: 78, color: "#d97706" },
  { id: "4", name: "Dinas Lingkungan Hidup", description: "Pengelolaan RTH, polusi, dan konservasi lingkungan", category: "Lingkungan", reportsHandled: 540, responseRate: 88, color: "#16a34a" },
  { id: "5", name: "Satpol PP", description: "Penertiban umum, ketenteraman, dan ketertiban masyarakat", category: "Ketertiban", reportsHandled: 1120, responseRate: 90, color: "#dc2626" },
];

const categories = ["Semua", "Kebersihan", "Infrastruktur", "Transportasi", "Lingkungan", "Ketertiban"];

export default function AgenciesScreen() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");

  const filtered = useMemo(() => agencies.filter((a) => {
    const matchSearch = a.name.toLowerCase().includes(search.toLowerCase()) || a.description.toLowerCase().includes(search.toLowerCase());
    return matchSearch && (selectedCategory === "Semua" || a.category === selectedCategory);
  }), [search, selectedCategory]);

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <StitchHeader />

      <ScrollView contentContainerClassName="px-5 pb-28 pt-5" showsVerticalScrollIndicator={false}>
        <Text className="font-sans text-2xl font-bold text-on-surface mb-1 tracking-tight">Instansi Terkait</Text>
        <Text className="font-body text-sm text-on-surface-variant mb-5 leading-relaxed">
          Dinas pemerintahan yang menangani laporan masyarakat
        </Text>

        {/* Search */}
        <View
          className="flex-row items-center bg-surface-container-lowest border border-outline-variant rounded-2xl px-4 h-12 mb-4"
          style={{ shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.03, shadowRadius: 4, elevation: 1 }}
        >
          <Search size={18} color={colors.outline} />
          <TextInput
            className="flex-1 ml-3 font-body text-sm text-on-surface"
            placeholder="Cari instansi..."
            placeholderTextColor="#94a3b8"
            value={search}
            onChangeText={setSearch}
          />
        </View>

        {/* Category Filter */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-5 -mx-5">
          <View className="flex-row gap-2.5 px-5">
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat}
                onPress={() => setSelectedCategory(cat)}
                activeOpacity={0.8}
                className={`px-4 py-2 rounded-full ${
                  selectedCategory === cat
                    ? "bg-primary"
                    : "bg-surface-container-lowest border border-outline-variant"
                }`}
                style={
                  selectedCategory === cat
                    ? { shadowColor: colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4 }
                    : undefined
                }
              >
                <Text className={`font-body text-xs font-semibold ${selectedCategory === cat ? "text-on-primary" : "text-on-surface-variant"}`}>
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        {/* Agency Cards */}
        <View className="gap-4">
          {filtered.map((a) => (
            <View
              key={a.id}
              className="bg-surface-container-lowest rounded-2xl border border-outline-variant p-5"
              style={{ shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 12, elevation: 3 }}
            >
              <View className="flex-row gap-4">
                <View className="w-12 h-12 rounded-2xl items-center justify-center" style={{ backgroundColor: `${a.color}15` }}>
                  <Building2 size={22} color={a.color} />
                </View>
                <View className="flex-1">
                  <Text className="font-sans text-base font-bold text-on-surface">{a.name}</Text>
                  <Text className="font-body text-sm text-on-surface-variant mt-1 leading-relaxed">{a.description}</Text>
                  <View className="self-start mt-2.5 px-3 py-1 bg-surface-container-low rounded-full">
                    <Text className="font-body text-[11px] font-semibold text-on-surface-variant">{a.category}</Text>
                  </View>
                </View>
              </View>
              <View className="flex-row justify-between mt-4 pt-4 border-t border-outline-variant">
                <View className="flex-row items-center gap-1.5">
                  <ShieldCheck size={14} color={colors.onSurfaceVariant} />
                  <Text className="font-body text-xs text-on-surface-variant">{a.reportsHandled.toLocaleString("id-ID")} laporan</Text>
                </View>
                <View className="flex-row items-center gap-1.5">
                  <CheckCircle2 size={14} color="#059669" />
                  <Text className="font-body text-xs font-bold text-[#059669]">{a.responseRate}% respons</Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
