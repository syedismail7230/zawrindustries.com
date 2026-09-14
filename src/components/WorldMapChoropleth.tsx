'use client';

import React, { useEffect, useRef, useState } from 'react';

export interface CountryTrafficData {
  country: string;
  code: string;
  flag: string;
  requests: number;
  percentage: number;
  topCities?: Array<{ city: string; count: number }>;
}

interface WorldMapChoroplethProps {
  data: CountryTrafficData[];
  theme: {
    bg: string;
    fg: string;
    border: string;
    muted: string;
    inputBg: string;
    sidebarBg?: string;
  };
  timeRange?: string;
  onTimeRangeChange?: (range: '24h' | '7d' | '30d') => void;
}

// ISO2 to ISO3 / Name Mapping Dictionary for 100% accurate GeoJSON matching
const ISO2_TO_ISO3: Record<string, string> = {
  US: 'USA',
  NL: 'NLD',
  HK: 'HKG',
  TW: 'TWN',
  IN: 'IND',
  GB: 'GBR',
  DE: 'DEU',
  CA: 'CAN',
  AU: 'AUS',
  FR: 'FRA',
  JP: 'JPN',
  SG: 'SGP',
  CN: 'CHN',
  BR: 'BRA',
  AE: 'ARE',
  ZA: 'ZAF',
  RU: 'RUS',
  IT: 'ITA',
  ES: 'ESP',
  KR: 'KOR',
  MX: 'MEX',
  SE: 'SWE',
  NO: 'NOR',
  FI: 'FIN',
  CH: 'CHE',
  BE: 'BEL',
  AT: 'AUT',
  IE: 'IRL',
  NZ: 'NZL',
  SG_CITY: 'SGP'
};

