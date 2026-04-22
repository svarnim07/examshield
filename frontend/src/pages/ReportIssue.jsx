import { useState } from 'react';
import { Send, ShieldAlert, CheckCircle2 } from 'lucide-react';

export default function ReportIssue() {
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Save to localStorage so Faculty can see it
    const existing = JSON.parse(localStorage.getItem('grievances') || '[]');
    const newGrievance = {
      id: `RPT-${Math.floor(100 + Math.random() * 900)}`,
      category,
      description,
      time: new Date().toLocaleTimeString(),
      student: 'STU-84729',
      status: 'pending'
    };
    localStorage.setItem('grievances', JSON.stringify([newGrievance, ...existing]));
    
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-center space-y-4">
        <div className="w-16 h-16 rounded-full flex items-center justify-center bg-brand-bg-2 border border-brand-border">
          <CheckCircle2 className="text-brand-success" size={32} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">Issue Reported</h2>
          <p className="text-brand-muted mt-2">Your report has been securely transmitted to the faculty dashboard.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
          <ShieldAlert className="text-brand-primary" size={28} />
          Report Technical Issue
        </h1>
        <p className="text-brand-muted text-sm mt-1">If you experienced technical difficulties during an assessment, file a report here.</p>
      </div>

      <div className="glass-panel p-6">
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="text-xs font-medium text-brand-muted uppercase tracking-wider block mb-1">Issue Type</label>
            <select className="input-glass w-full" required value={category} onChange={e => setCategory(e.target.value)}>
              <option value="">Select Category</option>
              <option value="Camera/Mic Failure">Camera/Mic Failure</option>
              <option value="Network Disconnection">Network Disconnection</option>
              <option value="Platform Crash">Platform Crash</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-brand-muted uppercase tracking-wider block mb-1">Description</label>
            <textarea 
              className="input-glass w-full min-h-[150px] resize-none" 
              placeholder="Provide detailed information about the issue..." 
              value={description}
              onChange={e => setDescription(e.target.value)}
              required
            ></textarea>
          </div>
          <button type="submit" className="btn-primary w-full py-3 flex justify-center items-center gap-2">
            <Send size={18} /> Submit Report
          </button>
        </form>
      </div>
    </div>
  );
}
