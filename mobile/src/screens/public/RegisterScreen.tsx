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
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../../context/AuthContext";

export default function RegisterScreen() {
  const { register } = useAuth();
  const navigation = useNavigation();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    nik: "",
    address: "",
    birthDate: "",
    gender: "LAKI_LAKI" as "LAKI_LAKI" | "PEREMPUAN",
  });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleRegister() {
    const { name, email, password, phone, nik, address, birthDate, gender } =
      form;
    if (!name || !email || !password || !nik) {
      Alert.alert("Error", "Lengkapi semua field wajib");
      return;
    }
    setLoading(true);
    try {
      await register({
        name,
        email,
        password,
        phone,
        nik,
        address,
        birthDate,
        gender,
      });
    } catch (err: any) {
      Alert.alert(
        "Registrasi Gagal",
        err.response?.data?.message || "Terjadi kesalahan"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-slate-900">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          contentContainerClassName="px-6 py-6"
          keyboardShouldPersistTaps="handled"
        >
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="mb-6"
          >
            <Ionicons
              name="arrow-back"
              size={24}
              className="text-slate-600 dark:text-slate-300"
            />
          </TouchableOpacity>

          <Text className="text-3xl font-bold text-slate-800 dark:text-white mb-2">
            Daftar Akun
          </Text>
          <Text className="text-slate-500 dark:text-slate-400 mb-8">
            Buat akun baru untuk mulai melapor
          </Text>

          <InputField
            label="Nama Lengkap"
            value={form.name}
            onChangeText={(v) => update("name", v)}
            placeholder="Masukkan nama"
          />
          <InputField
            label="Email"
            value={form.email}
            onChangeText={(v) => update("email", v)}
            placeholder="Masukkan email"
            keyboardType="email-address"
          />
          <View className="mb-4">
            <Text className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Password
            </Text>
            <View className="flex-row items-center bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl">
              <TextInput
                value={form.password}
                onChangeText={(v) => update("password", v)}
                placeholder="Masukkan password"
                placeholderTextColor="#94a3b8"
                secureTextEntry={!showPass}
                className="flex-1 px-4 py-3 text-slate-800 dark:text-white"
              />
              <TouchableOpacity onPress={() => setShowPass(!showPass)} className="px-3">
                <Ionicons
                  name={showPass ? "eye-off" : "eye"}
                  size={20}
                  color="#94a3b8"
                />
              </TouchableOpacity>
            </View>
          </View>

          <InputField
            label="NIK"
            value={form.nik}
            onChangeText={(v) => update("nik", v)}
            placeholder="Masukkan NIK"
            keyboardType="number-pad"
          />
          <InputField
            label="No. Telepon"
            value={form.phone}
            onChangeText={(v) => update("phone", v)}
            placeholder="Masukkan nomor telepon"
            keyboardType="phone-pad"
          />
          <InputField
            label="Alamat"
            value={form.address}
            onChangeText={(v) => update("address", v)}
            placeholder="Masukkan alamat"
          />
          <InputField
            label="Tanggal Lahir"
            value={form.birthDate}
            onChangeText={(v) => update("birthDate", v)}
            placeholder="YYYY-MM-DD"
          />

          <View className="mb-6">
            <Text className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Jenis Kelamin
            </Text>
            <View className="flex-row gap-3">
              {(["LAKI_LAKI", "PEREMPUAN"] as const).map((g) => (
                <TouchableOpacity
                  key={g}
                  onPress={() => update("gender", g)}
                  className={`flex-1 py-3 rounded-xl border ${
                    form.gender === g
                      ? "bg-teal-50 border-teal-500"
                      : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                  }`}
                >
                  <Text
                    className={`text-center font-medium ${
                      form.gender === g
                        ? "text-teal-700"
                        : "text-slate-600 dark:text-slate-300"
                    }`}
                  >
                    {g === "LAKI_LAKI" ? "Laki-laki" : "Perempuan"}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <TouchableOpacity
            onPress={handleRegister}
            disabled={loading}
            className="bg-teal-600 py-3.5 rounded-xl items-center"
          >
            <Text className="text-white font-semibold text-base">
              {loading ? "Memuat..." : "Daftar"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="mt-6 items-center mb-8"
          >
            <Text className="text-slate-500 dark:text-slate-400">
              Sudah punya akun?{" "}
              <Text className="text-teal-600 font-semibold">Masuk</Text>
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function InputField({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType,
}: {
  label: string;
  value: string;
  onChangeText: (v: string) => void;
  placeholder: string;
  keyboardType?: "default" | "email-address" | "number-pad" | "phone-pad";
}) {
  return (
    <View className="mb-4">
      <Text className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
        {label}
      </Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#94a3b8"
        keyboardType={keyboardType}
        autoCapitalize="none"
        className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-800 dark:text-white"
      />
    </View>
  );
}
