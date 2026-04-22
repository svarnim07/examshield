import { Shield, Server, Users, FilePlus, CheckCircle, XCircle, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function InstitutionControl() {
  const navigate = useNavigate();
  const logs = [
    { time: '10:42 AM', actor: 'Admin_SC', action: 'Provisioned Exam CS402', status: 'SUCCESS' },
    { time: '10:38 AM', actor: 'System', action: 'Node Alpha Scaling', status: 'SUCCESS' },
    { time: '10:15 AM', actor: 'Invigilator_JB', action: 'Terminated Session STU-441', status: 'SUCCESS' },
    { time: '09:55 AM', actor: 'API_Gateway', action: 'Sync Candidate Roster', status: 'FAILED' },
    { time: '09:50 AM', actor: 'Admin_SC', action: 'Updated Global Thresholds', status: 'SUCCESS' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Institution Control Center</h1>
          <p className="text-brand-muted text-sm mt-1">Manage platform configuration, roles, and provisioning.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Provisioning Card */}
        <div className="glass-panel p-6 flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center border border-blue-500/20 mb-4">
              <FilePlus className="text-blue-400" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Exam Provisioning</h3>
            <p className="text-brand-muted text-sm mb-4">Deploy a new secure examination environment with custom AI strictness profiles.</p>
          </div>
          <button className="btn-primary w-full py-2" onClick={() => navigate('/create-exam')}>Create New Exam</button>
        </div>

        {/* System Reliability */}
        <div className="glass-panel p-6 flex flex-col items-center justify-center text-center">
          <div className="relative mb-4">
            <div className="w-32 h-32 rounded-full border-4 border-brand-border flex items-center justify-center relative">
               <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                 <circle cx="60" cy="60" r="58" fill="none" stroke="currentColor" strokeWidth="4" className="text-brand-success stroke-dasharray-[364] stroke-dashoffset-[0]" />
               </svg>
               <h2 className="text-3xl font-bold text-white relative z-10">99.9<span className="text-sm">%</span></h2>
            </div>
          </div>
          <h3 className="text-lg font-bold text-white">System Reliability</h3>
          <p className="text-brand-muted text-xs mt-1">All core microservices operational</p>
        </div>

        {/* Role Management */}
        <div className="glass-panel p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Users size={18} className="text-brand-primary"/> Role Management
            </h3>
            <button className="text-xs text-brand-primary hover:text-white transition-colors" onClick={() => alert("Opening Role Configuration Manager...")}>Manage</button>
          </div>
          <div className="space-y-3">
            {['Super Admin', 'Chief Invigilator', 'Reviewer', 'Support Agent'].map((role, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/5">
                <span className="text-sm text-white font-medium">{role}</span>
                <span className="text-xs bg-black/50 px-2 py-1 rounded text-brand-muted">
                  {(i * 2) + 3} active
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Audit Logs Table */}
      <div className="glass-panel overflow-hidden">
        <div className="p-4 border-b border-brand-border bg-white/5 flex items-center justify-between">
          <h3 className="text-white font-medium flex items-center gap-2">
            <Server size={18} /> System Audit Logs
          </h3>
          <button className="text-xs btn-ghost py-1" onClick={() => alert("Downloading full CSV log export...")}>View Full Log</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-black/20 text-brand-muted uppercase text-xs">
              <tr>
                <th className="px-6 py-3 font-medium">Timestamp</th>
                <th className="px-6 py-3 font-medium">Actor</th>
                <th className="px-6 py-3 font-medium">Action</th>
                <th className="px-6 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border/50">
              {logs.map((log, i) => (
                <tr key={i} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 text-brand-muted font-mono text-xs">{log.time}</td>
                  <td className="px-6 py-4 text-white font-medium">{log.actor}</td>
                  <td className="px-6 py-4 text-brand-muted">{log.action}</td>
                  <td className="px-6 py-4">
                    {log.status === 'SUCCESS' ? (
                      <span className="flex items-center gap-1 text-brand-success text-xs bg-brand-success/10 px-2 py-1 rounded w-fit">
                        <CheckCircle size={12} /> {log.status}
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-brand-danger text-xs bg-brand-danger/10 px-2 py-1 rounded w-fit">
                        <XCircle size={12} /> {log.status}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
