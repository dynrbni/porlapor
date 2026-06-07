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
    <SafeAreaView className="flex-1 bg-slate-50">
      <View className="flex-row items-center px-6 py-4 bg-white border-b border-slate-100">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeft size={24} color="#475569" />
        </TouchableOpacity>
        <Text className="flex-1 text-lg font-bold text-slate-900 ml-4">
          Instansi
        </Text>
      </View>

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#0f766e" />
        </View>
      ) : (
        <FlatList
          data={data ?? []}
          keyExtractor={(item) => item.id}
          contentContainerClassName="p-6"
          renderItem={({ item }) => (
            <TouchableOpacity className="bg-white rounded-2xl p-5 mb-3 border border-slate-100">
              <View className="flex-row items-start gap-4">
                <View className="w-12 h-12 bg-teal-50 rounded-2xl items-center justify-center">
                  <Building2 size={24} color="#0f766e" />
                </View>
                <View className="flex-1">
                  <Text className="font-bold text-slate-900 text-base">
                    {item.name}
                  </Text>
                  {item.description && (
                    <Text className="text-sm text-slate-500 mt-1 leading-relaxed">
                      {item.description}
                    </Text>
                  )}
                  <View className="flex-row flex-wrap gap-4 mt-3">
                    {item.email ? (
                      <View className="flex-row items-center gap-1">
                        <Mail size={14} color="#94a3b8" />
                        <Text className="text-xs text-slate-400">
                          {item.email}
                        </Text>
                      </View>
                    ) : null}
                    {item.phone ? (
                      <View className="flex-row items-center gap-1">
                        <Phone size={14} color="#94a3b8" />
                        <Text className="text-xs text-slate-400">
                          {item.phone}
                        </Text>
                      </View>
                    ) : null}
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <Text className="text-center text-slate-400 mt-10">
              Belum ada instansi
            </Text>
          }
        />
      )}
    </SafeAreaView>
  );
}
