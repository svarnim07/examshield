import { useEffect, useState, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Camera, AlertCircle, Clock, Code, Terminal, Activity, Eye, Mic, FileText } from "lucide-react";
import ViolationModal from "./components/ViolationModal";

function Student() {
  const [searchParams] = useSearchParams();
  const examId = searchParams.get('id');
  const [examData, setExamData] = useState(null);

  const [studentId, setStudentId] = useState("");
  const [sessionActive, setSessionActive] = useState(false);
  const [metrics, setMetrics] = useState({ gaze: 98, audio: 12, risk: "LOW" });
  const [logs, setLogs] = useState([{ msg: "System initialized", time: new Date().toLocaleTimeString() }]);
  const [showViolationModal, setShowViolationModal] = useState(false);
  const [violationDetails, setViolationDetails] = useState({ type: "", time: "" });
  const [strikes, setStrikes] = useState(0);
  const videoRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyzerRef = useRef(null);
  
  const showModalRef = useRef(false);
  const strikesRef = useRef(0);
  const eventsRef = useRef([]);

  const navigate = useNavigate();

  useEffect(() => {
    const exams = JSON.parse(localStorage.getItem('exams') || '[]');
    if (examId) {
      setExamData(exams.find(e => e.id === examId));
    } else if (exams.length > 0) {
      setExamData(exams[0]);
    }
  }, [examId]);

  const addLog = (msg) => {
    setLogs(prev => [{ msg, time: new Date().toLocaleTimeString() }, ...prev].slice(0, 5));
  };

  useEffect(() => {
    if (!sessionActive) return;

    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }

        // Setup Audio Monitoring
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const source = audioContext.createMediaStreamSource(stream);
        const analyzer = audioContext.createAnalyser();
        analyzer.fftSize = 256;
        source.connect(analyzer);
        
        audioContextRef.current = audioContext;
        analyzerRef.current = analyzer;

        const dataArray = new Uint8Array(analyzer.frequencyBinCount);
        let lastUiUpdate = 0;

        const checkAudio = () => {
          if (!analyzerRef.current) return;
          analyzerRef.current.getByteFrequencyData(dataArray);
          const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
          
          const now = Date.now();
          if (now - lastUiUpdate > 100) {
            setMetrics(m => ({ ...m, audio: Math.round(average * 1.5) }));
            lastUiUpdate = now;
          }

          if (average > 35) { // Even more sensitive
            if (!showModalRef.current && strikesRef.current < 5) {
              strikesRef.current += 1;
              setStrikes(strikesRef.current);
              setViolationDetails({ type: "AUDIO / SPEAKING", time: new Date().toLocaleTimeString() });
              showModalRef.current = true;
              setShowViolationModal(true);
              addLog("CRITICAL: Voice Detected");
            }
          }
          requestAnimationFrame(checkAudio);
        };
        checkAudio();

        addLog("Camera & Mic accessed");
      } catch (err) {
        console.error(err);
        addLog("Error: Camera access denied");
      }
    };

    const captureFrame = async () => {
      const video = videoRef.current;
      if (!video || video.videoWidth === 0) return null;

      const canvas = document.createElement("canvas");
      canvas.width = 320; // Reduce resolution for speed
      canvas.height = (320 / video.videoWidth) * video.videoHeight;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      return new Promise((resolve) => {
        canvas.toBlob((blob) => resolve(blob), "image/jpeg", 0.6); // Lower quality for speed
      });
    };

    const handleVisibility = () => {
      if (document.hidden && !showModalRef.current && strikesRef.current < 5) {
        strikesRef.current += 1;
        setStrikes(strikesRef.current);
        eventsRef.current.push({ event: "TAB_SWITCHED", timestamp: Date.now() });
        addLog("WARNING: Tab Switched");
        setMetrics(m => ({ ...m, risk: "HIGH" }));
        setViolationDetails({ type: "Tab Switch / App Focus Lost", time: new Date().toLocaleTimeString() });
        showModalRef.current = true;
        setShowViolationModal(true);
      }
    };

    const handleBlur = () => {
      if (!showModalRef.current && strikesRef.current < 5) {
        strikesRef.current += 1;
        setStrikes(strikesRef.current);
        eventsRef.current.push({ event: "WINDOW_BLUR", timestamp: Date.now() });
        addLog("WARNING: Window Focus Lost");
        setMetrics(m => ({ ...m, risk: "MEDIUM" }));
        setViolationDetails({ type: "Window Focus Lost", time: new Date().toLocaleTimeString() });
        showModalRef.current = true;
        setShowViolationModal(true);
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("blur", handleBlur);

    const interval = setInterval(async () => {
      if (!studentId) return;

      const frame = await captureFrame();
      if (!frame) return;

      const formData = new FormData();
      formData.append("file", frame);

      try {
        const aiRes = await fetch(`${import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'}/detect-face`, {
          method: "POST",
          body: formData
        });

        if(aiRes.ok) {
          const aiData = await aiRes.json();
          const detectedEvents = aiData.events || [];
          
          let hasViolation = false;
          let violationType = "";

          // Process AI events
          for (const ev of detectedEvents) {
            const eName = ev.event;
            if (eName === "LOOKING_AWAY" || eName === "HEAD_TURNED" || eName === "NO_FACE" || eName === "MULTIPLE_FACES") {
              hasViolation = true;
              violationType = eName.replace("_", " ");
            }
          }

          if (hasViolation) {
            setMetrics(m => ({ ...m, risk: "HIGH", gaze: 30 }));
          } else {
             setMetrics(m => ({ ...m, gaze: 98 }));
          }

          if (hasViolation && !showModalRef.current && strikesRef.current < 5) {
            strikesRef.current += 1;
            setStrikes(strikesRef.current);
            setViolationDetails({ type: violationType, time: new Date().toLocaleTimeString() });
            showModalRef.current = true;
            setShowViolationModal(true);
            addLog(`WARNING: ${violationType}`);
          }

          const combinedEvents = [
            ...eventsRef.current,
            ...detectedEvents
          ];

          if (combinedEvents.length > 0) {
            fetch(`${import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'}/log-events`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                student_id: studentId,
                events: combinedEvents
              })
            }).catch(() => {});
            eventsRef.current = []; 
          }
        }
      } catch (err) {
        console.error("AI Detect Error:", err);
      }
    }, 800);

    startCamera();

    const currentVideoRef = videoRef.current;

    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("blur", handleBlur);
      if (audioContextRef.current) audioContextRef.current.close();
      if (currentVideoRef && currentVideoRef.srcObject) {
        currentVideoRef.srcObject.getTracks().forEach(t => t.stop());
      }
    };
  }, [studentId, sessionActive]);

  if (!sessionActive) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-120px)]">
        <div className="glass-panel p-8 max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-white mb-6">Initialize Live Exam</h2>
          <input
            className="input-glass mb-6 text-center text-xl tracking-widest"
            placeholder="Enter Student ID"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
          />
          <button 
            className="btn-primary w-full py-3"
            onClick={() => {
              if(studentId) setSessionActive(true);
            }}
          >
            Start Session
          </button>
        </div>
      </div>
    );
  }

  if (strikes >= 5) {
    return (
       <div className="flex items-center justify-center h-[calc(100vh-120px)]">
         <div className="glass-panel p-8 max-w-md w-full text-center border-brand-danger bg-brand-danger/10">
           <AlertCircle className="text-brand-danger w-16 h-16 mx-auto mb-4" />
           <h2 className="text-2xl font-bold text-white mb-2">Exam Terminated</h2>
           <p className="text-brand-muted mb-6">You have exceeded the maximum allowed violations (5). Your session has been locked and flagged.</p>
           <button className="btn-primary w-full py-3" onClick={() => navigate('/auth')}>Exit Session</button>
         </div>
       </div>
    );
  }

  return (
    <div className="h-[calc(100vh-120px)] flex gap-6">
      {/* LEFT: Exam Content & Editor */}
      <div className="flex-1 flex flex-col gap-6">
        {/* Top Info Bar */}
        <div className="glass-card p-4 flex items-center justify-between">
          <div className="flex gap-4">
             <div className="px-3 py-1 bg-white/5 rounded border border-brand-border">
               <span className="text-brand-muted text-xs block">Candidate ID</span>
               <span className="text-white font-mono">{studentId}</span>
             </div>
             <div className="px-3 py-1 bg-white/5 rounded border border-brand-border">
               <span className="text-brand-muted text-xs block">Exam ID</span>
               <span className="text-white font-mono">{examData ? examData.id : '...'}</span>
             </div>
          </div>
          <div className="flex items-center gap-3 text-2xl font-mono text-brand-primary drop-shadow-[0_0_8px_rgba(139,92,246,0.8)]">
            <Clock size={24} />
            01:45:22
          </div>
        </div>

        {/* Main Editor Area */}
        <div className="flex-1 glass-panel flex flex-col overflow-hidden">
          <div className="flex border-b border-brand-border">
            <div className="px-4 py-3 border-b-2 border-brand-primary text-brand-primary flex items-center gap-2 font-medium bg-white/5">
              <FileText size={16} /> Multiple Choice Questions
            </div>
            <div className="px-4 py-3 text-brand-muted flex items-center gap-2 font-medium hover:bg-white/5 cursor-pointer transition-colors">
              <Code size={16} /> Code Editor (Optional)
            </div>
          </div>
          
          <div className="flex-1 bg-black/20 p-8 overflow-y-auto custom-scrollbar">
            {examData ? (
              <div className="space-y-8 max-w-3xl mx-auto">
                <div className="mb-6">
                  <h2 className="text-3xl font-bold text-white">{examData.name}</h2>
                  <p className="text-brand-muted mt-2">Answer all questions carefully. Your session is being monitored.</p>
                </div>
                
                {examData.questions.map((q, i) => (
                  <div key={i} className="glass-card p-6">
                    <h3 className="text-lg font-medium text-white mb-4">
                      <span className="text-brand-primary mr-2">{i + 1}.</span> 
                      {q.question}
                    </h3>
                    <div className="space-y-3">
                      {q.options.map((opt, optIdx) => (
                        <label key={optIdx} className="flex items-center gap-3 p-3 rounded border border-brand-border bg-white/5 hover:bg-white/10 cursor-pointer transition-colors">
                          <input type="radio" name={`question-${i}`} className="text-brand-primary focus:ring-brand-primary" />
                          <span className="text-brand-text">{opt}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-brand-muted flex-col gap-4">
                 <FileText size={48} className="opacity-50" />
                 <p>Loading exam environment...</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* RIGHT: Proctoring Sidebar */}
      <div className="w-80 flex flex-col gap-6">
        {/* Webcam */}
        <div className="glass-panel overflow-hidden relative group">
          <div className="absolute top-2 left-2 z-10 flex gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-black/60 text-white flex items-center gap-1 backdrop-blur-md border border-white/10">
              <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></div> LIVE
            </span>
          </div>
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            muted 
            className="w-full h-48 object-cover scale-x-[-1] border-b border-brand-border"
          ></video>
          
          <div className="p-4 bg-black/40">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs text-brand-muted uppercase font-medium">Risk Assessment</span>
              <span className={`text-xs font-bold px-2 py-0.5 rounded border ${
                metrics.risk === 'HIGH' ? 'bg-red-500/20 text-red-400 border-red-500/30' :
                'bg-green-500/20 text-green-400 border-green-500/30'
              }`}>{metrics.risk}</span>
            </div>
            
            <div className="space-y-3 mt-4">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="flex items-center gap-1 text-brand-muted"><Eye size={12}/> Gaze Alignment</span>
                  <span className="text-white">{metrics.gaze}%</span>
                </div>
                <div className="h-1.5 bg-black/50 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 transition-all duration-500" style={{width: `${metrics.gaze}%`}}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="flex items-center gap-1 text-brand-muted"><Mic size={12}/> Audio Levels</span>
                  <span className="text-white">{metrics.audio}db</span>
                </div>
                <div className="h-1.5 bg-black/50 rounded-full overflow-hidden">
                  <div className={`h-full transition-all duration-300 ${metrics.audio > 50 ? 'bg-red-500' : 'bg-green-500'}`} style={{width: `${metrics.audio}%`}}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Event Logs */}
        <div className="glass-panel flex-1 flex flex-col overflow-hidden">
          <div className="p-3 border-b border-brand-border flex items-center gap-2 text-sm font-medium text-white">
            <Terminal size={16} className="text-brand-primary" /> System Logs
          </div>
          <div className="p-3 flex-1 overflow-y-auto space-y-2 custom-scrollbar">
            {logs.map((l, i) => (
              <div key={i} className="text-xs font-mono">
                <span className="text-brand-muted">[{l.time}]</span>{' '}
                <span className={l.msg.includes('WARNING') ? 'text-brand-warning' : 'text-blue-400'}>{l.msg}</span>
              </div>
            ))}
          </div>
        </div>
        
        <button className="btn-primary py-3 w-full" onClick={() => navigate('/submission')}>Submit Examination</button>
      </div>
      
      <ViolationModal 
        isOpen={showViolationModal} 
        onClose={() => {
          setShowViolationModal(false);
          showModalRef.current = false;
        }}
        violationType={violationDetails.type}
        time={violationDetails.time}
        strikes={strikes}
      />
    </div>
  );
}

export default Student;
