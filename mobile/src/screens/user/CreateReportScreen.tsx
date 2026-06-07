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
  const [step, setStep] = useState(1);

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
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-row items-center px-5 py-3 bg-surface border-b border-outline-variant">
        <TouchableOpacity onPress={() => navigation.goBack()} className="w-10 h-10 items-center justify-center rounded-full">
          <ArrowLeft size={24} color="#444651" />
        </TouchableOpacity>
        <Text className="flex-1 text-center font-sans text-lg font-bold text-on-surface">Buat Laporan Baru</Text>
        <View className="w-10" />
      </View>

      <ScrollView contentContainerClassName="p-5" keyboardShouldPersistTaps="handled">
        <View className="flex-row items-center justify-between mb-2">
          <Text className="font-body text-xs font-semibold text-primary">
            Langkah 1 dari 3
          </Text>
          <Text className="font-body text-xs text-on-surface-variant">
            {step === 1 ? "Verifikasi" : step === 2 ? "Foto & Lokasi" : "Konfirmasi"}
          </Text>
        </View>
        <View className="flex-row gap-2 mb-4">
          <View className="h-2 flex-1 rounded-full bg-primary transition-all duration-300" />
          <View className="h-2 flex-1 rounded-full bg-surface-variant transition-all duration-300" />
          <View className="h-2 flex-1 rounded-full bg-surface-variant transition-all duration-300" />
        </View>

        <View className="bg-surface rounded-xl border border-outline-variant p-5 flex-col gap-5">
          <View className="flex-row gap-3 p-4 bg-surface-container-low rounded-lg border border-primary-fixed">
            <Info size={18} color="#00236f" style={{ marginTop: 2 }} />
            <Text className="font-body text-sm text-on-surface-variant flex-1 leading-relaxed">
              Pastikan data diri dan kategori laporan sesuai untuk mempercepat proses verifikasi oleh instansi terkait.
            </Text>
          </View>

          <View className="flex-col gap-1.5">
            <View className="flex-row items-center justify-between">
              <Text className="font-body text-xs font-semibold text-on-surface">
                Nomor Induk Kependudukan (NIK)
              </Text>
              <View className="flex-row items-center gap-1 bg-tertiary-fixed/30 px-2 py-0.5 rounded">
                <CheckCircle2 size={12} color="#004a31" />
                <Text className="text-tertiary-container text-[10px] uppercase tracking-wider font-semibold">Terverifikasi</Text>
              </View>
            </View>
            <View className="bg-surface-container-lowest border border-outline-variant rounded-lg px-4 py-3">
              <Text className="font-body text-base text-on-surface-variant tracking-widest">3171234567890123</Text>
            </View>
            <Text className="font-body text-[11px] text-outline">Format: 16-digits (Sesuai KTP terdaftar)</Text>
          </View>

          <View className="flex-col gap-1.5">
            <Text className="font-body text-xs font-semibold text-on-surface">Nama Pelapor</Text>
            <View className="flex-row items-center bg-surface-container-lowest border border-outline-variant rounded-lg px-4 py-3">
              <User size={16} color="#757682" style={{ marginRight: 8 }} />
              <Text className="text-on-surface-variant font-body text-base flex-1">Budi Santoso</Text>
            </View>
          </View>

          <View className="h-px bg-outline-variant/40 my-1" />

          <View className="flex-col gap-1.5">
            <Text className="font-body text-xs font-semibold text-on-surface">
              Pilih Kategori <Text className="text-error">*</Text>
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {(categories ?? []).map((cat: any) => (
                <TouchableOpacity
                  key={cat.id}
                  onPress={() => setCategoryId(cat.id)}
                  className={`px-4 py-2.5 rounded-full mr-2 ${categoryId === cat.id ? "bg-primary" : "bg-surface-container border border-outline-variant"}`}
                >
                  <Text className={`font-body text-xs font-semibold ${categoryId === cat.id ? "text-on-primary" : "text-on-surface-variant"}`}>
                    {cat.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <View className="flex-col gap-1.5">
            <Text className="font-body text-xs font-semibold text-on-surface">Judul Laporan <Text className="text-error">*</Text></Text>
            <TextInput
              value={title}
              onChangeText={setTitle}
              placeholder="Contoh: Jalan berlubang di Jl. Sudirman"
              placeholderTextColor="#757682"
              className="bg-surface-container-lowest border border-outline-variant rounded-lg px-4 py-3 font-body text-base text-on-surface"
            />
          </View>

          <View className="flex-col gap-1.5">
            <Text className="font-body text-xs font-semibold text-on-surface">Deskripsi Laporan <Text className="text-error">*</Text></Text>
            <TextInput
              value={description}
              onChangeText={setDescription}
              placeholder="Ceritakan detail kronologi, lokasi spesifik, atau kondisi yang terjadi secara jelas..."
              placeholderTextColor="#757682"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              className="bg-surface-container-lowest border border-outline-variant rounded-lg px-4 py-3 font-body text-base text-on-surface min-h-[100px]"
            />
            <View className="flex-row justify-between items-center mt-1">
              <Text className="font-body text-[11px] text-outline">Minimal 20 karakter.</Text>
              <Text className="font-body text-[11px] text-outline">{description.length}/500</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <View className="bg-surface border-t border-outline-variant/30 p-5">
        <TouchableOpacity
          onPress={handleSubmit}
          disabled={mutation.isPending}
          className="bg-primary py-3.5 rounded-full items-center active:opacity-80 flex-row justify-center gap-2 shadow-md"
        >
          {mutation.isPending ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Text className="text-on-primary font-sans text-sm font-semibold">Lanjut ke Foto & Lokasi</Text>
              <ChevronRight size={20} color="#fff" />
            </>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
