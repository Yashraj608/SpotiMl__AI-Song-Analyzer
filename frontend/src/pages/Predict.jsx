import { useState } from "react";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const FEATURES = [
  { key:"danceability",      label:"Danceability",            min:0,     max:1,      step:0.01, default:0.5  },
  { key:"energy",            label:"Energy",                  min:0,     max:1,      step:0.01, default:0.5  },
  { key:"loudness",          label:"Loudness (dB)",           min:-60,   max:0,      step:0.1,  default:-10  },
  { key:"speechiness",       label:"Speechiness",             min:0,     max:1,      step:0.01, default:0.05 },
  { key:"acousticness",      label:"Acousticness",            min:0,     max:1,      step:0.01, default:0.3  },
  { key:"instrumentalness",  label:"Instrumentalness",        min:0,     max:1,      step:0.01, default:0.0  },
  { key:"liveness",          label:"Liveness",                min:0,     max:1,      step:0.01, default:0.1  },
  { key:"valence",           label:"Valence (Mood)",          min:0,     max:1,      step:0.01, default:0.5  },
  { key:"tempo",             label:"Tempo (BPM)",             min:40,    max:220,    step:1,    default:120  },
  { key:"duration_ms",       label:"Duration (ms)",           min:30000, max:600000, step:1000, default:200000 },
  { key:"key",               label:"Key (0-11)",              min:0,     max:11,     step:1,    default:5    },
  { key:"mode",              label:"Mode (0=minor, 1=major)", min:0,     max:1,      step:1,    default:1    },
  { key:"time_signature",    label:"Time Signature",          min:3,     max:7,      step:1,    default:4    },
];

const PRESETS = {
  "Pop Hit":    { danceability:0.8,  energy:0.75, loudness:-5,  speechiness:0.04, acousticness:0.1,  instrumentalness:0.0,  liveness:0.12, valence:0.75, tempo:120, duration_ms:200000, key:5, mode:1, time_signature:4 },
  "Sad Ballad": { danceability:0.3,  energy:0.25, loudness:-15, speechiness:0.03, acousticness:0.8,  instrumentalness:0.0,  liveness:0.08, valence:0.15, tempo:70,  duration_ms:240000, key:2, mode:0, time_signature:4 },
  "EDM Banger": { danceability:0.9,  energy:0.95, loudness:-3,  speechiness:0.05, acousticness:0.02, instrumentalness:0.6,  liveness:0.15, valence:0.6,  tempo:128, duration_ms:300000, key:7, mode:1, time_signature:4 },
  "Classical":  { danceability:0.2,  energy:0.2,  loudness:-20, speechiness:0.03, acousticness:0.99, instrumentalness:0.95, liveness:0.1,  valence:0.4,  tempo:90,  duration_ms:360000, key:0, mode:1, time_signature:4 },
  "Hip-Hop":    { danceability:0.85, energy:0.7,  loudness:-6,  speechiness:0.25, acousticness:0.1,  instrumentalness:0.0,  liveness:0.1,  valence:0.55, tempo:95,  duration_ms:210000, key:9, mode:0, time_signature:4 },
};

const ALGO_COLOR = {
  "Naive Bayes":        "#4a9eff",
  "Decision Tree":      "#7c6af5",
  "Random Forest":      "#1DB954",
  "Logistic Regression":"#f0a500",
};

const TASK_COLOR = { genre:"#7c6af5", mood:"#f0a500", popularity:"#1DB954" };
const TASK_ICON  = { genre:"🎸",      mood:"😊",      popularity:"🔥"       };
const TASK_LABEL = { genre:"Genre",   mood:"Mood",    popularity:"Popularity" };

const MOOD_EMOJI = { Happy:"😊", Sad:"😢", Energetic:"⚡", Calm:"🌊" };
const POP_EMOJI  = { High:"🔥", Low:"❄️" };

function getGenreEmoji(g) {
  if (!g) return "🎵";
  const lower = g.toLowerCase();
  if (lower.includes("pop"))       return "🎵";
  if (lower.includes("rock"))      return "🎸";
  if (lower.includes("hip") || lower.includes("hop") || lower.includes("rap")) return "🎤";
  if (lower.includes("classical") || lower.includes("piano")) return "🎹";
  if (lower.includes("edm") || lower.includes("electronic") || lower.includes("dance")) return "🎧";
  if (lower.includes("jazz"))      return "🎷";
  if (lower.includes("country"))   return "🤠";
  if (lower.includes("metal"))     return "🤘";
  if (lower.includes("indie") || lower.includes("folk")) return "🌿";
  if (lower.includes("r&b") || lower.includes("soul"))   return "🎼";
  return "🎵";
}

