import { View, Text, TouchableOpacity, Alert, ScrollView, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  User,
  LogOut,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  Calendar,
  Settings,
  Bell,
  HelpCircle,
  ChevronRight,
  Shield,
} from "lucide-react-native";
import { useAuth } from "../../context/AuthContext";

export default function ProfileScreen() {
  const { user, logout } = useAuth();

  function handleLogout() {
    Alert.alert("Keluar", "Yakin ingin keluar dari akun Anda?", [
      { text: "Batal", style: "cancel" },
      { text: "Keluar", style: "destructive", onPress: logout },
    ]);
  }

  const initials = user?.name
    ?.split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase() || "U";

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <ScrollView contentContainerClassName="pb-8" showsVerticalScrollIndicator={false}>
        <View className="px-5 pt-3 pb-2">
          <Text className="font-sans text-2xl font-extrabold text-on-surface">Profil Saya</Text>
        </View>

        <View className="mx-5 mt-3 mb-5 bg-white rounded-3xl border border-outline-variant p-6 items-center shadow-sm">
          {user?.photoUrl ? (
            <Image source={{ uri: user.photoUrl }} className="w-20 h-20 rounded-full mb-3" />
          ) : (
            <View className="w-20 h-20 bg-primary-soft rounded-full items-center justify-center mb-3">
              <Text className="font-sans text-2xl font-extrabold text-primary">{initials}</Text>
            </View>
          )}
          <Text className="font-sans text-lg font-extrabold text-on-surface mb-0.5" numberOfLines={1}>
            {user?.name}
          </Text>
          <Text className="font-body text-sm text-on-surface-variant mb-3" numberOfLines={1}>
            {user?.email}
          </Text>
          <View className={`px-4 py-1.5 rounded-full ${user?.role === "USER" ? "bg-primary-soft" : "bg-secondary-soft"}`}>
            <Text className={`font-body text-[11px] font-bold uppercase tracking-wider ${user?.role === "USER" ? "text-primary" : "text-secondary"}`}>
              {user?.role}
            </Text>
          </View>
        </View>

        <View className="mx-5 mb-5 bg-white rounded-2xl border border-outline-variant shadow-sm overflow-hidden">
          <View className="px-4 py-3 border-b border-outline-variant">
            <Text className="font-sans text-xs font-extrabold text-on-surface-variant uppercase tracking-wider">
              Informasi Akun
            </Text>
          </View>
          <View className="p-2">
            <ProfileRow icon={CreditCard} label="NIK" value={user?.nik || "-"} />
            <ProfileRow icon={Phone} label="Telepon" value={user?.phone || "-"} />
            <ProfileRow icon={MapPin} label="Alamat" value={user?.address || "-"} isLast />
          </View>
        </View>

        <View className="mx-5 mb-5 bg-white rounded-2xl border border-outline-variant shadow-sm overflow-hidden">
          <View className="px-4 py-3 border-b border-outline-variant">
            <Text className="font-sans text-xs font-extrabold text-on-surface-variant uppercase tracking-wider">
              Pengaturan
            </Text>
          </View>
          <View className="p-2">
            <ActionRow icon={Bell} label="Notifikasi" />
            <ActionRow icon={Shield} label="Keamanan Akun" />
            <ActionRow icon={HelpCircle} label="Bantuan & FAQ" isLast />
          </View>
        </View>

        <View className="mx-5">
          <TouchableOpacity
            onPress={handleLogout}
            activeOpacity={0.85}
            className="flex-row items-center justify-center bg-error-container border border-red-200 py-4 rounded-2xl"
          >
            <LogOut size={18} color="#dc2626" />
            <Text className="text-red-600 font-sans text-sm font-bold ml-2">Keluar</Text>
          </TouchableOpacity>
        </View>

        <View className="items-center mt-8">
          <Text className="text-on-surface-variant font-body text-xs">
            PorLapor v1.0.0 · Layanan Aspirasi dan Pengaduan
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function ProfileRow({ icon: Icon, label, value, isLast }: { icon: any; label: string; value: string; isLast?: boolean }) {
  return (
    <View className={`flex-row items-center px-2 py-3 ${!isLast ? "border-b border-outline-variant" : ""}`}>
      <View className="w-9 h-9 bg-primary-soft rounded-lg items-center justify-center mr-3">
        <Icon size={16} color="#007AFF" />
      </View>
      <View className="flex-1">
        <Text className="font-body text-xs text-on-surface-variant">{label}</Text>
        <Text className="font-body text-sm font-semibold text-on-surface mt-0.5" numberOfLines={1}>
          {value}
        </Text>
      </View>
    </View>
  );
}

function ActionRow({ icon: Icon, label, isLast }: { icon: any; label: string; isLast?: boolean }) {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      className={`flex-row items-center px-2 py-3.5 ${!isLast ? "border-b border-outline-variant" : ""}`}
    >
      <View className="w-9 h-9 bg-surface-container-low rounded-lg items-center justify-center mr-3">
        <Icon size={16} color="#475569" />
      </View>
      <Text className="flex-1 font-body text-sm font-semibold text-on-surface">{label}</Text>
      <ChevronRight size={16} color="#94a3b8" />
    </TouchableOpacity>
  );
}
