import { AlertTriangle, XCircle, Terminal } from 'lucide-react';

export default function ViolationModal({ isOpen, onClose, violationType = "Tab Switch Detected", strikes = 2, maxStrikes = 3, time = new Date().toLocaleTimeString() }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="glass-panel w-full max-w-md relative animate-in fade-in zoom-in duration-300">
        
        {/* Header styling for Danger */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-red-500 to-red-700 shadow-[0_0_20px_rgba(239,68,68,0.8)] rounded-t-2xl"></div>

        <div className="p-8">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-brand-danger/20 border-2 border-brand-danger flex items-center justify-center shadow-[0_0_30px_rgba(239,68,68,0.4)] animate-pulse">
              <AlertTriangle className="text-brand-danger w-8 h-8" />
            </div>
          </div>

          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-white tracking-tight">Violation Detected</h2>
            <p className="text-brand-danger font-medium mt-1 uppercase tracking-wider text-sm">{violationType}</p>
          </div>

          <div className="space-y-4 mb-8">
            <div className="p-3 bg-black/30 rounded-lg border border-brand-border flex items-center justify-between">
              <span className="text-brand-muted text-sm">Strike Counter</span>
              <div className="flex gap-1">
                {Array.from({ length: maxStrikes }).map((_, i) => (
                  <div key={i} className={`w-8 h-2 rounded-full ${i < strikes ? 'bg-brand-danger shadow-[0_0_8px_rgba(239,68,68,0.8)]' : 'bg-white/10'}`}></div>
                ))}
                <span className="text-white font-bold ml-2 text-sm">{strikes}/{maxStrikes}</span>
              </div>
            </div>

            <div className="p-3 bg-black/40 rounded-lg border border-red-500/20">
              <div className="flex items-center gap-2 mb-2 text-xs font-medium text-brand-muted uppercase tracking-wider">
                 <Terminal size={12} /> System Log Trace
              </div>
              <div className="font-mono text-xs text-red-200">
                [{time}] SYS_EVENT: Focus lost on primary examination window.<br/>
                [{time}] ACTION: Auto-logged violation and captured state snapshot.
              </div>
            </div>
            
            <div className="text-xs text-brand-muted text-center italic">
              Warning: Accumulating {maxStrikes} strikes will result in immediate termination of the examination session.
            </div>
          </div>

          <button 
            onClick={onClose}
            className="w-full btn-danger py-3 font-semibold uppercase tracking-widest text-sm flex justify-center items-center gap-2"
          >
            <XCircle size={18} /> Acknowledge Warning
          </button>
        </div>
      </div>
    </div>
  );
}