function getBestPrediction(algos) {
  if (!algos) return { label:"—", confidence:0, algo:"—" };
  const rf = algos["Random Forest"];
  if (rf && !rf.error) return { label:rf.prediction, confidence:rf.confidence, algo:"Random Forest" };
  let best = null;
  for (const [name, r] of Object.entries(algos)) {
    if (!r.error && (!best || r.confidence > best.confidence)) {
      best = { label:r.prediction, confidence:r.confidence, algo:name };
    }
  }
  return best || { label:"—", confidence:0, algo:"—" };
}

function SongDNA({ results }) {
  const genre = getBestPrediction(results.genre);
  const mood  = getBestPrediction(results.mood);
  const pop   = getBestPrediction(results.popularity);

  const verdicts = [
    {
      task:"genre", label:genre.label, confidence:genre.confidence, algo:genre.algo,
      emoji:getGenreEmoji(genre.label),
      color:"#7c6af5", bg:"rgba(124,106,245,0.13)", border:"rgba(124,106,245,0.3)",
    },
    {
      task:"mood",  label:mood.label,  confidence:mood.confidence,  algo:mood.algo,
      emoji:MOOD_EMOJI[mood.label] || "🎵",
      color:"#f0a500", bg:"rgba(240,165,0,0.13)", border:"rgba(240,165,0,0.3)",
    },
    {
      task:"popularity", label:pop.label + " Popularity", confidence:pop.confidence, algo:pop.algo,
      emoji:POP_EMOJI[pop.label] || "📊",
      color: pop.label === "High" ? "#1DB954" : "#e05c7a",
      bg:    pop.label === "High" ? "rgba(29,185,84,0.13)"  : "rgba(224,92,122,0.13)",
      border:pop.label === "High" ? "rgba(29,185,84,0.3)"   : "rgba(224,92,122,0.3)",
    },
  ];

  return (
    <div style={{
      background:"#1a1f2e",
      border:"1px solid rgba(29,185,84,0.25)",
      borderRadius:16,
      padding:"22px 24px",
      marginBottom:24,
      position:"relative",
      overflow:"hidden",
    }}>
      <div style={{
        position:"absolute", top:-60, right:-60, width:220, height:220,
        background:"radial-gradient(circle, rgba(29,185,84,0.12) 0%, transparent 70%)",
        pointerEvents:"none",
      }} />

      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:20 }}>
        <div style={{
          width:34, height:34, borderRadius:"50%", background:"#1DB954",
          display:"flex", alignItems:"center", justifyContent:"center", fontSize:17,
        }}>🧬</div>
        <div>
          <p style={{ fontSize:17, fontWeight:800, color:"#fff", margin:0 }}>Song DNA</p>
          <p style={{ fontSize:11, color:"#888", margin:0 }}>
            Best-model classification result
          </p>
        </div>
        <div style={{
          marginLeft:"auto", fontSize:11, padding:"4px 12px", borderRadius:20,
          background:"rgba(29,185,84,0.15)", color:"#1DB954",
          border:"1px solid rgba(29,185,84,0.3)", fontWeight:600,
        }}>
          12 models ran ✓
        </div>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:14 }}>
        {verdicts.map(v => (
          <div key={v.task} style={{
            background:v.bg, border:`1px solid ${v.border}`,
            borderRadius:12, padding:"16px 18px",
          }}>
            <p style={{
              fontSize:10, color:"#777", textTransform:"uppercase",
              letterSpacing:"0.1em", margin:"0 0 8px",
            }}>
              {TASK_LABEL[v.task]}
            </p>

            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12 }}>
              <span style={{ fontSize:28 }}>{v.emoji}</span>
              <p style={{
                fontSize: v.label.length > 12 ? 16 : 20,
                fontWeight:800, color:"#fff", margin:0, lineHeight:1.1,
              }}>
                {v.label}
              </p>
            </div>

            <div style={{ marginBottom:8 }}>
              <div style={{ height:5, background:"rgba(255,255,255,0.08)", borderRadius:3, overflow:"hidden" }}>
                <div style={{
                  width:`${v.confidence}%`, height:"100%",
                  background:v.color, borderRadius:3,
                  transition:"width 1.1s cubic-bezier(0.22,1,0.36,1)",
                }} />
              </div>
              <div style={{ display:"flex", justifyContent:"space-between", marginTop:5 }}>
                <span style={{ fontSize:11, color:v.color, fontWeight:700 }}>
                  {v.confidence}% confidence
                </span>
                <span style={{ fontSize:10, color:"#555" }}>via {v.algo}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AlgoBreakdown({ task, algos }) {
  const validEntries = Object.entries(algos).filter(([,r]) => !r.error);
  const sorted = [...validEntries].sort((a,b) => b[1].confidence - a[1].confidence);

  const counts = {};
  validEntries.forEach(([,r]) => { counts[r.prediction] = (counts[r.prediction]||0)+1; });
  const majority = Object.entries(counts).sort((a,b)=>b[1]-a[1])[0]?.[0];

  return (
    <div style={{ background:"#282828", borderRadius:12, padding:"16px 18px" }}>
      <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:14 }}>
        <span style={{ fontSize:18 }}>{TASK_ICON[task]}</span>
        <span style={{ fontSize:13, fontWeight:700, color:TASK_COLOR[task], textTransform:"capitalize" }}>
          {task}
        </span>
        <span style={{
          marginLeft:"auto", fontSize:10, padding:"2px 8px", borderRadius:20,
          background:`${TASK_COLOR[task]}22`, color:TASK_COLOR[task],
          border:`1px solid ${TASK_COLOR[task]}44`, fontWeight:600,
        }}>
          {majority}
        </span>
      </div>

      {sorted.map(([algo, r]) => {
        const isTop = r.prediction === majority;
        return (
          <div key={algo} style={{
            marginBottom:10,
            background: isTop ? "rgba(255,255,255,0.04)" : "transparent",
            borderRadius:8, padding: isTop ? "8px 10px" : "2px",
            border: isTop ? "1px solid rgba(255,255,255,0.07)" : "1px solid transparent",
          }}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4, alignItems:"center" }}>
              <div style={{ display:"flex", alignItems:"center", gap:7 }}>
                <span style={{
                  width:8, height:8, borderRadius:"50%",
                  background:ALGO_COLOR[algo], flexShrink:0, display:"inline-block",
                }} />
                <span style={{ fontSize:11, color:ALGO_COLOR[algo] }}>{algo}</span>
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:7 }}>
                <span style={{ fontSize:12, fontWeight:700, color: isTop ? "#fff" : "#999" }}>
                  {r.prediction}
                </span>
                {isTop && (
                  <span style={{
                    fontSize:9, padding:"1px 5px", borderRadius:10,
                    background:"rgba(29,185,84,0.2)", color:"#1DB954", fontWeight:700,
                  }}>✓</span>
                )}
              </div>
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
              <div style={{ flex:1, height:4, background:"#121212", borderRadius:2, overflow:"hidden" }}>
                <div style={{
                  width:`${r.confidence}%`, height:"100%",
                  background:ALGO_COLOR[algo], borderRadius:2,
                  transition:"width 0.9s ease",
                }} />
              </div>
              <span style={{ fontSize:10, color:"#555", minWidth:34, textAlign:"right" }}>
                {r.confidence}%
              </span>
            </div>
          </div>
        );
      })}

      {Object.entries(algos).filter(([,r])=>r.error).map(([algo]) => (
        <div key={algo} style={{ fontSize:11, color:"#e05c7a", marginTop:6 }}>
          ⚠ {algo}: not available
        </div>
      ))}
    </div>
  );
}

