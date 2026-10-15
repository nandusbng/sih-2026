import React, { useEffect, useRef, useState, useCallback } from 'react';
import { 
  Waves, 
  ArrowRight, 
  Play, 
  Pause, 
  RotateCcw, 
  ShieldCheck, 
  Activity, 
  AlertTriangle, 
  ChevronDown, 
  CheckCircle2, 
  Droplets, 
  MapPin, 
  Gauge,
  Sliders,
  Cpu,
  Layers,
  Sparkles,
  Compass
} from 'lucide-react';

const TOTAL_FRAMES = 150;

const getFrameUrl = (index) => {
  const padded = String(index).padStart(3, '0');
  return `/dam_frames/frame_${padded}.webp`;
};

export default function DamBreakLandingPage({ onEnterSystem, onOpenLoginRole }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  
  // Stable refs that NEVER cause re-renders or resets
  const imagesRef = useRef(new Array(TOTAL_FRAMES + 1));
  const currentFrameRef = useRef(1);
  const targetFrameRef = useRef(1);
  const renderedFrameRef = useRef(1);
  const isPlayingRef = useRef(false);

  // UI display state (for HUD text and labels)
  const [currentFrame, setCurrentFrame] = useState(1);
  const [loadProgress, setLoadProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  // Pure canvas render function
  const drawFrame = useCallback((frameIndex) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Use current frame or nearest loaded frame
    let img = imagesRef.current[frameIndex];
    if (!img || !img.complete || img.naturalWidth === 0) {
      for (let offset = 1; offset < TOTAL_FRAMES; offset++) {
        const prev = imagesRef.current[frameIndex - offset];
        if (prev && prev.complete && prev.naturalWidth > 0) {
          img = prev;
          break;
        }
        const next = imagesRef.current[frameIndex + offset];
        if (next && next.complete && next.naturalWidth > 0) {
          img = next;
          break;
        }
      }
    }

    if (!img || !img.complete || img.naturalWidth === 0) return;

    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    const imgWidth = img.naturalWidth;
    const imgHeight = img.naturalHeight;

    const imgRatio = imgWidth / imgHeight;
    const canvasRatio = canvasWidth / canvasHeight;

    let drawWidth, drawHeight, offsetX, offsetY;

    if (canvasRatio > imgRatio) {
      drawWidth = canvasWidth;
      drawHeight = canvasWidth / imgRatio;
      offsetX = 0;
      offsetY = (canvasHeight - drawHeight) / 2;
    } else {
      drawWidth = canvasHeight * imgRatio;
      drawHeight = canvasHeight;
      offsetX = (canvasWidth - drawWidth) / 2;
      offsetY = 0;
    }

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
  }, []);

  // Handle canvas sizing
  const updateCanvasDimensions = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    drawFrame(currentFrameRef.current);
  }, [drawFrame]);

  // Preload frames once on mount - NEVER runs again
  useEffect(() => {
    let isCancelled = false;
    let loadedCount = 0;

    // 1. Load initial frame immediately
    const firstImg = new Image();
    firstImg.src = getFrameUrl(1);
    firstImg.onload = () => {
      if (isCancelled) return;
      imagesRef.current[1] = firstImg;
      loadedCount++;
      setLoadProgress(1);
      updateCanvasDimensions();
      drawFrame(1);
    };

    // 2. Load keyframes first for instant fluidity, then remaining frames
    const keyframes = [];
    for (let i = 2; i <= TOTAL_FRAMES; i += 3) keyframes.push(i);
    for (let i = 2; i <= TOTAL_FRAMES; i++) {
      if (!keyframes.includes(i)) keyframes.push(i);
    }

    const batchSize = 6;
    let batchIndex = 0;

    const loadNextBatch = () => {
      if (isCancelled || batchIndex >= keyframes.length) return;
      const batch = keyframes.slice(batchIndex, batchIndex + batchSize);
      batchIndex += batchSize;

      let completedInBatch = 0;
      batch.forEach((frameNum) => {
        const img = new Image();
        img.src = getFrameUrl(frameNum);
        img.onload = () => {
          if (isCancelled) return;
          imagesRef.current[frameNum] = img;
          loadedCount++;
          const pct = Math.round((loadedCount / TOTAL_FRAMES) * 100);
          setLoadProgress(pct);
          if (pct >= 90) setIsLoaded(true);

          // If current frame being viewed just loaded, refresh canvas
          if (frameNum === currentFrameRef.current) {
            drawFrame(frameNum);
          }

          completedInBatch++;
          if (completedInBatch === batch.length) {
            loadNextBatch();
          }
        };
        img.onerror = () => {
          completedInBatch++;
          if (completedInBatch === batch.length) {
            loadNextBatch();
          }
        };
      });
    };

    loadNextBatch();

    return () => {
      isCancelled = true;
    };
  }, [drawFrame, updateCanvasDimensions]);

  // Handle window resize
  useEffect(() => {
    window.addEventListener('resize', updateCanvasDimensions);
    updateCanvasDimensions();
    return () => window.removeEventListener('resize', updateCanvasDimensions);
  }, [updateCanvasDimensions]);

  // Silky 60fps Lerp Animation & Scroll Engine
  useEffect(() => {
    let animId;
    let isRunning = true;

    // Scroll listener updates target frame only - NEVER alters scroll position
    const handleScroll = () => {
      const container = containerRef.current;
      if (!container) return;

      const scrollTop = window.scrollY;
      const maxScroll = container.scrollHeight - window.innerHeight;
      if (maxScroll <= 0) return;

      const progress = Math.min(Math.max(scrollTop / maxScroll, 0), 1);
      const target = Math.min(Math.max(Math.round(progress * (TOTAL_FRAMES - 1)) + 1, 1), TOTAL_FRAMES);
      targetFrameRef.current = target;
    };

    // Auto-pause if user scrolls manually
    const handleUserInteraction = () => {
      if (isPlayingRef.current) {
        isPlayingRef.current = false;
        setIsPlaying(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('wheel', handleUserInteraction, { passive: true });
    window.addEventListener('touchmove', handleUserInteraction, { passive: true });

    // Initial check
    handleScroll();

    // Smooth render tick loop
    const tick = () => {
      if (!isRunning) return;

      const diff = targetFrameRef.current - renderedFrameRef.current;
      if (Math.abs(diff) > 0.05) {
        // High responsive lerp factor: 0.35 ensures snappy, responsive feel without lag
        renderedFrameRef.current += diff * 0.35;
        const frameToDraw = Math.min(Math.max(Math.round(renderedFrameRef.current), 1), TOTAL_FRAMES);

        if (frameToDraw !== currentFrameRef.current) {
          currentFrameRef.current = frameToDraw;
          drawFrame(frameToDraw);
          setCurrentFrame(frameToDraw);
        }
      }

      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);

    return () => {
      isRunning = false;
      cancelAnimationFrame(animId);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('wheel', handleUserInteraction);
      window.removeEventListener('touchmove', handleUserInteraction);
    };
  }, [drawFrame]);

  // Auto-play feature
  useEffect(() => {
    isPlayingRef.current = isPlaying;
    if (!isPlaying) return;

    const interval = setInterval(() => {
      const container = containerRef.current;
      if (!container) return;

      const maxScroll = container.scrollHeight - window.innerHeight;
      let nextFrame = currentFrameRef.current + 1;
      if (nextFrame > TOTAL_FRAMES) {
        nextFrame = 1;
      }

      const targetY = ((nextFrame - 1) / (TOTAL_FRAMES - 1)) * maxScroll;
      window.scrollTo({ top: targetY, behavior: 'auto' });
    }, 45);

    return () => clearInterval(interval);
  }, [isPlaying]);

  const togglePlay = () => {
    setIsPlaying((prev) => !prev);
  };

  const handleReset = () => {
    setIsPlaying(false);
    isPlayingRef.current = false;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    targetFrameRef.current = 1;
    renderedFrameRef.current = 1;
    currentFrameRef.current = 1;
    drawFrame(1);
    setCurrentFrame(1);
  };

  // Stage narrative based on active frame
  const getStageInfo = () => {
    if (currentFrame <= 35) {
      return {
        stageNum: '01',
        title: 'STRUCTURAL EQUILIBRIUM & SURCHARGE',
        subtitle: 'Normal Full Reservoir Level (582.47m) // Pore Pressure Peak',
        status: 'MONITORING',
        statusColor: '#0284c7',
        inflow: '2,850 m³/s',
        discharge: '1,680 m³/s',
        storage: '86.4 MCM (99.8%)',
        desc: 'Coupled hydrodynamic telemetry records extreme monsoon inflow. Hydrostatic thrust forces approach shear friction resistance limits across masonry monoliths.'
      };
    } else if (currentFrame <= 80) {
      return {
        stageNum: '02',
        title: 'MONOLITH FAILURE & BREACH INITIATION',
        subtitle: 'Froehlich / Von Thun Dynamic Trapezoidal Breach Inflow',
        status: 'BREACH IN PROGRESS',
        statusColor: '#ea580c',
        inflow: '4,100 m³/s',
        discharge: '14,250 m³/s',
        storage: 'Discharging Rapidly',
        desc: 'Tension crack propagation triggers structural sliding of Monolith M-04. 2D Shallow Water Equations calculate massive discharge expansion into the tailwater gorge.'
      };
    } else if (currentFrame <= 125) {
      return {
        stageNum: '03',
        title: 'LAGRANGIAN TSUNAMI WAVE PROPAGATION',
        subtitle: '14.5M DualSPHysics Particles // High-Velocity Shockfront',
        status: 'SUPER-CRITICAL WAVE',
        statusColor: '#dc2626',
        inflow: 'Overtopping',
        discharge: '19,800 m³/s',
        storage: 'Wave Velocity: 11.8 m/s',
        desc: 'Catastrophic dam-break wave rushes downstream through Mutha River canyon. High fluid kinetic energy stresses riverbed infrastructure, bridges, and intake structures.'
      };
    } else {
      return {
        stageNum: '04',
        title: 'VALLEY INUNDATION & EVACUATION COMMAND',
        subtitle: 'Delft3D Flexible Mesh // Downstream Urban Settlement Triage',
        status: 'HADR ACTION ACTIVE',
        statusColor: '#7c3aed',
        inflow: 'Crest Passed',
        discharge: 'Flooding Reach',
        storage: 'Peak Submergence 5.4m',
        desc: 'Downstream flood wave reaches urban riverbanks. VarunAstra automated triage directs NDRF boat teams, safe shelter routing, and citizen early warning sirens.'
      };
    }
  };

  const stage = getStageInfo();

  return (
    <div className="landing-root" ref={containerRef}>
      
      {/* Sticky Fullscreen Canvas Viewport */}
      <div className="canvas-viewport">
        <canvas ref={canvasRef} className="frame-canvas" />

        {/* Cinematic Gradient Overlays */}
        <div className="vignette-overlay" />
        <div className="top-nav-scrim" />
        <div className="bottom-hud-scrim" />

        {/* Top Floating Glass Header */}
        <header className="landing-top-bar">
          <div className="brand-group">
            <div className="brand-logo-wrap">
              <img src="/lo.png" alt="VARUNASTRA" className="brand-logo-img" />
            </div>
            <div>
              <div className="brand-title-row">
                <span className="brand-name">VARUNASTRA</span>
                <span className="sih-tag">SIH 2026 // PS-02</span>
              </div>
              <span className="brand-sub">
                National Hydrodynamic Flood Intelligence &amp; Dam-Break Simulation System
              </span>
            </div>
          </div>

          <div className="top-nav-actions">
            {/* Live Frame Indicator */}
            <div className="frame-counter-pill">
              <span className="pulsing-live-dot" />
              <span>SIMULATION FRAME: <strong>{String(currentFrame).padStart(3, '0')}</strong> / {TOTAL_FRAMES}</span>
              <span className="counter-time">T + {Math.floor((currentFrame / TOTAL_FRAMES) * 24)}h 00m</span>
            </div>

            {/* Direct Enter Button */}
            <button 
              type="button" 
              className="enter-system-btn"
              onClick={onEnterSystem}
            >
              <span>Enter VarunAstra</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </header>

        {/* Dynamic Storytelling HUD Cards based on Scroll Progress */}
        <div className="story-content-layer">
          
          {/* Main Hero Header (Visible predominantly at start) */}
          <div className={`hero-intro-card ${currentFrame > 22 ? 'fade-out' : 'fade-in'}`}>
            <div className="kicker-pill">
              <Sparkles size={14} color="#38bdf8" />
              <span>NEXT-GEN HYDRAULIC TWIN &amp; DISASTER INTELLIGENCE</span>
            </div>
            <h1 className="hero-heading">
              Witness Concrete Dam Breach &amp; Flood Wave Propagation
            </h1>
            <p className="hero-subheading">
              Coupling <strong>Delft3D Flexible Mesh</strong> 2D Shallow Water Equations with 
              <strong> DualSPHysics</strong> Lagrangian particle solvers to model catastrophic dam failures, 
              downstream flood arrival times, and automated evacuation priorities.
            </p>

            <div className="hero-cta-row">
              <button 
                type="button" 
                className="primary-hero-btn"
                onClick={onEnterSystem}
              >
                <span>Launch VarunAstra Workspace</span>
                <ArrowRight size={18} />
              </button>
              
              <button 
                type="button" 
                className="secondary-hero-btn"
                onClick={() => {
                  const container = containerRef.current;
                  if (container) {
                    window.scrollTo({ top: window.innerHeight * 1.5, behavior: 'smooth' });
                  }
                }}
              >
                <span>Scroll to Witness Failure</span>
                <ChevronDown size={18} />
              </button>
            </div>
          </div>

          {/* Dynamic Stage Telemetry Card (Active across all frames) */}
          <div className={`stage-telemetry-card ${currentFrame > 15 && currentFrame < 132 ? 'visible' : 'hidden'}`}>
            <div className="stage-card-header">
              <div className="stage-num-badge" style={{ backgroundColor: `${stage.statusColor}22`, color: stage.statusColor, borderColor: `${stage.statusColor}55` }}>
                STAGE {stage.stageNum}
              </div>
              <div className="stage-status-badge" style={{ backgroundColor: stage.statusColor }}>
                {stage.status}
              </div>
            </div>

            <h2 className="stage-card-title">{stage.title}</h2>
            <div className="stage-card-subtitle">{stage.subtitle}</div>
            <p className="stage-card-desc">{stage.desc}</p>

            <div className="stage-metrics-grid">
              <div className="metric-box">
                <span className="metric-lbl">Reservoir Inflow</span>
                <strong className="metric-val">{stage.inflow}</strong>
              </div>
              <div className="metric-box">
                <span className="metric-lbl">Breach Outflow</span>
                <strong className="metric-val" style={{ color: stage.statusColor }}>{stage.discharge}</strong>
              </div>
              <div className="metric-box">
                <span className="metric-lbl">Hydrodynamic State</span>
                <strong className="metric-val">{stage.storage}</strong>
              </div>
            </div>
          </div>

          {/* Final Callout Card (Visible when reaching the end of the simulation) */}
          <div className={`final-action-card ${currentFrame >= 132 ? 'active' : ''}`}>
            <div className="final-card-inner">
              <div className="final-icon-circle">
                <ShieldCheck size={32} color="#10b981" />
              </div>
              <h3>Simulation Completed // Downstream Valley Inundated</h3>
              <p>
                The flood wave has propagated 35 km downstream. Access the live 9-portal operational command center 
                to analyze Delft3D grid outputs, inspect evacuation routes, and dispatch NDRF boat teams.
              </p>
              
              <div className="final-btn-row">
                <button 
                  type="button" 
                  className="final-enter-btn"
                  onClick={onEnterSystem}
                >
                  <span>Sign In &amp; Open Workspace</span>
                  <ArrowRight size={18} />
                </button>
                <button 
                  type="button" 
                  className="final-replay-btn"
                  onClick={handleReset}
                >
                  <RotateCcw size={16} />
                  <span>Replay Simulation</span>
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Interactive HUD & Scrubber Bar */}
        <div className="bottom-hud-bar">
          
          {/* Play / Pause / Reset Controls */}
          <div className="hud-controls-left">
            <button 
              type="button" 
              className={`hud-icon-btn ${isPlaying ? 'playing' : ''}`}
              onClick={togglePlay}
              title={isPlaying ? 'Pause Animation' : 'Auto Play Simulation'}
            >
              {isPlaying ? <Pause size={18} /> : <Play size={18} />}
              <span>{isPlaying ? 'Pause' : 'Auto Play'}</span>
            </button>

            <button 
              type="button" 
              className="hud-icon-btn"
              onClick={handleReset}
              title="Reset to Initial Frame"
            >
              <RotateCcw size={16} />
              <span>Reset</span>
            </button>
          </div>

          {/* Interactive Timeline Scrubber Slider */}
          <div className="timeline-scrubber-center">
            <div className="scrubber-track-row">
              <span className="scrub-label">T+0h</span>
              <input 
                type="range"
                min="1"
                max={TOTAL_FRAMES}
                value={currentFrame}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  const container = containerRef.current;
                  if (container) {
                    const maxScroll = container.scrollHeight - window.innerHeight;
                    const targetY = ((val - 1) / (TOTAL_FRAMES - 1)) * maxScroll;
                    window.scrollTo({ top: targetY, behavior: 'auto' });
                  }
                  targetFrameRef.current = val;
                  renderedFrameRef.current = val;
                  currentFrameRef.current = val;
                  drawFrame(val);
                  setCurrentFrame(val);
                }}
                className="scrubber-slider"
              />
              <span className="scrub-label">T+24h</span>
            </div>

            <div className="scrubber-ticks-labels">
              <span className={currentFrame <= 35 ? 'active' : ''}>1. Reservoir FRL</span>
              <span className={currentFrame > 35 && currentFrame <= 80 ? 'active' : ''}>2. Monolith Shear</span>
              <span className={currentFrame > 80 && currentFrame <= 125 ? 'active' : ''}>3. Tsunami Shockwave</span>
              <span className={currentFrame > 125 ? 'active' : ''}>4. Inundation &amp; Evacuation</span>
            </div>
          </div>

          {/* Scroll Hint & Loading Pill */}
          <div className="hud-status-right">
            {!isLoaded && (
              <div className="preload-indicator">
                <span className="spinner-dot" />
                <span>Buffering {loadProgress}%</span>
              </div>
            )}
            <div className="scroll-indicator-pill">
              <span className="scroll-mouse-icon">
                <span className="wheel" />
              </span>
              <span>Scroll down smoothly</span>
            </div>
          </div>

        </div>

      </div>

      <style>{`
        .landing-root {
          position: relative;
          height: 480vh;
          background: #090d16;
          color: #ffffff;
          font-family: var(--font-sans, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif);
        }

        .canvas-viewport {
          position: sticky;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }

        .frame-canvas {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          z-index: 1;
        }

        /* Scrims & Vignettes for cinematic contrast */
        .vignette-overlay {
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at center, rgba(15, 23, 42, 0.15) 0%, rgba(9, 13, 22, 0.75) 100%);
          z-index: 2;
          pointer-events: none;
        }

        .top-nav-scrim {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 140px;
          background: linear-gradient(180deg, rgba(9, 13, 22, 0.95) 0%, rgba(9, 13, 22, 0) 100%);
          z-index: 2;
          pointer-events: none;
        }

        .bottom-hud-scrim {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 180px;
          background: linear-gradient(0deg, rgba(9, 13, 22, 0.95) 0%, rgba(9, 13, 22, 0) 100%);
          z-index: 2;
          pointer-events: none;
        }

        /* Top Header */
        .landing-top-bar {
          position: relative;
          z-index: 10;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 18px 36px;
        }

        .brand-group {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .brand-logo-wrap {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          background: rgba(11, 19, 43, 0.85);
          border: 1px solid rgba(56, 189, 248, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 0 20px rgba(56, 189, 248, 0.25);
          overflow: hidden;
          padding: 2px;
        }

        .brand-logo-img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }

        .brand-title-row {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .brand-name {
          font-size: 1.35rem;
          font-weight: 900;
          letter-spacing: 0.06em;
          background: linear-gradient(135deg, #ffffff 0%, #bae6fd 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .sih-tag {
          font-size: 0.675rem;
          font-weight: 800;
          padding: 2px 8px;
          border-radius: 6px;
          background: rgba(249, 115, 22, 0.2);
          border: 1px solid rgba(249, 115, 22, 0.5);
          color: #fb923c;
          letter-spacing: 0.04em;
        }

        .brand-sub {
          font-size: 0.725rem;
          color: #94a3b8;
          font-weight: 500;
        }

        .top-nav-actions {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .frame-counter-pill {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 6px 14px;
          background: rgba(15, 23, 42, 0.85);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 20px;
          font-size: 0.75rem;
          color: #e2e8f0;
          backdrop-filter: blur(12px);
        }

        .pulsing-live-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #ef4444;
          box-shadow: 0 0 8px #ef4444;
          animation: pulseDot 1.5s infinite;
        }

        @keyframes pulseDot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.85); }
        }

        .counter-time {
          color: #38bdf8;
          font-weight: 700;
          border-left: 1px solid rgba(255, 255, 255, 0.15);
          padding-left: 8px;
        }

        .enter-system-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%);
          color: #ffffff;
          border: none;
          padding: 10px 20px;
          border-radius: 8px;
          font-size: 0.85rem;
          font-weight: 800;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 4px 14px rgba(2, 132, 199, 0.4);
        }

        .enter-system-btn:hover {
          background: #0ea5e9;
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(14, 165, 233, 0.5);
        }

        /* Story Overlay Layer */
        .story-content-layer {
          position: relative;
          z-index: 5;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 0 48px;
          pointer-events: none;
        }

        /* Hero Intro Card */
        .hero-intro-card {
          max-width: 680px;
          pointer-events: auto;
          transition: opacity 0.4s ease, transform 0.4s ease;
        }

        .hero-intro-card.fade-out {
          opacity: 0;
          transform: translateY(-20px);
          pointer-events: none;
        }

        .hero-intro-card.fade-in {
          opacity: 1;
          transform: translateY(0);
        }

        .kicker-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 4px 12px;
          border-radius: 20px;
          background: rgba(56, 189, 248, 0.15);
          border: 1px solid rgba(56, 189, 248, 0.4);
          color: #38bdf8;
          font-size: 0.75rem;
          font-weight: 800;
          letter-spacing: 0.05em;
          margin-bottom: 16px;
        }

        .hero-heading {
          font-size: 3.2rem;
          font-weight: 900;
          line-height: 1.1;
          letter-spacing: -0.02em;
          margin: 0 0 16px 0;
          background: linear-gradient(180deg, #ffffff 40%, #cbd5e1 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          text-shadow: 0 4px 24px rgba(0, 0, 0, 0.6);
        }

        .hero-subheading {
          font-size: 1.05rem;
          line-height: 1.6;
          color: #cbd5e1;
          margin: 0 0 28px 0;
          text-shadow: 0 2px 10px rgba(0, 0, 0, 0.8);
        }

        .hero-cta-row {
          display: flex;
          gap: 14px;
          align-items: center;
        }

        .primary-hero-btn {
          display: flex;
          align-items: center;
          gap: 10px;
          background: #0284c7;
          color: #ffffff;
          border: none;
          padding: 14px 28px;
          border-radius: 10px;
          font-size: 1rem;
          font-weight: 800;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 6px 24px rgba(2, 132, 199, 0.5);
        }

        .primary-hero-btn:hover {
          background: #0ea5e9;
          transform: translateY(-2px);
          box-shadow: 0 8px 28px rgba(14, 165, 233, 0.6);
        }

        .secondary-hero-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(15, 23, 42, 0.7);
          color: #ffffff;
          border: 1px solid rgba(255, 255, 255, 0.25);
          padding: 14px 22px;
          border-radius: 10px;
          font-size: 0.95rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
          backdrop-filter: blur(12px);
        }

        .secondary-hero-btn:hover {
          background: rgba(255, 255, 255, 0.15);
          border-color: #ffffff;
        }

        /* Dynamic Stage Telemetry Card */
        .stage-telemetry-card {
          position: absolute;
          right: 48px;
          top: 50%;
          transform: translateY(-50%);
          width: 440px;
          background: rgba(15, 23, 42, 0.85);
          border: 1px solid rgba(255, 255, 255, 0.18);
          border-radius: 16px;
          padding: 24px;
          backdrop-filter: blur(16px);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.6);
          pointer-events: auto;
          transition: opacity 0.3s ease, transform 0.3s ease;
        }

        .stage-telemetry-card.hidden {
          opacity: 0;
          pointer-events: none;
          transform: translateY(-45%);
        }

        .stage-telemetry-card.visible {
          opacity: 1;
          transform: translateY(-50%);
        }

        .stage-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }

        .stage-num-badge {
          font-size: 0.7rem;
          font-weight: 800;
          padding: 3px 10px;
          border-radius: 12px;
          border: 1px solid;
          letter-spacing: 0.05em;
        }

        .stage-status-badge {
          font-size: 0.675rem;
          font-weight: 800;
          color: #ffffff;
          padding: 3px 8px;
          border-radius: 6px;
          letter-spacing: 0.03em;
        }

        .stage-card-title {
          font-size: 1.25rem !important;
          font-weight: 900 !important;
          color: #ffffff !important;
          -webkit-text-fill-color: #ffffff !important;
          margin: 0 0 4px 0 !important;
          line-height: 1.2;
          text-shadow: 0 2px 8px rgba(0, 0, 0, 0.9) !important;
        }

        .stage-card-subtitle {
          font-size: 0.8rem !important;
          color: #bae6fd !important;
          -webkit-text-fill-color: #bae6fd !important;
          font-weight: 700 !important;
          margin-bottom: 12px !important;
        }

        .stage-card-desc {
          font-size: 0.85rem !important;
          color: #f8fafc !important;
          -webkit-text-fill-color: #f8fafc !important;
          line-height: 1.55 !important;
          margin-bottom: 16px !important;
        }

        .stage-metrics-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
          background: rgba(0, 0, 0, 0.3);
          padding: 10px;
          border-radius: 10px;
          border: 1px solid rgba(255, 255, 255, 0.08);
        }

        .metric-box {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .metric-lbl {
          font-size: 0.65rem;
          color: #94a3b8;
          font-weight: 600;
        }

        .metric-val {
          font-size: 0.8rem;
          font-weight: 800;
          color: #f8fafc;
        }

        /* Final Action Card (when frame >= 132) */
        .final-action-card {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          pointer-events: none;
          opacity: 0;
          transform: scale(0.95);
          transition: all 0.4s ease;
        }

        .final-action-card.active {
          opacity: 1;
          transform: scale(1);
          pointer-events: auto;
        }

        .final-card-inner {
          background: rgba(11, 19, 43, 0.96) !important;
          border: 1.5px solid rgba(56, 189, 248, 0.6) !important;
          border-radius: 20px;
          padding: 42px 48px;
          max-width: 620px;
          text-align: center;
          backdrop-filter: blur(24px);
          box-shadow: 0 24px 70px rgba(0, 0, 0, 0.95), 0 0 40px rgba(56, 189, 248, 0.25) !important;
        }

        .final-icon-circle {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          background: rgba(16, 185, 129, 0.15);
          border: 1px solid rgba(16, 185, 129, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 18px auto;
        }

        .final-card-inner h3 {
          font-size: 1.75rem !important;
          font-weight: 900 !important;
          margin: 0 0 14px 0 !important;
          color: #ffffff !important;
          -webkit-text-fill-color: #ffffff !important;
          text-shadow: 0 2px 14px rgba(0, 0, 0, 0.9) !important;
          letter-spacing: -0.01em;
        }

        .final-card-inner p {
          font-size: 1rem !important;
          color: #f1f5f9 !important;
          -webkit-text-fill-color: #f1f5f9 !important;
          line-height: 1.65 !important;
          margin: 0 0 28px 0 !important;
          text-shadow: 0 1px 8px rgba(0, 0, 0, 0.9) !important;
          font-weight: 500;
        }

        .final-btn-row {
          display: flex;
          justify-content: center;
          gap: 14px;
        }

        .final-enter-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #10b981;
          color: #ffffff;
          border: none;
          padding: 12px 24px;
          border-radius: 8px;
          font-size: 0.95rem;
          font-weight: 800;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 4px 16px rgba(16, 185, 129, 0.4);
        }

        .final-enter-btn:hover {
          background: #059669;
          transform: translateY(-2px);
        }

        .final-replay-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(255, 255, 255, 0.1);
          color: #ffffff;
          border: 1px solid rgba(255, 255, 255, 0.2);
          padding: 12px 20px;
          border-radius: 8px;
          font-size: 0.9rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .final-replay-btn:hover {
          background: rgba(255, 255, 255, 0.2);
        }

        /* Bottom Floating HUD */
        .bottom-hud-bar {
          position: relative;
          z-index: 10;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 36px 24px 36px;
          gap: 24px;
        }

        .hud-controls-left {
          display: flex;
          gap: 10px;
        }

        .hud-icon-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          background: rgba(15, 23, 42, 0.8);
          border: 1px solid rgba(255, 255, 255, 0.15);
          color: #ffffff;
          padding: 8px 14px;
          border-radius: 8px;
          font-size: 0.8rem;
          font-weight: 700;
          cursor: pointer;
          backdrop-filter: blur(10px);
          transition: all 0.15s ease;
        }

        .hud-icon-btn:hover {
          background: rgba(56, 189, 248, 0.2);
          border-color: #38bdf8;
        }

        .hud-icon-btn.playing {
          background: rgba(239, 68, 68, 0.2);
          border-color: #ef4444;
          color: #fca5a5;
        }

        .timeline-scrubber-center {
          flex: 1;
          max-width: 680px;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .scrubber-track-row {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .scrub-label {
          font-size: 0.7rem;
          font-weight: 800;
          color: #94a3b8;
          font-family: var(--font-mono, monospace);
        }

        .scrubber-slider {
          flex: 1;
          height: 6px;
          -webkit-appearance: none;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 3px;
          outline: none;
          cursor: pointer;
        }

        .scrubber-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #38bdf8;
          cursor: pointer;
          box-shadow: 0 0 10px #38bdf8;
          border: 2px solid #ffffff;
          transition: transform 0.1s ease;
        }

        .scrubber-slider::-webkit-slider-thumb:hover {
          transform: scale(1.2);
        }

        .scrubber-ticks-labels {
          display: flex;
          justify-content: space-between;
          font-size: 0.675rem;
          font-weight: 600;
          color: #64748b;
        }

        .scrubber-ticks-labels span.active {
          color: #38bdf8;
          font-weight: 800;
        }

        .hud-status-right {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .preload-indicator {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.725rem;
          color: #f59e0b;
          background: rgba(245, 158, 11, 0.15);
          padding: 4px 10px;
          border-radius: 12px;
          border: 1px solid rgba(245, 158, 11, 0.3);
        }

        .spinner-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #f59e0b;
          animation: pulseDot 1s infinite;
        }

        .scroll-indicator-pill {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.725rem;
          color: #94a3b8;
          background: rgba(15, 23, 42, 0.7);
          padding: 6px 12px;
          border-radius: 16px;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .scroll-mouse-icon {
          width: 14px;
          height: 20px;
          border: 2px solid #94a3b8;
          border-radius: 8px;
          position: relative;
        }

        .scroll-mouse-icon .wheel {
          position: absolute;
          top: 3px;
          left: 50%;
          transform: translateX(-50%);
          width: 2px;
          height: 4px;
          background: #38bdf8;
          border-radius: 1px;
          animation: mouseWheel 1.5s infinite;
        }

        @keyframes mouseWheel {
          0% { opacity: 1; transform: translate(-50%, 0); }
          100% { opacity: 0; transform: translate(-50%, 6px); }
        }

        @media (max-width: 1024px) {
          .stage-telemetry-card {
            display: none;
          }
          .hero-heading {
            font-size: 2.2rem;
          }
          .timeline-scrubber-center {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}
