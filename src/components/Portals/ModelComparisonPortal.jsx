import React, { useState } from 'react';
import { 
  GitCompare, 
  Satellite, 
  Layers, 
  CheckCircle2, 
  AlertTriangle, 
  HelpCircle, 
  ArrowRight,
  TrendingUp,
  MapPin,
  Sparkles,
  BarChart3
} from 'lucide-react';
import { MODEL_METRICS_DATA } from '../../data/mockData';

export default function ModelComparisonPortal({ 
  selectedDamId, 
  damsData, 
  setActivePortal 
}) {
  const currentDam = damsData[selectedDamId];
  const metrics = (MODEL_METRICS_DATA[selectedDamId] && MODEL_METRICS_DATA[selectedDamId].partial_breach) 
    ? MODEL_METRICS_DATA[selectedDamId].partial_breach 
    : MODEL_METRICS_DATA.hirakud.partial_breach;

  const [compareMode, setCompareMode] = useState('models'); // 'models' or 'gee'

  return (
    <div className="portal-page-container">
      {/* Header */}
      <div className="portal-header-row">
        <div>
          <div className="badge badge-emerald mb-2">
            <GitCompare size={12} />
            <span>PORTAL 5: MODEL COMPARISON & SATELLITE VALIDATION HUB</span>
          </div>
          <h1 className="portal-title">Hydrodynamic Model Validation & Uncertainty Analysis</h1>
          <p className="portal-subtitle">
            Quantitative inter-model comparison between Delft3D FM and SPH, cross-validated against Copernicus Sentinel-1 Synthetic Aperture Radar (SAR) via Google Earth Engine.
          </p>
        </div>

        <button 
          className="btn btn-primary"
          onClick={() => setActivePortal('impact_analysis')}
        >
          <span>Proceed to Impact & Damage</span>
          <ArrowRight size={16} />
        </button>
      </div>

      {/* Primary Agreement Score Hero Cards */}
      <div className="comparison-hero-grid">
        {/* Metric 1: IoU Spatial Agreement */}
        <div className="glass-panel p-5 hero-stat-card">
          <div className="flex-between">
            <span className="text-dim text-xs font-bold uppercase">Spatial Agreement Metric</span>
            <span className="badge badge-emerald">HIGH CORRELATION</span>
          </div>
          <div className="hero-stat-val text-emerald">
            {metrics.comparison.spatialAgreementIoU}%
          </div>
          <div className="hero-stat-label">Intersection over Union (IoU)</div>
          <p className="hero-stat-sub text-muted">
            High overlap between Eulerian finite-volume mesh (Delft3D) and Lagrangian particle fluid (SPH).
          </p>
        </div>

        {/* Metric 2: GEE Sentinel-1 Validation */}
        <div className="glass-panel p-5 hero-stat-card">
          <div className="flex-between">
            <span className="text-dim text-xs font-bold uppercase">Satellite Ground Truth Match</span>
            <span className="badge badge-cyan">SENTINEL-1 SAR</span>
          </div>
          <div className="hero-stat-val text-cyan">
            {metrics.satelliteValidation.modelVsGeeAgreementPercent}%
          </div>
          <div className="hero-stat-label">Model vs GEE Satellite Agreement</div>
          <p className="hero-stat-sub text-muted">
            Cross-validated against Google Earth Engine Sentinel-1 C-Band radar observed flood boundary.
          </p>
        </div>

        {/* Metric 3: Cohen's Kappa & CSI */}
        <div className="glass-panel p-5 hero-stat-card">
          <div className="flex-between">
            <span className="text-dim text-xs font-bold uppercase">Statistical Concordance</span>
            <span className="badge badge-purple">VALIDATED</span>
          </div>
          <div className="hero-stat-val text-purple">
            κ = {metrics.comparison.cohensKappa}
          </div>
          <div className="hero-stat-label">Cohen's Kappa Index (CSI: {metrics.comparison.criticalSuccessIndexCSI})</div>
          <p className="hero-stat-sub text-muted">
            Depth Mean Absolute Error: <strong>{metrics.comparison.depthMeanAbsErrorM}m</strong> | Velocity MAE: <strong>{metrics.comparison.velocityMeanAbsErrorMs} m/s</strong>
          </p>
        </div>
      </div>

      {/* Main Two Columns: Inter-Model Comparison vs GEE Satellite Ground Truth */}
      <div className="content-two-columns mt-4">
        
        {/* Left Column: Delft3D vs SPH Inter-Model Comparison Matrix */}
        <div className="glass-panel p-5">
          <div className="panel-title-bar">
            <div className="flex-align-gap">
              <Layers className="text-cyan" size={18} />
              <h2 className="panel-h2">Delft3D Flexible Mesh vs SPH Comparison Matrix</h2>
            </div>
            <span className="badge badge-cyan">Physical Formulations</span>
          </div>

          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Hydraulic Metric</th>
                  <th>Delft3D (2D SWE)</th>
                  <th>SPH (Lagrangian)</th>
                  <th>Variance / Difference</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Peak Water Depth (h_max)</strong></td>
                  <td className="font-mono text-cyan">{metrics.delft3d.maxDepthM} m</td>
                  <td className="font-mono text-purple">{metrics.sph.maxDepthM} m</td>
                  <td className="font-mono text-white">+0.28 m (SPH local pile-up)</td>
                </tr>
                <tr>
                  <td><strong>Average Flow Velocity</strong></td>
                  <td className="font-mono text-cyan">{metrics.delft3d.avgVelocityMs} m/s</td>
                  <td className="font-mono text-purple">{metrics.sph.avgVelocityMs} m/s</td>
                  <td className="font-mono text-white">+0.33 m/s</td>
                </tr>
                <tr>
                  <td><strong>Peak Breach Outflow</strong></td>
                  <td className="font-mono text-cyan">{metrics.delft3d.peakDischargeCumecs.toLocaleString()} m³/s</td>
                  <td className="font-mono text-purple">{metrics.sph.peakDischargeCumecs.toLocaleString()} m³/s</td>
                  <td className="font-mono text-white">+1,450 m³/s</td>
                </tr>
                <tr>
                  <td><strong>Total Flooded Extent</strong></td>
                  <td className="font-mono text-cyan">{metrics.delft3d.totalInundatedSqKm} km²</td>
                  <td className="font-mono text-purple">{metrics.sph.totalInundatedSqKm} km²</td>
                  <td className="font-mono text-white">+13.5 km² (Splash zones)</td>
                </tr>
                <tr>
                  <td><strong>Arrival at Burla / 1st Town</strong></td>
                  <td className="font-mono text-cyan">{metrics.delft3d.arrivalFirstSettlementHr * 60} mins</td>
                  <td className="font-mono text-purple">{metrics.sph.arrivalFirstSettlementHr * 60} mins</td>
                  <td className="font-mono text-amber">4 mins earlier in SPH</td>
                </tr>
                <tr>
                  <td><strong>Compute Time on GPU Cluster</strong></td>
                  <td className="font-mono text-emerald">{metrics.delft3d.computationalTimeMin} min</td>
                  <td className="font-mono text-amber">{metrics.sph.computationalTimeMin} min</td>
                  <td className="font-mono text-dim">SPH requires particle neighbor search</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="physics-insight-box mt-4">
            <span className="text-xs font-bold text-cyan uppercase">Physical Interpretation:</span>
            <p className="text-xs text-muted mt-1">
              {metrics.comparison.nearFieldDisagreementNotes}
            </p>
          </div>
        </div>

        {/* Right Column: Google Earth Engine (GEE) Sentinel-1 SAR Validation */}
        <div className="glass-panel p-5">
          <div className="panel-title-bar">
            <div className="flex-align-gap">
              <Satellite className="text-emerald" size={18} />
              <h2 className="panel-h2">Google Earth Engine (GEE) Sentinel-1 SAR</h2>
            </div>
            <span className="badge badge-emerald">Satellite Asset</span>
          </div>

          {/* GEE Satellite Telemetry Meta */}
          <div className="gee-metadata-grid">
            <div className="gee-meta-item">
              <span className="text-dim text-xs">Sensor Platform:</span>
              <strong className="text-white text-xs">{metrics.satelliteValidation.satellite}</strong>
            </div>
            <div className="gee-meta-item">
              <span className="text-dim text-xs">Orbit & Pass:</span>
              <strong className="text-white text-xs">{metrics.satelliteValidation.passDate}</strong>
            </div>
            <div className="gee-meta-item">
              <span className="text-dim text-xs">Polarization Mode:</span>
              <strong className="text-white text-xs">{metrics.satelliteValidation.polarization}</strong>
            </div>
            <div className="gee-meta-item">
              <span className="text-dim text-xs">Observed Inundation:</span>
              <strong className="text-emerald text-xs">{metrics.satelliteValidation.geeFloodExtentSqKm} km²</strong>
            </div>
          </div>

          {/* 3-Way Confidence Categorization */}
          <div className="confidence-breakdown mt-4">
            <h4 className="text-xs font-bold text-dim uppercase mb-3">3-Way Spatial Confidence Classification</h4>

            <div className="confidence-class-item high">
              <div className="flex-between">
                <div className="flex-align-gap">
                  <span className="status-dot green"></span>
                  <strong className="text-white text-xs">High Confidence (Delft3D + SPH + GEE Agree)</strong>
                </div>
                <span className="font-mono text-emerald font-bold text-xs">312.4 km² (88%)</span>
              </div>
              <p className="text-xs text-muted mt-1">
                Concurrence across numerical physics and satellite radar observation. High certainty for evacuation command.
              </p>
            </div>

            <div className="confidence-class-item moderate">
              <div className="flex-between">
                <div className="flex-align-gap">
                  <span className="status-dot amber"></span>
                  <strong className="text-white text-xs">Moderate Confidence (Simulated Flooding, Dense Canopy)</strong>
                </div>
                <span className="font-mono text-amber font-bold text-xs">{metrics.satelliteValidation.falseNegativeSqKm} km² (4%)</span>
              </div>
              <p className="text-xs text-muted mt-1">
                Forested riparian or dense urban building shade obstructing satellite SAR C-band radar backscatter.
              </p>
            </div>

            <div className="confidence-class-item uncertainty">
              <div className="flex-between">
                <div className="flex-align-gap">
                  <span className="status-dot purple"></span>
                  <strong className="text-white text-xs">High Uncertainty (Near-Field Wave Boundary Disagreement)</strong>
                </div>
                <span className="font-mono text-purple font-bold text-xs">{metrics.satelliteValidation.falsePositiveSqKm} km² (5%)</span>
              </div>
              <p className="text-xs text-muted mt-1">
                Minor differences between turbulent SPH particle splashing and Delft3D diffusive wetting-drying cells.
              </p>
            </div>
          </div>

          <div className="gee-verdict-card mt-4">
            <Sparkles size={16} className="text-emerald" />
            <div>
              <span className="text-xs font-bold text-emerald">{metrics.satelliteValidation.confidenceScore}</span>
              <p className="text-xs text-muted">
                Validation confirms simulation models reflect physical ground realities with &gt;90% accuracy.
              </p>
            </div>
          </div>

        </div>

      </div>

      <style>{`
        .comparison-hero-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          margin-bottom: 24px;
        }

        @media (max-width: 1024px) {
          .comparison-hero-grid {
            grid-template-columns: 1fr;
          }
        }

        .hero-stat-card {
          padding: 22px;
          border-radius: 12px;
          border-top: 4px solid #16a34a;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
        }

        .hero-stat-val {
          font-family: var(--font-sans);
          font-size: 2.3rem;
          font-weight: 800;
          line-height: 1.1;
          margin: 8px 0;
          letter-spacing: -0.02em;
        }

        .hero-stat-label {
          font-size: 0.875rem;
          font-weight: 700;
          color: #0f172a;
        }

        .hero-stat-sub {
          font-size: 0.8rem;
          color: #64748b;
          margin-top: 4px;
        }

        .physics-insight-box {
          background: #f0f9ff;
          border: 1px solid #bae6fd;
          border-radius: var(--radius-sm);
          padding: 14px 16px;
        }

        .gee-metadata-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: var(--radius-sm);
          padding: 14px 16px;
        }

        .gee-meta-item {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .confidence-breakdown {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .confidence-class-item {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 12px 14px;
          transition: all 0.15s;
        }

        .confidence-class-item:hover {
          background: #ffffff;
          border-color: #cbd5e1;
        }

        .confidence-class-item.high {
          border-left: 4px solid #16a34a;
        }

        .confidence-class-item.moderate {
          border-left: 4px solid #d97706;
        }

        .confidence-class-item.uncertainty {
          border-left: 4px solid #7c3aed;
        }

        .status-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }

        .status-dot.green { background: #16a34a; }
        .status-dot.amber { background: #d97706; }
        .status-dot.purple { background: #7c3aed; }

        .gee-verdict-card {
          display: flex;
          align-items: center;
          gap: 12px;
          background: #f0fdf4;
          border: 1px solid #bbf7d0;
          padding: 14px 16px;
          border-radius: 8px;
        }
      `}</style>
    </div>
  );
}
