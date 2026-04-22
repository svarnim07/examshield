import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./Dashboard";
import Student from "./Student";
import Layout from "./Layout";
import AuthInit from "./pages/AuthInit";
import Analytics from "./pages/Analytics";
import InstitutionControl from "./pages/InstitutionControl";
import IncidentReview from "./pages/IncidentReview";
import SystemRecovery from "./pages/SystemRecovery";
import GrievanceSystem from "./pages/GrievanceSystem";
import FinalSubmission from "./pages/FinalSubmission";
import StudentDashboard from "./pages/StudentDashboard";
import ReportIssue from "./pages/ReportIssue";
import CreateExam from "./pages/CreateExam";

function App() {
  return (
    <Routes>
      <Route path="/auth" element={<AuthInit />} />
      <Route path="/exam" element={<Student />} />
      <Route path="/submission" element={<FinalSubmission />} />
      
      {/* Protected Routes with Layout */}
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to="/dashboard" />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="institution" element={<InstitutionControl />} />
        <Route path="incidents" element={<IncidentReview />} />
        <Route path="recovery" element={<SystemRecovery />} />
        <Route path="grievance" element={<GrievanceSystem />} />
        <Route path="student-dash" element={<StudentDashboard />} />
        <Route path="report-issue" element={<ReportIssue />} />
        <Route path="create-exam" element={<CreateExam />} />
      </Route>
    </Routes>
  );
}

export default App;
