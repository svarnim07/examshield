import { useState, useEffect } from 'react';
import { MessageSquare, Clock, CheckCircle2, XCircle, PlayCircle, Scale } from 'lucide-react';

export default function GrievanceSystem() {
  const [grievances, setGrievances] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('grievances') || '[]');
    setGrievances(stored.filter(g => g.status === 'pending'));
  }, []);

  const handleAction = (id, action) => {
    const stored = JSON.parse(localStorage.getItem('grievances') || '[]');
    const updated = stored.map(g => {
      if (g.id === id) return { ...g, status: action };
      return g;
    });
    localStorage.setItem('grievances', JSON.stringify(updated));
    setGrievances(updated.filter(g => g.status === 'pending'));
  };

  if (grievances.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-center space-y-4">
        <div className="w-16 h-16 rounded-full flex items-center justify-center bg-brand-bg-2 border border-brand-border">
          <CheckCircle2 className="text-brand-success" size={32} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">All Caught Up!</h2>
          <p className="text-brand-muted mt-2">There are no pending grievances left to review.</p>
        </div>
      </div>
    );
  }

  const activeGrievance = grievances[0];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between border-b border-brand-border pb-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <Scale className="text-brand-primary" size={28} />
            Grievance & Appeal Adjudication
          </h1>
          <p className="text-brand-muted text-sm mt-1">Review candidate appeals regarding automated flags and penalties.</p>
        </div>
        <div className="text-right">
           <span className="bg-brand-warning/20 text-brand-warning border border-brand-warning/30 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
             {grievances.length} Pending
           </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="glass-panel overflow-hidden flex flex-col h-[600px]">
          <div className="p-4 border-b border-brand-border bg-black/20">
            <h3 className="text-white font-medium text-sm tracking-wider uppercase">Active Queue</h3>
          </div>
          <div className="overflow-y-auto flex-1 p-2 space-y-2">
            {grievances.map(g => (
              <div key={g.id} className={`p-3 rounded-lg border cursor-pointer transition-all ${activeGrievance.id === g.id ? 'bg-brand-primary/10 border-brand-primary/50' : 'bg-white/5 border-white/5 hover:bg-white/10'}`}>
                <div className="flex justify-between items-start mb-1">
                  <span className="text-white font-medium text-sm">{g.id}</span>
                  <span className="text-xs text-brand-muted">{g.time}</span>
                </div>
                <p className="text-xs text-brand-muted font-mono">{g.student}</p>
                <div className="mt-2 text-xs px-2 py-1 bg-red-500/10 text-red-400 rounded w-fit border border-red-500/20">
                  {g.category}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="glass-panel p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold text-white">{activeGrievance.id}</h2>
                <p className="text-brand-muted mt-1 text-sm font-mono">Candidate: {activeGrievance.student} • Flag: {activeGrievance.category}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-black/20 border border-white/5">
                <h4 className="text-xs font-medium text-brand-muted uppercase tracking-wider mb-2 flex items-center gap-2"><MessageSquare size={14}/> Candidate Statement</h4>
                <p className="text-brand-text text-sm leading-relaxed">
                  "{activeGrievance.description}"
                </p>
              </div>
            </div>
          </div>

          <div className="glass-card p-6">
            <h3 className="text-sm font-medium text-brand-muted uppercase tracking-wider mb-4">Timeline</h3>
            <div className="relative border-l border-brand-border ml-3 space-y-6">
              <div className="relative">
                <div className="absolute -left-[25px] bg-brand-bg-1 p-1 rounded-full">
                  <CheckCircle2 size={16} className="text-brand-success" />
                </div>
                <div className="pl-4">
                  <p className="text-sm text-white font-medium">Violation Flagged</p>
                  <p className="text-xs text-brand-muted">Auto-generated</p>
                </div>
              </div>
              <div className="relative">
                <div className="absolute -left-[25px] bg-brand-bg-1 p-1 rounded-full">
                  <div className="w-4 h-4 rounded-full border-2 border-brand-primary border-t-transparent animate-spin"></div>
                </div>
                <div className="pl-4">
                  <p className="text-sm text-brand-primary font-medium">Under Review</p>
                  <p className="text-xs text-brand-muted">Pending Faculty Decision</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Evidence & Adjudication */}
        <div className="lg:col-span-2 space-y-6 flex flex-col">
          <div className="glass-panel overflow-hidden flex-1 flex flex-col">
            <div className="p-4 border-b border-brand-border bg-black/40 flex justify-between items-center">
              <span className="text-sm font-medium text-white uppercase tracking-wider">Session Recording Snippet</span>
              <span className="text-xs font-mono text-brand-muted">10:15:01 AM - 10:15:15 AM</span>
            </div>
            
            <div className="relative flex-1 min-h-[300px] bg-black flex items-center justify-center">
              <PlayCircle className="text-white/50 hover:text-white cursor-pointer transition-colors w-16 h-16 absolute z-20" />
              <img src="https://images.unsplash.com/photo-1571260899304-425070110588?q=80&w=1000&auto=format&fit=crop" alt="Video frame" className="w-full h-full object-cover opacity-40 grayscale" />
              
              <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black to-transparent flex gap-4 text-xs font-mono text-brand-muted">
                 <span>GAZE_X: -45.2</span>
                 <span>GAZE_Y: 30.1</span>
                 <span className="text-brand-danger">PITCH: DOWN_EXTREME</span>
              </div>
            </div>
          </div>

          <div className="glass-card p-6 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-white">Faculty Decision</h3>
              <p className="text-brand-muted text-sm mt-1">Final ruling cannot be appealed further.</p>
            </div>
            <div className="flex gap-3">
              <button 
                className="btn-ghost flex items-center gap-2 border border-brand-border text-brand-danger hover:bg-brand-danger/10 hover:text-brand-danger hover:border-brand-danger/30" 
                onClick={() => handleAction(activeGrievance.id, 'rejected')}
              >
                <XCircle size={18} /> Reject Appeal
              </button>
              <button 
                className="btn-primary flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 shadow-[0_0_15px_rgba(34,197,94,0.4)] hover:shadow-[0_0_25px_rgba(34,197,94,0.6)]" 
                onClick={() => handleAction(activeGrievance.id, 'accepted')}
              >
                <CheckCircle2 size={18} /> Accept Appeal & Clear Flag
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
