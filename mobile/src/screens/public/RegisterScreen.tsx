import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ArrowLeft,
  User,
  Mail,
  Lock,
  Phone,
  CreditCard,
  MapPin,
  Calendar,
  Eye,
  EyeOff,
  ArrowRight,
} from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../../context/AuthContext";

type Gender = "LAKI_LAKI" | "PEREMPUAN";

export default function RegisterScreen() {
  const { register } = useAuth();
  const navigation = useNavigation();
  const [step, setStep] = useState(1);
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [agree, setAgree] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    nik: "",
    address: "",
    birthDate: "",
    gender: "" as Gender | "",
  });

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function validateStep1() {
    setError("");
    if (!form.nik.trim() || form.nik.trim().length !== 16) {
      setError("NIK harus 16 digit.");
      return false;
    }
    if (!form.name.trim()) {
      setError("Nama lengkap wajib diisi.");
      return false;
    }
    if (!form.email.trim()) {
      setError("Email wajib diisi.");
      return false;
    }
    if (!form.phone.trim()) {
      setError("Nomor telepon wajib diisi.");
      return false;
    }
    if (form.password.length < 6) {
      setError("Password minimal 6 karakter.");
      return false;
    }
    if (!agree) {
      setError("Anda harus menyetujui Syarat & Ketentuan.");
      return false;
    }
    return true;
  }

  function validateStep2() {
    setError("");
    if (!form.birthDate.trim()) {
      setError("Tanggal lahir wajib diisi.");
      return false;
    }
    if (!form.gender) {
      setError("Jenis kelamin wajib dipilih.");
      return false;
    }
    if (!form.address.trim()) {
      setError("Alamat wajib diisi.");
      return false;
    }
    return true;
  }

  async function handleRegister() {
    if (!validateStep2()) return;
    setLoading(true);
    setError("");
    try {
      await register(form as any);
    } catch (err: any) {
      setError(err.response?.data?.message || "Pendaftaran gagal. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1">
        <ScrollView contentContainerClassName="px-6 py-6" keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <TouchableOpacity onPress={() => navigation.goBack()} className="flex-row items-center gap-2 mb-6">
            <View className="w-9 h-9 items-center justify-center rounded-full bg-white border border-outline-variant">
              <ArrowLeft size={18} color="#0f172a" />
            </View>
            <Text className="font-body text-sm text-on-surface-variant">Kembali</Text>
          </TouchableOpacity>

          <View className="items-center mb-6">
            <Image
              source={require("../../../assets/images/porlapor_logo.png")}
              className="h-12 w-auto mb-2"
              resizeMode="contain"
            />
            <Text className="font-sans text-2xl font-extrabold text-on-surface text-center">Daftar Akun</Text>
            <Text className="font-body text-sm text-on-surface-variant text-center mt-1 max-w-xs">
              Lengkapi data diri Anda untuk mulai menggunakan layanan PorLapor.
            </Text>
          </View>

          <View className="flex-row gap-2 mb-6">
            <View className={`flex-1 h-1.5 rounded-full ${step >= 1 ? "bg-primary" : "bg-outline-variant"}`} />
            <View className={`flex-1 h-1.5 rounded-full ${step >= 2 ? "bg-primary" : "bg-outline-variant"}`} />
          </View>

          {error ? (
            <View className="bg-error-container border border-red-200 rounded-xl p-4 mb-4">
              <Text className="text-red-700 text-sm font-medium">{error}</Text>
            </View>
          ) : null}

          {step === 1 ? (
            <View className="bg-white rounded-2xl border border-outline-variant p-5 shadow-sm">
              <InputField
                icon={CreditCard}
                label="Nomor Induk Kependudukan (NIK)"
                value={form.nik}
                onChangeText={(v) => update("nik", v.replace(/[^0-9]/g, ""))}
                placeholder="16 digit NIK"
                keyboardType="number-pad"
                maxLength={16}
                hint="Format: 16-digits"
              />
              <InputField icon={User} label="Nama Lengkap" value={form.name} onChangeText={(v) => update("name", v)} placeholder="Masukkan nama lengkap" />
              <InputField icon={Mail} label="Email" value={form.email} onChangeText={(v) => update("email", v)} placeholder="Masukkan email" keyboardType="email-address" />
              <InputField icon={Phone} label="Nomor Telepon" value={form.phone} onChangeText={(v) => update("phone", v)} placeholder="08xxxxxxxxxx" keyboardType="phone-pad" />

              <View className="mb-4">
                <Text className="font-body text-xs font-semibold text-on-surface mb-2">Kata Sandi</Text>
                <View className="flex-row items-center bg-surface-container-lowest border border-outline-variant rounded-xl px-4">
                  <Lock size={18} color="#64748b" />
                  <TextInput
                    value={form.password}
                    onChangeText={(v) => update("password", v)}
                    placeholder="Minimal 6 karakter"
                    placeholderTextColor="#94a3b8"
                    secureTextEntry={!showPass}
                    className="flex-1 ml-3 py-3.5 font-body text-base text-on-surface"
                  />
                  <TouchableOpacity onPress={() => setShowPass(!showPass)}>
                    {showPass ? <EyeOff size={18} color="#64748b" /> : <Eye size={18} color="#64748b" />}
                  </TouchableOpacity>
                </View>
              </View>

              <TouchableOpacity
                onPress={() => setAgree(!agree)}
                activeOpacity={0.7}
                className="flex-row items-start gap-3 mb-6"
              >
                <View className={`w-5 h-5 rounded border-2 mt-0.5 items-center justify-center ${agree ? "bg-primary border-primary" : "border-outline"}`}>
                  {agree && <Text className="text-on-primary text-[11px] font-bold">✓</Text>}
                </View>
                <Text className="font-body text-sm text-on-surface-variant flex-1 leading-relaxed">
                  Saya setuju dengan <Text className="text-primary font-semibold">Syarat &amp; Ketentuan</Text> serta <Text className="text-primary font-semibold">Kebijakan Privasi</Text> PorLapor.
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  if (validateStep1()) setStep(2);
                }}
                activeOpacity={0.85}
                className="bg-primary py-4 rounded-2xl items-center flex-row justify-center gap-2 shadow-soft"
              >
                <Text className="text-on-primary font-sans text-base font-bold">Lanjut</Text>
                <ArrowRight size={18} color="#fff" />
              </TouchableOpacity>
            </View>
          ) : (
            <View className="bg-white rounded-2xl border border-outline-variant p-5 shadow-sm">
              <InputField icon={Calendar} label="Tanggal Lahir" value={form.birthDate} onChangeText={(v) => update("birthDate", v)} placeholder="YYYY-MM-DD" />

              <View className="mb-4">
                <Text className="font-body text-xs font-semibold text-on-surface mb-2">Jenis Kelamin</Text>
                <View className="flex-row gap-3">
                  {[
                    { value: "LAKI_LAKI", label: "Laki-laki" },
                    { value: "PEREMPUAN", label: "Perempuan" },
                  ].map((g) => (
                    <TouchableOpacity
                      key={g.value}
                      onPress={() => update("gender", g.value)}
                      activeOpacity={0.7}
                      className={`flex-1 py-3.5 rounded-xl border-2 items-center ${form.gender === g.value ? "bg-primary-soft border-primary" : "bg-white border-outline"}`}
                    >
                      <Text className={`font-sans text-sm font-semibold ${form.gender === g.value ? "text-primary" : "text-on-surface-variant"}`}>
                        {g.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <InputField icon={MapPin} label="Alamat" value={form.address} onChangeText={(v) => update("address", v)} placeholder="Masukkan alamat" multiline />

              <View className="flex-row gap-3 mt-2">
                <TouchableOpacity onPress={() => setStep(1)} activeOpacity={0.7} className="flex-1 py-4 rounded-2xl items-center border-2 border-outline">
                  <Text className="font-sans text-sm font-bold text-on-surface-variant">Kembali</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleRegister}
                  disabled={loading}
                  activeOpacity={0.85}
                  className="flex-1 bg-primary py-4 rounded-2xl items-center shadow-soft flex-row justify-center gap-2"
                >
                  <Text className="text-on-primary font-sans text-sm font-bold">
                    {loading ? "Memuat..." : "Daftar"}
                  </Text>
                  {!loading && <ArrowRight size={16} color="#fff" />}
                </TouchableOpacity>
              </View>
            </View>
          )}

          <TouchableOpacity onPress={() => navigation.goBack()} className="mt-8 items-center mb-8">
            <Text className="font-body text-base text-on-surface-variant">
              Sudah punya akun?{" "}
              <Text className="text-primary font-bold">Masuk di sini</Text>
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function InputField({
  icon: Icon,
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType,
  multiline,
  maxLength,
  hint,
}: {
  icon: any;
  label: string;
  value: string;
  onChangeText: (v: string) => void;
  placeholder: string;
  keyboardType?: any;
  multiline?: boolean;
  maxLength?: number;
  hint?: string;
}) {
  return (
    <View className="mb-4">
      <Text className="font-body text-xs font-semibold text-on-surface mb-2">{label}</Text>
      <View className={`flex-row items-center bg-surface-container-lowest border border-outline-variant rounded-xl px-4 ${multiline ? "items-start" : ""}`}>
        <View className={multiline ? "mt-3.5" : ""}>
          <Icon size={18} color="#64748b" />
        </View>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#94a3b8"
          keyboardType={keyboardType}
          autoCapitalize="none"
          multiline={multiline}
          maxLength={maxLength}
          className={`flex-1 ml-3 py-3.5 font-body text-base text-on-surface ${multiline ? "min-h-[80px]" : ""}`}
        />
      </View>
      {hint ? (
        <Text className="font-body text-[11px] text-on-surface-variant mt-1.5">{hint}</Text>
      ) : null}
    </View>
  );
}
