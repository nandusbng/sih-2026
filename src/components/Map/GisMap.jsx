import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { 
  Layers, 
  Eye, 
  EyeOff, 
  MapPin, 
  Navigation, 
  ShieldAlert, 
  Compass, 
  Clock, 
  Maximize2, 
  Sliders,
  Play,
  Pause,
  RotateCcw,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { GEO_LAYERS } from '../../data/geoJsonData';

export default function GisMap({ 
  selectedDamId, 
  damsData, 
  currentScenario,
  simulationState,
  activeLayers = {},
  setActiveLayers
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const layerGroupsRef = useRef({});
  
  const currentDam = damsData[selectedDamId];
  const geoData = GEO_LAYERS[selectedDamId] || GEO_LAYERS.hirakud;

  // Local state for map controls (Default: Colorful Mapbox Streets)
  const [basemap, setBasemap] = useState('streets');
  const [timeStepHr, setTimeStepHr] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasSimulated, setHasSimulated] = useState(false);
  const [layerOpacity, setLayerOpacity] = useState(0.75);
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [sphParticles, setSphParticles] = useState([]);
  const [chamoliRiverCoords, setChamoliRiverCoords] = useState([]);
  const [khadakwaslaWater, setKhadakwaslaWater] = useState(null);
  const [isLayersOpen, setIsLayersOpen] = useState(false);
  const [isLegendOpen, setIsLegendOpen] = useState(false);

  // Fetch real SIH Statement 2 datasets on mount
  useEffect(() => {
    // 1. 25,000 SPH fluid particles
    fetch('/simulation/sphPoints.json')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setSphParticles(data);
        }
      })
      .catch(err => {
        console.warn("Could not load simulation/sphPoints.json:", err);
      });

    // 2. Chamoli Glacial Avalanche River Centerline
    fetch('/simulation/chamoli_river.json')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setChamoliRiverCoords(data);
        }
      })
      .catch(err => {
        console.warn("Could not load simulation/chamoli_river.json:", err);
      });

    // 3. Khadakwasla Full Water System GeoJSON
    fetch('/simulation/all_water.json')
      .then(res => res.json())
      .then(data => {
        if (data && data.features) {
          setKhadakwaslaWater(data);
        }
      })
      .catch(err => {
        console.warn("Could not load simulation/all_water.json:", err);
      });
  }, []);

  // Default layers if not passed
  const layers = {
    delft3d: true,
    sph: true,
    gee: true,
    isochrones: true,
    settlements: true,
    roads: true,
    assets: true,
    reservoir: true,
    ...activeLayers
  };

  const toggleLayer = (layerKey) => {
    if (setActiveLayers) {
      setActiveLayers(prev => ({ ...prev, [layerKey]: !prev[layerKey] }));
    }
  };

  // Mapbox Access Token
  const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN || '';

  // Basemap tile definitions powered by Mapbox High-Definition Retina Tiles
  const basemapUrls = {
    streets: `https://api.mapbox.com/styles/v1/mapbox/streets-v12/tiles/256/{z}/{x}/{y}@2x?access_token=${MAPBOX_TOKEN}`,
    outdoors: `https://api.mapbox.com/styles/v1/mapbox/outdoors-v12/tiles/256/{z}/{x}/{y}@2x?access_token=${MAPBOX_TOKEN}`,
    satellite: `https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v12/tiles/256/{z}/{x}/{y}@2x?access_token=${MAPBOX_TOKEN}`,
    light: `https://api.mapbox.com/styles/v1/mapbox/light-v11/tiles/256/{z}/{x}/{y}@2x?access_token=${MAPBOX_TOKEN}`,
    dark: `https://api.mapbox.com/styles/v1/mapbox/dark-v11/tiles/256/{z}/{x}/{y}@2x?access_token=${MAPBOX_TOKEN}`
  };

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: currentDam.downstreamCenter,
        zoom: 10,
        zoomControl: false,
        attributionControl: false
      });

      L.control.zoom({ position: 'bottomright' }).addTo(map);

      // Create base tile layer using Mapbox
      const tileLayer = L.tileLayer(basemapUrls[basemap], {
        maxZoom: 20,
        tileSize: 256
      }).addTo(map);

      mapInstanceRef.current = map;
      layerGroupsRef.current.tileLayer = tileLayer;
      layerGroupsRef.current.features = L.layerGroup().addTo(map);
    }

    return () => {
      // Clean up on component unmount
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update center when dam changes and reset simulation state
  useEffect(() => {
    if (mapInstanceRef.current && currentDam) {
      mapInstanceRef.current.flyTo(currentDam.downstreamCenter, 10, {
        duration: 1.5
      });
    }
    setHasSimulated(false);
    setIsPlaying(false);
    setTimeStepHr(1);
  }, [selectedDamId]);

  // Helper to scale flood extent dynamically with simulation time
  const getDynamicFloodExtent = (extentFeature, damId, stepHr) => {
    if (!extentFeature || !extentFeature.geometry || !extentFeature.geometry.coordinates) return extentFeature;
    const reachRatio = Math.max(0.12, Math.min(1, stepHr / 24));
    const rawCoords = extentFeature.geometry.coordinates[0];

    let scaledCoords = rawCoords;
    if (damId === 'hirakud') {
      // Mahanadi flows North to South (lat 21.575 -> 21.020)
      const damLat = 21.575;
      const deltaLat = 21.020;
      const currentMinLat = damLat - (damLat - deltaLat) * reachRatio;
      scaledCoords = rawCoords.map(([lng, lat]) => [lng, Math.max(lat, currentMinLat)]);
    } else if (damId === 'ukai') {
      // Tapi flows East to West (lng 73.570 -> 72.630)
      const damLng = 73.570;
      const deltaLng = 72.630;
      const currentMinLng = damLng - (damLng - deltaLng) * reachRatio;
      scaledCoords = rawCoords.map(([lng, lat]) => [Math.max(lng, currentMinLng), lat]);
    } else if (damId === 'khadakwasla') {
      // Slices the continuous corridor loop along the Mutha and Mula-Mutha downstream reach
      const M = Math.floor(rawCoords.length / 2);
      const reachCount = Math.max(8, Math.min(M, Math.ceil(reachRatio * M)));
      const leftSlice = rawCoords.slice(0, reachCount);
      const rightSlice = rawCoords.slice(rawCoords.length - reachCount);
      scaledCoords = [...leftSlice, ...rightSlice, leftSlice[0]];
    }

    return {
      ...extentFeature,
      geometry: {
        ...extentFeature.geometry,
        coordinates: [scaledCoords]
      }
    };
  };

  // Update Basemap Tiles
  useEffect(() => {
    if (layerGroupsRef.current.tileLayer && basemapUrls[basemap]) {
      layerGroupsRef.current.tileLayer.setUrl(basemapUrls[basemap]);
    }
  }, [basemap]);

  // Redraw Vector & GeoJSON Layers
  useEffect(() => {
    if (!mapInstanceRef.current || !layerGroupsRef.current.features) return;

    const group = layerGroupsRef.current.features;
    group.clearLayers();

    // 1. Reservoir Polygon
    if (layers.reservoir && geoData.reservoir) {
      const resLayer = L.geoJSON(geoData.reservoir, {
        style: {
          color: '#06b6d4',
          weight: 2,
          fillColor: '#0284c7',
          fillOpacity: 0.4
        }
      }).bindPopup(`<b>${geoData.reservoir.properties.name}</b><br/>Area: ${geoData.reservoir.properties.areaSqKm} km²`);
      group.addLayer(resLayer);
    }

    // 2. Dam Axis
    if (geoData.damAxis) {
      const damLayer = L.geoJSON(geoData.damAxis, {
        style: {
          color: '#ffffff',
          weight: 5,
          dashArray: '4, 4'
        }
      }).bindPopup(`<b>${geoData.damAxis.properties.name}</b><br/>Length: ${geoData.damAxis.properties.lengthKm} km`);
      group.addLayer(damLayer);
    }

    // 3. River Main Channel (Always clean natural baseline)
    if (geoData.riverPath) {
      const riverLayer = L.geoJSON(geoData.riverPath, {
        style: {
          color: '#38bdf8',
          weight: 3.5,
          opacity: 0.8
        }
      });
      group.addLayer(riverLayer);
    }

    // 4. Khadakwasla Real Water Network (Baseline rivers & lake)
    if (selectedDamId === 'khadakwasla' && khadakwaslaWater && layers.reservoir) {
      const waterLayer = L.geoJSON(khadakwaslaWater, {
        filter: (feat) => {
          const name = feat.properties && (feat.properties.name || feat.properties.waterway);
          // Strictly EXCLUDE Mula river, Ramnadi, and any stray water in the North-West (Paud / Mulshi / Baner)
          if (name === 'Mula' || name === 'Ramnadi') return false;
          if (feat.geometry.type === 'LineString') {
            const startPt = feat.geometry.coordinates[0];
            if (startPt && startPt[0] < 73.75 && startPt[1] > 18.45) return false;
          }
          if (feat.geometry.type === 'Polygon') {
            // Keep Khadakwasla Reservoir
            if (name && name.includes('Khadakwasla')) return true;
            // Exclude anything in the north-west (Paud, Lavale, Baner, Pashan)
            const c = feat.geometry.coordinates[0][0];
            if (c && (c[1] > 18.47 && c[0] < 73.80)) return false;
          }
          return true;
        },
        style: (feat) => {
          const isLake = feat.geometry.type === 'Polygon';
          return {
            color: isLake ? '#0284c7' : '#38bdf8',
            weight: isLake ? 2 : 2.5,
            fillColor: '#0369a1',
            fillOpacity: isLake ? 0.45 : 0.65
          };
        }
      });
      group.addLayer(waterLayer);
    }

    // =========================================================================
    // CRITICAL: CLEAN BASELINE MAP CHECK
    // The user requested: At the starting, everything should be clean!
    // ONLY after the "SIMULATE WAVE" button is clicked should the flood water flow,
    // inundation extents, fluid particles, and disaster hazards be displayed!
    // =========================================================================
    if (!hasSimulated) {
      return;
    }

    // =========================================================================
    // DYNAMIC HYDRODYNAMIC FLOOD WAVE SIMULATION LAYERS
    // (Only rendered when hasSimulated === true)
    // =========================================================================

    // 5. Delft3D-FM Inundation Extent (Cyan) - Scaled with timeStepHr
    if (layers.delft3d && geoData.delft3dExtent) {
      const dynamicDelft = getDynamicFloodExtent(geoData.delft3dExtent, selectedDamId, timeStepHr);
      const delftLayer = L.geoJSON(dynamicDelft, {
        style: {
          color: '#0284c7',
          weight: 2,
          fillColor: '#0284c7',
          fillOpacity: layerOpacity
        }
      }).bindPopup(`
        <div style="font-family: sans-serif;">
          <h4 style="color:#0284c7; margin:0 0 6px;">Delft3D Flexible Mesh (2D SWE)</h4>
          <p style="margin:2px 0;"><b>Wavefront Arrival:</b> T + ${timeStepHr}:00 hrs</p>
          <p style="margin:2px 0;"><b>Max Depth:</b> ${geoData.delft3dExtent.properties.maxDepth}</p>
          <p style="margin:2px 0;"><b>Inundation Reach:</b> ${(geoData.delft3dExtent.properties.areaSqKm * Math.min(1, Math.max(0.12, timeStepHr / 24))).toFixed(1)} km²</p>
          <p style="margin:2px 0; color:#64748b; font-size:11px;">Physics: Shallow Water Equations on flexible orthogonal mesh</p>
        </div>
      `);
      group.addLayer(delftLayer);
    }

    // 6. SPH Inundation Extent (Purple) - Scaled with timeStepHr
    if (layers.sph && geoData.sphExtent) {
      const dynamicSph = getDynamicFloodExtent(geoData.sphExtent, selectedDamId, timeStepHr);
      const sphLayer = L.geoJSON(dynamicSph, {
        style: {
          color: '#8b5cf6',
          weight: 2,
          fillColor: '#8b5cf6',
          fillOpacity: layerOpacity * 0.75
        }
      }).bindPopup(`
        <div style="font-family: sans-serif;">
          <h4 style="color:#8b5cf6; margin:0 0 6px;">Smoothed Particle Hydrodynamics (SPH)</h4>
          <p style="margin:2px 0;"><b>Wavefront Arrival:</b> T + ${timeStepHr}:00 hrs</p>
          <p style="margin:2px 0;"><b>Peak Depth:</b> ${geoData.sphExtent.properties.maxDepth}</p>
          <p style="margin:2px 0; color:#64748b; font-size:11px;">Lagrangian particle solver with free-surface wavefront capture</p>
        </div>
      `);
      group.addLayer(sphLayer);
    }

    // 7. Chamoli High-Resolution Avalanche & Flash-Flood Wave (SIH Statement 2 Dataset)
    if (selectedDamId === 'chamoli' && chamoliRiverCoords.length > 0 && (layers.delft3d || layers.sph)) {
      const reach = Math.max(8, Math.min(chamoliRiverCoords.length, Math.ceil((timeStepHr / 24) * chamoliRiverCoords.length)));
      const activeCoords = chamoliRiverCoords.slice(0, reach).map(pt => [pt[1], pt[0]]);

      const fringeBuffer = L.polyline(activeCoords, {
        color: '#ff5500',
        weight: 18,
        opacity: 0.35,
        lineCap: 'round',
        lineJoin: 'round'
      }).bindPopup(`<b>Rishiganga Disaster Wash Zone</b><br/>High-velocity debris flow & glacial mud slurry.`);
      group.addLayer(fringeBuffer);

      const floodChannel = L.polyline(activeCoords, {
        color: '#00f0ff',
        weight: 8,
        opacity: 0.75,
        lineCap: 'round',
        lineJoin: 'round'
      });
      group.addLayer(floodChannel);

      const coreJet = L.polyline(activeCoords, {
        color: '#ffffff',
        weight: 3,
        opacity: 0.95
      });
      group.addLayer(coreJet);

      const waveFrontPos = activeCoords[activeCoords.length - 1];
      if (waveFrontPos) {
        const waveFrontIcon = L.divIcon({
          className: 'wavefront-beacon',
          html: `
            <div style="position:relative; width:22px; height:22px;">
              <div style="
                position:absolute; width:100%; height:100%; 
                border-radius:50%; background:#ff5500; 
                opacity:0.8; animation: pulse 1s infinite;
              "></div>
              <div style="
                position:absolute; top:4px; left:4px; width:14px; height:14px; 
                border-radius:50%; background:#ffffff; 
                border:2px solid #ff5500; box-shadow:0 0 10px #ff5500;
              "></div>
            </div>
          `,
          iconSize: [22, 22],
          iconAnchor: [11, 11]
        });

        const waveFrontMarker = L.marker(waveFrontPos, { icon: waveFrontIcon });
        waveFrontMarker.bindPopup(`
          <div style="font-family:sans-serif; min-width:180px;">
            <div style="color:#ff5500; font-weight:bold; font-size:13px; margin-bottom:4px;">🚨 WAVEFRONT LEADING CREST</div>
            <div style="font-size:12px; color:#334155;">
              <div>Timeline: <b>T + ${timeStepHr}:00 hrs</b></div>
              <div>Estimated Surge Velocity: <b>24.8 m/s</b></div>
              <div>Peak Hydrodynamic Slurry Depth: <b>14.2 m</b></div>
              <div style="color:#ef4444; font-weight:bold; margin-top:4px;">STATUS: ACTIVE DOWNSTREAM PROPAGATION</div>
            </div>
          </div>
        `);
        group.addLayer(waveFrontMarker);
      }
    }

    // 8. Dynamic Leading Wavefront Crest Marker for Hirakud / Ukai / Khadakwasla
    if (selectedDamId !== 'chamoli' && geoData.riverPath && geoData.riverPath.geometry && geoData.riverPath.geometry.coordinates) {
      const riverCoords = geoData.riverPath.geometry.coordinates;
      const progressRatio = Math.min(1, Math.max(0.08, timeStepHr / 24));
      const progressIdx = Math.min(riverCoords.length - 1, Math.floor(progressRatio * (riverCoords.length - 1)));
      const [waveLng, waveLat] = riverCoords[progressIdx];

      const waveFrontIcon = L.divIcon({
        className: 'wavefront-beacon',
        html: `
          <div style="position:relative; width:26px; height:26px;">
            <div style="
              position:absolute; width:100%; height:100%; 
              border-radius:50%; background:#0284c7; 
              opacity:0.8; animation: pulse 1.2s infinite;
            "></div>
            <div style="
              position:absolute; top:5px; left:5px; width:16px; height:16px; 
              border-radius:50%; background:#ffffff; 
              border:3px solid #0284c7; box-shadow:0 0 12px #0284c7;
            "></div>
          </div>
        `,
        iconSize: [26, 26],
        iconAnchor: [13, 13]
      });

      const waveMarker = L.marker([waveLat, waveLng], { icon: waveFrontIcon });
      waveMarker.bindPopup(`
        <div style="font-family:sans-serif; min-width:180px;">
          <div style="color:#0284c7; font-weight:bold; font-size:13px; margin-bottom:4px;">🚨 WAVEFRONT LEADING CREST</div>
          <div style="font-size:12px; color:#334155;">
            <div>Simulation Time: <b>T + ${timeStepHr}:00 hrs</b></div>
            <div>Wave Crest Velocity: <b>${(4.8 - (timeStepHr / 24) * 2.1).toFixed(1)} m/s</b></div>
            <div>Inundation Depth: <b>${(7.2 - (timeStepHr / 24) * 3.4).toFixed(1)} m</b></div>
            <div style="color:#ef4444; font-weight:bold; margin-top:4px;">STATUS: ACTIVE DOWNSTREAM SURGE</div>
          </div>
        </div>
      `);
      group.addLayer(waveMarker);
    }

    // 9. Real SPH Fluid Particles (from SIH Statement 2 Simulation - 25,000 points)
    if (layers.sph && sphParticles.length > 0) {
      const canvasRenderer = L.canvas({ padding: 0.5 });
      const maxIdx = Math.max(20, (timeStepHr / 24) * 320);

      sphParticles.forEach((p, idx) => {
        if (p.idx <= maxIdx && idx % 3 === 0) {
          let lat = p.coords[1];
          let lng = p.coords[0];

          if (selectedDamId === 'hirakud') {
            lat = lat - 18.435 + 21.57;
            lng = lng - 73.763 + 83.87;
          } else if (selectedDamId === 'ukai') {
            lat = lat - 18.435 + 21.25;
            lng = lng - 73.763 + 73.585;
          } else if (selectedDamId === 'chamoli') {
            lat = lat - 18.435 + 30.487;
            lng = lng - 73.763 + 79.690;
          }

          const particle = L.circleMarker([lat, lng], {
            renderer: canvasRenderer,
            radius: 2.2,
            fillColor: p.color || '#3b82f6',
            color: p.color || '#3b82f6',
            weight: 0,
            fillOpacity: 0.82
          });
          group.addLayer(particle);
        }
      });
    }

    // 10. GEE Sentinel-1 SAR Observed Flood (Emerald Green)
    if (layers.gee && geoData.geeExtent) {
      const geeLayer = L.geoJSON(geoData.geeExtent, {
        style: {
          color: '#10b981',
          weight: 2,
          dashArray: '3, 3',
          fillColor: '#10b981',
          fillOpacity: layerOpacity * 0.6
        }
      }).bindPopup(`
        <div style="font-family: sans-serif;">
          <h4 style="color:#059669; margin:0 0 6px;">Sentinel-1 SAR (GEE Observed Ground Truth)</h4>
          <p style="margin:2px 0;"><b>Verified Extent:</b> ${geoData.geeExtent.properties.verifiedAreaSqKm} km²</p>
          <p style="margin:2px 0;"><b>Confidence:</b> High (C-Band VV/VH Backscatter)</p>
        </div>
      `);
      group.addLayer(geeLayer);
    }

    // 11. Arrival Time Isochrones
    if (layers.isochrones && geoData.isochrones) {
      geoData.isochrones.forEach(iso => {
        if (iso.hours <= timeStepHr) {
          const isoPolygon = L.polygon(iso.polygon, {
            color: iso.color,
            weight: 2,
            dashArray: '5, 5',
            fillColor: iso.color,
            fillOpacity: 0.18
          }).bindPopup(`<b>Wavefront Arrival: T + ${iso.hours} Hours</b><br/>Lead Time for Evacuation`);
          group.addLayer(isoPolygon);
        }
      });
    }

    // 12. Road Network Segments
    if (layers.roads && geoData.roads) {
      geoData.roads.forEach(rd => {
        const rdLine = L.polyline(rd.coordinates, {
          color: rd.color,
          weight: 4,
          opacity: 0.9
        }).bindPopup(`
          <b>${rd.name}</b><br/>
          Status: <span style="color:${rd.color}; font-weight:bold;">${rd.status}</span>
        `);
        group.addLayer(rdLine);
      });
    }

    // 13. Downstream Settlements & Villages
    if (layers.settlements && currentDam.settlements) {
      currentDam.settlements.forEach(v => {
        const isFlooded = timeStepHr >= v.arrivalTimeHr;
        const markerColor = isFlooded 
          ? (v.priority === 'CRITICAL' ? '#ef4444' : v.priority === 'HIGH' ? '#f59e0b' : '#3b82f6')
          : '#94a3b8';
        
        const customIcon = L.divIcon({
          className: 'custom-village-icon',
          html: `
            <div style="
              background: ${markerColor}; 
              width: 14px; 
              height: 14px; 
              border-radius: 50%; 
              border: 2px solid #ffffff; 
              box-shadow: 0 0 8px ${markerColor};
              animation: ${isFlooded && v.priority === 'CRITICAL' ? 'pulse 1.5s infinite' : 'none'};
            "></div>
          `,
          iconSize: [14, 14],
          iconAnchor: [7, 7]
        });

        const marker = L.marker([v.lat, v.lng], { icon: customIcon });
        marker.bindPopup(`
          <div style="font-family:sans-serif; min-width:180px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
              <strong style="color:#0f172a; font-size:14px;">${v.name}</strong>
              <span style="background:${markerColor}; color:#fff; font-size:10px; font-weight:bold; padding:2px 6px; border-radius:4px;">${isFlooded ? v.priority : 'STANDBY'}</span>
            </div>
            <div style="color:#475569; font-size:12px; line-height:1.4;">
              <div>Population: <b>${v.pop.toLocaleString()}</b></div>
              <div>Water Depth: <b style="color:#0284c7;">${isFlooded ? v.maxDepthM + ' m' : '0.0 m (Dry)'}</b></div>
              <div>Arrival Time: <b style="color:#f59e0b;">T + ${v.arrivalTimeHr} hrs</b></div>
              <div>Flow Velocity: <b>${isFlooded ? v.velocityMs + ' m/s' : '0.0 m/s'}</b></div>
              <div>Status: <span style="color:${isFlooded ? '#ef4444' : '#10b981'}; font-weight:600;">${isFlooded ? v.status : 'Normal (Wave Pending)'}</span></div>
            </div>
          </div>
        `);
        group.addLayer(marker);
      });
    }

    // 14. Critical Assets (Hospitals, Shelters, Bridges)
    if (layers.assets && currentDam.criticalAssets) {
      currentDam.criticalAssets.forEach(asset => {
        const isShelter = asset.type === 'Shelter';
        const isHospital = asset.type === 'Hospital';
        const color = isShelter ? '#10b981' : isHospital ? '#06b6d4' : '#f59e0b';

        const assetIcon = L.divIcon({
          className: 'custom-asset-icon',
          html: `
            <div style="
              background: #0f172a; 
              border: 2px solid ${color}; 
              color: ${color}; 
              padding: 2px 5px; 
              border-radius: 4px; 
              font-size: 10px; 
              font-weight: bold;
              white-space: nowrap;
              box-shadow: 0 2px 6px rgba(0,0,0,0.6);
            ">
              ${isShelter ? '⛺ SHELTER' : isHospital ? '🏥 HOSPITAL' : '🌉 ' + asset.type.toUpperCase()}
            </div>
          `,
          iconSize: [80, 20],
          iconAnchor: [40, 10]
        });

        const assetMarker = L.marker([asset.lat, asset.lng], { icon: assetIcon });
        assetMarker.bindPopup(`
          <div style="font-family:sans-serif;">
            <h4 style="color:${color}; margin:0 0 4px;">${asset.name}</h4>
            <p style="margin:2px 0; font-size:12px;">Type: <b>${asset.type}</b></p>
            ${asset.risk ? `<p style="margin:2px 0; font-size:12px;">Risk Status: <b>${asset.risk}</b></p>` : ''}
            ${asset.capacity ? `<p style="margin:2px 0; font-size:12px;">Shelter Capacity: <b>${asset.capacity} (Available: ${asset.available})</b></p>` : ''}
            ${asset.floodDepthM ? `<p style="margin:2px 0; font-size:12px;">Expected Flood Depth: <b style="color:#ef4444;">${asset.floodDepthM} m</b></p>` : ''}
          </div>
        `);
        group.addLayer(assetMarker);
      });
    }

  }, [selectedDamId, layers, basemap, layerOpacity, timeStepHr, chamoliRiverCoords, khadakwaslaWater, sphParticles, hasSimulated]);

  // Timeline scrubber playback effect
  useEffect(() => {
    let interval = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setTimeStepHr(prev => {
          if (prev >= 24) return 1;
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  return (
    <div className="gis-map-wrapper">
      {/* Map Target Canvas */}
      <div ref={mapContainerRef} className="gis-map-canvas" />

      {/* Floating Tactical Layer Toggles Bar (Collapsible) */}
      <div className={`map-floating-panel top-left-panel ${!isLayersOpen ? 'collapsed' : ''}`}>
        <div 
          className="panel-header clickable"
          onClick={() => setIsLayersOpen(!isLayersOpen)}
          title="Click to toggle Layer controls"
        >
          <div className="flex-align-gap">
            <Layers size={14} className="text-cyan" />
            <span>GIS HYDRO-LAYERS</span>
          </div>
          {isLayersOpen ? <ChevronUp size={14} className="text-dim" /> : <ChevronDown size={14} className="text-dim" />}
        </div>
        
        {isLayersOpen && (
          <>
            <div className="layer-toggles-grid">
              <button 
                className={`layer-toggle-btn ${layers.delft3d ? 'active' : ''}`}
                onClick={() => toggleLayer('delft3d')}
              >
                <span className="layer-color-dot" style={{ background: '#0284c7' }}></span>
                <span>Delft3D Flexible Mesh</span>
              </button>

              <button 
                className={`layer-toggle-btn ${layers.sph ? 'active' : ''}`}
                onClick={() => toggleLayer('sph')}
              >
                <span className="layer-color-dot" style={{ background: '#8b5cf6' }}></span>
                <span>SPH Particle Physics</span>
              </button>

              <button 
                className={`layer-toggle-btn ${layers.gee ? 'active' : ''}`}
                onClick={() => toggleLayer('gee')}
              >
                <span className="layer-color-dot" style={{ background: '#10b981' }}></span>
                <span>GEE Sentinel-1 SAR</span>
              </button>

              <button 
                className={`layer-toggle-btn ${layers.isochrones ? 'active' : ''}`}
                onClick={() => toggleLayer('isochrones')}
              >
                <span className="layer-color-dot" style={{ background: '#f59e0b' }}></span>
                <span>Arrival Isochrones</span>
              </button>

              <button 
                className={`layer-toggle-btn ${layers.settlements ? 'active' : ''}`}
                onClick={() => toggleLayer('settlements')}
              >
                <span className="layer-color-dot" style={{ background: '#ef4444' }}></span>
                <span>Downstream Villages</span>
              </button>

              <button 
                className={`layer-toggle-btn ${layers.assets ? 'active' : ''}`}
                onClick={() => toggleLayer('assets')}
              >
                <span className="layer-color-dot" style={{ background: '#06b6d4' }}></span>
                <span>Hospitals & Shelters</span>
              </button>

              <button 
                className={`layer-toggle-btn ${layers.roads ? 'active' : ''}`}
                onClick={() => toggleLayer('roads')}
              >
                <span className="layer-color-dot" style={{ background: '#dc2626' }}></span>
                <span>Submerged Highways</span>
              </button>
            </div>

            {/* Opacity Slider */}
            <div className="opacity-slider-row">
              <span className="text-dim text-xs">Opacity:</span>
              <input 
                type="range" 
                min="0.2" 
                max="1" 
                step="0.05"
                value={layerOpacity}
                onChange={(e) => setLayerOpacity(parseFloat(e.target.value))}
                className="tactical-slider"
              />
              <span className="text-xs font-mono">{Math.round(layerOpacity * 100)}%</span>
            </div>
          </>
        )}
      </div>

      {/* Floating Basemap Switcher */}
      <div className="map-floating-panel top-right-panel">
        <div className="basemap-pill-group">
          <button 
            className={`basemap-btn ${basemap === 'streets' ? 'active' : ''}`}
            onClick={() => setBasemap('streets')}
            title="Mapbox Colorful Streets & Vibrant Water"
          >
            🎨 Colorful Streets
          </button>
          <button 
            className={`basemap-btn ${basemap === 'outdoors' ? 'active' : ''}`}
            onClick={() => setBasemap('outdoors')}
            title="Terrain Elevation & Contours"
          >
            🏔️ Topo Terrain
          </button>
          <button 
            className={`basemap-btn ${basemap === 'satellite' ? 'active' : ''}`}
            onClick={() => setBasemap('satellite')}
            title="Satellite Imagery"
          >
            🛰️ Satellite
          </button>
          <button 
            className={`basemap-btn ${basemap === 'light' ? 'active' : ''}`}
            onClick={() => setBasemap('light')}
            title="Clean White Light Map"
          >
            ⚪ Clean Light
          </button>
          <button 
            className={`basemap-btn ${basemap === 'dark' ? 'active' : ''}`}
            onClick={() => setBasemap('dark')}
            title="Dark Tactical"
          >
            ⚫ Dark
          </button>
        </div>
      </div>

      {/* Bottom Floating Dynamic Flood Timeline Scrubber */}
      <div className="map-floating-panel bottom-center-panel">
        <div className="timeline-control-header">
          <div className="timeline-title">
            <Clock size={16} className={`text-cyan ${hasSimulated && isPlaying ? 'animate-pulse' : ''}`} />
            <span>
              {hasSimulated 
                ? `FLOOD WAVE PROPAGATION TIMELINE (T + ${timeStepHr}:00 HRS)` 
                : 'HYDRODYNAMIC WAVE SIMULATOR — CLEAN BASELINE MAP'}
            </span>
            {!hasSimulated && (
              <span className="clean-state-pill">
                CLEAN BASELINE
              </span>
            )}
          </div>

          <div className="timeline-actions">
            <button 
              className={`timeline-btn simulate-wave-btn ${hasSimulated && isPlaying ? 'sim-active' : ''}`}
              onClick={() => {
                if (!hasSimulated) {
                  setHasSimulated(true);
                  setTimeStepHr(1);
                  setIsPlaying(true);
                } else {
                  setIsPlaying(prev => !prev);
                }
              }}
            >
              {hasSimulated && isPlaying ? <Pause size={15} /> : <Play size={15} className="pulse-icon text-cyan" />}
              <span className="font-bold">
                {!hasSimulated ? 'SIMULATE WAVE' : isPlaying ? 'PAUSE WAVE' : 'RESUME WAVE'}
              </span>
            </button>
            <button 
              className="timeline-btn"
              onClick={() => { 
                setHasSimulated(false); 
                setIsPlaying(false); 
                setTimeStepHr(1); 
              }}
              title="Reset to Clean Baseline Map"
            >
              <RotateCcw size={14} />
              <span>Reset</span>
            </button>
          </div>
        </div>

        <div className="timeline-slider-track">
          <input 
            type="range" 
            min="1" 
            max="24" 
            step="1"
            value={timeStepHr}
            onChange={(e) => {
              const val = parseInt(e.target.value);
              setTimeStepHr(val);
              if (!hasSimulated) setHasSimulated(true);
            }}
            className="timeline-range"
          />
          <div className="timeline-ticks">
            {selectedDamId === 'khadakwasla' ? (
              <>
                <span>T+1h (Sinhagad Rd)</span>
                <span>T+4h (Deccan/Sangam)</span>
                <span>T+8h (Bund Garden)</span>
                <span>T+12h (Mundhwa/Hadapsar)</span>
                <span>T+18h (Loni Kalbhor)</span>
                <span>T+24h (Theur / Max Reach)</span>
              </>
            ) : (
              <>
                <span>T+1h (Dam Crest)</span>
                <span>T+4h (Burla/Vyara)</span>
                <span>T+8h (Sambalpur/Kamrej)</span>
                <span>T+12h (Mid-Reach)</span>
                <span>T+18h (Delta)</span>
                <span>T+24h (Max Extent)</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Map Legend (Collapsible) */}
      <div className={`map-floating-panel bottom-left-panel ${!isLegendOpen ? 'collapsed' : ''}`}>
        <div 
          className="legend-header clickable"
          onClick={() => setIsLegendOpen(!isLegendOpen)}
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
        >
          <span>LEGEND</span>
          {isLegendOpen ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
        </div>
        {isLegendOpen && (
          <div className="legend-items" style={{ marginTop: '8px' }}>
            <div className="legend-row">
              <span className="legend-swatch" style={{ background: '#0284c7' }}></span>
              <span>Delft3D Flexible Mesh</span>
            </div>
            <div className="legend-row">
              <span className="legend-swatch" style={{ background: '#8b5cf6' }}></span>
              <span>SPH DualSPHysics</span>
            </div>
            <div className="legend-row">
              <span className="legend-swatch" style={{ background: '#10b981' }}></span>
              <span>GEE Sentinel-1 SAR Ground Truth</span>
            </div>
            <div className="legend-row">
              <span className="legend-swatch" style={{ background: '#f59e0b', border: '1px dashed #fff' }}></span>
              <span>Disagreement / High Uncertainty Zone</span>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .gis-map-wrapper {
          position: relative;
          width: 100%;
          height: calc(100vh - 125px);
          min-height: 580px;
          background: #e2e8f0;
          overflow: hidden;
        }

        .gis-map-canvas {
          width: 100%;
          height: 100%;
        }

        .map-floating-panel {
          position: absolute;
          z-index: 800;
          background: rgba(255, 255, 255, 0.96);
          backdrop-filter: blur(16px);
          border: 1px solid #cbd5e1;
          border-radius: var(--radius-md);
          padding: 10px 14px;
          box-shadow: 0 10px 25px rgba(15, 23, 42, 0.12);
          color: #0f172a;
        }

        .top-left-panel {
          top: 14px;
          left: 14px;
          max-width: 310px;
          transition: all 0.2s ease;
        }

        .top-left-panel.collapsed {
          padding: 8px 14px;
          cursor: pointer;
        }

        .top-left-panel.collapsed .panel-header {
          margin-bottom: 0;
          padding-bottom: 0;
          border-bottom: none;
        }

        .clickable {
          cursor: pointer;
          user-select: none;
        }

        .top-right-panel {
          top: 14px;
          right: 14px;
        }

        .bottom-center-panel {
          bottom: 24px;
          left: 50%;
          transform: translateX(-50%);
          width: 85%;
          max-width: 720px;
          z-index: 900;
          background: rgba(255, 255, 255, 0.98);
          border: 1px solid #93c5fd;
          border-radius: 16px;
          box-shadow: 0 12px 35px rgba(30, 58, 138, 0.15);
        }

        .bottom-left-panel {
          bottom: 24px;
          left: 14px;
          max-width: 230px;
          font-size: 0.75rem;
          z-index: 850;
          transition: all 0.2s ease;
          background: rgba(255, 255, 255, 0.95);
          border: 1px solid #cbd5e1;
          color: #0f172a;
        }

        .bottom-left-panel.collapsed {
          padding: 6px 12px;
          cursor: pointer;
        }

        .panel-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 7px;
          font-size: 0.775rem;
          font-weight: 800;
          color: #0f172a;
          letter-spacing: 0.05em;
          margin-bottom: 8px;
          padding-bottom: 6px;
          border-bottom: 1px solid #e2e8f0;
        }

        .layer-toggles-grid {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .layer-toggle-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 6px 10px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: var(--radius-sm);
          color: #334155;
          font-size: 0.75rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.15s ease;
          text-align: left;
        }

        .layer-toggle-btn:hover {
          background: #f1f5f9;
          color: #0f172a;
        }

        .layer-toggle-btn.active {
          color: #0284c7;
          background: #e0f2fe;
          border-color: #38bdf8;
        }

        .layer-color-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          flex-shrink: 0;
        }

        .opacity-slider-row {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-top: 8px;
          padding-top: 6px;
          border-top: 1px solid #e2e8f0;
        }

        .tactical-slider {
          flex: 1;
          accent-color: #0284c7;
          height: 4px;
          cursor: pointer;
        }

        .basemap-pill-group {
          display: flex;
          gap: 4px;
          background: #f1f5f9;
          padding: 3px;
          border-radius: var(--radius-sm);
          border: 1px solid #cbd5e1;
        }

        .basemap-btn {
          padding: 5px 10px;
          border: none;
          background: transparent;
          color: #475569;
          font-size: 0.75rem;
          font-weight: 600;
          border-radius: var(--radius-sm);
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .basemap-btn:hover {
          color: #0284c7;
        }

        .basemap-btn.active {
          background: #0284c7;
          color: #ffffff;
          box-shadow: 0 1px 4px rgba(2, 132, 199, 0.35);
        }

        .timeline-control-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 8px;
        }

        .timeline-title {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.825rem;
          font-weight: 800;
          letter-spacing: 0.04em;
          color: #0f172a;
        }

        .clean-state-pill {
          background: #e0f2fe;
          color: #0284c7;
          border: 1px solid #bae6fd;
          font-size: 0.65rem;
          font-weight: 700;
          padding: 2px 8px;
          border-radius: 9999px;
          letter-spacing: 0.04em;
        }

        .timeline-actions {
          display: flex;
          gap: 6px;
        }

        .timeline-btn {
          display: flex;
          align-items: center;
          gap: 5px;
          padding: 5px 11px;
          background: #f8fafc;
          border: 1px solid #cbd5e1;
          border-radius: var(--radius-sm);
          color: #1e293b;
          font-size: 0.75rem;
          font-weight: 600;
          cursor: pointer;
        }

        .timeline-btn:hover {
          background: #f1f5f9;
          border-color: #94a3b8;
        }

        .simulate-wave-btn {
          background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%) !important;
          border: none !important;
          color: #ffffff !important;
          padding: 7px 16px !important;
          font-size: 0.8rem !important;
          letter-spacing: 0.03em !important;
          box-shadow: 0 4px 14px rgba(2, 132, 199, 0.35) !important;
          transition: all 0.2s ease !important;
        }

        .simulate-wave-btn:hover {
          background: #0369a1 !important;
          box-shadow: 0 6px 20px rgba(2, 132, 199, 0.5) !important;
          transform: translateY(-1px);
        }

        .simulate-wave-btn.sim-active {
          background: #ef4444 !important;
          color: #ffffff !important;
          box-shadow: 0 4px 14px rgba(239, 68, 68, 0.4) !important;
        }

        .timeline-range {
          width: 100%;
          accent-color: #0284c7;
          cursor: pointer;
          margin-bottom: 4px;
        }

        .timeline-ticks {
          display: flex;
          justify-content: space-between;
          color: #64748b;
          font-size: 0.7rem;
          font-family: var(--font-sans);
          font-weight: 600;
        }

        .legend-header {
          font-size: 0.75rem;
          font-weight: 800;
          color: #0f172a;
        }

        .legend-items {
          display: flex;
          flex-direction: column;
          gap: 5px;
          margin-top: 6px;
        }

        .legend-row {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #334155;
          font-size: 0.725rem;
          font-weight: 500;
        }

        .legend-swatch {
          width: 12px;
          height: 12px;
          border-radius: 3px;
          flex-shrink: 0;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
        }
      `}</style>
    </div>
  );
}
