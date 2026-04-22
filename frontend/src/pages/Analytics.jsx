import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Download, FileText, TrendingUp, AlertTriangle, ShieldCheck } from 'lucide-react';

const accuracyData = [
  { name: 'True Positives', value: 87, color: '#8b5cf6' },
  { name: 'False Positives', value: 13, color: '#3b82f6' }
];

const trendData = [
  { name: 'Mon', flags: 12 }, { name: 'Tue', flags: 19 }, { name: 'Wed', flags: 15 },
  { name: 'Thu', flags: 22 }, { name: 'Fri', flags: 8 }, { name: 'Sat', flags: 30 },
  { name: 'Sun', flags: 5 }
];

export default function Analytics() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">System Analytics</h1>
          <p className="text-brand-muted text-sm mt-1">Aggregated integrity and performance metrics.</p>
        </div>
        <div className="flex gap-3">
          <button className="btn-ghost flex items-center gap-2 border border-white/10" onClick={() => alert("Exporting data to CSV...")}>
            <FileText size={18} /> Export CSV
          </button>
          <button className="btn-primary flex items-center gap-2" onClick={() => alert("Downloading PDF report...")}>
            <Download size={18} /> Download Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-2 glass-panel p-6 flex flex-col justify-center relative overflow-hidden">
          <div className="absolute top-0 right-0 p-6 opacity-10">
             <ShieldCheck size={120} />
          </div>
          <p className="text-brand-muted uppercase tracking-wider text-sm font-medium mb-2">Global Integrity Score</p>
          <div className="flex items-end gap-4 mb-4">
            <h2 className="text-6xl font-bold text-white glow-text">94.2<span className="text-3xl">%</span></h2>
            <div className="flex items-center gap-1 text-brand-success mb-2 bg-brand-success/10 px-2 py-1 rounded text-sm">
              <TrendingUp size={16} /> +2.4%
            </div>
          </div>
          <div className="h-3 bg-black/40 rounded-full w-full overflow-hidden border border-white/5">
            <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 shadow-[0_0_10px_rgba(139,92,246,0.8)]" style={{ width: '94.2%' }}></div>
          </div>
        </div>

        <div className="glass-panel p-6 flex flex-col items-center justify-center">
          <p className="text-brand-muted uppercase tracking-wider text-sm font-medium mb-4 w-full">AI Flag Accuracy</p>
          <div className="h-32 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={accuracyData} innerRadius={40} outerRadius={60} paddingAngle={5} dataKey="value" stroke="none">
                  {accuracyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px' }} itemStyle={{ color: '#fff' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex gap-4 mt-2">
            {accuracyData.map((d, i) => (
              <div key={i} className="flex items-center gap-2 text-xs text-brand-muted">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }}></div>
                {d.name}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-card p-6 h-80 flex flex-col">
          <h3 className="text-white font-medium mb-4">Weekly Violation Trends</h3>
          <div className="flex-1">
             <ResponsiveContainer width="100%" height="100%">
                <BarChart data={trendData}>
                  <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px' }} />
                  <Bar dataKey="flags" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                </BarChart>
             </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card p-6 h-80 flex flex-col">
          <h3 className="text-white font-medium mb-4">Active Sessions Overview</h3>
          <div className="flex-1 flex flex-col justify-center space-y-6">
             <div>
               <div className="flex justify-between mb-2">
                 <span className="text-brand-muted text-sm">Concurrent Exams</span>
                 <span className="text-white font-medium">1,248</span>
               </div>
               <div className="h-2 bg-black/40 rounded-full overflow-hidden">
                 <div className="h-full bg-blue-500 w-[60%]"></div>
               </div>
             </div>
             <div>
               <div className="flex justify-between mb-2">
                 <span className="text-brand-muted text-sm flex items-center gap-2"><AlertTriangle size={14} className="text-brand-warning"/> Warnings Issued</span>
                 <span className="text-white font-medium">342</span>
               </div>
               <div className="h-2 bg-black/40 rounded-full overflow-hidden">
                 <div className="h-full bg-brand-warning w-[25%]"></div>
               </div>
             </div>
             <div>
               <div className="flex justify-between mb-2">
                 <span className="text-brand-muted text-sm flex items-center gap-2"><AlertTriangle size={14} className="text-brand-danger"/> Sessions Terminated</span>
                 <span className="text-white font-medium">14</span>
               </div>
               <div className="h-2 bg-black/40 rounded-full overflow-hidden">
                 <div className="h-full bg-brand-danger w-[5%]"></div>
               </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
