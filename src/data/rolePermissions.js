// Role-Based Access Control (RBAC) System for VarunAstra
// Defines authorized pages/portals for each user persona profile

export const ROLE_DEFINITIONS = {
  technical: {
    id: 'technical',
    title: 'Technical Modeler / Admin',
    shortTitle: 'Technical Admin',
    dept: 'CWC Hydrology & Compute Cluster',
    desc: 'Full access to Delft3D-FM, SPH particle solvers, GEE SAR validation & mesh grids',
    badgeColor: '#0284c7',
    bgLight: '#e0f2fe',
    email: 'admin@varunastra.gov.in',
    defaultPortal: 'data_admin',
    allowedPortals: [
      'data_admin',
      'scenario_composer',
      'simulation_engine',
      'model_comparison',
      'export_reports'
    ]
  },
  operator: {
    id: 'operator',
    title: 'Dam Water Engineer',
    shortTitle: 'Dam Engineer',
    dept: 'State Water Resources Dept (WRD)',
    desc: 'Reservoir water levels, spillway gates, rule curves & inflow/outflow dispatch',
    badgeColor: '#059669',
    bgLight: '#d1fae5',
    email: 'engineer@cwc.gov.in',
    defaultPortal: 'dam_operator',
    allowedPortals: [
      'dam_operator',
      'scenario_composer',
      'export_reports'
    ]
  },
  hadr: {
    id: 'hadr',
    title: 'NDMA / HADR Commander',
    shortTitle: 'HADR Commander',
    dept: 'Disaster Management & NDRF Command',
    desc: 'Downstream loss & damage triage, evacuation routing & boat team dispatch',
    badgeColor: '#dc2626',
    bgLight: '#fee2e2',
    email: 'ndma.commander@gov.in',
    defaultPortal: 'hadr_priority',
    allowedPortals: [
      'impact_analysis',
      'hadr_priority',
      'citizen_warning',
      'export_reports'
    ]
  },
  citizen: {
    id: 'citizen',
    title: 'Public Citizen Access',
    shortTitle: 'Public Citizen',
    dept: 'National Public Early Warning System',
    desc: 'Common Alerting Protocol (CAP) sirens, safe shelters & evacuation maps',
    badgeColor: '#7c3aed',
    bgLight: '#ede9fe',
    email: 'public.alert@gov.in',
    defaultPortal: 'citizen_warning',
    allowedPortals: [
      'citizen_warning'
    ]
  }
};

export const ALL_PORTALS_CONFIG = [
  { id: 'data_admin', num: '01', title: 'Data Admin & Audit', label: '1. Data Admin & Audit', color: '#0284c7' },
  { id: 'dam_operator', num: '02', title: 'Dam Operations', label: '2. Dam Operations', color: '#059669' },
  { id: 'scenario_composer', num: '03', title: 'Scenario Composer', label: '3. Scenario Composer', color: '#7c3aed' },
  { id: 'simulation_engine', num: '04', title: 'Delft3D + SPH Engine', label: '4. Delft3D + SPH Engine', color: '#0891b2' },
  { id: 'model_comparison', num: '05', title: 'Satellite & Validation', label: '5. Satellite & Comparison', color: '#4f46e5' },
  { id: 'impact_analysis', num: '06', title: 'Loss & Damage', label: '6. Loss & Damage', color: '#d97706' },
  { id: 'hadr_priority', num: '07', title: 'HADR Action Priorities', label: '7. HADR Action Priorities', color: '#dc2626' },
  { id: 'citizen_warning', num: '08', title: 'Public Citizen Warning', label: '8. Public Citizen Warning', color: '#0284c7' },
  { id: 'export_reports', num: '09', title: 'GIS Export & Reports', label: '9. GIS Export & Reports', color: '#334155' }
];

export function isPortalAllowedForRole(portalId, roleId) {
  const role = ROLE_DEFINITIONS[roleId] || ROLE_DEFINITIONS.technical;
  return role.allowedPortals.includes(portalId);
}

export function getAllowedPortalIds(roleId) {
  const role = ROLE_DEFINITIONS[roleId] || ROLE_DEFINITIONS.technical;
  return role.allowedPortals;
}

export function getDefaultPortalForRole(roleId) {
  const role = ROLE_DEFINITIONS[roleId] || ROLE_DEFINITIONS.technical;
  return role.defaultPortal;
}
