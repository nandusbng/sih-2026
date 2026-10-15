import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import GisMap from './components/Map/GisMap';
import DataAdminPortal from './components/Portals/DataAdminPortal';
import DamOperatorPortal from './components/Portals/DamOperatorPortal';
import ScenarioComposerPortal from './components/Portals/ScenarioComposerPortal';
import SimulationEnginePortal from './components/Portals/SimulationEnginePortal';
import ModelComparisonPortal from './components/Portals/ModelComparisonPortal';
import ImpactAnalysisPortal from './components/Portals/ImpactAnalysisPortal';
import HadrPriorityPortal from './components/Portals/HadrPriorityPortal';
import CitizenWarningPortal from './components/Portals/CitizenWarningPortal';
import ExportReportPortal from './components/Portals/ExportReportPortal';
import LoginPortalGateway from './components/Portals/LoginPortalGateway';
import LoginPage from './components/Portals/LoginPage';
import DamBreakLandingPage from './components/Landing/DamBreakLandingPage';

import { DAMS_DATA, PRESET_SCENARIOS } from './data/mockData';
import { 
  ROLE_DEFINITIONS, 
  isPortalAllowedForRole, 
  getDefaultPortalForRole 
} from './data/rolePermissions';
import { Map, LayoutGrid, Maximize2, SplitSquareVertical } from 'lucide-react';

