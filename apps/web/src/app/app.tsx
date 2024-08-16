// @ts-expect-error - jsvectormap is not typed
import jsVectorMap from 'jsvectormap';

import 'jsvectormap/dist/maps/world.js';
import 'jsvectormap/dist/jsvectormap.css';

import { useEffect, useRef, useState } from 'react';
import { City } from '@locator/models';

export function App() {
  const [map, setMap] = useState<any>(null);
  const [markers, setMarkers] = useState<City[]>([]);
  const [cityCount, setCityCount] = useState<number>(10);
  const [baseCity, setBaseCity] = useState<City>();

  const fetchCities = () =>
    fetch(
      'http://localhost:3000/cities?' +
        new URLSearchParams({
          ...(baseCity && {
            lat: baseCity.coords[0].toString(),
            lng: baseCity.coords[1].toString(),
          }),
          cityCount: cityCount.toString(),
        }).toString()
    )
      .then((res) => res.json())
      .then((data) => {
        setMarkers(data.cities);
      });

  const renderMap = () => {
    destroyMap();

    setMap(
      new jsVectorMap({
        selector: mapRef.current,
        zoomButtons: false,
        markers,
        zoomOnScroll: true,
        zoomMax: 100,
        onMarkerClick: (_: any, cityIndex: number) => {
          setBaseCity(markers[cityIndex]);
        },
        onMarkerTooltipShow: (_: any, tooltip: any) => {
          const city = markers.find((city) => city.name === tooltip.text());
          tooltip.text(tooltip.text() + ' (' + city?.coords.join(', ') + ')');
        },
      })
    );
  };

  const destroyMap = () => {
    if (!map) {
      return;
    }
    map.destroy();
    setMap(null);
    mapRef.current?.replaceChildren();
  };

  const reload = () => {
    window.location.reload();
  };

  useEffect(() => {
    renderMap();
  }, [markers]);

  useEffect(() => {
    fetchCities();
  }, []);

  const mapRef = useRef<HTMLDivElement>(null);

  return (
    <div>
      <div ref={mapRef} style={{ height: '100vh' }} />

      <div className="absolute top-0 left-0 right-0 flex justify-center">
        <div className="mx-auto bg-gray-400 rounded px-10 py-5">
          <div className="flex flex-row gap-2.5 justify-center items-center">
            {!baseCity && <span>Select a city first! (zoom and click)</span>}
            {baseCity && (
              <div>
                <span className="mr-2">Base city: {baseCity.name}</span>
                <button
                  className="border-2 rounded px-1 py-0.5 bg-blue-500"
                  onClick={() => reload()}
                >
                  Reload
                </button>
              </div>
            )}
          </div>

          {baseCity && (
            <>
              {markers.length - 1 > cityCount && (
                <div className="flex flex-row gap-2.5 justify-center items-center">
                  Closest
                  <input
                    type="number"
                    value={cityCount}
                    onChange={(e) => setCityCount(Number(e.target.value))}
                    className={'w-[3rem] border'}
                  />
                  city
                  <button
                    className="border-2 rounded px-1 py-0.5 bg-blue-500"
                    onClick={() => fetchCities()}
                  >
                    Fetch
                  </button>
                </div>
              )}

              <div className="flex flex-row justify-center items-center"></div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
