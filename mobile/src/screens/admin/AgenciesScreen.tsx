import { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAgencies,
  createAgency,
  updateAgency,
  deleteAgency,
  toggleAgencyActive,
} from "../../api/agencies";
import type { Agency } from "../../types";

export default function AgenciesScreen() {
  const queryClient = useQueryClient();
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<Agency | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const { data } = useQuery({
    queryKey: ["agencies"],
    queryFn: getAgencies,
  });

  const createMut = useMutation({
    mutationFn: createAgency,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["agencies"] });
      closeModal();
    },
  });

  const deleteMut = useMutation({
    mutationFn: deleteAgency,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["agencies"] });
    },
  });

  const toggleMut = useMutation({
    mutationFn: toggleAgencyActive,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["agencies"] });
    },
  });

  function openCreate() {
    setEditing(null);
    setName("");
    setDescription("");
    setModal(true);
  }

  function closeModal() {
    setModal(false);
    setEditing(null);
    setName("");
    setDescription("");
  }

  function handleSave() {
    if (!name) {
      Alert.alert("Error", "Nama instansi harus diisi");
      return;
    }
    createMut.mutate({ name, description });
  }

  function handleDelete(id: string) {
    Alert.alert("Hapus Instansi", "Yakin ingin menghapus?", [
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
      <View className="flex-row items-center justify-between px-6 py-4">
        <View>
          <Text className="text-2xl font-bold text-slate-800 dark:text-white">
            Instansi
          </Text>
          <Text className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Kelola instansi terkait
          </Text>
        </View>
        <TouchableOpacity
          onPress={openCreate}
          className="bg-teal-600 w-10 h-10 rounded-xl items-center justify-center"
        >
          <Ionicons name="add" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={data?.data ?? []}
        keyExtractor={(item) => item.id}
        contentContainerClassName="px-6 pb-6"
        renderItem={({ item }) => (
          <View className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4 mb-3">
            <View className="flex-row justify-between items-start">
              <View className="flex-1">
                <View className="flex-row items-center gap-2">
                  <Text className="font-semibold text-slate-800 dark:text-white">
                    {item.name}
                  </Text>
                  <View
                    className={`w-2 h-2 rounded-full ${
                      item.isActive ? "bg-green-500" : "bg-red-400"
                    }`}
                  />
                </View>
                {item.description && (
                  <Text className="text-sm text-slate-500 mt-1">
                    {item.description}
                  </Text>
                )}
              </View>
              <View className="flex-row gap-2 ml-3">
                <TouchableOpacity onPress={() => toggleMut.mutate(item.id)}>
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
            Belum ada instansi
          </Text>
        }
      />

      <Modal visible={modal} transparent animationType="fade">
        <View className="flex-1 bg-black/50 justify-center px-6">
          <View className="bg-white dark:bg-slate-800 rounded-2xl p-6">
            <Text className="text-lg font-bold text-slate-800 dark:text-white mb-4">
              Instansi Baru
            </Text>

            <Text className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Nama
            </Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Nama instansi"
              placeholderTextColor="#94a3b8"
              className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-800 dark:text-white mb-4"
            />

            <Text className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Deskripsi
            </Text>
            <TextInput
              value={description}
              onChangeText={setDescription}
              placeholder="Deskripsi (opsional)"
              placeholderTextColor="#94a3b8"
              multiline
              className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-800 dark:text-white mb-6"
            />

            <View className="flex-row gap-3">
              <TouchableOpacity
                onPress={closeModal}
                className="flex-1 bg-slate-100 dark:bg-slate-700 py-3 rounded-xl items-center"
              >
                <Text className="font-medium text-slate-700 dark:text-slate-300">
                  Batal
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleSave}
                className="flex-1 bg-teal-600 py-3 rounded-xl items-center"
              >
                <Text className="font-medium text-white">Simpan</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