export default function Predict() {
  const defaults = Object.fromEntries(FEATURES.map(f => [f.key, f.default]));
  const [values,  setValues]  = useState(defaults);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);

  const applyPreset = name => setValues({ ...values, ...PRESETS[name] });

  const predict = async () => {
    setLoading(true); setError(null); setResults(null);
    try {
      const res  = await fetch(`${API_BASE}/api/predict`, {
        method:"POST",
        headers:{ "Content-Type":"application/json" },
        body:JSON.stringify(values),
      });
      const data = await res.json();
      if (data.status === "success") setResults(data.results);
      else setError("Prediction failed. Make sure the backend is running.");
    } catch {
      setError("Cannot connect to backend. Run: python backend/app.py");
    }
    setLoading(false);
  };

  return (
    <div style={{ padding:24, maxWidth:920 }}>

      <h2 style={{ fontSize:22, fontWeight:700, marginBottom:4 }}>Predict a Song</h2>
      <p style={{ color:"#b3b3b3", fontSize:14, marginBottom:20 }}>
        Adjust audio features or pick a preset — all 12 models classify your song instantly.
      </p>

      {/* Presets */}
      <div style={{ marginBottom:20 }}>
        <p style={{ fontSize:11, color:"#555", textTransform:"uppercase",
                    letterSpacing:"0.08em", marginBottom:8 }}>Quick Presets</p>
        <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
          {Object.keys(PRESETS).map(p => (
            <button key={p} onClick={() => applyPreset(p)} style={{
              background:"#282828", color:"#fff",
              border:"1px solid #3a3a3a", borderRadius:20,
              padding:"6px 16px", cursor:"pointer", fontSize:13,
              transition:"border-color 0.15s, background 0.15s",
            }}
              onMouseEnter={e=>{e.currentTarget.style.borderColor="#1DB954"; e.currentTarget.style.background="#2a2a2a";}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor="#3a3a3a"; e.currentTarget.style.background="#282828";}}>
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Sliders */}
      <div style={{ background:"#282828", borderRadius:12, padding:"18px 22px", marginBottom:22 }}>
        <p style={{ fontSize:11, color:"#555", textTransform:"uppercase",
                    letterSpacing:"0.08em", marginBottom:14 }}>Audio Features</p>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"14px 32px" }}>
          {FEATURES.map(f => (
            <div key={f.key}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                <label style={{ fontSize:12, color:"#b3b3b3" }}>{f.label}</label>
                <span style={{ fontSize:12, color:"#1DB954", fontWeight:700 }}>
                  {typeof values[f.key] === "number"
                    ? values[f.key].toFixed(f.step < 1 ? 2 : 0)
                    : values[f.key]}
                </span>
              </div>
              <input type="range" min={f.min} max={f.max} step={f.step}
                value={values[f.key]}
                onChange={e => setValues({ ...values, [f.key]:parseFloat(e.target.value) })}
                style={{ width:"100%", accentColor:"#1DB954", cursor:"pointer" }} />
            </div>
          ))}
        </div>
      </div>

      {/* Analyse button */}
      <button onClick={predict} disabled={loading} style={{
        background: loading ? "#2a2a2a" : "#1DB954",
        color: loading ? "#666" : "#000",
        border:"none", borderRadius:30, padding:"13px 36px",
        fontSize:15, fontWeight:700, cursor: loading ? "not-allowed" : "pointer",
        marginBottom:28, transition:"background 0.2s",
      }}>
        {loading ? "⏳  Analyzing…" : "▶  Analyze with All 12 Models"}
      </button>

      {/* Error */}
      {error && (
        <div style={{
          background:"#2a1010", border:"1px solid #e05c7a",
          borderRadius:10, padding:"12px 16px", marginBottom:20,
          color:"#e05c7a", fontSize:13,
        }}>
          ⚠️ {error}
        </div>
      )}

      {/* Results */}
      {results && (
        <div>
          {/* Song DNA — the actual classification verdict */}
          <SongDNA results={results} />

          {/* Section divider */}
          <p style={{
            fontSize:11, color:"#555", textTransform:"uppercase",
            letterSpacing:"0.08em", marginBottom:12,
          }}>
            All Algorithms · Detailed Breakdown
          </p>

          {/* Per-task breakdown */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:14 }}>
            {Object.entries(results).map(([task, algos]) => (
              <AlgoBreakdown key={task} task={task} algos={algos} />
            ))}
          </div>

          <p style={{ fontSize:11, color:"#3a3a3a", marginTop:14, lineHeight:1.5 }}>
            * Song DNA uses Random Forest as the primary classifier — it consistently achieves the highest accuracy.
            Fallback: highest-confidence available algorithm.
          </p>
        </div>
      )}
    </div>
  );
}
