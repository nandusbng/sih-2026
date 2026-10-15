import React, { useState } from 'react';
import { 
  Waves, 
  ShieldCheck, 
  Lock, 
  Mail, 
  MapPin, 
  ArrowRight, 
  CheckCircle2, 
  Cpu, 
  Activity, 
  LifeBuoy, 
  Radio, 
  Layers, 
  Sliders, 
  GitCompare, 
  AlertOctagon, 
  Download,
  Play,
  Globe2,
  Sparkles
} from 'lucide-react';
import { 
  ROLE_DEFINITIONS, 
  isPortalAllowedForRole, 
  getAllowedPortalIds, 
  getDefaultPortalForRole 
} from '../../data/rolePermissions';

export default function LoginPage({ 
  onLogin, 
  onBackToLanding,
  selectedDamId, 
  setSelectedDamId, 
  damsData,
  userRole,
  setUserRole 
}) {
  const [email, setEmail] = useState('admin@varunastra.gov.in');
  const [password, setPassword] = useState('••••••••••••');
  const [selectedRole, setSelectedRole] = useState(userRole || 'technical');
  const [selectedTarget, setSelectedTarget] = useState(selectedDamId || 'khadakwasla');
  const [showAllModules, setShowAllModules] = useState(false);

  const currentDam = damsData[selectedTarget] || damsData.khadakwasla;
  const currentRoleConfig = ROLE_DEFINITIONS[selectedRole] || ROLE_DEFINITIONS.technical;

  const rolePersonas = [
    {
      id: 'technical',
      title: 'Technical Modeler / Admin',
      dept: 'CWC Hydrology & Compute Cluster',
      desc: 'Full access to Delft3D-FM, SPH particle solvers, GEE SAR validation & mesh grids',
      icon: Cpu,
      defaultPortal: 'data_admin',
      email: 'admin@varunastra.gov.in',
      badgeColor: '#0284c7',
      bgLight: '#e0f2fe',
      pagesCount: 5
    },
    {
      id: 'operator',
      title: 'Dam Water Engineer',
      dept: 'State Water Resources Dept (WRD)',
      desc: 'Reservoir water levels, spillway gates, rule curves & inflow/outflow dispatch',
      icon: Activity,
      defaultPortal: 'dam_operator',
      email: 'engineer@cwc.gov.in',
      badgeColor: '#059669',
      bgLight: '#d1fae5',
      pagesCount: 3
    },
    {
      id: 'hadr',
      title: 'NDMA / HADR Commander',
      dept: 'Disaster Management & NDRF Command',
      desc: 'Downstream loss & damage triage, evacuation routing & boat team dispatch',
      icon: LifeBuoy,
      defaultPortal: 'hadr_priority',
      email: 'ndma.commander@gov.in',
      badgeColor: '#dc2626',
      bgLight: '#fee2e2',
      pagesCount: 4
    },
    {
      id: 'citizen',
      title: 'Public Citizen Access',
      dept: 'National Public Early Warning System',
      desc: 'Common Alerting Protocol (CAP) sirens, safe shelters & evacuation maps',
      icon: Radio,
      defaultPortal: 'citizen_warning',
      email: 'public.alert@gov.in',
      badgeColor: '#7c3aed',
      bgLight: '#ede9fe',
      pagesCount: 1
    }
  ];

  const portalsList = [
    { id: 'data_admin', num: '01', title: 'Data Admin & Audit', icon: Layers, color: '#0284c7', primaryRole: 'technical' },
    { id: 'dam_operator', num: '02', title: 'Dam Operations', icon: Activity, color: '#059669', primaryRole: 'operator' },
    { id: 'scenario_composer', num: '03', title: 'Scenario Composer', icon: Sliders, color: '#7c3aed', primaryRole: 'technical' },
    { id: 'simulation_engine', num: '04', title: 'Delft3D + SPH Engine', icon: Cpu, color: '#0891b2', primaryRole: 'technical' },
    { id: 'model_comparison', num: '05', title: 'Satellite & Validation', icon: GitCompare, color: '#4f46e5', primaryRole: 'technical' },
    { id: 'impact_analysis', num: '06', title: 'Loss & Damage', icon: AlertOctagon, color: '#d97706', primaryRole: 'hadr' },
    { id: 'hadr_priority', num: '07', title: 'HADR Action Priorities', icon: LifeBuoy, color: '#dc2626', primaryRole: 'hadr' },
    { id: 'citizen_warning', num: '08', title: 'Citizen Warning', icon: Radio, color: '#0284c7', primaryRole: 'citizen' },
    { id: 'export_reports', num: '09', title: 'GIS Export & Reports', icon: Download, color: '#334155', primaryRole: 'technical' }
  ];

  const handleRoleSelect = (persona) => {
    setSelectedRole(persona.id);
    setEmail(persona.email);
    setUserRole(persona.id);
  };

  const handleSubmitLogin = (e) => {
    if (e) e.preventDefault();
    const persona = rolePersonas.find(p => p.id === selectedRole) || rolePersonas[0];
    if (setSelectedDamId) setSelectedDamId(selectedTarget);
    if (onLogin) onLogin(selectedRole, persona.defaultPortal, selectedTarget);
  };

  const handleDirectPortalClick = (portalId, portalPrimaryRole) => {
    // If the portal is permitted for current selectedRole, maintain selectedRole; else switch role
    const effectiveRole = isPortalAllowedForRole(portalId, selectedRole) ? selectedRole : portalPrimaryRole;
    setSelectedRole(effectiveRole);
    if (setUserRole) setUserRole(effectiveRole);
    if (setSelectedDamId) setSelectedDamId(selectedTarget);
    if (onLogin) onLogin(effectiveRole, portalId, selectedTarget);
  };

  return (
    <div className="login-page-root">
      {/* Top National Identity Accent Bar */}
      <div className="national-accent-bar">
        <span className="accent-saffron"></span>
        <span className="accent-white"></span>
        <span className="accent-green"></span>
      </div>

      {/* Clean Executive Header */}
      <header className="login-top-nav">
        <div className="login-brand">
          <div className="login-logo-circle">
            <img src="/lo.png" alt="VARUNASTRA" className="login-logo-img" />
          </div>
          <div>
            <div className="login-brand-title">
              VARUNASTRA
            </div>
            <div className="login-brand-sub">
              National Hydrodynamic Flood Intelligence &amp; Dam-Break Simulation System
            </div>
          </div>
        </div>

        <div className="login-gov-badges">
          {onBackToLanding && (
            <button 
              type="button" 
              className="return-simulation-btn"
              onClick={onBackToLanding}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: '#f0f9ff',
                border: '1px solid #bae6fd',
                color: '#0284c7',
                padding: '6px 12px',
                borderRadius: '6px',
                fontSize: '0.75rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <Play size={13} fill="#0284c7" />
              <span>Watch Dam Simulation</span>
            </button>
          )}
          <span className="gov-tag">SMART INDIA HACKATHON 2026</span>
          <span className="gov-tag outline">GOVT OF INDIA // CWC // NDMA</span>
          <span className="system-live-pill">
            <span className="pulse-green-dot"></span> SYSTEM OPERATIONAL
          </span>
        </div>
      </header>

      {/* Main Login Workspace Container */}
      <main className="login-main-container">
        
        {/* Welcome & Info Card */}
        <div className="login-card-surface">
          <div className="login-card-header">
            <span className="login-welcome-kicker">CENTRAL COMMAND GATEWAY</span>
            <h1 className="login-headline">Sign In to VarunAstra Workspace</h1>
            <p className="login-subtext">
              Unified hydrodynamic flood forecasting, coupled <strong>Delft3D Flexible Mesh (2D SWE)</strong> and <strong>DualSPHysics</strong> particle solvers, 
              satellite SAR validation, and automated HADR evacuation decision support.
            </p>
          </div>

          <form onSubmit={handleSubmitLogin} className="login-form">
            
            {/* Step 1: Select Active Hydro-Target Basin */}
            <div className="form-section">
              <label className="form-label">
                <MapPin size={16} className="text-primary" />
                <span>1. SELECT TARGET HYDRO-BASIN / DAM:</span>
              </label>
              <div className="dam-target-picker">
                <select 
                  value={selectedTarget}
                  onChange={(e) => setSelectedTarget(e.target.value)}
                  className="target-dropdown"
                >
                  <option value="khadakwasla">🌊 Khadakwasla Dam (Mutha River, Pune - SIH Core Target)</option>
                  <option value="chamoli">🏔️ Chamoli Avalanche &amp; Flash Flood (Rishiganga - SIH Disaster Archive)</option>
                  <option value="hirakud">🛡️ Hirakud Dam (Mahanadi River Basin, Odisha)</option>
                  <option value="ukai">⚡ Ukai Dam (Tapi River Basin, Gujarat)</option>
                </select>
                <div className="target-summary-chip">
                  <span>Level: <strong>{currentDam.currentStatus.waterLevelM} m</strong></span>
                  <span>Inflow: <strong>{currentDam.currentStatus.inflowCumecs.toLocaleString()} m³/s</strong></span>
                  <span className="alert-text">{currentDam.currentStatus.floodAlertLevel.split(' - ')[0]}</span>
                </div>
              </div>
            </div>

            {/* Step 2: Role-Based Persona Selector */}
            <div className="form-section">
              <label className="form-label">
                <ShieldCheck size={16} className="text-primary" />
                <span>2. SELECT OPERATIONAL ROLE &amp; CLEARANCE:</span>
              </label>
              
              <div className="personas-cards-grid">
                {rolePersonas.map((persona) => {
                  const Icon = persona.icon;
                  const isSelected = selectedRole === persona.id;
                  return (
                    <div 
                      key={persona.id}
                      className={`persona-select-card ${isSelected ? 'selected' : ''}`}
                      onClick={() => handleRoleSelect(persona)}
                      style={{
                        borderColor: isSelected ? persona.badgeColor : '#e2e8f0',
                        backgroundColor: isSelected ? '#ffffff' : '#f8fafc'
                      }}
                    >
                      <div className="persona-top">
                        <div className="persona-icon-wrap" style={{ background: persona.bgLight, color: persona.badgeColor }}>
                          <Icon size={20} />
                        </div>
                        <div className="persona-top-right">
                          <span className="persona-pages-chip" style={{ color: persona.badgeColor, background: persona.bgLight }}>
                            {persona.pagesCount} {persona.pagesCount === 1 ? 'Page' : 'Pages'}
                          </span>
                          {isSelected && <CheckCircle2 size={18} color={persona.badgeColor} />}
                        </div>
                      </div>
                      <div className="persona-body">
                        <strong className="persona-title">{persona.title}</strong>
                        <span className="persona-dept">{persona.dept}</span>
                        <p className="persona-desc">{persona.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step 3: Credentials Input & Submit Button */}
            <div className="form-section credentials-row">
              <div className="input-group">
                <label className="input-label">Authorized Account Email</label>
                <div className="input-with-icon">
                  <Mail size={16} className="input-icon" />
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="login-input"
                    required
                  />
                </div>
              </div>

              <div className="input-group">
                <label className="input-label">Security Access PIN / Passcode</label>
                <div className="input-with-icon">
                  <Lock size={16} className="input-icon" />
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="login-input"
                    required
                  />
                </div>
              </div>

              <div className="submit-group">
                <button type="submit" className="login-submit-btn">
                  <span>Sign In &amp; Enter VarunAstra</span>
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          </form>

          {/* Quick Direct Portal Links - Role Authorized Workspace Grid */}
          <div className="quick-portals-section">
            {(() => {
              const filteredPortals = showAllModules 
                ? portalsList 
                : portalsList.filter(p => isPortalAllowedForRole(p.id, selectedRole));
              return (
                <>
                  <div className="quick-header">
                    <div className="flex-center-gap">
                      <Globe2 size={16} className="text-primary" />
                      <span className="quick-title">
                        {showAllModules 
                          ? 'All VarunAstra Modules & Clearance Requirements:' 
                          : `Authorized Workspaces for ${currentRoleConfig.title}:`
                        }
                      </span>
                      <span className="authorized-count-badge" style={{ backgroundColor: currentRoleConfig.bgLight, color: currentRoleConfig.badgeColor }}>
                        {filteredPortals.length} {filteredPortals.length === 1 ? 'Page' : 'Pages'} Available
                      </span>
                    </div>

                    <div className="quick-toggle-wrap">
                      <button
                        type="button"
                        className={`toggle-filter-btn ${!showAllModules ? 'active' : ''}`}
                        onClick={() => setShowAllModules(false)}
                      >
                        Profile Workspaces Only ({currentRoleConfig.allowedPortals.length})
                      </button>
                      <button
                        type="button"
                        className={`toggle-filter-btn ${showAllModules ? 'active' : ''}`}
                        onClick={() => setShowAllModules(true)}
                      >
                        View All 9 Modules
                      </button>
                    </div>
                  </div>

                  <div 
                    className="quick-portals-grid" 
                    style={{ 
                      gridTemplateColumns: showAllModules 
                        ? 'repeat(9, 1fr)' 
                        : `repeat(${Math.max(filteredPortals.length, 3)}, 1fr)` 
                    }}
                  >
                    {filteredPortals.map((portal) => {
                      const Icon = portal.icon;
                      const isAllowed = isPortalAllowedForRole(portal.id, selectedRole);
                      return (
                        <button
                          key={portal.id}
                          type="button"
                          className={`quick-portal-item ${!isAllowed ? 'restricted' : ''}`}
                          onClick={() => handleDirectPortalClick(portal.id, portal.primaryRole)}
                          style={{ borderTop: `3px solid ${portal.color}` }}
                        >
                          <div className="quick-num-row">
                            <span className="quick-num">{portal.num}</span>
                            <Icon size={16} style={{ color: portal.color }} />
                            {!isAllowed && (
                              <span className="restricted-badge"><Lock size={10} /> Locked</span>
                            )}
                          </div>
                          <span className="quick-name">{portal.title}</span>
                          <span className="quick-action">
                            {isAllowed ? 'Enter Workspace →' : 'Switch Clearance →'}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </>
              );
            })()}
          </div>

        </div>
      </main>

      <style>{`
        .login-page-root {
          min-height: 100vh;
          background-color: #f1f5f9;
          display: flex;
          flex-direction: column;
          font-family: var(--font-sans);
          color: #0f172a;
        }

        .national-accent-bar {
          height: 4px;
          width: 100%;
          display: flex;
        }

        .accent-saffron { flex: 1; background: #f97316; }
        .accent-white { flex: 1; background: #ffffff; }
        .accent-green { flex: 1; background: #16a34a; }

        .login-top-nav {
          background: #ffffff;
          border-bottom: 1px solid #e2e8f0;
          padding: 12px 32px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
        }

        .login-brand {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .login-logo-circle {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          background: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid #bae6fd;
          box-shadow: 0 2px 8px rgba(2, 132, 199, 0.15);
          overflow: hidden;
          padding: 2px;
        }

        .login-logo-img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }

        .login-brand-title {
          font-size: 1.3rem;
          font-weight: 900;
          letter-spacing: 0.05em;
          color: #0f172a;
          line-height: 1.1;
        }

        .login-brand-sub {
          font-size: 0.725rem;
          color: #64748b;
          font-weight: 500;
        }

        .login-gov-badges {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .gov-tag {
          font-size: 0.7rem;
          font-weight: 700;
          padding: 4px 10px;
          border-radius: 6px;
          background: #f1f5f9;
          color: #334155;
          letter-spacing: 0.03em;
        }

        .gov-tag.outline {
          background: transparent;
          border: 1px solid #cbd5e1;
        }

        .system-live-pill {
          display: flex;
          align-items: center;
          gap: 6px;
          background: #ecfdf5;
          color: #059669;
          border: 1px solid #a7f3d0;
          font-size: 0.7rem;
          font-weight: 700;
          padding: 4px 10px;
          border-radius: 9999px;
          letter-spacing: 0.04em;
        }

        .pulse-green-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #10b981;
          box-shadow: 0 0 6px #10b981;
        }

        .login-main-container {
          flex: 1;
          display: flex;
          justify-content: center;
          align-items: flex-start;
          padding: 32px 24px;
        }

        .login-card-surface {
          width: 100%;
          max-width: 1180px;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
          padding: 36px 40px;
        }

        .login-card-header {
          margin-bottom: 28px;
          border-bottom: 1px solid #f1f5f9;
          padding-bottom: 20px;
        }

        .login-welcome-kicker {
          font-size: 0.75rem;
          font-weight: 800;
          color: #0284c7;
          letter-spacing: 0.08em;
          display: inline-block;
          margin-bottom: 6px;
        }

        .login-headline {
          font-size: 1.8rem;
          font-weight: 900;
          color: #0f172a;
          letter-spacing: -0.02em;
          margin-bottom: 8px;
        }

        .login-subtext {
          color: #475569;
          font-size: 0.925rem;
          line-height: 1.6;
          max-width: 880px;
        }

        .form-section {
          margin-bottom: 24px;
        }

        .form-label {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.8rem;
          font-weight: 800;
          color: #1e293b;
          letter-spacing: 0.04em;
          margin-bottom: 12px;
        }

        .dam-target-picker {
          display: flex;
          align-items: center;
          gap: 16px;
          background: #f8fafc;
          border: 1px solid #cbd5e1;
          border-radius: 10px;
          padding: 10px 16px;
        }

        .target-dropdown {
          flex: 1;
          background: #ffffff;
          border: 1px solid #cbd5e1;
          border-radius: 8px;
          padding: 9px 14px;
          font-size: 0.9rem;
          font-weight: 700;
          color: #0f172a;
          outline: none;
          cursor: pointer;
        }

        .target-summary-chip {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 0.825rem;
          color: #475569;
        }

        .alert-text {
          background: #fee2e2;
          color: #dc2626;
          font-weight: 800;
          font-size: 0.75rem;
          padding: 3px 8px;
          border-radius: 6px;
        }

        .personas-cards-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 14px;
        }

        .persona-select-card {
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          padding: 16px;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .persona-select-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.06);
        }

        .persona-select-card.selected {
          box-shadow: 0 4px 14px rgba(2, 132, 199, 0.15);
        }

        .persona-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .persona-icon-wrap {
          width: 38px;
          height: 38px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .persona-body {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .persona-title {
          font-size: 0.9rem;
          font-weight: 800;
          color: #0f172a;
        }

        .persona-dept {
          font-size: 0.725rem;
          font-weight: 600;
          color: #0284c7;
        }

        .persona-desc {
          font-size: 0.75rem;
          color: #64748b;
          line-height: 1.4;
          margin-top: 4px;
        }

        .credentials-row {
          display: grid;
          grid-template-columns: 1fr 1fr auto;
          gap: 16px;
          align-items: flex-end;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 20px 24px;
        }

        .input-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .input-label {
          font-size: 0.75rem;
          font-weight: 700;
          color: #334155;
        }

        .input-with-icon {
          position: relative;
          display: flex;
          align-items: center;
        }

        .input-icon {
          position: absolute;
          left: 12px;
          color: #94a3b8;
        }

        .login-input {
          width: 100%;
          padding: 10px 14px 10px 38px;
          background: #ffffff;
          border: 1px solid #cbd5e1;
          border-radius: 8px;
          font-size: 0.9rem;
          color: #0f172a;
          outline: none;
          font-family: inherit;
        }

        .login-input:focus {
          border-color: #0284c7;
          box-shadow: 0 0 0 3px rgba(2, 132, 199, 0.15);
        }

        .login-submit-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%);
          color: #ffffff;
          border: none;
          padding: 12px 28px;
          border-radius: 8px;
          font-size: 0.95rem;
          font-weight: 800;
          cursor: pointer;
          box-shadow: 0 4px 14px rgba(2, 132, 199, 0.35);
          transition: all 0.2s ease;
          height: 44px;
        }

        .login-submit-btn:hover {
          background: #0369a1;
          box-shadow: 0 6px 20px rgba(2, 132, 199, 0.5);
          transform: translateY(-1px);
        }

        .quick-portals-section {
          margin-top: 32px;
          border-top: 1px solid #f1f5f9;
          padding-top: 24px;
        }

        .quick-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .flex-center-gap {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .quick-title {
          font-size: 0.85rem;
          font-weight: 800;
          color: #0f172a;
        }

        .quick-hint {
          font-size: 0.75rem;
          color: #64748b;
        }

        .quick-portals-grid {
          display: grid;
          grid-template-columns: repeat(9, 1fr);
          gap: 8px;
        }

        .quick-portal-item {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 10px 8px;
          display: flex;
          flex-direction: column;
          gap: 6px;
          text-align: left;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .quick-portal-item:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
          border-color: #cbd5e1;
        }

        .quick-num-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .quick-num {
          font-size: 0.7rem;
          font-weight: 800;
          color: #94a3b8;
          font-family: var(--font-mono);
        }

        .quick-name {
          font-size: 0.725rem;
          font-weight: 700;
          color: #0f172a;
          line-height: 1.2;
        }

        .quick-action {
          font-size: 0.65rem;
          font-weight: 600;
          color: #0284c7;
          margin-top: 2px;
        }

        .persona-top-right {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .persona-pages-chip {
          font-size: 0.65rem;
          font-weight: 800;
          padding: 2px 7px;
          border-radius: 12px;
          letter-spacing: 0.02em;
        }

        .quick-toggle-wrap {
          display: flex;
          gap: 4px;
          background: #f1f5f9;
          padding: 3px;
          border-radius: 8px;
        }

        .toggle-filter-btn {
          background: transparent;
          border: none;
          color: #64748b;
          font-size: 0.725rem;
          font-weight: 700;
          padding: 4px 10px;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .toggle-filter-btn.active {
          background: #ffffff;
          color: #0284c7;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
        }

        .authorized-count-badge {
          font-size: 0.7rem;
          font-weight: 800;
          padding: 3px 8px;
          border-radius: 12px;
        }

        .restricted-badge {
          display: inline-flex;
          align-items: center;
          gap: 3px;
          font-size: 0.6rem;
          font-weight: 800;
          color: #94a3b8;
          background: #f1f5f9;
          padding: 1px 5px;
          border-radius: 4px;
        }

        .quick-portal-item.restricted {
          opacity: 0.65;
          background: #f8fafc;
        }

        .quick-portal-item.restricted:hover {
          opacity: 0.9;
        }

        @media (max-width: 1024px) {
          .personas-cards-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .credentials-row {
            grid-template-columns: 1fr;
          }
          .quick-portals-grid {
            grid-template-columns: repeat(3, 1fr) !important;
          }
          .quick-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 10px;
          }
        }
      `}</style>
    </div>
  );
}
