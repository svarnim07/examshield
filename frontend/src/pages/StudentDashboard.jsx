import { useState, useEffect } from 'react';
import { PenTool, ShieldAlert, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function StudentDashboard() {
  const [exams, setExams] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('exams') || '[]');
    setExams(stored);
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Candidate Portal</h1>
        <p className="text-brand-muted text-sm mt-1">Welcome. View your upcoming assessments and assignments.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {exams.length > 0 ? exams.map((exam, idx) => (
          <div key={idx} className="glass-card p-6 flex flex-col justify-between">
            <div>
               <div className="w-12 h-12 rounded-lg bg-brand-primary/10 flex items-center justify-center border border-brand-primary/20 mb-4">
                 <PenTool className="text-brand-primary" />
               </div>
               <h3 className="text-lg font-bold text-white mb-2">{exam.name}</h3>
               <p className="text-brand-muted text-sm mb-4">Strict AI Proctoring Enabled. {exam.questions.length} Questions.</p>
            </div>
            <Link to={`/exam?id=${exam.id}`} className="btn-primary w-full py-2 flex justify-center items-center gap-2">Start Exam</Link>
          </div>
        )) : (
          <div className="glass-card p-6 flex items-center justify-center text-brand-muted text-sm italic">
            No active exams available at this time.
          </div>
        )}

        <div className="glass-card p-6 flex flex-col justify-between">
          <div>
             <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center border border-blue-500/20 mb-4">
               <BookOpen className="text-blue-400" />
             </div>
             <h3 className="text-lg font-bold text-white mb-2">Data Structures Assignment</h3>
             <p className="text-brand-muted text-sm mb-4">Due: Oct 28th. Plagiarism detection enabled.</p>
          </div>
          <button className="btn-ghost border border-white/10 w-full py-2" onClick={() => alert("Opening Assignment Workspace...")}>Open Assignment</button>
        </div>
      </div>
    </div>
  );
}
