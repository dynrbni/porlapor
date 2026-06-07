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
import { ArrowLeft, Eye, EyeOff, Mail, Lock } from "lucide-react-native";
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
      Alert.alert(
        "Login Gagal",
        err.response?.data?.message || "Terjadi kesalahan"
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
          contentContainerClassName="flex-1 justify-center px-6"
          keyboardShouldPersistTaps="handled"
        >
          <TouchableOpacity onPress={() => navigation.goBack()} className="mb-8">
            <ArrowLeft size={24} color="#475569" />
          </TouchableOpacity>

          <Text className="text-3xl font-extrabold text-slate-900 mb-2">
            Selamat Datang
          </Text>
          <Text className="text-slate-500 mb-10">
            Masuk ke akun Anda untuk melanjutkan
          </Text>

          <View className="mb-4">
            <Text className="text-sm font-bold text-slate-700 mb-2">Email</Text>
            <View className="flex-row items-center bg-slate-50 border border-slate-200 rounded-2xl px-4">
              <Mail size={18} color="#94a3b8" />
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="Masukkan email"
                placeholderTextColor="#94a3b8"
                keyboardType="email-address"
                autoCapitalize="none"
                className="flex-1 ml-3 py-4 text-slate-900"
              />
            </View>
          </View>

          <View className="mb-8">
            <Text className="text-sm font-bold text-slate-700 mb-2">
              Password
            </Text>
            <View className="flex-row items-center bg-slate-50 border border-slate-200 rounded-2xl px-4">
              <Lock size={18} color="#94a3b8" />
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="Masukkan password"
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
            onPress={handleLogin}
            disabled={loading}
            className="bg-teal-600 py-4 rounded-2xl items-center shadow-lg shadow-teal-500/25"
          >
            <Text className="text-white font-bold text-lg">
              {loading ? "Memuat..." : "Masuk"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate("Register")}
            className="mt-8 items-center"
          >
            <Text className="text-slate-500">
              Belum punya akun?{" "}
              <Text className="text-teal-600 font-bold">Daftar</Text>
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
