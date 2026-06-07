import { View, Text, TouchableOpacity, Alert, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { User, LogOut, Shield } from "lucide-react-native";
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
    <SafeAreaView className="flex-1 bg-slate-50">
      <ScrollView contentContainerClassName="p-6">
        {/* Profile Header */}
        <View className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm items-center mb-4">
          <View className="w-20 h-20 bg-teal-100 rounded-full items-center justify-center mb-4">
            <User size={36} color="#0f766e" />
          </View>
          <Text className="text-xl font-extrabold text-slate-900">
            {user?.name}
          </Text>
          <Text className="text-sm text-slate-500 mt-1">{user?.email}</Text>
          <View className="bg-teal-50 px-4 py-1.5 rounded-full mt-3">
            <Text className="text-xs font-bold text-teal-700 uppercase tracking-wide">
              {user?.role}
            </Text>
          </View>
        </View>

        {/* Info */}
        <View className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm mb-4">
          <ProfileRow label="NIK" value={user?.nik || "-"} />
          <View className="h-px bg-slate-100 my-3" />
          <ProfileRow label="Telepon" value={user?.phone || "-"} />
          <View className="h-px bg-slate-100 my-3" />
          <ProfileRow label="Alamat" value={user?.address || "-"} />
          <View className="h-px bg-slate-100 my-3" />
          <ProfileRow
            label="Jenis Kelamin"
            value={
              user?.gender === "LAKI_LAKI"
                ? "Laki-laki"
                : user?.gender === "PEREMPUAN"
                  ? "Perempuan"
                  : "-"
            }
          />
        </View>

        {/* Logout */}
        <TouchableOpacity
          onPress={handleLogout}
          className="flex-row items-center justify-center bg-red-50 border border-red-100 py-4 rounded-2xl"
        >
          <LogOut size={18} color="#ef4444" />
          <Text className="text-red-500 font-bold ml-2">Keluar</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

function ProfileRow({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-row justify-between">
      <Text className="text-sm text-slate-500 font-medium">{label}</Text>
      <Text className="text-sm font-bold text-slate-900">{value}</Text>
    </View>
  );
}
