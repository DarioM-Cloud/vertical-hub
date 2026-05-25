'use client';

import { GoogleMap, useJsApiLoader, MarkerF } from '@react-google-maps/api';
import { useCallback, useState } from 'react';

const containerStyle = { width: '100%', height: '500px', borderRadius: '24px' };
const center = { lat: 40.4168, lng: -3.7038 }; 

export default function GymMap({ gyms }) {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: "AIzaSyA-dD1kGoRkTLrsvE-sD3NNmzBI1B9eRrg" 
  });

  const [map, setMap] = useState(null);

  const onLoad = useCallback(function callback(map) {
    const bounds = new window.google.maps.LatLngBounds();
    gyms.forEach(g => {
      if (g.lat && g.lng) bounds.extend({ lat: g.lat, lng: g.lng });
    });
    map.fitBounds(bounds);
    setMap(map);
  }, [gyms]);

  const onUnmount = useCallback(function callback(map) {
    setMap(null);
  }, []);

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={6}
      onLoad={onLoad}
      onUnmount={onUnmount}
      options={{
        styles: mapRetroStyle, 
        disableDefaultUI: true,
        zoomControl: true
      }}
    >
      {gyms.map(gym => (
        gym.lat && <MarkerF 
          key={gym.id} 
          position={{ lat: gym.lat, lng: gym.lng }} 
          title={gym.nombre}
        />
      ))}
    </GoogleMap>
  ) : <div style={{ height: '500px', background: '#f1f5f9', borderRadius: '24px' }}>Cargando mapa...</div>;
}

const mapRetroStyle = [
  { "featureType": "administrative", "elementType": "all", "stylers": [{ "saturation": "-100" }] },
  { "featureType": "landscape", "elementType": "all", "stylers": [{ "saturation": -100 }, { "lightness": 65 }, { "visibility": "on" }] },
  { "featureType": "poi", "elementType": "all", "stylers": [{ "saturation": -100 }, { "lightness": "50" }, { "visibility": "simplified" }] },
  { "featureType": "road", "elementType": "all", "stylers": [{ "saturation": "-100" }] },
  { "featureType": "water", "elementType": "all", "stylers": [{ "visibility": "on" }, { "color": "#c9d2d4" }] }
];