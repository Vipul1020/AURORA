import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import JobDetailPage from './pages/JobDetailPage';
import PostJobPage from './pages/PostJobPage';
import EditJobPage from './pages/EditJobPage';
import CandidateDashboard from './pages/CandidateDashboard';
import RecruiterDashboard from './pages/RecruiterDashboard';
import CandidateProfilePage from './pages/CandidateProfilePage';
import MyApplicationsPage from './pages/MyApplicationsPage';
import JobApplicantsPage from './pages/JobApplicantsPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="jobs/:id" element={<JobDetailPage />} />

          <Route element={<ProtectedRoute allowedRoles={['candidate']} />}>
            <Route path="candidate-dashboard" element={<CandidateDashboard />} />
            <Route path="my-applications" element={<MyApplicationsPage />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={['recruiter']} />}>
             <Route path="recruiter-dashboard" element={<RecruiterDashboard />} />
             <Route path="post-job" element={<PostJobPage />} />
             <Route path="jobs/:id/edit" element={<EditJobPage />} />
             <Route path="jobs/:jobId/applicants" element={<JobApplicantsPage />} />
          </Route>

           <Route element={<ProtectedRoute allowedRoles={['candidate', 'recruiter']} />}>
                <Route path="profile" element={<CandidateProfilePage />} />
           </Route>
        </Route>

        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;