// VARUNASTRA: Comprehensive Geospatial, Hydrological & Disaster Data Repository
// Contains realistic data for Hirakud Dam (Mahanadi River, Odisha) and Ukai Dam (Tapi River, Gujarat)

export const DAMS_DATA = {
  khadakwasla: {
    id: "khadakwasla",
    name: "Khadakwasla Dam (SIH Statement 2 Core)",
    river: "Mutha River (Mula-Mutha Confluence)",
    basin: "Bhima / Krishna Basin",
    state: "Maharashtra",
    district: "Pune",
    coordinates: [18.4350, 73.7630],
    mapBounds: [[18.3500, 73.6500], [18.5800, 73.9500]],
    downstreamCenter: [18.4900, 73.8300],
    downstreamReachKm: 35,
    downstreamDistricts: ["Pune Urban", "Deccan", "Shivajinagar", "Yerawada", "Haveli"],
    specs: {
      type: "Masonry Gravity Dam",
      totalLengthKm: 1.53,
      mainDamLengthM: 1539,
      maxHeightM: 32.9,
      grossStorageMCM: 86.0,
      liveStorageMCM: 56.4,
      deadStorageMCM: 8.2,
      fullReservoirLevelM: 582.47,
      maximumWaterLevelM: 583.20,
      deadStorageLevelM: 568.0,
      spillwayCapacityCumecs: 2750,
      totalSluiceGates: 11,
      totalCrestGates: 6,
      catchmentAreaSqKm: 501
    },
    currentStatus: {
      timestamp: "2026-10-03 11:30 IST",
      waterLevelM: 582.15,
      waterLevelFt: 1909.9,
      percentStorage: 97.4,
      currentStorageMCM: 83.8,
      inflowCumecs: 1850,
      outflowCumecs: 1680,
      openSluiceGates: 8,
      openCrestGates: 4,
      gateOpeningM: 2.8,
      floodAlertLevel: "RED ALERT - HIGH DISCHARGE INTO PUNE CITY",
      ruleCurveStatus: "Exceeding Flood Surcharge Limit (+0.35m)",
      trend: "Rising (+0.05 m/hr)"
    },
    reservoirRuleCurve: [
      { month: "Jun", ruleLevel: 574.0, actualLevel: 573.5 },
      { month: "Jul", ruleLevel: 578.0, actualLevel: 577.8 },
      { month: "Aug", ruleLevel: 581.0, actualLevel: 581.4 },
      { month: "Sep", ruleLevel: 582.47, actualLevel: 582.15 },
      { month: "Oct", ruleLevel: 582.47, actualLevel: 582.0 },
      { month: "Nov", ruleLevel: 581.5, actualLevel: 581.0 },
      { month: "Dec", ruleLevel: 580.0, actualLevel: 579.5 }
    ],
    historicalTelemetry: [
      { time: "00:00", inflow: 950, outflow: 800, level: 581.6 },
      { time: "03:00", inflow: 1200, outflow: 1050, level: 581.8 },
      { time: "06:00", inflow: 1550, outflow: 1350, level: 581.95 },
      { time: "09:00", inflow: 1820, outflow: 1620, level: 582.10 },
      { time: "12:00", inflow: 1850, outflow: 1680, level: 582.15 }
    ],
    datasets: [
      { id: "dem", name: "High-Resolution LiDAR + SRTM 10m Pune Basin", category: "Topography", status: "Verified", format: "GeoTIFF", crs: "EPSG:32643 (UTM 43N)", resolution: "5 m", size: "310 MB", readiness: 100, issue: null },
      { id: "river_geom", name: "Mutha River OSM Centerline & Banks", category: "Hydraulics", status: "Verified", format: "JSON GeoJSON", crs: "EPSG:4326", resolution: "Vector", size: "12 MB", readiness: 100, issue: null },
      { id: "sph_particles", name: "DualSPHysics 25,000 Validated Fluid Flow Particles", category: "Lagrangian Physics", status: "Verified", format: "JSON Array", crs: "EPSG:4326", resolution: "Point Cloud", size: "2.1 MB", readiness: 100, issue: null },
      { id: "dam_geom", name: "Khadakwasla Dam Axis CAD & Spillway Profile", category: "Structure", status: "Verified", format: "GeoPackage", crs: "EPSG:32643", resolution: "CAD Vector", size: "8 MB", readiness: 100, issue: null },
      { id: "elevation_storage", name: "Khadakwasla Elevation-Storage Hypsometry Curve", category: "Hydrology", status: "Verified", format: "JSON Tabular", crs: "N/A", resolution: "0.1m step", size: "1.5 MB", readiness: 100, issue: null },
      { id: "rainfall_imd", name: "IMD Doppler Weather Radar Pashan/Pune Station", category: "Meteorology", status: "Verified", format: "NetCDF4", crs: "EPSG:4326", resolution: "0.05°", size: "45 MB", readiness: 100, issue: null },
      { id: "lulc", name: "Pune Metropolitan Region Development Authority (PMRDA) LULC", category: "Roughness", status: "Verified", format: "GeoTIFF", crs: "EPSG:32643", resolution: "10 m", size: "90 MB", readiness: 100, issue: null },
      { id: "pop_infra", name: "Pune Urban Demographics & Lifelines GeoJSON", category: "Vulnerability", status: "Verified", format: "GeoJSON", crs: "EPSG:4326", resolution: "Bldg Level", size: "55 MB", readiness: 100, issue: null },
      { id: "sentinel_gee", name: "Sentinel-1 SAR C-Band Pune Flood Inundation Asset", category: "Satellite Validation", status: "Verified", format: "GEE Asset", crs: "EPSG:4326", resolution: "10 m", size: "Cloud Asset", readiness: 100, issue: null }
    ],
    qualityAudit: {
      score: 100,
      criticalErrors: 0,
      warnings: 0,
      crsUnified: true,
      demContinuity: true,
      riverConnectivity: true,
      damGeoreferenced: true,
      recommendation: "All SIH Statement 2 datasets verified. 100% ready for Delft3D and 25,000-particle SPH execution."
    },
    settlements: [
      { id: "k1", name: "Khadakwasla Dam Toe & Gaon", distanceKm: 0.8, lat: 18.4380, lng: 73.7660, pop: 18500, elevationM: 565, arrivalTimeHr: 0.15, maxDepthM: 4.5, velocityMs: 4.2, priority: "CRITICAL", status: "Direct Discharge Impact", shelters: 2, hospitals: 1 },
      { id: "k2", name: "Nanded City / Dhayari Riverside", distanceKm: 6.2, lat: 18.4600, lng: 73.7950, pop: 85000, elevationM: 554, arrivalTimeHr: 0.8, maxDepthM: 3.4, velocityMs: 3.1, priority: "CRITICAL", status: "Submerged Riverbank", shelters: 6, hospitals: 2 },
      { id: "k3", name: "Sinhagad Road Corridor (Anand Nagar)", distanceKm: 9.5, lat: 18.4820, lng: 73.8200, pop: 140000, elevationM: 548, arrivalTimeHr: 1.4, maxDepthM: 2.8, velocityMs: 2.5, priority: "CRITICAL", status: "Severe Road Inundation", shelters: 10, hospitals: 4 },
      { id: "k4", name: "Deccan Gymkhana & Baba Bhide Bridge", distanceKm: 14.8, lat: 18.5170, lng: 73.8420, pop: 210000, elevationM: 542, arrivalTimeHr: 2.2, maxDepthM: 2.5, velocityMs: 2.1, priority: "CRITICAL", status: "Bridge Pier Overtopped", shelters: 14, hospitals: 8 },
      { id: "k5", name: "Shivajinagar / Dengle Bridge Reach", distanceKm: 17.2, lat: 18.5310, lng: 73.8580, pop: 165000, elevationM: 538, arrivalTimeHr: 2.8, maxDepthM: 2.2, velocityMs: 1.8, priority: "HIGH", status: "Causeway Submerged", shelters: 12, hospitals: 6 },
      { id: "k6", name: "Sangam Bridge / Mula-Mutha Confluence", distanceKm: 19.5, lat: 18.5360, lng: 73.8680, pop: 95000, elevationM: 534, arrivalTimeHr: 3.4, maxDepthM: 2.1, velocityMs: 1.6, priority: "HIGH", status: "Backwater Surge", shelters: 8, hospitals: 3 },
      { id: "k7", name: "Yerawada Lowlands & Bund Garden", distanceKm: 23.0, lat: 18.5450, lng: 73.8850, pop: 180000, elevationM: 530, arrivalTimeHr: 4.1, maxDepthM: 1.9, velocityMs: 1.3, priority: "HIGH", status: "Waterlogging Hazard", shelters: 15, hospitals: 5 },
      { id: "k8", name: "Mundhwa Industrial Belt & Weir", distanceKm: 28.5, lat: 18.5380, lng: 73.9350, pop: 72000, elevationM: 524, arrivalTimeHr: 5.5, maxDepthM: 1.5, velocityMs: 1.1, priority: "MEDIUM", status: "River Fringe Inundation", shelters: 6, hospitals: 2 }
    ],
    criticalAssets: [
      { id: "kh1", name: "Deenanath Mangeshkar Hospital", type: "Hospital", lat: 18.5020, lng: 73.8310, risk: "High", arrivalTimeHr: 1.8, floodDepthM: 1.4 },
      { id: "kh2", name: "Sassoon General Hospital", type: "Hospital", lat: 18.5280, lng: 73.8710, risk: "Moderate", arrivalTimeHr: 3.2, floodDepthM: 0.8 },
      { id: "kb1", name: "Bhide Bridge (Deccan Low-Level Bridge)", type: "Bridge", lat: 18.5175, lng: 73.8430, risk: "Critical (Submerged by 2.6m)", arrivalTimeHr: 2.1, floodDepthM: 2.6 },
      { id: "kb2", name: "Z-Bridge (Pedestrian Overpass)", type: "Bridge", lat: 18.5190, lng: 73.8450, risk: "High (Approach Submerged)", arrivalTimeHr: 2.2, floodDepthM: 1.8 },
      { id: "ks1", name: "Balewadi High Ground Emergency Shelter", type: "Shelter", lat: 18.5750, lng: 73.7750, risk: "Safe (Reinforced Elevation)", capacity: 15000, available: 12400 },
      { id: "ks2", name: "SPPU University Campus Shelter", type: "Shelter", lat: 18.5520, lng: 73.8280, risk: "Safe (High Ground)", capacity: 10000, available: 8200 },
      { id: "kp1", name: "Parvati Water Purification & Pumping Station", type: "Water Treatment", lat: 18.4980, lng: 73.8460, risk: "Critical Perimeter Threat", arrivalTimeHr: 1.9, floodDepthM: 1.6 }
    ]
  },

  chamoli: {
    id: "chamoli",
    name: "Rishiganga Avalanche & Flash Flood (SIH Statement 2)",
    river: "Rishiganga & Dhauliganga Rivers",
    basin: "Ganga (Alaknanda Basin)",
    state: "Uttarakhand",
    district: "Chamoli",
    coordinates: [30.4877, 79.6902],
    mapBounds: [[30.4000, 79.6500], [30.5500, 79.9200]],
    downstreamCenter: [30.4500, 79.7800],
    downstreamReachKm: 45,
    downstreamDistricts: ["Raini", "Tapovan", "Joshimath", "Vishnuprayag"],
    specs: {
      type: "Glacial Rock-Ice Avalanche Surge & Dam-Break",
      totalLengthKm: 0.45,
      mainDamLengthM: 450,
      maxHeightM: 28.0,
      grossStorageMCM: 18.5,
      liveStorageMCM: 14.2,
      deadStorageMCM: 4.3,
      fullReservoirLevelM: 1795.0,
      maximumWaterLevelM: 1802.0,
      deadStorageLevelM: 1770.0,
      spillwayCapacityCumecs: 4800,
      totalSluiceGates: 4,
      totalCrestGates: 4,
      catchmentAreaSqKm: 690
    },
    currentStatus: {
      timestamp: "2026-10-03 11:30 IST",
      waterLevelM: 1798.8,
      waterLevelFt: 5901.5,
      percentStorage: 99.2,
      currentStorageMCM: 18.3,
      inflowCumecs: 4200,
      outflowCumecs: 4150,
      openSluiceGates: 4,
      openCrestGates: 4,
      gateOpeningM: 5.5,
      floodAlertLevel: "RED ALERT - CATASTROPHIC ROCK-ICE SURGE",
      ruleCurveStatus: "Extreme Surging (+3.8m Overtopping)",
      trend: "Violent Surge (+0.8 m/min)"
    },
    reservoirRuleCurve: [
      { month: "Jun", ruleLevel: 1785.0, actualLevel: 1784.0 },
      { month: "Jul", ruleLevel: 1790.0, actualLevel: 1789.2 },
      { month: "Aug", ruleLevel: 1794.0, actualLevel: 1793.5 },
      { month: "Sep", ruleLevel: 1795.0, actualLevel: 1794.8 },
      { month: "Oct", ruleLevel: 1795.0, actualLevel: 1798.8 },
      { month: "Nov", ruleLevel: 1792.0, actualLevel: 1791.5 },
      { month: "Dec", ruleLevel: 1788.0, actualLevel: 1787.0 }
    ],
    historicalTelemetry: [
      { time: "00:00", inflow: 1200, outflow: 900, level: 1794.5 },
      { time: "03:00", inflow: 1800, outflow: 1400, level: 1795.2 },
      { time: "06:00", inflow: 2600, outflow: 2200, level: 1796.8 },
      { time: "09:00", inflow: 3800, outflow: 3400, level: 1797.9 },
      { time: "12:00", inflow: 4200, outflow: 4150, level: 1798.8 }
    ],
    datasets: [
      { id: "dem", name: "ALOS AW3D30 30m + CartoDEM Himalayan Gorge DEM", category: "Topography", status: "Verified", format: "GeoTIFF", crs: "EPSG:32644 (UTM 44N)", resolution: "12 m", size: "290 MB", readiness: 100, issue: null },
      { id: "river_geom", name: "Rishiganga & Dhauliganga Gorge Centerline", category: "Hydraulics", status: "Verified", format: "JSON GeoJSON", crs: "EPSG:4326", resolution: "Vector", size: "8 MB", readiness: 100, issue: null },
      { id: "avalanche_surge", name: "Rock-Ice Mass Failure Hydrograph & SPH Slurry", category: "Lagrangian Physics", status: "Verified", format: "JSON", crs: "EPSG:4326", resolution: "Multi-Phase", size: "4 MB", readiness: 100, issue: null },
      { id: "dam_geom", name: "Tapovan-Vishnugad Barrage & Intake CAD", category: "Structure", status: "Verified", format: "GeoPackage", crs: "EPSG:32644", resolution: "CAD Vector", size: "6 MB", readiness: 100, issue: null },
      { id: "elevation_storage", name: "Gorge Rating Curves & Hydraulic Cross Sections", category: "Hydrology", status: "Verified", format: "JSON Tabular", crs: "N/A", resolution: "0.5m step", size: "1.2 MB", readiness: 100, issue: null },
      { id: "rainfall_imd", name: "IMD Doppler & High-Altitude AWS Dehradun", category: "Meteorology", status: "Verified", format: "NetCDF4", crs: "EPSG:4326", resolution: "0.1°", size: "38 MB", readiness: 100, issue: null },
      { id: "lulc", name: "Bhuvan Glacial Land Cover & Scree Classification", category: "Roughness", status: "Verified", format: "GeoTIFF", crs: "EPSG:32644", resolution: "10 m", size: "85 MB", readiness: 100, issue: null },
      { id: "pop_infra", name: "Chamoli District Villages & Border Roads (BRO) GIS", category: "Vulnerability", status: "Verified", format: "GeoJSON", crs: "EPSG:4326", resolution: "Point/Line", size: "32 MB", readiness: 100, issue: null },
      { id: "sentinel_gee", name: "Sentinel-1 SAR C-Band GEE Chamoli Avalanche Tracking", category: "Satellite Validation", status: "Verified", format: "GEE Asset", crs: "EPSG:4326", resolution: "10 m", size: "Cloud Asset", readiness: 100, issue: null }
    ],
    qualityAudit: {
      score: 98,
      criticalErrors: 0,
      warnings: 0,
      crsUnified: true,
      demContinuity: true,
      riverConnectivity: true,
      damGeoreferenced: true,
      recommendation: "Glacial disaster simulation ready. Validated against Feb 2021 Chamoli satellite & sensor archives."
    },
    settlements: [
      { id: "c1", name: "Raini Village (Upper Valley)", distanceKm: 2.1, lat: 30.4850, lng: 79.7150, pop: 1200, elevationM: 1950, arrivalTimeHr: 0.12, maxDepthM: 12.5, velocityMs: 14.8, priority: "CRITICAL", status: "Debris Avalanche Impact", shelters: 1, hospitals: 0 },
      { id: "c2", name: "Tapovan Barrage Project Site", distanceKm: 8.5, lat: 30.4680, lng: 79.7650, pop: 850, elevationM: 1780, arrivalTimeHr: 0.35, maxDepthM: 9.8, velocityMs: 11.2, priority: "CRITICAL", status: "Tunnel Inundation Hazard", shelters: 1, hospitals: 1 },
      { id: "c3", name: "Ringi & Subhai Hamlets", distanceKm: 14.2, lat: 30.4550, lng: 79.8050, pop: 2400, elevationM: 1650, arrivalTimeHr: 0.7, maxDepthM: 7.2, velocityMs: 8.5, priority: "CRITICAL", status: "Bridge Washed Out", shelters: 2, hospitals: 0 },
      { id: "c4", name: "Joshimath Outskirts Valley", distanceKm: 22.0, lat: 30.5500, lng: 79.5650, pop: 16800, elevationM: 1520, arrivalTimeHr: 1.4, maxDepthM: 5.4, velocityMs: 6.2, priority: "HIGH", status: "Gorge Backwater Surcharge", shelters: 5, hospitals: 2 },
      { id: "c5", name: "Vishnuprayag Confluence", distanceKm: 31.0, lat: 30.5650, lng: 79.5750, pop: 4500, elevationM: 1410, arrivalTimeHr: 2.1, maxDepthM: 4.8, velocityMs: 5.1, priority: "HIGH", status: "Alaknanda Influx", shelters: 3, hospitals: 1 }
    ],
    criticalAssets: [
      { id: "ch1", name: "Joshimath Community Health Center", type: "Hospital", lat: 30.5550, lng: 79.5620, risk: "Moderate", arrivalTimeHr: 1.5, floodDepthM: 0.0 },
      { id: "cb1", name: "Raini Valley Suspension Bridge", type: "Bridge", lat: 30.4855, lng: 79.7180, risk: "Destroyed by Debris Surge", arrivalTimeHr: 0.13, floodDepthM: 11.8 },
      { id: "cb2", name: "BRO Tapovan Highway Bridge", type: "Bridge", lat: 30.4670, lng: 79.7680, risk: "Submerged & Breached", arrivalTimeHr: 0.36, floodDepthM: 8.5 },
      { id: "cs1", name: "Joshimath Army Camp Relief Base", type: "Shelter", lat: 30.5600, lng: 79.5580, risk: "Safe (High Mountain Ridge)", capacity: 5000, available: 4200 },
      { id: "cp1", name: "Tapovan-Vishnugad Hydropower Tunnel Intake", type: "Power Plant", lat: 30.4690, lng: 79.7620, risk: "Catastrophic Slurry Inundation", arrivalTimeHr: 0.34, floodDepthM: 10.2 }
    ]
  },

  hirakud: {
    id: "hirakud",
    name: "Hirakud Dam & Reservoir",
    river: "Mahanadi River",
    basin: "Mahanadi Basin",
    state: "Odisha",
    district: "Sambalpur",
    coordinates: [21.5700, 83.8700],
    mapBounds: [[21.2000, 83.6000], [21.7500, 84.1500]],
    downstreamCenter: [21.4669, 83.9800],
    downstreamReachKm: 140,
    downstreamDistricts: ["Sambalpur", "Bargarh", "Subarnapur (Sonepur)", "Boudh", "Cuttack"],
    specs: {
      type: "Composite (Masonry, Concrete & Earthen)",
      totalLengthKm: 25.8,
      mainDamLengthM: 4800,
      maxHeightM: 60.96,
      grossStorageMCM: 5896,
      liveStorageMCM: 4823,
      deadStorageMCM: 1073,
      fullReservoirLevelM: 192.02, // 630 ft
      maximumWaterLevelM: 192.63,  // 632 ft
      deadStorageLevelM: 179.83,   // 590 ft
      spillwayCapacityCumecs: 42450, // ~1.5 million cusecs
      totalSluiceGates: 64,
      totalCrestGates: 34,
      catchmentAreaSqKm: 83400
    },
    currentStatus: {
      timestamp: "2026-10-03 11:30 IST",
      waterLevelM: 191.56,
      waterLevelFt: 628.48,
      percentStorage: 94.2,
      currentStorageMCM: 5554,
      inflowCumecs: 12150, // ~4,29,000 cusecs
      outflowCumecs: 10760, // ~3,80,000 cusecs
      openSluiceGates: 24,
      openCrestGates: 6,
      gateOpeningM: 3.2,
      floodAlertLevel: "RED ALERT - HIGH INFLOW SPILLWAY DISCHARGE",
      ruleCurveStatus: "Exceeding Flood Control Zone Level (+0.45m)",
      trend: "Rising (+0.08 m/hr)"
    },
    reservoirRuleCurve: [
      { month: "Jun", ruleLevel: 181.0, actualLevel: 180.8 },
      { month: "Jul", ruleLevel: 186.0, actualLevel: 185.5 },
      { month: "Aug", ruleLevel: 189.5, actualLevel: 190.2 },
      { month: "Sep", ruleLevel: 191.0, actualLevel: 191.4 },
      { month: "Oct", ruleLevel: 192.02, actualLevel: 191.56 },
      { month: "Nov", ruleLevel: 192.02, actualLevel: 191.5 },
      { month: "Dec", ruleLevel: 191.5, actualLevel: 191.2 }
    ],
    historicalTelemetry: [
      { time: "00:00", inflow: 8500, outflow: 6200, level: 191.10 },
      { time: "03:00", inflow: 9800, outflow: 7500, level: 191.22 },
      { time: "06:00", inflow: 11200, outflow: 9000, level: 191.35 },
      { time: "09:00", inflow: 12400, outflow: 10500, level: 191.48 },
      { time: "12:00", inflow: 12150, outflow: 10760, level: 191.56 }
    ],
    // Datasets availability audit
    datasets: [
      { id: "dem", name: "High-Resolution DEM (CartoDEM 10m + SRTM)", category: "Topography", status: "Verified", format: "GeoTIFF", crs: "EPSG:32644 (UTM 44N)", resolution: "10 m", size: "450 MB", readiness: 100, issue: null },
      { id: "river_geom", name: "Mahanadi River Centerline & Banks", category: "Hydraulics", status: "Verified", format: "ESRI Shapefile", crs: "EPSG:32644 (UTM 44N)", resolution: "Vector", size: "18 MB", readiness: 100, issue: null },
      { id: "cross_sections", name: "1D/2D Interpolated Bathymetric Cross Sections", category: "Bathymetry", status: "Warning", format: "CSV / HEC-RAS format", crs: "EPSG:32644", resolution: "250m interval", size: "34 MB", readiness: 85, issue: "Downstream Delta reach (Naraj to Cuttack) requires synthetic bathymetry interpolation." },
      { id: "dam_geom", name: "Dam Axis, Crest Elevation & Spillway CAD", category: "Structure", status: "Verified", format: "GeoPackage", crs: "EPSG:32644", resolution: "CAD Vector", size: "12 MB", readiness: 100, issue: null },
      { id: "elevation_storage", name: "Elevation-Area-Storage (EAS) Hypsometric Curve", category: "Hydrology", status: "Verified", format: "JSON Tabular", crs: "N/A", resolution: "0.25m step", size: "2 MB", readiness: 100, issue: null },
      { id: "rainfall_imd", name: "IMD Doppler Radar & Automatic Weather Stations", category: "Meteorology", status: "Verified", format: "NetCDF4", crs: "EPSG:4326", resolution: "0.1° (~10km)", size: "85 MB", readiness: 100, issue: null },
      { id: "lulc", name: "NRSC Bhuvan Land Use / Land Cover (2025)", category: "Roughness (Manning's n)", status: "Verified", format: "GeoTIFF", crs: "EPSG:32644", resolution: "10 m", size: "120 MB", readiness: 95, issue: null },
      { id: "pop_infra", name: "Census 2026 + OSM Building Footprints & Critical Infra", category: "Vulnerability", status: "Verified", format: "GeoJSON", crs: "EPSG:4326", resolution: "Object Level", size: "68 MB", readiness: 98, issue: null },
      { id: "sentinel_gee", name: "GEE Sentinel-1 SAR Ground Truth Inundation Catalog", category: "Satellite Validation", status: "Verified", format: "GEE Asset", crs: "EPSG:4326", resolution: "10 m", size: "Cloud Asset", readiness: 100, issue: null }
    ],
    qualityAudit: {
      score: 94,
      criticalErrors: 0,
      warnings: 1,
      crsUnified: true,
      demContinuity: true,
      riverConnectivity: true,
      damGeoreferenced: true,
      recommendation: "Ready for High-Fidelity 2D Delft3D FM & SPH particle simulation."
    },
    // Downstream settlements with exposure data
    settlements: [
      { id: "v1", name: "Burla Downstream Reach", distanceKm: 2.5, lat: 21.5030, lng: 83.8710, pop: 48500, elevationM: 165, arrivalTimeHr: 0.35, maxDepthM: 4.8, velocityMs: 3.6, priority: "CRITICAL", status: "Cut-Off Risk", shelters: 4, hospitals: 2 },
      { id: "v2", name: "Sambalpur Old Town & Riverside", distanceKm: 14.0, lat: 21.4669, lng: 83.9780, pop: 182000, elevationM: 152, arrivalTimeHr: 1.2, maxDepthM: 3.9, velocityMs: 2.8, priority: "CRITICAL", status: "Severe Inundation", shelters: 12, hospitals: 6 },
      { id: "v3", name: "Dhama Agricultural Belt", distanceKm: 32.0, lat: 21.3200, lng: 83.9600, pop: 24500, elevationM: 140, arrivalTimeHr: 2.8, maxDepthM: 3.2, velocityMs: 2.1, priority: "HIGH", status: "Roads Severed", shelters: 3, hospitals: 1 },
      { id: "v4", name: "Ulunda Riparian Sector", distanceKm: 55.0, lat: 21.1200, lng: 83.8900, pop: 16200, elevationM: 131, arrivalTimeHr: 5.1, maxDepthM: 2.6, velocityMs: 1.8, priority: "HIGH", status: "Partially Submerged", shelters: 2, hospitals: 1 },
      { id: "v5", name: "Subarnapur (Sonepur) Confluence", distanceKm: 78.0, lat: 20.8400, lng: 83.9200, pop: 65000, elevationM: 118, arrivalTimeHr: 7.4, maxDepthM: 2.4, velocityMs: 1.5, priority: "HIGH", status: "Confluence Backwater", shelters: 8, hospitals: 3 },
      { id: "v6", name: "Boudh Downstream Floodplain", distanceKm: 110.0, lat: 20.8350, lng: 84.3200, pop: 42000, elevationM: 104, arrivalTimeHr: 11.2, maxDepthM: 1.9, velocityMs: 1.2, priority: "MEDIUM", status: "Lowland Waterlogging", shelters: 5, hospitals: 2 },
      { id: "v7", name: "Athagarh / Naraj Gorge Influx", distanceKm: 210.0, lat: 20.5100, lng: 85.7600, pop: 89000, elevationM: 42, arrivalTimeHr: 18.5, maxDepthM: 1.6, velocityMs: 0.9, priority: "MEDIUM", status: "Embankment Stress", shelters: 9, hospitals: 4 },
      { id: "v8", name: "Cuttack City Delta Head", distanceKm: 235.0, lat: 20.4625, lng: 85.8830, pop: 610000, elevationM: 36, arrivalTimeHr: 22.0, maxDepthM: 1.2, velocityMs: 0.7, priority: "HIGH", status: "Drainage Backflow", shelters: 28, hospitals: 14 }
    ],
    criticalAssets: [
      { id: "h1", name: "VSS Institute of Medical Sciences (VIMSAR)", type: "Hospital", lat: 21.4980, lng: 83.8820, risk: "High", arrivalTimeHr: 0.5, floodDepthM: 1.8 },
      { id: "h2", name: "Sambalpur District Headquarters Hospital", type: "Hospital", lat: 21.4640, lng: 83.9850, risk: "High", arrivalTimeHr: 1.4, floodDepthM: 1.4 },
      { id: "b1", name: "Mahanadi Bridge (NH-53)", type: "Bridge", lat: 21.4690, lng: 83.9650, risk: "Critical (Submerged Pier Clearance)", arrivalTimeHr: 1.1, floodDepthM: 3.4 },
      { id: "b2", name: "Sambalpur Railway Bridge", type: "Bridge", lat: 21.4750, lng: 83.9720, risk: "Critical (Scour Hazard)", arrivalTimeHr: 1.2, floodDepthM: 3.6 },
      { id: "s1", name: "Govt Boys High School Flood Shelter", type: "Shelter", lat: 21.4580, lng: 84.0050, risk: "Safe (High Ground)", capacity: 2500, available: 1800 },
      { id: "s2", name: "Gangadhar Meher University Shelter", type: "Shelter", lat: 21.4720, lng: 84.0020, risk: "Safe (High Ground)", capacity: 4000, available: 3200 },
      { id: "p1", name: "Burla Hydro Electric Power Substation 220kV", type: "Power Substation", lat: 21.5050, lng: 83.8680, risk: "Critical", arrivalTimeHr: 0.4, floodDepthM: 2.2 }
    ]
  },

  ukai: {
    id: "ukai",
    name: "Ukai Dam (Vallabh Sagar)",
    river: "Tapi River",
    basin: "Tapi Basin",
    state: "Gujarat",
    district: "Tapi / Surat",
    coordinates: [21.2500, 73.5850],
    mapBounds: [[21.0000, 72.7000], [21.4500, 73.7000]],
    downstreamCenter: [21.1702, 72.8311],
    downstreamReachKm: 110,
    downstreamDistricts: ["Tapi", "Surat", "Navsari"],
    specs: {
      type: "Earth-cum-Masonry Dam",
      totalLengthKm: 4.92,
      mainDamLengthM: 4927,
      maxHeightM: 80.77,
      grossStorageMCM: 7414,
      liveStorageMCM: 6730,
      deadStorageMCM: 684,
      fullReservoirLevelM: 105.16, // 345 ft
      maximumWaterLevelM: 106.98,  // 351 ft
      deadStorageLevelM: 82.30,    // 270 ft
      spillwayCapacityCumecs: 46269, // ~1.63 million cusecs
      totalSluiceGates: 0,
      totalCrestGates: 22, // Radial crest gates (15.54m x 14.78m)
      catchmentAreaSqKm: 62225
    },
    currentStatus: {
      timestamp: "2026-10-03 11:30 IST",
      waterLevelM: 104.28,
      waterLevelFt: 342.12,
      percentStorage: 91.8,
      currentStorageMCM: 6806,
      inflowCumecs: 8780, // ~3,10,000 cusecs
      outflowCumecs: 7785, // ~2,75,000 cusecs
      openSluiceGates: 0,
      openCrestGates: 14,
      gateOpeningM: 4.5,
      floodAlertLevel: "ORANGE WARNING - CONTROLLED HIGH DISCHARGE",
      ruleCurveStatus: "Approaching Rule Curve Ceiling (-0.88m)",
      trend: "Stable (+0.02 m/hr)"
    },
    reservoirRuleCurve: [
      { month: "Jun", ruleLevel: 98.0, actualLevel: 97.5 },
      { month: "Jul", ruleLevel: 101.5, actualLevel: 100.8 },
      { month: "Aug", ruleLevel: 103.5, actualLevel: 103.2 },
      { month: "Sep", ruleLevel: 104.8, actualLevel: 104.28 },
      { month: "Oct", ruleLevel: 105.16, actualLevel: 104.9 },
      { month: "Nov", ruleLevel: 105.16, actualLevel: 104.5 },
      { month: "Dec", ruleLevel: 104.5, actualLevel: 104.0 }
    ],
    historicalTelemetry: [
      { time: "00:00", inflow: 6500, outflow: 5200, level: 103.95 },
      { time: "03:00", inflow: 7400, outflow: 6100, level: 104.08 },
      { time: "06:00", inflow: 8200, outflow: 7100, level: 104.18 },
      { time: "09:00", inflow: 8900, outflow: 7800, level: 104.25 },
      { time: "12:00", inflow: 8780, outflow: 7785, level: 104.28 }
    ],
    datasets: [
      { id: "dem", name: "CartoDEM 10m + ALOS PALSAR Downstream DEM", category: "Topography", status: "Verified", format: "GeoTIFF", crs: "EPSG:32643 (UTM 43N)", resolution: "10 m", size: "380 MB", readiness: 100, issue: null },
      { id: "river_geom", name: "Tapi River Geometry (Ukai to Arabian Sea)", category: "Hydraulics", status: "Verified", format: "ESRI Shapefile", crs: "EPSG:32643 (UTM 43N)", resolution: "Vector", size: "14 MB", readiness: 100, issue: null },
      { id: "cross_sections", name: "Acoustic Doppler Current Profiler (ADCP) Bathymetry", category: "Bathymetry", status: "Verified", format: "CSV", crs: "EPSG:32643", resolution: "150m interval", size: "42 MB", readiness: 100, issue: null },
      { id: "dam_geom", name: "Ukai Radial Spillway & Embankment Profile", category: "Structure", status: "Verified", format: "GeoPackage", crs: "EPSG:32643", resolution: "CAD Vector", size: "16 MB", readiness: 100, issue: null },
      { id: "elevation_storage", name: "Ukai Elevation-Storage Rating Table", category: "Hydrology", status: "Verified", format: "JSON Tabular", crs: "N/A", resolution: "0.20m step", size: "3 MB", readiness: 100, issue: null },
      { id: "rainfall_imd", name: "Tapi Upper Basin Gauge Data (Madhya Pradesh & Maharashtra)", category: "Meteorology", status: "Verified", format: "NetCDF4", crs: "EPSG:4326", resolution: "0.1°", size: "95 MB", readiness: 100, issue: null },
      { id: "lulc", name: "Surat Urban Development Area (SUDA) + LULC", category: "Roughness (Manning's n)", status: "Verified", format: "GeoTIFF", crs: "EPSG:32643", resolution: "5 m", size: "210 MB", readiness: 100, issue: null },
      { id: "pop_infra", name: "Surat City 3D Building GIS & Critical Infrastructure", category: "Vulnerability", status: "Verified", format: "GeoJSON", crs: "EPSG:4326", resolution: "Bldg Footprint", size: "140 MB", readiness: 100, issue: null },
      { id: "sentinel_gee", name: "Sentinel-1 SAR Surat Coastal & Floodplain Collection", category: "Satellite Validation", status: "Verified", format: "GEE Asset", crs: "EPSG:4326", resolution: "10 m", size: "Cloud Asset", readiness: 100, issue: null }
    ],
    qualityAudit: {
      score: 100,
      criticalErrors: 0,
      warnings: 0,
      crsUnified: true,
      demContinuity: true,
      riverConnectivity: true,
      damGeoreferenced: true,
      recommendation: "All datasets validated. 100% ready for high-resolution Delft3D-FM and SPH hydrodynamic modeling."
    },
    settlements: [
      { id: "u1", name: "Songadh Downstream Outskirts", distanceKm: 4.0, lat: 21.1680, lng: 73.5500, pop: 28000, elevationM: 78, arrivalTimeHr: 0.4, maxDepthM: 4.2, velocityMs: 3.4, priority: "CRITICAL", status: "Immediate Wave Impact", shelters: 4, hospitals: 1 },
      { id: "u2", name: "Vyara Floodplain Basin", distanceKm: 18.0, lat: 21.1150, lng: 73.4000, pop: 45000, elevationM: 64, arrivalTimeHr: 1.6, maxDepthM: 3.1, velocityMs: 2.3, priority: "HIGH", status: "Lowland Submergence", shelters: 6, hospitals: 2 },
      { id: "u3", name: "Mandvi Riparian Zone", distanceKm: 42.0, lat: 21.2580, lng: 73.3000, pop: 22000, elevationM: 48, arrivalTimeHr: 3.8, maxDepthM: 2.8, velocityMs: 1.9, priority: "HIGH", status: "Roads Cut-Off", shelters: 3, hospitals: 1 },
      { id: "u4", name: "Kamrej Urban Corridor", distanceKm: 76.0, lat: 21.2700, lng: 72.9600, pop: 110000, elevationM: 26, arrivalTimeHr: 7.2, maxDepthM: 2.5, velocityMs: 1.6, priority: "CRITICAL", status: "NH-48 Inundation Risk", shelters: 14, hospitals: 5 },
      { id: "u5", name: "Surat Central (Rander / Adajan)", distanceKm: 96.0, lat: 21.1950, lng: 72.7950, pop: 2850000, elevationM: 14, arrivalTimeHr: 9.8, maxDepthM: 2.9, velocityMs: 1.4, priority: "CRITICAL", status: "High Density Urban Flooding", shelters: 85, hospitals: 42 },
      { id: "u6", name: "Surat Varachha / Katargam", distanceKm: 98.0, lat: 21.2200, lng: 72.8450, pop: 1420000, elevationM: 16, arrivalTimeHr: 10.2, maxDepthM: 2.4, velocityMs: 1.2, priority: "CRITICAL", status: "Severe Waterlogging", shelters: 45, hospitals: 26 },
      { id: "u7", name: "Dumas Coastal Estuary", distanceKm: 118.0, lat: 21.0700, lng: 72.7100, pop: 38000, elevationM: 6, arrivalTimeHr: 12.5, maxDepthM: 1.8, velocityMs: 1.1, priority: "MEDIUM", status: "Tidal Surge Interaction", shelters: 6, hospitals: 2 },
      { id: "u8", name: "Hazira Industrial Mega Complex", distanceKm: 122.0, lat: 21.1100, lng: 72.6300, pop: 68000, elevationM: 8, arrivalTimeHr: 13.0, maxDepthM: 1.5, velocityMs: 0.9, priority: "HIGH", status: "Petrochemical Perimeter Risk", shelters: 10, hospitals: 4 }
    ],
    criticalAssets: [
      { id: "uh1", name: "Surat Civil Hospital (New Civil)", type: "Hospital", lat: 21.1780, lng: 72.8210, risk: "High", arrivalTimeHr: 10.1, floodDepthM: 1.6 },
      { id: "uh2", name: "SMIMER Medical College & Hospital", type: "Hospital", lat: 21.1980, lng: 72.8520, risk: "Moderate", arrivalTimeHr: 10.8, floodDepthM: 0.9 },
      { id: "ub1", name: "Sardar Bridge (Tapi River)", type: "Bridge", lat: 21.1850, lng: 72.8050, risk: "Critical (Water Level near Girder)", arrivalTimeHr: 9.5, floodDepthM: 3.8 },
      { id: "ub2", name: "Cable Stayed Bridge (Adajan-Pal)", type: "Bridge", lat: 21.1680, lng: 72.7850, risk: "High (Approach Road Inundated)", arrivalTimeHr: 9.9, floodDepthM: 2.1 },
      { id: "us1", name: "Surat Indoor Stadium Emergency Shelter", type: "Shelter", lat: 21.1750, lng: 72.7950, risk: "Safe (Reinforced High Ground)", capacity: 8000, available: 6500 },
      { id: "us2", name: "Veer Narmad South Gujarat University", type: "Shelter", lat: 21.1520, lng: 72.7820, risk: "Safe", capacity: 12000, available: 9800 },
      { id: "up1", name: "Rander Water Treatment Plant", type: "Water Treatment", lat: 21.2150, lng: 72.7900, risk: "Critical Submergence Hazard", arrivalTimeHr: 9.6, floodDepthM: 2.3 }
    ]
  }
};

