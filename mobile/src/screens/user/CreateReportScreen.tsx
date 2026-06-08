import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Modal,
  Pressable,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { SafeAreaView } from "react-native-safe-area-context";
import { Info, MapPin, Camera, Image as ImageIcon, X, ChevronDown, ArrowRight, User, BadgeCheck } from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createReport } from "../../api/reports";
import { getCategories } from "../../api/categories";
import { getAgencies } from "../../api/agencies";
import { useAuth } from "../../context/AuthContext";
import { StitchHeader } from "../../components/ui/StitchHeader";
import { StepIndicator } from "../../components/ui/StepIndicator";
import { colors } from "../../theme";

const STEPS = [{ id: 1 }, { id: 2 }, { id: 3 }];

export default function CreateReportScreen() {
  const navigation = useNavigation();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [step, setStep] = useState(1);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [categoryLabel, setCategoryLabel] = useState("");
  const [agencyId, setAgencyId] = useState("");
  const [agencyLabel, setAgencyLabel] = useState("");
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [address, setAddress] = useState("");
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [pickerOpen, setPickerOpen] = useState<"category" | "agency" | null>(null);

  const { data: categoriesData } = useQuery({ queryKey: ["categories"], queryFn: getCategories });
  const { data: agenciesData } = useQuery({ queryKey: ["agencies"], queryFn: getAgencies });
  const categories = categoriesData?.data ?? [];
  const agencies = agenciesData?.data ?? [];

  const reportMut = useMutation({
    mutationFn: async () => {
      const fd = new FormData();
      fd.append("title", title);
      fd.append("description", description);
      fd.append("categoryId", categoryId);
      fd.append("latitude", String(latitude));
      fd.append("longitude", String(longitude));
      fd.append("address", address);
      if (agencyId) fd.append("agencyId", agencyId);
      if (imageUri) {
        const filename = imageUri.split("/").pop() || "photo.jpg";
        const ext = filename.split(".").pop() || "jpg";
        fd.append("image", { uri: imageUri, name: filename, type: `image/${ext}` } as any);
      }
      return createReport(fd);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-reports-dashboard"] });
      Alert.alert("Berhasil", "Laporan berhasil dikirim.", [{ text: "OK", onPress: () => navigation.goBack() }]);
    },
    onError: (err: any) => {
      Alert.alert("Gagal", err?.response?.data?.message || "Gagal mengirim laporan.");
    },
  });

  async function pickImage() {
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.8 });
    if (!result.canceled && result.assets?.[0]) setImageUri(result.assets[0].uri);
  }

  async function takePhoto() {
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (!perm.granted) { Alert.alert("Izin Diperlukan", "Akses kamera diperlukan."); return; }
    const result = await ImagePicker.launchCameraAsync({ quality: 0.8 });
    if (!result.canceled && result.assets?.[0]) setImageUri(result.assets[0].uri);
  }

  function useLocation() {
    setLatitude(-6.2);
    setLongitude(106.816);
    setAddress("Jakarta, Indonesia");
  }

  function nextStep() {
    if (step === 1) {
      if (!categoryId || !title.trim() || description.length < 20) {
        Alert.alert("Perhatian", "Lengkapi judul, kategori, dan deskripsi (min. 20 karakter).");
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!latitude || !longitude) {
        Alert.alert("Perhatian", "Pilih lokasi kejadian terlebih dahulu.");
        return;
      }
      setStep(3);
    }
  }

  const fieldCls = "bg-surface-container-lowest border border-outline-variant rounded-lg px-4 py-3 font-body text-sm text-on-surface";

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <StitchHeader variant="flow" title="Buat Laporan Baru" onBack={() => navigation.goBack()} />

      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1">
        <ScrollView className="flex-1 px-4 pt-4" contentContainerClassName="pb-32" keyboardShouldPersistTaps="handled">
          <StepIndicator
            steps={STEPS}
            current={step}
            subtitle={step === 1 ? "Verifikasi" : step === 2 ? "Foto & Lokasi" : "Kirim"}
          />

          <View className="bg-surface rounded-xl border border-outline-variant p-5 gap-5 shadow-sm">
            <View className="flex-row gap-3 p-4 bg-surface-container-low rounded-lg border border-primary-fixed">
              <Info size={18} color={colors.primary} />
              <Text className="font-body text-sm text-on-surface-variant flex-1 leading-relaxed">
                Pastikan data diri dan kategori laporan sesuai untuk mempercepat proses verifikasi oleh instansi terkait.
              </Text>
            </View>

            {step === 1 && (
              <>
                <View>
                  <View className="flex-row justify-between items-center mb-1.5">
                    <Text className="font-body text-xs font-semibold text-on-surface">NIK</Text>
                    <View className="flex-row items-center gap-1 bg-tertiary-fixed/30 px-2 py-0.5 rounded">
                      <BadgeCheck size={12} color={colors.onTertiaryFixed} />
                      <Text className="font-body text-[10px] text-tertiary-container uppercase">Terverifikasi</Text>
                    </View>
                  </View>
                  <TextInput value={user?.nik || "—"} editable={false} className={`${fieldCls} text-on-surface-variant tracking-widest`} />
                </View>

                <View>
                  <Text className="font-body text-xs font-semibold text-on-surface mb-1.5">Nama Pelapor</Text>
                  <View className="relative">
                    <User size={18} color={colors.onSurfaceVariant} style={{ position: "absolute", left: 12, top: 14, zIndex: 1 }} />
                    <TextInput value={user?.name || ""} editable={false} className={`${fieldCls} pl-10 text-on-surface-variant`} />
                  </View>
                </View>

                <View className="h-px bg-outline-variant/40" />

                <View>
                  <Text className="font-body text-xs font-semibold text-on-surface mb-1.5">Judul Laporan <Text className="text-error">*</Text></Text>
                  <TextInput value={title} onChangeText={setTitle} placeholder="Contoh: Jalan berlubang di Jl. Sudirman" placeholderTextColor="#94a3b8" className={fieldCls} />
                </View>

                <View>
                  <Text className="font-body text-xs font-semibold text-on-surface mb-1.5">Pilih Kategori <Text className="text-error">*</Text></Text>
                  <TouchableOpacity onPress={() => setPickerOpen("category")} className={`${fieldCls} flex-row items-center justify-between`}>
                    <Text className={categoryId ? "text-on-surface" : "text-on-surface-variant"}>{categoryLabel || "Pilih kategori yang paling sesuai..."}</Text>
                    <ChevronDown size={18} color={colors.onSurfaceVariant} />
                  </TouchableOpacity>
                </View>

                <View>
                  <Text className="font-body text-xs font-semibold text-on-surface mb-1.5">Deskripsi Laporan <Text className="text-error">*</Text></Text>
                  <TextInput value={description} onChangeText={setDescription} placeholder="Ceritakan detail kronologi, lokasi spesifik..." multiline numberOfLines={4} textAlignVertical="top" maxLength={500} placeholderTextColor="#94a3b8" className={`${fieldCls} min-h-[100px]`} />
                  <View className="flex-row justify-between mt-1">
                    <Text className="font-body text-[11px] text-outline">Minimal 20 karakter.</Text>
                    <Text className="font-body text-[11px] text-outline">{description.length}/500</Text>
                  </View>
                </View>
              </>
            )}

            {step === 2 && (
              <>
                <View>
                  <Text className="font-body text-xs font-semibold text-on-surface mb-1.5">Instansi Tujuan (opsional)</Text>
                  <TouchableOpacity onPress={() => setPickerOpen("agency")} className={`${fieldCls} flex-row items-center justify-between`}>
                    <Text className={agencyId ? "text-on-surface" : "text-on-surface-variant"}>{agencyLabel || "Pilih instansi..."}</Text>
                    <ChevronDown size={18} color={colors.onSurfaceVariant} />
                  </TouchableOpacity>
                </View>

                <View>
                  <Text className="font-body text-xs font-semibold text-on-surface mb-1.5">Lokasi Kejadian <Text className="text-error">*</Text></Text>
                  <TouchableOpacity onPress={useLocation} className="flex-row items-center gap-3 bg-surface-container-low border border-outline-variant rounded-lg px-4 py-3.5">
                    <MapPin size={18} color={colors.primary} />
                    <View className="flex-1">
                      <Text className="font-body text-sm font-bold text-primary">{latitude ? `${latitude.toFixed(4)}, ${longitude!.toFixed(4)}` : "Atur Lokasi"}</Text>
                      {address ? <Text className="font-body text-xs text-on-surface-variant mt-0.5">{address}</Text> : null}
                    </View>
                    <Text className="font-body text-xs font-bold text-primary">Pilih</Text>
                  </TouchableOpacity>
                </View>

                <View>
                  <Text className="font-body text-xs font-semibold text-on-surface mb-1.5">Foto Bukti (opsional)</Text>
                  {imageUri ? (
                    <View className="relative">
                      <Image source={{ uri: imageUri }} className="w-full h-48 rounded-lg" resizeMode="cover" />
                      <TouchableOpacity onPress={() => setImageUri(null)} className="absolute top-2 right-2 w-8 h-8 bg-black/60 rounded-full items-center justify-center">
                        <X size={16} color="#fff" />
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <View className="flex-row gap-3">
                      <TouchableOpacity onPress={takePhoto} className="flex-1 flex-row items-center justify-center gap-2 border border-dashed border-outline-variant rounded-lg py-4 bg-surface-container-low">
                        <Camera size={18} color={colors.onSurfaceVariant} />
                        <Text className="font-body text-sm text-on-surface-variant">Kamera</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={pickImage} className="flex-1 flex-row items-center justify-center gap-2 border border-dashed border-outline-variant rounded-lg py-4 bg-surface-container-low">
                        <ImageIcon size={18} color={colors.onSurfaceVariant} />
                        <Text className="font-body text-sm text-on-surface-variant">Galeri</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              </>
            )}

            {step === 3 && (
              <View className="gap-3">
                <Text className="font-sans text-lg font-bold text-on-surface">Ringkasan Laporan</Text>
                <SummaryRow label="Judul" value={title} />
                <SummaryRow label="Kategori" value={categoryLabel} />
                <SummaryRow label="Lokasi" value={address || (latitude ? `${latitude}, ${longitude}` : "—")} />
                <SummaryRow label="Deskripsi" value={description} />
                {imageUri && <Text className="font-body text-xs text-primary">✓ Foto terlampir</Text>}
              </View>
            )}
          </View>
        </ScrollView>

        <View className="border-t border-outline-variant/30 p-4 bg-surface">
          <TouchableOpacity
            onPress={step < 3 ? nextStep : () => reportMut.mutate()}
            disabled={reportMut.isPending}
            className="bg-primary py-3.5 rounded-full flex-row items-center justify-center gap-2"
            style={{ opacity: reportMut.isPending ? 0.7 : 1 }}
          >
            <Text className="font-body text-sm font-semibold text-on-primary">
              {reportMut.isPending ? "Mengirim..." : step < 3 ? (step === 1 ? "Lanjut ke Foto & Lokasi" : "Lanjut ke Ringkasan") : "Kirim Laporan"}
            </Text>
            {!reportMut.isPending && <ArrowRight size={20} color="#fff" />}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      <PickerModal visible={pickerOpen === "category"} title="Pilih Kategori" onClose={() => setPickerOpen(null)}
        items={categories.map((c: any) => ({ id: c.id, label: c.name, selected: categoryId === c.id, onSelect: () => { setCategoryId(c.id); setCategoryLabel(c.name); setPickerOpen(null); }}))} />
      <PickerModal visible={pickerOpen === "agency"} title="Pilih Instansi" onClose={() => setPickerOpen(null)} skipLabel="Lewati" onSkip={() => { setAgencyId(""); setAgencyLabel(""); setPickerOpen(null); }}
        items={agencies.map((a: any) => ({ id: a.id, label: a.name, selected: agencyId === a.id, onSelect: () => { setAgencyId(a.id); setAgencyLabel(a.name); setPickerOpen(null); }}))} />
    </SafeAreaView>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <View className="border-b border-outline-variant/40 pb-2">
      <Text className="font-body text-[11px] text-outline uppercase">{label}</Text>
      <Text className="font-body text-sm text-on-surface mt-0.5">{value}</Text>
    </View>
  );
}

function PickerModal({ visible, title, onClose, items, skipLabel, onSkip }: any) {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <Pressable className="flex-1 bg-black/50 justify-end" onPress={onClose}>
        <Pressable className="bg-surface rounded-t-3xl p-5 max-h-[70%]" onPress={(e) => e.stopPropagation()}>
          <View className="w-10 h-1 bg-outline-variant rounded-full self-center mb-4" />
          <Text className="font-sans text-lg font-bold text-on-surface mb-4">{title}</Text>
          {skipLabel && onSkip && (
            <TouchableOpacity onPress={onSkip} className="py-3 mb-2">
              <Text className="font-body text-base text-on-surface-variant">{skipLabel}</Text>
            </TouchableOpacity>
          )}
          <ScrollView>
            {items.map((item: any) => (
              <TouchableOpacity key={item.id} onPress={item.onSelect} className={`px-4 py-3.5 rounded-lg mb-1 ${item.selected ? "bg-primary-fixed" : ""}`}>
                <Text className={`font-body text-base ${item.selected ? "font-bold text-primary" : "text-on-surface"}`}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
