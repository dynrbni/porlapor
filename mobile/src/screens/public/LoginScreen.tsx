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
    <SafeAreaView className="flex-1 bg-background">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          contentContainerClassName="flex-1 justify-center px-6"
          keyboardShouldPersistTaps="handled"
        >
          <TouchableOpacity onPress={() => navigation.goBack()} className="mb-8">
            <ArrowLeft size={24} color="#444651" />
          </TouchableOpacity>

          <Text className="font-sans text-2xl font-bold text-on-surface mb-2">
            Selamat Datang
          </Text>
          <Text className="font-body text-base text-on-surface-variant mb-10">
            Masuk ke akun Anda untuk melanjutkan
          </Text>

          <View className="mb-4">
            <Text className="font-body text-xs font-semibold text-on-surface mb-2">Email</Text>
            <View className="flex-row items-center bg-surface-container border border-outline-variant rounded-xl px-4">
              <Mail size={18} color="#757682" />
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

          <View className="mb-8">
            <Text className="font-body text-xs font-semibold text-on-surface mb-2">
              Password
            </Text>
            <View className="flex-row items-center bg-surface-container border border-outline-variant rounded-xl px-4">
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
                {showPass ? (
                  <EyeOff size={18} color="#757682" />
                ) : (
                  <Eye size={18} color="#757682" />
                )}
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            onPress={handleLogin}
            disabled={loading}
            className="bg-primary py-4 rounded-full items-center shadow-md"
          >
            <Text className="text-on-primary font-sans text-sm font-semibold">
              {loading ? "Memuat..." : "Masuk"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate("Register")}
            className="mt-8 items-center"
          >
            <Text className="font-body text-base text-on-surface-variant">
              Belum punya akun?{" "}
              <Text className="text-primary font-bold">Daftar</Text>
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