export default function App() {
  const [appScreen, setAppScreen] = useState('landing'); // 'landing', 'login', 'workspace'
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedDamId, setSelectedDamId] = useState('khadakwasla');
  const [activePortal, setActivePortal] = useState('data_admin');
  const [userRole, setUserRole] = useState('technical');
  const [viewMode, setViewMode] = useState('portal_only'); // 'portal_only', 'split', 'map_fullscreen'

  // Enforce Role-Based Access Control (RBAC): Ensure active portal belongs to user's authorized profile
  useEffect(() => {
    if (activePortal !== 'gateway' && !isPortalAllowedForRole(activePortal, userRole)) {
      const allowedDefault = getDefaultPortalForRole(userRole);
      setActivePortal(allowedDefault);
    }
  }, [userRole, activePortal]);

  // Active Scenario & Parameters
  const [currentScenario, setCurrentScenario] = useState(PRESET_SCENARIOS[2]); // Default: Partial Dam Breach
  const [scenarioParams, setScenarioParams] = useState({
    ...PRESET_SCENARIOS[2].defaultParams,
    initialReservoirLevelM: DAMS_DATA.hirakud.currentStatus.waterLevelM
  });

  // Dual Simulation State
  const [simulationState, setSimulationState] = useState({
    isRunning: false,
    isFinished: true,
    progress: 100,
    logs: [
      "Mesh initialization: 248,920 cells mapped to UTM Zone 44N.",
      "Delft3D Flexible Mesh SWE solver initialized (Courant CFL < 0.75).",
      "SPH Lagrangian particle engine active (14.5M fluid particles).",
      "NetCDF flood products extracted: Extent, Depth, Velocity, Isochrones.",
      "GEE Sentinel-1 SAR ground truth cross-validation complete (91.8% match)."
    ]
  });

  // Active Map Layers
  const [activeLayers, setActiveLayers] = useState({
    delft3d: true,
    sph: true,
    gee: true,
    isochrones: true,
    settlements: true,
    roads: true,
    assets: true,
    reservoir: true
  });

  // Function to simulate dual-model execution
  const startSimulation = () => {
    setSimulationState({
      isRunning: true,
      isFinished: false,
      progress: 5,
      logs: ["Initiating parallel compute clusters: gpu-h100-hydro-04..."]
    });

    const steps = [
      { progress: 20, log: "Compiling 2D mesh & bathymetric cross-sections with Manning roughness..." },
      { progress: 45, log: "Delft3D-FM 2D unsteady SWE solver executing time steps 00:00 -> 24:00..." },
      { progress: 70, log: "DualSPHysics tracking Lagrangian free-surface wavefront & near-field splash..." },
      { progress: 85, log: "Automating NetCDF post-processing: Extracting flood extent, max depth, velocity..." },
      { progress: 95, log: "Querying Google Earth Engine API for Copernicus Sentinel-1 SAR backscatter..." },
      { progress: 100, log: "Simulation finished. Flood products ready for Web GIS & HADR Engine." }
    ];

    steps.forEach((step, idx) => {
      setTimeout(() => {
        setSimulationState(prev => ({
          ...prev,
          progress: step.progress,
          isFinished: step.progress === 100,
          isRunning: step.progress !== 100,
          logs: [...prev.logs, step.log]
        }));
      }, (idx + 1) * 700);
    });
  };

  // Render Portal Component based on activePortal
  const renderActivePortal = () => {
    switch (activePortal) {
      case 'gateway':
        return (
          <LoginPortalGateway 
            setActivePortal={setActivePortal}
            userRole={userRole}
            setUserRole={setUserRole}
            selectedDamId={selectedDamId}
            setSelectedDamId={setSelectedDamId}
            damsData={DAMS_DATA}
            setViewMode={setViewMode}
            currentScenario={currentScenario}
            simulationState={simulationState}
          />
        );
      case 'data_admin':
        return (
          <DataAdminPortal 
            selectedDamId={selectedDamId}
            setSelectedDamId={setSelectedDamId}
            damsData={DAMS_DATA}
            setActivePortal={setActivePortal}
          />
        );
      case 'dam_operator':
        return (
          <DamOperatorPortal 
            selectedDamId={selectedDamId}
            damsData={DAMS_DATA}
            setActivePortal={setActivePortal}
          />
        );
      case 'scenario_composer':
        return (
          <ScenarioComposerPortal 
            selectedDamId={selectedDamId}
            damsData={DAMS_DATA}
            currentScenario={currentScenario}
            setCurrentScenario={setCurrentScenario}
            scenarioParams={scenarioParams}
            setScenarioParams={setScenarioParams}
            setActivePortal={setActivePortal}
            startSimulation={startSimulation}
          />
        );
      case 'simulation_engine':
        return (
          <SimulationEnginePortal 
            selectedDamId={selectedDamId}
            damsData={DAMS_DATA}
            currentScenario={currentScenario}
            simulationState={simulationState}
            startSimulation={startSimulation}
            setActivePortal={setActivePortal}
            setViewMode={setViewMode}
          />
        );
      case 'model_comparison':
        return (
          <ModelComparisonPortal 
            selectedDamId={selectedDamId}
            damsData={DAMS_DATA}
            setActivePortal={setActivePortal}
          />
        );
      case 'impact_analysis':
        return (
          <ImpactAnalysisPortal 
            selectedDamId={selectedDamId}
            damsData={DAMS_DATA}
            setActivePortal={setActivePortal}
          />
        );
      case 'hadr_priority':
        return (
          <HadrPriorityPortal 
            selectedDamId={selectedDamId}
            damsData={DAMS_DATA}
            setActivePortal={setActivePortal}
          />
        );
      case 'citizen_warning':
        return (
          <CitizenWarningPortal 
            selectedDamId={selectedDamId}
            damsData={DAMS_DATA}
          />
        );
      case 'export_reports':
        return (
          <ExportReportPortal 
            selectedDamId={selectedDamId}
            damsData={DAMS_DATA}
            currentScenario={currentScenario}
            scenarioParams={scenarioParams}
          />
        );
      default:
        return null;
    }
  };

  // 1. Initial Launch Screen: High-Impact Frame-by-Frame Scrollable Dam Break Simulation
  if (appScreen === 'landing') {
    return (
      <DamBreakLandingPage 
        onEnterSystem={() => setAppScreen('login')}
        onOpenLoginRole={(role) => {
          if (role) setUserRole(role);
          setAppScreen('login');
        }}
      />
    );
  }

  // 2. Central Command Login & Role-Based Gateway
  if (appScreen === 'login' || !isLoggedIn) {
    return (
      <LoginPage 
        onLogin={(role, portal, damId) => {
          const effectiveRole = role || 'technical';
          setUserRole(effectiveRole);
          const effectivePortal = (portal && isPortalAllowedForRole(portal, effectiveRole))
            ? portal
            : getDefaultPortalForRole(effectiveRole);
          setActivePortal(effectivePortal);
          if (damId) setSelectedDamId(damId);
          setIsLoggedIn(true);
          setAppScreen('workspace');
        }}
        onBackToLanding={() => setAppScreen('landing')}
        selectedDamId={selectedDamId}
        setSelectedDamId={setSelectedDamId}
        damsData={DAMS_DATA}
        userRole={userRole}
        setUserRole={setUserRole}
      />
    );
  }

  return (
    <div className="app-shell">
      {/* Top Header & Telemetry Bar */}
      <Header 
        selectedDamId={selectedDamId}
        setSelectedDamId={setSelectedDamId}
        activePortal={activePortal}
        setActivePortal={setActivePortal}
        damsData={DAMS_DATA}
        currentScenario={currentScenario}
        simulationState={simulationState}
        userRole={userRole}
        setUserRole={setUserRole}
        viewMode={viewMode}
        setViewMode={setViewMode}
        onLogout={() => {
          setIsLoggedIn(false);
          setAppScreen('landing');
        }}
        onReturnLanding={() => setAppScreen('landing')}
      />

      {/* Main Dynamic View Layout */}
      <main className="main-layout-container">
        {viewMode === 'map_fullscreen' ? (
          <div className="fullscreen-map-wrap">
            <GisMap 
              selectedDamId={selectedDamId}
              damsData={DAMS_DATA}
              currentScenario={currentScenario}
              simulationState={simulationState}
              activeLayers={activeLayers}
              setActiveLayers={setActiveLayers}
            />
          </div>
        ) : (
          <div className="portal-only-wrap">
            {renderActivePortal()}
          </div>
        )}
      </main>

      <style>{`
        .app-shell {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          background: #f1f5f9;
          color: #0f172a;
        }

        .view-mode-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 8px 24px;
          background: #ffffff;
          border-bottom: 1px solid #e2e8f0;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
        }

        .view-controls {
          display: flex;
          gap: 8px;
        }

        .view-mode-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          background: #f8fafc;
          border: 1px solid #cbd5e1;
          border-radius: 6px;
          color: #475569;
          font-size: 0.775rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .view-mode-btn:hover {
          color: #0284c7;
          border-color: #93c5fd;
          background: #f0f9ff;
        }

        .view-mode-btn.active {
          background: #0284c7;
          border-color: #0284c7;
          color: #ffffff;
          box-shadow: 0 2px 6px rgba(2, 132, 199, 0.35);
        }

        .main-layout-container {
          flex: 1;
          display: flex;
          flex-direction: column;
          background: #f1f5f9;
        }

        .fullscreen-map-wrap {
          flex: 1;
          width: 100%;
          height: calc(100vh - 110px);
        }

        .portal-only-wrap {
          flex: 1;
          width: 100%;
          padding-bottom: 30px;
        }

        .split-view-container {
          display: flex;
          flex-direction: row;
          gap: 20px;
          padding: 20px 24px;
          height: calc(100vh - 120px);
        }

        .split-portal-section {
          width: 45%;
          overflow-y: auto;
          padding-right: 10px;
        }

        .split-map-section {
          width: 55%;
          display: flex;
          flex-direction: column;
        }

        .split-map-sticky-card {
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          background: #ffffff;
          border: 1px solid #cbd5e1;
          border-radius: 12px;
          box-shadow: 0 4px 20px -2px rgba(0, 0, 0, 0.08);
        }

        .split-map-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px 16px;
          background: #f8fafc;
          border-bottom: 1px solid #e2e8f0;
          color: #0f172a;
        }

        .split-map-inner {
          flex: 1;
          width: 100%;
          position: relative;
        }
      `}</style>
    </div>
  );
}
