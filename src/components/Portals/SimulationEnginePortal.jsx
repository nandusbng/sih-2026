import React, { useEffect, useState } from 'react';
import { 
  Cpu, 
  Terminal, 
  Activity, 
  CheckCircle2, 
  Layers, 
  Waves, 
  Gauge, 
  ArrowRight, 
  RefreshCw, 
  Map, 
  FileCheck,
  Zap,
  TrendingDown
} from 'lucide-react';
import { MODEL_METRICS_DATA } from '../../data/mockData';

export default function SimulationEnginePortal({ 
  selectedDamId, 
  damsData, 
  currentScenario,
  simulationState,
  startSimulation,
  setActivePortal,
  setViewMode
}) {
  const currentDam = damsData[selectedDamId];
  const metrics = (MODEL_METRICS_DATA[selectedDamId] && MODEL_METRICS_DATA[selectedDamId].partial_breach) 
    ? MODEL_METRICS_DATA[selectedDamId].partial_breach 
    : MODEL_METRICS_DATA.hirakud.partial_breach;

  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="portal-page-container">
      {/* Header */}
      <div className="portal-header-row">
        <div>
          <div className="badge badge-cyan mb-2">
            <Cpu size={12} />
            <span>PORTAL 4: DUAL HYDRODYNAMIC SIMULATION ENGINE</span>
          </div>
          <h1 className="portal-title">Delft3D Flexible Mesh & SPH Particle Solver</h1>
          <p className="portal-subtitle">
            Parallel multi-physics execution solving 2D Shallow Water Equations (Delft3D) and free-surface Lagrangian particle mechanics (SPH).
          </p>
        </div>

        <div className="flex-align-gap">
          {setViewMode && (
            <button 
              className="btn btn-secondary"
              onClick={() => setViewMode('map_fullscreen')}
              style={{ borderColor: '#38bdf8', color: '#38bdf8', background: 'rgba(56, 189, 248, 0.1)' }}
              title="Switch to Whole Interface Interactive Map with Flood Wave Scrubber"
            >
              <Waves size={15} className="animate-pulse" />
              <span>Full Wave Simulation Map</span>
            </button>
          )}

          <button 
            className="btn btn-secondary"
            onClick={startSimulation}
            disabled={simulationState.isRunning}
          >
            <RefreshCw size={14} className={simulationState.isRunning ? 'spin' : ''} />
            <span>{simulationState.isRunning ? 'Simulating...' : 'Re-Run Simulation'}</span>
          </button>
          
          <button 
            className="btn btn-primary"
            onClick={() => setActivePortal('model_comparison')}
          >
            <span>Proceed to Model Comparison</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>

      {/* Progress & Live Orchestration Banner */}
      <div className="glass-panel p-5 mb-4">
        <div className="flex-between mb-2">
          <div className="flex-align-gap">
            <span className={`pulse-dot ${simulationState.isFinished ? 'pulse-dot-green' : 'pulse-dot-red'}`}></span>
            <span className="font-bold text-sm text-white">
              {simulationState.isFinished ? 'DUAL-MODEL SIMULATION COMPLETED' : 'ORCHESTRATING DELFT3D + SPH CLUSTERS'}
            </span>
          </div>
          <span className="font-mono text-cyan text-sm font-bold">
            {simulationState.progress}% CONVERGED
          </span>
        </div>

        <div className="progress-container">
          <div 
            className="progress-fill" 
            style={{ width: `${simulationState.progress}%` }}
          ></div>
        </div>

        <div className="sim-meta-row mt-2">
          <span>Target Reach: <strong>{currentDam.name} ({currentDam.downstreamReachKm} km reach)</strong></span>
          <span>Mesh: <strong>Delft3D FM (248K cells) + DualSPHysics (14.5M particles)</strong></span>
          <span>Simulation Horizon: <strong>48 Hours (Adaptive CFL Courant &lt; 0.75)</strong></span>
        </div>
      </div>

      {/* Two Model Cards: Delft3D vs SPH */}
      <div className="model-duo-grid">
        
        {/* Model 1: Delft3D-FM (Eulerian 2D SWE) */}
        <div className="glass-panel p-5 model-card delft-card">
          <div className="model-card-header">
            <div className="flex-align-gap">
              <div className="model-tag-icon delft-color">
                <Waves size={18} />
              </div>
              <div>
                <h3 className="model-title text-cyan">Delft3D Flexible Mesh (D-Flow FM 2D)</h3>
                <span className="text-dim text-xs">Deltares OpenDA / Shallow Water Equations</span>
              </div>
            </div>
            <span className="badge badge-cyan">EULERIAN 2D</span>
          </div>

          <div className="model-specs-grid mt-4">
            <div className="spec-box">
              <span className="spec-label">Computational Mesh:</span>
              <span className="spec-value text-white">{metrics.delft3d.cellsCount.toLocaleString()} Cells</span>
            </div>
            <div className="spec-box">
              <span className="spec-label">Peak Water Depth:</span>
              <span className="spec-value text-cyan">{metrics.delft3d.maxDepthM} meters</span>
            </div>
            <div className="spec-box">
              <span className="spec-label">Mean Flow Velocity:</span>
              <span className="spec-value text-emerald">{metrics.delft3d.avgVelocityMs} m/s</span>
            </div>
            <div className="spec-box">
              <span className="spec-label">Peak Outflow Discharge:</span>
              <span className="spec-value text-amber">{metrics.delft3d.peakDischargeCumecs.toLocaleString()} m³/s</span>
            </div>
            <div className="spec-box">
              <span className="spec-label">Total Inundation Extent:</span>
              <span className="spec-value text-purple">{metrics.delft3d.totalInundatedSqKm} km²</span>
            </div>
            <div className="spec-box">
              <span className="spec-label">Mass Conservation Error:</span>
              <span className="spec-value text-emerald">{metrics.delft3d.massBalanceErrorPercent}%</span>
            </div>
          </div>

          <div className="model-feature-note mt-3">
            <CheckCircle2 size={14} className="text-emerald" />
            <span>Optimal for widespread floodplain diffusion, delta backwater, and long-duration inundation routing.</span>
          </div>
        </div>

        {/* Model 2: SPH (Lagrangian Particle Solver) */}
        <div className="glass-panel p-5 model-card sph-card">
          <div className="model-card-header">
            <div className="flex-align-gap">
              <div className="model-tag-icon sph-color">
                <Zap size={18} />
              </div>
              <div>
                <h3 className="model-title text-purple">Smoothed Particle Hydrodynamics (DualSPHysics)</h3>
                <span className="text-dim text-xs">Lagrangian Particle Navier-Stokes / Free Surface</span>
              </div>
            </div>
            <span className="badge badge-purple">LAGRANGIAN 3D/2D</span>
          </div>

          <div className="model-specs-grid mt-4">
            <div className="spec-box">
              <span className="spec-label">Fluid Particles Tracked:</span>
              <span className="spec-value text-white">{(metrics.sph.particleCount / 1000000).toFixed(1)} Million</span>
            </div>
            <div className="spec-box">
              <span className="spec-label">Peak Wavefront Depth:</span>
              <span className="spec-value text-purple">{metrics.sph.maxDepthM} meters</span>
            </div>
            <div className="spec-box">
              <span className="spec-label">Front Wave Velocity:</span>
              <span className="spec-value text-emerald">{metrics.sph.avgVelocityMs} m/s</span>
            </div>
            <div className="spec-box">
              <span className="spec-label">Instantaneous Peak Inrush:</span>
              <span className="spec-value text-amber">{metrics.sph.peakDischargeCumecs.toLocaleString()} m³/s</span>
            </div>
            <div className="spec-box">
              <span className="spec-label">Total Particle Extent:</span>
              <span className="spec-value text-cyan">{metrics.sph.totalInundatedSqKm} km²</span>
            </div>
            <div className="spec-box">
              <span className="spec-label">Wavefront Arrival (Burla):</span>
              <span className="spec-value text-red">{metrics.sph.arrivalFirstSettlementHr * 60} mins</span>
            </div>
          </div>

          <div className="model-feature-note mt-3">
            <CheckCircle2 size={14} className="text-purple" />
            <span>Captures near-field dam break shockwave, non-hydrostatic vertical acceleration, and violent hydraulic jumps.</span>
          </div>
        </div>

      </div>

      {/* Extracted NetCDF Flood Products Grid */}
      <div className="glass-panel p-5 mt-4">
        <div className="flex-between mb-3">
          <div className="flex-align-gap">
            <FileCheck className="text-cyan" size={18} />
            <h2 className="panel-h2">Automated NetCDF Post-Processed Flood Products</h2>
          </div>
          <span className="badge badge-emerald">Ready for Web GIS Overlay</span>
        </div>

        <div className="products-grid">
          <div className="product-card">
            <span className="prod-badge">Product 01</span>
            <h4 className="prod-title">Flood Inundation Extent</h4>
            <p className="prod-val text-cyan">{metrics.delft3d.totalInundatedSqKm} km²</p>
            <span className="prod-desc">Binarized zero-depth boundary polygon</span>
          </div>

          <div className="product-card">
            <span className="prod-badge">Product 02</span>
            <h4 className="prod-title">Maximum Water Depth (h_max)</h4>
            <p className="prod-val text-primary">{metrics.delft3d.maxDepthM} m</p>
            <span className="prod-desc">Highest water column reached per grid cell</span>
          </div>

          <div className="product-card">
            <span className="prod-badge">Product 03</span>
            <h4 className="prod-title">Peak Flow Velocity (v_max)</h4>
            <p className="prod-val text-emerald">{metrics.delft3d.avgVelocityMs} m/s</p>
            <span className="prod-desc">Vector field with magnitude and flow vectors</span>
          </div>

          <div className="product-card">
            <span className="prod-badge">Product 04</span>
            <h4 className="prod-title">Wavefront Arrival Time</h4>
            <p className="prod-val text-amber">{metrics.delft3d.arrivalFirstSettlementHr} Hours</p>
            <span className="prod-desc">Isochrone time-to-first-inundation</span>
          </div>

          <div className="product-card">
            <span className="prod-badge">Product 05</span>
            <h4 className="prod-title">Inundation Duration</h4>
            <p className="prod-val text-purple">34.2 Hours</p>
            <span className="prod-desc">Persistence of submergence &gt;0.3m</span>
          </div>
        </div>
      </div>

      {/* Real-Time Live Execution Logs Terminal */}
      <div className="glass-panel p-5 mt-4 terminal-panel">
        <div className="panel-title-bar">
          <div className="flex-align-gap">
            <Terminal className="text-emerald" size={16} />
            <h3 className="text-sm font-mono font-bold text-white">Cluster Simulation Logs (Delft3D FM & DualSPHysics Core)</h3>
          </div>
          <span className="text-xs font-mono text-dim">Node: gpu-h100-hydro-04 | MPI 64 ranks</span>
        </div>

        <div className="terminal-screen">
          {simulationState.logs.map((log, index) => (
            <div key={index} className="terminal-line">
              <span className="terminal-time">[{new Date().toLocaleTimeString()}]</span>
              <span className="terminal-msg">{log}</span>
            </div>
          ))}
          <div className="terminal-line active-line">
            <span className="terminal-cursor">█</span>
            <span className="terminal-msg text-dim">Awaiting next time step synchronization...</span>
          </div>
        </div>
      </div>

      <style>{`
        .model-duo-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        @media (max-width: 1024px) {
          .model-duo-grid {
            grid-template-columns: 1fr;
          }
        }

        .model-card {
          border-top: 3px solid transparent;
        }

        .delft-card {
          border-top-color: #0284c7;
        }

        .sph-card {
          border-top-color: #8b5cf6;
        }

        .model-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .model-tag-icon {
          padding: 8px;
          border-radius: var(--radius-sm);
        }

        .delft-color {
          background: rgba(2, 132, 199, 0.15);
          color: #38bdf8;
        }

        .sph-color {
          background: rgba(139, 92, 246, 0.15);
          color: #c084fc;
        }

        .model-title {
          font-size: 1rem;
          font-weight: 700;
        }

        .model-specs-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .spec-box {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 12px 14px;
        }

        .spec-label {
          display: block;
          font-size: 0.725rem;
          color: #64748b;
          text-transform: uppercase;
          margin-bottom: 2px;
          font-weight: 600;
        }

        .spec-value {
          font-family: var(--font-mono);
          font-size: 1.15rem;
          font-weight: 800;
          color: #0f172a;
        }

        .model-feature-note {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.775rem;
          color: #15803d;
          background: #f0fdf4;
          border: 1px solid #bbf7d0;
          padding: 10px 14px;
          border-radius: 8px;
        }

        .sim-meta-row {
          display: flex;
          justify-content: space-between;
          font-size: 0.775rem;
          color: #64748b;
          flex-wrap: wrap;
          gap: 8px;
        }

        .products-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
        }

        @media (max-width: 1024px) {
          .products-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        .product-card {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          padding: 16px;
          transition: all 0.15s ease;
        }

        .product-card:hover {
          background: #ffffff;
          border-color: #cbd5e1;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        }

        .prod-badge {
          display: inline-block;
          font-size: 0.7rem;
          color: #64748b;
          text-transform: uppercase;
          font-weight: 700;
          margin-bottom: 4px;
        }

        .prod-title {
          font-size: 0.875rem;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 6px;
        }

        .prod-val {
          font-family: var(--font-mono);
          font-size: 1.4rem;
          font-weight: 800;
          line-height: 1.1;
          margin-bottom: 4px;
        }

        .prod-desc {
          font-size: 0.75rem;
          color: #64748b;
        }

        .terminal-panel {
          background: #05080f;
        }

        .terminal-screen {
          background: #080c14;
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: var(--radius-sm);
          padding: 12px;
          font-family: var(--font-mono);
          font-size: 0.775rem;
          max-height: 220px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .terminal-line {
          display: flex;
          gap: 10px;
        }

        .terminal-time {
          color: var(--text-dim);
          flex-shrink: 0;
        }

        .terminal-msg {
          color: #38bdf8;
        }

        .terminal-cursor {
          color: #10b981;
          animation: pulse 1s infinite;
        }
      `}</style>
    </div>
  );
}
