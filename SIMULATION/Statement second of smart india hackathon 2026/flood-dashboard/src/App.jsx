import React, { useState, useEffect, useMemo, useRef } from 'react';
import Map, { Source, Layer, Marker, NavigationControl } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Download, Play, Square, RefreshCcw, Info, Layers, CloudRain, Camera } from 'lucide-react';

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN || '';
const EMPTY_POLYGON = { type: 'Polygon', coordinates: [[[0, 0], [0, 0.0001], [0.0001, 0.0001], [0.0001, 0], [0, 0]]] };

import riverCenterline from './riverCoords.json';
import allWaterData from './all_water.json';
import sphPoints from './sphPoints.json';
import * as turf from '@turf/turf';

// Mocked centerline for Rishiganga River / Chamoli rock-ice avalanche
const INDIA_RIVER_CENTERLINE = [[79.6902371, 30.4877383], [79.6905699, 30.4879689], [79.6902371, 30.4877383], [79.6911764, 30.4872258], [79.6922815, 30.4865786], [79.6929037, 30.4860516], [79.6937889, 30.4853582], [79.693959, 30.4850778], [79.694159, 30.4847479], [79.6944916, 30.4840175], [79.6957362, 30.4832039], [79.6964872, 30.4822978], [79.69697, 30.4810958], [79.6970451, 30.4800972], [79.6976137, 30.4795055], [79.6986759, 30.4789322], [79.6993303, 30.4782202], [79.6998882, 30.4774251], [79.700768, 30.4767593], [79.7018516, 30.4757607], [79.7025382, 30.474984], [79.7034931, 30.4740963], [79.7045016, 30.4736155], [79.7049737, 30.472885], [79.7062611, 30.472136], [79.7072911, 30.4710818], [79.7082674, 30.4702819], [79.7090781, 30.4700153], [79.7094583, 30.4698704], [79.7105634, 30.4694451], [79.7115934, 30.4693156], [79.7130847, 30.468955], [79.7140932, 30.4679655], [79.7153914, 30.4677898], [79.7171938, 30.4687423], [79.7177624, 30.4688163], [79.7197366, 30.4688255], [79.721142, 30.46963], [79.722569, 30.4696115], [79.72435, 30.4692047], [79.7261202, 30.4688902], [79.7278047, 30.4687238], [79.7289419, 30.4680395], [79.7296822, 30.4675679], [79.7309911, 30.4665229], [79.7322186, 30.4665454], [79.7330618, 30.4668003], [79.7344136, 30.4670963], [79.7355938, 30.4673922], [79.7362375, 30.4682799], [79.7372031, 30.4686683], [79.7381365, 30.4695283], [79.739145, 30.4698242], [79.7403896, 30.4700369], [79.7414732, 30.4707952], [79.743855, 30.471387], [79.7456789, 30.4722007], [79.7471809, 30.4723487], [79.7490907, 30.472774], [79.7504425, 30.4724041], [79.7517514, 30.4724226], [79.7534573, 30.4723764], [79.7541495, 30.4721952], [79.7549057, 30.4719973], [79.7565043, 30.4708506], [79.7582316, 30.4704253], [79.7590041, 30.4699444], [79.7599482, 30.4687053], [79.7607207, 30.4672997], [79.7606134, 30.4667079], [79.760077, 30.4652283], [79.7600341, 30.464137], [79.7621369, 30.4636932], [79.7634137, 30.4626204], [79.7641218, 30.4619638], [79.7650874, 30.4615754], [79.7663855, 30.4609743], [79.7673833, 30.4602344], [79.7684991, 30.4601327], [79.7695184, 30.460142], [79.7715139, 30.459957], [79.7725224, 30.4597905], [79.7740888, 30.4590692], [79.774505, 30.4592127], [79.7746253, 30.4592542], [79.7749471, 30.4597536], [79.7753763, 30.4603454], [79.7762668, 30.4604102], [79.7777581, 30.459772], [79.7787988, 30.4589859], [79.7801828, 30.4585328], [79.7815883, 30.4580981], [79.7818565, 30.4570161], [79.7820067, 30.456156], [79.7827363, 30.4554438], [79.7836482, 30.4550092], [79.7840452, 30.4541398], [79.7839057, 30.4529929], [79.7837877, 30.4522438], [79.7845602, 30.4514299], [79.7860193, 30.4508842], [79.786663, 30.450838], [79.7883689, 30.4509443], [79.7888517, 30.4510692], [79.7896062, 30.4511816], [79.7898763, 30.4512218], [79.7909975, 30.4510784], [79.792124, 30.4506345], [79.7931862, 30.450394], [79.7943878, 30.4504125], [79.7962117, 30.4500611], [79.7981751, 30.4500611], [79.7989368, 30.4496356], [79.7999132, 30.4492101], [79.8009914, 30.4490483], [79.8019516, 30.4482575], [79.8031264, 30.4480262], [79.804151, 30.4477488], [79.8067045, 30.4471568], [79.8079061, 30.4471106], [79.8088932, 30.4466111], [79.8099124, 30.4457972], [79.8106098, 30.4456954], [79.8118007, 30.4455289], [79.8127019, 30.4452422], [79.8132276, 30.4445947], [79.8142469, 30.4438548], [79.8150945, 30.4433645], [79.8166072, 30.4424303], [79.8173904, 30.4419956], [79.8181629, 30.4413111], [79.8194504, 30.4398681], [79.8201799, 30.4391928], [79.821918, 30.4388321], [79.8232055, 30.4383603], [79.8243534, 30.4375648], [79.8250294, 30.4365935], [79.8257804, 30.4359645], [79.8271, 30.4356593], [79.8276687, 30.4349285], [79.8279476, 30.4339202], [79.8283883, 30.4336056], [79.8301792, 30.4324308], [79.8321319, 30.4315335], [79.8351574, 30.4299146], [79.8361444, 30.4294706], [79.8382044, 30.4287675], [79.839395, 30.4285239], [79.8407364, 30.4282494], [79.8426032, 30.4281754], [79.844706, 30.4283974], [79.8477101, 30.4284715], [79.8494482, 30.4283604], [79.8505211, 30.4279349], [79.8535037, 30.4266212], [79.8553598, 30.4257701], [79.8573124, 30.4253538], [79.8587501, 30.4248357], [79.8599839, 30.4244934], [79.8619151, 30.4241419], [79.863503, 30.4239383], [79.8657989, 30.4234572], [79.8678159, 30.4229392], [79.8694038, 30.4226246], [79.8712063, 30.4226246], [79.8720646, 30.4230132], [79.873352, 30.4234202], [79.8753691, 30.4233832], [79.8771286, 30.4229947], [79.8783731, 30.4220325], [79.879725, 30.4216624], [79.8818922, 30.4212369], [79.8839092, 30.4211998], [79.8866558, 30.4211443], [79.8886943, 30.4209408], [79.8903894, 30.4205892], [79.892106, 30.4201451], [79.8932647, 30.41959], [79.8941445, 30.4194975], [79.8947453, 30.4189424], [79.8949331, 30.4179709], [79.8952603, 30.417166], [79.8957753, 30.4166664], [79.8968482, 30.4162038], [79.8980713, 30.4161483], [79.8999166, 30.4160187], [79.9018049, 30.4155376], [79.9036503, 30.415075]];

