import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { PublicStackParamList } from "../../navigation/PublicNavigator";
import { useQuery } from "@tanstack/react-query";
import { getAgencies } from "../../api/agencies";

type Nav = NativeStackNavigationProp<PublicStackParamList, "Agencies">;

export default function AgenciesScreen() {
  const navigation = useNavigation<Nav>();
  const { data } = useQuery({
    queryKey: ["agencies"],
    queryFn: getAgencies,
  });

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-slate-900">
      <View className="flex-row items-center px-6 py-4">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons
            name="arrow-back"
            size={24}
            className="text-slate-600 dark:text-slate-300"
          />
        </TouchableOpacity>
        <Text className="flex-1 text-lg font-bold text-slate-800 dark:text-white ml-4">
          Instansi
        </Text>
      </View>

      <FlatList
        data={data?.data ?? []}
        keyExtractor={(item) => item.id}
        contentContainerClassName="px-6 pb-6"
        renderItem={({ item }) => (
          <View className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4 mb-3">
            <Text className="font-semibold text-slate-800 dark:text-white">
              {item.name}
            </Text>
            {item.description && (
              <Text className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                {item.description}
              </Text>
            )}
            <View className="flex-row items-center gap-4 mt-3">
              {item.email && (
                <View className="flex-row items-center gap-1">
                  <Ionicons name="mail" size={14} color="#94a3b8" />
                  <Text className="text-xs text-slate-400">{item.email}</Text>
                </View>
              )}
              {item.phone && (
                <View className="flex-row items-center gap-1">
                  <Ionicons name="call" size={14} color="#94a3b8" />
                  <Text className="text-xs text-slate-400">{item.phone}</Text>
                </View>
              )}
            </View>
          </View>
        )}
        ListEmptyComponent={
          <Text className="text-center text-slate-400 mt-10">
            Belum ada instansi
          </Text>
        }
      />
    </SafeAreaView>
  );
}
