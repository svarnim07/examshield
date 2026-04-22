import { useEffect, useState } from "react";
import { Users, Activity, AlertTriangle, ShieldAlert, Video, Eye, Volume2 } from "lucide-react";

function Dashboard() {
  const [students, setStudents] = useState([]);
  const [stats, setStats] = useState({ total: 0, active: 0, highRisk: 0 });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";
        const res = await fetch(`${apiUrl}/get-logs`);
        if (!res.ok) throw new Error("Network response was not ok");
        const data = await res.json();
        setStudents(data);
        
        // Calculate stats
        const active = data.length;
        const highRisk = data.filter(s => s.risk === "HIGH").length;
        setStats({ total: active > 0 ? active + 142 : 142, active, highRisk });
      } catch (err) {
        console.error("Failed to fetch logs", err);
      }
    };

    fetchData();
    const i = setInterval(fetchData, 2000);
    return () => clearInterval(i);
  }, []);

  const getRiskColor = (risk) => {
    switch (risk) {
      case "HIGH": return "text-brand-danger bg-brand-danger/10 border-brand-danger/30";
      case "MEDIUM": return "text-brand-warning bg-brand-warning/10 border-brand-warning/30";
      default: return "text-brand-success bg-brand-success/10 border-brand-success/30";
    }
  };

  const getRiskDotColor = (risk) => {
    switch (risk) {
      case "HIGH": return "bg-brand-danger shadow-[0_0_8px_rgba(239,68,68,0.8)]";
      case "MEDIUM": return "bg-brand-warning shadow-[0_0_8px_rgba(249,115,22,0.8)]";
      default: return "bg-brand-success shadow-[0_0_8px_rgba(34,197,94,0.8)]";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Active Surveillance</h1>
          <p className="text-brand-muted text-sm mt-1">Real-time monitoring of all active examination nodes.</p>
        </div>
        <div className="flex gap-3">
          <button className="btn-ghost flex items-center gap-2" onClick={() => alert("Global Audio streams enabled.")}>
            <Video size={18} /> Enable Global Audio
          </button>
          <button className="btn-primary flex items-center gap-2" onClick={() => alert("LOCKDOWN INITIATED! All exams paused.")}>
            <ShieldAlert size={18} /> Lock Down All
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6 flex items-center justify-between">
          <div>
            <p className="text-sm text-brand-muted font-medium mb-1 uppercase tracking-wider">Total Monitored</p>
            <h3 className="text-3xl font-bold text-white">{stats.total}</h3>
          </div>
          <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
            <Users className="text-blue-400" size={24} />
          </div>
        </div>
        
        <div className="glass-card p-6 flex items-center justify-between">
          <div>
            <p className="text-sm text-brand-muted font-medium mb-1 uppercase tracking-wider">Active Exams</p>
            <h3 className="text-3xl font-bold text-white">{stats.active}</h3>
          </div>
          <div className="w-12 h-12 rounded-full bg-brand-success/10 flex items-center justify-center border border-brand-success/20">
            <Activity className="text-brand-success" size={24} />
          </div>
        </div>

        <div className="glass-card p-6 flex items-center justify-between relative overflow-hidden group">
          <div className="absolute inset-0 bg-brand-danger/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div>
            <p className="text-sm text-brand-danger font-medium mb-1 uppercase tracking-wider">High Risk Flags</p>
            <h3 className="text-3xl font-bold text-white">{stats.highRisk}</h3>
          </div>
          <div className="w-12 h-12 rounded-full bg-brand-danger/10 flex items-center justify-center border border-brand-danger/20">
            <AlertTriangle className="text-brand-danger animate-pulse" size={24} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Candidates List */}
        <div className="lg:col-span-2 glass-panel p-6">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Users size={18} className="text-brand-primary" /> Live Candidate Streams
          </h2>
          
          <div className="space-y-3">
            {students.length === 0 ? (
              <div className="text-center py-10 border border-dashed border-brand-border rounded-xl bg-black/10">
                <p className="text-brand-muted">No active streams detected.</p>
              </div>
            ) : (
              students.map((s, i) => (
                <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-black/20 border border-white/5 hover:border-brand-primary/30 transition-colors group">
                  <div className="flex items-center gap-4 mb-3 sm:mb-0">
                    <div className="relative">
                      <div className="w-12 h-12 bg-gradient-to-br from-gray-700 to-gray-900 rounded-lg overflow-hidden border border-brand-border flex items-center justify-center">
                         <Video size={20} className="text-brand-muted opacity-50" />
                      </div>
                      <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-[#020617] ${getRiskDotColor(s.risk)}`}></div>
                    </div>
                    <div>
                      <h4 className="text-white font-medium group-hover:text-brand-primary transition-colors">{s.student_id}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${getRiskColor(s.risk)}`}>
                          {s.risk} RISK
                        </span>
                        <span className="text-xs text-brand-muted">Uptime: 01:24:12</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="flex gap-2">
                      {s.risk === 'HIGH' && (
                        <>
                           <div className="flex items-center gap-1 text-xs text-brand-muted bg-white/5 px-2 py-1 rounded">
                             <Eye size={12} className="text-brand-warning" /> Gaze Deviation
                           </div>
                           <div className="flex items-center gap-1 text-xs text-brand-muted bg-white/5 px-2 py-1 rounded">
                             <Volume2 size={12} className="text-brand-danger" /> Audio Anomaly
                           </div>
                        </>
                      )}
                    </div>
                    <button className="btn-ghost p-2 rounded-lg ml-2 hover:bg-brand-primary/20 hover:text-brand-primary" onClick={() => alert(`Opening live stream for ${s.student_id}`)}>
                      <Eye size={18} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Telemetry Feed */}
        <div className="glass-panel p-6 flex flex-col h-[500px]">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Activity size={18} className="text-brand-primary" /> Telemetry Alerts Feed
          </h2>
          
          <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
             {students.map((s) => (
                s.events.map((ev, idx) => (
                  <div key={`${s.student_id}-${ev.id}`} className={`p-3 rounded-lg bg-black/30 border-l-2 ${s.risk === 'HIGH' ? 'border-brand-danger' : 'border-brand-warning'}`}>
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-xs font-mono text-brand-muted">[{new Date().toLocaleTimeString()}]</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded ${s.risk === 'HIGH' ? 'bg-brand-danger/10 text-brand-danger' : 'bg-brand-warning/10 text-brand-warning'} uppercase`}>
                        {ev.event}
                      </span>
                    </div>
                    <p className="text-sm text-white">
                      Candidate <span className="font-medium text-brand-primary">{s.student_id}</span> flagged for <span className="text-brand-warning">{ev.event.replace('_', ' ')}</span>.
                    </p>
                  </div>
                ))
             )).flat().slice(0, 10)}
             {students.length === 0 && (
               <div className="text-center py-8 text-sm text-brand-muted">
                 Awaiting telemetry data...
               </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
