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
    if (!form.name.trim()) {
      setError("Nama lengkap wajib diisi.");
      return false;
    }
    if (!form.email.trim()) {
      setError("Email wajib diisi.");
      return false;
    }
    if (form.password.length < 6) {
      setError("Password minimal 6 karakter.");
      return false;
    }
    return true;
  }

  function validateStep2() {
    setError("");
    if (!form.phone.trim()) {
      setError("Nomor telepon wajib diisi.");
      return false;
    }
    if (form.nik.trim().length !== 16) {
      setError("NIK harus 16 digit.");
      return false;
    }
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
      setError(
        err.response?.data?.message || "Pendaftaran gagal. Silakan coba lagi."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          contentContainerClassName="px-6 py-6"
          keyboardShouldPersistTaps="handled"
        >
          <TouchableOpacity onPress={() => navigation.goBack()} className="mb-6">
            <ArrowLeft size={24} color="#444651" />
          </TouchableOpacity>

          <Text className="font-sans text-2xl font-bold text-on-surface mb-2">
            {step === 1 ? "Buat Akun" : "Data Diri"}
          </Text>
          <Text className="font-body text-base text-on-surface-variant mb-8">
            {step === 1
              ? "Masukkan informasi akun Anda"
              : "Lengkapi data identitas Anda"}
          </Text>

          <View className="flex-row gap-2 mb-8">
            <View
              className={`flex-1 h-1.5 rounded-full ${
                step >= 1 ? "bg-primary" : "bg-surface-variant"
              }`}
            />
            <View
              className={`flex-1 h-1.5 rounded-full ${
                step >= 2 ? "bg-primary" : "bg-surface-variant"
              }`}
            />
          </View>

          {error ? (
            <View className="bg-error-container border border-error-container rounded-xl p-4 mb-6">
              <Text className="text-on-error-container text-sm font-medium">{error}</Text>
            </View>
          ) : null}

          {step === 1 ? (
            <>
              <InputField
                icon={User}
                label="Nama Lengkap"
                value={form.name}
                onChangeText={(v) => update("name", v)}
                placeholder="Masukkan nama"
              />
              <InputField
                icon={Mail}
                label="Email"
                value={form.email}
                onChangeText={(v) => update("email", v)}
                placeholder="Masukkan email"
                keyboardType="email-address"
              />
              <View className="mb-6">
                <Text className="font-body text-xs font-semibold text-on-surface mb-2">
                  Password
                </Text>
                <View className="flex-row items-center bg-surface-container border border-outline-variant rounded-xl px-4">
                  <Lock size={18} color="#757682" />
                  <TextInput
                    value={form.password}
                    onChangeText={(v) => update("password", v)}
                    placeholder="Minimal 6 karakter"
                    placeholderTextColor="#757682"
                    secureTextEntry={!showPass}
                    className="flex-1 ml-3 py-4 font-body text-base text-on-surface"
                  />
                  <TouchableOpacity onPress={() => setShowPass(!showPass)}>
                    {showPass ? (
                      <EyeOff size={18} color="#757682" />
                    ) : (
                      <Eye size={18} color="#757682" />
                    )}
                  </TouchableOpacity>
                </View>
              </View>

              <TouchableOpacity
                onPress={() => {
                  if (validateStep1()) setStep(2);
                }}
                className="bg-primary py-4 rounded-full items-center shadow-md"
              >
                <Text className="text-on-primary font-sans text-sm font-semibold">Lanjut</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <InputField
                icon={Phone}
                label="No. Telepon"
                value={form.phone}
                onChangeText={(v) => update("phone", v)}
                placeholder="08xxxxxxxxxx"
                keyboardType="phone-pad"
              />
              <InputField
                icon={CreditCard}
                label="NIK"
                value={form.nik}
                onChangeText={(v) => update("nik", v)}
                placeholder="16 digit NIK"
                keyboardType="number-pad"
              />
              <InputField
                icon={Calendar}
                label="Tanggal Lahir"
                value={form.birthDate}
                onChangeText={(v) => update("birthDate", v)}
                placeholder="YYYY-MM-DD"
              />

              <View className="mb-4">
                <Text className="font-body text-xs font-semibold text-on-surface mb-2">
                  Jenis Kelamin
                </Text>
                <View className="flex-row gap-3">
                  {[
                    { value: "LAKI_LAKI", label: "Laki-laki" },
                    { value: "PEREMPUAN", label: "Perempuan" },
                  ].map((g) => (
                    <TouchableOpacity
                      key={g.value}
                      onPress={() => update("gender", g.value)}
                      className={`flex-1 py-4 rounded-xl border items-center ${
                        form.gender === g.value
                          ? "bg-primary-fixed border-primary"
                          : "bg-surface-container border-outline-variant"
                      }`}
                    >
                      <Text
                        className={`font-sans text-sm font-semibold ${
                          form.gender === g.value
                            ? "text-on-primary-fixed"
                            : "text-on-surface-variant"
                        }`}
                      >
                        {g.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <InputField
                icon={MapPin}
                label="Alamat"
                value={form.address}
                onChangeText={(v) => update("address", v)}
                placeholder="Masukkan alamat"
                multiline
              />

              <View className="flex-row gap-3 mt-2">
                <TouchableOpacity
                  onPress={() => setStep(1)}
                  className="flex-1 py-4 rounded-xl items-center border border-outline-variant"
                >
                  <Text className="font-sans text-sm font-semibold text-on-surface-variant">Kembali</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleRegister}
                  disabled={loading}
                  className="flex-1 bg-primary py-4 rounded-xl items-center shadow-md"
                >
                  <Text className="text-on-primary font-sans text-sm font-semibold">
                    {loading ? "Memuat..." : "Daftar"}
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          )}

          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="mt-8 items-center mb-8"
          >
            <Text className="font-body text-base text-on-surface-variant">
              Sudah punya akun?{" "}
              <Text className="text-primary font-bold">Masuk</Text>
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
}: {
  icon: any;
  label: string;
  value: string;
  onChangeText: (v: string) => void;
  placeholder: string;
  keyboardType?: any;
  multiline?: boolean;
}) {
  return (
    <View className="mb-4">
      <Text className="font-body text-xs font-semibold text-on-surface mb-2">{label}</Text>
      <View className="flex-row items-center bg-surface-container border border-outline-variant rounded-xl px-4">
        <Icon size={18} color="#757682" />
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#757682"
          keyboardType={keyboardType}
          autoCapitalize="none"
          multiline={multiline}
          className={`flex-1 ml-3 py-4 font-body text-base text-on-surface ${multiline ? "min-h-[80px]" : ""}`}
        />
      </View>
    </View>
  );
}
