import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createReport } from "../../api/reports";
import { getCategories } from "../../api/categories";
import { getAgencies } from "../../api/agencies";

export default function CreateReportScreen() {
  const navigation = useNavigation();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [agencyId, setAgencyId] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [address, setAddress] = useState("");
  const [image, setImage] = useState<string | null>(null);

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: () => getCategories(),
  });

  const { data: agencies } = useQuery({
    queryKey: ["agencies"],
    queryFn: () => getAgencies(),
  });

  const mutation = useMutation({
    mutationFn: createReport,
    onSuccess: () => {
      Alert.alert("Berhasil", "Laporan berhasil dikirim", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    },
    onError: (err: any) => {
      Alert.alert("Gagal", err.response?.data?.message || "Terjadi kesalahan");
    },
  });

  async function pickImage() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      quality: 0.8,
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  }

  function handleSubmit() {
    if (!title || !description || !categoryId) {
      Alert.alert("Error", "Judul, deskripsi, dan kategori harus diisi");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("categoryId", categoryId);
    if (agencyId) formData.append("agencyId", agencyId);
    if (latitude) formData.append("latitude", latitude);
    if (longitude) formData.append("longitude", longitude);
    if (address) formData.append("address", address);
    if (image) {
      const filename = image.split("/").pop() ?? "photo.jpg";
      const ext = filename.split(".").pop() ?? "jpg";
      formData.append("image", {
        uri: image,
        name: filename,
        type: `image/${ext}`,
      } as any);
    }

    mutation.mutate(formData);
  }

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-slate-900">
      <ScrollView
        contentContainerClassName="px-6 pb-8"
        keyboardShouldPersistTaps="handled"
      >
        <View className="flex-row items-center py-4">
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons
              name="close"
              size={24}
              className="text-slate-600 dark:text-slate-300"
            />
          </TouchableOpacity>
          <Text className="flex-1 text-lg font-bold text-slate-800 dark:text-white ml-4">
            Buat Laporan
          </Text>
        </View>

        <View className="mb-4">
          <Text className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
            Judul Laporan
          </Text>
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="Masukkan judul laporan"
            placeholderTextColor="#94a3b8"
            className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-800 dark:text-white"
          />
        </View>

        <View className="mb-4">
          <Text className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
            Deskripsi
          </Text>
          <TextInput
            value={description}
            onChangeText={setDescription}
            placeholder="Jelaskan detail laporan Anda"
            placeholderTextColor="#94a3b8"
            multiline
            numberOfLines={5}
            textAlignVertical="top"
            className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-800 dark:text-white min-h-[120px]"
          />
        </View>

        <View className="mb-4">
          <Text className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
            Kategori
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {categories?.data?.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                onPress={() => setCategoryId(cat.id)}
                className={`px-4 py-2 rounded-xl mr-2 ${
                  categoryId === cat.id
                    ? "bg-teal-600"
                    : "bg-slate-100 dark:bg-slate-800"
                }`}
              >
                <Text
                  className={`text-sm font-medium ${
                    categoryId === cat.id ? "text-white" : "text-slate-700 dark:text-slate-300"
                  }`}
                >
                  {cat.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View className="mb-4">
          <Text className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
            Instansi Tujuan (opsional)
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {agencies?.data?.map((ag) => (
              <TouchableOpacity
                key={ag.id}
                onPress={() => setAgencyId(ag.id)}
                className={`px-4 py-2 rounded-xl mr-2 ${
                  agencyId === ag.id
                    ? "bg-teal-600"
                    : "bg-slate-100 dark:bg-slate-800"
                }`}
              >
                <Text
                  className={`text-sm font-medium ${
                    agencyId === ag.id ? "text-white" : "text-slate-700 dark:text-slate-300"
                  }`}
                >
                  {ag.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View className="flex-row gap-3 mb-4">
          <View className="flex-1">
            <Text className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Latitude
            </Text>
            <TextInput
              value={latitude}
              onChangeText={setLatitude}
              placeholder="-6.200000"
              placeholderTextColor="#94a3b8"
              keyboardType="decimal-pad"
              className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-800 dark:text-white"
            />
          </View>
          <View className="flex-1">
            <Text className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Longitude
            </Text>
            <TextInput
              value={longitude}
              onChangeText={setLongitude}
              placeholder="106.800000"
              placeholderTextColor="#94a3b8"
              keyboardType="decimal-pad"
              className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-800 dark:text-white"
            />
          </View>
        </View>

        <View className="mb-4">
          <Text className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
            Alamat (opsional)
          </Text>
          <TextInput
            value={address}
            onChangeText={setAddress}
            placeholder="Masukkan alamat lokasi"
            placeholderTextColor="#94a3b8"
            className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-800 dark:text-white"
          />
        </View>

        <TouchableOpacity
          onPress={pickImage}
          className="bg-slate-50 dark:bg-slate-800 border border-dashed border-slate-300 dark:border-slate-600 rounded-xl p-6 items-center mb-6"
        >
          {image ? (
            <Image
              source={{ uri: image }}
              className="w-full h-48 rounded-xl"
              resizeMode="cover"
            />
          ) : (
            <>
              <Ionicons name="camera" size={32} color="#94a3b8" />
              <Text className="text-slate-400 mt-2">Tambahkan Foto</Text>
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleSubmit}
          disabled={mutation.isPending}
          className="bg-teal-600 py-3.5 rounded-xl items-center"
        >
          <Text className="text-white font-semibold text-base">
            {mutation.isPending ? "Mengirim..." : "Kirim Laporan"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
