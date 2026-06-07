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
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeft, Eye, EyeOff, Mail, Lock, ShieldCheck } from "lucide-react-native";
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
        <ScrollView
          contentContainerClassName="flex-1 px-6 py-6"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <TouchableOpacity onPress={() => navigation.goBack()} className="w-10 h-10 items-center justify-center rounded-full bg-white border border-outline-variant mb-6">
            <ArrowLeft size={20} color="#0f172a" />
          </TouchableOpacity>

          <View className="items-center mb-8">
            <Image
              source={require("../../../assets/images/porlapor_logo.png")}
              className="h-16 w-auto mb-3"
              resizeMode="contain"
            />
            <Text className="font-body text-sm text-on-surface-variant text-center leading-relaxed">
              Layanan Aspirasi dan Pengaduan Online Rakyat
            </Text>
          </View>

          <View className="bg-white rounded-2xl border border-outline-variant p-6 mb-6 shadow-sm">
            <Text className="font-sans text-2xl font-extrabold text-on-surface mb-1">Masuk ke Akun Anda</Text>
            <Text className="font-body text-sm text-on-surface-variant mb-6">
              Silakan masukkan kredensial Anda untuk melanjutkan.
            </Text>

            <View className="mb-4">
              <Text className="font-body text-xs font-semibold text-on-surface mb-2">Email atau Nomor Telepon</Text>
              <View className="flex-row items-center bg-surface-container-lowest border border-outline-variant rounded-xl px-4 focus:border-primary">
                <Mail size={18} color="#64748b" />
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Masukkan email"
                  placeholderTextColor="#94a3b8"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  className="flex-1 ml-3 py-3.5 font-body text-base text-on-surface"
                />
              </View>
            </View>

            <View className="mb-2">
              <Text className="font-body text-xs font-semibold text-on-surface mb-2">Password</Text>
              <View className="flex-row items-center bg-surface-container-lowest border border-outline-variant rounded-xl px-4 focus:border-primary">
                <Lock size={18} color="#64748b" />
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Masukkan password"
                  placeholderTextColor="#94a3b8"
                  secureTextEntry={!showPass}
                  className="flex-1 ml-3 py-3.5 font-body text-base text-on-surface"
                />
                <TouchableOpacity onPress={() => setShowPass(!showPass)}>
                  {showPass ? <EyeOff size={18} color="#64748b" /> : <Eye size={18} color="#64748b" />}
                </TouchableOpacity>
              </View>
            </View>

            <View className="flex-row items-center justify-between mb-6 mt-3">
              <TouchableOpacity
                onPress={() => setRemember(!remember)}
                className="flex-row items-center"
              >
                <View className={`w-5 h-5 rounded border-2 mr-2 items-center justify-center ${remember ? "bg-primary border-primary" : "border-outline"}`}>
                  {remember && <Text className="text-on-primary text-[11px] font-bold">✓</Text>}
                </View>
                <Text className="font-body text-sm text-on-surface-variant">Ingat saya</Text>
              </TouchableOpacity>
              <TouchableOpacity>
                <Text className="font-body text-sm text-primary font-semibold">Lupa Password?</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              onPress={handleLogin}
              disabled={loading}
              activeOpacity={0.85}
              className="bg-primary py-4 rounded-2xl items-center shadow-soft flex-row justify-center"
            >
              <Text className="text-on-primary font-sans text-base font-bold">
                {loading ? "Memuat..." : "Masuk"}
              </Text>
            </TouchableOpacity>
          </View>

          <View className="items-center gap-4">
            <View className="flex-row items-center gap-4 w-full">
              <View className="flex-1 h-px bg-outline-variant" />
              <Text className="font-body text-sm text-on-surface-variant">atau</Text>
              <View className="flex-1 h-px bg-outline-variant" />
            </View>

            <TouchableOpacity onPress={() => navigation.navigate("Register")}>
              <Text className="font-body text-base text-on-surface-variant">
                Belum punya akun?{" "}
                <Text className="text-primary font-bold">Daftar Sekarang</Text>
              </Text>
            </TouchableOpacity>
          </View>

          <View className="flex-row items-center justify-center gap-2 pt-8">
            <ShieldCheck size={14} color="#0f766e" />
            <Text className="font-body text-xs font-medium text-on-surface-variant">
              Koneksi Aman &amp; Terenkripsi
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
