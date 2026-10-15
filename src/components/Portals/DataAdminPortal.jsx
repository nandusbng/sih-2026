import React, { useState } from 'react';
import { 
  Database, 
  UploadCloud, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  RefreshCw, 
  FileText, 
  ShieldCheck, 
  ArrowRight,
  Layers,
  MapPin,
  Compass,
  FileCheck
} from 'lucide-react';

export default function DataAdminPortal({ 
  selectedDamId, 
  setSelectedDamId, 
  damsData, 
  setActivePortal 
}) {
  const currentDam = damsData[selectedDamId];
  const [selectedState, setSelectedState] = useState(currentDam.state);
  const [selectedBasin, setSelectedBasin] = useState(currentDam.basin);
  const [isAuditing, setIsAuditing] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [dragOver, setDragOver] = useState(false);

  const handleStateChange = (stateName) => {
    setSelectedState(stateName);
    if (stateName === 'Odisha') {
      setSelectedBasin('Mahanadi Basin');
      setSelectedDamId('hirakud');
    } else {
      setSelectedBasin('Tapi Basin');
      setSelectedDamId('ukai');
    }
  };

  const runQualityAudit = () => {
    setIsAuditing(true);
    setTimeout(() => {
      setIsAuditing(false);
    }, 1200);
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      const newItems = files.map(f => ({
        name: f.name,
        size: (f.size / (1024 * 1024)).toFixed(2) + ' MB',
        type: f.name.split('.').pop().toUpperCase(),
        timestamp: new Date().toLocaleTimeString(),
        status: 'Processed & Normalized'
      }));
      setUploadedFiles(prev => [...prev, ...newItems]);
    }
  };

  return (
    <div className="portal-page-container">
      {/* Page Title & Scope Header */}
      <div className="portal-header-row">
        <div>
          <div className="badge badge-cyan mb-2">
            <Database size={12} />
            <span>PORTAL 1: TECHNICAL MODELLING & DATA ADMINISTRATION</span>
          </div>
          <h1 className="portal-title">Dataset Discovery & Model Readiness Audit</h1>
          <p className="portal-subtitle">
            Configure project jurisdiction, discover open hydro-spatial datasets, ingest custom bathymetric/DEM files, and verify automated model readiness.
          </p>
        </div>

        <button 
          className="btn btn-primary"
          onClick={() => setActivePortal('scenario_composer')}
        >
          <span>Proceed to Scenario Creation</span>
          <ArrowRight size={16} />
        </button>
      </div>

      {/* Scope Hierarchy Selector Cards */}
      <div className="hierarchy-grid">
        {/* Step 1: State */}
        <div className="hierarchy-card">
          <span className="step-num">01</span>
          <label className="hierarchy-label">Select State</label>
          <select 
            value={selectedState} 
            onChange={(e) => handleStateChange(e.target.value)}
            className="hierarchy-select"
          >
            <option value="Odisha">Odisha</option>
            <option value="Gujarat">Gujarat</option>
          </select>
          <span className="hierarchy-meta">National Water Informatics Centre</span>
        </div>

        {/* Step 2: River Basin */}
        <div className="hierarchy-card">
          <span className="step-num">02</span>
          <label className="hierarchy-label">River / Basin</label>
          <select 
            value={selectedBasin} 
            disabled 
            className="hierarchy-select"
          >
            <option value={currentDam.basin}>{currentDam.basin}</option>
          </select>
          <span className="hierarchy-meta">CWC Hydro-Basin Polygon</span>
        </div>

        {/* Step 3: Dam / Reservoir */}
        <div className="hierarchy-card">
          <span className="step-num">03</span>
          <label className="hierarchy-label">Dam / Reservoir</label>
          <select 
            value={selectedDamId} 
            onChange={(e) => setSelectedDamId(e.target.value)}
            className="hierarchy-select highlight-select"
          >
            <option value="hirakud">Hirakud Dam & Reservoir</option>
            <option value="ukai">Ukai Dam (Vallabh Sagar)</option>
          </select>
          <span className="hierarchy-meta">{currentDam.specs.type}</span>
        </div>

        {/* Step 4: Downstream Study Area */}
        <div className="hierarchy-card">
          <span className="step-num">04</span>
          <label className="hierarchy-label">Downstream Reach</label>
          <div className="reach-badge">
            <MapPin size={14} className="text-cyan" />
            <span>{currentDam.downstreamReachKm} km reach ({currentDam.downstreamDistricts.length} districts)</span>
          </div>
          <span className="hierarchy-meta">{currentDam.downstreamDistricts.join(', ')}</span>
        </div>
      </div>

      {/* Main Grid: Data Quality Audit + Open Datasets Discovery */}
      <div className="content-two-columns">
        
        {/* Left Column: Automated Data Quality & Readiness Audit */}
        <div className="glass-panel p-5 audit-panel">
          <div className="panel-title-bar">
            <div className="flex-align-gap">
              <ShieldCheck className="text-cyan" size={20} />
              <h2 className="panel-h2">Model Readiness & Data Quality Engine</h2>
            </div>
            <button 
              className="btn btn-secondary btn-sm"
              onClick={runQualityAudit}
              disabled={isAuditing}
            >
              <RefreshCw size={14} className={isAuditing ? 'spin' : ''} />
              <span>{isAuditing ? 'Running Audit...' : 'Re-Run Audit'}</span>
            </button>
          </div>

          {/* Readiness Score Card */}
          <div className="score-hero-card">
            <div className="score-circle-wrapper">
              <div className="score-value">{currentDam.qualityAudit.score}%</div>
              <div className="score-label">DATASET READY</div>
            </div>

            <div className="score-breakdown">
              <div className="score-stat-box">
                <span className="stat-number text-emerald">{currentDam.qualityAudit.criticalErrors}</span>
                <span className="stat-label">Critical Errors</span>
              </div>
              <div className="score-stat-box">
                <span className="stat-number text-amber">{currentDam.qualityAudit.warnings}</span>
                <span className="stat-label">Warnings</span>
              </div>
              <div className="score-stat-box">
                <span className="stat-number text-cyan">9/9</span>
                <span className="stat-label">Layers Audited</span>
              </div>
            </div>
          </div>

          {/* Detailed Verification Checklist */}
          <div className="audit-checklist">
            <h3 className="checklist-heading">Pre-Simulation Integrity Verification</h3>
            
            <div className="check-item verified">
              <CheckCircle2 size={16} className="text-emerald" />
              <div className="check-text">
                <strong>Coordinate Reference System (CRS) Unified</strong>
                <p>Reprojected to UTM Zone {selectedDamId === 'hirakud' ? '44N (EPSG:32644)' : '43N (EPSG:32643)'} with sub-meter horizontal precision.</p>
              </div>
            </div>

            <div className="check-item verified">
              <CheckCircle2 size={16} className="text-emerald" />
              <div className="check-text">
                <strong>DEM Extent & Hydro-Enforcement</strong>
                <p>Continuous coverage across complete {currentDam.downstreamReachKm} km floodplain without artificial sinks or no-data gaps.</p>
              </div>
            </div>

            <div className="check-item verified">
              <CheckCircle2 size={16} className="text-emerald" />
              <div className="check-text">
                <strong>River Network Topological Continuity</strong>
                <p>River centerline topologically connected from dam toe through secondary spillway channels to delta tailwater.</p>
              </div>
            </div>

            <div className="check-item verified">
              <CheckCircle2 size={16} className="text-emerald" />
              <div className="check-text">
                <strong>Dam Georeferencing & Reservoir Polygons</strong>
                <p>Spillway axis exactly bisects reservoir boundary and downstream 2D hydrodynamic calculation grid.</p>
              </div>
            </div>

            {currentDam.qualityAudit.warnings > 0 && (
              <div className="check-item warning">
                <AlertTriangle size={16} className="text-amber" />
                <div className="check-text">
                  <strong className="text-amber">Cross-Section Bathymetry Synthetic Interpolation</strong>
                  <p>{currentDam.datasets.find(d => d.status === 'Warning')?.issue}</p>
                </div>
              </div>
            )}
          </div>

          <div className="recommendation-box">
            <span className="text-cyan font-bold text-xs uppercase">Engine Verdict:</span>
            <p className="text-sm mt-1 text-muted">{currentDam.qualityAudit.recommendation}</p>
          </div>
        </div>

        {/* Right Column: Custom Data Ingestion & Discovered Datasets */}
        <div className="right-data-column">
          
          {/* Custom Upload Dropzone */}
          <div 
            className={`glass-panel p-5 upload-dropzone ${dragOver ? 'drag-active' : ''}`}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFileUpload(e); }}
          >
            <div className="dropzone-content">
              <UploadCloud size={36} className="text-cyan mb-2" />
              <h3 className="text-base font-bold">Upload Custom Datasets or Missing Survey Files</h3>
              <p className="text-xs text-muted mb-3">
                Supports GeoTIFF (.tif), ESRI Shapefile (.shp/.zip), NetCDF (.nc), HEC-RAS cross-sections (.csv), and LiDAR point clouds.
              </p>
              
              <label className="btn btn-secondary btn-sm cursor-pointer">
                <span>Browse Local Files</span>
                <input 
                  type="file" 
                  multiple 
                  className="hidden-file-input" 
                  onChange={handleFileUpload}
                  accept=".tif,.geotiff,.shp,.zip,.nc,.csv,.geojson"
                />
              </label>
            </div>

            {uploadedFiles.length > 0 && (
              <div className="uploaded-list mt-3">
                <span className="text-xs text-dim uppercase font-bold">Uploaded Custom Assets:</span>
                {uploadedFiles.map((f, i) => (
                  <div key={i} className="uploaded-chip">
                    <FileCheck size={14} className="text-emerald" />
                    <span className="font-mono text-xs">{f.name}</span>
                    <span className="badge badge-emerald text-xs">{f.size}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Discovered Open Datasets Table */}
          <div className="glass-panel p-5 mt-4">
            <div className="flex-between mb-3">
              <div className="flex-align-gap">
                <Layers className="text-cyan" size={18} />
                <h3 className="text-base font-bold">Discovered Open Datasets Catalog</h3>
              </div>
              <span className="badge badge-cyan">{currentDam.datasets.length} Active Layers</span>
            </div>

            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Layer Name</th>
                    <th>Category</th>
                    <th>Format & CRS</th>
                    <th>Resolution</th>
                    <th>Integrity</th>
                  </tr>
                </thead>
                <tbody>
                  {currentDam.datasets.map((ds) => (
                    <tr key={ds.id}>
                      <td>
                        <strong className="text-white text-xs">{ds.name}</strong>
                      </td>
                      <td>
                        <span className="badge badge-cyan text-xs">{ds.category}</span>
                      </td>
                      <td>
                        <div className="text-xs font-mono text-muted">{ds.format}</div>
                        <div className="text-xs text-dim">{ds.crs}</div>
                      </td>
                      <td>
                        <span className="text-xs font-mono text-muted">{ds.resolution}</span>
                      </td>
                      <td>
                        {ds.status === 'Verified' ? (
                          <span className="badge badge-emerald">
                            <CheckCircle2 size={10} />
                            <span>100% OK</span>
                          </span>
                        ) : (
                          <span className="badge badge-amber">
                            <AlertTriangle size={10} />
                            <span>{ds.readiness}% Warning</span>
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>

      <style>{`
        .portal-page-container {
          padding: 24px;
          max-width: 1600px;
          margin: 0 auto;
        }

        .portal-header-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 24px;
          gap: 16px;
          flex-wrap: wrap;
        }

        .portal-title {
          font-family: var(--font-display);
          font-size: 1.75rem;
          font-weight: 800;
          letter-spacing: -0.02em;
          color: #ffffff;
        }

        .portal-subtitle {
          color: var(--text-muted);
          font-size: 0.875rem;
          max-width: 800px;
          margin-top: 4px;
        }

        .hierarchy-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 16px;
          margin-bottom: 24px;
        }

        .hierarchy-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-top: 3px solid #0284c7;
          border-radius: 12px;
          padding: 16px 18px;
          position: relative;
          box-shadow: var(--shadow-card);
          transition: all 0.2s ease;
        }

        .hierarchy-card:hover {
          box-shadow: var(--shadow-hover);
          transform: translateY(-2px);
        }

        .step-num {
          position: absolute;
          top: 12px;
          right: 14px;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #e0f2fe;
          color: #0284c7;
          font-family: var(--font-sans);
          font-size: 0.75rem;
          font-weight: 800;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .hierarchy-label {
          display: block;
          font-size: 0.75rem;
          font-weight: 700;
          color: #475569;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 6px;
        }

        .hierarchy-select {
          width: 100%;
          background: #ffffff;
          color: #0f172a;
          border: 1px solid #cbd5e1;
          border-radius: var(--radius-sm);
          padding: 8px 10px;
          font-size: 0.875rem;
          font-weight: 600;
          outline: none;
          cursor: pointer;
        }

        .highlight-select {
          border-color: #0284c7;
          color: #0284c7;
        }

        .reach-badge {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.85rem;
          font-weight: 600;
          color: #0f172a;
          padding: 6px 0;
        }

        .hierarchy-meta {
          display: block;
          font-size: 0.7rem;
          color: #64748b;
          margin-top: 6px;
        }

        .content-two-columns {
          display: grid;
          grid-template-columns: 440px 1fr;
          gap: 24px;
        }

        @media (max-width: 1100px) {
          .content-two-columns {
            grid-template-columns: 1fr;
          }
        }

        .audit-panel {
          display: flex;
          flex-direction: column;
        }

        .panel-title-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .flex-align-gap {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .flex-between {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .panel-h2 {
          font-size: 1.05rem;
          font-weight: 700;
          color: #0f172a;
        }

        .score-hero-card {
          display: flex;
          align-items: center;
          gap: 20px;
          background: #f0f9ff;
          border: 1px solid #bae6fd;
          border-radius: var(--radius-md);
          padding: 16px 20px;
          margin-bottom: 20px;
        }

        .score-circle-wrapper {
          text-align: center;
        }

        .score-value {
          font-family: var(--font-sans);
          font-size: 2.2rem;
          font-weight: 900;
          color: #0284c7;
          line-height: 1;
        }

        .score-label {
          font-size: 0.65rem;
          color: #64748b;
          font-weight: 700;
          letter-spacing: 0.05em;
          margin-top: 4px;
        }

        .score-breakdown {
          display: flex;
          gap: 16px;
          flex: 1;
          justify-content: space-around;
        }

        .score-stat-box {
          text-align: center;
        }

        .stat-number {
          display: block;
          font-family: var(--font-mono);
          font-size: 1.35rem;
          font-weight: 800;
          color: #0f172a;
        }

        .stat-label {
          font-size: 0.7rem;
          color: #64748b;
        }

        .audit-checklist {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 20px;
        }

        .checklist-heading {
          font-size: 0.75rem;
          font-weight: 700;
          color: #475569;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 4px;
        }

        .check-item {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          padding: 10px 12px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: var(--radius-sm);
        }

        .check-item.warning {
          background: #fefce8;
          border-color: #fef08a;
        }

        .check-text strong {
          display: block;
          font-size: 0.825rem;
          color: #0f172a;
        }

        .check-text p {
          font-size: 0.75rem;
          color: #475569;
          margin-top: 2px;
        }

        .recommendation-box {
          background: #f0f9ff;
          border-left: 3px solid #0284c7;
          padding: 10px 14px;
          border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
          margin-top: auto;
          color: #0369a1;
        }

        .upload-dropzone {
          border: 2px dashed rgba(56, 189, 248, 0.3);
          text-align: center;
          transition: all 0.2s;
        }

        .upload-dropzone.drag-active {
          border-color: #38bdf8;
          background: rgba(56, 189, 248, 0.08);
        }

        .hidden-file-input {
          display: none;
        }

        .uploaded-list {
          display: flex;
          flex-direction: column;
          gap: 6px;
          text-align: left;
        }

        .uploaded-chip {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: rgba(255, 255, 255, 0.04);
          padding: 6px 10px;
          border-radius: var(--radius-sm);
        }

        .table-responsive {
          overflow-x: auto;
        }

        .spin {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
