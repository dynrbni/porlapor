import { useState } from "react";
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
import { Mail, Lock, Eye, EyeOff, ArrowLeft, AlertCircle } from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { PublicStackParamList } from "../../navigation/PublicNavigator";
import { useAuth } from "../../context/AuthContext";
import { colors } from "../../theme";

export default function LoginScreen() {
  const { login } = useAuth();
  const navigation = useNavigation<NativeStackNavigationProp<PublicStackParamList>>();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin() {
    if (!email.trim() || !password) {
      setError("Email dan password wajib diisi.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await login({ email: email.trim(), password });
    } catch (err: any) {
      setError(err?.response?.data?.message || "Login gagal. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  }

  const inputCls =
    "bg-surface-container-lowest border border-outline-variant rounded-xl pl-10 pr-4 py-3.5 font-body text-sm text-on-surface";

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top", "bottom"]}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1">
        <ScrollView contentContainerClassName="flex-grow" keyboardShouldPersistTaps="handled">
          <View className="bg-primary px-6 pt-4 pb-10">
            <TouchableOpacity onPress={() => navigation.goBack()} className="flex-row items-center gap-2 mb-8">
              <ArrowLeft size={18} color="#fff" />
              <Text className="font-body text-sm text-white/80">Beranda</Text>
            </TouchableOpacity>
            <Text className="font-sans text-3xl font-bold text-white mb-2">Selamat Datang 👋</Text>
            <Text className="font-body text-sm text-white/75">
              Masuk menggunakan akun PorLapor Anda untuk melanjutkan.
            </Text>
          </View>

          <View className="flex-1 bg-background px-6 -mt-4 pt-8 pb-8">
            {error ? (
              <View className="bg-error-container border-l-4 border-error p-4 rounded-lg flex-row gap-3 mb-5">
                <AlertCircle size={20} color={colors.error} />
                <Text className="font-body text-sm text-on-error-container flex-1">{error}</Text>
              </View>
            ) : null}

            <Text className="font-body text-sm font-semibold text-on-surface mb-2">Alamat Email</Text>
            <View className="relative mb-4">
              <View className="absolute left-3.5 top-3.5">
                <Mail size={18} color={colors.onSurfaceVariant} />
              </View>
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="contoh@email.com"
                placeholderTextColor="#94a3b8"
                keyboardType="email-address"
                autoCapitalize="none"
                className={inputCls}
              />
            </View>

            <View className="flex-row justify-between items-center mb-2">
              <Text className="font-body text-sm font-semibold text-on-surface">Password</Text>
              <Text className="font-body text-xs font-semibold text-primary">Lupa Password?</Text>
            </View>
            <View className="relative mb-4">
              <View className="absolute left-3.5 top-3.5">
                <Lock size={18} color={colors.onSurfaceVariant} />
              </View>
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="Masukkan password Anda"
                placeholderTextColor="#94a3b8"
                secureTextEntry={!showPass}
                className={`${inputCls} pr-12`}
              />
              <TouchableOpacity onPress={() => setShowPass(!showPass)} className="absolute right-3.5 top-3.5">
                {showPass ? <EyeOff size={18} color={colors.onSurfaceVariant} /> : <Eye size={18} color={colors.onSurfaceVariant} />}
              </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={() => setRemember(!remember)} className="flex-row items-center gap-2.5 mb-6">
              <View className={`w-4 h-4 rounded border ${remember ? "bg-primary border-primary" : "border-outline"}`} />
              <Text className="font-body text-sm text-on-surface-variant">Ingat saya</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleLogin}
              disabled={loading}
              className="bg-primary py-4 rounded-xl items-center mb-6"
              style={{ opacity: loading ? 0.7 : 1 }}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text className="font-sans text-sm font-bold text-on-primary">Masuk Sekarang</Text>
              )}
            </TouchableOpacity>

            <View className="flex-row items-center gap-4 mb-5">
              <View className="flex-1 h-px bg-outline-variant" />
              <Text className="font-body text-xs text-on-surface-variant">Belum Memiliki Akun?</Text>
              <View className="flex-1 h-px bg-outline-variant" />
            </View>

            <TouchableOpacity
              onPress={() => navigation.navigate("Register")}
              className="border-2 border-outline-variant py-4 rounded-xl items-center"
            >
              <Text className="font-sans text-sm font-bold text-on-surface">Buat Akun Baru</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
