import { useState, type ReactNode } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  User, Mail, Lock, Phone, CreditCard, MapPin, Calendar,
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
      // Navigation will be handled by RootNavigator automatically
    } catch (err: any) {
      if (err.code === "ECONNABORTED" || err.message?.includes("timeout")) {
        setError("Koneksi ke server timeout. Pastikan server backend berjalan.");
      } else {
        setError(err.response?.data?.message || "Pendaftaran gagal. Silakan coba lagi.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top", "bottom"]}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1">
        <ScrollView
          contentContainerClassName="pb-10"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Top Navy Blue Background */}
          <View className="bg-primary pt-6 pb-24 px-7 rounded-b-[40px]">
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              className="w-10 h-10 bg-white/20 items-center justify-center rounded-full mb-6"
              activeOpacity={0.7}
            >
              <ArrowLeft size={20} color="#ffffff" />
            </TouchableOpacity>
            <Text className="font-sans text-[32px] font-bold text-white mb-2 tracking-tight leading-tight">
              Buat Akun Baru
            </Text>
            <Text className="font-body text-sm text-primary-fixed-dim leading-relaxed pr-10">
              Daftar gratis, mulai melaporkan masalah di sekitar Anda.
            </Text>
          </View>

          {/* Form Card (Overlapping) */}
          <View
            className="mx-5 -mt-12 bg-surface-container-lowest p-7 rounded-[32px] border border-outline-variant/30"
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.08,
              shadowRadius: 24,
              elevation: 6,
            }}
          >
            <StepIndicator steps={STEPS} current={step} />

            {/* Error */}
            {error ? (
              <View className="bg-error-container border-l-4 border-error px-4 py-3.5 rounded-xl flex-row gap-3 mb-5 items-start">
                <AlertCircle size={18} color={colors.error} style={{ marginTop: 1 }} />
                <Text className="font-body text-sm text-on-error-container flex-1 leading-relaxed">{error}</Text>
              </View>
            ) : null}

            {step === 1 ? (
              <View className="gap-5 mt-4">
                <Field label="Nama Lengkap" required icon={User}>
                  <TextInput
                    value={form.name}
                    onChangeText={set("name")}
                    placeholder="Nama sesuai KTP"
                    placeholderTextColor="#94a3b8"
                    className="bg-surface-container-low border border-outline-variant/50 rounded-2xl pl-12 pr-4 h-14 font-body text-sm text-on-surface"
                  />
                </Field>
                <Field label="Alamat Email" required icon={Mail}>
                  <TextInput
                    value={form.email}
                    onChangeText={set("email")}
                    placeholder="contoh@email.com"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    placeholderTextColor="#94a3b8"
                    className="bg-surface-container-low border border-outline-variant/50 rounded-2xl pl-12 pr-4 h-14 font-body text-sm text-on-surface"
                  />
                </Field>
                <Field label="Password" required icon={Lock}>
                  <View className="relative">
                    <TextInput
                      value={form.password}
                      onChangeText={set("password")}
                      placeholder="Min. 6 karakter"
                      secureTextEntry={!showPassword}
                      placeholderTextColor="#94a3b8"
                      className="bg-surface-container-low border border-outline-variant/50 rounded-2xl pl-12 pr-14 h-14 font-body text-sm text-on-surface"
                    />
                    <TouchableOpacity
                      onPress={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-0 bottom-0 justify-center"
                      activeOpacity={0.7}
                    >
                      {showPassword ? <EyeOff size={18} color={colors.outline} /> : <Eye size={18} color={colors.outline} />}
                    </TouchableOpacity>
                  </View>
                </Field>
                <Field label="Konfirmasi Password" required icon={Lock}>
                  <View className="relative">
                    <TextInput
                      value={form.passwordConfirm}
                      onChangeText={set("passwordConfirm")}
                      placeholder="Ulangi password"
                      secureTextEntry={!showConfirm}
                      placeholderTextColor="#94a3b8"
                      className="bg-surface-container-low border border-outline-variant/50 rounded-2xl pl-12 pr-14 h-14 font-body text-sm text-on-surface"
                    />
                    <TouchableOpacity
                      onPress={() => setShowConfirm(!showConfirm)}
                      className="absolute right-4 top-0 bottom-0 justify-center"
                      activeOpacity={0.7}
                    >
                      {showConfirm ? <EyeOff size={18} color={colors.outline} /> : <Eye size={18} color={colors.outline} />}
                    </TouchableOpacity>
                  </View>
                </Field>

                <TouchableOpacity
                  onPress={goNext}
                  activeOpacity={0.85}
                  className="bg-primary h-14 rounded-full items-center justify-center mt-2"
                  style={{
                    shadowColor: colors.primary,
                    shadowOffset: { width: 0, height: 8 },
                    shadowOpacity: 0.3,
                    shadowRadius: 16,
                    elevation: 8,
                  }}
                >
                  <Text className="font-sans text-[15px] font-bold text-white tracking-wide">Lanjut →</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View className="gap-5 mt-4">
                <Text className="font-body text-xs text-on-surface-variant font-medium leading-relaxed bg-surface-container p-3 rounded-xl border border-outline-variant/30">
                  ⚠️ Pastikan data identitas di bawah ini sesuai KTP untuk verifikasi.
                </Text>
                <Field label="Nomor Telepon" required icon={Phone}>
                  <TextInput
                    value={form.phone}
                    onChangeText={set("phone")}
                    placeholder="08xxxxxxxxxx"
                    keyboardType="phone-pad"
                    placeholderTextColor="#94a3b8"
                    className="bg-surface-container-low border border-outline-variant/50 rounded-2xl pl-12 pr-4 h-14 font-body text-sm text-on-surface"
                  />
                </Field>
                <Field label="NIK (KTP)" required icon={CreditCard}>
                  <TextInput
                    value={form.nik}
                    onChangeText={(v) => set("nik")(v.replace(/[^0-9]/g, ""))}
                    placeholder="16 digit NIK"
                    keyboardType="number-pad"
                    maxLength={16}
                    placeholderTextColor="#94a3b8"
                    className="bg-surface-container-low border border-outline-variant/50 rounded-2xl pl-12 pr-4 h-14 font-body text-sm text-on-surface"
                  />
                </Field>
                <Field label="Tanggal Lahir" required icon={Calendar}>
                  <TextInput
                    value={form.birthDate}
                    onChangeText={set("birthDate")}
                    placeholder="YYYY-MM-DD"
                    placeholderTextColor="#94a3b8"
                    className="bg-surface-container-low border border-outline-variant/50 rounded-2xl pl-12 pr-4 h-14 font-body text-sm text-on-surface"
                  />
                </Field>

                {/* Gender Selector */}
                <View>
                  <Text className="font-body text-sm font-bold text-on-surface mb-2.5">
                    Jenis Kelamin <Text className="text-error">*</Text>
                  </Text>
                  <View className="flex-row gap-3">
                    {(["LAKI_LAKI", "PEREMPUAN"] as const).map((g) => (
                      <TouchableOpacity
                        key={g}
                        onPress={() => set("gender")(g)}
                        activeOpacity={0.8}
                        className={`flex-1 h-12 rounded-xl border-2 items-center justify-center ${
                          form.gender === g
                            ? "bg-primary/10 border-primary"
                            : "border-outline-variant/50 bg-surface-container-low"
                        }`}
                      >
                        <Text
                          className={`font-sans text-xs font-bold tracking-wide ${
                            form.gender === g ? "text-primary" : "text-on-surface-variant"
                          }`}
                        >
                          {g === "LAKI_LAKI" ? "Laki-laki" : "Perempuan"}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                <Field label="Alamat Lengkap" required icon={MapPin}>
                  <TextInput
                    value={form.address}
                    onChangeText={set("address")}
                    placeholder="Jl. Contoh No. 1, Kota"
                    multiline
                    placeholderTextColor="#94a3b8"
                    className="bg-surface-container-low border border-outline-variant/50 rounded-2xl pl-12 pr-4 py-4 font-body text-sm text-on-surface min-h-[100px]"
                    textAlignVertical="top"
                  />
                </Field>

                {/* Agreement Checkbox */}
                <TouchableOpacity
                  onPress={() => setAgreed(!agreed)}
                  className="flex-row items-start gap-3 mt-2"
                  activeOpacity={0.7}
                >
                  <View
                    className={`w-5 h-5 rounded border-2 mt-0.5 items-center justify-center ${
                      agreed ? "bg-primary border-primary" : "border-outline-variant bg-surface-container-low"
                    }`}
                  >
                    {agreed && <Text className="text-white text-[10px] font-bold">✓</Text>}
                  </View>
                  <Text className="font-body text-[13px] text-on-surface-variant flex-1 leading-relaxed">
                    Saya menyatakan data ini benar dan menyetujui{" "}
                    <Text className="text-primary font-bold">
                      Syarat, Ketentuan & Kebijakan Privasi
                    </Text>
                    .
                  </Text>
                </TouchableOpacity>

                {/* Action Buttons */}
                <View className="flex-row gap-3 mt-4">
                  <TouchableOpacity
                    onPress={() => { setError(""); setStep(1); }}
                    activeOpacity={0.85}
                    className="flex-1 border-2 border-outline-variant/50 h-14 rounded-full items-center justify-center bg-transparent"
                  >
                    <Text className="font-sans text-sm font-bold text-on-surface">Kembali</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={handleSubmit}
                    disabled={loading}
                    activeOpacity={0.85}
                    className="flex-[1.5] bg-primary h-14 rounded-full items-center justify-center"
                    style={{
                      opacity: loading ? 0.7 : 1,
                      shadowColor: colors.primary,
                      shadowOffset: { width: 0, height: 8 },
                      shadowOpacity: 0.3,
                      shadowRadius: 16,
                      elevation: 8,
                    }}
                  >
                    {loading ? (
                      <ActivityIndicator color="#fff" />
                    ) : (
                      <Text className="font-sans text-sm font-bold text-white tracking-wide">Daftar</Text>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            )}

          </View>

          {/* Bottom Login CTA */}
          <View className="px-8 mt-10 mb-8 items-center">
            <View className="flex-row items-center gap-4 mb-6 w-full">
              <View className="flex-1 h-px bg-outline-variant/60" />
              <Text className="font-body text-xs text-on-surface-variant font-semibold tracking-wider uppercase">Sudah Punya Akun?</Text>
              <View className="flex-1 h-px bg-outline-variant/60" />
            </View>
            <TouchableOpacity
              onPress={() => navigation.navigate("Login")}
              activeOpacity={0.85}
              className="border-2 border-outline-variant/50 h-14 w-full rounded-full items-center justify-center bg-transparent"
            >
              <Text className="font-sans text-[15px] font-bold text-on-surface tracking-wide">Masuk di Sini</Text>
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
      <Text className="font-body text-sm font-semibold text-on-surface mb-2.5">
        {label} {required && <Text className="text-error">*</Text>}
      </Text>
      <View className="relative">
        <View className="absolute left-4 top-0 bottom-0 justify-center z-10" style={label === "Alamat Lengkap" ? { top: 16, bottom: "auto" } : {}}>
          <Icon size={18} color={colors.outline} />
        </View>
        {children}
      </View>
    </View>
  );
}
