import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import { MapPin, Navigation, Search, CheckCircle2 } from 'lucide-react';

// Fix standard Leaflet icon paths
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom glowing Fast Food Delivery Pin Marker
const deliveryPinIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
  iconSize: [38, 38],
  iconAnchor: [19, 38],
  popupAnchor: [0, -38]
});

// Helper component to center map smoothly
function ChangeView({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, 16);
    }
  }, [center, map]);
  return null;
}

// Marker click event handler
function LocationMarker({ position, setPosition, onAddressFound }) {
  useMapEvents({
    click(e) {
      const newPos = [e.latlng.lat, e.latlng.lng];
      setPosition(newPos);
      reverseGeocode(e.latlng.lat, e.latlng.lng, onAddressFound);
    },
  });

  return position ? <Marker position={position} icon={deliveryPinIcon} /> : null;
}

// Simple reverse geocoding via Nominatim API
async function reverseGeocode(lat, lng, callback) {
  try {
    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`);
    const data = await res.json();
    if (data && data.display_name && callback) {
      callback(data.display_name);
    }
  } catch (e) {
    if (callback) callback(`Ubicación GPS (${lat.toFixed(4)}, ${lng.toFixed(4)})`);
  }
}

export default function GoogleMapPicker({ initialLat = 4.6097, initialLng = -74.0817, initialAddress = '', onSaveLocation }) {
  const [position, setPosition] = useState([initialLat, initialLng]);
  const [addressText, setAddressText] = useState(initialAddress);
  const [details, setDetails] = useState('');
  const [searching, setSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Initial geocode if empty
  useEffect(() => {
    if (!initialAddress) {
      reverseGeocode(initialLat, initialLng, setAddressText);
    }
  }, []);

  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      setSearching(true);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const newPos = [pos.coords.latitude, pos.coords.longitude];
          setPosition(newPos);
          reverseGeocode(pos.coords.latitude, pos.coords.longitude, (addr) => {
            setAddressText(addr);
            setSearching(false);
          });
        },
        (err) => {
          alert('No se pudo obtener la ubicación GPS. Por favor seleccione la ubicación manualmente en el mapa.');
          setSearching(false);
        }
      );
    }
  };

  const handleSearchAddress = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setSearching(true);
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`);
      const data = await res.json();
      if (data && data.length > 0) {
        const first = data[0];
        const newPos = [parseFloat(first.lat), parseFloat(first.lon)];
        setPosition(newPos);
        setAddressText(first.display_name);
      } else {
        alert('No se encontró la dirección. Intente buscar un punto de referencia cercano.');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSearching(false);
    }
  };

  const handleSave = () => {
    const finalAddress = addressText || `Lat: ${position[0]}, Lng: ${position[1]}`;
    if (onSaveLocation) {
      onSaveLocation({
        address: finalAddress,
        address_lat: position[0],
        address_lng: position[1],
        address_details: details
      });
    }
  };

  return (
    <div className="space-y-4">
      {/* Search and Current Location bar */}
      <div className="flex flex-col sm:flex-row gap-2">
        <form onSubmit={handleSearchAddress} className="flex-1 relative">
          <input
            type="text"
            placeholder="Buscar calle, avenida o barrio en Google Maps..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900/90 border border-slate-700/70 rounded-xl px-4 py-2.5 pl-10 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-orange-500"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
          <button
            type="submit"
            disabled={searching}
            className="absolute right-2 top-2 bg-orange-600 hover:bg-orange-500 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition"
          >
            {searching ? 'Buscando...' : 'Buscar'}
          </button>
        </form>

        <button
          type="button"
          onClick={handleGetCurrentLocation}
          className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-600/60 text-orange-400 hover:text-orange-300 text-xs font-semibold px-4 py-2.5 rounded-xl transition"
        >
          <Navigation className="w-4 h-4 animate-pulse" />
          <span>Mi Ubicación GPS</span>
        </button>
      </div>

      {/* Map Container */}
      <div className="h-64 sm:h-72 w-full rounded-2xl overflow-hidden border border-slate-700/60 relative shadow-inner">
        <MapContainer
          center={position}
          zoom={15}
          scrollWheelZoom={true}
          style={{ height: '100%', width: '100%' }}
        >
          <ChangeView center={position} />
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <LocationMarker
            position={position}
            setPosition={setPosition}
            onAddressFound={setAddressText}
          />
        </MapContainer>

        <div className="absolute bottom-2 left-2 right-2 bg-slate-950/90 backdrop-blur-md px-3 py-2 rounded-xl border border-slate-800 text-xs text-slate-300 flex items-center justify-between z-[1000]">
          <div className="flex items-center gap-2 truncate">
            <MapPin className="w-4 h-4 text-orange-500 flex-shrink-0" />
            <span className="truncate font-medium text-white">{addressText || 'Haga clic en el mapa para marcar su casa'}</span>
          </div>
          <span className="text-[10px] text-slate-400 flex-shrink-0 bg-slate-800 px-2 py-0.5 rounded">GPS Activo</span>
        </div>
      </div>

      {/* Manual Address details */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs text-slate-400 mb-1 font-medium">Dirección Exacta Confirmada</label>
          <input
            type="text"
            value={addressText}
            onChange={(e) => setAddressText(e.target.value)}
            placeholder="Ej. Calle 10 #15-20"
            className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-orange-500"
          />
        </div>
        <div>
          <label className="block text-xs text-slate-400 mb-1 font-medium">Apto / Casa / Casa de Color / Ref</label>
          <input
            type="text"
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            placeholder="Ej. Apto 302, Timbre negro frente a la farmacia"
            className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-orange-500"
          />
        </div>
      </div>

      <button
        type="button"
        onClick={handleSave}
        className="w-full bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white font-bold py-2.5 px-4 rounded-xl shadow-lg shadow-orange-600/30 flex items-center justify-center gap-2 transition"
      >
        <CheckCircle2 className="w-5 h-5" />
        <span>Confirmar Ubicación de Entrega</span>
      </button>
    </div>
  );
}