// Preset Scenarios
export const PRESET_SCENARIOS = [
  {
    id: "controlled_release",
    name: "Controlled Water Release",
    type: "Regulated Release",
    icon: "SlidersHorizontal",
    severity: "MODERATE",
    badgeColor: "#10b981",
    description: "Standard monsoon gate discharge following official CWC Rule Curve guidelines to balance reservoir level and downstream carrying capacity.",
    defaultParams: {
      dischargeRateCumecs: 8500, // ~3,00,000 cusecs
      openGatesCount: 16,
      rainfallScenario: "Normal Monsoon (25 mm/day)",
      rainfallMm: 25,
      simulationDurationHr: 24,
      initialReservoirLevelM: 191.0,
      breachType: "None (Intact Dam)",
      manningRoughness: 0.035
    }
  },
  {
    id: "emergency_release",
    name: "Emergency High Release",
    type: "Emergency Spillway",
    icon: "AlertTriangle",
    severity: "HIGH",
    badgeColor: "#f59e0b",
    description: "Extreme flood routing where massive upstream influx forces maximum permissible spillway discharge to protect dam structural integrity.",
    defaultParams: {
      dischargeRateCumecs: 24500, // ~8,65,000 cusecs
      openGatesCount: 42,
      rainfallScenario: "Severe Catchment Downpour (120 mm/day)",
      rainfallMm: 120,
      simulationDurationHr: 36,
      initialReservoirLevelM: 192.10,
      breachType: "None (Spillway Surcharge)",
      manningRoughness: 0.038
    }
  },
  {
    id: "partial_breach",
    name: "Partial Dam Breach",
    type: "Structural Failure",
    icon: "Flame",
    severity: "SEVERE",
    badgeColor: "#ef4444",
    description: "Progressive piping failure or overtopping erosion through auxiliary dyke or earthen embankment section forming a localized gap.",
    defaultParams: {
      breachWidthM: 120,
      breachBottomElevationM: 172.0,
      breachFormationTimeHr: 2.5,
      breachSideSlope: 1.2, // H:V
      failureMode: "Piping Erosion (Froehlich / Xu-Zhang formulation)",
      rainfallScenario: "Heavy Catchment Deluge (180 mm/day)",
      rainfallMm: 180,
      simulationDurationHr: 48,
      initialReservoirLevelM: 192.4,
      manningRoughness: 0.040
    }
  },
  {
    id: "complete_failure",
    name: "Complete Dam Failure (Catastrophic)",
    type: "Catastrophic Breach",
    icon: "Skull",
    severity: "CATASTROPHIC",
    badgeColor: "#b91c1c",
    description: "Worst-case full-depth breach of the main embankment structure triggering an instantaneous high-velocity hydrograph shockwave downstream.",
    defaultParams: {
      breachWidthM: 380,
      breachBottomElevationM: 160.0,
      breachFormationTimeHr: 1.2,
      breachSideSlope: 1.0,
      failureMode: "Catastrophic Overtopping & Foundation Shear",
      rainfallScenario: "Probable Maximum Precipitation (PMP - 350 mm/day)",
      rainfallMm: 350,
      simulationDurationHr: 48,
      initialReservoirLevelM: 192.63,
      manningRoughness: 0.045
    }
  },
  {
    id: "glof_natural_blockage",
    name: "Natural River Blockage / GLOF Outburst",
    type: "Natural Hazard Outburst",
    icon: "MountainSnow",
    severity: "CRITICAL",
    badgeColor: "#8b5cf6",
    description: "Upstream landslide dam outburst flood (LDOF) or moraine dam collapse generating rapid sediment-laden surge hitting reservoir pool.",
    defaultParams: {
      inflowSurgePeakCumecs: 32000,
      surgeRiseTimeHr: 0.8,
      surgeVolumeMCM: 450,
      rainfallScenario: "Cloudburst Event (150 mm/2hr)",
      rainfallMm: 150,
      simulationDurationHr: 36,
      initialReservoirLevelM: 191.8,
      breachType: "Induced Overtopping Surcharge",
      manningRoughness: 0.048
    }
  }
];