export default function WorldMapChoropleth({
  data,
  theme,
  timeRange = '24h',
  onTimeRangeChange
}: WorldMapChoroplethProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const geoJsonLayerRef = useRef<any>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<CountryTrafficData | null>(null);

  const maxRequests = Math.max(...data.map((d) => d.requests), 1);

  // Lookup map by ISO2, ISO3, and country name
  const dataLookup = new Map<string, CountryTrafficData>();
  for (const item of data) {
    const code2 = item.code.toUpperCase();
    const code3 = (ISO2_TO_ISO3[code2] || '').toUpperCase();
    dataLookup.set(code2, item);
    if (code3) dataLookup.set(code3, item);
    dataLookup.set(item.country.toLowerCase(), item);
    if (item.country.toLowerCase() === 'united states') {
      dataLookup.set('united states of america', item);
    }
  }

  // Color generator matching Cloudflare Sky Blue Heatmap Palette
  const getColor = (requests: number) => {
    if (!requests || requests === 0) return '#52575f'; // Cloudflare signature Slate Grey for inactive nations
    const ratio = requests / maxRequests;
    if (ratio > 0.4) return '#38bdf8'; // Bright Sky Blue (Top 1)
    if (ratio > 0.15) return '#2563eb'; // Cloudflare Royal Blue
    if (ratio > 0.04) return '#1d4ed8'; // Medium Blue
    return '#1e3a8a'; // Deep Navy Blue
  };

  // Initialize Leaflet Map
  useEffect(() => {
    let isMounted = true;

    async function initMap() {
      if (typeof window === 'undefined' || !mapContainerRef.current) return;

      // Dynamically load Leaflet and Leaflet CSS
      const L = (await import('leaflet')).default;

      // Inject Leaflet CSS if not already present
      if (!document.getElementById('leaflet-css')) {
        const link = document.createElement('link');
        link.id = 'leaflet-css';
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);
      }

      // If map already initialized, remove previous instance
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      if (!isMounted || !mapContainerRef.current) return;

      // Create Leaflet Map Instance with Cloudflare Dark Settings
      const map = L.map(mapContainerRef.current, {
        center: [20, 0],
        zoom: 2,
        minZoom: 1.5,
        maxZoom: 6,
        zoomControl: false, // Custom position
        attributionControl: false,
        worldCopyJump: false,
        maxBounds: [
          [-85, -180],
          [85, 180]
        ],
        maxBoundsViscosity: 1.0
      });

      mapInstanceRef.current = map;

      // Add Zoom Control in Top-Right corner (Matching Cloudflare UI)
      L.control.zoom({ position: 'topright' }).addTo(map);

      // Fetch Real World GeoJSON (180+ countries self-hosted vector layer)
      try {
        const res = await fetch('/data/world-countries.json');
        if (!res.ok) throw new Error('Failed to load world GeoJSON');
        const geoData = await res.json();

        if (!isMounted || !mapInstanceRef.current) return;

        // Render Choropleth Country Layer (No external raster watermark)
        const geoLayer = L.geoJSON(geoData, {
          style: (feature) => {
            const iso3 = (feature?.id || '').toString().toUpperCase();
            const countryName = (feature?.properties?.name || '').toString().toLowerCase();
            const matched = dataLookup.get(iso3) || dataLookup.get(countryName);
            const reqs = matched ? matched.requests : 0;
            const hasTraffic = reqs > 0;

            return {
              fillColor: getColor(reqs),
              weight: hasTraffic ? 1.2 : 0.75,
              opacity: 1,
              color: hasTraffic ? '#38bdf8' : '#2b3038',
              dashArray: '',
              fillOpacity: 1
            };
          },
          onEachFeature: (feature, layer) => {
            const iso3 = (feature?.id || '').toString().toUpperCase();
            const countryName = feature?.properties?.name || 'Unknown';
            const matched = dataLookup.get(iso3) || dataLookup.get(countryName.toLowerCase());

            const reqCount = matched ? matched.requests : 0;
            const percentage = matched ? matched.percentage : 0;
            const flag = matched ? matched.flag : '🌐';

            // Custom Cloudflare-style Dark Tooltip
            layer.bindTooltip(
              `
              <div style="background-color: #0f172a; color: #ffffff; padding: 6px 10px; border-radius: 6px; font-family: system-ui, sans-serif; font-size: 12px; border: 1px solid #38bdf8; box-shadow: 0 4px 15px rgba(0,0,0,0.6);">
                <div style="display: flex; align-items: center; gap: 6px; font-weight: 800; margin-bottom: 3px;">
                  <span style="font-size: 14px;">${flag}</span>
                  <span>${matched?.country || countryName}</span>
                </div>
                <div style="color: #94a3b8; font-size: 11px; display: flex; justify-content: space-between; gap: 12px;">
                  <span>Traffic:</span>
                  <strong style="color: #38bdf8;">${reqCount.toLocaleString()} reqs</strong>
                </div>
                ${
                  percentage > 0
                    ? `<div style="color: #94a3b8; font-size: 11px; display: flex; justify-content: space-between; gap: 12px;">
                        <span>Share:</span>
                        <strong style="color: #4ade80;">${percentage}%</strong>
                      </div>`
                    : ''
                }
              </div>
            `,
              {
                sticky: true,
                className: 'cf-custom-tooltip'
              }
            );

            // Hover interactions
            layer.on({
              mouseover: (e) => {
                const target = e.target;
                target.setStyle({
                  weight: 2,
                  color: '#ffffff',
                  fillColor: reqCount > 0 ? '#60a5fa' : '#6b7280'
                });
                if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
                  target.bringToFront();
                }
              },
              mouseout: (e) => {
                geoLayer.resetStyle(e.target);
              },
              click: () => {
                if (matched) {
                  setSelectedCountry(matched);
                }
              }
            });
          }
        }).addTo(map);

        geoJsonLayerRef.current = geoLayer;
        setMapLoaded(true);
      } catch (err) {
        console.error('Error rendering Leaflet world choropleth:', err);
      }
    }

    initMap();

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [data]);

  const timeRangeLabels: Record<string, string> = {
    '24h': 'Previous 24 hours',
    '7d': 'Previous 7 days',
    '30d': 'Previous 30 days'
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%' }}>
      {/* ───────────────────────────────────────────────────────────── */}
      {/* 1. CLOUDFLARE WORLD MAP CONTAINER */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div
        style={{
          backgroundColor: '#0a0d14',
          border: `1px solid ${theme.border}`,
          borderRadius: '12px',
          overflow: 'hidden',
          position: 'relative',
          width: '100%',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)'
        }}
      >
        {/* Header Bar with Time Range Dropdown */}
        <div
          style={{
            padding: '1rem 1.5rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem',
            backgroundColor: '#0f141f'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0, color: '#ffffff', letterSpacing: '-0.01em' }}>
              Web Traffic Requests by Country
            </h3>
          </div>

          {/* Time Range Select Dropdown (Matching Cloudflare UI) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <select
              value={timeRange}
              onChange={(e) => onTimeRangeChange?.(e.target.value as any)}
              style={{
                backgroundColor: '#1a2234',
                color: '#ffffff',
                border: '1px solid #334155',
                borderRadius: '6px',
                padding: '0.35rem 0.85rem',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer',
                outline: 'none',
                boxShadow: '0 1px 3px rgba(0,0,0,0.3)'
              }}
            >
              <option value="24h">Previous 24 hours</option>
              <option value="7d">Previous 7 days</option>
              <option value="30d">Previous 30 days</option>
            </select>
          </div>
        </div>

        {/* Real Leaflet Map Viewport */}
        <div style={{ position: 'relative', width: '100%', height: '460px', backgroundColor: '#111315' }}>
          <div
            ref={mapContainerRef}
            style={{ width: '100%', height: '100%', zIndex: 1, backgroundColor: '#111315' }}
          />

          {/* Bottom Left Legend (Matching Cloudflare UI) */}
          <div
            style={{
              position: 'absolute',
              bottom: '14px',
              left: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '0.55rem',
              backgroundColor: 'rgba(15, 23, 42, 0.88)',
              padding: '0.35rem 0.75rem',
              borderRadius: '6px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              fontSize: '0.72rem',
              color: '#94a3b8',
              backdropFilter: 'blur(6px)',
              zIndex: 1000
            }}
          >
            <span>0</span>
            <div
              style={{
                width: '90px',
                height: '7px',
                borderRadius: '9999px',
                background: 'linear-gradient(to right, #52575f, #1e3a8a, #2563eb, #38bdf8)'
              }}
            />
            <span style={{ color: '#38bdf8', fontWeight: 700 }}>
              {maxRequests.toLocaleString()} requests
            </span>
          </div>

          {/* Bottom Right Attribution (Matching Cloudflare UI) */}
          <div
            style={{
              position: 'absolute',
              bottom: '10px',
              right: '14px',
              fontSize: '0.68rem',
              color: 'rgba(255, 255, 255, 0.45)',
              zIndex: 1000,
              pointerEvents: 'none'
            }}
          >
            © OpenStreetMap
          </div>
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 2. TOP TRAFFIC COUNTRIES / REGIONS TABLE */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div
        style={{
          border: `1px solid ${theme.border}`,
          borderRadius: '12px',
          overflow: 'hidden',
          backgroundColor: '#0a0d14'
        }}
      >
        <div
          style={{
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            backgroundColor: '#0f141f',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <div>
            <h4 style={{ margin: '0 0 0.2rem 0', fontSize: '1rem', fontWeight: 800, color: '#ffffff' }}>
              Top Traffic Countries / Regions
            </h4>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
              {timeRangeLabels[timeRange] || 'Previous 24 hours'}
            </span>
          </div>

          <span
            style={{
              fontSize: '0.75rem',
              color: '#4ade80',
              fontWeight: 700,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              backgroundColor: 'rgba(74, 222, 128, 0.1)',
              padding: '0.25rem 0.65rem',
              borderRadius: '9999px',
              border: '1px solid rgba(74, 222, 128, 0.25)'
            }}
          >
            <span style={{ width: '6px', height: '6px', backgroundColor: '#4ade80', borderRadius: '50%' }} />
            Cloudflare Geo-DNS Synced
          </span>
        </div>

        <div style={{ overflowX: 'auto', width: '100%' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', textAlign: 'left' }}>
            <thead>
              <tr
                style={{
                  borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                  color: '#94a3b8',
                  fontSize: '0.75rem',
                  textTransform: 'none',
                  letterSpacing: '0.02em',
                  backgroundColor: '#090d15'
                }}
              >
                <th style={{ padding: '0.85rem 1.5rem', fontWeight: 600 }}>Country / Region</th>
                <th style={{ padding: '0.85rem 1.5rem', textAlign: 'right', fontWeight: 600 }}>Traffic</th>
              </tr>
            </thead>
            <tbody>
              {data.length === 0 ? (
                <tr>
                  <td colSpan={2} style={{ padding: '2.5rem', textAlign: 'center', color: '#94a3b8' }}>
                    No regional country data recorded for this period.
                  </td>
                </tr>
              ) : (
                data.map((c, i) => (
                  <tr
                    key={c.code || i}
                    style={{
                      borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                      transition: 'background-color 0.15s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.03)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    <td style={{ padding: '0.85rem 1.5rem', fontWeight: 600, color: '#f1f5f9' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                        <span style={{ fontSize: '1.15rem' }}>{c.flag}</span>
                        <span>{c.country}</span>
                      </div>
                    </td>
                    <td
                      style={{
                        padding: '0.85rem 1.5rem',
                        fontWeight: 700,
                        color: '#f1f5f9',
                        textAlign: 'right',
                        fontVariantNumeric: 'tabular-nums'
                      }}
                    >
                      {c.requests.toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Global CSS for Leaflet Tooltip & Control Overrides */}
      <style jsx global>{`
        .leaflet-container {
          background-color: #111315 !important;
        }
        .cf-custom-tooltip {
          background: transparent !important;
          border: none !important;
          box-shadow: none !important;
          padding: 0 !important;
        }
        .cf-custom-tooltip::before {
          display: none !important;
        }
        .leaflet-control-zoom {
          border: 1px solid rgba(255, 255, 255, 0.15) !important;
          border-radius: 4px !important;
          overflow: hidden !important;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.6) !important;
        }
        .leaflet-control-zoom a {
          background-color: #ffffff !important;
          color: #0f172a !important;
          border-bottom: 1px solid #e2e8f0 !important;
          width: 28px !important;
          height: 28px !important;
          line-height: 26px !important;
          font-size: 16px !important;
          font-weight: 800 !important;
        }
        .leaflet-control-zoom a:hover {
          background-color: #f1f5f9 !important;
        }
      `}</style>
    </div>
  );
}
