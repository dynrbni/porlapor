import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Agencies from './pages/Agencies';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import AdminReportDetail from './pages/AdminReportDetail';
import ReportDetail from './pages/ReportDetail';
import CreateReport from './pages/CreateReport';
import AgencyDashboard from './pages/AgencyDashboard';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      offset: 100,
    });
    
    const handleLoad = () => AOS.refresh();
    window.addEventListener('load', handleLoad);
    
    setTimeout(() => {
      AOS.refresh();
    }, 500);

    return () => window.removeEventListener('load', handleLoad);
  }, []);

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/instansi" element={<Agencies />} />

        {/* User-Only Routes */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute allowedRoles={['USER']}>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/buat-laporan" 
          element={
            <ProtectedRoute allowedRoles={['USER']}>
              <CreateReport />
            </ProtectedRoute>
          } 
        />

        {/* Admin-Only Routes */}
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute allowedRoles={['ADMIN', 'SUPERADMIN']}>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/agency" 
          element={
            <ProtectedRoute allowedRoles={['AGENCY']}>
              <AgencyDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/report/:id" 
          element={
            <ProtectedRoute allowedRoles={['AGENCY', 'SUPERADMIN', 'ADMIN']}>
              <AdminReportDetail />
            </ProtectedRoute>
          } 
        />

        <Route
          path="/superadmin"
          element={<Navigate to="/admin" replace />}
        />

        {/* Public report viewing route */}
        <Route 
          path="/laporan/:id" 
          element={<ReportDetail />} 
        />

        {/* Auth Required but any role can view report details */}
        <Route 
          path="/dashboard/report/:id" 
          element={
            <ProtectedRoute>
              <ReportDetail />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;
