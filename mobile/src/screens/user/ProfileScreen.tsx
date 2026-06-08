import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Lock, LogOut, Save, Eye, EyeOff } from "lucide-react-native";
import { useAuth } from "../../context/AuthContext";
import { StitchHeader } from "../../components/ui/StitchHeader";
import { colors } from "../../theme";

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    nik: user?.nik || "",
    address: user?.address || "",
  });
  const [passwordForm, setPasswordForm] = useState({ newPassword: "", confirmPassword: "" });

  const initials = user?.name?.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase() || "U";

  function handleLogout() {
    Alert.alert("Keluar", "Apakah Anda yakin ingin keluar?", [
      { text: "Batal", style: "cancel" },
      { text: "Keluar", style: "destructive", onPress: logout },
    ]);
  }

  const fieldCls = "w-full bg-surface-container-lowest border border-outline-variant rounded-xl px-4 py-3 font-body text-sm text-on-surface";

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <StitchHeader variant="main" />

      <ScrollView contentContainerClassName="px-4 pb-28 pt-4" showsVerticalScrollIndicator={false}>
        <View className="items-center mb-8">
          <Text className="font-sans text-2xl font-bold text-on-surface">Pengaturan Profil</Text>
          <Text className="font-body text-sm text-on-surface-variant mt-1">Kelola data diri dan keamanan akun</Text>
        </View>

        <View className="bg-surface-container-lowest rounded-2xl border border-outline-variant p-6 mb-5 items-center">
          <View className="w-20 h-20 rounded-full bg-primary-fixed items-center justify-center mb-3 border-2 border-primary/20">
            <Text className="font-sans text-2xl font-bold text-primary">{initials}</Text>
          </View>
          <Text className="font-sans text-lg font-bold text-on-surface">{user?.name}</Text>
          <Text className="font-body text-sm text-on-surface-variant">{user?.email}</Text>
        </View>

        <View className="bg-surface-container-lowest rounded-2xl border border-outline-variant p-5 mb-5">
          <Text className="font-sans text-base font-bold text-on-surface mb-4">Data Diri</Text>

          <Text className="font-body text-sm font-semibold text-on-surface mb-1.5">Nama Lengkap</Text>
          <TextInput value={form.name} onChangeText={(v) => setForm((p) => ({ ...p, name: v }))} className={`${fieldCls} mb-3`} />

          <Text className="font-body text-sm font-semibold text-on-surface mb-1.5">Email</Text>
          <TextInput value={form.email} onChangeText={(v) => setForm((p) => ({ ...p, email: v }))} keyboardType="email-address" autoCapitalize="none" className={`${fieldCls} mb-3`} />

          <Text className="font-body text-sm font-semibold text-on-surface mb-1.5">No. Telepon</Text>
          <TextInput value={form.phone} onChangeText={(v) => setForm((p) => ({ ...p, phone: v }))} keyboardType="phone-pad" className={`${fieldCls} mb-3`} />

          <Text className="font-body text-sm font-semibold text-on-surface mb-1.5">NIK</Text>
          <TextInput value={form.nik} onChangeText={(v) => setForm((p) => ({ ...p, nik: v }))} keyboardType="number-pad" maxLength={16} className={`${fieldCls} mb-3`} />

          <Text className="font-body text-sm font-semibold text-on-surface mb-1.5">Alamat</Text>
          <TextInput value={form.address} onChangeText={(v) => setForm((p) => ({ ...p, address: v }))} className={`${fieldCls} mb-4`} />

          <TouchableOpacity className="bg-primary py-3 rounded-xl flex-row items-center justify-center gap-2 self-end px-6">
            <Save size={16} color="#fff" />
            <Text className="font-body text-sm font-bold text-on-primary">Simpan Perubahan</Text>
          </TouchableOpacity>
        </View>

        <View className="bg-surface-container-lowest rounded-2xl border border-outline-variant p-5 mb-5">
          <View className="flex-row items-center gap-2 mb-4">
            <Lock size={18} color={colors.onSurfaceVariant} />
            <Text className="font-sans text-base font-bold text-on-surface">Ubah Password</Text>
          </View>

          <Text className="font-body text-sm font-semibold text-on-surface mb-1.5">Password Baru</Text>
          <View className="relative mb-3">
            <TextInput value={passwordForm.newPassword} onChangeText={(v) => setPasswordForm((p) => ({ ...p, newPassword: v }))} secureTextEntry={!showPassword} className={`${fieldCls} pr-12`} />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} className="absolute right-3 top-3">
              {showPassword ? <EyeOff size={18} color={colors.onSurfaceVariant} /> : <Eye size={18} color={colors.onSurfaceVariant} />}
            </TouchableOpacity>
          </View>

          <Text className="font-body text-sm font-semibold text-on-surface mb-1.5">Konfirmasi Password</Text>
          <TextInput value={passwordForm.confirmPassword} onChangeText={(v) => setPasswordForm((p) => ({ ...p, confirmPassword: v }))} secureTextEntry className={`${fieldCls} mb-4`} />

          <TouchableOpacity className="bg-primary py-3 rounded-xl flex-row items-center justify-center gap-2 self-end px-6">
            <Lock size={16} color="#fff" />
            <Text className="font-body text-sm font-bold text-white">Ubah Password</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={handleLogout} className="flex-row items-center justify-center bg-error-container py-4 rounded-2xl gap-2">
          <LogOut size={18} color={colors.error} />
          <Text className="font-sans text-sm font-bold text-error">Keluar</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
