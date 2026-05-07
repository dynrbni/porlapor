import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon in react-leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

interface LocationPickerProps {
  onLocationChange: (lat: number, lng: number, address: string) => void;
}

function LocationMarker({ onLocationChange }: { onLocationChange: (lat: number, lng: number) => void }) {
  const [position, setPosition] = useState<L.LatLng | null>(null);
  
  const map = useMapEvents({
    click(e) {
      setPosition(e.latlng);
      onLocationChange(e.latlng.lat, e.latlng.lng);
      map.flyTo(e.latlng, map.getZoom());
    },
    locationfound(e) {
      setPosition(e.latlng);
      onLocationChange(e.latlng.lat, e.latlng.lng);
      map.flyTo(e.latlng, map.getZoom());
    },
  });

  useEffect(() => {
    map.locate();
  }, [map]);

  return position === null ? null : (
    <Marker position={position} />
  );
}

export default function LocationPicker({ onLocationChange }: LocationPickerProps) {
  const [addressPreview, setAddressPreview] = useState<string>("Mengambil lokasi...");

  const fetchAddress = async (lat: number, lng: number) => {
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`);
      const data = await res.json();
      const addr = data.display_name || `${lat}, ${lng}`;
      setAddressPreview(addr);
      onLocationChange(lat, lng, addr);
    } catch {
      setAddressPreview(`${lat}, ${lng}`);
      onLocationChange(lat, lng, `${lat}, ${lng}`);
    }
  };

  const handleLocationUpdate = (lat: number, lng: number) => {
    fetchAddress(lat, lng);
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="h-48 w-full border-sharp relative overflow-hidden bg-slate-200">
        <MapContainer center={[-6.200000, 106.816666]} zoom={13} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            attribution='&copy; OpenStreetMap'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <LocationMarker onLocationChange={handleLocationUpdate} />
        </MapContainer>
        <div className="absolute top-2 right-2 bg-white/90 backdrop-blur px-2 py-1 text-[10px] font-bold uppercase tracking-widest border-sharp z-[1000] pointer-events-none">
          GPS Active
        </div>
      </div>
      <div className="bg-white border-sharp p-3 flex justify-between items-start gap-4">
         <div className="text-sm font-medium leading-snug">
           {addressPreview}
         </div>
      </div>
    </div>
  );
}
