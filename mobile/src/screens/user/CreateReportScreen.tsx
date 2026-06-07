import { View, Text, TextInput, TouchableOpacity, ScrollView, Image, Alert, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeft, ChevronRight, Info, MapPin, Camera, Image as ImageIcon, User, CheckCircle2 } from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";
import { useState, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createReport } from "../../api/reports";
import { getCategories } from "../../api/categories";

const DRAFT_KEY = "porlapor_draft_mobile";

export default function CreateReportScreen() {
  const navigation = useNavigation();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [agencyId, setAgencyId] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [address, setAddress] = useState("");
  const [image, setImage] = useState<string | null>(null);

  useEffect(() => {
    try {
      const draft = localStorage.getItem(DRAFT_KEY);
      if (draft) {
        const d = JSON.parse(draft);
        if (d.title) setTitle(d.title);
        if (d.description) setDescription(d.description);
        if (d.categoryId) setCategoryId(d.categoryId);
      }
    } catch {}
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      const draft = { title, description, categoryId };
      localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
    }, 2000);
    return () => clearTimeout(timer);
  }, [title, description, categoryId]);

  const { data: categories } = useQuery({ queryKey: ["categories"], queryFn: getCategories });

  const mutation = useMutation({
    mutationFn: createReport,
    onSuccess: () => {
      localStorage.removeItem(DRAFT_KEY);
      Alert.alert("Berhasil", "Laporan berhasil dikirim", [{ text: "OK", onPress: () => navigation.goBack() }]);
    },
    onError: (err: any) => {
      Alert.alert("Gagal", err.response?.data?.message || "Terjadi kesalahan");
    },
  });

  function handleSubmit() {
    if (!title || !description || !categoryId) {
      Alert.alert("Error", "Judul, deskripsi, dan kategori harus diisi");
      return;
    }
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("categoryId", categoryId);
    if (agencyId) formData.append("agencyId", agencyId);
    if (latitude) formData.append("latitude", latitude);
    if (longitude) formData.append("longitude", longitude);
    if (address) formData.append("address", address);
    if (image) {
      const filename = image.split("/").pop() ?? "photo.jpg";
      const ext = filename.split(".").pop() ?? "jpg";
      formData.append("image", { uri: image, name: filename, type: `image/${ext}` } as any);
    }
    mutation.mutate(formData);
  }

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <View className="flex-row items-center px-5 py-3 bg-white border-b border-outline-variant">
        <TouchableOpacity onPress={() => navigation.goBack()} className="w-9 h-9 items-center justify-center rounded-full bg-surface-container">
          <ArrowLeft size={18} color="#0f172a" />
        </TouchableOpacity>
        <Text className="flex-1 text-center font-sans text-lg font-extrabold text-on-surface">Buat Laporan Baru</Text>
        <View className="w-9" />
      </View>

      <ScrollView contentContainerClassName="p-5" keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <View className="flex-row items-center justify-between mb-2">
          <Text className="font-body text-xs font-bold text-primary uppercase tracking-wider">
            Langkah 1 dari 3
          </Text>
          <Text className="font-body text-xs text-on-surface-variant">Verifikasi</Text>
        </View>
        <View className="flex-row gap-2 mb-5">
          <View className="h-1.5 flex-1 rounded-full bg-primary" />
          <View className="h-1.5 flex-1 rounded-full bg-outline-variant" />
          <View className="h-1.5 flex-1 rounded-full bg-outline-variant" />
        </View>

        <View className="bg-white rounded-2xl border border-outline-variant p-5 flex-col gap-5 shadow-sm">
          <View className="flex-row gap-3 p-4 bg-primary-soft rounded-xl border border-primary/30">
            <Info size={18} color="#007AFF" style={{ marginTop: 2 }} />
            <Text className="font-body text-sm text-on-surface flex-1 leading-relaxed">
              Pastikan data diri dan kategori laporan sesuai untuk mempercepat proses verifikasi oleh instansi terkait.
            </Text>
          </View>

          <View>
            <View className="flex-row items-center justify-between mb-2">
              <Text className="font-body text-xs font-bold text-on-surface uppercase tracking-wide">
                NIK
              </Text>
              <View className="flex-row items-center gap-1 bg-success-soft px-2 py-0.5 rounded">
                <CheckCircle2 size={12} color="#059669" />
                <Text className="text-success text-[10px] uppercase font-bold tracking-wider">Terverifikasi</Text>
              </View>
            </View>
            <View className="bg-surface-container-low border border-outline-variant rounded-xl px-4 py-3.5">
              <Text className="font-body text-base text-on-surface-variant tracking-widest">3171234567890123</Text>
            </View>
            <Text className="font-body text-[11px] text-on-surface-variant mt-1.5">Format: 16-digits (Sesuai KTP terdaftar)</Text>
          </View>

          <View>
            <Text className="font-body text-xs font-bold text-on-surface mb-2 uppercase tracking-wide">Nama Pelapor</Text>
            <View className="flex-row items-center bg-surface-container-low border border-outline-variant rounded-xl px-4 py-3.5">
              <User size={16} color="#64748b" style={{ marginRight: 8 }} />
              <Text className="text-on-surface font-body text-base flex-1">Budi Santoso</Text>
            </View>
          </View>

          <View className="h-px bg-outline-variant" />

          <View>
            <Text className="font-body text-xs font-bold text-on-surface mb-2 uppercase tracking-wide">
              Pilih Kategori <Text className="text-error">*</Text>
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View className="flex-row gap-2">
                {(categories ?? []).map((cat: any) => (
                  <TouchableOpacity
                    key={cat.id}
                    onPress={() => setCategoryId(cat.id)}
                    activeOpacity={0.7}
                    className={`px-4 py-2.5 rounded-full ${categoryId === cat.id ? "bg-primary" : "bg-white border border-outline"}`}
                  >
                    <Text className={`font-body text-xs font-bold ${categoryId === cat.id ? "text-on-primary" : "text-on-surface-variant"}`}>
                      {cat.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>

          <View>
            <Text className="font-body text-xs font-bold text-on-surface mb-2 uppercase tracking-wide">
              Judul Laporan <Text className="text-error">*</Text>
            </Text>
            <TextInput
              value={title}
              onChangeText={setTitle}
              placeholder="Contoh: Jalan berlubang di Jl. Sudirman"
              placeholderTextColor="#94a3b8"
              className="bg-surface-container-lowest border border-outline-variant rounded-xl px-4 py-3.5 font-body text-base text-on-surface"
            />
          </View>

          <View>
            <Text className="font-body text-xs font-bold text-on-surface mb-2 uppercase tracking-wide">
              Deskripsi Laporan <Text className="text-error">*</Text>
            </Text>
            <TextInput
              value={description}
              onChangeText={setDescription}
              placeholder="Ceritakan detail kronologi, lokasi spesifik, atau kondisi yang terjadi secara jelas..."
              placeholderTextColor="#94a3b8"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              className="bg-surface-container-lowest border border-outline-variant rounded-xl px-4 py-3.5 font-body text-base text-on-surface min-h-[100px]"
            />
            <View className="flex-row justify-between items-center mt-1.5">
              <Text className="font-body text-[11px] text-on-surface-variant">Minimal 20 karakter.</Text>
              <Text className="font-body text-[11px] text-on-surface-variant">{description.length}/500</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <View className="bg-white border-t border-outline-variant p-4">
        <TouchableOpacity
          onPress={handleSubmit}
          disabled={mutation.isPending}
          activeOpacity={0.85}
          className="bg-primary py-4 rounded-2xl items-center flex-row justify-center gap-2 shadow-soft"
        >
          {mutation.isPending ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Text className="text-on-primary font-sans text-base font-bold">Lanjut ke Foto & Lokasi</Text>
              <ChevronRight size={20} color="#fff" />
            </>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
