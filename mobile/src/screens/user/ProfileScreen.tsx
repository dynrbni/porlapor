import { View, Text, TouchableOpacity, ScrollView, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../context/AuthContext";

export default function ProfileScreen() {
  const { user, logout } = useAuth();

  function handleLogout() {
    Alert.alert("Keluar", "Yakin ingin keluar?", [
      { text: "Batal", style: "cancel" },
      { text: "Keluar", style: "destructive", onPress: logout },
    ]);
  }

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-slate-900">
      <ScrollView contentContainerClassName="px-6 py-6">
        <View className="items-center mb-8">
          <View className="w-20 h-20 bg-teal-100 dark:bg-teal-900/50 rounded-full items-center justify-center mb-4">
            <Ionicons name="person" size={36} color="#0f766e" />
          </View>
          <Text className="text-xl font-bold text-slate-800 dark:text-white">
            {user?.name}
          </Text>
          <Text className="text-sm text-slate-500 dark:text-slate-400">
            {user?.email}
          </Text>
          <View className="bg-teal-50 dark:bg-teal-950/30 px-4 py-1 rounded-full mt-2">
            <Text className="text-xs font-medium text-teal-600 dark:text-teal-400">
              {user?.role}
            </Text>
          </View>
        </View>

        <View className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4 mb-4">
          <ProfileRow label="NIK" value={user?.nik ?? "-"} />
          <View className="h-px bg-slate-200 dark:bg-slate-700 my-3" />
          <ProfileRow label="Telepon" value={user?.phone ?? "-"} />
          <View className="h-px bg-slate-200 dark:bg-slate-700 my-3" />
          <ProfileRow label="Alamat" value={user?.address ?? "-"} />
          <View className="h-px bg-slate-200 dark:bg-slate-700 my-3" />
          <ProfileRow
            label="Jenis Kelamin"
            value={
              user?.gender === "LAKI_LAKI" ? "Laki-laki" : "Perempuan"
            }
          />
        </View>

        <TouchableOpacity
          onPress={handleLogout}
          className="flex-row items-center justify-center bg-red-50 dark:bg-red-950/30 py-3.5 rounded-xl"
        >
          <Ionicons name="log-out" size={20} color="#ef4444" />
          <Text className="text-red-500 font-semibold ml-2">Keluar</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

function ProfileRow({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-row justify-between">
      <Text className="text-sm text-slate-500 dark:text-slate-400">
        {label}
      </Text>
      <Text className="text-sm font-medium text-slate-800 dark:text-white">
        {value}
      </Text>
    </View>
  );
}
