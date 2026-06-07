import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeft, Building2, Mail, Phone } from "lucide-react-native";
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
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-row items-center px-5 py-3 bg-surface border-b border-outline-variant">
        <TouchableOpacity onPress={() => navigation.goBack()} className="p-1">
          <ArrowLeft size={24} color="#444651" />
        </TouchableOpacity>
        <Text className="flex-1 font-sans text-lg font-bold text-on-surface ml-3">
          Instansi
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
          renderItem={({ item }) => (
            <View className="bg-surface-container-lowest rounded-xl p-4 mb-3 border border-outline-variant shadow-sm">
              <View className="flex-row items-start gap-4">
                <View className="w-12 h-12 bg-primary-fixed rounded-xl items-center justify-center">
                  <Building2 size={24} color="#00236f" />
                </View>
                <View className="flex-1">
                  <Text className="font-sans text-lg font-bold text-on-surface">
                    {item.name}
                  </Text>
                  {item.description && (
                    <Text className="font-body text-sm text-on-surface-variant mt-1 leading-relaxed">
                      {item.description}
                    </Text>
                  )}
                  <View className="flex-row flex-wrap gap-4 mt-3">
                    {item.email ? (
                      <View className="flex-row items-center gap-1">
                        <Mail size={14} color="#757682" />
                        <Text className="font-body text-xs font-semibold text-on-surface-variant">
                          {item.email}
                        </Text>
                      </View>
                    ) : null}
                    {item.phone ? (
                      <View className="flex-row items-center gap-1">
                        <Phone size={14} color="#757682" />
                        <Text className="font-body text-xs font-semibold text-on-surface-variant">
                          {item.phone}
                        </Text>
                      </View>
                    ) : null}
                  </View>
                </View>
              </View>
            </View>
          )}
          ListEmptyComponent={
            <Text className="text-center text-on-surface-variant mt-10 font-body text-base">
              Belum ada instansi
            </Text>
          }
        />
      )}
    </SafeAreaView>
  );
}
