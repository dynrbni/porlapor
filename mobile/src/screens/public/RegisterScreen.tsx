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
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          contentContainerClassName="px-6 py-6"
          keyboardShouldPersistTaps="handled"
        >
          <TouchableOpacity onPress={() => navigation.goBack()} className="mb-6">
            <ArrowLeft size={24} color="#475569" />
          </TouchableOpacity>

          <Text className="text-3xl font-extrabold text-slate-900 mb-2">
            {step === 1 ? "Buat Akun" : "Data Diri"}
          </Text>
          <Text className="text-slate-500 mb-8">
            {step === 1
              ? "Masukkan informasi akun Anda"
              : "Lengkapi data identitas Anda"}
          </Text>

          {/* Step Indicator */}
          <View className="flex-row gap-2 mb-8">
            <View
              className={`flex-1 h-1.5 rounded-full ${
                step >= 1 ? "bg-teal-600" : "bg-slate-200"
              }`}
            />
            <View
              className={`flex-1 h-1.5 rounded-full ${
                step >= 2 ? "bg-teal-600" : "bg-slate-200"
              }`}
            />
          </View>

          {error ? (
            <View className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6">
              <Text className="text-red-700 text-sm font-medium">{error}</Text>
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
                <Text className="text-sm font-bold text-slate-700 mb-2">
                  Password
                </Text>
                <View className="flex-row items-center bg-slate-50 border border-slate-200 rounded-2xl px-4">
                  <Lock size={18} color="#94a3b8" />
                  <TextInput
                    value={form.password}
                    onChangeText={(v) => update("password", v)}
                    placeholder="Minimal 6 karakter"
                    placeholderTextColor="#94a3b8"
                    secureTextEntry={!showPass}
                    className="flex-1 ml-3 py-4 text-slate-900"
                  />
                  <TouchableOpacity onPress={() => setShowPass(!showPass)}>
                    {showPass ? (
                      <EyeOff size={18} color="#94a3b8" />
                    ) : (
                      <Eye size={18} color="#94a3b8" />
                    )}
                  </TouchableOpacity>
                </View>
              </View>

              <TouchableOpacity
                onPress={() => {
                  if (validateStep1()) setStep(2);
                }}
                className="bg-teal-600 py-4 rounded-2xl items-center"
              >
                <Text className="text-white font-bold text-lg">Lanjut</Text>
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
                <Text className="text-sm font-bold text-slate-700 mb-2">
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
                      className={`flex-1 py-4 rounded-2xl border items-center ${
                        form.gender === g.value
                          ? "bg-teal-50 border-teal-500"
                          : "bg-slate-50 border-slate-200"
                      }`}
                    >
                      <Text
                        className={`font-bold ${
                          form.gender === g.value
                            ? "text-teal-700"
                            : "text-slate-600"
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
                  className="flex-1 py-4 rounded-2xl items-center border border-slate-200"
                >
                  <Text className="font-bold text-slate-600">Kembali</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleRegister}
                  disabled={loading}
                  className="flex-1 bg-teal-600 py-4 rounded-2xl items-center"
                >
                  <Text className="text-white font-bold text-lg">
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
            <Text className="text-slate-500">
              Sudah punya akun?{" "}
              <Text className="text-teal-600 font-bold">Masuk</Text>
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
      <Text className="text-sm font-bold text-slate-700 mb-2">{label}</Text>
      <View className="flex-row items-center bg-slate-50 border border-slate-200 rounded-2xl px-4">
        <Icon size={18} color="#94a3b8" />
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#94a3b8"
          keyboardType={keyboardType}
          autoCapitalize="none"
          multiline={multiline}
          className={`flex-1 ml-3 py-4 text-slate-900 ${multiline ? "min-h-[80px]" : ""}`}
        />
      </View>
    </View>
  );
}
