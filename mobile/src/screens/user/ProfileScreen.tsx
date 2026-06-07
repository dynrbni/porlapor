import { View, Text, TouchableOpacity, Alert, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { User, LogOut, Shield, Mail, Phone, MapPin, CreditCard, Gender } from "lucide-react-native";
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
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView contentContainerClassName="px-5 pt-4 pb-8">
        <View className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm p-6 items-center mb-4">
          <View className="w-20 h-20 bg-surface-container rounded-full items-center justify-center mb-4">
            <User size={36} color="#00236f" />
          </View>
          <Text className="font-sans text-lg font-bold text-on-surface mb-1">
            {user?.name}
          </Text>
          <Text className="font-body text-sm text-on-surface-variant mb-3">{user?.email}</Text>
          <View className="bg-primary-fixed px-4 py-1.5 rounded-full">
            <Text className="font-body text-xs font-semibold text-primary uppercase tracking-wide">
              {user?.role}
            </Text>
          </View>
        </View>

        <View className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm p-5 mb-4">
          <ProfileRow icon={CreditCard} label="NIK" value={user?.nik || "-"} />
          <View className="h-px bg-outline-variant my-3" />
          <ProfileRow icon={Phone} label="Telepon" value={user?.phone || "-"} />
          <View className="h-px bg-outline-variant my-3" />
          <ProfileRow icon={MapPin} label="Alamat" value={user?.address || "-"} />
          <View className="h-px bg-outline-variant my-3" />
          <ProfileRow
            icon={User}
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

        <TouchableOpacity
          onPress={handleLogout}
          className="flex-row items-center justify-center bg-error-container border border-error-container py-4 rounded-xl"
        >
          <LogOut size={18} color="#93000a" />
          <Text className="text-on-error-container font-sans text-sm font-semibold ml-2">Keluar</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

function ProfileRow({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <View className="flex-row items-center">
      <Icon size={16} color="#757682" style={{ marginRight: 12 }} />
      <View className="flex-1 flex-row justify-between items-center">
        <Text className="font-body text-sm text-on-surface-variant">{label}</Text>
        <Text className="font-body text-xs font-semibold text-on-surface font-semibold">{value}</Text>
      </View>
    </View>
  );
}
