import { ServerCrash, RefreshCcw, Save, AlertTriangle, Terminal, Database } from 'lucide-react';

export default function SystemRecovery() {
  const logs = [
    { id: '1', time: '10:45:12 AM', event: 'Connection dropped. Node: STU-84729', type: 'error' },
    { id: '2', time: '10:45:15 AM', event: 'Auto-save triggered. Snapshot buffered.', type: 'info' },
    { id: '3', time: '10:46:02 AM', event: 'Attempting websocket reconnection...', type: 'warning' },
    { id: '4', time: '10:46:05 AM', event: 'Connection re-established. Syncing buffer.', type: 'success' },
    { id: '5', time: '10:46:08 AM', event: 'State fully recovered. Resuming monitoring.', type: 'success' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <ServerCrash className="text-brand-primary" size={28} />
            System Recovery & Resilience
          </h1>
          <p className="text-brand-muted text-sm mt-1">Manage disruption recovery, state buffers, and node reconnects.</p>
        </div>
        <button className="btn-ghost flex items-center gap-2 border border-brand-border" onClick={() => alert("Initiating force sync across all remote nodes...")}>
          <RefreshCcw size={16} /> Force Sync All Nodes
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6 flex items-start gap-4 border-l-4 border-brand-success">
          <div className="p-3 rounded-xl bg-brand-success/10 text-brand-success">
            <Save size={24} />
          </div>
          <div>
            <h3 className="text-white font-medium mb-1">Global Auto-Save</h3>
            <p className="text-brand-muted text-sm mb-3">All nodes syncing state every 30s.</p>
            <span className="text-xs font-mono bg-black/40 px-2 py-1 rounded text-brand-success">Status: ACTIVE</span>
          </div>
        </div>

        <div className="glass-card p-6 flex items-start gap-4 border-l-4 border-brand-warning">
          <div className="p-3 rounded-xl bg-brand-warning/10 text-brand-warning">
            <Database size={24} />
          </div>
          <div>
            <h3 className="text-white font-medium mb-1">Resilience Buffer</h3>
            <p className="text-brand-muted text-sm mb-3">Currently holding disconnected state data.</p>
            <div className="flex gap-2">
              <span className="text-xs font-mono bg-black/40 px-2 py-1 rounded text-brand-warning">Usage: 14%</span>
              <span className="text-xs font-mono bg-black/40 px-2 py-1 rounded text-white">4 Nodes buffered</span>
            </div>
          </div>
        </div>

        <div className="glass-card p-6 flex items-start gap-4 border-l-4 border-brand-danger">
          <div className="p-3 rounded-xl bg-brand-danger/10 text-brand-danger">
            <AlertTriangle size={24} />
          </div>
          <div>
            <h3 className="text-white font-medium mb-1">Disruption Alerts</h3>
            <p className="text-brand-muted text-sm mb-3">Critical connection drops requiring intervention.</p>
            <span className="text-xs font-mono bg-brand-danger/20 border border-brand-danger/30 px-2 py-1 rounded text-brand-danger animate-pulse">2 Critical Faults</span>
          </div>
        </div>
      </div>

      <div className="glass-panel overflow-hidden flex flex-col h-[400px]">
        <div className="p-4 border-b border-brand-border bg-black/40 flex justify-between items-center">
          <h3 className="text-white font-medium flex items-center gap-2 text-sm uppercase tracking-wider">
            <Terminal size={16} className="text-brand-primary"/> Recovery Telemetry
          </h3>
          <span className="flex items-center gap-2 text-xs text-brand-success">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-success opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-success"></span>
            </span>
            Live Stream
          </span>
        </div>
        
        <div className="flex-1 p-4 overflow-y-auto space-y-2 bg-[#020617] font-mono text-xs custom-scrollbar">
          {logs.map((log) => (
             <div key={log.id} className="flex gap-3 py-1">
               <span className="text-brand-muted whitespace-nowrap">[{log.time}]</span>
               <span className={`flex-1 ${
                 log.type === 'error' ? 'text-red-400' :
                 log.type === 'warning' ? 'text-yellow-400' :
                 log.type === 'success' ? 'text-green-400' : 'text-blue-300'
               }`}>
                 {log.event}
               </span>
             </div>
          ))}
          <div className="flex gap-3 py-1 animate-pulse">
            <span className="text-brand-muted whitespace-nowrap">[{new Date().toLocaleTimeString()}]</span>
            <span className="text-brand-muted">Awaiting events...</span>
          </div>
        </div>
      </div>
    </div>
  );
}
