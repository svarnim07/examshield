import { useState } from 'react';
import { AlertTriangle, Check, X, ArrowUpRight, Maximize2, ShieldAlert } from 'lucide-react';

export default function IncidentReview() {
  const [incidentStatus, setIncidentStatus] = useState('pending');

  if (incidentStatus !== 'pending') {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-center space-y-4">
        <div className="w-16 h-16 rounded-full flex items-center justify-center bg-brand-bg-2 border border-brand-border">
          <Check className="text-brand-success" size={32} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">Action Recorded</h2>
          <p className="text-brand-muted mt-2">The incident has been processed and candidate record updated.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between border-b border-brand-border pb-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <ShieldAlert className="text-brand-danger" size={28} />
            Incident Review: #INC-8942
          </h1>
          <p className="text-brand-muted text-sm mt-1">Candidate ID: STU-84729 • Exam: CS402</p>
        </div>
        <div className="text-right">
           <span className="bg-brand-danger/20 text-brand-danger border border-brand-danger/30 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
             Status: Pending Review
           </span>
           <p className="text-brand-muted text-xs font-mono mt-2">Logged: 10:42:15 AM</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Evidence Panel */}
        <div className="lg:col-span-2 glass-panel overflow-hidden flex flex-col">
          <div className="p-3 bg-black/40 border-b border-brand-border flex justify-between items-center">
            <span className="text-sm font-medium text-white uppercase tracking-wider">Primary Evidence</span>
            <button className="text-brand-muted hover:text-white"><Maximize2 size={16} /></button>
          </div>
          <div className="relative bg-black flex-1 min-h-[400px] flex items-center justify-center">
             <div className="absolute inset-0 bg-gradient-to-t from-[#020617] to-transparent z-10 pointer-events-none"></div>
             
             <div className="absolute top-1/4 right-1/4 w-32 h-40 border-2 border-brand-danger shadow-[0_0_15px_rgba(239,68,68,0.8)] z-20 rounded bg-red-500/10">
               <span className="absolute -top-6 left-0 bg-brand-danger text-white text-[10px] font-bold px-1.5 py-0.5 rounded uppercase">Unrecognized Object</span>
             </div>

             <img src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1000&auto=format&fit=crop" alt="Evidence" className="w-full h-full object-cover opacity-60" />
          </div>
        </div>

        {/* AI Analysis Panel */}
        <div className="glass-panel p-6 flex flex-col gap-6">
          <div>
            <h3 className="text-white font-medium mb-3 uppercase text-sm tracking-wider">AI Analysis</h3>
            <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-sm text-red-200">
              <span className="font-bold text-red-400 block mb-1">Violation Type: Unauthorized Device</span>
              The system detected a secondary electronic device in the candidate's peripheral vision. Consistent gaze deviation recorded 5 seconds prior.
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm text-brand-muted">Confidence Score</span>
              <span className="text-brand-primary font-bold">96.4%</span>
            </div>
            <div className="h-2 bg-black/40 rounded-full w-full overflow-hidden border border-white/5">
              <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 shadow-[0_0_10px_rgba(139,92,246,0.8)]" style={{ width: '96.4%' }}></div>
            </div>
          </div>

          <div className="space-y-2 mt-auto pt-4 border-t border-brand-border">
            <h3 className="text-white font-medium mb-2 uppercase text-xs tracking-wider text-brand-muted">Adjudication</h3>
            <button className="w-full btn-danger flex justify-center items-center gap-2 py-2.5" onClick={() => setIncidentStatus('confirmed')}>
              <Check size={18} /> Confirm Violation
            </button>
            <button className="w-full btn-ghost border border-brand-border flex justify-center items-center gap-2 py-2.5 hover:bg-white/5" onClick={() => setIncidentStatus('dismissed')}>
              <X size={18} /> Dismiss Flag
            </button>
            <button className="w-full btn-ghost border border-brand-border flex justify-center items-center gap-2 py-2.5 text-brand-warning hover:bg-brand-warning/10 hover:border-brand-warning/30 hover:text-brand-warning" onClick={() => setIncidentStatus('escalated')}>
              <ArrowUpRight size={18} /> Escalate to Dean
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
