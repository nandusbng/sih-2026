import React, { useState } from 'react';
import { 
  Activity, 
  Waves, 
  Gauge, 
  Sliders, 
  AlertTriangle, 
  ArrowUpRight, 
  ArrowDownRight, 
  CheckCircle, 
  Clock, 
  TrendingUp, 
  ShieldAlert,
  ArrowRight,
  Layers
} from 'lucide-react';

export default function DamOperatorPortal({ 
  selectedDamId, 
  damsData, 
  setActivePortal 
}) {
  const currentDam = damsData[selectedDamId];
  const [selectedGateType, setSelectedGateType] = useState('sluice');
  const [targetGateOpening, setTargetGateOpening] = useState(currentDam.currentStatus.gateOpeningM);
  const [openGatesCount, setOpenGatesCount] = useState(
    currentDam.currentStatus.openSluiceGates || currentDam.currentStatus.openCrestGates
  );

  const totalGates = selectedDamId === 'hirakud' ? 64 : 22;

  return (
    <div className="portal-page-container">
      {/* Page Title & Scope Header */}
      <div className="portal-header-row">
        <div>
          <div className="badge badge-emerald mb-2">
            <Activity size={12} />
            <span>PORTAL 2: DAM & WATER RESOURCES OPERATIONAL CONSOLE</span>
          </div>
          <h1 className="portal-title">{currentDam.name} — Real-Time Operations</h1>
          <p className="portal-subtitle">
            Live reservoir water level, storage hypsometry, inflow-outflow balance, spillway gate configuration, and CWC Rule Curve compliance.
          </p>
        </div>

        <button 
          className="btn btn-primary"
          onClick={() => setActivePortal('scenario_composer')}
        >
          <span>Configure Scenario</span>
          <ArrowRight size={16} />
        </button>
      </div>

      {/* Top 4 Key Operational Metrics Cards */}
      <div className="metrics-grid">
        {/* Metric 1: Reservoir Level */}
        <div className="glass-panel metric-card">
          <div className="metric-header">
            <span className="metric-title">RESERVOIR WATER LEVEL</span>
            <Gauge size={18} className="text-cyan" />
          </div>
          <div className="metric-main-value">
            <span className="val-text text-cyan">{currentDam.currentStatus.waterLevelM}</span>
            <span className="val-unit">m MSL</span>
          </div>
          <div className="metric-sub-bar">
            <span>FRL: {currentDam.specs.fullReservoirLevelM}m | MWL: {currentDam.specs.maximumWaterLevelM}m</span>
            <span className="text-emerald flex-align-gap">
              <ArrowUpRight size={14} /> {currentDam.currentStatus.trend}
            </span>
          </div>
        </div>

        {/* Metric 2: Live Storage */}
        <div className="glass-panel metric-card">
          <div className="metric-header">
            <span className="metric-title">STORAGE CAPACITY</span>
            <Waves size={18} className="text-primary" />
          </div>
          <div className="metric-main-value">
            <span className="val-text text-primary">{currentDam.currentStatus.currentStorageMCM}</span>
            <span className="val-unit">MCM</span>
          </div>
          <div className="progress-container">
            <div 
              className="progress-fill" 
              style={{ width: `${currentDam.currentStatus.percentStorage}%` }}
            ></div>
          </div>
          <div className="metric-sub-bar">
            <span>{currentDam.currentStatus.percentStorage}% of Gross Storage</span>
            <span>Live: {currentDam.specs.liveStorageMCM} MCM</span>
          </div>
        </div>

        {/* Metric 3: Inflow */}
        <div className="glass-panel metric-card">
          <div className="metric-header">
            <span className="metric-title">CATCHMENT INFLOW</span>
            <ArrowDownRight size={18} className="text-amber" />
          </div>
          <div className="metric-main-value">
            <span className="val-text text-amber">{currentDam.currentStatus.inflowCumecs.toLocaleString()}</span>
            <span className="val-unit">m³/s</span>
          </div>
          <div className="metric-sub-bar">
            <span>~{Math.round(currentDam.currentStatus.inflowCumecs * 35.3147).toLocaleString()} Cusecs</span>
            <span className="badge badge-amber text-xs">Monsoon Peak</span>
          </div>
        </div>

        {/* Metric 4: Total Outflow */}
        <div className="glass-panel metric-card">
          <div className="metric-header">
            <span className="metric-title">SPILLWAY OUTFLOW</span>
            <ArrowUpRight size={18} className="text-emerald" />
          </div>
          <div className="metric-main-value">
            <span className="val-text text-emerald">{currentDam.currentStatus.outflowCumecs.toLocaleString()}</span>
            <span className="val-unit">m³/s</span>
          </div>
          <div className="metric-sub-bar">
            <span>~{Math.round(currentDam.currentStatus.outflowCumecs * 35.3147).toLocaleString()} Cusecs</span>
            <span className="badge badge-emerald text-xs">{currentDam.currentStatus.openSluiceGates || currentDam.currentStatus.openCrestGates} Gates Open</span>
          </div>
        </div>
      </div>

      {/* Main Two Columns: Gate Controller + Inflow/Outflow Hydrograph */}
      <div className="content-two-columns mt-4">
        
        {/* Left Column: Visual Spillway Gate Controller */}
        <div className="glass-panel p-5">
          <div className="panel-title-bar">
            <div className="flex-align-gap">
              <Sliders className="text-cyan" size={18} />
              <h2 className="panel-h2">Spillway Gate Rack Configuration</h2>
            </div>
            <span className="badge badge-red">
              <ShieldAlert size={12} />
              <span>LIVE ACTUATION</span>
            </span>
          </div>

          <p className="text-xs text-muted mb-4">
            Interactive gate opening simulator. Adjust discharge rates to preview downstream hydraulic backwater impact before triggering hydrodynamic simulation.
          </p>

          {/* Real-Time Radial Gate Hydraulic Cutaway Profile */}
          <div className="gate-elevation-cutaway">
            <div className="cutaway-header">
              <div className="flex-align-gap">
                <Sliders size={16} className="text-cyan" />
                <span className="cutaway-title">SPILLWAY GATE LIFT &amp; HYDRAULIC DISCHARGE PROFILE</span>
              </div>
              <div className="lift-readout-badge">
                <span className="lift-label">VERTICAL CLEARANCE:</span>
                <span className="lift-value font-mono">{targetGateOpening.toFixed(2)} m</span>
              </div>
            </div>

            <div className="cutaway-visual-wrap">
              <svg viewBox="0 0 600 220" className="gate-cutaway-svg" preserveAspectRatio="xMidYMid meet">
                <defs>
                  {/* Water Gradient */}
                  <linearGradient id="reservoirGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#0284c7" stopOpacity="0.85" />
                    <stop offset="100%" stopColor="#0369a1" stopOpacity="0.95" />
                  </linearGradient>

                  {/* Jet Flow Gradient */}
                  <linearGradient id="jetGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#38bdf8" />
                    <stop offset="60%" stopColor="#0284c7" />
                    <stop offset="100%" stopColor="#0369a1" stopOpacity="0.7" />
                  </linearGradient>

                  {/* Concrete Spillway Gradient */}
                  <linearGradient id="concreteGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#64748b" />
                    <stop offset="100%" stopColor="#475569" />
                  </linearGradient>

                  {/* Steel Gate Leaf Gradient */}
                  <linearGradient id="steelGateGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#e2e8f0" />
                    <stop offset="50%" stopColor="#94a3b8" />
                    <stop offset="100%" stopColor="#475569" />
                  </linearGradient>
                </defs>

                {/* Grid & Reference Lines */}
                <line x1="0" y1="160" x2="600" y2="160" stroke="#e2e8f0" strokeDasharray="4 4" />
                <text x="10" y="155" fill="#94a3b8" fontSize="10" fontFamily="monospace">CREST WEIR LEVEL ({currentDam.specs.crestLevelM || 180.0} m MSL)</text>

                {/* Upstream Reservoir Water Mass */}
                <path d="M 0 50 Q 75 48, 150 50 L 150 160 L 0 160 Z" fill="url(#reservoirGrad)" />
                {/* Water surface wave line */}
                <path d="M 0 50 Q 35 46, 75 50 T 150 50" fill="none" stroke="#7dd3fc" strokeWidth="2.5" />
                <text x="15" y="42" fill="#0284c7" fontSize="11" fontWeight="bold">UPSTREAM RESERVOIR</text>
                <text x="15" y="70" fill="#ffffff" fontSize="12" fontWeight="bold" fontFamily="monospace">
                  WL: {currentDam.currentStatus.waterLevelM} m
                </text>

                {/* Concrete Dam Weir & Ogee Glacis */}
                <path d="M 0 160 L 150 160 Q 220 160, 260 175 Q 360 215, 600 215 L 600 220 L 0 220 Z" fill="url(#concreteGrad)" />

                {/* Dynamic Water Jet Under Gate (Thickness directly scales with targetGateOpening) */}
                {(() => {
                  const jetThickness = Math.max(6, Math.round((targetGateOpening / 6.0) * 44));
                  const jetLipY = 160 - jetThickness;
                  return (
                    <g>
                      <path 
                        d={`M 150 160 L 150 ${jetLipY} Q 230 ${jetLipY + 4}, 280 ${jetLipY + 18} Q 380 ${190 - jetThickness * 0.4}, 600 ${205 - jetThickness * 0.2} L 600 215 Q 360 215, 260 175 Q 220 160, 150 160 Z`}
                        fill="url(#jetGrad)"
                        opacity="0.9"
                      />
                      {/* Turbulent Froth & White Water Spray */}
                      <path 
                        d={`M 260 ${jetLipY + 12} Q 360 ${185 - jetThickness * 0.3}, 600 ${200 - jetThickness * 0.2}`}
                        fill="none" 
                        stroke="#ffffff" 
                        strokeWidth="2.5" 
                        strokeDasharray="6 4"
                      />
                      <path 
                        d={`M 290 ${jetLipY + 18} Q 400 ${195 - jetThickness * 0.2}, 600 205`}
                        fill="none" 
                        stroke="#bae6fd" 
                        strokeWidth="2" 
                        strokeDasharray="4 6"
                      />
                    </g>
                  );
                })()}

                {/* Steel Radial Gate Leaf & Strut Arm (Lifts up dynamically with targetGateOpening) */}
                {(() => {
                  const liftPx = Math.round((targetGateOpening / 6.0) * 48);
                  const gateBottomY = 160 - liftPx;
                  const trunnionX = 320;
                  const trunnionY = 100;
                  const gateLipX = 180;
                  
                  return (
                    <g className="gate-mechanical-assembly">
                      {/* Trunnion Pin Pivot (Fixed Anchor on Pier) */}
                      <circle cx={trunnionX} cy={trunnionY} r="7" fill="#334155" stroke="#94a3b8" strokeWidth="2" />
                      <circle cx={trunnionX} cy={trunnionY} r="3" fill="#38bdf8" />
                      <text x={trunnionX - 25} y={trunnionY - 12} fill="#64748b" fontSize="9" fontWeight="bold">TRUNNION PIN</text>

                      {/* Structural Radial Strut Arms */}
                      <line x1={trunnionX} y1={trunnionY} x2={gateLipX} y2={gateBottomY - 15} stroke="#334155" strokeWidth="4" />
                      <line x1={trunnionX} y1={trunnionY} x2={gateLipX - 5} y2={gateBottomY + 5} stroke="#475569" strokeWidth="5" />
                      {/* Cross stiffener */}
                      <line x1={gateLipX + 40} y1={gateBottomY - 5} x2={gateLipX + 40} y2={gateBottomY + 15} stroke="#64748b" strokeWidth="2.5" />

                      {/* Curved Radial Gate Leaf Plate */}
                      <path 
                        d={`M ${gateLipX - 10} ${gateBottomY - 45} Q ${gateLipX} ${gateBottomY - 20}, ${gateLipX - 5} ${gateBottomY} L ${gateLipX + 8} ${gateBottomY} Q ${gateLipX + 12} ${gateBottomY - 20}, ${gateLipX + 3} ${gateBottomY - 45} Z`}
                        fill="url(#steelGateGrad)"
                        stroke="#1e293b"
                        strokeWidth="1.5"
                      />

                      {/* Seal rubber bottom lip */}
                      <rect x={gateLipX - 7} y={gateBottomY - 2} width="16" height="4" rx="1" fill="#dc2626" />

                      {/* Hydraulic Hoist Cable */}
                      <line x1={gateLipX - 5} y1={gateBottomY - 45} x2={gateLipX - 5} y2="15" stroke="#94a3b8" strokeWidth="2" strokeDasharray="2 2" />
                      <rect x={gateLipX - 12} y="10" width="14" height="10" rx="2" fill="#0284c7" />
                      <text x={gateLipX + 8} y="20" fill="#0284c7" fontSize="9" fontWeight="bold">HOIST CYLINDER</text>

                      {/* Dimension Measurement Callout (The Vertical Opening Height) */}
                      <line x1="140" y1="160" x2="140" y2={gateBottomY} stroke="#dc2626" strokeWidth="2" />
                      <line x1="134" y1="160" x2="146" y2="160" stroke="#dc2626" strokeWidth="2" />
                      <line x1="134" y1={gateBottomY} x2="146" y2={gateBottomY} stroke="#dc2626" strokeWidth="2" />
                      
                      {/* Dynamic Dimension Callout Box */}
                      <rect x="35" y={Math.min(145, Math.max(70, (160 + gateBottomY)/2 - 12))} width="96" height="24" rx="4" fill="#ffffff" stroke="#dc2626" strokeWidth="1.5" />
                      <text 
                        x="83" 
                        y={Math.min(145, Math.max(70, (160 + gateBottomY)/2 + 4))} 
                        textAnchor="middle" 
                        fill="#dc2626" 
                        fontSize="11" 
                        fontWeight="bold" 
                        fontFamily="monospace"
                      >
                        ↕ {targetGateOpening.toFixed(1)}m LIFT
                      </text>
                    </g>
                  );
                })()}

                {/* Velocity & Discharge Formula Output */}
                <text x="360" y="160" fill="#0369a1" fontSize="10" fontWeight="bold">
                  HIGH-VELOCITY SUPERCRITICAL GLACIS FLOW
                </text>
                <text x="360" y="174" fill="#475569" fontSize="10" fontFamily="monospace">
                  v ≈ {(Math.sqrt(2 * 9.81 * Math.max(2, currentDam.currentStatus.waterLevelM - (currentDam.specs.crestLevelM || 180)))).toFixed(1)} m/s | Q_bay ≈ {Math.round(targetGateOpening * 128)} m³/s
                </text>
              </svg>
            </div>

            {/* Quick Preset Buttons */}
            <div className="gate-presets-row">
              <span className="preset-row-label">GATE LIFT PRESETS:</span>
              <div className="preset-buttons-group">
                {[
                  { label: '0.5m Minimal', val: 0.5 },
                  { label: '1.5m Regulated', val: 1.5 },
                  { label: '3.0m Moderate', val: 3.0 },
                  { label: '4.5m Flood Release', val: 4.5 },
                  { label: '6.0m Maximum Lift', val: 6.0 }
                ].map((p) => (
                  <button
                    key={p.val}
                    type="button"
                    onClick={() => setTargetGateOpening(p.val)}
                    className={`gate-quick-btn ${Math.abs(targetGateOpening - p.val) < 0.05 ? 'active' : ''}`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Gate Grid Representation with Dynamic Opening Height */}
          <div className="gate-rack-visual">
            <div className="gate-rack-header">
              <span className="text-xs text-dim">
                SPILLWAY CREST GATES (TOTAL {totalGates} BAYS) — HEIGHT: <strong className="text-emerald">{targetGateOpening.toFixed(1)}m</strong>
              </span>
              <span className="text-xs font-mono text-cyan">
                {openGatesCount} / {totalGates} GATES DISCHARGING
              </span>
            </div>

            <div className="gate-slots-grid">
              {Array.from({ length: totalGates }).map((_, idx) => {
                const isOpen = idx < openGatesCount;
                // Height percentage based on targetGateOpening (0.5m to 6.0m)
                const openingHeightPercent = Math.min(100, Math.max(14, Math.round((targetGateOpening / 6.0) * 100)));

                return (
                  <button 
                    key={idx}
                    onClick={() => setOpenGatesCount(idx + 1)}
                    className={`gate-slot-cell ${isOpen ? 'open' : 'closed'}`}
                    title={`Gate Bay #${idx + 1}: ${isOpen ? `OPEN (${targetGateOpening.toFixed(1)}m vertical lift)` : 'CLOSED'}`}
                  >
                    <span className="gate-number">{idx + 1}</span>
                    
                    {isOpen ? (
                      <>
                        {/* Steel gate leaf plate raised above the opening */}
                        <div 
                          className="gate-leaf-plate" 
                          style={{ 
                            bottom: `${openingHeightPercent}%`,
                            height: `${Math.max(6, 100 - openingHeightPercent)}%` 
                          }}
                        >
                          <span className="gate-leaf-indicator"></span>
                        </div>
                        {/* Dynamic water flow discharge height */}
                        <div 
                          className="gate-water-flow-dynamic"
                          style={{ height: `${openingHeightPercent}%` }}
                        ></div>
                      </>
                    ) : (
                      <div className="gate-closed-leaf"></div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Interactive Gate Sliders */}
          <div className="gate-slider-controls mt-4">
            <div className="form-group">
              <div className="flex-between mb-1">
                <label className="form-label">Number of Active Discharge Gates</label>
                <span className="text-sm font-mono text-cyan font-bold">{openGatesCount} Gates</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max={totalGates} 
                value={openGatesCount}
                onChange={(e) => setOpenGatesCount(parseInt(e.target.value))}
                className="tactical-slider w-full"
              />
            </div>

            <div className="form-group">
              <div className="flex-between mb-1">
                <label className="form-label">Gate Opening Height (Clearance Under Leaf)</label>
                <span className="text-sm font-mono text-emerald font-bold">{targetGateOpening.toFixed(1)} meters</span>
              </div>
              <input 
                type="range" 
                min="0.5" 
                max="6.0" 
                step="0.1"
                value={targetGateOpening}
                onChange={(e) => setTargetGateOpening(parseFloat(e.target.value))}
                className="tactical-slider w-full"
              />
            </div>

            <div className="calculated-discharge-banner">
              <span className="text-xs text-dim uppercase font-bold">Simulated Outflow Output:</span>
              <div className="flex-between mt-1">
                <span className="font-mono text-lg font-bold text-white">
                  {Math.round(openGatesCount * targetGateOpening * 128).toLocaleString()} m³/s
                </span>
                <span className="text-xs text-amber font-mono">
                  ~{Math.round(openGatesCount * targetGateOpening * 128 * 35.3147).toLocaleString()} cusecs
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Hydrograph & CWC Rule Curve Compliance */}
        <div className="glass-panel p-5">
          <div className="panel-title-bar">
            <div className="flex-align-gap">
              <TrendingUp className="text-cyan" size={18} />
              <h2 className="panel-h2">Inflow Hydrograph & Rule Curve Compliance</h2>
            </div>
            <span className="badge badge-cyan">24-Hr Hydrograph</span>
          </div>

          {/* Telemetry Hydrograph Chart Preview */}
          <div className="chart-container">
            <div className="chart-legend">
              <div className="chart-legend-item">
                <span className="legend-line" style={{ background: '#f59e0b' }}></span>
                <span>Inflow (m³/s)</span>
              </div>
              <div className="chart-legend-item">
                <span className="legend-line" style={{ background: '#10b981' }}></span>
                <span>Outflow (m³/s)</span>
              </div>
              <div className="chart-legend-item">
                <span className="legend-line" style={{ background: '#38bdf8' }}></span>
                <span>Water Level (m)</span>
              </div>
            </div>

            {/* Custom SVG Responsive Hydrograph */}
            <div className="svg-chart-wrapper">
              <svg viewBox="0 0 500 180" className="hydrograph-svg">
                {/* Grid Lines */}
                <line x1="40" y1="20" x2="480" y2="20" stroke="rgba(255,255,255,0.06)" />
                <line x1="40" y1="60" x2="480" y2="60" stroke="rgba(255,255,255,0.06)" />
                <line x1="40" y1="100" x2="480" y2="100" stroke="rgba(255,255,255,0.06)" />
                <line x1="40" y1="140" x2="480" y2="140" stroke="rgba(255,255,255,0.06)" />

                {/* Inflow Area & Line (Amber) */}
                <path 
                  d="M 50 130 L 150 100 L 250 70 L 350 40 L 450 48 L 450 150 L 50 150 Z" 
                  fill="rgba(245, 158, 11, 0.12)" 
                />
                <polyline 
                  points="50,130 150,100 250,70 350,40 450,48" 
                  fill="none" 
                  stroke="#f59e0b" 
                  strokeWidth="3" 
                />

                {/* Outflow Line (Emerald) */}
                <polyline 
                  points="50,140 150,120 250,90 350,60 450,55" 
                  fill="none" 
                  stroke="#10b981" 
                  strokeWidth="2.5" 
                  strokeDasharray="4, 3" 
                />

                {/* Reservoir Level Line (Cyan) */}
                <polyline 
                  points="50,95 150,85 250,75 350,65 450,58" 
                  fill="none" 
                  stroke="#38bdf8" 
                  strokeWidth="2" 
                />

                {/* Time Axis Labels */}
                <text x="50" y="168" fill="#64748b" fontSize="10">00:00</text>
                <text x="150" y="168" fill="#64748b" fontSize="10">06:00</text>
                <text x="250" y="168" fill="#64748b" fontSize="10">12:00</text>
                <text x="350" y="168" fill="#64748b" fontSize="10">18:00</text>
                <text x="450" y="168" fill="#64748b" fontSize="10">Now</text>
              </svg>
            </div>
          </div>

          {/* CWC Rule Curve Table */}
          <div className="rule-curve-section mt-4">
            <div className="flex-between mb-2">
              <span className="text-xs font-bold text-dim uppercase">Official CWC Monsoon Rule Curve Table</span>
              <span className="badge badge-amber text-xs">{currentDam.currentStatus.ruleCurveStatus}</span>
            </div>

            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Month</th>
                    <th>Guide Rule Level (m)</th>
                    <th>Current Level (m)</th>
                    <th>Deviation</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {currentDam.reservoirRuleCurve.map((rc, idx) => {
                    const diff = (rc.actualLevel - rc.ruleLevel).toFixed(2);
                    const isExceeding = diff > 0;
                    return (
                      <tr key={idx}>
                        <td><strong>{rc.month}</strong></td>
                        <td className="font-mono text-muted">{rc.ruleLevel.toFixed(2)} m</td>
                        <td className="font-mono text-white">{rc.actualLevel.toFixed(2)} m</td>
                        <td className={`font-mono font-bold ${isExceeding ? 'text-amber' : 'text-emerald'}`}>
                          {diff > 0 ? `+${diff}` : diff} m
                        </td>
                        <td>
                          {isExceeding ? (
                            <span className="badge badge-amber text-xs">Spillway Required</span>
                          ) : (
                            <span className="badge badge-emerald text-xs">Compliant</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>

      <style>{`
        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
          margin-bottom: 24px;
        }

        @media (max-width: 1200px) {
          .metrics-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 640px) {
          .metrics-grid {
            grid-template-columns: 1fr;
          }
        }

        .metric-card {
          padding: 20px 22px;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
        }

        .metric-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
        }

        .metric-title {
          font-size: 0.75rem;
          font-weight: 700;
          color: #64748b;
          letter-spacing: 0.05em;
        }

        .metric-main-value {
          display: flex;
          align-items: baseline;
          gap: 6px;
          margin-bottom: 10px;
        }

        .val-text {
          font-family: var(--font-sans);
          font-size: 2.1rem;
          font-weight: 800;
          line-height: 1;
        }

        .val-unit {
          font-size: 0.85rem;
          color: #64748b;
          font-weight: 600;
        }

        .metric-sub-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.775rem;
          color: #64748b;
          border-top: 1px solid #f1f5f9;
          padding-top: 10px;
          margin-top: 6px;
        }

        .progress-container {
          width: 100%;
          height: 7px;
          background: #e2e8f0;
          border-radius: 999px;
          overflow: hidden;
          margin-bottom: 10px;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #0284c7 0%, #38bdf8 100%);
          border-radius: 999px;
        }

        /* Gate Elevation Cutaway Styles */
        .gate-elevation-cutaway {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 18px 20px;
          margin-bottom: 20px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
        }

        .cutaway-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
          padding-bottom: 8px;
          border-bottom: 1px solid #f1f5f9;
        }

        .cutaway-title {
          font-size: 0.775rem;
          font-weight: 700;
          color: #334155;
          letter-spacing: 0.04em;
        }

        .lift-readout-badge {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #fee2e2;
          border: 1px solid #fca5a5;
          padding: 4px 10px;
          border-radius: 6px;
        }

        .lift-label {
          font-size: 0.7rem;
          font-weight: 700;
          color: #b91c1c;
        }

        .lift-value {
          font-size: 0.9rem;
          font-weight: 800;
          color: #dc2626;
        }

        .cutaway-visual-wrap {
          width: 100%;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          overflow: hidden;
          padding: 8px;
        }

        .gate-cutaway-svg {
          width: 100%;
          height: 200px;
          display: block;
        }

        .gate-presets-row {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-top: 14px;
          flex-wrap: wrap;
        }

        .preset-row-label {
          font-size: 0.725rem;
          font-weight: 700;
          color: #64748b;
          text-transform: uppercase;
        }

        .preset-buttons-group {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .gate-quick-btn {
          background: #f8fafc;
          border: 1px solid #cbd5e1;
          padding: 5px 12px;
          border-radius: 6px;
          font-size: 0.775rem;
          font-weight: 600;
          color: #334155;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .gate-quick-btn:hover {
          background: #f0f9ff;
          border-color: #0284c7;
          color: #0284c7;
        }

        .gate-quick-btn.active {
          background: #0284c7;
          border-color: #0284c7;
          color: #ffffff;
        }

        /* Gate Rack & Dynamic Slot Cells */
        .gate-rack-visual {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: var(--radius-md);
          padding: 16px;
        }

        .gate-rack-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 14px;
          font-weight: 700;
          color: #0f172a;
        }

        .gate-slots-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(34px, 1fr));
          gap: 8px;
          max-height: 240px;
          overflow-y: auto;
          padding-right: 4px;
        }

        .gate-slot-cell {
          height: 52px;
          background: #ffffff;
          border: 1px solid #cbd5e1;
          border-radius: 6px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-between;
          padding: 4px 2px;
          cursor: pointer;
          transition: all 0.15s ease;
          position: relative;
          overflow: hidden;
        }

        .gate-slot-cell:hover {
          border-color: #0284c7;
          box-shadow: 0 2px 6px rgba(2, 132, 199, 0.2);
        }

        .gate-slot-cell.open {
          border-color: #0284c7;
          background: #f0f9ff;
        }

        .gate-leaf-plate {
          position: absolute;
          left: 0;
          right: 0;
          background: linear-gradient(180deg, #64748b 0%, #475569 100%);
          border-bottom: 2px solid #dc2626;
          transition: bottom 0.2s cubic-bezier(0.16, 1, 0.3, 1), height 0.2s ease;
          z-index: 2;
        }

        .gate-leaf-indicator {
          display: block;
          width: 100%;
          height: 2px;
          background: #ef4444;
        }

        .gate-water-flow-dynamic {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: linear-gradient(180deg, #38bdf8 0%, #0284c7 100%);
          border-radius: 0 0 4px 4px;
          animation: flowPulse 1.2s infinite;
          transition: height 0.2s cubic-bezier(0.16, 1, 0.3, 1);
          z-index: 1;
        }

        .gate-closed-leaf {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, #e2e8f0 0%, #cbd5e1 100%);
          border-bottom: 3px solid #94a3b8;
          z-index: 1;
        }

        .gate-number {
          font-size: 0.65rem;
          font-family: var(--font-mono);
          color: #0f172a;
          font-weight: 800;
          z-index: 3;
        }

        @keyframes flowPulse {
          0% { opacity: 0.75; }
          50% { opacity: 1; }
          100% { opacity: 0.75; }
        }

        .calculated-discharge-banner {
          background: #f0f9ff;
          border: 1px solid #bae6fd;
          border-radius: var(--radius-sm);
          padding: 12px 16px;
          margin-top: 14px;
        }

        .chart-legend {
          display: flex;
          gap: 16px;
          margin-bottom: 12px;
          font-size: 0.75rem;
          color: #64748b;
        }

        .chart-legend-item {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .legend-line {
          width: 16px;
          height: 3px;
          border-radius: 2px;
        }

        .svg-chart-wrapper {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: var(--radius-sm);
          padding: 12px;
        }

        .hydrograph-svg {
          width: 100%;
          height: 180px;
        }
      `}</style>
    </div>
  );
}
