import { View, Text, TextInput, TouchableOpacity, ScrollView, Image, Alert, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeft, FileText, PencilLine, Building2, MapPin, Image as ImageIcon, Camera, Sparkles, CheckCircle, Info, ChevronRight } from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";
import { useState, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createReport } from "../../api/reports";
import { getCategories } from "../../api/categories";
import { getAgencies } from "../../api/agencies";

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
  const [showSuggestions, setShowSuggestions] = useState(false);

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
  const { data: agencies } = useQuery({ queryKey: ["agencies"], queryFn: getAgencies });

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

  const suggestedCategories = (categories ?? []).filter((c: any) =>
    ["jalan", "sampah", "lampu", "infrastruktur"].some(k => c.name.toLowerCase().includes(k))
  ).slice(0, 3);

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
      <View className="flex-row items-center px-5 py-3 bg-surface-container-lowest border-b border-outline-variant/30">
        <TouchableOpacity onPress={() => navigation.goBack()} className="p-1">
          <ArrowLeft size={24} color="#0b1c30" />
        </TouchableOpacity>
        <Text className="flex-1 text-lg font-bold text-on-surface ml-3 font-sans">Buat Laporan Baru</Text>
      </View>

      <ScrollView contentContainerClassName="p-5" keyboardShouldPersistTaps="handled">
        <View className="flex-row gap-2 mb-4">
          <View className="h-2 flex-1 rounded-full bg-primary" />
          <View className="h-2 flex-1 rounded-full bg-surface-variant" />
          <View className="h-2 flex-1 rounded-full bg-surface-variant" />
        </View>

        <View className="bg-surface-container-lowest rounded-xl border border-outline-variant p-4 mb-4">
          <View className="flex-row gap-2 p-3 bg-surface-container-low rounded-lg border border-primary-fixed mb-4">
            <Info size={18} color="#00236f" style={{ marginTop: 2 }} />
            <Text className="text-xs text-on-surface-variant flex-1">
              Pastikan data diri dan kategori laporan sesuai untuk mempercepat proses verifikasi.
            </Text>
          </View>

          <View className="mb-3">
            <Text className="text-xs font-bold text-on-surface mb-1.5">
              NIK <Text className="bg-tertiary-fixed/30 text-tertiary-container px-1.5 py-0.5 rounded text-[9px] uppercase overflow-hidden">Terverifikasi</Text>
            </Text>
            <TextInput
              value="3171234567890123"
              editable={false}
              className="bg-surface-container-low border border-outline-variant rounded-lg px-4 py-3 text-on-surface-variant tracking-widest"
            />
          </View>

          <View className="mb-3">
            <Text className="text-xs font-bold text-on-surface mb-1.5">Nama Pelapor</Text>
            <View className="flex-row items-center bg-surface-container-low border border-outline-variant rounded-lg px-4 py-3">
              <View className="mr-2">
                <View style={{ width: 16, height: 16 }} />
              </View>
              <Text className="text-on-surface-variant flex-1">Budi Santoso</Text>
            </View>
          </View>

          <View className="h-px bg-outline-variant/40 my-2" />

          <View className="mb-3">
            <Text className="text-xs font-bold text-on-surface mb-1.5">Kategori <Text className="text-error">*</Text></Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {(categories ?? []).map((cat: any) => (
                <TouchableOpacity
                  key={cat.id}
                  onPress={() => setCategoryId(cat.id)}
                  className={`px-4 py-2.5 rounded-full mr-2 ${categoryId === cat.id ? "bg-primary" : "bg-surface-container"}`}
                >
                  <Text className={`text-xs font-bold ${categoryId === cat.id ? "text-on-primary" : "text-on-surface"}`}>
                    {cat.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            {!categoryId && suggestedCategories.length > 0 && (
              <View className="mt-2">
                <TouchableOpacity onPress={() => setShowSuggestions(!showSuggestions)} className="flex-row items-center gap-1 mb-1">
                  <Sparkles size={14} color="#00236f" />
                  <Text className="text-xs font-semibold text-primary">Saran untukmu</Text>
                </TouchableOpacity>
                {showSuggestions && (
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {suggestedCategories.map((cat: any) => (
                      <TouchableOpacity
                        key={cat.id}
                        onPress={() => { setCategoryId(cat.id); setShowSuggestions(false); }}
                        className="flex-row items-center gap-1 px-3 py-1.5 rounded-full bg-primary-fixed mr-2"
                      >
                        <Sparkles size={12} color="#00236f" />
                        <Text className="text-xs font-semibold text-primary">{cat.name}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                )}
              </View>
            )}
          </View>

          <View className="mb-3">
            <Text className="text-xs font-bold text-on-surface mb-1.5">Judul Laporan <Text className="text-error">*</Text></Text>
            <TextInput
              value={title}
              onChangeText={setTitle}
              placeholder="Contoh: Jalan berlubang di Jl. Sudirman"
              placeholderTextColor="#757682"
              className="bg-surface-container-lowest border border-outline-variant rounded-lg px-4 py-3 text-on-surface"
            />
          </View>

          <View className="mb-4">
            <Text className="text-xs font-bold text-on-surface mb-1.5">Deskripsi Laporan <Text className="text-error">*</Text></Text>
            <TextInput
              value={description}
              onChangeText={setDescription}
              placeholder="Ceritakan detail kronologi, lokasi spesifik..."
              placeholderTextColor="#757682"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              className="bg-surface-container-lowest border border-outline-variant rounded-lg px-4 py-3 text-on-surface min-h-[100px]"
            />
            <Text className="text-[10px] text-outline text-right mt-1">{description.length}/500</Text>
          </View>

          <View className="mb-4">
            <Text className="text-xs font-bold text-on-surface mb-1.5 flex-row items-center gap-1">
              <Camera size={14} color="#444651" /> Foto <Text className="font-normal text-on-surface-variant">(opsional)</Text>
            </Text>
            <TouchableOpacity onPress={() => {}} className="border-2 border-dashed border-outline-variant rounded-lg p-4 items-center bg-surface-container-low">
              {image ? (
                <Image source={{ uri: image }} className="w-full h-40 rounded-lg" resizeMode="cover" />
              ) : (
                <>
                  <ImageIcon size={28} color="#757682" />
                  <Text className="text-xs text-on-surface-variant mt-1">Max 5MB, JPEG/PNG</Text>
                </>
              )}
            </TouchableOpacity>
          </View>

          <View className="mb-4">
            <Text className="text-xs font-bold text-on-surface mb-1.5 flex-row items-center gap-1">
              <MapPin size={14} color="#444651" /> Lokasi <Text className="text-error">*</Text>
            </Text>
            <View className="flex-row gap-2 mb-2">
              <TextInput
                value={latitude}
                onChangeText={setLatitude}
                placeholder="Latitude"
                placeholderTextColor="#757682"
                keyboardType="decimal-pad"
                className="flex-1 bg-surface-container-lowest border border-outline-variant rounded-lg px-4 py-3 text-on-surface"
              />
              <TextInput
                value={longitude}
                onChangeText={setLongitude}
                placeholder="Longitude"
                placeholderTextColor="#757682"
                keyboardType="decimal-pad"
                className="flex-1 bg-surface-container-lowest border border-outline-variant rounded-lg px-4 py-3 text-on-surface"
              />
            </View>
            <TextInput
              value={address}
              onChangeText={setAddress}
              placeholder="Alamat lokasi (opsional)"
              placeholderTextColor="#757682"
              className="bg-surface-container-lowest border border-outline-variant rounded-lg px-4 py-3 text-on-surface"
            />
          </View>

          <TouchableOpacity
            onPress={handleSubmit}
            disabled={mutation.isPending}
            className="bg-primary py-3.5 rounded-full items-center shadow-md active:opacity-80 flex-row justify-center gap-2"
          >
            {mutation.isPending ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Text className="text-on-primary font-bold">Lanjut ke Foto & Lokasi</Text>
                <ChevronRight size={18} color="#fff" />
              </>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
