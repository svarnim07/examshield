import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Mic, Wifi, ShieldCheck, AlertCircle, Fingerprint, Lock, User, UserCheck, ChevronLeft } from 'lucide-react';

export default function AuthInit() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Select Role, 2: Login Form
  const [role, setRole] = useState('student'); // 'student' or 'faculty'
  const [diagnostics, setDiagnostics] = useState({
    camera: 'checking',
    mic: 'checking',
    network: 'checking'
  });

  useEffect(() => {
    // Simulate diagnostic checks
    setTimeout(() => setDiagnostics(prev => ({ ...prev, camera: 'pass' })), 1500);
    setTimeout(() => setDiagnostics(prev => ({ ...prev, mic: 'pass' })), 2500);
    setTimeout(() => setDiagnostics(prev => ({ ...prev, network: 'pass' })), 1000);
  }, []);

  const allPassed = Object.values(diagnostics).every(status => status === 'pass');

  const handleRoleSelect = (selectedRole) => {
    setRole(selectedRole);
    setStep(2);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    localStorage.setItem('role', role);
    if (role === 'student') {
      navigate('/student-dash'); 
    } else {
      navigate('/dashboard'); 
    }
  };

  return (
    <div className="min-h-screen bg-brand-bg-1 flex items-center justify-center p-6 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brand-bg-2 via-brand-bg-1 to-black transition-colors duration-300">
      {/* Background Grid Elements */}
      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 z-10">
        
        {/* Left Column - Branding & Info */}
        <div className="flex flex-col justify-center space-y-8">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-brand-primary/30 bg-brand-primary/10 w-fit">
            <div className="w-2 h-2 rounded-full bg-brand-primary animate-pulse"></div>
            <span className="text-sm font-medium text-brand-primary uppercase tracking-wider">Node Alpha Connected</span>
          </div>
          
          <div>
            <h1 className="text-5xl font-bold text-brand-text leading-tight mb-4 tracking-tight">
              Secure Environment <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 glow-text">
                Initialization
              </span>
            </h1>
            <p className="text-brand-muted text-lg max-w-md">
              ExamShield requires strict biometric and environmental validation before establishing a secure session.
            </p>
          </div>

          <div className="glass-card p-6 space-y-4">
            <h3 className="text-brand-text font-medium flex items-center gap-2">
              <ShieldCheck className="text-brand-success" size={20} />
              System Diagnostics
            </h3>
            
            <div className="space-y-3">
              {[
                { label: 'Camera Stream', icon: <Camera size={18} />, status: diagnostics.camera },
                { label: 'Audio Capture', icon: <Mic size={18} />, status: diagnostics.mic },
                { label: 'Network Latency', icon: <Wifi size={18} />, status: diagnostics.network },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-black/5 dark:bg-black/20 border border-brand-border">
                  <div className="flex items-center gap-3 text-brand-muted">
                    {item.icon}
                    <span>{item.label}</span>
                  </div>
                  {item.status === 'checking' ? (
                    <div className="w-4 h-4 rounded-full border-2 border-brand-primary border-t-transparent animate-spin"></div>
                  ) : (
                    <span className="text-xs font-medium px-2 py-1 rounded bg-brand-success/20 text-brand-success border border-brand-success/30">
                      OPTIMAL
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Auth Form */}
        <div className="flex items-center justify-center">
          <div className="glass-panel w-full max-w-md p-8 relative overflow-hidden transition-all duration-300">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-b-full shadow-[0_0_20px_rgba(139,92,246,0.8)]"></div>
            
            {step === 1 ? (
              <div className="text-center animate-in fade-in slide-in-from-right-4 duration-300">
                <h2 className="text-2xl font-bold text-brand-text mb-2">Welcome to ExamShield</h2>
                <p className="text-sm text-brand-muted mb-8">Please select your portal access level to continue.</p>

                <div className="space-y-4">
                  <button 
                    onClick={() => handleRoleSelect('student')}
                    className="w-full p-4 rounded-xl border border-brand-border bg-black/5 dark:bg-black/20 hover:border-brand-primary hover:bg-brand-primary/10 transition-all flex items-center gap-4 group"
                  >
                    <div className="w-12 h-12 rounded-lg bg-brand-primary/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <User className="text-brand-primary" size={24} />
                    </div>
                    <div className="text-left">
                      <h3 className="text-brand-text font-bold text-lg">Candidate Portal</h3>
                      <p className="text-brand-muted text-xs">Take exams and view assignments</p>
                    </div>
                  </button>

                  <button 
                    onClick={() => handleRoleSelect('faculty')}
                    className="w-full p-4 rounded-xl border border-brand-border bg-black/5 dark:bg-black/20 hover:border-blue-500 hover:bg-blue-500/10 transition-all flex items-center gap-4 group"
                  >
                    <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <ShieldCheck className="text-blue-500" size={24} />
                    </div>
                    <div className="text-left">
                      <h3 className="text-brand-text font-bold text-lg">Faculty Portal</h3>
                      <p className="text-brand-muted text-xs">Manage exams and monitor candidates</p>
                    </div>
                  </button>
                </div>
              </div>
            ) : (
              <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                <button 
                  onClick={() => setStep(1)} 
                  className="mb-6 flex items-center gap-1 text-sm text-brand-muted hover:text-brand-text transition-colors"
                >
                  <ChevronLeft size={16} /> Back to Role Selection
                </button>
                
                <div className="text-center mb-6">
                  <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600/20 to-purple-600/20 flex items-center justify-center border border-brand-primary/30 mb-4 shadow-[0_0_15px_rgba(139,92,246,0.2)]">
                    <Fingerprint className="text-brand-primary" size={32} />
                  </div>
                  <h2 className="text-2xl font-bold text-brand-text">Identity Verification</h2>
                  <p className="text-sm text-brand-muted mt-1">
                    Authenticating as <strong className="text-brand-primary capitalize">{role}</strong>
                  </p>
                </div>

                <form className="space-y-5" onSubmit={handleLogin}>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-brand-muted uppercase tracking-wider">
                      {role === 'student' ? 'Candidate ID' : 'Faculty ID'}
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-muted" size={18} />
                      <input type="text" className="input-glass pl-10 bg-black/5 dark:bg-black/20 text-brand-text" placeholder={role === 'student' ? "e.g. STU-84729" : "e.g. FAC-102"} required />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-brand-muted uppercase tracking-wider">Passcode</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-muted" size={18} />
                      <input type="password" className="input-glass pl-10 bg-black/5 dark:bg-black/20 text-brand-text" placeholder="••••••••" required />
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-brand-warning/10 border border-brand-warning/20 flex items-start gap-3">
                    <AlertCircle className="text-brand-warning shrink-0 mt-0.5" size={18} />
                    <p className="text-xs text-brand-muted">
                      <span className="text-brand-text font-medium block mb-0.5">MFA Required</span>
                      A push notification will be sent to your registered device upon continuing.
                    </p>
                  </div>

                  <button 
                    type="submit" 
                    disabled={!allPassed}
                    className={`w-full btn-primary py-3 text-lg font-semibold flex items-center justify-center gap-2 ${!allPassed ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    Authenticate & Connect
                    <UserCheck size={20} />
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
