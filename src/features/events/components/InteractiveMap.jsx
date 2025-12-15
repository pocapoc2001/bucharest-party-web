import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// --- 1. ICON GENERATOR (With Scaling Support) ---
const createCustomIcon = (isSelected) => {
  const color = isSelected ? '#ec4899' : '#a855f7'; 
  const shadowColor = isSelected ? 'rgba(236, 72, 153, 0.8)' : 'rgba(168, 85, 247, 0.6)';

  return new L.DivIcon({
    className: 'bg-transparent border-none',
    html: `
      <div class="marker-scaler" style="transform-origin: center; display: flex; align-items: center; justify-content: center; width: 100%; height: 100%;">
        <div style="position: relative; width: 12px; height: 12px; display: flex; align-items: center; justify-content: center;">
          <span style="
            position: absolute;
            width: 100%; height: 100%;
            border-radius: 50%;
            background-color: ${color};
            opacity: 0.7;
            ${isSelected ? 'animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite;' : ''}
          "></span>
          <span style="
            position: relative;
            display: inline-block;
            width: 100%; height: 100%;
            border-radius: 50%;
            background-color: ${color};
            border: 2px solid rgba(255,255,255,0.3);
            box-shadow: 0 0 15px ${shadowColor};
          "></span>
        </div>
      </div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
};

// --- 2. MAP SCALER (Handles "Bigger when Zooming In") ---
const MapScaler = () => {
  const map = useMap();

  useEffect(() => {
    const updateScale = () => {
      const zoom = map.getZoom();
      const scale = Math.pow(1.3, zoom - 13);
      map.getContainer().style.setProperty('--zoom-scale', Math.max(0.5, scale));
    };

    updateScale();
    map.on('zoom', updateScale);
    return () => map.off('zoom', updateScale);
  }, [map]);

  return null;
};

// --- 3. SMARTER MAP CONTROLLER (The Fix) ---
const MapController = ({ selectedCoords }) => {
  const map = useMap();

  useEffect(() => {
    if (selectedCoords) {
      // Get current zoom level
      const currentZoom = map.getZoom();
      
      // If user is zoomed in close (e.g. 17), stay there.
      // If user is far out (e.g. 12), zoom in to 15.
      const targetZoom = Math.max(currentZoom, 15);
      
      map.flyTo(selectedCoords, targetZoom, { 
        duration: 1.5,
        easeLinearity: 0.25
      });
    }
  }, [selectedCoords, map]);

  return null;
};

// --- 4. MAIN COMPONENT ---
export default function InteractiveMap({ events, selectedEvent, onMarkerClick }) {
  const bucCoords = [44.4355, 26.1025]; 

  return (
    <div className="w-full h-full relative rounded-xl overflow-hidden border border-gray-800 shadow-2xl bg-gray-900 z-0">
      
      <style>
        {`
          @keyframes ping {
            75%, 100% { transform: scale(2); opacity: 0; }
          }
          .marker-scaler {
            transform: scale(var(--zoom-scale, 1));
            transition: transform 0.1s linear;
            will-change: transform;
          }
        `}
      </style>

      <MapContainer 
        center={bucCoords} 
        zoom={13} 
        style={{ height: '100%', width: '100%', background: '#111827' }} 
        className="outline-none"
      >
        <TileLayer
          attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        
        <MapScaler />
        <MapController selectedCoords={selectedEvent?.coords} />

        {events.map((event) => {
          const isSelected = selectedEvent?.id === event.id;

          return (
            <Marker 
              key={event.id} 
              position={event.coords}
              icon={createCustomIcon(isSelected)}
              eventHandlers={{ 
                click: () => onMarkerClick(event) 
              }}
              zIndexOffset={isSelected ? 1000 : 1} 
            />
          );
        })}
      </MapContainer>
      
      <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_60px_rgba(0,0,0,0.6)] z-[400] rounded-xl"></div>
    </div>
  );
}