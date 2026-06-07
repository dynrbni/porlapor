import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeft, Building2, Mail, Phone, MapPin } from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import { getAgencies } from "../../api/agencies";

export default function AgenciesScreen() {
  const navigation = useNavigation();
  const { data, isLoading } = useQuery({
    queryKey: ["agencies"],
    queryFn: getAgencies,
  });

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <View className="flex-row items-center px-5 py-3 bg-white border-b border-outline-variant">
        <TouchableOpacity onPress={() => navigation.goBack()} className="w-9 h-9 items-center justify-center rounded-full bg-surface-container">
          <ArrowLeft size={18} color="#0f172a" />
        </TouchableOpacity>
        <Text className="flex-1 font-sans text-lg font-extrabold text-on-surface ml-3">
          Daftar Instansi
        </Text>
      </View>

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#00236f" />
        </View>
      ) : (
        <FlatList
          data={data ?? []}
          keyExtractor={(item) => item.id}
          contentContainerClassName="p-5"
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View className="bg-white rounded-2xl p-4 mb-3 border border-outline-variant shadow-sm">
              <View className="flex-row items-start gap-3">
                <View className="w-12 h-12 bg-primary-soft rounded-2xl items-center justify-center">
                  <Building2 size={22} color="#00236f" />
                </View>
                <View className="flex-1">
                  <Text className="font-sans text-base font-extrabold text-on-surface">
                    {item.name}
                  </Text>
                  {item.description ? (
                    <Text className="font-body text-sm text-on-surface-variant mt-1 leading-relaxed">
                      {item.description}
                    </Text>
                  ) : null}
                  <View className="flex-col gap-1.5 mt-3">
                    {item.email ? (
                      <View className="flex-row items-center gap-2">
                        <Mail size={13} color="#94a3b8" />
                        <Text className="font-body text-xs text-on-surface-variant" numberOfLines={1}>
                          {item.email}
                        </Text>
                      </View>
                    ) : null}
                    {item.phone ? (
                      <View className="flex-row items-center gap-2">
                        <Phone size={13} color="#94a3b8" />
                        <Text className="font-body text-xs text-on-surface-variant">
                          {item.phone}
                        </Text>
                      </View>
                    ) : null}
                    {item.address ? (
                      <View className="flex-row items-center gap-2">
                        <MapPin size={13} color="#94a3b8" />
                        <Text className="font-body text-xs text-on-surface-variant" numberOfLines={2}>
                          {item.address}
                        </Text>
                      </View>
                    ) : null}
                  </View>
                </View>
              </View>
            </View>
          )}
          ListEmptyComponent={
            <View className="items-center mt-16">
              <View className="w-16 h-16 bg-primary-soft rounded-full items-center justify-center mb-3">
                <Building2 size={28} color="#00236f" />
              </View>
              <Text className="text-on-surface font-sans text-sm font-bold mb-1">Belum ada instansi</Text>
              <Text className="text-on-surface-variant font-body text-xs text-center px-8">
                Daftar instansi yang berwenang akan tampil di sini.
              </Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}
