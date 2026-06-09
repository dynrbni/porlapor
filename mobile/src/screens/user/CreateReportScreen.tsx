import { useState, useEffect } from "react";
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
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import MapView, { Marker } from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";
import { Info, MapPin, Camera, Image as ImageIcon, X, ChevronDown, ArrowRight, User, BadgeCheck, FileText, Type, Tags, AlignLeft, Building } from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createReport } from "../../api/reports";
import { getCategories } from "../../api/categories";
import { getAgencies } from "../../api/agencies";
import { useAuth } from "../../context/AuthContext";
import { StitchHeader } from "../../components/ui/StitchHeader";
import { StepIndicator } from "../../components/ui/StepIndicator";
import { colors } from "../../theme";

const STEPS = [{ id: 1, label: "" }, { id: 2, label: "" }, { id: 3, label: "" }];

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

  const [mapVisible, setMapVisible] = useState(false);
  const [tempLat, setTempLat] = useState<number | null>(null);
  const [tempLng, setTempLng] = useState<number | null>(null);
  const [tempAddress, setTempAddress] = useState("");
  const [isLoadingAddress, setIsLoadingAddress] = useState(false);

  const { data: categoriesData } = useQuery({ queryKey: ["categories"], queryFn: getCategories });
  const categories = categoriesData?.data ?? [];
  const [agencies, setAgencies] = useState<any[]>([]);

  useEffect(() => {
    getAgencies().then(res => setAgencies(res.data)).catch(console.error);
  }, []);

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
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.8 });
    if (!result.canceled && result.assets?.[0]) setImageUri(result.assets[0].uri);
  }

  async function takePhoto() {
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (!perm.granted) { Alert.alert("Izin Diperlukan", "Akses kamera diperlukan."); return; }
    const result = await ImagePicker.launchCameraAsync({ quality: 0.8 });
    if (!result.canceled && result.assets?.[0]) setImageUri(result.assets[0].uri);
  }

  const reverseGeocode = async (lat: number, lng: number) => {
    setIsLoadingAddress(true);
    try {
      const result = await Location.reverseGeocodeAsync({ latitude: lat, longitude: lng });
      if (result.length > 0) {
        const place = result[0];
        const addr = [place.street, place.subregion, place.city, place.region].filter(Boolean).join(", ");
        setTempAddress(addr || "Lokasi tidak diketahui");
      }
    } catch (e) {
      console.error(e);
      setTempAddress("Gagal mendapatkan alamat");
    } finally {
      setIsLoadingAddress(false);
    }
  };

  async function useLocation() {
    setMapVisible(true);
    if (!latitude || !longitude) {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Izin Ditolak", "Akses lokasi diperlukan untuk menentukan titik.");
        setMapVisible(false);
        return;
      }
      try {
        const loc = await Location.getCurrentPositionAsync({});
        setTempLat(loc.coords.latitude);
        setTempLng(loc.coords.longitude);
        reverseGeocode(loc.coords.latitude, loc.coords.longitude);
      } catch (err) {
        Alert.alert("Error", "Gagal mendapatkan lokasi saat ini.");
        setMapVisible(false);
      }
    } else {
      setTempLat(latitude);
      setTempLng(longitude);
      setTempAddress(address);
    }
  }

  const confirmLocation = () => {
    setLatitude(tempLat);
    setLongitude(tempLng);
    setAddress(tempAddress);
    setMapVisible(false);
  };

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

  const fieldCls = "bg-surface-container-low border border-outline-variant/50 rounded-2xl px-5 h-14 font-body text-sm text-on-surface";
  const fieldMultilneCls = "bg-surface-container-low border border-outline-variant/50 rounded-2xl px-5 py-4 font-body text-sm text-on-surface min-h-[120px]";

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <StitchHeader variant="flow" title="Buat Laporan Baru" onBack={() => navigation.goBack()} />

      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1">
        <ScrollView className="flex-1 px-5 pt-5" contentContainerClassName="pb-32" keyboardShouldPersistTaps="handled">
          <View className="mb-4">
            <StepIndicator
              steps={STEPS}
              current={step}
              subtitle={step === 1 ? "Detail Laporan" : step === 2 ? "Foto & Lokasi" : "Kirim"}
            />
          </View>

          {/* Main Card */}
          <View
            className="bg-surface-container-lowest rounded-[28px] border border-outline-variant/30 p-7 gap-6"
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.05,
              shadowRadius: 16,
              elevation: 4,
            }}
          >
            {/* Info Banner */}
            <View className="flex-row gap-3 p-4 bg-primary/5 rounded-2xl border border-primary/20">
              <Info size={20} color={colors.primary} />
              <Text className="font-body text-[13px] text-on-surface-variant flex-1 leading-relaxed">
                Pastikan data diri dan kategori laporan sesuai untuk mempercepat proses verifikasi oleh instansi terkait.
              </Text>
            </View>

            {step === 1 && (
              <>
                <View>
                  <View className="flex-row justify-between items-center mb-2.5">
                    <Text className="font-body text-sm font-bold text-on-surface ml-1">NIK Pelapor</Text>
                    <View className="flex-row items-center gap-1 bg-tertiary-fixed/30 px-2.5 py-1 rounded-lg">
                      <BadgeCheck size={12} color={colors.onTertiaryFixed} />
                      <Text className="font-sans text-[10px] font-bold text-tertiary-container uppercase tracking-wider">Terverifikasi</Text>
                    </View>
                  </View>
                  <TextInput value={user?.nik || "—"} editable={false} className={`${fieldCls} text-on-surface-variant tracking-widest`} />
                </View>

                <View>
                  <Text className="font-body text-sm font-bold text-on-surface mb-2.5 ml-1">Nama Pelapor</Text>
                  <View className="relative">
                    <User size={20} color={colors.outline} style={{ position: "absolute", left: 16, top: 16, zIndex: 1 }} />
                    <TextInput value={user?.name || ""} editable={false} className={`${fieldCls} pl-12 text-on-surface-variant font-semibold`} />
                  </View>
                </View>

                <View className="h-px bg-outline-variant/50 my-2" />

                <Field label="Judul Laporan" required icon={Type}>
                  <TextInput value={title} onChangeText={setTitle} placeholder="Contoh: Jalan berlubang di Jl. Sudirman" placeholderTextColor="#94a3b8" className={`${fieldCls} pl-12`} />
                </Field>

                <Field label="Kategori Laporan" required icon={Tags}>
                  <TouchableOpacity onPress={() => setPickerOpen("category")} activeOpacity={0.7} className={`${fieldCls} pl-12 flex-row items-center justify-between`}>
                    <Text className={categoryId ? "text-on-surface font-sans text-[15px]" : "text-on-surface-variant font-body text-sm"}>{categoryLabel || "Pilih kategori..."}</Text>
                    <ChevronDown size={20} color={colors.outline} />
                  </TouchableOpacity>
                </Field>

                <Field label="Deskripsi Kejadian" required icon={AlignLeft}>
                  <TextInput value={description} onChangeText={setDescription} placeholder="Ceritakan detail kronologi, lokasi spesifik..." multiline numberOfLines={4} textAlignVertical="top" maxLength={500} placeholderTextColor="#94a3b8" className={`${fieldMultilneCls} pl-12`} />
                  <View className="flex-row justify-between mt-2 ml-1">
                    <Text className="font-body text-[11px] text-on-surface-variant font-medium">Minimal 20 karakter.</Text>
                    <Text className="font-body text-[11px] text-on-surface-variant font-medium">{description.length}/500</Text>
                  </View>
                </Field>
              </>
            )}

            {step === 2 && (
              <>
                <Field label="Instansi Tujuan" icon={Building} optional>
                  <TouchableOpacity onPress={() => setPickerOpen("agency")} activeOpacity={0.7} className={`${fieldCls} pl-12 flex-row items-center justify-between`}>
                    <Text className={agencyId ? "text-on-surface font-sans text-[15px]" : "text-on-surface-variant font-body text-sm"}>{agencyLabel || "Pilih instansi tujuan..."}</Text>
                    <ChevronDown size={20} color={colors.outline} />
                  </TouchableOpacity>
                </Field>

                <View>
                  <Text className="font-body text-sm font-bold text-on-surface mb-2.5 ml-1">Lokasi Kejadian <Text className="text-error">*</Text></Text>
                  <TouchableOpacity
                    onPress={useLocation}
                    activeOpacity={0.7}
                    className="flex-row items-center gap-4 bg-surface-container-low border border-outline-variant/50 rounded-2xl px-5 py-4"
                  >
                    <View className="w-10 h-10 bg-primary/10 rounded-full items-center justify-center">
                      <MapPin size={20} color={colors.primary} />
                    </View>
                    <View className="flex-1">
                      <Text className="font-sans text-sm font-bold text-primary">{latitude ? `${latitude.toFixed(4)}, ${longitude!.toFixed(4)}` : "Tentukan Lokasi"}</Text>
                      {address ? <Text className="font-body text-[13px] text-on-surface-variant mt-1 leading-relaxed">{address}</Text> : null}
                    </View>
                    <Text className="font-sans text-xs font-bold text-primary tracking-wide">PILIH</Text>
                  </TouchableOpacity>
                </View>

                <View>
                  <Text className="font-body text-sm font-bold text-on-surface mb-2.5 ml-1">Foto Bukti <Text className="text-on-surface-variant font-normal">(opsional)</Text></Text>
                  {imageUri ? (
                    <View className="relative">
                      <Image source={{ uri: imageUri }} className="w-full h-56 rounded-2xl border border-outline-variant/50" resizeMode="cover" />
                      <TouchableOpacity onPress={() => setImageUri(null)} className="absolute top-4 right-4 w-9 h-9 bg-black/60 rounded-full items-center justify-center" activeOpacity={0.7}>
                        <X size={18} color="#fff" />
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <View className="flex-row gap-4">
                      <TouchableOpacity onPress={takePhoto} activeOpacity={0.7} className="flex-1 items-center justify-center gap-3 border-2 border-dashed border-outline-variant/50 rounded-2xl py-6 bg-surface-container-low">
                        <View className="w-12 h-12 bg-surface-container rounded-full items-center justify-center">
                          <Camera size={24} color={colors.onSurfaceVariant} />
                        </View>
                        <Text className="font-sans text-[13px] font-bold text-on-surface-variant tracking-wide">Kamera</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={pickImage} activeOpacity={0.7} className="flex-1 items-center justify-center gap-3 border-2 border-dashed border-outline-variant/50 rounded-2xl py-6 bg-surface-container-low">
                        <View className="w-12 h-12 bg-surface-container rounded-full items-center justify-center">
                          <ImageIcon size={24} color={colors.onSurfaceVariant} />
                        </View>
                        <Text className="font-sans text-[13px] font-bold text-on-surface-variant tracking-wide">Galeri</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              </>
            )}

            {step === 3 && (
              <View className="gap-5">
                <View className="flex-row items-center gap-3 mb-2">
                  <View className="w-10 h-10 bg-primary/10 rounded-full items-center justify-center">
                    <FileText size={18} color={colors.primary} />
                  </View>
                  <Text className="font-sans text-xl font-bold text-on-surface">Konfirmasi Laporan</Text>
                </View>
                
                <View className="bg-surface-container-low rounded-2xl border border-outline-variant/50 p-5 gap-4">
                  <SummaryRow label="Judul" value={title} />
                  <SummaryRow label="Kategori" value={categoryLabel} />
                  <SummaryRow label="Instansi Tujuan" value={agencyLabel || "Tidak Spesifik"} />
                  <SummaryRow label="Lokasi" value={address || (latitude ? `${latitude}, ${longitude}` : "—")} />
                  <SummaryRow label="Deskripsi" value={description} />
                  {imageUri && (
                    <View className="mt-2">
                      <Text className="font-sans text-[11px] text-outline uppercase font-bold tracking-wider mb-2">Foto Bukti Terlampir</Text>
                      <Image source={{ uri: imageUri }} className="w-full h-48 rounded-2xl border border-outline-variant/30" resizeMode="cover" />
                    </View>
                  )}
                </View>
              </View>
            )}
          </View>
        </ScrollView>

        {/* Bottom Action */}
        <View
          className="border-t border-outline-variant/30 px-6 py-5 bg-surface-container-lowest"
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: -4 },
            shadowOpacity: 0.05,
            shadowRadius: 12,
            elevation: 8,
          }}
        >
          <View className="flex-row gap-3">
            {step > 1 && (
              <TouchableOpacity
                onPress={() => setStep(step - 1)}
                activeOpacity={0.85}
                className="w-14 h-14 border-2 border-outline-variant/50 rounded-full items-center justify-center bg-transparent"
              >
                <ChevronDown size={24} color={colors.onSurfaceVariant} style={{ transform: [{ rotate: "90deg" }] }} />
              </TouchableOpacity>
            )}
            
            <TouchableOpacity
              onPress={step < 3 ? nextStep : () => reportMut.mutate()}
              disabled={reportMut.isPending}
              activeOpacity={0.85}
              className="flex-1 bg-primary h-14 rounded-full flex-row items-center justify-center gap-2"
              style={{
                opacity: reportMut.isPending ? 0.7 : 1,
                shadowColor: colors.primary,
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.3,
                shadowRadius: 16,
                elevation: 8,
              }}
            >
              <Text className="font-sans text-[15px] font-bold text-white tracking-wide">
                {reportMut.isPending ? "Mengirim..." : step < 3 ? "Lanjutkan" : "Kirim Laporan Sekarang"}
              </Text>
              {!reportMut.isPending && step < 3 && <ArrowRight size={18} color="#fff" />}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>

      <PickerModal visible={pickerOpen === "category"} title="Pilih Kategori Laporan" onClose={() => setPickerOpen(null)}
        items={categories.map((c: any) => ({ id: c.id, label: c.name, selected: categoryId === c.id, onSelect: () => { setCategoryId(c.id); setCategoryLabel(c.name); setPickerOpen(null); }}))} />
      <PickerModal visible={pickerOpen === "agency"} title="Pilih Instansi Tujuan" onClose={() => setPickerOpen(null)} skipLabel="Lewati Pilihan Ini" onSkip={() => { setAgencyId(""); setAgencyLabel(""); setPickerOpen(null); }}
        items={agencies.map((a: any) => ({ id: a.id, label: a.name, selected: agencyId === a.id, onSelect: () => { setAgencyId(a.id); setAgencyLabel(a.name); setPickerOpen(null); }}))} />

      {/* Map Picker Modal */}
      <Modal visible={mapVisible} animationType="slide" transparent={false}>
        <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
          <StitchHeader variant="flow" title="Tentukan Lokasi" onBack={() => setMapVisible(false)} />
          <View className="flex-1 relative">
            {tempLat && tempLng ? (
              <MapView
                style={{ flex: 1 }}
                initialRegion={{
                  latitude: tempLat,
                  longitude: tempLng,
                  latitudeDelta: 0.005,
                  longitudeDelta: 0.005,
                }}
                onPress={(e) => {
                  const { latitude: lat, longitude: lng } = e.nativeEvent.coordinate;
                  setTempLat(lat);
                  setTempLng(lng);
                  reverseGeocode(lat, lng);
                }}
              >
                <Marker
                  coordinate={{ latitude: tempLat, longitude: tempLng }}
                  draggable
                  onDragEnd={(e) => {
                    const { latitude: lat, longitude: lng } = e.nativeEvent.coordinate;
                    setTempLat(lat);
                    setTempLng(lng);
                    reverseGeocode(lat, lng);
                  }}
                />
              </MapView>
            ) : (
              <View className="flex-1 items-center justify-center bg-surface-container-low">
                <ActivityIndicator size="large" color={colors.primary} />
                <Text className="font-sans text-sm text-on-surface-variant mt-4 font-semibold">Mendapatkan lokasi...</Text>
              </View>
            )}

            {/* Floating Address Box */}
            <View 
              className="absolute bottom-32 left-5 right-5 bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/30" 
              style={{ elevation: 8, shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12 }}
            >
              <Text className="font-sans text-[11px] text-primary uppercase font-bold tracking-wider mb-1.5">Lokasi Terpilih</Text>
              <Text className="font-body text-sm font-semibold text-on-surface leading-relaxed">
                {isLoadingAddress ? "Mencari alamat..." : tempAddress || "Pilih lokasi di peta"}
              </Text>
            </View>

            {/* Confirm Button */}
            <View className="absolute bottom-10 left-5 right-5">
              <TouchableOpacity
                onPress={confirmLocation}
                activeOpacity={0.9}
                disabled={!tempLat}
                className="bg-primary h-14 rounded-full flex-row items-center justify-center"
                style={{ elevation: 8, shadowColor: colors.primary, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.3, shadowRadius: 12, opacity: tempLat ? 1 : 0.5 }}
              >
                <Text className="font-sans text-[15px] font-bold text-white tracking-wide">Konfirmasi Lokasi</Text>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <View className="border-b border-outline-variant/40 pb-3">
      <Text className="font-sans text-[11px] text-outline uppercase font-bold tracking-wider">{label}</Text>
      <Text className="font-body text-sm text-on-surface mt-1.5 leading-relaxed font-medium">{value}</Text>
    </View>
  );
}

