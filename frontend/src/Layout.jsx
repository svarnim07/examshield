import { useState, useEffect } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  BarChart3, 
  ShieldAlert, 
  Settings, 
  Activity, 
  Users,
  Search,
  Bell,
  Shield,
  UserCircle,
  Sun,
  Moon,
  LogOut
} from "lucide-react";

function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [role, setRole] = useState(localStorage.getItem('role') || 'student');
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    setRole(localStorage.getItem('role') || 'student');
  }, [location.pathname]);

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.remove('light');
    } else {
      document.body.classList.add('light');
    }
  }, [isDarkMode]);

  const handleLogout = () => {
    localStorage.removeItem('role');
    navigate('/auth');
  };

  const navItems = [
    { name: "Dashboard", path: "/dashboard", icon: <LayoutDashboard size={20} />, roles: ['faculty'] },
    { name: "Analytics", path: "/analytics", icon: <BarChart3 size={20} />, roles: ['faculty'] },
    { name: "Institution", path: "/institution", icon: <Settings size={20} />, roles: ['faculty'] },
    { name: "Incidents", path: "/incidents", icon: <ShieldAlert size={20} />, roles: ['faculty'] },
    { name: "System Recovery", path: "/recovery", icon: <Activity size={20} />, roles: ['faculty'] },
    { name: "Grievances", path: "/grievance", icon: <Users size={20} />, roles: ['faculty'] },
    
    { name: "Student Dashboard", path: "/student-dash", icon: <LayoutDashboard size={20} />, roles: ['student'] },
    { name: "Active Exam", path: "/exam", icon: <UserCircle size={20} />, roles: ['student'] },
    { name: "Report Issue", path: "/report-issue", icon: <ShieldAlert size={20} />, roles: ['student'] },
  ].filter(item => item.roles.includes(role));

  return (
    <div className="flex h-screen overflow-hidden text-brand-text bg-brand-bg-1 transition-colors duration-300">
      {/* SIDEBAR */}
      <aside className="w-64 glass-panel border-y-0 border-l-0 rounded-none rounded-r-2xl flex flex-col z-20">
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-[0_0_15px_rgba(139,92,246,0.5)]">
            <Shield className="text-white" size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-wider glow-text">ExamShield</h1>
            <p className="text-xs text-brand-primary tracking-widest font-mono uppercase">AI Core v2.4</p>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                  isActive 
                    ? "bg-brand-primary/20 text-brand-text border border-brand-primary/50 shadow-[0_0_10px_rgba(139,92,246,0.2)]" 
                    : "text-brand-muted hover:bg-black/5 dark:hover:bg-white/5 hover:text-brand-text"
                }`}
              >
                <span className={isActive ? "text-brand-primary drop-shadow-[0_0_8px_rgba(139,92,246,0.8)]" : ""}>
                  {item.icon}
                </span>
                <span className="font-medium">{item.name}</span>
                {isActive && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-brand-primary shadow-[0_0_5px_rgba(139,92,246,1)]" />
                )}
              </Link>
            );
          })}
        </nav>
        
        <div className="p-4 mt-auto">
          <div className="glass-card p-4 rounded-xl flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-brand-success shadow-[0_0_8px_rgba(34,197,94,1)] animate-pulse" />
            <div className="text-sm">
              <p className="text-brand-text font-medium">System Online</p>
              <p className="text-brand-muted text-xs">All nodes stable</p>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col h-screen relative z-10">
        {/* TOP NAVBAR */}
        <header className="h-20 glass-panel border-x-0 border-t-0 rounded-none flex items-center justify-between px-8 z-10 sticky top-0">
          <div className="flex-1 flex items-center">
            <div className="relative w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-muted" size={18} />
              <input 
                type="text" 
                placeholder="Search candidates, exams, or logs..." 
                className="input-glass pl-10 py-2.5 rounded-full !bg-black/10 dark:!bg-black/20 text-brand-text"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <button 
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="text-brand-muted hover:text-brand-text transition-colors"
            >
              {isDarkMode ? <Sun size={22} /> : <Moon size={22} />}
            </button>
            
            <button className="relative text-brand-muted hover:text-brand-text transition-colors">
              <Bell size={22} />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-brand-danger rounded-full border border-brand-bg-1 shadow-[0_0_5px_rgba(239,68,68,0.8)]"></span>
            </button>
            
            <div className="h-8 w-px bg-brand-border"></div>
            
            <div className="flex items-center gap-3 cursor-pointer group" onClick={handleLogout}>
              <div className="text-right">
                <p className="text-sm font-medium text-brand-text group-hover:text-brand-danger transition-colors flex items-center gap-2">
                  Sign Out <LogOut size={14} />
                </p>
                <p className="text-xs text-brand-muted">{role === 'student' ? 'Candidate' : 'Chief Invigilator'}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 p-0.5">
                <div className="w-full h-full bg-brand-bg-1 rounded-full flex items-center justify-center">
                  <UserCircle size={24} className="text-brand-text" />
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}

export default Layout;
