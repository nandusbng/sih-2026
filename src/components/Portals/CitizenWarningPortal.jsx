import React, { useState } from 'react';
import { 
  Radio, 
  AlertTriangle, 
  MapPin, 
  Search, 
  ShieldCheck, 
  PhoneCall, 
  LifeBuoy, 
  CheckCircle2, 
  XCircle, 
  Globe,
  Home,
  Navigation,
  Info
} from 'lucide-react';

export default function CitizenWarningPortal({ 
  selectedDamId, 
  damsData 
}) {
  const currentDam = damsData[selectedDamId];
  const [language, setLanguage] = useState(selectedDamId === 'hirakud' ? 'odia' : 'gujarati');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState(null);

  // Translations dictionary
  const TRANSLATIONS = {
    english: {
      alertTitle: "OFFICIAL FLOOD WARNING BULLETIN — IMMEDIATE EVACUATION ORDER",
      alertSub: `Issued by State Disaster Management Authority & Central Water Commission for downstream ${currentDam.river} reaches.`,
      checkSafety: "Check If Your Village / Area Is In The Flood Zone",
      searchPlaceholder: "Enter your village, town, or ward name (e.g. Burla, Sambalpur, Kamrej)...",
      nearestShelter: "Nearest Designated Safe Evacuation Shelters",
      dosAndDonts: "Citizen Flood Safety Guidelines (Do's & Don'ts)",
      emergencyContacts: "Emergency Rescue & Helpline Numbers"
    },
    hindi: {
      alertTitle: "आधिकारिक बाढ़ चेतावनी बुलेटिन — तत्काल निकासी आदेश",
      alertSub: `राज्य आपदा प्रबंधन प्राधिकरण और केंद्रीय जल आयोग द्वारा ${currentDam.river} के निचले इलाकों के लिए जारी।`,
      checkSafety: "जांचें कि क्या आपका गांव / क्षेत्र बाढ़ क्षेत्र में है",
      searchPlaceholder: "अपने गांव या कस्बे का नाम दर्ज करें...",
      nearestShelter: "निकटतम सुरक्षित बाढ़ राहत आश्रय",
      dosAndDonts: "नागरिक सुरक्षा दिशानिर्देश (क्या करें और क्या न करें)",
      emergencyContacts: "आपातकालीन हेल्पलाइन नंबर"
    },
    odia: {
      alertTitle: "ସରକାରୀ ବନ୍ୟା ସତର୍କତା ବୁଲେଟିନ୍ — ତୁରନ୍ତ ସୁରକ୍ଷିତ ସ୍ଥାନକୁ ସ୍ଥାନାନ୍ତର ଆଦେଶ",
      alertSub: `ମହାନଦୀ ଅବବାହିକା ନିମ୍ନ ଭାଗ ପାଇଁ ରାଜ୍ୟ ବିପର୍ଯ୍ୟୟ ପରିଚାଳନା କର୍ତ୍ତୃପକ୍ଷଙ୍କ ଦ୍ୱାରା ଜାରି କରାଯାଇଛି।`,
      checkSafety: "ଆପଣଙ୍କ ଗାଁ କିମ୍ବା ସହର ବନ୍ୟା ପ୍ରଭାବିତ ଅଞ୍ଚଳରେ ଅଛି କି ଯାଞ୍ଚ କରନ୍ତୁ",
      searchPlaceholder: "ଗାଁ କିମ୍ବା ସହରର ନାମ ଲେଖନ୍ତୁ (ଯଥା ବୁର୍ଲା, ସମ୍ବଲପୁର, ଢମା)...",
      nearestShelter: "ନିକଟସ୍ଥ ସୁରକ୍ଷିତ ବନ୍ୟା ଆଶ୍ରୟସ୍ଥଳୀ",
      dosAndDonts: "ନାଗରିକ ସୁରକ୍ଷା ନିର୍ଦ୍ଦେଶାବଳୀ (କ'ଣ କରିବେ ଏବଂ କ'ଣ କରିବେ ନାହିଁ)",
      emergencyContacts: "ଜରୁରୀକାଳୀନ ହେଲ୍ପଲାଇନ୍ ନମ୍ବର"
    },
    gujarati: {
      alertTitle: "સત્તાવાર પૂર ચેતવણી બુલેટિન — તાત્કાલિક સ્થળાંતર આદેશ",
      alertSub: `તાપી નદીના નીચાણવાળા વિસ્તારો માટે રાજ્ય ડિઝાસ્ટર મેનેજમેન્ટ ઓથોરિટી દ્વારા જારી કરવામાં આવેલ.`,
      checkSafety: "તમારું ગામ કે શહેર પૂરગ્રસ્ત વિસ્તારમાં છે કે નહીં તે તપાસો",
      searchPlaceholder: "તમારા ગામ અથવા શહેરનું નામ દાખલ કરો...",
      nearestShelter: "નજીકના સલામત પૂર આશ્રયસ્થાનો",
      dosAndDonts: "નાગરિક સુરક્ષા માર્ગદર્શિકા (શું કરવું અને શું ન કરવું)",
      emergencyContacts: "ઇમરજન્સી હેલ્પલાઇન નંબરો"
    }
  };

  const t = TRANSLATIONS[language] || TRANSLATIONS.english;

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    const query = searchQuery.toLowerCase();
    const found = currentDam.settlements.find(s => s.name.toLowerCase().includes(query));

    if (found) {
      setSearchResult({
        found: true,
        data: found,
        isInDanger: found.priority === 'CRITICAL' || found.priority === 'HIGH'
      });
    } else {
      setSearchResult({
        found: false,
        message: "No high-risk warnings found for this specific search name. Please maintain caution and stay on elevated ground."
      });
    }
  };

  return (
    <div className="portal-page-container">
      {/* Top Banner with Language Selector */}
      <div className="portal-header-row">
        <div>
          <div className="badge badge-red mb-2">
            <Radio size={12} />
            <span>PORTAL 8: CITIZEN EARLY WARNING & PUBLIC BROADCAST</span>
          </div>
          <h1 className="portal-title">Public Emergency Warning Bulletin</h1>
        </div>

        {/* Language Pill Selector */}
        <div className="language-selector-box">
          <Globe size={16} className="text-cyan" />
          <span className="text-xs text-dim font-bold">LANGUAGE:</span>
          <select 
            value={language} 
            onChange={(e) => setLanguage(e.target.value)}
            className="language-select"
          >
            <option value="english">English</option>
            <option value="hindi">हिन्दी (Hindi)</option>
            <option value="odia">ଓଡ଼ିଆ (Odia)</option>
            <option value="gujarati">ગુજરાતી (Gujarati)</option>
          </select>
        </div>
      </div>

      {/* High-Contrast Emergency Alert Banner */}
      <div className="emergency-broadcast-banner">
        <div className="banner-icon-col">
          <AlertTriangle size={36} className="text-white" />
        </div>
        <div className="banner-text-col">
          <h2 className="banner-heading">{t.alertTitle}</h2>
          <p className="banner-sub">{t.alertSub}</p>
          <div className="banner-chips mt-2">
            <span className="warning-chip">⚠️ Severe Spillway Discharge: {currentDam.currentStatus.outflowCumecs.toLocaleString()} m³/s</span>
            <span className="warning-chip">🌊 Wavefront Lead Time: 25 - 90 Minutes Downstream</span>
            <span className="warning-chip">🚨 Evacuation In Progress</span>
          </div>
        </div>
      </div>

      {/* "Am I in the Flood Zone?" Interactive Location Search */}
      <div className="glass-panel p-6 mt-4 location-search-panel">
        <h3 className="text-base font-bold text-white mb-2">{t.checkSafety}</h3>
        
        <form onSubmit={handleSearch} className="search-input-form">
          <div className="search-bar-input-wrapper">
            <Search size={18} className="search-icon" />
            <input 
              type="text" 
              placeholder={t.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="location-input"
            />
          </div>
          <button type="submit" className="btn btn-primary">
            <span>Check My Status</span>
          </button>
        </form>

        {/* Search Results Display */}
        {searchResult && (
          <div className={`search-result-card mt-4 ${searchResult.isInDanger ? 'danger' : 'safe'}`}>
            {searchResult.found ? (
              <div>
                <div className="flex-between">
                  <div className="flex-align-gap">
                    {searchResult.isInDanger ? (
                      <AlertTriangle size={24} className="text-red" />
                    ) : (
                      <ShieldCheck size={24} className="text-emerald" />
                    )}
                    <div>
                      <h4 className="text-lg font-bold text-white">{searchResult.data.name}</h4>
                      <span className="text-xs text-dim">Distance from Dam Toe: {searchResult.data.distanceKm} km</span>
                    </div>
                  </div>
                  <span className={`badge ${searchResult.isInDanger ? 'badge-red' : 'badge-emerald'}`}>
                    {searchResult.data.priority} RISK
                  </span>
                </div>

                <div className="result-stats-row mt-3">
                  <div>
                    <span className="text-xs text-dim">Expected Water Depth:</span>
                    <strong className="text-cyan text-sm block font-mono">{searchResult.data.maxDepthM} meters</strong>
                  </div>
                  <div>
                    <span className="text-xs text-dim">Wavefront Arrival Time:</span>
                    <strong className="text-amber text-sm block font-mono">T + {searchResult.data.arrivalTimeHr} Hours</strong>
                  </div>
                  <div>
                    <span className="text-xs text-dim">Local Hazard Status:</span>
                    <strong className="text-red text-sm block">{searchResult.data.status}</strong>
                  </div>
                </div>

                <div className="evacuation-instruction-box mt-3">
                  <strong>🚨 Immediate Action for Residents:</strong>
                  <p className="text-xs text-white mt-1">
                    Please move immediately to designated higher ground shelters. Carry identification, dry food, drinking water, and essential medicines. Do NOT attempt to cross riverbed bridges.
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex-align-gap">
                <Info size={20} className="text-cyan" />
                <span className="text-sm text-white">{searchResult.message}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Two Columns: Designated Shelters + Citizen Do's & Don'ts */}
      <div className="content-two-columns mt-4">
        
        {/* Left Column: Nearest Safe Relief Shelters */}
        <div className="glass-panel p-5">
          <div className="panel-title-bar">
            <div className="flex-align-gap">
              <Home className="text-emerald" size={18} />
              <h2 className="panel-h2">{t.nearestShelter}</h2>
            </div>
            <span className="badge badge-emerald">Safe High Ground</span>
          </div>

          <div className="shelters-citizen-list">
            {currentDam.criticalAssets.filter(a => a.type === 'Shelter').map((s) => (
              <div key={s.id} className="citizen-shelter-card">
                <div className="flex-between">
                  <strong className="shelter-name">{s.name}</strong>
                  <span className="badge badge-emerald text-xs">OPEN 24x7</span>
                </div>
                <div className="flex-between text-xs text-dim mt-2">
                  <span>Available Beds: <b className="text-emerald font-bold">{s.available}</b></span>
                  <span>Total Capacity: {s.capacity}</span>
                </div>
                <div className="shelter-facilities-chips mt-2">
                  <span className="facility-chip">✓ Clean Drinking Water</span>
                  <span className="facility-chip">✓ Medical First Aid</span>
                  <span className="facility-chip">✓ Community Kitchen</span>
                </div>
              </div>
            ))}
          </div>

          {/* Emergency SOS Hotlines */}
          <div className="hotlines-citizen-section mt-4">
            <h4 className="text-xs font-bold text-dim uppercase mb-2">{t.emergencyContacts}</h4>
            <div className="hotlines-grid-citizen">
              <div className="sos-box">
                <PhoneCall size={18} className="text-red" />
                <div>
                  <span className="sos-label">State Disaster Helpline</span>
                  <span className="sos-num">1070</span>
                </div>
              </div>
              <div className="sos-box">
                <PhoneCall size={18} className="text-cyan" />
                <div>
                  <span className="sos-label">District Emergency Center</span>
                  <span className="sos-num">1077</span>
                </div>
              </div>
              <div className="sos-box">
                <PhoneCall size={18} className="text-amber" />
                <div>
                  <span className="sos-label">National Emergency (Police/Ambulance)</span>
                  <span className="sos-num">112</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Citizen Do's & Don'ts */}
        <div className="glass-panel p-5">
          <div className="panel-title-bar">
            <div className="flex-align-gap">
              <ShieldCheck className="text-cyan" size={18} />
              <h2 className="panel-h2">{t.dosAndDonts}</h2>
            </div>
            <span className="badge badge-cyan">Safety Protocols</span>
          </div>

          <div className="dos-donts-grid">
            <div className="dos-column">
              <h4 className="dos-title text-emerald flex-align-gap">
                <CheckCircle2 size={16} />
                <span>DO'S (ସୁରକ୍ଷିତ ପଦକ୍ଷେପ)</span>
              </h4>
              <ul className="dos-list">
                <li>Keep emergency kit ready with battery torch, transistor radio, dry snacks, and boiled drinking water.</li>
                <li>Switch off main electrical power switches and gas cylinders before evacuating your home.</li>
                <li>Follow official evacuation orders and designated elevated routes promptly without panic.</li>
                <li>Help elderly neighbors, pregnant women, and children reach the nearest safe shelter.</li>
                <li>Tie livestock to higher ground and leave gates unfastened so animals can escape rising water.</li>
              </ul>
            </div>

            <div className="donts-column">
              <h4 className="donts-title text-red flex-align-gap">
                <XCircle size={16} />
                <span>DON'TS (କରନ୍ତୁ ନାହିଁ)</span>
              </h4>
              <ul className="donts-list">
                <li>DO NOT attempt to walk, swim, or drive through moving flood waters (even 15 cm of moving water can knock you down).</li>
                <li>DO NOT spread or believe unverified rumors on social media; rely strictly on official bulletins.</li>
                <li>DO NOT touch fallen electric poles or wires in submerged streets.</li>
                <li>DO NOT drink tap water without boiling for at least 10 minutes.</li>
              </ul>
            </div>
          </div>
        </div>

      </div>

      <style>{`
        .language-selector-box {
          display: flex;
          align-items: center;
          gap: 8px;
          background: var(--bg-dark-800);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-sm);
          padding: 6px 12px;
        }

        .language-select {
          background: transparent;
          border: none;
          color: #38bdf8;
          font-weight: 700;
          font-size: 0.85rem;
          outline: none;
          cursor: pointer;
        }

        .emergency-broadcast-banner {
          background: linear-gradient(135deg, #b91c1c 0%, #ef4444 100%);
          border-radius: var(--radius-md);
          padding: 20px 24px;
          display: flex;
          gap: 20px;
          align-items: center;
          box-shadow: 0 10px 30px rgba(239, 68, 68, 0.4);
        }

        .banner-icon-col {
          background: rgba(0, 0, 0, 0.25);
          padding: 16px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .banner-heading {
          font-family: var(--font-display);
          font-size: 1.25rem;
          font-weight: 900;
          color: #ffffff;
          letter-spacing: 0.02em;
        }

        .banner-sub {
          color: rgba(255, 255, 255, 0.9);
          font-size: 0.85rem;
          margin-top: 4px;
        }

        .banner-chips {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .warning-chip {
          background: rgba(0, 0, 0, 0.3);
          color: #ffffff;
          font-size: 0.75rem;
          font-weight: 700;
          padding: 3px 8px;
          border-radius: 4px;
        }

        .location-search-panel {
          border-color: rgba(56, 189, 248, 0.25);
        }

        .search-input-form {
          display: flex;
          gap: 12px;
        }

        .search-bar-input-wrapper {
          position: relative;
          flex: 1;
        }

        .search-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-dim);
        }

        .location-input {
          width: 100%;
          padding: 12px 14px 12px 42px;
          background: var(--bg-dark-800);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-sm);
          color: #ffffff;
          font-size: 0.95rem;
          outline: none;
        }

        .location-input:focus {
          border-color: #38bdf8;
        }

        .search-result-card {
          padding: 16px;
          border-radius: var(--radius-sm);
          border: 1px solid var(--border-color);
        }

        .search-result-card.danger {
          background: rgba(239, 68, 68, 0.08);
          border-color: rgba(239, 68, 68, 0.4);
        }

        .search-result-card.safe {
          background: rgba(16, 185, 129, 0.08);
          border-color: rgba(16, 185, 129, 0.4);
        }

        .result-stats-row {
          display: flex;
          gap: 24px;
        }

        .evacuation-instruction-box {
          background: #fef2f2;
          border: 1px solid #fecaca;
          border-left: 4px solid #ef4444;
          padding: 12px 16px;
          border-radius: 8px;
        }

        .shelters-citizen-list {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .citizen-shelter-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          padding: 16px 18px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
          transition: all 0.2s ease;
        }

        .citizen-shelter-card:hover {
          border-color: #cbd5e1;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
          transform: translateY(-1px);
        }

        .shelter-name {
          color: #0f172a;
          font-size: 0.95rem;
          font-weight: 700;
        }

        .shelter-facilities-chips {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .facility-chip {
          background: #dcfce7;
          color: #15803d;
          font-size: 0.75rem;
          font-weight: 600;
          padding: 3px 8px;
          border-radius: 4px;
          border: 1px solid #bbf7d0;
        }

        .hotlines-grid-citizen {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 12px;
        }

        .sos-box {
          display: flex;
          align-items: center;
          gap: 12px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 12px 14px;
          transition: all 0.15s;
        }

        .sos-box:hover {
          background: #ffffff;
          border-color: #cbd5e1;
        }

        .sos-label {
          display: block;
          font-size: 0.725rem;
          color: #64748b;
        }

        .sos-num {
          font-family: var(--font-mono);
          font-size: 1.15rem;
          font-weight: 800;
          color: #0f172a;
        }

        .dos-donts-grid {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .dos-title, .donts-title {
          font-size: 0.85rem;
          font-weight: 700;
          margin-bottom: 8px;
        }

        .dos-list, .donts-list {
          padding-left: 20px;
          font-size: 0.8rem;
          color: #475569;
          line-height: 1.6;
        }
      `}</style>
    </div>
  );
}
