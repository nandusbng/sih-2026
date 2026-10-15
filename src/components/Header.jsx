import React from 'react';
import { 
  ShieldAlert, 
  Layers, 
  Activity, 
  Sliders, 
  Cpu, 
  GitCompare, 
  AlertOctagon, 
  LifeBuoy, 
  Radio, 
  Download, 
  Waves,
  MapPin,
  Clock,
  Sparkles,
  Users,
  LogOut,
  Map
} from 'lucide-react';

import { 
  ROLE_DEFINITIONS, 
  isPortalAllowedForRole, 
  getDefaultPortalForRole 
} from '../data/rolePermissions';

export default function Header({ 
  selectedDamId, 
  setSelectedDamId, 
  activePortal, 
  setActivePortal, 
  damsData,
  currentScenario,
  simulationState,
  userRole,
  setUserRole,
  viewMode,
  setViewMode,
  onLogout
}) {
  const currentDam = damsData[selectedDamId] || damsData.khadakwasla;
  const currentRoleConfig = ROLE_DEFINITIONS[userRole] || ROLE_DEFINITIONS.technical;

  const allPortals = [
    { id: 'data_admin', label: '1. Data Admin & Audit', icon: Layers },
    { id: 'dam_operator', label: '2. Dam Operations', icon: Activity },
    { id: 'scenario_composer', label: '3. Scenario Composer', icon: Sliders },
    { id: 'simulation_engine', label: '4. Delft3D + SPH Engine', icon: Cpu },
    { id: 'model_comparison', label: '5. Satellite & Comparison', icon: GitCompare },
    { id: 'impact_analysis', label: '6. Loss & Damage', icon: AlertOctagon },
    { id: 'hadr_priority', label: '7. HADR Action Priorities', icon: LifeBuoy },
    { id: 'citizen_warning', label: '8. Public Citizen Warning', icon: Radio },
    { id: 'export_reports', label: '9. GIS Export & Reports', icon: Download }
  ];

  // Strictly filter portals to only those authorized for the active user's profile
  const portals = allPortals.filter(portal => isPortalAllowedForRole(portal.id, userRole));

  return (
    <header className="header-container">
      {/* Top National Accent Line */}
      <div className="header-tricolor-line">
        <span className="accent-saffron"></span>
        <span className="accent-white"></span>
        <span className="accent-green"></span>
      </div>

      {/* Main Single Streamlined Top Bar */}
      <div className="top-banner">
        {/* Left: Brand + Hydro Target */}
        <div className="banner-left">
          <div 
            className="logo-badge"
            onClick={onLogout}
            style={{ cursor: 'pointer' }}
            title="Return to Login & Gateway"
          >
            <div className="logo-circle">
              <img src="/lo.png" alt="VARUNASTRA" className="logo-img" />
            </div>
            <div>
              <span className="brand-title">VARUNASTRA</span>
              <span className="brand-subtitle">National Flood Intelligence &amp; Dam-Break System</span>
            </div>
          </div>

          <div className="dam-selector-wrapper">
            <MapPin size={14} className="text-primary" />
            <span className="selector-label">BASIN / DAM:</span>
            <select 
              value={selectedDamId} 
              onChange={(e) => setSelectedDamId(e.target.value)}
              className="dam-select"
            >
              <option value="khadakwasla">🌊 Khadakwasla (Mutha River, Pune)</option>
              <option value="chamoli">🏔️ Chamoli Avalanche (Rishiganga)</option>
              <option value="hirakud">🛡️ Hirakud (Mahanadi River, Odisha)</option>
              <option value="ukai">⚡ Ukai (Tapi River, Gujarat)</option>
            </select>
          </div>
        </div>

        {/* Center: Clean Compact Live Telemetry */}
        <div className="banner-center">
          <div className="telemetry-chip">
            <span className="chip-label">Level:</span>
            <span className="chip-val blue">{currentDam.currentStatus.waterLevelM} m</span>
            <span className="chip-sub">({currentDam.currentStatus.percentStorage}%)</span>
          </div>

          <div className="telemetry-chip">
            <span className="chip-label">Inflow:</span>
            <span className="chip-val amber">{currentDam.currentStatus.inflowCumecs.toLocaleString()} m³/s</span>
          </div>

          <div className="telemetry-chip">
            <span className="chip-label">Discharge:</span>
            <span className="chip-val green">{currentDam.currentStatus.outflowCumecs.toLocaleString()} m³/s</span>
          </div>

          <div className="alert-badge-chip">
            <span className="pulse-dot-red"></span>
            <span>{currentDam.currentStatus.floodAlertLevel.split(' - ')[0]}</span>
          </div>
        </div>

        {/* Right: Role, GIS Map Toggle & Sign Out */}
        <div className="banner-right">
          <div className="role-switch">
            <Users size={13} className="text-muted" />
            <select 
              value={userRole} 
              onChange={(e) => {
                const newRole = e.target.value;
                setUserRole(newRole);
                if (!isPortalAllowedForRole(activePortal, newRole)) {
                  setActivePortal(getDefaultPortalForRole(newRole));
                }
              }}
              className="role-select"
            >
              <option value="technical">Technical Modeler (5 Pages)</option>
              <option value="operator">Dam Engineer (3 Pages)</option>
              <option value="hadr">HADR Commander (4 Pages)</option>
              <option value="citizen">Public Citizen (1 Page)</option>
            </select>
          </div>

          {setViewMode && (
            <button 
              className={`live-wave-toggle-btn ${viewMode === 'map_fullscreen' ? 'active' : ''}`}
              onClick={() => setViewMode(viewMode === 'map_fullscreen' ? 'portal_only' : 'map_fullscreen')}
              title={viewMode === 'map_fullscreen' ? 'Return to Portal Workspace' : 'Open Full Interface GIS Map'}
            >
              <Map size={14} />
              <span>{viewMode === 'map_fullscreen' ? 'Show Portal' : 'Live GIS Map'}</span>
            </button>
          )}

          {onLogout && (
            <button 
              className="logout-nav-btn"
              onClick={onLogout}
              title="Return to Login Gateway"
            >
              <LogOut size={13} />
              <span>Sign Out</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Portals Navigation Bar (Role-Authorized Tabs Only) */}
      <nav className="portal-nav">
        <div className="portal-nav-items">
          {portals.map((portal) => {
            const Icon = portal.icon;
            const isActive = activePortal === portal.id;
            return (
              <button
                key={portal.id}
                onClick={() => setActivePortal(portal.id)}
                className={`portal-nav-btn ${isActive ? 'active' : ''}`}
              >
                <Icon size={14} />
                <span>{portal.label}</span>
              </button>
            );
          })}
        </div>

        {/* Dynamic Role Clearance Badge */}
        <div className="role-clearance-pill" style={{ borderColor: `${currentRoleConfig.badgeColor}40` }}>
          <span className="clearance-dot" style={{ backgroundColor: currentRoleConfig.badgeColor }}></span>
          <span className="clearance-label">WORKSPACE CLEARANCE:</span>
          <strong className="clearance-role" style={{ color: currentRoleConfig.badgeColor }}>
            {currentRoleConfig.shortTitle}
          </strong>
          <span className="clearance-count">
            ({portals.length} {portals.length === 1 ? 'Page' : 'Pages'} Active)
          </span>
        </div>
      </nav>

      <style>{`
        .header-container {
          background: #ffffff;
          border-bottom: 1px solid #e2e8f0;
          position: sticky;
          top: 0;
          z-index: 1000;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
        }

        .header-tricolor-line {
          height: 3px;
          width: 100%;
          display: flex;
        }

        .accent-saffron { flex: 1; background: #f97316; }
        .accent-white { flex: 1; background: #ffffff; }
        .accent-green { flex: 1; background: #16a34a; }

        .top-banner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 8px 24px;
          border-bottom: 1px solid #f1f5f9;
          gap: 16px;
        }

        .banner-left {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .logo-badge {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .logo-circle {
          width: 38px;
          height: 38px;
          border-radius: 8px;
          background: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid #bae6fd;
          box-shadow: 0 1px 4px rgba(2, 132, 199, 0.15);
          overflow: hidden;
          padding: 2px;
        }

        .logo-img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }

        .brand-title {
          font-size: 1.15rem;
          font-weight: 900;
          letter-spacing: 0.04em;
          color: #0f172a;
          display: block;
          line-height: 1.1;
        }

        .brand-subtitle {
          font-size: 0.675rem;
          color: #64748b;
          letter-spacing: 0.02em;
          display: block;
          font-weight: 600;
        }

        .dam-selector-wrapper {
          display: flex;
          align-items: center;
          gap: 6px;
          background: #f8fafc;
          padding: 5px 10px;
          border-radius: 6px;
          border: 1px solid #cbd5e1;
        }

        .selector-label {
          font-size: 0.675rem;
          font-weight: 800;
          color: #64748b;
          font-family: var(--font-mono);
        }

        .dam-select {
          background: transparent;
          border: none;
          color: #0f172a;
          font-weight: 700;
          font-size: 0.8rem;
          cursor: pointer;
          outline: none;
        }

        .dam-select option {
          background: #ffffff;
          color: #0f172a;
        }

        .banner-center {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .telemetry-chip {
          display: flex;
          align-items: center;
          gap: 5px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          padding: 4px 9px;
          border-radius: 6px;
          font-size: 0.75rem;
        }

        .chip-label {
          color: #64748b;
          font-weight: 600;
        }

        .chip-val {
          font-weight: 800;
          font-family: var(--font-mono);
        }

        .chip-val.blue { color: #0284c7; }
        .chip-val.amber { color: #d97706; }
        .chip-val.green { color: #16a34a; }

        .chip-sub {
          color: #94a3b8;
          font-size: 0.7rem;
        }

        .alert-badge-chip {
          display: flex;
          align-items: center;
          gap: 6px;
          background: #fee2e2;
          color: #dc2626;
          border: 1px solid #fecaca;
          padding: 4px 9px;
          border-radius: 6px;
          font-size: 0.7rem;
          font-weight: 800;
          letter-spacing: 0.03em;
        }

        .pulse-dot-red {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #dc2626;
          animation: pulse 1.2s infinite;
        }

        .banner-right {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .role-switch {
          display: flex;
          align-items: center;
          gap: 6px;
          background: #f8fafc;
          border: 1px solid #cbd5e1;
          padding: 4px 8px;
          border-radius: 6px;
        }

        .role-select {
          background: transparent;
          border: none;
          color: #0f172a;
          font-weight: 700;
          font-size: 0.75rem;
          cursor: pointer;
          outline: none;
        }

        .live-wave-toggle-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          background: #f0fdf4;
          border: 1px solid #bbf7d0;
          color: #16a34a;
          padding: 5px 11px;
          border-radius: 6px;
          font-size: 0.75rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .live-wave-toggle-btn:hover {
          background: #dcfce7;
        }

        .live-wave-toggle-btn.active {
          background: #16a34a;
          color: #ffffff;
        }

        .logout-nav-btn {
          display: flex;
          align-items: center;
          gap: 5px;
          background: #f8fafc;
          border: 1px solid #cbd5e1;
          color: #475569;
          padding: 5px 10px;
          border-radius: 6px;
          font-size: 0.75rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .logout-nav-btn:hover {
          background: #fee2e2;
          color: #dc2626;
          border-color: #fca5a5;
        }

        .portal-nav {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding: 6px 24px;
          background: #ffffff;
          border-top: 1px solid #f8fafc;
        }

        .portal-nav-items {
          display: flex;
          align-items: center;
          gap: 6px;
          overflow-x: auto;
          flex: 1;
        }

        .portal-nav-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 14px;
          border-radius: 6px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          color: #475569;
          font-size: 0.775rem;
          font-weight: 600;
          cursor: pointer;
          white-space: nowrap;
          transition: all 0.15s ease;
        }

        .portal-nav-btn:hover {
          background: #f1f5f9;
          border-color: #cbd5e1;
          color: #0f172a;
        }

        .portal-nav-btn.active {
          background: #0284c7;
          border-color: #0284c7;
          color: #ffffff;
          font-weight: 700;
          box-shadow: 0 2px 6px rgba(2, 132, 199, 0.25);
        }

        .role-clearance-pill {
          display: flex;
          align-items: center;
          gap: 6px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          padding: 4px 10px;
          border-radius: 20px;
          font-size: 0.7rem;
          white-space: nowrap;
        }

        .clearance-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
        }

        .clearance-label {
          color: #64748b;
          font-weight: 700;
          font-size: 0.65rem;
          letter-spacing: 0.03em;
        }

        .clearance-role {
          font-weight: 800;
        }

        .clearance-count {
          color: #64748b;
          font-weight: 600;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }

        @media (max-width: 1200px) {
          .banner-center {
            display: none;
          }
        }
      `}</style>
    </header>
  );
}
