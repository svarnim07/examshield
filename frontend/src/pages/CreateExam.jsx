import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, Save, ArrowLeft } from 'lucide-react';

export default function CreateExam() {
  const navigate = useNavigate();
  const [examName, setExamName] = useState('');
  const [questions, setQuestions] = useState([{ question: '', type: 'multiple_choice', options: ['', '', '', ''] }]);
  const [isSaved, setIsSaved] = useState(false);

  const handleAddQuestion = () => {
    setQuestions([...questions, { question: '', type: 'multiple_choice', options: ['', '', '', ''] }]);
  };

  const handleRemoveQuestion = (index) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleSave = (e) => {
    e.preventDefault();
    
    const existing = JSON.parse(localStorage.getItem('exams') || '[]');
    const newExam = {
      id: `EXAM-${Math.floor(100 + Math.random() * 900)}`,
      name: examName,
      questions: questions,
      createdAt: new Date().toLocaleDateString()
    };
    localStorage.setItem('exams', JSON.stringify([newExam, ...existing]));
    
    setIsSaved(true);
    setTimeout(() => {
      navigate('/institution');
    }, 2000);
  };

  if (isSaved) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-center space-y-4">
        <div className="w-16 h-16 rounded-full flex items-center justify-center bg-brand-bg-2 border border-brand-border">
          <Save className="text-brand-success" size={32} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">Exam Created Successfully!</h2>
          <p className="text-brand-muted mt-2">Provisioning secure nodes... redirecting you.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between border-b border-brand-border pb-4">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/institution')} className="p-2 glass-card hover:bg-white/5 transition-colors">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white">Exam Provisioning Wizard</h1>
            <p className="text-brand-muted text-sm mt-1">Configure exam parameters and add questions.</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="glass-panel p-6 space-y-4">
          <div>
            <label className="text-xs font-medium text-brand-muted uppercase tracking-wider block mb-2">Exam Title</label>
            <input 
              type="text" 
              className="input-glass w-full text-lg" 
              placeholder="e.g. Advanced Operating Systems Midterm" 
              value={examName}
              onChange={e => setExamName(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">Questions</h2>
            <button type="button" onClick={handleAddQuestion} className="btn-ghost flex items-center gap-2 border border-brand-border text-sm py-1.5">
              <Plus size={16} /> Add Question
            </button>
          </div>

          {questions.map((q, index) => (
            <div key={index} className="glass-panel p-6 space-y-4 relative">
              {questions.length > 1 && (
                <button type="button" onClick={() => handleRemoveQuestion(index)} className="absolute top-4 right-4 text-brand-danger hover:text-red-400">
                  <Trash2 size={18} />
                </button>
              )}
              
              <div>
                <label className="text-xs font-medium text-brand-muted uppercase tracking-wider block mb-2">Question {index + 1}</label>
                <textarea 
                  className="input-glass w-full min-h-[80px]" 
                  placeholder="Enter your question here..." 
                  value={q.question}
                  onChange={(e) => {
                    const newQ = [...questions];
                    newQ[index].question = e.target.value;
                    setQuestions(newQ);
                  }}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {q.options.map((opt, optIndex) => (
                  <input 
                    key={optIndex}
                    type="text" 
                    className="input-glass w-full text-sm" 
                    placeholder={`Option ${String.fromCharCode(65 + optIndex)}`} 
                    value={opt}
                    onChange={(e) => {
                      const newQ = [...questions];
                      newQ[index].options[optIndex] = e.target.value;
                      setQuestions(newQ);
                    }}
                    required
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="pt-4 border-t border-brand-border flex justify-end gap-4">
          <button type="button" onClick={() => navigate('/institution')} className="btn-ghost">Cancel</button>
          <button type="submit" className="btn-primary flex items-center gap-2 px-8">
            <Save size={18} /> Publish Exam
          </button>
        </div>
      </form>
    </div>
  );
}
