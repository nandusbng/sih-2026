import React, { useState } from 'react';
import { 
  AlertOctagon, 
  Users, 
  Home, 
  Car, 
  Sprout, 
  Building2, 
  Clock, 
  ArrowRight,
  ShieldAlert,
  AlertTriangle,
  Hospital,
  Zap,
  TrendingDown
} from 'lucide-react';
import { LOSS_ESTIMATION_DATA } from '../../data/mockData';

export default function ImpactAnalysisPortal({ 
  selectedDamId, 
  damsData, 
  setActivePortal 
}) {
  const currentDam = damsData[selectedDamId];
  const lossData = LOSS_ESTIMATION_DATA[selectedDamId] || LOSS_ESTIMATION_DATA.hirakud;

  const [selectedSettlement, setSelectedSettlement] = useState(null);

  return (
    <div className="portal-page-container">
      {/* Header */}
      <div className="portal-header-row">
        <div>
          <div className="badge badge-amber mb-2">
            <AlertOctagon size={12} />
            <span>PORTAL 6: SCREENING-LEVEL LOSS & DAMAGE ESTIMATION</span>
          </div>
          <h1 className="portal-title">Downstream Exposure & Impact Assessment</h1>
          <p className="portal-subtitle">
            Automated spatial intersection of simulated flood extents with census demographics, building footprints, transport corridors, and critical lifeline infrastructure.
          </p>
        </div>

        <button 
          className="btn btn-primary"
          onClick={() => setActivePortal('hadr_priority')}
        >
          <span>Open HADR Action Priorities</span>
          <ArrowRight size={16} />
        </button>
      </div>

      {/* 4 Big Impact Category Cards */}
      <div className="impact-kpi-grid">
        {/* Population Exposed */}
        <div className="glass-panel p-5 kpi-card">
          <div className="flex-between">
            <span className="text-dim text-xs font-bold uppercase">Population at Risk (PAR)</span>
            <Users size={18} className="text-red" />
          </div>
          <div className="kpi-main-val text-red">
            {lossData.populationExposedTotal.toLocaleString()}
          </div>
          <div className="kpi-sub-stats">
            <div>
              <span className="text-xs text-dim">Immediate Risk (&gt;2m depth):</span>
              <strong className="text-white text-xs block font-mono">{lossData.populationAtImmediateRisk.toLocaleString()}</strong>
            </div>
            <div>
              <span className="text-xs text-dim">Elderly & Children:</span>
              <strong className="text-amber text-xs block font-mono">
                {(lossData.vulnerableDemographics.infantsAndChildren + lossData.vulnerableDemographics.elderlyOver65).toLocaleString()}
              </strong>
            </div>
          </div>
        </div>

        {/* Buildings Submerged */}
        <div className="glass-panel p-5 kpi-card">
          <div className="flex-between">
            <span className="text-dim text-xs font-bold uppercase">Inundated Buildings</span>
            <Home size={18} className="text-amber" />
          </div>
          <div className="kpi-main-val text-amber">
            {(lossData.buildingsInundated.residential + lossData.buildingsInundated.commercial).toLocaleString()}
          </div>
          <div className="kpi-sub-stats">
            <div>
              <span className="text-xs text-dim">Residential Units:</span>
              <strong className="text-white text-xs block font-mono">{lossData.buildingsInundated.residential.toLocaleString()}</strong>
            </div>
            <div>
              <span className="text-xs text-dim">Severe Structural Damage:</span>
              <strong className="text-red text-xs block font-mono">{lossData.buildingsInundated.severeStructuralDamageCount.toLocaleString()}</strong>
            </div>
          </div>
        </div>

        {/* Transport Corridors Severed */}
        <div className="glass-panel p-5 kpi-card">
          <div className="flex-between">
            <span className="text-dim text-xs font-bold uppercase">Roads & Transport Severed</span>
            <Car size={18} className="text-cyan" />
          </div>
          <div className="kpi-main-val text-cyan">
            {Math.round(lossData.roadsAndTransport.nationalHighwaysKm + lossData.roadsAndTransport.stateHighwaysKm + lossData.roadsAndTransport.districtAndRuralRoadsKm)} km
          </div>
          <div className="kpi-sub-stats">
            <div>
              <span className="text-xs text-dim">National / State Highways:</span>
              <strong className="text-white text-xs block font-mono">{lossData.roadsAndTransport.nationalHighwaysKm + lossData.roadsAndTransport.stateHighwaysKm} km</strong>
            </div>
            <div>
              <span className="text-xs text-dim">Submerged Bridges:</span>
              <strong className="text-red text-xs block font-mono">{lossData.roadsAndTransport.bridgesSubmergedOrStressed} Key Bridges</strong>
            </div>
          </div>
        </div>

        {/* Agricultural Cropland & Economy */}
        <div className="glass-panel p-5 kpi-card">
          <div className="flex-between">
            <span className="text-dim text-xs font-bold uppercase">Agricultural & Economic Loss</span>
            <Sprout size={18} className="text-emerald" />
          </div>
          <div className="kpi-main-val text-emerald">
            ₹{lossData.agricultureAndLivelihood.estimatedCropLossCroresINR} Cr
          </div>
          <div className="kpi-sub-stats">
            <div>
              <span className="text-xs text-dim">Submerged Cropland:</span>
              <strong className="text-white text-xs block font-mono">{lossData.agricultureAndLivelihood.paddyAndCroplandHectares.toLocaleString()} Hectares</strong>
            </div>
            <div>
              <span className="text-xs text-dim">Livestock at Risk:</span>
              <strong className="text-white text-xs block font-mono">{lossData.agricultureAndLivelihood.livestockAtRisk.toLocaleString()} heads</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Main Two Columns: Downstream Settlements Timeline + Critical Lifelines */}
      <div className="content-two-columns mt-4">
        
        {/* Left Column: Settlement Flood Arrival & Inundation Timeline */}
        <div className="glass-panel p-5">
          <div className="panel-title-bar">
            <div className="flex-align-gap">
              <Clock className="text-cyan" size={18} />
              <h2 className="panel-h2">Flood Wave Timeline & Settlement Impacts</h2>
            </div>
            <span className="badge badge-red">Isochrone Tracking</span>
          </div>

          <p className="text-xs text-muted mb-3">
            Chronological progression of the flood wavefront reaching downstream population centers. Click any village to review local shelter allocation.
          </p>

          <div className="timeline-settlements-list">
            {currentDam.settlements.map((v) => (
              <div 
                key={v.id}
                onClick={() => setSelectedSettlement(v)}
                className={`settlement-timeline-item ${selectedSettlement?.id === v.id ? 'active' : ''}`}
              >
                <div className="timeline-badge-col">
                  <span className="time-pill">T + {v.arrivalTimeHr}h</span>
                  <div className="time-line-vert"></div>
                </div>

                <div className="settlement-info-col">
                  <div className="flex-between">
                    <strong className="text-white text-sm">{v.name}</strong>
                    <span className={`badge ${v.priority === 'CRITICAL' ? 'badge-red' : v.priority === 'HIGH' ? 'badge-amber' : 'badge-cyan'}`}>
                      {v.priority} PRIORITY
                    </span>
                  </div>

                  <div className="settlement-metrics-line mt-1">
                    <span>Dist: <b>{v.distanceKm} km</b></span>
                    <span>Peak Depth: <b className="text-cyan">{v.maxDepthM} m</b></span>
                    <span>Velocity: <b>{v.velocityMs} m/s</b></span>
                    <span>Pop: <b>{v.pop.toLocaleString()}</b></span>
                  </div>

                  <div className="settlement-status-tag mt-2">
                    <span className="text-xs text-dim">Status:</span>
                    <span className="text-xs text-amber font-semibold ml-1">{v.status}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Critical Lifeline Infrastructure at Risk */}
        <div className="glass-panel p-5">
          <div className="panel-title-bar">
            <div className="flex-align-gap">
              <Hospital className="text-red" size={18} />
              <h2 className="panel-h2">Critical Lifeline Infrastructure at Risk</h2>
            </div>
            <span className="badge badge-amber">Immediate Action Required</span>
          </div>

          <div className="critical-facilities-list">
            {lossData.criticalFacilitiesExposed.map((facility, idx) => (
              <div key={idx} className="facility-risk-card">
                <div className="flex-between mb-1">
                  <strong className="text-white text-sm">{facility.name}</strong>
                  <span className="badge badge-red text-xs">HAZARD LEVEL 3</span>
                </div>
                <div className="facility-status-row">
                  <span className="text-dim text-xs">Inundation Hazard:</span>
                  <span className="text-amber font-mono text-xs font-bold">{facility.status}</span>
                </div>
                <div className="facility-action-box mt-2">
                  <span className="text-xs font-bold text-cyan uppercase">Mitigation Action:</span>
                  <p className="text-xs text-white mt-1">{facility.action}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Shelters & Safe Havens Status */}
          <div className="safe-shelters-box mt-4">
            <h3 className="text-xs font-bold text-dim uppercase mb-2">Designated Safe High-Ground Flood Shelters</h3>
            <div className="shelters-mini-grid">
              {currentDam.criticalAssets.filter(a => a.type === 'Shelter').map((s) => (
                <div key={s.id} className="shelter-chip">
                  <div className="flex-between">
                    <strong className="text-emerald text-xs">{s.name}</strong>
                    <span className="badge badge-emerald text-xs">SAFE</span>
                  </div>
                  <div className="flex-between text-xs text-dim mt-1">
                    <span>Capacity: {s.capacity}</span>
                    <span className="text-white font-mono">Available: {s.available}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      <style>{`
        .impact-kpi-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
          margin-bottom: 24px;
        }

        @media (max-width: 1200px) {
          .impact-kpi-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 640px) {
          .impact-kpi-grid {
            grid-template-columns: 1fr;
          }
        }

        .kpi-card {
          display: flex;
          flex-direction: column;
          padding: 22px;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
        }

        .kpi-main-val {
          font-family: var(--font-sans);
          font-size: 2.2rem;
          font-weight: 800;
          line-height: 1.1;
          margin: 8px 0;
          letter-spacing: -0.02em;
        }

        .kpi-sub-stats {
          display: flex;
          justify-content: space-between;
          border-top: 1px solid #f1f5f9;
          padding-top: 10px;
          margin-top: auto;
          font-size: 0.8rem;
          color: #64748b;
        }

        .timeline-settlements-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
          max-height: 520px;
          overflow-y: auto;
          padding-right: 6px;
        }

        .settlement-timeline-item {
          display: flex;
          gap: 14px;
          padding: 14px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .settlement-timeline-item:hover, .settlement-timeline-item.active {
          border-color: #0284c7;
          background: #f0f9ff;
        }

        .timeline-badge-col {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .time-pill {
          background: #0284c7;
          color: #ffffff !important;
          font-size: 0.725rem;
          font-weight: 700;
          font-family: var(--font-mono);
          padding: 4px 8px;
          border-radius: 6px;
          white-space: nowrap;
        }

        .time-line-vert {
          width: 2px;
          flex: 1;
          background: #cbd5e1;
          margin-top: 8px;
        }

        .settlement-info-col {
          flex: 1;
        }

        .settlement-metrics-line {
          display: flex;
          gap: 14px;
          font-size: 0.8rem;
          color: #64748b;
        }

        .critical-facilities-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .facility-risk-card {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-left: 4px solid #ef4444;
          border-radius: 8px;
          padding: 14px 16px;
          transition: all 0.15s;
        }

        .facility-risk-card:hover {
          background: #ffffff;
          border-color: #cbd5e1;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        }

        .facility-status-row {
          display: flex;
          justify-content: space-between;
          font-size: 0.775rem;
        }

        .facility-action-box {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          padding: 10px 12px;
          border-radius: 6px;
          margin-top: 8px;
        }

        .safe-shelters-box {
          border-top: 1px solid #e2e8f0;
          padding-top: 18px;
        }

        .shelters-mini-grid {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .shelter-chip {
          background: #f0fdf4;
          border: 1px solid #bbf7d0;
          padding: 10px 12px;
          border-radius: 8px;
        }
      `}</style>
    </div>
  );
}
