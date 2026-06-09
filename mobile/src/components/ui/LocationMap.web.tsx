import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { MapPin } from "lucide-react-native";
import { colors } from "../../theme";

interface LocationMapProps {
  latitude: number;
  longitude: number;
  onCoordinateChange: (lat: number, lng: number) => void;
}

export default function LocationMap({ latitude, longitude, onCoordinateChange }: LocationMapProps) {
  return (
    <View className="flex-1 bg-surface-container-low p-5 gap-4">
      <View className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/30 gap-4">
        <View>
          <Text className="font-body text-sm font-bold text-on-surface mb-2">Latitude</Text>
          <TextInput
            value={String(latitude || "")}
            onChangeText={(v) => {
              const lat = parseFloat(v);
              if (!isNaN(lat)) onCoordinateChange(lat, longitude);
            }}
            placeholder="Contoh: -6.2088"
            keyboardType="decimal-pad"
            placeholderTextColor="#94a3b8"
            className="bg-surface-container-low border border-outline-variant/50 rounded-2xl px-4 h-14 font-body text-sm text-on-surface"
          />
        </View>
        <View>
          <Text className="font-body text-sm font-bold text-on-surface mb-2">Longitude</Text>
          <TextInput
            value={String(longitude || "")}
            onChangeText={(v) => {
              const lng = parseFloat(v);
              if (!isNaN(lng)) onCoordinateChange(latitude, lng);
            }}
            placeholder="Contoh: 106.8456"
            keyboardType="decimal-pad"
            placeholderTextColor="#94a3b8"
            className="bg-surface-container-low border border-outline-variant/50 rounded-2xl px-4 h-14 font-body text-sm text-on-surface"
          />
        </View>
        <View className="bg-surface-container p-4 rounded-xl border border-outline-variant/30 flex-row gap-3 items-start">
          <MapPin size={18} color={colors.onSurfaceVariant} style={{ marginTop: 2 }} />
          <Text className="font-body text-xs text-on-surface-variant flex-1 leading-relaxed">
            Masukkan koordinat lokasi secara manual
          </Text>
        </View>
      </View>
    </View>
  );
}
