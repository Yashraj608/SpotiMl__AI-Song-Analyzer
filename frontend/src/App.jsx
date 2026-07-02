import { useState } from "react";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Predict from "./pages/Predict";
import ModelStats from "./pages/ModelStats";
import Dataset from "./pages/Dataset";

export default function App() {
  const [page, setPage] = useState("dashboard");

  const pages = {
    dashboard:   <Dashboard />,
    predict:     <Predict />,
    modelstats:  <ModelStats />,
    dataset:     <Dataset />,
  };

  return (
    <div style={{ display:"flex", height:"100vh", background:"#121212", color:"#fff",
                  fontFamily:"'Circular','Helvetica Neue',Helvetica,Arial,sans-serif" }}>
      <Sidebar current={page} onNav={setPage} />
      <main style={{ flex:1, overflowY:"auto", background:"#181818" }}>
        {pages[page] || <Dashboard />}
      </main>
    </div>
  );
}
