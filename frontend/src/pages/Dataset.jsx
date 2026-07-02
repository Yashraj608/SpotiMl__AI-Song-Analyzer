const FEATURES = [
  { name:"danceability",     desc:"How suitable a track is for dancing (0.0–1.0)",              used:["mood","genre"] },
  { name:"energy",           desc:"Perceptual measure of intensity and activity (0.0–1.0)",      used:["mood","genre","popularity"] },
  { name:"loudness",         desc:"Overall loudness in decibels (dB), typically -60 to 0",       used:["genre"] },
  { name:"speechiness",      desc:"Presence of spoken words in a track (0.0–1.0)",               used:["genre"] },
  { name:"acousticness",     desc:"Confidence measure of whether track is acoustic (0.0–1.0)",   used:["genre","mood"] },
  { name:"instrumentalness", desc:"Predicts whether a track contains no vocals (0.0–1.0)",       used:["genre"] },
  { name:"liveness",         desc:"Detects presence of an audience in recording (0.0–1.0)",      used:["genre"] },
  { name:"valence",          desc:"Musical positiveness conveyed by a track (0.0–1.0)",          used:["mood","popularity"] },
  { name:"tempo",            desc:"Estimated tempo in beats per minute (BPM)",                   used:["genre","mood"] },
  { name:"duration_ms",      desc:"Duration of track in milliseconds",                           used:["genre"] },
  { name:"key",              desc:"Key the track is in (0=C, 1=C#, ... 11=B)",                   used:["genre"] },
  { name:"mode",             desc:"Modality of track: 1=major, 0=minor",                        used:["mood"] },
  { name:"time_signature",   desc:"Estimated overall time signature (3–7)",                      used:["genre"] },
];

const TASK_COLOR = { genre:"#7c6af5", mood:"#f0a500", popularity:"#1DB954" };

const MOOD_LOGIC = [
  { mood:"Happy",     cond:"valence ≥ 0.5  AND  energy ≥ 0.5", color:"#1DB954" },
  { mood:"Energetic", cond:"valence < 0.5   AND  energy ≥ 0.5", color:"#f0a500" },
  { mood:"Calm",      cond:"valence ≥ 0.5  AND  energy < 0.5",  color:"#4a9eff" },
  { mood:"Sad",       cond:"valence < 0.5   AND  energy < 0.5",  color:"#e05c7a" },
];

export default function Dataset() {
  return (
    <div style={{ padding:24 }}>
      <h2 style={{ fontSize:22, fontWeight:700, marginBottom:4 }}>Dataset Info</h2>
      <p style={{ color:"#b3b3b3", fontSize:14, marginBottom:20 }}>
        Spotify Tracks Dataset — Kaggle · 114,000 tracks · 125 genres
      </p>

      {/* Download card */}
      <div style={{ background:"#1a3a1a", border:"1px solid #1DB954", borderRadius:10,
                    padding:16, marginBottom:20, display:"flex", justifyContent:"space-between",
                    alignItems:"center", flexWrap:"wrap", gap:12 }}>
        <div>
          <p style={{ fontWeight:700, color:"#1DB954", marginBottom:4 }}>Download the dataset</p>
          <p style={{ fontSize:13, color:"#b3b3b3" }}>
            kaggle.com/datasets/maharshipandya/-spotify-tracks-dataset
          </p>
        </div>
        <a href="https://www.kaggle.com/datasets/maharshipandya/-spotify-tracks-dataset"
           target="_blank" rel="noopener noreferrer"
           style={{ background:"#1DB954", color:"#000", padding:"8px 20px", borderRadius:20,
                    fontSize:13, fontWeight:700, textDecoration:"none" }}>
          Open Kaggle →
        </a>
      </div>

      {/* Stats row */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12, marginBottom:24 }}>
        {[
          { label:"Total Rows",    value:"114,000" },
          { label:"Genres",        value:"125"     },
          { label:"Features Used", value:"13"      },
          { label:"Target Labels", value:"3"       },
        ].map(s => (
          <div key={s.label} style={{ background:"#282828", borderRadius:10, padding:"14px 16px" }}>
            <p style={{ fontSize:11, color:"#6a6a6a", marginBottom:6 }}>{s.label}</p>
            <p style={{ fontSize:22, fontWeight:700 }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Feature table */}
      <div style={{ background:"#282828", borderRadius:10, padding:16, marginBottom:20 }}>
        <p style={{ fontSize:13, color:"#b3b3b3", marginBottom:12 }}>AUDIO FEATURES</p>
        <table style={{ width:"100%", borderCollapse:"collapse", fontSize:12 }}>
          <thead>
            <tr style={{ borderBottom:"1px solid #444" }}>
              <th style={{ textAlign:"left", padding:"8px 10px", color:"#6a6a6a", fontWeight:500 }}>Feature</th>
              <th style={{ textAlign:"left", padding:"8px 10px", color:"#6a6a6a", fontWeight:500 }}>Description</th>
              <th style={{ textAlign:"left", padding:"8px 10px", color:"#6a6a6a", fontWeight:500 }}>Used for</th>
            </tr>
          </thead>
          <tbody>
            {FEATURES.map(f => (
              <tr key={f.name} style={{ borderBottom:"1px solid #333" }}>
                <td style={{ padding:"8px 10px", color:"#1DB954", fontFamily:"monospace",
                              fontWeight:600, whiteSpace:"nowrap" }}>{f.name}</td>
                <td style={{ padding:"8px 10px", color:"#b3b3b3", lineHeight:1.4 }}>{f.desc}</td>
                <td style={{ padding:"8px 10px" }}>
                  <div style={{ display:"flex", gap:4, flexWrap:"wrap" }}>
                    {f.used.map(t => (
                      <span key={t} style={{ fontSize:10, padding:"2px 7px", borderRadius:10,
                                             background: TASK_COLOR[t]+"22",
                                             color: TASK_COLOR[t], border:`1px solid ${TASK_COLOR[t]}44` }}>
                        {t}
                      </span>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mood logic */}
      <div style={{ background:"#282828", borderRadius:10, padding:16 }}>
        <p style={{ fontSize:13, color:"#b3b3b3", marginBottom:12 }}>MOOD LABEL LOGIC (feature engineering)</p>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:10 }}>
          {MOOD_LOGIC.map(m => (
            <div key={m.mood} style={{ background:"#121212", borderRadius:8, padding:"12px 14px",
                                       borderLeft:`3px solid ${m.color}` }}>
              <p style={{ fontWeight:700, color:m.color, marginBottom:4 }}>{m.mood}</p>
              <p style={{ fontSize:12, color:"#b3b3b3", fontFamily:"monospace" }}>{m.cond}</p>
            </div>
          ))}
        </div>
        <p style={{ fontSize:12, color:"#6a6a6a", marginTop:12 }}>
          Popularity: score ≥ 70 → "High", score &lt; 70 → "Low"
        </p>
      </div>
    </div>
  );
}
