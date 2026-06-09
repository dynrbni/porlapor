import { useState, useCallback, useEffect } from "react";
import { useFocusEffect } from "@react-navigation/native";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  ActivityIndicator,
  Image,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { SafeAreaView } from "react-native-safe-area-context";
import { Lock, LogOut, Save, Eye, EyeOff, Camera, User, Mail, Phone, CreditCard, MapPin } from "lucide-react-native";
import { useAuth } from "../../context/AuthContext";
import { getPhotoUrl } from "../../api/client";
import { StitchHeader } from "../../components/ui/StitchHeader";
import { colors } from "../../theme";
import { updateProfile } from "../../api/users";

export default function ProfileScreen() {
  const { user, logout, refreshUser } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    nik: user?.nik || "",
    address: user?.address || "",
  });
  const [passwordForm, setPasswordForm] = useState({ newPassword: "", confirmPassword: "" });
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [isLoadingPassword, setIsLoadingPassword] = useState(false);

  const initials = user?.name?.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase() || "U";

  useFocusEffect(
    useCallback(() => {
      refreshUser();
    }, [refreshUser])
  );

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        nik: user.nik || "",
        address: user.address || "",
      });
    }
  }, [user]);

  function handleLogout() {
    Alert.alert("Keluar", "Apakah Anda yakin ingin keluar?", [
      { text: "Batal", style: "cancel" },
      { text: "Keluar", style: "destructive", onPress: logout },
    ]);
  }

  async function pickImage() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets?.[0]) {
      const uri = result.assets[0].uri;
      const filename = uri.split("/").pop() || "profile.jpg";
      const ext = filename.split(".").pop() || "jpg";

      const fd = new FormData();
      fd.append("photo", { uri, name: filename, type: `image/${ext}` } as any);

      try {
        setIsLoadingProfile(true);
        await updateProfile(fd);
        await refreshUser();
        Alert.alert("Sukses", "Foto profil berhasil diperbarui!");
      } catch (error: any) {
        Alert.alert("Gagal", error?.response?.data?.message || "Gagal mengunggah foto profil");
      } finally {
        setIsLoadingProfile(false);
      }
    }
  }

  async function handleSaveProfile() {
    try {
      setIsLoadingProfile(true);
      await updateProfile(form);
      Alert.alert("Sukses", "Data profil berhasil diperbarui!");
    } catch (error: any) {
      Alert.alert("Gagal", error?.response?.data?.message || "Terjadi kesalahan saat memperbarui profil");
    } finally {
      setIsLoadingProfile(false);
    }
  }

  async function handleUpdatePassword() {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      Alert.alert("Gagal", "Password baru dan konfirmasi password tidak cocok!");
      return;
    }
    if (!passwordForm.newPassword) {
      Alert.alert("Gagal", "Password baru tidak boleh kosong!");
      return;
    }
    try {
      setIsLoadingPassword(true);
      await updateProfile({ password: passwordForm.newPassword });
      Alert.alert("Sukses", "Password berhasil diubah!");
      setPasswordForm({ newPassword: "", confirmPassword: "" });
    } catch (error: any) {
      Alert.alert("Gagal", error?.response?.data?.message || "Terjadi kesalahan saat mengubah password");
    } finally {
      setIsLoadingPassword(false);
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <StitchHeader variant="main" />

      <ScrollView contentContainerClassName="px-5 pb-28 pt-5" showsVerticalScrollIndicator={false}>
        {/* Page Title */}
        <View className="mb-6">
          <Text className="font-sans text-3xl font-bold text-on-surface tracking-tight">
            Pengaturan
          </Text>
          <Text className="font-body text-sm text-on-surface-variant mt-1.5 leading-relaxed">
            Kelola data diri, keamanan akun, dan preferensi.
          </Text>
        </View>

        {/* Profile Photo Card */}
        <View
          className="bg-primary rounded-[28px] border border-outline-variant/30 p-8 mb-6 items-center overflow-hidden relative"
          style={{
            shadowColor: colors.primary,
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.25,
            shadowRadius: 16,
            elevation: 8,
          }}
        >
          {/* Decorative Background */}
          <View className="absolute w-48 h-48 rounded-full bg-white/10 -top-10 -right-10" />
          <View className="absolute w-32 h-32 rounded-full bg-white/5 bottom-0 left-0" />

          <TouchableOpacity onPress={pickImage} disabled={isLoadingProfile} className="relative mb-5 z-10">
            <View className="w-28 h-28 rounded-full bg-surface-container-lowest items-center justify-center border-4 border-primary-fixed-dim overflow-hidden shadow-lg">
              {user?.photoUrl ? (
                <Image
                  source={{ uri: getPhotoUrl(user.photoUrl)! }}
                  className="w-full h-full"
                  resizeMode="cover"
                />
              ) : (
                <Text className="font-sans text-4xl font-bold text-primary">{initials}</Text>
              )}
            </View>
            <View className="absolute bottom-1 right-1 w-9 h-9 bg-white rounded-full items-center justify-center border-2 border-primary-fixed-dim shadow-sm">
              <Camera size={16} color={colors.primary} />
            </View>
          </TouchableOpacity>
          <Text className="font-sans text-2xl font-bold text-white z-10">{user?.name}</Text>
          <Text className="font-body text-sm text-primary-fixed-dim mt-1 z-10">{user?.email}</Text>
        </View>

        {/* Data Diri Card */}
        <View
          className="bg-surface-container-lowest rounded-[28px] border border-outline-variant/50 p-7 mb-6"
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.05,
            shadowRadius: 16,
            elevation: 4,
          }}
        >
          <Text className="font-sans text-lg font-bold text-on-surface mb-6 tracking-tight">Data Diri</Text>

          <FormField label="Nama Lengkap" icon={<User size={18} color={colors.outline} />}>
            <TextInput
              value={form.name}
              onChangeText={(v) => setForm((p) => ({ ...p, name: v }))}
              className="w-full bg-surface-container-low border border-outline-variant/50 rounded-2xl pl-12 pr-5 h-14 font-body text-sm text-on-surface"
            />
          </FormField>

          <FormField label="Alamat Email" icon={<Mail size={18} color={colors.outline} />}>
            <TextInput
              value={form.email}
              onChangeText={(v) => setForm((p) => ({ ...p, email: v }))}
              keyboardType="email-address"
              autoCapitalize="none"
              className="w-full bg-surface-container-low border border-outline-variant/50 rounded-2xl pl-12 pr-5 h-14 font-body text-sm text-on-surface"
            />
          </FormField>

          <FormField label="No. Telepon" icon={<Phone size={18} color={colors.outline} />}>
            <TextInput
              value={form.phone}
              onChangeText={(v) => setForm((p) => ({ ...p, phone: v }))}
              keyboardType="phone-pad"
              className="w-full bg-surface-container-low border border-outline-variant/50 rounded-2xl pl-12 pr-5 h-14 font-body text-sm text-on-surface"
            />
          </FormField>

          <FormField label="NIK (KTP)" icon={<CreditCard size={18} color={colors.outline} />}>
            <TextInput
              value={form.nik}
              onChangeText={(v) => setForm((p) => ({ ...p, nik: v }))}
              keyboardType="number-pad"
              maxLength={16}
              className="w-full bg-surface-container-low border border-outline-variant/50 rounded-2xl pl-12 pr-5 h-14 font-body text-sm text-on-surface"
            />
          </FormField>

          <FormField label="Alamat Lengkap" last icon={<MapPin size={18} color={colors.outline} />}>
            <TextInput
              value={form.address}
              onChangeText={(v) => setForm((p) => ({ ...p, address: v }))}
              className="w-full bg-surface-container-low border border-outline-variant/50 rounded-2xl pl-12 pr-5 py-4 font-body text-sm text-on-surface min-h-[100px]"
              multiline
              textAlignVertical="top"
            />
          </FormField>

          <TouchableOpacity
            onPress={handleSaveProfile}
            disabled={isLoadingProfile}
            activeOpacity={0.85}
            className="bg-primary h-14 rounded-full flex-row items-center justify-center gap-2.5 mt-8"
            style={{
              opacity: isLoadingProfile ? 0.7 : 1,
              shadowColor: colors.primary,
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.3,
              shadowRadius: 16,
              elevation: 8,
            }}
          >
            {isLoadingProfile ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <>
                <Save size={18} color="#fff" />
                <Text className="font-sans text-[15px] font-bold text-white tracking-wide">Simpan Perubahan</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* Change Password Card */}
        <View
          className="bg-surface-container-lowest rounded-[28px] border border-outline-variant/50 p-7 mb-6"
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.05,
            shadowRadius: 16,
            elevation: 4,
          }}
        >
          <View className="flex-row items-center gap-3 mb-6">
            <View className="w-10 h-10 bg-primary/10 rounded-full items-center justify-center">
              <Lock size={18} color={colors.primary} />
            </View>
            <Text className="font-sans text-lg font-bold text-on-surface tracking-tight">Keamanan</Text>
          </View>

          <FormField label="Password Baru" icon={<Lock size={18} color={colors.outline} />}>
            <View className="relative">
              <TextInput
                value={passwordForm.newPassword}
                onChangeText={(v) => setPasswordForm((p) => ({ ...p, newPassword: v }))}
                secureTextEntry={!showPassword}
                className="w-full bg-surface-container-low border border-outline-variant/50 rounded-2xl pl-12 pr-14 h-14 font-body text-sm text-on-surface"
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                className="absolute right-5 top-0 bottom-0 justify-center"
                activeOpacity={0.7}
              >
                {showPassword ? (
                  <EyeOff size={20} color={colors.outline} />
                ) : (
                  <Eye size={20} color={colors.outline} />
                )}
              </TouchableOpacity>
            </View>
          </FormField>

          <FormField label="Konfirmasi Password Baru" last icon={<Lock size={18} color={colors.outline} />}>
            <TextInput
              value={passwordForm.confirmPassword}
              onChangeText={(v) => setPasswordForm((p) => ({ ...p, confirmPassword: v }))}
              secureTextEntry
              className="w-full bg-surface-container-low border border-outline-variant/50 rounded-2xl pl-12 pr-5 h-14 font-body text-sm text-on-surface"
            />
          </FormField>

          <TouchableOpacity
            onPress={handleUpdatePassword}
            disabled={isLoadingPassword}
            activeOpacity={0.85}
            className="bg-primary/10 h-14 rounded-full flex-row items-center justify-center gap-2.5 mt-8 border border-primary/20"
          >
            {isLoadingPassword ? (
              <ActivityIndicator size="small" color={colors.primary} />
            ) : (
              <>
                <Lock size={18} color={colors.primary} />
                <Text className="font-sans text-[15px] font-bold text-primary tracking-wide">Ubah Password</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          onPress={handleLogout}
          activeOpacity={0.85}
          className="flex-row items-center justify-center bg-error-container/80 h-14 rounded-full gap-2.5 border border-error/30 mt-2"
        >
          <LogOut size={18} color={colors.error} />
          <Text className="font-sans text-[15px] font-bold text-error tracking-wide">Keluar dari Akun</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

function FormField({ label, children, last, icon }: { label: string; children: React.ReactNode; last?: boolean; icon?: React.ReactNode }) {
  return (
    <View className={last ? "" : "mb-5"}>
      <Text className="font-body text-sm font-bold text-on-surface mb-2.5 ml-1">{label}</Text>
      <View className="relative">
        {icon && (
          <View className="absolute left-4 top-0 bottom-0 justify-center z-10" style={label === "Alamat Lengkap" ? { top: 16, bottom: "auto" } : {}}>
            {icon}
          </View>
        )}
        {children}
      </View>
    </View>
  );
}