// Dual-Model Hydrodynamic Output & Satellite Validation Metrics
export const MODEL_METRICS_DATA = {
  hirakud: {
    partial_breach: {
      delft3d: {
        engine: "Delft3D Flexible Mesh (D-Flow FM 2D)",
        solverType: "Finite Volume, Unstructured Orthogonal Mesh",
        equations: "2D Shallow Water Equations (Saint-Venant)",
        cellsCount: 248920,
        maxDepthM: 6.84,
        avgVelocityMs: 2.45,
        peakDischargeCumecs: 28400,
        totalInundatedSqKm: 342.6,
        arrivalFirstSettlementHr: 0.35,
        computationalTimeMin: 18.4,
        massBalanceErrorPercent: 0.03
      },
      sph: {
        engine: "Smoothed Particle Hydrodynamics (DualSPHysics 3D/2D)",
        solverType: "Lagrangian Particle Mechanics, Riemann Solver",
        equations: "Navier-Stokes Lagrangian Free-Surface Flow",
        particleCount: 14500000,
        maxDepthM: 7.12, // SPH captures localized splash/wavefront stacking
        avgVelocityMs: 2.78,
        peakDischargeCumecs: 29850,
        totalInundatedSqKm: 356.1,
        arrivalFirstSettlementHr: 0.28, // SPH wavefront propagates slightly faster in near-field
        computationalTimeMin: 42.1,
        massBalanceErrorPercent: 0.01
      },
      comparison: {
        spatialAgreementIoU: 89.4, // Intersection over Union
        cohensKappa: 0.87,
        criticalSuccessIndexCSI: 0.84,
        depthMeanAbsErrorM: 0.28,
        velocityMeanAbsErrorMs: 0.33,
        nearFieldDisagreementNotes: "SPH captures higher initial velocity and violent wave-breaking in the first 5 km; Delft3D FM exhibits smoother diffusive propagation across agricultural lowlands."
      },
      satelliteValidation: {
        satellite: "Copernicus Sentinel-1 C-Band SAR",
        geePlatform: "Google Earth Engine (GEE Cloud API)",
        passDate: "2026-09-28 17:42 UTC (Descending Orbit 121)",
        polarization: "VV + VH dual-polarization",
        geeFloodExtentSqKm: 328.4,
        modelVsGeeAgreementPercent: 91.8,
        falsePositiveSqKm: 18.2, // Vegetated areas or model over-prediction
        falseNegativeSqKm: 14.0, // Dense urban canopy where radar signal was obstructed
        confidenceScore: "HIGH CONFIDENCE (Validation Score: 92/100)"
      }
    }
  },
  ukai: {
    partial_breach: {
      delft3d: {
        engine: "Delft3D Flexible Mesh (D-Flow FM 2D)",
        solverType: "Finite Volume, Unstructured Curvilinear Mesh",
        equations: "2D Shallow Water Equations",
        cellsCount: 312400,
        maxDepthM: 5.92,
        avgVelocityMs: 2.18,
        peakDischargeCumecs: 34100,
        totalInundatedSqKm: 288.4,
        arrivalFirstSettlementHr: 0.40,
        computationalTimeMin: 22.8,
        massBalanceErrorPercent: 0.02
      },
      sph: {
        engine: "Smoothed Particle Hydrodynamics (DualSPHysics)",
        solverType: "Lagrangian Particle Physics",
        equations: "Compressible / Weakly-Compressible SPH Navier-Stokes",
        particleCount: 18200000,
        maxDepthM: 6.25,
        avgVelocityMs: 2.52,
        peakDischargeCumecs: 35800,
        totalInundatedSqKm: 299.7,
        arrivalFirstSettlementHr: 0.34,
        computationalTimeMin: 54.0,
        massBalanceErrorPercent: 0.01
      },
      comparison: {
        spatialAgreementIoU: 91.2,
        cohensKappa: 0.89,
        criticalSuccessIndexCSI: 0.87,
        depthMeanAbsErrorM: 0.24,
        velocityMeanAbsErrorMs: 0.29,
        nearFieldDisagreementNotes: "High agreement along Tapi main channel; slight variation in Surat urban drainage backflow cells."
      },
      satelliteValidation: {
        satellite: "Sentinel-1A SAR Ground Range Detected (GRD)",
        geePlatform: "Google Earth Engine Asset GEE/COPERNICUS/S1_GRD",
        passDate: "2026-09-30 06:15 UTC (Ascending)",
        polarization: "VV + VH",
        geeFloodExtentSqKm: 279.1,
        modelVsGeeAgreementPercent: 93.4,
        falsePositiveSqKm: 12.8,
        falseNegativeSqKm: 9.3,
        confidenceScore: "VERY HIGH CONFIDENCE (Validation Score: 94/100)"
      }
    }
  }
};

