import { useState, type ReactNode } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  User, Mail, Lock, Phone, CreditCard, MapPin, Calendar, ChevronDown,
  Eye, EyeOff, ArrowLeft, AlertCircle,
} from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { PublicStackParamList } from "../../navigation/PublicNavigator";
import { useAuth } from "../../context/AuthContext";
import { StepIndicator } from "../../components/ui/StepIndicator";
import { colors } from "../../theme";

const STEPS = [
  { id: 1, label: "Akun" },
  { id: 2, label: "Identitas" },
];

type Nav = NativeStackNavigationProp<PublicStackParamList, "Register">;

export default function RegisterScreen() {
  const navigation = useNavigation<Nav>();
  const { register } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    passwordConfirm: "",
    phone: "",
    nik: "",
    address: "",
    birthDate: "",
    gender: "" as "" | "LAKI_LAKI" | "PEREMPUAN",
  });

  const set = (field: keyof typeof form) => (v: string) =>
    setForm((p) => ({ ...p, [field]: v }));

  const inputCls =
    "bg-surface-container-lowest border border-outline-variant rounded-xl pl-10 pr-4 py-3.5 font-body text-sm text-on-surface";

  function validateStep1() {
    if (!form.name.trim()) return "Nama lengkap wajib diisi.";
    if (!form.email.trim()) return "Alamat email wajib diisi.";
    if (form.password.length < 6) return "Password minimal 6 karakter.";
    if (form.password !== form.passwordConfirm) return "Konfirmasi password tidak cocok.";
    return "";
  }

  function validateStep2() {
    if (!form.phone.trim()) return "Nomor telepon wajib diisi.";
    if (!form.nik.trim() || form.nik.length !== 16) return "NIK harus 16 digit.";
    if (!form.birthDate.trim()) return "Tanggal lahir wajib diisi.";
    if (!form.gender) return "Jenis kelamin wajib dipilih.";
    if (!form.address.trim()) return "Alamat wajib diisi.";
    if (!agreed) return "Anda harus menyetujui syarat dan ketentuan.";
    return "";
  }

  function goNext() {
    const err = validateStep1();
    if (err) { setError(err); return; }
    setError("");
    setStep(2);
  }

  async function handleSubmit() {
    const err = validateStep2();
    if (err) { setError(err); return; }
    setError("");
    setLoading(true);
    try {
      await register({
        name: form.name,
        email: form.email.trim(),
        password: form.password,
        phone: form.phone,
        nik: form.nik,
        address: form.address,
        birthDate: form.birthDate,
        gender: form.gender as "LAKI_LAKI" | "PEREMPUAN",
      });
    } catch (err: any) {
      setError(err.response?.data?.message || "Pendaftaran gagal. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1">
        <ScrollView contentContainerClassName="pb-10" keyboardShouldPersistTaps="handled">
          <View className="bg-primary px-6 pt-4 pb-8">
            <TouchableOpacity onPress={() => navigation.goBack()} className="flex-row items-center gap-2 mb-6">
              <ArrowLeft size={18} color="#fff" />
              <Text className="font-body text-sm text-white/80">Beranda</Text>
            </TouchableOpacity>
            <Text className="font-sans text-3xl font-bold text-white mb-1">Buat Akun Baru</Text>
            <Text className="font-body text-sm text-white/75">Daftar gratis, mulai melaporkan masalah di sekitar Anda.</Text>
          </View>

          <View className="px-6 -mt-2 pt-4">
            <StepIndicator steps={STEPS} current={step} />

            {error ? (
              <View className="bg-error-container border-l-4 border-error p-4 rounded-lg flex-row gap-3 mb-5">
                <AlertCircle size={20} color={colors.error} />
                <Text className="font-body text-sm text-on-error-container flex-1">{error}</Text>
              </View>
            ) : null}

            {step === 1 ? (
              <View className="gap-4">
                <Field label="Nama Lengkap" required icon={User}>
                  <TextInput value={form.name} onChangeText={set("name")} placeholder="Nama sesuai KTP" placeholderTextColor="#94a3b8" className={inputCls} />
                </Field>
                <Field label="Alamat Email" required icon={Mail}>
                  <TextInput value={form.email} onChangeText={set("email")} placeholder="contoh@email.com" keyboardType="email-address" autoCapitalize="none" placeholderTextColor="#94a3b8" className={inputCls} />
                </Field>
                <Field label="Password" required icon={Lock}>
                  <View className="relative">
                    <TextInput value={form.password} onChangeText={set("password")} placeholder="Min. 6 karakter" secureTextEntry={!showPassword} placeholderTextColor="#94a3b8" className={`${inputCls} pr-12`} />
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-3.5">
                      {showPassword ? <EyeOff size={18} color={colors.onSurfaceVariant} /> : <Eye size={18} color={colors.onSurfaceVariant} />}
                    </TouchableOpacity>
                  </View>
                </Field>
                <Field label="Konfirmasi Password" required icon={Lock}>
                  <View className="relative">
                    <TextInput value={form.passwordConfirm} onChangeText={set("passwordConfirm")} placeholder="Ulangi password" secureTextEntry={!showConfirm} placeholderTextColor="#94a3b8" className={`${inputCls} pr-12`} />
                    <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)} className="absolute right-3.5 top-3.5">
                      {showConfirm ? <EyeOff size={18} color={colors.onSurfaceVariant} /> : <Eye size={18} color={colors.onSurfaceVariant} />}
                    </TouchableOpacity>
                  </View>
                </Field>
                <TouchableOpacity onPress={goNext} className="bg-primary py-4 rounded-xl items-center mt-2">
                  <Text className="font-sans text-sm font-bold text-on-primary">Lanjut →</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View className="gap-4">
                <Text className="font-body text-sm text-on-surface-variant mb-1">
                  Semua data identitas wajib diisi untuk menyelesaikan pendaftaran.
                </Text>
                <Field label="Nomor Telepon" required icon={Phone}>
                  <TextInput value={form.phone} onChangeText={set("phone")} placeholder="08xxxxxxxxxx" keyboardType="phone-pad" placeholderTextColor="#94a3b8" className={inputCls} />
                </Field>
                <Field label="NIK (KTP)" required icon={CreditCard}>
                  <TextInput value={form.nik} onChangeText={(v) => set("nik")(v.replace(/[^0-9]/g, ""))} placeholder="16 digit NIK" keyboardType="number-pad" maxLength={16} placeholderTextColor="#94a3b8" className={inputCls} />
                </Field>
                <Field label="Tanggal Lahir" required icon={Calendar}>
                  <TextInput value={form.birthDate} onChangeText={set("birthDate")} placeholder="YYYY-MM-DD" placeholderTextColor="#94a3b8" className={inputCls} />
                </Field>
                <View>
                  <Text className="font-body text-sm font-semibold text-on-surface mb-2">Jenis Kelamin <Text className="text-error">*</Text></Text>
                  <View className="flex-row gap-2">
                    {(["LAKI_LAKI", "PEREMPUAN"] as const).map((g) => (
                      <TouchableOpacity
                        key={g}
                        onPress={() => set("gender")(g)}
                        className={`flex-1 py-3 rounded-xl border items-center ${form.gender === g ? "bg-primary-soft border-primary" : "border-outline-variant"}`}
                      >
                        <Text className={`font-body text-sm font-semibold ${form.gender === g ? "text-primary" : "text-on-surface-variant"}`}>
                          {g === "LAKI_LAKI" ? "Laki-laki" : "Perempuan"}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
                <Field label="Alamat Lengkap" required icon={MapPin}>
                  <TextInput value={form.address} onChangeText={set("address")} placeholder="Jl. Contoh No. 1, Kota" multiline placeholderTextColor="#94a3b8" className={`${inputCls} min-h-[80px]`} textAlignVertical="top" />
                </Field>
                <TouchableOpacity onPress={() => setAgreed(!agreed)} className="flex-row items-start gap-2.5">
                  <View className={`w-4 h-4 rounded border mt-0.5 items-center justify-center ${agreed ? "bg-primary border-primary" : "border-outline"}`}>
                    {agreed && <Text className="text-on-primary text-[10px]">✓</Text>}
                  </View>
                  <Text className="font-body text-sm text-on-surface-variant flex-1 leading-relaxed">
                    Saya menyetujui <Text className="text-primary font-semibold">Syarat, Ketentuan & Kebijakan Privasi</Text>.
                  </Text>
                </TouchableOpacity>
                <View className="flex-row gap-3 mt-2">
                  <TouchableOpacity onPress={() => { setError(""); setStep(1); }} className="flex-1 border-2 border-outline-variant py-3.5 rounded-xl items-center">
                    <Text className="font-sans text-sm font-bold text-on-surface">← Kembali</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={handleSubmit} disabled={loading} className="flex-[2] bg-primary py-3.5 rounded-xl items-center" style={{ opacity: loading ? 0.7 : 1 }}>
                    {loading ? <ActivityIndicator color="#fff" /> : <Text className="font-sans text-sm font-bold text-on-primary">Daftar Sekarang</Text>}
                  </TouchableOpacity>
                </View>
              </View>
            )}

            <View className="flex-row items-center gap-4 my-7">
              <View className="flex-1 h-px bg-outline-variant" />
              <Text className="font-body text-xs text-on-surface-variant">Sudah Punya Akun?</Text>
              <View className="flex-1 h-px bg-outline-variant" />
            </View>
            <TouchableOpacity onPress={() => navigation.navigate("Login")} className="border-2 border-outline-variant py-4 rounded-xl items-center">
              <Text className="font-sans text-sm font-bold text-on-surface">Masuk di Sini</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function Field({
  label,
  required,
  icon: Icon,
  children,
}: {
  label: string;
  required?: boolean;
  icon: any;
  children: ReactNode;
}) {
  return (
    <View>
      <Text className="font-body text-sm font-semibold text-on-surface mb-2">
        {label} {required && <Text className="text-error">*</Text>}
      </Text>
      <View className="relative">
        <View className="absolute left-3.5 top-3.5 z-10">
          <Icon size={18} color={colors.onSurfaceVariant} />
        </View>
        {children}
      </View>
    </View>
  );
}
