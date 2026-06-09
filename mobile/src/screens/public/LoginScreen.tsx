import { useState } from "react";
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
      // Navigation will be handled by RootNavigator automatically
    } catch (err: any) {
      if (err.code === "ECONNABORTED" || err.message?.includes("timeout")) {
        setError("Koneksi ke server timeout. Pastikan server backend berjalan.");
      } else {
        setError(err?.response?.data?.message || "Login gagal. Silakan coba lagi.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top", "bottom"]}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1">
        <ScrollView
          contentContainerClassName="flex-grow pb-10"
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
              Selamat Datang
            </Text>
            <Text className="font-body text-sm text-primary-fixed-dim leading-relaxed pr-10">
              Masuk menggunakan akun PorLapor Anda untuk berkontribusi bagi lingkungan.
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
            {/* Error Message */}
            {error ? (
              <View className="bg-error-container/80 border border-error/50 px-4 py-3.5 rounded-2xl flex-row gap-3 mb-6 items-start">
                <AlertCircle size={18} color={colors.error} style={{ marginTop: 1 }} />
                <Text className="font-body text-sm text-on-error-container flex-1 leading-relaxed">{error}</Text>
              </View>
            ) : null}

            {/* Email Field */}
            <Text className="font-body text-sm font-bold text-on-surface mb-2.5">Alamat Email</Text>
            <View className="relative mb-5">
              <View className="absolute left-4 top-0 bottom-0 justify-center z-10">
                <Mail size={18} color={colors.outline} />
              </View>
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="contoh@email.com"
                placeholderTextColor="#94a3b8"
                keyboardType="email-address"
                autoCapitalize="none"
                className="bg-surface-container-low border border-outline-variant/50 rounded-2xl pl-12 pr-4 h-14 font-body text-sm text-on-surface"
              />
            </View>

            {/* Password Field */}
            <View className="flex-row justify-between items-center mb-2.5">
              <Text className="font-body text-sm font-bold text-on-surface">Password</Text>
              <TouchableOpacity activeOpacity={0.7}>
                <Text className="font-body text-xs font-bold text-primary tracking-wide">Lupa Password?</Text>
              </TouchableOpacity>
            </View>
            <View className="relative mb-6">
              <View className="absolute left-4 top-0 bottom-0 justify-center z-10">
                <Lock size={18} color={colors.outline} />
              </View>
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="Masukkan password Anda"
                placeholderTextColor="#94a3b8"
                secureTextEntry={!showPass}
                className="bg-surface-container-low border border-outline-variant/50 rounded-2xl pl-12 pr-14 h-14 font-body text-sm text-on-surface"
              />
              <TouchableOpacity
                onPress={() => setShowPass(!showPass)}
                className="absolute right-4 top-0 bottom-0 justify-center"
                activeOpacity={0.7}
              >
                {showPass ? (
                  <EyeOff size={18} color={colors.outline} />
                ) : (
                  <Eye size={18} color={colors.outline} />
                )}
              </TouchableOpacity>
            </View>

            {/* Remember me */}
            <TouchableOpacity
              onPress={() => setRemember(!remember)}
              className="flex-row items-center gap-3 mb-8"
              activeOpacity={0.7}
            >
              <View
                className={`w-5 h-5 rounded border-2 items-center justify-center ${
                  remember ? "bg-primary border-primary" : "border-outline-variant bg-surface-container-lowest"
                }`}
              >
                {remember && <Text className="text-white text-[10px] font-bold">✓</Text>}
              </View>
              <Text className="font-body text-sm text-on-surface-variant font-medium">Ingat saya selalu</Text>
            </TouchableOpacity>

            {/* Submit Button */}
            <TouchableOpacity
              onPress={handleLogin}
              disabled={loading}
              activeOpacity={0.85}
              className="bg-primary h-14 rounded-full items-center justify-center"
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
                <Text className="font-sans text-[15px] font-bold text-white tracking-wide">Masuk Sekarang</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Bottom Register CTA */}
          <View className="px-8 mt-10 items-center">
            <View className="flex-row items-center gap-4 mb-6 w-full">
              <View className="flex-1 h-px bg-outline-variant/60" />
              <Text className="font-body text-xs text-on-surface-variant font-semibold tracking-wider uppercase">Atau</Text>
              <View className="flex-1 h-px bg-outline-variant/60" />
            </View>

            <TouchableOpacity
              onPress={() => navigation.navigate("Register")}
              activeOpacity={0.85}
              className="border-2 border-outline-variant/50 h-14 w-full rounded-full items-center justify-center bg-transparent"
            >
              <Text className="font-sans text-[15px] font-bold text-on-surface tracking-wide">Buat Akun Baru</Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
