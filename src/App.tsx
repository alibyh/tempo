import React, { useEffect, useMemo, useRef, useState } from "react";
import { useYMaps, YMaps, Map, Placemark } from "@pbe/react-yandex-maps";
import { RUSSIAN_ADDRESSES, type RussianAddress } from "./data/addresses";
import "./App.css";

const apiKey = import.meta.env.VITE_YANDEX_API_KEY ?? "";

const DEFAULT_CENTER: [number, number] = [55.75, 37.62]; // Moscow
const DEFAULT_ZOOM = 5;

function getMapState(addr1: RussianAddress | null, addr2: RussianAddress | null) {
  if (!addr1 && !addr2) return { center: DEFAULT_CENTER, zoom: DEFAULT_ZOOM };
  if (addr1 && !addr2) return { center: addr1.coords, zoom: 14 };
  if (!addr1 && addr2) return { center: addr2.coords, zoom: 14 };
  if (addr1 && addr2) {
    const lat = (addr1.coords[0] + addr2.coords[0]) / 2;
    const lng = (addr1.coords[1] + addr2.coords[1]) / 2;
    return { center: [lat, lng] as [number, number], zoom: 5 };
  }
  return { center: DEFAULT_CENTER, zoom: DEFAULT_ZOOM };
}

interface MapWithRouteProps {
  address1: RussianAddress | null;
  address2: RussianAddress | null;
  mapState: { center: [number, number]; zoom: number };
  onDistanceChange: (value: string | null) => void;
}

function MapWithRoute({ address1, address2, mapState, onDistanceChange }: MapWithRouteProps) {
  const ymaps = useYMaps(["multiRouter.MultiRoute"]);
  const mapRef = useRef<unknown>(null);
  const routeRef = useRef<unknown>(null);

  useEffect(() => {
    const map = mapRef.current as { geoObjects?: { add: (o: unknown) => void; remove: (o: unknown) => void } } | null;
    if (!address1 || !address2) return;

    // If Yandex Maps script failed to load (often API key / referrer restrictions),
    // we won't ever get routing events. Show a helpful message instead of hanging on "считаю…".
    if (!ymaps || !map?.geoObjects) {
      const t = window.setTimeout(() => {
        onDistanceChange("карта/маршрутизация не загрузилась (проверьте API key и ограничения по referer)");
      }, 1500);
      return () => window.clearTimeout(t);
    }

    onDistanceChange(null);
    if (routeRef.current) {
      try {
        map.geoObjects.remove(routeRef.current);
      } catch {
        // ignore
      }
      routeRef.current = null;
    }

    const multiRoute = new (ymaps as any).multiRouter.MultiRoute(
      {
        referencePoints: [address1.coords, address2.coords],
        params: { routingMode: "auto" },
      },
      {
        boundsAutoApply: true,
      }
    );

    routeRef.current = multiRoute;
    map.geoObjects.add(multiRoute);

    const onSuccess = () => {
      try {
        const active = multiRoute.getActiveRoute?.();
        const dist: any =
          (active as any)?.properties?.get?.("distance") ??
          (multiRoute as any)?.getRoutes?.().get?.(0)?.properties?.get?.("distance");

        const text: unknown = dist?.text;
        if (typeof text === "string") {
          onDistanceChange(text);
          return;
        }

        const valueMeters: unknown = dist?.value;
        if (typeof valueMeters === "number") {
          const km = valueMeters / 1000;
          onDistanceChange(`${km.toFixed(1)} км`);
        }
      } catch {
        // ignore
      }
    };

    const onFail = () => {
      try {
        const err = (multiRoute as any)?.model?.getError?.();
        const msg =
          typeof err === "string"
            ? err
            : (err?.message as unknown) && typeof err.message === "string"
              ? err.message
              : null;
        onDistanceChange(msg ? `не удалось построить маршрут: ${msg}` : "не удалось построить маршрут");
      } catch {
        onDistanceChange("не удалось построить маршрут");
      }
    };

    multiRoute.model.events.add("requestsuccess", onSuccess);
    multiRoute.model.events.add("requestfail", onFail);

    return () => {
      try {
        multiRoute.model.events.remove("requestsuccess", onSuccess);
        multiRoute.model.events.remove("requestfail", onFail);
        map.geoObjects?.remove(multiRoute);
      } catch {
        // ignore
      }
      if (routeRef.current === multiRoute) routeRef.current = null;
    };
  }, [ymaps, address1, address2, onDistanceChange]);

  return (
    <Map
      state={mapState}
      width="100%"
      height="100%"
      className="yandex-map"
      instanceRef={(ref) => {
        (mapRef as React.MutableRefObject<unknown>).current = ref ?? null;
      }}
    >
      {address1 && (
        <Placemark
          key={address1.id}
          geometry={address1.coords}
          properties={{
            balloonContentBody: address1.label,
            hintContent: address1.label,
          }}
          options={{ preset: "islands#redIcon" }}
        />
      )}
      {address2 && (
        <Placemark
          key={address2.id}
          geometry={address2.coords}
          properties={{
            balloonContentBody: address2.label,
            hintContent: address2.label,
          }}
          options={{ preset: "islands#blueIcon" }}
        />
      )}
    </Map>
  );
}

