import MapView, { Marker, type MapPressEvent, type MarkerDragEndEvent } from "react-native-maps";

interface LocationMapProps {
  latitude: number;
  longitude: number;
  onCoordinateChange: (lat: number, lng: number) => void;
}

export default function LocationMap({ latitude, longitude, onCoordinateChange }: LocationMapProps) {
  return (
    <MapView
      style={{ flex: 1 }}
      initialRegion={{
        latitude,
        longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      }}
      onPress={(e: MapPressEvent) => {
        const { latitude: lat, longitude: lng } = e.nativeEvent.coordinate;
        onCoordinateChange(lat, lng);
      }}
    >
      <Marker
        coordinate={{ latitude, longitude }}
        draggable
        onDragEnd={(e: MarkerDragEndEvent) => {
          const { latitude: lat, longitude: lng } = e.nativeEvent.coordinate;
          onCoordinateChange(lat, lng);
        }}
      />
    </MapView>
  );
}
