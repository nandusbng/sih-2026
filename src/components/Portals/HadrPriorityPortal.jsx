import React, { useState } from 'react';
import { 
  LifeBuoy, 
  ShieldAlert, 
  Navigation, 
  Ship, 
  Users, 
  MapPin, 
  CheckCircle, 
  ArrowRight, 
  Package, 
  Activity, 
  PhoneCall,
  Send,
  Sparkles
} from 'lucide-react';
import { HADR_ACTIONS_DATA } from '../../data/mockData';

export default function HadrPriorityPortal({ 
  selectedDamId, 
  damsData, 
  setActivePortal 
}) {
  const currentDam = damsData[selectedDamId] || damsData.khadakwasla;
  const hadrData = HADR_ACTIONS_DATA[selectedDamId] || HADR_ACTIONS_DATA.hirakud;

  const [dispatchedAlert, setDispatchedAlert] = useState(null);

  const handleDispatchNDRF = (villageName) => {
    setDispatchedAlert(`NDRF & SDRF Rescue Units dispatched to ${villageName}! Air-drop staging initiated.`);
    setTimeout(() => {
      setDispatchedAlert(null);
    }, 4500);
  };

  return (
    <div className="portal-page-container">
      {/* Portal Header */}
      <div className="portal-header-row">
        <div>
          <div className="badge badge-red mb-2">
            <LifeBuoy size={13} />
            <span>PORTAL 7: HADR ACTION-PRIORITY & RESCUE DECISION ENGINE</span>
          </div>
          <h1 className="portal-title">Humanitarian Assistance &amp; Disaster Relief Dispatch</h1>
          <p className="portal-subtitle">
            Algorithmic priority ranking for downstream settlements, cut-off community identification, flood-free evacuation routing, and emergency logistical deployment.
          </p>
        </div>

        <div className="flex-align-gap">
          <button 
            className="btn btn-primary"
            onClick={() => setActivePortal('citizen_warning')}
          >
            <span>Preview Citizen Warnings</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>

      {dispatchedAlert && (
        <div className="dispatch-toast-alert">
          <Sparkles size={20} />
          <span>{dispatchedAlert}</span>
        </div>
      )}

      {/* Top Resource Mobilization Manifest Cards (Spacious, Uncongested) */}
      <div className="hadr-stats-grid">
        <div className="hadr-kpi-card">
          <div className="flex-between">
            <span className="kpi-label">NDRF / SDRF Battalions</span>
            <div className="kpi-icon-wrap bg-red-subtle">
              <ShieldAlert size={20} className="text-red" />
            </div>
          </div>
          <div className="hadr-val text-red">
            {hadrData.resourceMobilization.ndrfBattalionsDeployed + hadrData.resourceMobilization.sdrfCompanies} Units
          </div>
          <span className="kpi-subtext">
            {hadrData.resourceMobilization.ndrfBattalionsDeployed} NDRF + {hadrData.resourceMobilization.sdrfCompanies} SDRF pre-positioned
          </span>
        </div>

        <div className="hadr-kpi-card">
          <div className="flex-between">
            <span className="kpi-label">Inflatable Motor Boats (IRBs)</span>
            <div className="kpi-icon-wrap bg-cyan-subtle">
              <Ship size={20} className="text-cyan" />
            </div>
          </div>
          <div className="hadr-val text-cyan">
            {hadrData.resourceMobilization.inflatableMotorBoatsIRBs} Boats
          </div>
          <span className="kpi-subtext">
            With 40HP OBMs &amp; certified rescue operators
          </span>
        </div>

        <div className="hadr-kpi-card">
          <div className="flex-between">
            <span className="kpi-label">Emergency Dry Rations</span>
            <div className="kpi-icon-wrap bg-amber-subtle">
              <Package size={20} className="text-amber" />
            </div>
          </div>
          <div className="hadr-val text-amber">
            {(hadrData.resourceMobilization.emergencyDryRationKits / 1000).toFixed(0)}k Kits
          </div>
          <span className="kpi-subtext">
            72-hr survival rations + water purification packs
          </span>
        </div>

        <div className="hadr-kpi-card">
          <div className="flex-between">
            <span className="kpi-label">Certified Shelter Capacity</span>
            <div className="kpi-icon-wrap bg-emerald-subtle">
              <Users size={20} className="text-emerald" />
            </div>
          </div>
          <div className="hadr-val text-emerald">
            {hadrData.resourceMobilization.temporaryShelterBedCapacity.toLocaleString()} Beds
          </div>
          <span className="kpi-subtext">
            Across verified flood-resilient high-elevation shelters
          </span>
        </div>
      </div>

      {/* Main Two Columns: Priority Village Triage Table + Safe Evacuation Routes */}
      <div className="content-two-columns">
        
        {/* Left Column: Priority Village Triage Ranking */}
        <div className="glass-panel p-5">
          <div className="panel-title-bar">
            <div className="flex-align-gap">
              <ShieldAlert className="text-red" size={20} />
              <h2 className="panel-h2">Priority Village Triage Engine (Ranked by Risk)</h2>
            </div>
            <span className="badge badge-red">Algorithmic Rank</span>
          </div>

          <p className="text-xs text-muted mb-4">
            Ranked based on Lead Time to Wavefront, Maximum Inundation Depth, Cut-off Road Disruption, and Vulnerable Demographics.
          </p>

          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Rank &amp; Settlement</th>
                  <th>Time to Impact</th>
                  <th>Water Depth</th>
                  <th>Cut-Off Status</th>
                  <th>Boats Needed</th>
                  <th>Action Order</th>
                </tr>
              </thead>
              <tbody>
                {hadrData.priorityVillagesTriage.map((v) => (
                  <tr key={v.rank}>
                    <td>
                      <div className="settlement-cell">
                        <span className="rank-pill">#{v.rank}</span>
                        <div className="settlement-info">
                          <strong className="settlement-name">{v.name}</strong>
                          <span className="settlement-pop">Pop: {v.pop.toLocaleString()}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="impact-time-chip">{v.timeToImpact}</span>
                    </td>
                    <td>
                      <span className="depth-val">{v.depth}</span>
                    </td>
                    <td>
                      {v.isolated ? (
                        <span className="badge badge-red">ISLAND (CUT OFF)</span>
                      ) : (
                        <span className="badge badge-amber">ROAD ACCESSIBLE</span>
                      )}
                    </td>
                    <td>
                      <div className="boat-req-col">
                        <strong className="boat-count">{v.requiredBoats} Boats</strong>
                        <span className="ndrf-team-sub">({v.ndrfTeams} Teams)</span>
                      </div>
                    </td>
                    <td>
                      <button 
                        className="btn btn-danger btn-sm dispatch-btn"
                        onClick={() => handleDispatchNDRF(v.name)}
                      >
                        <Send size={12} />
                        <span>Dispatch</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Safe Evacuation Routing & Corridor Navigation */}
        <div className="glass-panel p-5">
          <div className="panel-title-bar">
            <div className="flex-align-gap">
              <Navigation className="text-cyan" size={20} />
              <h2 className="panel-h2">Optimized Flood-Free Evacuation Corridors</h2>
            </div>
            <span className="badge badge-emerald">Real-Time Routing</span>
          </div>

          <p className="text-xs text-muted mb-4">
            Automated Dijkstra/A* routing across road elevation network avoiding submerged bridges and hydrodynamic high-velocity channels.
          </p>

          <div className="evacuation-routes-list">
            {hadrData.evacuationRoutes.map((r) => (
              <div key={r.id} className="evacuation-route-card">
                <div className="flex-between mb-2">
                  <div className="flex-align-gap">
                    <Navigation size={15} style={{ color: '#16a34a' }} />
                    <strong className="route-title">{r.from} ➔ {r.to}</strong>
                  </div>
                  <span className="badge badge-emerald">{r.routeLengthKm} km</span>
                </div>

                <div className="flex-between text-xs mt-2 pt-2 border-top-subtle">
                  <span className="text-dim">Status: <b style={{ color: '#16a34a' }}>{r.status}</b></span>
                  <span className="safety-badge font-mono">{r.safetyRating}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Emergency Operations Center Quick Dial */}
          <div className="emergency-hotlines-box mt-4">
            <div className="flex-align-gap mb-3">
              <PhoneCall size={16} className="text-red" />
              <h3 className="hotline-title">EOC Hotline Command &amp; Air Dispatch</h3>
            </div>
            <div className="hotline-grid">
              <div className="hotline-pill">
                <span className="text-dim text-xs">NDRF Control Room:</span>
                <strong className="hotline-number">011-24363260</strong>
              </div>
              <div className="hotline-pill">
                <span className="text-dim text-xs">State SEOC:</span>
                <strong className="hotline-number text-cyan">1070 (Toll Free)</strong>
              </div>
              <div className="hotline-pill">
                <span className="text-dim text-xs">Indian Air Force SAR:</span>
                <strong className="hotline-number text-emerald">Freq: 121.5 MHz</strong>
              </div>
            </div>
          </div>

        </div>

      </div>

      <style>{`
        .dispatch-toast-alert {
          background: linear-gradient(135deg, #10b981 0%, #047857 100%);
          color: #ffffff;
          padding: 14px 20px;
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          gap: 14px;
          font-weight: 700;
          font-size: 0.9rem;
          box-shadow: 0 8px 24px rgba(16, 185, 129, 0.35);
          animation: slideDown 0.3s ease;
        }

        @keyframes slideDown {
          from { transform: translateY(-10px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        .hadr-stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
        }

        @media (max-width: 1200px) {
          .hadr-stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 640px) {
          .hadr-stats-grid {
            grid-template-columns: 1fr;
          }
        }

        .hadr-kpi-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 22px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
          transition: all 0.2s ease;
        }

        .hadr-kpi-card:hover {
          border-color: #cbd5e1;
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.07);
          transform: translateY(-2px);
        }

        .kpi-label {
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          color: #64748b;
        }

        .kpi-icon-wrap {
          width: 36px;
          height: 36px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .bg-red-subtle { background: #fee2e2; }
        .bg-cyan-subtle { background: #e0f2fe; }
        .bg-amber-subtle { background: #fef3c7; }
        .bg-emerald-subtle { background: #dcfce7; }

        .hadr-val {
          font-family: var(--font-sans);
          font-size: 2.1rem;
          font-weight: 800;
          line-height: 1.1;
          letter-spacing: -0.02em;
        }

        .kpi-subtext {
          font-size: 0.8rem;
          color: #64748b;
          line-height: 1.4;
        }

        .settlement-cell {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .rank-pill {
          background: #fee2e2;
          color: #b91c1c;
          font-family: var(--font-mono);
          font-size: 0.8rem;
          font-weight: 800;
          padding: 4px 8px;
          border-radius: 6px;
          border: 1px solid #fca5a5;
          min-width: 32px;
          text-align: center;
        }

        .settlement-info {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .settlement-name {
          color: #0f172a;
          font-size: 0.9rem;
          font-weight: 700;
        }

        .settlement-pop {
          color: #64748b;
          font-size: 0.775rem;
        }

        .impact-time-chip {
          display: inline-block;
          font-family: var(--font-mono);
          font-weight: 700;
          color: #dc2626;
          background: #fef2f2;
          padding: 4px 10px;
          border-radius: 6px;
          font-size: 0.825rem;
          border: 1px solid #fecaca;
        }

        .depth-val {
          font-family: var(--font-mono);
          font-weight: 700;
          color: #0284c7;
          font-size: 0.9rem;
        }

        .boat-req-col {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .boat-count {
          color: #0f172a;
          font-size: 0.875rem;
          font-weight: 700;
        }

        .ndrf-team-sub {
          color: #64748b;
          font-size: 0.75rem;
        }

        .dispatch-btn {
          white-space: nowrap;
        }

        .evacuation-routes-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .evacuation-route-card {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-left: 4px solid #16a34a;
          border-radius: 10px;
          padding: 16px 18px;
          transition: all 0.2s ease;
        }

        .evacuation-route-card:hover {
          background: #ffffff;
          border-color: #cbd5e1;
          border-left-color: #15803d;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        }

        .route-title {
          color: #0f172a;
          font-size: 0.925rem;
          font-weight: 700;
        }

        .border-top-subtle {
          border-top: 1px solid #e2e8f0;
        }

        .safety-badge {
          background: #ffffff;
          border: 1px solid #cbd5e1;
          color: #0f172a;
          padding: 2px 8px;
          border-radius: 4px;
          font-size: 0.75rem;
          font-weight: 700;
        }

        .emergency-hotlines-box {
          border-top: 1px solid #e2e8f0;
          padding-top: 18px;
        }

        .hotline-title {
          font-size: 0.8rem;
          font-weight: 700;
          color: #475569;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }

        .hotline-grid {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .hotline-pill {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          padding: 10px 14px;
          border-radius: 8px;
          transition: all 0.15s;
        }

        .hotline-pill:hover {
          background: #ffffff;
          border-color: #cbd5e1;
        }

        .hotline-number {
          font-family: var(--font-mono);
          font-size: 0.825rem;
          color: #0f172a;
        }
      `}</style>
    </div>
  );
}
