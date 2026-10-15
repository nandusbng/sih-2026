import React, { useState } from 'react';
import { 
  Waves, 
  Layers, 
  Activity, 
  Sliders, 
  Cpu, 
  GitCompare, 
  AlertOctagon, 
  LifeBuoy, 
  Radio, 
  Download, 
  ArrowRight, 
  ShieldCheck, 
  Users, 
  Lock, 
  MapPin, 
  CheckCircle2, 
  Sparkles,
  Map,
  Compass,
  Play
} from 'lucide-react';
import { 
  ROLE_DEFINITIONS, 
  isPortalAllowedForRole, 
  getDefaultPortalForRole 
} from '../../data/rolePermissions';

export default function LoginPortalGateway({ 
  setActivePortal, 
  userRole, 
  setUserRole, 
  selectedDamId, 
  setSelectedDamId, 
  damsData,
  setViewMode,
  currentScenario,
  simulationState 
}) {
  const currentDam = damsData[selectedDamId] || damsData.hirakud;
  const [loginEmail, setLoginEmail] = useState('admin@varunastra.gov.in');
  const [selectedPersona, setSelectedPersona] = useState(userRole || 'technical');
  const [filterAuthorizedOnly, setFilterAuthorizedOnly] = useState(true);

  const currentRoleConfig = ROLE_DEFINITIONS[selectedPersona] || ROLE_DEFINITIONS.technical;

  const portalModules = [
    {
      id: 'data_admin',
      num: '01',
      title: 'Data Admin & Audit',
      subtitle: 'Technical Modelling & Ingestion',
      desc: 'Discover open hydro-spatial datasets, ingest bathymetry/DEM files, and perform automated model readiness audits.',
      icon: Layers,
      color: '#0284c7', // Sky Blue
      bgSoft: '#e0f2fe',
      tags: ['NWIC Discovery', 'DEM Ingestion', 'Model Audit'],
      defaultRole: 'technical'
    },
    {
      id: 'dam_operator',
      num: '02',
      title: 'Dam Operations',
      subtitle: 'Telemetry & Spillway Gates',
      desc: 'Real-time reservoir water levels, inflow/discharge hydrographs, and rule-curve spillway gate decision support.',
      icon: Activity,
      color: '#059669', // Emerald
      bgSoft: '#d1fae5',
      tags: ['CWC Telemetry', 'Rule Curve', 'Gate Controls'],
      defaultRole: 'operator'
    },
    {
      id: 'scenario_composer',
      num: '03',
      title: 'Scenario Composer',
      subtitle: 'Dam-Break Physics Sandbox',
      desc: 'Parameterize breach width, failure duration, overtopping depth, and Froehlich/Von Thun breach outflow hydrographs.',
      icon: Sliders,
      color: '#7c3aed', // Purple
      bgSoft: '#ede9fe',
      tags: ['PMP Rainfall', 'Breach Sandbox', 'Inflow Shock'],
      defaultRole: 'technical'
    },
    {
      id: 'simulation_engine',
      num: '04',
      title: 'Delft3D + SPH Engine',
      subtitle: 'Dual Hydrodynamic Solvers',
      desc: 'Parallel 2D Shallow Water solver (Delft3D-FM) coupled with Lagrangian particle physics (DualSPHysics 14.5M particles).',
      icon: Cpu,
      color: '#0891b2', // Cyan
      bgSoft: '#cffafe',
      tags: ['Delft3D Flexible Mesh', 'SPH Particles', 'CFL < 0.75'],
      defaultRole: 'technical'
    },
    {
      id: 'model_comparison',
      num: '05',
      title: 'Satellite & Comparison',
      subtitle: 'GEE Sentinel-1 SAR Validation',
      desc: 'Automated satellite flood extent cross-validation with Google Earth Engine SAR backscatter and multi-model ensemble analysis.',
      icon: GitCompare,
      color: '#4f46e5', // Indigo
      bgSoft: '#e0e7ff',
      tags: ['Sentinel-1 SAR', '91.8% Ground Truth', 'F-Score 0.89'],
      defaultRole: 'technical'
    },
    {
      id: 'impact_analysis',
      num: '06',
      title: 'Loss & Damage Assessment',
      subtitle: 'Exposure & Vulnerability Triage',
      desc: 'Building damage severity indexing, road/bridge submergence cuts, crop destruction, and NDMA monetary damage estimation.',
      icon: AlertOctagon,
      color: '#d97706', // Amber
      bgSoft: '#fef3c7',
      tags: ['Structure Triage', 'Submerged Highways', 'Loss Calculation'],
      defaultRole: 'hadr'
    },
    {
      id: 'hadr_priority',
      num: '07',
      title: 'HADR Action Priorities',
      subtitle: 'NDRF Evacuation Dispatch',
      desc: 'Priority-ranked rescue dispatch algorithm with road clearance status, boat team allocations, and safe shelter routing.',
      icon: LifeBuoy,
      color: '#dc2626', // Crimson Red
      bgSoft: '#fee2e2',
      tags: ['NDRF Rescue', 'Vulnerability Triage', 'Safe Routes'],
      defaultRole: 'hadr'
    },
    {
      id: 'citizen_warning',
      num: '08',
      title: 'Public Citizen Warning',
      subtitle: 'Multi-Lingual CAP Alerts',
      desc: 'Disseminate real-time Common Alerting Protocol sirens, WhatsApp/SMS push bulletins, and citizen evacuation routing.',
      icon: Radio,
      color: '#0284c7', // Ocean Blue
      bgSoft: '#e0f2fe',
      tags: ['CAP Siren', 'Odia / Hindi / Marathi', 'Safe Shelters'],
      defaultRole: 'citizen'
    },
    {
      id: 'export_reports',
      num: '09',
      title: 'GIS Export & Reports',
      subtitle: 'CWC Dossiers & NetCDF-4',
      desc: 'Export simulation NetCDF-4 grids, GeoTIFF depth maps, Shapefiles, and automated executive CWC compliance PDF reports.',
      icon: Download,
      color: '#334155', // Slate Navy
      bgSoft: '#f1f5f9',
      tags: ['NetCDF-4 Rasters', 'Shapefile / GeoJSON', 'CWC Audit Dossier'],
      defaultRole: 'technical'
    }
  ];

  const handlePersonaSelect = (roleId) => {
    setSelectedPersona(roleId);
    setUserRole(roleId);
    if (roleId === 'technical') setLoginEmail('admin@varunastra.gov.in');
    if (roleId === 'operator') setLoginEmail('engineer@cwc.gov.in');
    if (roleId === 'hadr') setLoginEmail('ndma.commander@gov.in');
    if (roleId === 'citizen') setLoginEmail('citizen.alert@public.in');
  };

  const handleLaunchPortal = (portalId, portalRole) => {
    setUserRole(portalRole || selectedPersona);
    setActivePortal(portalId);
    if (setViewMode) setViewMode('portal_only');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLaunchMap = () => {
    if (setViewMode) setViewMode('map_fullscreen');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="gateway-container">
      {/* Top Hero Brand Header (TARANG Style Deep Navy) */}
      <section className="gateway-hero">
        <div className="hero-content">
          <div className="hero-badge-row">
            <div className="hero-logo-circle">
              <img src="/lo.png" alt="VARUNASTRA" className="hero-logo-img" />
            </div>
            <div>
              <div className="hero-kicker">
                SMART INDIA HACKATHON 2026 // PROBLEM STATEMENT 2
              </div>
              <h1 className="hero-title">VARUNASTRA</h1>
              <p className="hero-acronym">
                <span className="acr-letter">V</span>alidated 
                <span className="acr-letter">A</span>dvanced 
                <span className="acr-letter">R</span>eservoir 
                <span className="acr-letter">U</span>nified 
                <span className="acr-letter">N</span>etwork &amp; 
                <span className="acr-letter">A</span>nalytics // 
                <span className="acr-letter">S</span>imulation, 
                <span className="acr-letter">T</span>actical 
                <span className="acr-letter">R</span>apid 
                <span className="acr-letter">A</span>ssessment
              </p>
            </div>
          </div>

          <p className="hero-description">
            Next-generation flood intelligence framework integrating <strong>Delft3D Flexible Mesh</strong> 2D Shallow Water Equations, 
            <strong>DualSPHysics</strong> Lagrangian fluid particle mechanics, <strong>Google Earth Engine Sentinel-1 SAR</strong> ground-truth validation, 
            and <strong>NDMA/NDRF HADR</strong> decision support.
          </p>

          {/* Dam Target & Live Status Bar */}
          <div className="hero-target-bar">
            <div className="target-select-wrap">
              <MapPin size={18} className="text-cyan" />
              <span className="target-label">ACTIVE HYDRO-TARGET:</span>
              <select 
                value={selectedDamId} 
                onChange={(e) => setSelectedDamId(e.target.value)}
                className="target-select"
              >
                <option value="khadakwasla">🌊 Khadakwasla Dam (Mutha River, Pune - SIH Core)</option>
                <option value="chamoli">🏔️ Chamoli Avalanche & Flash Flood (Rishiganga - SIH Disaster)</option>
                <option value="hirakud">🛡️ Hirakud Dam (Mahanadi River, Odisha)</option>
                <option value="ukai">⚡ Ukai Dam (Tapi River, Gujarat)</option>
              </select>
            </div>

            <div className="target-telemetry">
              <span>Current Level: <strong>{currentDam.currentStatus.waterLevelM} m</strong></span>
              <span>Discharge: <strong>{currentDam.currentStatus.outflowCumecs.toLocaleString()} m³/s</strong></span>
              <span className="alert-badge">{currentDam.currentStatus.floodAlertLevel.split(' - ')[0]}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Workspace Section (TARANG Clean White Surface) */}
      <div className="gateway-main-wrap">
        
        {/* Role Authentication Card */}
        <div className="auth-card-panel">
          <div className="auth-header">
            <div className="flex-align-gap">
              <ShieldCheck size={20} className="text-primary" />
              <h2 className="auth-title">Role-Based Access &amp; User Authentication</h2>
            </div>
            <span className="auth-hint">Select a persona or enter any portal below to launch its dedicated workspace</span>
          </div>

          <div className="personas-grid">
            <button 
              className={`persona-card ${selectedPersona === 'technical' ? 'active' : ''}`}
              onClick={() => handlePersonaSelect('technical')}
            >
              <div className="persona-icon-circle blue">
                <Cpu size={18} />
              </div>
              <div className="persona-info">
                <strong>Technical Modeler / Admin</strong>
                <span>Full access to Delft3D, SPH, SAR validation &amp; data audit</span>
              </div>
              {selectedPersona === 'technical' && <CheckCircle2 size={18} className="check-icon" />}
            </button>

            <button 
              className={`persona-card ${selectedPersona === 'operator' ? 'active' : ''}`}
              onClick={() => handlePersonaSelect('operator')}
            >
              <div className="persona-icon-circle green">
                <Activity size={18} />
              </div>
              <div className="persona-info">
                <strong>Dam Water Engineer</strong>
                <span>Reservoir telemetry, spillway gates &amp; rule curves</span>
              </div>
              {selectedPersona === 'operator' && <CheckCircle2 size={18} className="check-icon" />}
            </button>

            <button 
              className={`persona-card ${selectedPersona === 'hadr' ? 'active' : ''}`}
              onClick={() => handlePersonaSelect('hadr')}
            >
              <div className="persona-icon-circle red">
                <LifeBuoy size={18} />
              </div>
              <div className="persona-info">
                <strong>NDMA / HADR Commander</strong>
                <span>Loss &amp; damage triage, rescue prioritization &amp; shelters</span>
              </div>
              {selectedPersona === 'hadr' && <CheckCircle2 size={18} className="check-icon" />}
            </button>

            <button 
              className={`persona-card ${selectedPersona === 'citizen' ? 'active' : ''}`}
              onClick={() => handlePersonaSelect('citizen')}
            >
              <div className="persona-icon-circle purple">
                <Radio size={18} />
              </div>
              <div className="persona-info">
                <strong>Public Citizen View</strong>
                <span>Emergency sirens, early alerts &amp; evacuation map</span>
              </div>
              {selectedPersona === 'citizen' && <CheckCircle2 size={18} className="check-icon" />}
            </button>
          </div>

          {/* Direct Map Launch Banner */}
          <div className="direct-map-banner" onClick={handleLaunchMap}>
            <div className="flex-align-gap">
              <div className="map-badge-icon">
                <Map size={20} color="#0284c7" />
              </div>
              <div>
                <strong>Want to see the Interactive Flood Wave Map directly?</strong>
                <p>Launch the whole-interface Web GIS with Mapbox Streets, 25K SPH fluid particles &amp; timeline scrubber.</p>
              </div>
            </div>
            <button className="btn btn-primary btn-sm">
              <Play size={14} />
              <span>Launch Live GIS Wave Map</span>
            </button>
          </div>
        </div>

        {/* 9 Portals Grid (TARANG Model Stages Workflow) */}
        <section className="portals-workspace-section">
          <div className="section-header">
            <h2 className="section-title">Model Development &amp; Operations Workspace</h2>
            <p className="section-subtitle">
              Nine end-to-end operational portals. Click on any portal to enter its dedicated, un-congested workspace.
            </p>
          </div>

          <div className="portals-nine-grid">
            {portalModules.map((portal) => {
              const Icon = portal.icon;
              return (
                <div 
                  key={portal.id}
                  className="portal-workflow-card"
                  style={{ borderTop: `4px solid ${portal.color}` }}
                  onClick={() => handleLaunchPortal(portal.id, portal.defaultRole)}
                >
                  <div className="card-top-row">
                    <div className="step-circle" style={{ background: portal.bgSoft, color: portal.color }}>
                      {portal.num}
                    </div>
                    <div className="icon-box" style={{ background: portal.bgSoft, color: portal.color }}>
                      <Icon size={20} />
                    </div>
                  </div>

                  <h3 className="card-portal-title">{portal.title}</h3>
                  <div className="card-portal-subtitle" style={{ color: portal.color }}>
                    {portal.subtitle}
                  </div>

                  <p className="card-portal-desc">{portal.desc}</p>

                  <div className="card-tags">
                    {portal.tags.map((tag, i) => (
                      <span key={i} className="card-tag-pill">{tag}</span>
                    ))}
                  </div>

                  <div className="card-action-row">
                    <span className="open-link" style={{ color: portal.color }}>
                      Enter {portal.title.split(' ')[0]} Portal &rarr;
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

      </div>

      <style>{`
        .gateway-container {
          min-height: 100vh;
          background: #f1f5f9;
          color: #0f172a;
          font-family: var(--font-sans);
        }

        .gateway-hero {
          background: linear-gradient(135deg, #081d3e 0%, #0d3276 50%, #0a2558 100%);
          color: #ffffff;
          padding: 40px 24px 50px 24px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.12);
          box-shadow: 0 4px 20px rgba(10, 30, 70, 0.2);
        }

        .hero-content {
          max-width: 1400px;
          margin: 0 auto;
        }

        .hero-badge-row {
          display: flex;
          align-items: center;
          gap: 18px;
          margin-bottom: 16px;
        }

        .hero-logo-circle {
          width: 62px;
          height: 62px;
          border-radius: 14px;
          background: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.25);
          border: 2px solid #38bdf8;
          flex-shrink: 0;
          overflow: hidden;
          padding: 3px;
        }

        .hero-logo-img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }

        .hero-kicker {
          font-size: 0.75rem;
          font-weight: 800;
          letter-spacing: 0.1em;
          color: #38bdf8;
          text-transform: uppercase;
        }

        .hero-title {
          font-size: 2.5rem;
          font-weight: 900;
          letter-spacing: 0.08em;
          color: #ffffff;
          line-height: 1.1;
          margin: 2px 0;
        }

        .hero-acronym {
          font-size: 0.85rem;
          color: #cbd5e1;
          letter-spacing: 0.02em;
        }

        .acr-letter {
          color: #f59e0b;
          font-weight: 800;
        }

        .hero-description {
          max-width: 900px;
          font-size: 0.95rem;
          color: #e2e8f0;
          line-height: 1.6;
          margin-bottom: 24px;
        }

        .hero-target-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 12px;
          padding: 12px 20px;
          gap: 16px;
          flex-wrap: wrap;
        }

        .target-select-wrap {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .target-label {
          font-size: 0.75rem;
          font-weight: 800;
          color: #7dd3fc;
          letter-spacing: 0.05em;
        }

        .target-select {
          background: rgba(15, 23, 42, 0.7);
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 8px;
          color: #ffffff;
          font-weight: 600;
          font-size: 0.875rem;
          padding: 8px 14px;
          cursor: pointer;
          outline: none;
        }

        .target-select option {
          background: #0f172a;
          color: #ffffff;
        }

        .target-telemetry {
          display: flex;
          align-items: center;
          gap: 16px;
          font-size: 0.85rem;
        }

        .alert-badge {
          background: #ef4444;
          color: #ffffff;
          font-weight: 800;
          padding: 3px 9px;
          border-radius: 9999px;
          font-size: 0.75rem;
        }

        .gateway-main-wrap {
          max-width: 1400px;
          margin: -24px auto 60px auto;
          padding: 0 20px;
        }

        .auth-card-panel {
          background: #ffffff;
          border-radius: 16px;
          border: 1px solid #e2e8f0;
          box-shadow: 0 10px 30px -5px rgba(0, 0, 0, 0.08);
          padding: 24px;
          margin-bottom: 36px;
        }

        .auth-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 18px;
          flex-wrap: wrap;
          gap: 8px;
        }

        .auth-title {
          font-size: 1.15rem;
          font-weight: 800;
          color: #0f172a;
        }

        .auth-hint {
          font-size: 0.8rem;
          color: #64748b;
        }

        .personas-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 14px;
          margin-bottom: 20px;
        }

        .persona-card {
          display: flex;
          align-items: center;
          gap: 12px;
          background: #f8fafc;
          border: 1.5px solid #e2e8f0;
          border-radius: 12px;
          padding: 14px 16px;
          cursor: pointer;
          text-align: left;
          transition: all 0.18s ease;
          position: relative;
        }

        .persona-card:hover {
          border-color: #93c5fd;
          background: #f0f9ff;
          transform: translateY(-1px);
        }

        .persona-card.active {
          border-color: #0284c7;
          background: #eff6ff;
          box-shadow: 0 4px 14px rgba(2, 132, 199, 0.15);
        }

        .persona-icon-circle {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .persona-icon-circle.blue { background: #e0f2fe; color: #0284c7; }
        .persona-icon-circle.green { background: #d1fae5; color: #059669; }
        .persona-icon-circle.red { background: #fee2e2; color: #dc2626; }
        .persona-icon-circle.purple { background: #ede9fe; color: #7c3aed; }

        .persona-info strong {
          display: block;
          font-size: 0.85rem;
          color: #0f172a;
          margin-bottom: 2px;
        }

        .persona-info span {
          display: block;
          font-size: 0.725rem;
          color: #64748b;
          line-height: 1.3;
        }

        .check-icon {
          margin-left: auto;
          color: #0284c7;
          flex-shrink: 0;
        }

        .direct-map-banner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #f0fdf4;
          border: 1px solid #bbf7d0;
          border-radius: 12px;
          padding: 12px 18px;
          cursor: pointer;
          transition: all 0.2s ease;
          flex-wrap: wrap;
          gap: 12px;
        }

        .direct-map-banner:hover {
          background: #dcfce7;
          border-color: #86efac;
          transform: translateY(-1px);
        }

        .map-badge-icon {
          width: 38px;
          height: 38px;
          border-radius: 8px;
          background: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.06);
        }

        .direct-map-banner strong {
          display: block;
          font-size: 0.875rem;
          color: #14532d;
        }

        .direct-map-banner p {
          font-size: 0.775rem;
          color: #166534;
          margin: 0;
        }

        .portals-workspace-section {
          margin-top: 10px;
        }

        .section-header {
          text-align: center;
          margin-bottom: 30px;
        }

        .section-title {
          font-size: 1.75rem;
          font-weight: 900;
          color: #0f172a;
          letter-spacing: -0.02em;
          margin-bottom: 6px;
        }

        .section-subtitle {
          font-size: 0.925rem;
          color: #64748b;
          max-width: 700px;
          margin: 0 auto;
        }

        .portals-nine-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 22px;
        }

        @media (max-width: 1024px) {
          .portals-nine-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 640px) {
          .portals-nine-grid {
            grid-template-columns: 1fr;
          }
        }

        .portal-workflow-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          padding: 24px;
          box-shadow: 0 4px 20px -2px rgba(0, 0, 0, 0.05);
          cursor: pointer;
          transition: all 0.22s cubic-bezier(0.16, 1, 0.3, 1);
          display: flex;
          flex-direction: column;
          position: relative;
        }

        .portal-workflow-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 30px -4px rgba(0, 0, 0, 0.12);
          border-color: #cbd5e1;
        }

        .card-top-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 14px;
        }

        .step-circle {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          font-size: 0.85rem;
          font-weight: 900;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: var(--font-mono);
        }

        .icon-box {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .card-portal-title {
          font-size: 1.15rem;
          font-weight: 800;
          color: #0f172a;
          margin-bottom: 4px;
          letter-spacing: -0.01em;
        }

        .card-portal-subtitle {
          font-size: 0.775rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          margin-bottom: 12px;
        }

        .card-portal-desc {
          font-size: 0.825rem;
          color: #475569;
          line-height: 1.55;
          margin-bottom: 16px;
          flex: 1;
        }

        .card-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-bottom: 18px;
        }

        .card-tag-pill {
          background: #f1f5f9;
          color: #475569;
          font-size: 0.7rem;
          font-weight: 600;
          padding: 3px 8px;
          border-radius: 4px;
          border: 1px solid #e2e8f0;
        }

        .card-action-row {
          border-top: 1px solid #f1f5f9;
          padding-top: 12px;
          margin-top: auto;
        }

        .open-link {
          font-size: 0.825rem;
          font-weight: 700;
          display: inline-flex;
          align-items: center;
          gap: 4px;
          transition: gap 0.15s ease;
        }

        .portal-workflow-card:hover .open-link {
          gap: 8px;
        }
      `}</style>
    </div>
  );
}
