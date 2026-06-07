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
  Switch,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeft, Eye, EyeOff, Person, Lock, ArrowForward, ShieldLock } from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { PublicStackParamList } from "../../navigation/PublicNavigator";
import { useAuth } from "../../context/AuthContext";

export default function LoginScreen() {
  const { login } = useAuth();
  const navigation = useNavigation<NativeStackNavigationProp<PublicStackParamList>>();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    if (!email || !password) {
      Alert.alert("Error", "Email dan password harus diisi");
      return;
    }
    setLoading(true);
    try {
      await login({ email, password });
    } catch (err: any) {
      Alert.alert("Login Gagal", err.response?.data?.message || "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1">
        <ScrollView contentContainerClassName="px-6 py-6" keyboardShouldPersistTaps="handled">
          <TouchableOpacity onPress={() => navigation.goBack()} className="mb-6">
            <ArrowLeft size={24} color="#444651" />
          </TouchableOpacity>

          <View className="items-center mb-8">
            <View className="flex-row items-center gap-3 mb-4">
              <View className="w-12 h-12 bg-primary rounded-xl items-center justify-center">
                <Text className="text-on-primary font-sans text-xl font-bold">P</Text>
              </View>
              <Text className="font-sans text-2xl font-bold text-primary">PorLapor</Text>
            </View>
            <Text className="font-body text-base text-on-surface-variant text-center leading-relaxed">
              Layanan Aspirasi dan Pengaduan Online Rakyat
            </Text>
            <Text className="font-body text-sm text-outline text-center mt-2 leading-relaxed">
              Sampaikan laporan Anda dengan aman dan transparan. Bersama membangun tata kelola pemerintahan yang lebih baik.
            </Text>
          </View>

          <View className="bg-surface rounded-xl border border-outline-variant p-6 mb-6">
            <View className="flex-row items-center gap-2 mb-6">
              <View className="w-8 h-8 bg-primary-fixed rounded-lg items-center justify-center">
                <Text className="text-primary font-sans text-sm font-bold">P</Text>
              </View>
              <Text className="font-sans text-lg font-bold text-on-surface">PorLapor</Text>
            </View>

            <Text className="font-sans text-xl font-bold text-on-surface mb-1">Masuk ke Akun Anda</Text>
            <Text className="font-body text-sm text-on-surface-variant mb-6">Silakan masukkan kredensial Anda untuk melanjutkan.</Text>

            <View className="mb-4">
              <Text className="font-body text-xs font-semibold text-on-surface mb-2">Email atau Nomor Telepon</Text>
              <View className="flex-row items-center bg-surface-container-lowest border border-outline-variant rounded-xl px-4">
                <Person size={18} color="#757682" />
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Masukkan email"
                  placeholderTextColor="#757682"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  className="flex-1 ml-3 py-4 font-body text-base text-on-surface"
                />
              </View>
            </View>

            <View className="mb-2">
              <Text className="font-body text-xs font-semibold text-on-surface mb-2">Password</Text>
              <View className="flex-row items-center bg-surface-container-lowest border border-outline-variant rounded-xl px-4">
                <Lock size={18} color="#757682" />
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Masukkan password"
                  placeholderTextColor="#757682"
                  secureTextEntry={!showPass}
                  className="flex-1 ml-3 py-4 font-body text-base text-on-surface"
                />
                <TouchableOpacity onPress={() => setShowPass(!showPass)}>
                  {showPass ? <EyeOff size={18} color="#757682" /> : <Eye size={18} color="#757682" />}
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity className="self-end mb-4">
              <Text className="font-body text-sm text-primary font-semibold">Lupa Password?</Text>
            </TouchableOpacity>

            <View className="flex-row items-center mb-6">
              <Switch
                value={remember}
                onValueChange={setRemember}
                trackColor={{ false: "#c5c5d3", true: "#b6c4ff" }}
                thumbColor={remember ? "#00236f" : "#f8f9ff"}
              />
              <Text className="font-body text-sm text-on-surface-variant ml-3">Ingat saya di perangkat ini</Text>
            </View>

            <TouchableOpacity
              onPress={handleLogin}
              disabled={loading}
              className="bg-primary py-3.5 rounded-full items-center flex-row justify-center gap-2 shadow-md"
            >
              <Text className="text-on-primary font-sans text-sm font-semibold">{loading ? "Memuat..." : "Masuk"}</Text>
              <ArrowForward size={18} color="#fff" />
            </TouchableOpacity>
          </View>

          <View className="items-center gap-4">
            <View className="flex-row items-center gap-4 w-full">
              <View className="flex-1 h-px bg-outline-variant" />
              <Text className="font-body text-sm text-outline">Atau</Text>
              <View className="flex-1 h-px bg-outline-variant" />
            </View>

            <TouchableOpacity onPress={() => navigation.navigate("Register")}>
              <Text className="font-body text-base text-on-surface-variant">
                Belum punya akun?{" "}
                <Text className="text-primary font-bold">Daftar Sekarang</Text>
              </Text>
            </TouchableOpacity>

            <View className="flex-row items-center gap-2 mt-2">
              <ShieldLock size={14} color="#757682" />
              <Text className="font-body text-xs text-outline">Koneksi Aman &amp; Terenkripsi</Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
