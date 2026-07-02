const SAMPLE_SONGS = [
  { name:"Blinding Lights", artist:"The Weeknd",   art:"🌙", genre:"Pop",       mood:"Happy",     pop:"High" },
  { name:"Bohemian Rhapsody", artist:"Queen",       art:"🎸", genre:"Rock",      mood:"Energetic", pop:"High" },
  { name:"HUMBLE.",          artist:"Kendrick Lamar",art:"🎤",genre:"Hip-Hop",   mood:"Energetic", pop:"High" },
  { name:"Clair de Lune",    artist:"Debussy",      art:"🎹", genre:"Classical", mood:"Calm",      pop:"Low"  },
  { name:"Strobe",           artist:"deadmau5",     art:"🎧", genre:"EDM",       mood:"Energetic", pop:"High" },
  { name:"The Night We Met", artist:"Lord Huron",   art:"🌌", genre:"Indie",     mood:"Sad",       pop:"Low"  },
];

const MOOD_COLOR  = { Happy:"#1DB954", Energetic:"#f0a500", Calm:"#4a9eff", Sad:"#e05c7a" };
const POP_COLOR   = { High:"#1DB954", Low:"#e05c7a" };
const GENRE_COLOR = { Pop:"#7c6af5", Rock:"#f0a500", "Hip-Hop":"#e05c7a",
                      Classical:"#4a9eff", EDM:"#1DB954", Indie:"#ff8c42" };

function Tag({ label, color }) {
  return (
    <span style={{ fontSize:10, padding:"2px 8px", borderRadius:20, fontWeight:600,
                   background: color + "22", color, border:`1px solid ${color}44` }}>
      {label}
    </span>
  );
}

function StatCard({ label, value, sub }) {
  return (
    <div style={{ background:"#282828", borderRadius:10, padding:"14px 16px" }}>
      <p style={{ fontSize:11, color:"#6a6a6a", marginBottom:6 }}>{label}</p>
      <p style={{ fontSize:22, fontWeight:700 }}>{value}</p>
      {sub && <p style={{ fontSize:11, color:"#1DB954", marginTop:4 }}>{sub}</p>}
    </div>
  );
}

export default function Dashboard() {
  return (
    <div style={{ padding:24 }}>
      {/* Header */}
      <div style={{ marginBottom:24 }}>
        <h1 style={{ fontSize:28, fontWeight:700, marginBottom:4 }}>
          Welcome to SpotiML 🎵
        </h1>
        <p style={{ color:"#b3b3b3", fontSize:14 }}>
          Multi-task ML classifier — Genre · Mood · Popularity prediction
        </p>
      </div>

      {/* Stats */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12, marginBottom:24 }}>
        <StatCard label="Total Tracks"    value="114,000"  sub="Spotify Dataset" />
        <StatCard label="Audio Features"  value="13"       sub="Per track" />
        <StatCard label="ML Models"       value="12"       sub="4 algos × 3 tasks" />
        <StatCard label="Prediction Tasks" value="3"       sub="Genre · Mood · Pop" />
      </div>

      {/* Pipeline */}
      <div style={{ background:"#282828", borderRadius:10, padding:16, marginBottom:24 }}>
        <p style={{ fontSize:13, color:"#b3b3b3", marginBottom:12 }}>PREDICTION PIPELINE</p>
        <div style={{ display:"flex", alignItems:"center", gap:8, flexWrap:"wrap" }}>
          {["Audio Features","→","Naive Bayes","Decision Tree","Random Forest","Logistic Reg.","→","Genre + Mood + Popularity"].map((s,i) => (
            s === "→"
              ? <span key={i} style={{ color:"#1DB954", fontSize:18 }}>→</span>
              : <span key={i} style={{ background:"#121212", padding:"6px 12px",
                  borderRadius:20, fontSize:12, color:"#fff", border:"1px solid #333" }}>{s}</span>
          ))}
        </div>
      </div>

      {/* Sample Tracks */}
      <p style={{ fontSize:13, color:"#b3b3b3", marginBottom:12 }}>SAMPLE PREDICTIONS</p>
      <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
        {SAMPLE_SONGS.map((s,i) => (
          <div key={i} style={{ background:"#282828", borderRadius:10, padding:"12px 16px",
                                display:"flex", alignItems:"center", gap:14,
                                cursor:"pointer", transition:"background 0.15s" }}
            onMouseEnter={e=>e.currentTarget.style.background="#333"}
            onMouseLeave={e=>e.currentTarget.style.background="#282828"}>
            <div style={{ width:44, height:44, borderRadius:6, background:"#121212",
                          display:"flex", alignItems:"center", justifyContent:"center",
                          fontSize:22, flexShrink:0 }}>{s.art}</div>
            <div style={{ flex:1 }}>
              <p style={{ fontWeight:600, fontSize:14 }}>{s.name}</p>
              <p style={{ fontSize:12, color:"#b3b3b3", marginTop:2 }}>{s.artist}</p>
              <div style={{ display:"flex", gap:6, marginTop:6, flexWrap:"wrap" }}>
                <Tag label={s.genre} color={GENRE_COLOR[s.genre] || "#888"} />
                <Tag label={s.mood}  color={MOOD_COLOR[s.mood]} />
                <Tag label={`${s.pop} Popularity`} color={POP_COLOR[s.pop]} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
