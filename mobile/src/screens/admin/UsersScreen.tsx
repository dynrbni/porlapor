import { View, Text, FlatList, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getUsers,
  toggleUserActive,
  deleteUser,
} from "../../api/users";

export default function UsersScreen() {
  const queryClient = useQueryClient();
  const { data } = useQuery({
    queryKey: ["users"],
    queryFn: () => getUsers({}),
  });

  const toggleMut = useMutation({
    mutationFn: toggleUserActive,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  const deleteMut = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  function handleToggle(id: string) {
    Alert.alert("Ubah Status", "Non/aktifkan pengguna?", [
      { text: "Batal", style: "cancel" },
      {
        text: "OK",
        onPress: () => toggleMut.mutate(id),
      },
    ]);
  }

  function handleDelete(id: string) {
    Alert.alert("Hapus Pengguna", "Yakin ingin menghapus?", [
      { text: "Batal", style: "cancel" },
      {
        text: "Hapus",
        style: "destructive",
        onPress: () => deleteMut.mutate(id),
      },
    ]);
  }

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-slate-900">
      <View className="px-6 py-4">
        <Text className="text-2xl font-bold text-slate-800 dark:text-white">
          Pengguna
        </Text>
        <Text className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Kelola pengguna aplikasi
        </Text>
      </View>

      <FlatList
        data={data?.data ?? []}
        keyExtractor={(item) => item.id}
        contentContainerClassName="px-6 pb-6"
        renderItem={({ item }) => (
          <View className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4 mb-3">
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center gap-3 flex-1">
                <View className="w-10 h-10 bg-teal-100 dark:bg-teal-900/50 rounded-full items-center justify-center">
                  <Ionicons name="person" size={20} color="#0f766e" />
                </View>
                <View className="flex-1">
                  <Text className="font-semibold text-slate-800 dark:text-white">
                    {item.name}
                  </Text>
                  <Text className="text-xs text-slate-500">{item.email}</Text>
                  <View className="flex-row items-center gap-2 mt-1">
                    <View className="bg-teal-50 dark:bg-teal-950/30 px-2 py-0.5 rounded-full">
                      <Text className="text-xs text-teal-600 dark:text-teal-400">
                        {item.role}
                      </Text>
                    </View>
                    <View
                      className={`w-2 h-2 rounded-full ${
                        item.isActive ? "bg-green-500" : "bg-red-400"
                      }`}
                    />
                  </View>
                </View>
              </View>
              <View className="flex-row gap-2">
                <TouchableOpacity onPress={() => handleToggle(item.id)}>
                  <Ionicons
                    name={item.isActive ? "pause" : "play"}
                    size={18}
                    color="#0f766e"
                  />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDelete(item.id)}>
                  <Ionicons name="trash" size={18} color="#ef4444" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <Text className="text-center text-slate-400 mt-10">
            Belum ada pengguna
          </Text>
        }
      />
    </SafeAreaView>
  );
}