function App() {
  const [waterLevel, setWaterLevel] = useState(5);
  const [isSimulating, setIsSimulating] = useState(false);
  const [isRaining, setIsRaining] = useState(false);
  const [flowPhase, setFlowPhase] = useState(0);
  const [simStep, setSimStep] = useState(0); // Start at dam (index 0)
  const [activeSimulation, setActiveSimulation] = useState('reservoir');
  const [indiaStep, setIndiaStep] = useState(0);
  const [indiaPlaying, setIndiaPlaying] = useState(false);
  const [cameraFollowing, setCameraFollowing] = useState(true);
  const indiaMapRef = useRef(null);
  const maxSteps = riverCenterline.length - 1;

  const [viewState, setViewState] = useState({
    longitude: 73.7630,
    latitude: 18.4350,
    zoom: 12.5,
    pitch: 65,
    bearing: 45 
  });

  // Flow simulation effect
  useEffect(() => {
    let interval;
    if (isSimulating) {
      interval = setInterval(() => {
        setSimStep((prev) => {
          if (prev >= maxSteps) {
            setIsSimulating(false);
            return prev;
          }
          return prev + 5; // advance 5 points per tick for smoother, faster animation
        });
      }, 50); 
    }
    return () => clearInterval(interval);
  }, [isSimulating]);

  useEffect(() => {
    if (!indiaPlaying) return undefined;
    const timer = window.setInterval(() => {
      setIndiaStep((step) => {
        if (step >= 9) {
          setIndiaPlaying(false);
          return step;
        }
        return step + 1;
      });
    }, 850);
    return () => window.clearInterval(timer);
  }, [indiaPlaying]);

  const indiaHydrology = useMemo(() => {
    const reach = Math.max(2, Math.ceil((indiaStep + 1) / 10 * INDIA_RIVER_CENTERLINE.length));
    const activeLine = turf.lineString(INDIA_RIVER_CENTERLINE.slice(0, reach));
    const progress = (indiaStep + 1) / 10;
    const inner = turf.buffer(activeLine, 0.028 + progress * 0.012, { units: 'kilometers', steps: 12 });
    const flood = turf.buffer(activeLine, 0.055 + progress * 0.04, { units: 'kilometers', steps: 12 });
    const fringe = turf.buffer(activeLine, 0.10 + progress * 0.06, { units: 'kilometers', steps: 12 });
    return {
      route: { type: 'FeatureCollection', features: [activeLine] },
      inner: { type: 'FeatureCollection', features: [inner] },
      flood: { type: 'FeatureCollection', features: [flood] },
      fringe: { type: 'FeatureCollection', features: [fringe] },
      activeCoordinates: INDIA_RIVER_CENTERLINE.slice(0, reach)
    };
  }, [indiaStep]);

  useEffect(() => {
    if (activeSimulation !== 'india' || !cameraFollowing || !indiaMapRef.current) return;
    const coords = indiaHydrology.activeCoordinates;
    const front = coords[coords.length - 1];
    const previous = coords[Math.max(0, coords.length - 2)];
    const bearing = turf.bearing(turf.point(previous), turf.point(front));
    indiaMapRef.current.easeTo({
      center: front,
      zoom: 13.4,
      pitch: 68,
      bearing,
      duration: 1150,
      essential: true
    });
  }, [activeSimulation, cameraFollowing, indiaHydrology]);

  const indiaFlowParticles = useMemo(() => {
    const line = turf.lineString(indiaHydrology.activeCoordinates);
    const length = turf.length(line, { units: 'kilometers' });
    const features = [];
    const count = 24;
    const trail = Math.min(0.12, length / (count * 1.5));
    for (let i = 0; i < count; i += 1) {
      const distance = ((i / count + flowPhase / 100) % 1) * Math.max(0.001, length - trail);
      const start = turf.along(line, distance, { units: 'kilometers' });
      const end = turf.along(line, Math.min(length, distance + trail), { units: 'kilometers' });
      features.push({ type: 'Feature', properties: {}, geometry: turf.lineString([start.geometry.coordinates, end.geometry.coordinates]).geometry });
    }
    return { type: 'FeatureCollection', features };
  }, [indiaHydrology, flowPhase]);

  // A subtle moving highlight gives the water surface a sense of downstream motion.
  useEffect(() => {
    const timer = window.setInterval(() => setFlowPhase((phase) => (phase + 1) % 100), 90);
    return () => window.clearInterval(timer);
  }, []);

  // Build a smooth, rounded water surface along the active centerline.
  const floodedRoute = useMemo(() => {
    return {
      type: 'FeatureCollection',
      features: [{
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates: riverCenterline.slice(0, simStep + 1)
        }
      }]
    };
  }, [simStep]);

  // Graduated buffers create a soft wet edge around the main flow channel.
  const { polyShallowFC, polyEdgeFC, polyDeepFC } = useMemo(() => {
    // A tiny polygon at 0,0 to act as a fallback so Mapbox 'within' doesn't crash on null
    const fallback = {
      type: 'Polygon',
      coordinates: [[[0,0], [0,0.0001], [0.0001,0.0001], [0.0001,0], [0,0]]]
    };
    
    if (simStep === 0 || riverCenterline.length < 2) {
      return { polyShallowFC: { type: 'FeatureCollection', features: [] }, polyEdgeFC: { type: 'FeatureCollection', features: [] }, polyDeepFC: { type: 'FeatureCollection', features: [] } };
    }
    
    const currentLine = riverCenterline.slice(0, simStep + 1);
    if (currentLine.length < 2) {
      return { polyShallowFC: { type: 'FeatureCollection', features: [] }, polyEdgeFC: { type: 'FeatureCollection', features: [] }, polyDeepFC: { type: 'FeatureCollection', features: [] } };
    }
    
    // Dynamic buffer width based on waterLevel slider
    const baseRadius = waterLevel * 0.018;
    try {
      const lineString = turf.lineString(currentLine);
      const bDeep = turf.buffer(lineString, Math.max(0.012, baseRadius * 0.22), { units: 'kilometers', steps: 12 });
      const bMedium = turf.buffer(lineString, Math.max(0.025, baseRadius * 0.58), { units: 'kilometers', steps: 12 });
      const bShallow = turf.buffer(lineString, Math.max(0.04, baseRadius), { units: 'kilometers', steps: 12 });
      
      return {
        polyShallowFC: { type: 'FeatureCollection', features: [bShallow] },
        polyEdgeFC: { type: 'FeatureCollection', features: [bMedium] },
        polyDeepFC: { type: 'FeatureCollection', features: [bDeep] }
      };
    } catch (e) {
      return { polyShallowFC: { type: 'FeatureCollection', features: [] }, polyEdgeFC: { type: 'FeatureCollection', features: [] }, polyDeepFC: { type: 'FeatureCollection', features: [] } };
    }
  }, [simStep, waterLevel]);

  // Wave front (the very tip of the flood)
  const waveFront = useMemo(() => {
    if (simStep === 0) return null; // No front if still at origin
    const frontStart = Math.max(0, simStep - 15); // Adjust wavefront tail length for 366 points
    return {
      type: 'FeatureCollection',
      features: [{
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates: riverCenterline.slice(frontStart, simStep + 1)
        }
      }]
    };
  }, [simStep]);

  // SPH Grid Points (Colorful particles)
  const activeSphPoints = useMemo(() => {
    if (simStep === 0) {
      return { type: 'FeatureCollection', features: [] };
    }
    return {
      type: 'FeatureCollection',
      features: sphPoints.filter(p => p.idx <= simStep).map(p => ({
        type: 'Feature',
        properties: { color: p.color },
        geometry: { type: 'Point', coordinates: p.coords }
      }))
    };
  }, [simStep]);

  const timeSinceBreach = simStep > 0 ? simStep * 2 : 0; // minutes (faster timeline for more points)

  return (
    <div className="flex h-screen w-full bg-slate-50 text-slate-900 overflow-hidden font-sans relative">
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 rounded-xl bg-slate-950/85 p-1.5 shadow-xl flex gap-1">
        <button onClick={() => { setActiveSimulation('reservoir'); setIndiaPlaying(false); }} className={`px-4 py-2 rounded-lg text-xs font-semibold transition ${activeSimulation === 'reservoir' ? 'bg-cyan-400 text-slate-950' : 'text-white/75 hover:bg-white/10'}`}>Khadakwasla Reservoir</button>
        <button onClick={() => { setActiveSimulation('india'); setIsSimulating(false); }} className={`px-4 py-2 rounded-lg text-xs font-semibold transition ${activeSimulation === 'india' ? 'bg-cyan-400 text-slate-950' : 'text-white/75 hover:bg-white/10'}`}>India Flood Scenario</button>
      </div>

      {activeSimulation === 'reservoir' && <>
      <Map
        {...viewState}
        onMove={evt => setViewState(evt.viewState)}
        mapStyle="mapbox://styles/mapbox/satellite-streets-v12"
        mapboxAccessToken={MAPBOX_TOKEN}
        terrain={{ source: 'mapbox-dem', exaggeration: 1.5 }}
        className="w-full h-full absolute inset-0 z-0"
      >
        <Source id="mapbox-dem" type="raster-dem" url="mapbox://mapbox.mapbox-terrain-dem-v1" tileSize={512} maxzoom={14} />

        {/* 3D BUILDINGS */}
        <Layer
          id="3d-buildings"
          source="composite"
          source-layer="building"
          filter={['==', 'extrude', 'true']}
          type="fill-extrusion"
          paint={{
            'fill-extrusion-color': [
              'case',
              ['within', polyDeepFC.features[0]?.geometry ?? EMPTY_POLYGON], '#dc2626',
              ['within', polyEdgeFC.features[0]?.geometry ?? EMPTY_POLYGON], '#f97316',
              ['within', polyShallowFC.features[0]?.geometry ?? EMPTY_POLYGON], '#facc15',
              '#f8fafc' // Unaffected = White/Light Grey
            ],
            'fill-extrusion-height': ['get', 'height'],
            'fill-extrusion-base': ['get', 'min_height'],
            'fill-extrusion-opacity': 0.85
          }}
        />

        {/* ALL WATER BODIES (LAKES & RIVERS STATIC BACKGROUND) */}
        <Source id="all-water-data" type="geojson" data={allWaterData}>
          <Layer 
            id="all-water-fill" 
            type="fill" 
            filter={['==', ['geometry-type'], 'Polygon']}
            paint={{
              'fill-color': '#1d4ed8', 
              'fill-opacity': 0.8
            }}
          />
          <Layer 
            id="all-water-line" 
            type="line" 
            filter={['==', ['geometry-type'], 'LineString']}
            paint={{
              'line-color': '#1d4ed8', 
              'line-opacity': 0.8,
              'line-width': 4
            }}
          />
        </Source>

        {/* Soft spill edge beneath the main channel */}
        <Source id="flood-edge" type="geojson" data={polyShallowFC}>
          <Layer id="flood-edge-fill" type="fill" paint={{ 'fill-color': '#55bce8', 'fill-opacity': 0.13 }} />
          <Layer id="flood-edge-outline" type="line" layout={{ 'line-join': 'round', 'line-cap': 'round' }} paint={{ 'line-color': '#83ddff', 'line-opacity': 0.38, 'line-width': 1.2, 'line-blur': 1 }} />
        </Source>

        {/* Deep central water area */}
        <Source id="flood-deep" type="geojson" data={polyDeepFC}>
          <Layer id="flood-deep-fill" type="fill" paint={{ 'fill-color': '#0879b6', 'fill-opacity': 0.44 }} />
        </Source>

        {/* SOLID FLOOD FLOW */}
        <Source id="flood-route" type="geojson" data={floodedRoute}>
          <Layer 
            id="flood-underlay" 
            type="line" 
            layout={{ 'line-join': 'round', 'line-cap': 'round' }}
            paint={{ 
              'line-color': '#064b78',
              'line-opacity': 0.68,
              'line-width': ['interpolate', ['linear'], ['zoom'], 10, Math.max(3, waterLevel * 0.7), 15, Math.max(13, waterLevel * 4.4)],
              'line-blur': 1.2
            }}
          />
          <Layer
            id="flood-layer"
            type="line"
            layout={{ 'line-join': 'round', 'line-cap': 'round' }}
            paint={{
              'line-color': '#38bdf8',
              'line-opacity': 0.74,
              'line-width': ['interpolate', ['linear'], ['zoom'], 10, Math.max(2, waterLevel * 0.42), 15, Math.max(8, waterLevel * 2.35)],
              'line-blur': 0.55
            }}
          />
          <Layer
            id="flow-highlight"
            type="line"
            layout={{ 'line-join': 'round', 'line-cap': 'round' }}
            paint={{
              'line-color': '#d8f7ff',
              'line-opacity': 0.38,
              'line-width': ['interpolate', ['linear'], ['zoom'], 10, 0.7, 15, 2.2],
              'line-dasharray': [1.2, 2.4],
              'line-translate': [0, flowPhase % 8]
            }} 
          />
        </Source>

        {/* DYNAMIC FLOOD POLYGON OVERLAY */}
        <Source id="flood-polygon-source" type="geojson" data={polyShallowFC}>
          <Layer 
            id="flood-polygon-layer" 
            type="fill" 
            paint={{
              'fill-color': '#159bd2',
              'fill-opacity': 0.16
            }}
          />
        </Source>

        {/* SPH POINTS LAYER */}
        <Source id="sph-points" type="geojson" data={activeSphPoints}>
          <Layer 
            id="sph-layer" 
            type="circle" 
            paint={{
              'circle-radius': ['interpolate', ['linear'], ['zoom'], 10, 1, 15, 2.4],
              'circle-color': '#d7f6ff',
              'circle-opacity': 0.5,
              'circle-blur': 0.25
            }} 
          />
        </Source>

        {/* WAVE FRONT (CYAN OUTLINE) */}
        {waveFront && (
          <Source id="wave-front" type="geojson" data={waveFront}>
            <Layer 
              id="wave-front-layer" 
              type="line" 
              layout={{ 'line-join': 'round', 'line-cap': 'round' }}
              paint={{ 
                'line-color': '#22d3ee', // Cyan wave front
                'line-opacity': 1,
                'line-width': ['interpolate', ['linear'], ['zoom'], 10, (waterLevel * 2) + 2, 15, (waterLevel * 15) + 6] 
              }} 
            />
          </Source>
        )}

        <Marker longitude={73.7630} latitude={18.4350} anchor="bottom">
          <div className="w-4 h-4 bg-red-500 rounded-full border-2 border-white shadow-lg animate-pulse"></div>
        </Marker>
      </Map>
      </>}

      {activeSimulation === 'india' && <>
        <Map
          ref={indiaMapRef}
          initialViewState={{ longitude: 79.680, latitude: 30.450, zoom: 12.1, pitch: 62, bearing: 12 }}
          mapStyle="mapbox://styles/mapbox/satellite-streets-v12"
          mapboxAccessToken={MAPBOX_TOKEN}
          terrain={{ source: 'india-dem', exaggeration: 1.8 }}
          className="absolute inset-0 h-full w-full"
        >
          <Source id="india-dem" type="raster-dem" url="mapbox://mapbox.mapbox-terrain-dem-v1" tileSize={512} maxzoom={14} />
          <Source id="india-flood-fringe" type="geojson" data={indiaHydrology.fringe}>
            <Layer id="india-fringe-fill" type="fill" paint={{ 'fill-color': '#65b9d8', 'fill-opacity': 0.075 }} />
            <Layer id="india-fringe-edge" type="line" layout={{ 'line-join': 'round', 'line-cap': 'round' }} paint={{ 'line-color': '#a6d8e8', 'line-width': 0.7, 'line-opacity': 0.18, 'line-blur': 1.1 }} />
          </Source>
          <Source id="india-flood-surface" type="geojson" data={indiaHydrology.flood}>
            <Layer id="india-water-fill" type="fill" paint={{ 'fill-color': '#168ab4', 'fill-opacity': 0.2 }} />
            <Layer id="india-water-edge" type="line" layout={{ 'line-join': 'round', 'line-cap': 'round' }} paint={{ 'line-color': '#b9e9f5', 'line-width': 0.8, 'line-opacity': 0.24, 'line-blur': 0.7 }} />
          </Source>
          <Source id="india-river-channel" type="geojson" data={indiaHydrology.inner}>
            <Layer id="india-channel-fill" type="fill" paint={{ 'fill-color': '#0879a4', 'fill-opacity': 0.56 }} />
          </Source>
          <Layer
            id="india-3d-buildings"
            source="composite"
            source-layer="building"
            filter={['==', 'extrude', 'true']}
            type="fill-extrusion"
            paint={{
              'fill-extrusion-color': ['case', ['within', indiaHydrology.flood.features[0].geometry], '#66b6cd', '#e5e9eb'],
              'fill-extrusion-height': ['coalesce', ['get', 'height'], 8],
              'fill-extrusion-base': ['coalesce', ['get', 'min_height'], 0],
              'fill-extrusion-opacity': 0.86,
              'fill-extrusion-vertical-gradient': true
            }}
          />
          <Source id="india-river-line" type="geojson" data={indiaHydrology.route}>
            <Layer id="india-river-bed" type="line" layout={{ 'line-join': 'round', 'line-cap': 'round' }} paint={{ 'line-color': '#06445f', 'line-width': ['interpolate', ['linear'], ['zoom'], 10, 4, 15, 20], 'line-opacity': 0.62, 'line-blur': 0.9 }} />
            <Layer id="india-river-surface" type="line" layout={{ 'line-join': 'round', 'line-cap': 'round' }} paint={{ 'line-color': '#168fc0', 'line-width': ['interpolate', ['linear'], ['zoom'], 10, 2.8, 15, 13], 'line-opacity': 0.86, 'line-blur': 0.35 }} />
          </Source>
          <Source id="india-flow-particles" type="geojson" data={indiaFlowParticles}>
            <Layer id="india-flow-glints" type="line" layout={{ 'line-join': 'round', 'line-cap': 'round' }} paint={{ 'line-color': '#c7f4ff', 'line-width': ['interpolate', ['linear'], ['zoom'], 10, 0.7, 15, 1.8], 'line-opacity': 0.68, 'line-blur': 0.35 }} />
          </Source>
          
          <NavigationControl position="bottom-right" visualizePitch={true} />
        </Map>

        <div className="absolute top-20 left-4 z-10 rounded-xl border border-white/15 bg-slate-950/75 p-4 text-white shadow-xl backdrop-blur-md">
          <div className="text-[10px] uppercase tracking-[0.2em] text-cyan-200">India flood simulation</div>
          <h2 className="mt-1 text-base font-semibold">Chamoli · Uttarakhand</h2>
          <p className="mt-1 text-xs text-white/65">Illustrative flood spread · hour {indiaStep + 1}</p>
          <div className="mt-3 flex items-center gap-2 text-[11px] text-white/75"><span className="h-2.5 w-5 rounded-sm bg-sky-400/65" /> Overbank water</div>
          <div className="mt-2 flex items-center gap-2 text-[11px] text-white/75"><span className="h-0.5 w-5 bg-cyan-100" /> River channel</div>
          <p className="mt-3 border-t border-white/10 pt-2 text-[9px] text-white/45">Rishiganga River (Mock Data)</p>
        </div>

        <div className="absolute bottom-6 left-1/2 z-10 flex w-[min(760px,calc(100%-2rem))] -translate-x-1/2 flex-col gap-3 rounded-2xl border border-white/15 bg-slate-950/80 p-4 px-5 text-white shadow-2xl backdrop-blur-xl">
          <div className="flex items-center justify-between gap-3 text-xs font-semibold">
            <span>Periyar River flood progression</span>
            <span className="rounded-md bg-cyan-300/15 px-2 py-1 text-cyan-100">Hour {indiaStep + 1} / 10</span>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setCameraFollowing((following) => !following)} className={`flex items-center gap-1.5 rounded-full px-3 py-2 text-[11px] font-semibold transition ${cameraFollowing ? 'bg-cyan-300/15 text-cyan-100' : 'bg-white/10 text-white/65 hover:bg-white/15'}`} aria-pressed={cameraFollowing}>
              <Camera size={14} /> Camera {cameraFollowing ? 'following' : 'free'}
            </button>
            <button onClick={() => { if (indiaStep >= 9) setIndiaStep(0); setIndiaPlaying(!indiaPlaying); }} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-cyan-400 text-slate-950 shadow-lg transition hover:bg-cyan-300">
              {indiaPlaying ? <Square size={15} className="fill-current" /> : <Play size={16} className="fill-current" />}
            </button>
            <input type="range" min="0" max="9" value={indiaStep} onChange={(event) => { setIndiaPlaying(false); setIndiaStep(Number(event.target.value)); }} className="w-full accent-cyan-300" aria-label="Flood simulation hour" />
          </div>
          <div className="flex justify-between pl-14 text-[10px] text-white/50"><span>Hour 1</span><span>Hour 10</span></div>
        </div>
      </>}

      {/* RAIN OVERLAY */}
      {isRaining && (
        <div 
          className="absolute inset-0 z-[5] pointer-events-none animate-rain mix-blend-screen opacity-60"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cline x1='0' y1='0' x2='20' y2='60' stroke='rgba(255,255,255,0.7)' stroke-width='1.5' stroke-linecap='round'/%3E%3Cline x1='100' y1='100' x2='120' y2='160' stroke='rgba(255,255,255,0.4)' stroke-width='1' stroke-linecap='round'/%3E%3Cline x1='50' y1='150' x2='70' y2='210' stroke='rgba(255,255,255,0.5)' stroke-width='1' stroke-linecap='round'/%3E%3Cline x1='150' y1='20' x2='170' y2='80' stroke='rgba(255,255,255,0.6)' stroke-width='1.2' stroke-linecap='round'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat',
          }}
        />
      )}

      {/* TOP LEFT BRANDING */}
      <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur rounded-full px-4 py-2 shadow-lg flex items-center gap-2">
        <div className="w-5 h-5 bg-blue-600 rounded text-white flex items-center justify-center font-bold text-xs">F</div>
        <span className="font-bold">FloodTwin</span>
        <div className="h-4 w-[1px] bg-slate-300 mx-2"></div>
        <span className="text-sm font-medium text-slate-600 flex items-center gap-1"><Layers size={14}/> Dashboard</span>
      </div>

      {/* TOP RIGHT WEATHER CONTROL */}
      <div className="absolute top-4 right-4 z-10">
        <button 
          onClick={() => setIsRaining(!isRaining)}
          className={`px-4 py-2 rounded-full text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-lg ${
            isRaining ? 'bg-indigo-600 text-white' : 'bg-white/90 backdrop-blur text-slate-600 hover:bg-white'
          }`}
        >
          <CloudRain size={16} />
          {isRaining ? 'Stop Rain' : 'Simulate Heavy Rain'}
        </button>
      </div>

      {/* LEGEND WIDGET */}
      {activeSimulation === 'reservoir' && (
        <div className="absolute bottom-28 left-4 z-10 w-64 bg-white/95 backdrop-blur-md border border-slate-200 rounded-xl shadow-xl p-4">
          <h3 className="text-xs font-bold text-slate-800 mb-3">Legend</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-6 h-3 bg-blue-500 rounded-sm opacity-80"></div>
              <span className="text-[11px] font-medium text-slate-600">Eulerian: flooded so far (simulated)</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-6 h-3 border-2 border-cyan-400 rounded-sm"></div>
              <span className="text-[11px] font-medium text-slate-600">Wave front: last 10 min</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 bg-red-500 rounded-full"></div>
              <span className="text-[11px] font-medium text-slate-600">Breach Location</span>
            </div>
          </div>
        </div>
      )}

      {/* BOTTOM TIMELINE SLIDER WIDGET (Like the screenshot) */}
      {activeSimulation === 'reservoir' && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 w-3/4 max-w-2xl bg-white/95 backdrop-blur-md border border-slate-200 rounded-2xl shadow-2xl p-4 px-6 flex flex-col gap-3">
          <div className="flex justify-between items-center text-xs font-bold text-slate-700">
            <span>Wave front {(simStep * 0.1).toFixed(1)} km downstream of the breach.</span>
            <span className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded flex items-center gap-1">Time since breach: t + {timeSinceBreach} min</span>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={() => isSimulating ? setIsSimulating(false) : setIsSimulating(true)}
              className="w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center hover:bg-indigo-700 shadow-md transition"
            >
              {isSimulating ? <Square size={16} className="fill-current"/> : <Play size={16} className="fill-current"/>}
            </button>
            
            <div className="flex-1">
              <input 
                type="range" 
                min="0" 
                max={maxSteps} 
                value={simStep} 
                onChange={(e) => {
                  setIsSimulating(false);
                  setSimStep(Number(e.target.value));
                }} 
                className="w-full accent-indigo-600 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer" 
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1 px-1 font-medium">
                <span>0 min</span>
                <span>60 min</span>
                <span>120 min</span>
                <span>180 min</span>
                <span>240 min</span>
              </div>
            </div>
          </div>
        </div>
      )}


    </div>
  );
}

export default App;
