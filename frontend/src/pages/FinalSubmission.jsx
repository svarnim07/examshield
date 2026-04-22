import { CheckCircle, ShieldCheck, AlertCircle, FileText, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function FinalSubmission() {
  const risk = "LOW"; // could be dynamic based on props or state

  const getRiskColor = (r) => {
    switch(r) {
      case "HIGH": return "text-brand-danger bg-brand-danger/10 border-brand-danger/30";
      case "MEDIUM": return "text-brand-warning bg-brand-warning/10 border-brand-warning/30";
      default: return "text-brand-success bg-brand-success/10 border-brand-success/30";
    }
  };

  return (
    <div className="min-h-screen bg-brand-bg-1 flex items-center justify-center p-6 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#0f172a] via-[#020617] to-black">
      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      
      <div className="max-w-xl w-full z-10 space-y-8">
        
        {/* Header Success */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-brand-success/10 border-2 border-brand-success/30 mb-6 shadow-[0_0_30px_rgba(34,197,94,0.2)]">
            <CheckCircle className="text-brand-success w-12 h-12" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">Exam Submitted</h1>
          <p className="text-brand-muted text-lg">Your responses have been securely uploaded and encrypted.</p>
        </div>

        {/* AI Summary Card */}
        <div className="glass-panel p-8 relative overflow-hidden">
          {/* Subtle glow based on risk */}
          <div className={`absolute top-0 inset-x-0 h-1 bg-gradient-to-r ${
             risk === 'HIGH' ? 'from-red-500 to-orange-500 shadow-[0_0_20px_rgba(239,68,68,0.8)]' : 
             risk === 'MEDIUM' ? 'from-orange-400 to-yellow-500 shadow-[0_0_20px_rgba(249,115,22,0.8)]' : 
             'from-emerald-400 to-teal-500 shadow-[0_0_20px_rgba(34,197,94,0.8)]'
          }`}></div>

          <div className="flex items-center justify-between mb-6">
            <h3 className="text-white font-medium flex items-center gap-2">
              <ShieldCheck className="text-brand-primary" size={20} /> AI Proctoring Summary
            </h3>
            <span className={`text-xs font-bold px-3 py-1 rounded-full border ${getRiskColor(risk)}`}>
              {risk} RISK SCORE
            </span>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-black/20 rounded-lg border border-white/5">
              <span className="text-sm text-brand-muted">Identity Verification</span>
              <span className="text-sm text-brand-success font-medium flex items-center gap-1"><CheckCircle size={14}/> Verified throughout</span>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-black/20 rounded-lg border border-white/5">
              <span className="text-sm text-brand-muted">Gaze Tracking</span>
              <span className="text-sm text-white font-medium">96% Aligned</span>
            </div>

            <div className="flex justify-between items-center p-3 bg-black/20 rounded-lg border border-white/5">
              <span className="text-sm text-brand-muted">Audio Anomaly</span>
              <span className="text-sm text-white font-medium">0 Incidents Detected</span>
            </div>
          </div>

          {risk !== 'LOW' && (
            <div className="mt-6 p-4 rounded-lg bg-brand-warning/10 border border-brand-warning/20 flex items-start gap-3">
              <AlertCircle className="text-brand-warning shrink-0 mt-0.5" size={18} />
              <p className="text-xs text-brand-muted">
                <span className="text-white font-medium block mb-0.5">Flags Detected During Session</span>
                Your session has been flagged for review. If you believe this is an error, you may submit an appeal.
              </p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          {risk !== 'LOW' ? (
             <Link to="/grievance" className="btn-ghost border border-brand-border w-full py-3 flex justify-center items-center gap-2 text-brand-muted hover:text-white">
               <FileText size={18} /> Submit Appeal
             </Link>
          ) : null}
          <Link to="/auth" className="btn-primary w-full py-3 flex justify-center items-center gap-2">
            Return to Dashboard <ArrowRight size={18} />
          </Link>
        </div>

      </div>
    </div>
  );
}