function App() {
  const [address1Id, setAddress1Id] = useState<string>("");
  const [address2Id, setAddress2Id] = useState<string>("");
  const [roadDistance, setRoadDistance] = useState<string | null>(null);

  const address1 = useMemo(
    () => RUSSIAN_ADDRESSES.find((a) => a.id === address1Id) ?? null,
    [address1Id]
  );
  const address2 = useMemo(
    () => RUSSIAN_ADDRESSES.find((a) => a.id === address2Id) ?? null,
    [address2Id]
  );

  const mapState = useMemo(
    () => getMapState(address1, address2),
    [address1, address2]
  );

  return (
    <div className="app">
      <header className="header">
        <div className="title-row">
          <h1>Адреса в России</h1>
          {address1 && address2 && (
            <div className="distance">
              Дистанция по дороге: <strong>{roadDistance ?? "считаю…"}</strong>
            </div>
          )}
        </div>
        <div className="dropdowns">
          <label className="select-wrap">
            <span className="label">Адрес 1</span>
            <select
              value={address1Id}
              onChange={(e) => setAddress1Id(e.target.value)}
              className="select"
            >
              <option value="">— Выберите адрес —</option>
              {RUSSIAN_ADDRESSES.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.label}
                </option>
              ))}
            </select>
          </label>
          <label className="select-wrap">
            <span className="label">Адрес 2</span>
            <select
              value={address2Id}
              onChange={(e) => setAddress2Id(e.target.value)}
              className="select"
            >
              <option value="">— Выберите адрес —</option>
              {RUSSIAN_ADDRESSES.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </header>

      <div className="map-container">
        <YMaps query={{ apikey: apiKey }}>
          <MapWithRoute
            address1={address1}
            address2={address2}
            mapState={mapState}
            onDistanceChange={setRoadDistance}
          />
        </YMaps>
      </div>

      <footer className="api-status">
        <div className="api-status__row">
          <span className="api-status__label">Data source:</span>
          <span>Map, markers and road distance — Yandex Maps JavaScript API 2.1</span>
        </div>
        <div className="api-status__row">
          <span className="api-status__label">API key:</span>
          <span>
            {apiKey
              ? apiKey.length >= 8
                ? <>••••••••{apiKey.slice(-4)} (in use)</>
                : "configured (in use)"
              : "not set"}
          </span>
        </div>
        <a
          className="api-status__link"
          href="https://yandex.com/dev/maps/jsapi/doc/2.1/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Yandex Maps API docs
        </a>
      </footer>
    </div>
  );
}

export default App;
