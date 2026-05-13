import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Agencies from './pages/Agencies';

function App() {
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      offset: 100,
    });
    
    // Pastikan animasi direfresh ketika seluruh aset website termuat 
    // atau ketika ada interupsi navigasi dari halaman login/register
    const handleLoad = () => AOS.refresh();
    window.addEventListener('load', handleLoad);
    
    // Fallback jika assets lambat
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
      </Routes>
    </Router>
  );
}

export default App;
