import { useEffect, useRef, useState } from 'react';

// @ts-expect-error - jsvectormap is not typed
import jsVectorMap from 'jsvectormap';

import 'jsvectormap/dist/maps/world.js';
import 'jsvectormap/dist/jsvectormap.css';

export function App() {
  const [markers, setMarkers] = useState([
    { name: 'Egypt', coords: [26.8206, 30.8025] },
    { name: 'United Kingdom', coords: [55.3781, 3.436] },
    { name: 'United States', coords: [37.0902, -95.7129] },
  ]);

  const renderMap = () => {
    new jsVectorMap({
      selector: mapRef.current,
      zoomButtons: false,
      markers,
      zoomOnScroll: true,
    });
  };

  useEffect(() => {
    if (!mapRef?.current?.children.length) {
      renderMap();
    }
  }, [markers]);

  const mapRef = useRef<HTMLDivElement>(null);

  return (
    <div>
      <div ref={mapRef} style={{ height: '100vh' }}></div>
    </div>
  );
}

export default App;