// Screening-Level Loss & Damage Assessment Aggregates
export const LOSS_ESTIMATION_DATA = {
  hirakud: {
    populationExposedTotal: 298400,
    populationAtImmediateRisk: 73000, // Depth > 2.0m & arrival < 3 hrs
    vulnerableDemographics: {
      infantsAndChildren: 41200,
      elderlyOver65: 35800,
      differentlyAbled: 6400
    },
    buildingsInundated: {
      residential: 18450,
      commercial: 3120,
      industrial: 480,
      publicAndGovt: 145,
      severeStructuralDamageCount: 4200 // Depth > 2.5m or Velocity > 2.5 m/s
    },
    roadsAndTransport: {
      nationalHighwaysKm: 42.5,
      stateHighwaysKm: 78.0,
      districtAndRuralRoadsKm: 215.4,
      railwayLineSubmergedKm: 18.2,
      bridgesSubmergedOrStressed: 6
    },
    agricultureAndLivelihood: {
      paddyAndCroplandHectares: 24800,
      estimatedCropLossCroresINR: 385.5,
      livestockAtRisk: 52000
    },
    criticalFacilitiesExposed: [
      { name: "VIMSAR Medical College & Hospital", status: "Perimeter Inundation (1.8m)", action: "Evacuate Ground Floor & ICU backup generator relocation" },
      { name: "Burla Hydro Electric Substation", status: "Critical Hazard (2.2m)", action: "Emergency Grid Trip & Islanding" },
      { name: "NH-53 Mahanadi Bridge Sambalpur", status: "Piers Stressed (3.4m depth)", action: "Close Traffic to Heavy Vehicles" },
      { name: "Sambalpur Municipal Water Intake Station", status: "Flooded Pump House", action: "Deploy mobile chlorination & standby diesel pumps" }
    ]
  },
  ukai: {
    populationExposedTotal: 4420000,
    populationAtImmediateRisk: 620000,
    vulnerableDemographics: {
      infantsAndChildren: 580000,
      elderlyOver65: 490000,
      differentlyAbled: 92000
    },
    buildingsInundated: {
      residential: 124000,
      commercial: 38500,
      industrial: 4200,
      publicAndGovt: 980,
      severeStructuralDamageCount: 16500
    },
    roadsAndTransport: {
      nationalHighwaysKm: 64.0, // NH-48 corridor
      stateHighwaysKm: 112.5,
      districtAndRuralRoadsKm: 410.0,
      railwayLineSubmergedKm: 32.0,
      bridgesSubmergedOrStressed: 9
    },
    agricultureAndLivelihood: {
      paddyAndCroplandHectares: 18200,
      estimatedCropLossCroresINR: 290.0,
      livestockAtRisk: 28000
    },
    criticalFacilitiesExposed: [
      { name: "Surat Civil Hospital (New Civil)", status: "Basement & Ground Inundation", action: "Activate Level 3 Evacuation Plan" },
      { name: "Sardar Bridge & Cable Stayed Bridge", status: "Approach Road Submerged", action: "Traffic Halt & Structural Inspection" },
      { name: "Rander Water Treatment Plant", status: "Turbidity Surge & Waterlogging", action: "Switch to Alternative Reservoir Line" },
      { name: "Hazira Petrochemical Access Arteries", status: "Hazardous Materials Containment", action: "Seal Safety Dykes & Secure Gas Terminals" }
    ]
  }
};

