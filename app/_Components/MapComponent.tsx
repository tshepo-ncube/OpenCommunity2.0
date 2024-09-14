import React, { useEffect, useRef } from 'react';

const MapComponent = ({ center, zoom }) => {
  const mapRef = useRef(null);

  useEffect(() => {
    if (window.google && window.google.maps) {
      new window.google.maps.Map(mapRef.current, {
        center,
        zoom,
      });
    }
  }, [center, zoom]);

  return <div ref={mapRef} style={{ height: '400px', width: '100%' }} />;
};

export default MapComponent;
