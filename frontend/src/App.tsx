import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Agencies from './pages/Agencies';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import ReportDetail from './pages/ReportDetail';

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
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/instansi" element={<Agencies />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/dashboard/report/:id" element={<ReportDetail />} />
      </Routes>
    </Router>
  );
}

export default App;