// HADR Action-Priority Triage & Evacuation Manifest
export const HADR_ACTIONS_DATA = {
  hirakud: {
    priorityVillagesTriage: [
      { rank: 1, name: "Burla Downstream Reach", priorityScore: 98, timeToImpact: "21 mins", depth: "4.8m", isolated: true, pop: 48500, requiredBoats: 32, ndrfTeams: 4, action: "IMMEDIATE EVACUATION VIA BURLA RIDGE ROAD" },
      { rank: 2, name: "Sambalpur Old Town (Riverside)", priorityScore: 95, timeToImpact: "1.2 hrs", depth: "3.9m", isolated: false, pop: 182000, requiredBoats: 65, ndrfTeams: 8, action: "MOVE CITIZENS TO GM UNIVERSITY & HIGH SCHOOL SHELTERS" },
      { rank: 3, name: "Dhama Agricultural Belt", priorityScore: 88, timeToImpact: "2.8 hrs", depth: "3.2m", isolated: true, pop: 24500, requiredBoats: 20, ndrfTeams: 3, action: "AIR-DROP RELIEF PACKETS & BOAT EVACUATION" },
      { rank: 4, name: "Ulunda Riparian Sector", priorityScore: 82, timeToImpact: "5.1 hrs", depth: "2.6m", isolated: false, pop: 16200, requiredBoats: 14, ndrfTeams: 2, action: "STAGED TRANSPORT TO TEHSIL HIGH GROUND" },
      { rank: 5, name: "Subarnapur (Sonepur) Delta", priorityScore: 78, timeToImpact: "7.4 hrs", depth: "2.4m", isolated: true, pop: 65000, requiredBoats: 35, ndrfTeams: 5, action: "PREPOSITION FLOOD RELIEF CAMPS & WATER PURIFICATION" }
    ],
    evacuationRoutes: [
      { id: "r1", from: "Burla Old Colony", to: "Burla Medical Hills Shelter", status: "CLEAR / ELEVATED", routeLengthKm: 3.2, safetyRating: "100% Flood-Free" },
      { id: "r2", from: "Sambalpur Ring Road", to: "GM University Shelter", status: "MODERATE CONGESTION", routeLengthKm: 4.8, safetyRating: "Flood-Free (High Elevation)" },
      { id: "r3", from: "Dhama Lowlands", to: "Maneswar High School", status: "WARNING: Submergence in 2 hours", routeLengthKm: 8.5, safetyRating: "Use Before T+2h Only" }
    ],
    resourceMobilization: {
      ndrfBattalionsDeployed: 12,
      sdrfCompanies: 18,
      inflatableMotorBoatsIRBs: 140,
      lifeJacketsDistributed: 15000,
      emergencyDryRationKits: 85000,
      mobileWaterPurificationUnits: 24,
      temporaryShelterBedCapacity: 45000
    }
  },
  ukai: {
    priorityVillagesTriage: [
      { rank: 1, name: "Songadh Downstream Outskirts", priorityScore: 99, timeToImpact: "24 mins", depth: "4.2m", isolated: true, pop: 28000, requiredBoats: 25, ndrfTeams: 4, action: "IMMEDIATE HELICOPTER & BOAT AIRLIFT" },
      { rank: 2, name: "Surat Central (Rander / Adajan)", priorityScore: 97, timeToImpact: "9.8 hrs", depth: "2.9m", isolated: false, pop: 2850000, requiredBoats: 180, ndrfTeams: 22, action: "MASS EVACUATION TO INDOOR STADIUM & VNSGU CAMPUS" },
      { rank: 3, name: "Kamrej Urban Corridor", priorityScore: 92, timeToImpact: "7.2 hrs", depth: "2.5m", isolated: true, pop: 110000, requiredBoats: 45, ndrfTeams: 6, action: "DIVERT NH-48 TRAFFIC & BUS CONVOY EVACUATION" },
      { rank: 4, name: "Vyara Floodplain Basin", priorityScore: 86, timeToImpact: "1.6 hrs", depth: "3.1m", isolated: false, pop: 45000, requiredBoats: 30, ndrfTeams: 4, action: "MOVE CITIZENS TO DISTRICT SPORTS COMPLEX" }
    ],
    evacuationRoutes: [
      { id: "ur1", from: "Adajan Riverside", to: "Indoor Stadium High Ground", status: "CLEAR", routeLengthKm: 2.1, safetyRating: "100% Flood-Free" },
      { id: "ur2", from: "Rander Town", to: "VNSGU University Campus", status: "MODERATE TRAFFIC", routeLengthKm: 6.4, safetyRating: "Elevated Corridor" },
      { id: "ur3", from: "Kamrej Lowlands", to: "National Highway Flyover Safe Zone", status: "ELEVATED ARTERY", routeLengthKm: 3.8, safetyRating: "Emergency Staging Safe" }
    ],
    resourceMobilization: {
      ndrfBattalionsDeployed: 28,
      sdrfCompanies: 36,
      inflatableMotorBoatsIRBs: 320,
      lifeJacketsDistributed: 48000,
      emergencyDryRationKits: 240000,
      mobileWaterPurificationUnits: 65,
      temporaryShelterBedCapacity: 120000
    }
  }
};