function PickerModal({ visible, title, onClose, items, skipLabel, onSkip }: any) {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <Pressable className="flex-1 bg-black/60 justify-end" onPress={onClose}>
        <Pressable className="bg-surface-container-lowest rounded-t-[32px] p-7 max-h-[75%]" onPress={(e) => e.stopPropagation()}>
          <View className="w-12 h-1.5 bg-outline-variant/50 rounded-full self-center mb-6" />
          <Text className="font-sans text-xl font-bold text-on-surface mb-6 tracking-tight">{title}</Text>
          {skipLabel && onSkip && (
            <TouchableOpacity onPress={onSkip} className="py-3 mb-3 border border-outline-variant/50 rounded-xl items-center bg-surface-container-low" activeOpacity={0.7}>
              <Text className="font-sans text-sm font-bold text-on-surface-variant tracking-wide">{skipLabel}</Text>
            </TouchableOpacity>
          )}
          <ScrollView showsVerticalScrollIndicator={false}>
            {items.map((item: any) => (
              <TouchableOpacity
                key={item.id}
                onPress={item.onSelect}
                activeOpacity={0.7}
                className={`px-5 py-4 rounded-2xl mb-2 border ${item.selected ? "bg-primary/10 border-primary" : "bg-surface-container-low border-transparent"}`}
              >
                <Text className={`font-sans text-[15px] ${item.selected ? "font-bold text-primary" : "font-medium text-on-surface"}`}>{item.label}</Text>
              </TouchableOpacity>
            ))}
            <View className="h-8" />
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

function Field({
  label,
  required,
  optional,
  icon: Icon,
  children,
}: {
  label: string;
  required?: boolean;
  optional?: boolean;
  icon: any;
  children: React.ReactNode;
}) {
  return (
    <View>
      <Text className="font-body text-sm font-bold text-on-surface mb-2.5 ml-1">
        {label} 
        {required && <Text className="text-error"> *</Text>}
        {optional && <Text className="text-on-surface-variant font-normal"> (opsional)</Text>}
      </Text>
      <View className="relative">
        <View className="absolute left-4 top-0 bottom-0 justify-center z-10" style={label === "Deskripsi Kejadian" ? { top: 16, bottom: "auto" } : {}}>
          <Icon size={18} color={colors.outline} />
        </View>
        {children}
      </View>
    </View>
  );
}
