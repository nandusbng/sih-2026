import React, { useState } from 'react';
import { 
  Sliders, 
  SlidersHorizontal, 
  AlertTriangle, 
  Flame, 
  Skull, 
  MountainSnow, 
  CloudRain, 
  Clock, 
  Cpu, 
  CheckCircle2, 
  ArrowRight,
  Info,
  Layers,
  Sparkles
} from 'lucide-react';
import { PRESET_SCENARIOS } from '../../data/mockData';

export default function ScenarioComposerPortal({ 
  selectedDamId, 
  damsData, 
  currentScenario, 
  setCurrentScenario, 
  scenarioParams, 
  setScenarioParams,
  setActivePortal,
  startSimulation
}) {
  const currentDam = damsData[selectedDamId];
  const [selectedPresetId, setSelectedPresetId] = useState(currentScenario.id || 'partial_breach');
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  // Sync preset selection
  const handleSelectPreset = (preset) => {
    setSelectedPresetId(preset.id);
    setCurrentScenario(preset);
    setScenarioParams({
      ...preset.defaultParams,
      initialReservoirLevelM: currentDam.currentStatus.waterLevelM
    });
  };

  const updateParam = (key, value) => {
    setScenarioParams(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleLaunchModel = () => {
    startSimulation();
    setActivePortal('simulation_engine');
  };

  const getIcon = (iconName) => {
    switch(iconName) {
      case 'SlidersHorizontal': return <SlidersHorizontal size={20} />;
      case 'AlertTriangle': return <AlertTriangle size={20} />;
      case 'Flame': return <Flame size={20} />;
      case 'Skull': return <Skull size={20} />;
      case 'MountainSnow': return <MountainSnow size={20} />;
      default: return <CloudRain size={20} />;
    }
  };

  return (
    <div className="portal-page-container">
      {/* Header */}
      <div className="portal-header-row">
        <div>
          <div className="badge badge-purple mb-2">
            <Sliders size={12} />
            <span>PORTAL 3: HYDRODYNAMIC SCENARIO COMPOSER</span>
          </div>
          <h1 className="portal-title">Scenario Definition & Model Boundary Generator</h1>
          <p className="portal-subtitle">
            Select physical hazard archetypes or customize dam breach mechanics, spillway discharge hydrographs, and extreme rainfall events.
          </p>
        </div>

        <button 
          className="btn btn-primary"
          onClick={() => setIsReviewModalOpen(true)}
        >
          <Sparkles size={16} />
          <span>Review & Generate Model</span>
        </button>
      </div>

      {/* Preset Archetype Cards Grid */}
      <div className="presets-cards-grid">
        {PRESET_SCENARIOS.map((preset) => {
          const isSelected = selectedPresetId === preset.id;
          return (
            <div 
              key={preset.id}
              onClick={() => handleSelectPreset(preset)}
              className={`glass-panel preset-card ${isSelected ? 'selected' : ''}`}
              style={{ borderTopColor: isSelected ? preset.badgeColor : 'transparent' }}
            >
              <div className="preset-top-row">
                <div className="preset-icon" style={{ color: preset.badgeColor }}>
                  {getIcon(preset.icon)}
                </div>
                <span className="badge" style={{ 
                  background: `${preset.badgeColor}22`, 
                  color: preset.badgeColor,
                  border: `1px solid ${preset.badgeColor}55`
                }}>
                  {preset.severity}
                </span>
              </div>

              <h3 className="preset-name">{preset.name}</h3>
              <p className="preset-desc">{preset.description}</p>

              <div className="preset-footer">
                <span className="text-dim text-xs font-mono">{preset.type}</span>
                <span className="preset-select-indicator">
                  {isSelected ? 'ACTIVE CONFIG' : 'SELECT'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Two-Column Parametric Tuning Form */}
      <div className="content-two-columns mt-4">
        
        {/* Left Column: Breach Mechanics & Hydraulic Discharges */}
        <div className="glass-panel p-5">
          <div className="panel-title-bar">
            <div className="flex-align-gap">
              <Flame className="text-red" size={18} />
              <h2 className="panel-h2">Breach Mechanics & Spillway Discharge Parameters</h2>
            </div>
            <span className="badge badge-red">Empirical Formulations</span>
          </div>

          <div className="params-form">
            {/* Failure Mode Selector */}
            <div className="form-group">
              <label className="form-label">Breach Failure Mechanism / Regression</label>
              <select 
                value={scenarioParams.failureMode || 'Piping Erosion (Froehlich / Xu-Zhang formulation)'}
                onChange={(e) => updateParam('failureMode', e.target.value)}
                className="form-select"
              >
                <option value="Piping Erosion (Froehlich / Xu-Zhang formulation)">Piping Erosion (Froehlich, 2008 & Xu-Zhang)</option>
                <option value="Overtopping Progressive Washout">Overtopping Progressive Washout</option>
                <option value="Instantaneous Structural Collapse">Instantaneous Structural Collapse (MacDonald & Langridge-Monopolis)</option>
                <option value="Surcharge Spillway Discharge (No Dam Breach)">Surcharge Spillway Discharge (Dam Intact)</option>
              </select>
            </div>

            {/* Breach Width Slider */}
            <div className="form-group">
              <div className="flex-between mb-1">
                <label className="form-label">Final Breach Average Width (Bw)</label>
                <span className="font-mono text-cyan text-sm font-bold">{scenarioParams.breachWidthM || 150} meters</span>
              </div>
              <input 
                type="range" 
                min="20" 
                max="600" 
                step="10"
                value={scenarioParams.breachWidthM || 150}
                onChange={(e) => updateParam('breachWidthM', parseInt(e.target.value))}
                className="tactical-slider w-full"
              />
              <span className="text-xs text-dim">Dam Crest Length: {currentDam.specs.totalLengthKm * 1000} m</span>
            </div>

            {/* Breach Formation Time */}
            <div className="form-group">
              <div className="flex-between mb-1">
                <label className="form-label">Breach Formation Time (tf)</label>
                <span className="font-mono text-amber text-sm font-bold">{scenarioParams.breachFormationTimeHr || 2.0} hours</span>
              </div>
              <input 
                type="range" 
                min="0.5" 
                max="8.0" 
                step="0.1"
                value={scenarioParams.breachFormationTimeHr || 2.0}
                onChange={(e) => updateParam('breachFormationTimeHr', parseFloat(e.target.value))}
                className="tactical-slider w-full"
              />
              <span className="text-xs text-dim">Time from breach initiation to maximum geometry opening</span>
            </div>

            {/* Breach Bottom Elevation */}
            <div className="form-group">
              <div className="flex-between mb-1">
                <label className="form-label">Breach Invert / Bottom Elevation</label>
                <span className="font-mono text-emerald text-sm font-bold">{scenarioParams.breachBottomElevationM || 170} m MSL</span>
              </div>
              <input 
                type="range" 
                min={currentDam.specs.deadStorageLevelM} 
                max={currentDam.specs.fullReservoirLevelM} 
                step="0.5"
                value={scenarioParams.breachBottomElevationM || 170}
                onChange={(e) => updateParam('breachBottomElevationM', parseFloat(e.target.value))}
                className="tactical-slider w-full"
              />
              <span className="text-xs text-dim">River bed at dam toe: ~{currentDam.specs.deadStorageLevelM} m</span>
            </div>
          </div>
        </div>

        {/* Right Column: Catchment Meteorology & Numerical Model Grid Controls */}
        <div className="glass-panel p-5">
          <div className="panel-title-bar">
            <div className="flex-align-gap">
              <CloudRain className="text-cyan" size={18} />
              <h2 className="panel-h2">Initial Conditions, Meteorology & Model Bounds</h2>
            </div>
            <span className="badge badge-cyan">Numerical Controls</span>
          </div>

          <div className="params-form">
            {/* Initial Reservoir Level */}
            <div className="form-group">
              <div className="flex-between mb-1">
                <label className="form-label">Initial Water Level at Simulation Start (H₀)</label>
                <span className="font-mono text-cyan text-sm font-bold">{scenarioParams.initialReservoirLevelM || currentDam.currentStatus.waterLevelM} m</span>
              </div>
              <input 
                type="range" 
                min={currentDam.specs.deadStorageLevelM + 5} 
                max={currentDam.specs.maximumWaterLevelM + 0.5} 
                step="0.1"
                value={scenarioParams.initialReservoirLevelM || currentDam.currentStatus.waterLevelM}
                onChange={(e) => updateParam('initialReservoirLevelM', parseFloat(e.target.value))}
                className="tactical-slider w-full"
              />
              <span className="text-xs text-dim">FRL: {currentDam.specs.fullReservoirLevelM}m | Current: {currentDam.currentStatus.waterLevelM}m</span>
            </div>

            {/* Rainfall Scenario */}
            <div className="form-group">
              <div className="flex-between mb-1">
                <label className="form-label">Catchment Rainfall Intensity</label>
                <span className="font-mono text-amber text-sm font-bold">{scenarioParams.rainfallMm || 120} mm / 24h</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="450" 
                step="10"
                value={scenarioParams.rainfallMm || 120}
                onChange={(e) => updateParam('rainfallMm', parseInt(e.target.value))}
                className="tactical-slider w-full"
              />
              <span className="text-xs text-dim">IMD return period: {scenarioParams.rainfallMm > 250 ? 'PMP Probable Max Precip' : scenarioParams.rainfallMm > 150 ? '1:100 Year Event' : '1:25 Year Event'}</span>
            </div>

            {/* Simulation Duration */}
            <div className="form-group">
              <div className="flex-between mb-1">
                <label className="form-label">Hydrodynamic Simulation Horizon</label>
                <span className="font-mono text-white text-sm font-bold">{scenarioParams.simulationDurationHr || 48} Hours</span>
              </div>
              <div className="duration-pill-group">
                {[12, 24, 36, 48, 72].map((dur) => (
                  <button 
                    key={dur}
                    type="button"
                    onClick={() => updateParam('simulationDurationHr', dur)}
                    className={`duration-btn ${scenarioParams.simulationDurationHr === dur ? 'active' : ''}`}
                  >
                    {dur}h
                  </button>
                ))}
              </div>
            </div>

            {/* Manning's n Roughness */}
            <div className="form-group">
              <div className="flex-between mb-1">
                <label className="form-label">Floodplain Manning's Roughness (n)</label>
                <span className="font-mono text-purple text-sm font-bold">{scenarioParams.manningRoughness || 0.038}</span>
              </div>
              <input 
                type="range" 
                min="0.025" 
                max="0.065" 
                step="0.001"
                value={scenarioParams.manningRoughness || 0.038}
                onChange={(e) => updateParam('manningRoughness', parseFloat(e.target.value))}
                className="tactical-slider w-full"
              />
              <span className="text-xs text-dim">Derived from NRSC Bhuvan LULC composite</span>
            </div>
          </div>
        </div>

      </div>

      {/* Review Modal */}
      {isReviewModalOpen && (
        <div className="modal-backdrop">
          <div className="glass-panel p-6 review-modal-card">
            <div className="modal-header">
              <div className="flex-align-gap">
                <Sparkles size={20} className="text-cyan" />
                <h2 className="text-lg font-bold text-white">Pre-Flight Scenario Review & Model Compilation</h2>
              </div>
              <button 
                className="btn btn-secondary btn-sm"
                onClick={() => setIsReviewModalOpen(false)}
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-muted mb-4">
              Review hydraulic parameters before initializing Delft3D-FM 2D Shallow Water Equations solver and DualSPHysics particle engine.
            </p>

            <div className="review-summary-table">
              <div className="review-row">
                <span className="text-dim">Target Dam:</span>
                <span className="text-white font-bold">{currentDam.name} ({currentDam.river})</span>
              </div>
              <div className="review-row">
                <span className="text-dim">Scenario Type:</span>
                <span className="text-cyan font-bold">{currentScenario.name}</span>
              </div>
              <div className="review-row">
                <span className="text-dim">Initial Water Level:</span>
                <span className="font-mono text-emerald font-bold">{scenarioParams.initialReservoirLevelM} m MSL</span>
              </div>
              <div className="review-row">
                <span className="text-dim">Breach Width / Formation:</span>
                <span className="font-mono text-amber font-bold">{scenarioParams.breachWidthM}m in {scenarioParams.breachFormationTimeHr} hrs</span>
              </div>
              <div className="review-row">
                <span className="text-dim">Rainfall Influx:</span>
                <span className="font-mono text-purple font-bold">{scenarioParams.rainfallMm} mm / 24h</span>
              </div>
              <div className="review-row">
                <span className="text-dim">Model Duration:</span>
                <span className="font-mono text-white font-bold">{scenarioParams.simulationDurationHr} Hours</span>
              </div>
            </div>

            <div className="modal-actions mt-5">
              <button 
                className="btn btn-secondary"
                onClick={() => setIsReviewModalOpen(false)}
              >
                Back to Edit
              </button>
              <button 
                className="btn btn-primary"
                onClick={handleLaunchModel}
              >
                <Cpu size={16} />
                <span>Launch Delft3D & SPH Models</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .presets-cards-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          margin-bottom: 24px;
        }

        @media (max-width: 1100px) {
          .presets-cards-grid {
            grid-template-columns: 1fr;
          }
        }

        .preset-card {
          padding: 20px;
          border-radius: 12px;
          cursor: pointer;
          border: 1px solid #e2e8f0;
          border-top: 4px solid #cbd5e1;
          display: flex;
          flex-direction: column;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
          transition: all 0.2s ease;
        }

        .preset-card:hover {
          border-color: #0284c7;
          box-shadow: 0 4px 14px rgba(2, 132, 199, 0.12);
          transform: translateY(-2px);
        }

        .preset-card.selected {
          background: #f0f9ff;
          border-color: #0284c7;
          border-top-color: #0284c7;
          box-shadow: 0 4px 16px rgba(2, 132, 199, 0.18);
        }

        .preset-top-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }

        .preset-icon {
          background: #f1f5f9;
          padding: 10px;
          border-radius: 8px;
        }

        .preset-name {
          font-size: 1rem;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 6px;
        }

        .preset-desc {
          font-size: 0.8rem;
          color: #64748b;
          line-height: 1.5;
          margin-bottom: 14px;
          flex: 1;
        }

        .preset-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-top: 1px solid #f1f5f9;
          padding-top: 10px;
          font-size: 0.75rem;
          color: #64748b;
        }

        .preset-select-indicator {
          font-weight: 700;
          color: #0284c7;
        }

        .duration-pill-group {
          display: flex;
          gap: 10px;
        }

        .duration-btn {
          flex: 1;
          padding: 10px;
          background: #ffffff;
          border: 1px solid #cbd5e1;
          border-radius: var(--radius-sm);
          color: #475569;
          font-weight: 700;
          font-size: 0.875rem;
          cursor: pointer;
          transition: all 0.15s;
        }

        .duration-btn:hover {
          border-color: #0284c7;
          color: #0284c7;
        }

        .duration-btn.active {
          background: #0284c7;
          color: #ffffff !important;
          border-color: #0284c7;
        }

        .modal-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(15, 23, 42, 0.6);
          backdrop-filter: blur(6px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2000;
          padding: 20px;
        }

        .review-modal-card {
          max-width: 550px;
          width: 100%;
          background: #ffffff !important;
          border: 1px solid #e2e8f0;
          border-radius: 14px;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.2);
          padding: 24px;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .review-summary-table {
          display: flex;
          flex-direction: column;
          gap: 12px;
          background: #f8fafc;
          padding: 16px;
          border-radius: 8px;
          border: 1px solid #e2e8f0;
          margin-bottom: 16px;
        }

        .review-row {
          display: flex;
          justify-content: space-between;
          font-size: 0.85rem;
          color: #0f172a;
        }

        .modal-actions {
          display: flex;
          justify-content: flex-end;
          gap: 12px;
        }
      `}</style>
    </div>
  );
}
