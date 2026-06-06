import { useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIconShadow from 'leaflet/dist/images/marker-shadow.png';
import type { Report } from '../services/reportService';

const defaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerIconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});
L.Marker.prototype.options.icon = defaultIcon;

function FitBounds({ markers }: { markers: [number, number][] }) {
  const map = useMap();
  useEffect(() => {
    if (markers.length > 0) {
      const bounds = L.latLngBounds(markers);
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [map, markers]);
  return null;
}

interface AdminExploreMapProps {
  reports: Report[];
  onSelectReport: (id: string) => void;
  getStatusBadge: (status: string) => React.ReactNode;
}

export default function AdminExploreMap({ reports, onSelectReport, getStatusBadge }: AdminExploreMapProps) {
  const validReports = useMemo(() => reports.filter(r => r.latitude && r.longitude), [reports]);
  const positions = useMemo(() => validReports.map(r => [r.latitude, r.longitude] as [number, number]), [validReports]);

  return (
    <div className="h-[calc(100vh-12rem)] w-full rounded-lg border border-slate-200 overflow-hidden z-0">
      <MapContainer
        center={[-6.200000, 106.816666]}
        zoom={11}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FitBounds markers={positions} />
        {validReports.map((report) => (
          <Marker key={report.id} position={[report.latitude, report.longitude]}>
            <Popup>
              <div className="min-w-[200px]">
                <div className="flex items-center justify-between mb-2 gap-2">
                  <span className="text-xs font-semibold text-slate-400 truncate">{report.id}</span>
                  {getStatusBadge(report.status)}
                </div>
                <h3 className="font-semibold text-slate-900 mb-1 text-sm leading-tight">{report.title}</h3>
                <p className="text-xs text-slate-500 mb-1">
                  {(report.user?.name || report.user?.nama || 'Anonim')}
                </p>
                <p className="text-xs text-slate-400 mb-3">
                  {new Date(report.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                </p>
                <button
                  onClick={() => onSelectReport(report.id)}
                  className="w-full px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-md transition-colors cursor-pointer"
                >
                  Lihat Detail
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
        {validReports.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <p className="bg-white/90 px-4 py-2 rounded-md shadow-sm text-sm text-slate-500">
              Belum ada laporan dengan lokasi yang valid.
            </p>
          </div>
        )}
      </MapContainer>
    </div>
  );
}
