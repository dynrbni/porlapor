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

export default function LoginScreen() {
  const { login } = useAuth();
  const navigation = useNavigation();
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
    <SafeAreaView className="flex-1 bg-white dark:bg-slate-900">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          contentContainerClassName="flex-1 justify-center px-6"
          keyboardShouldPersistTaps="handled"
        >
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="mb-8"
          >
            <Ionicons
              name="arrow-back"
              size={24}
              className="text-slate-600 dark:text-slate-300"
            />
          </TouchableOpacity>

          <Text className="text-3xl font-bold text-slate-800 dark:text-white mb-2">
            Selamat Datang
          </Text>
          <Text className="text-slate-500 dark:text-slate-400 mb-8">
            Masuk ke akun Anda untuk melanjutkan
          </Text>

          <View className="mb-4">
            <Text className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Email
            </Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="Masukkan email"
              placeholderTextColor="#94a3b8"
              keyboardType="email-address"
              autoCapitalize="none"
              className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-800 dark:text-white"
            />
          </View>

          <View className="mb-6">
            <Text className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Password
            </Text>
            <View className="flex-row items-center bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl">
              <TextInput
                value={password}
                onChangeText={setPassword}
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

          <TouchableOpacity
            onPress={handleLogin}
            disabled={loading}
            className="bg-teal-600 py-3.5 rounded-xl items-center"
          >
            <Text className="text-white font-semibold text-base">
              {loading ? "Memuat..." : "Masuk"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate("Register" as never)}
            className="mt-6 items-center"
          >
            <Text className="text-slate-500 dark:text-slate-400">
              Belum punya akun?{" "}
              <Text className="text-teal-600 font-semibold">Daftar</Text>
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
