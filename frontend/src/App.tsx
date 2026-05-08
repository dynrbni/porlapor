import { useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import HowItWorks from './components/HowItWorks';
import Footer from './components/Footer';
import AOS from 'aos';
import 'aos/dist/aos.css';

function App() {
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      offset: 100,
    });
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 selection:bg-blue-200">
      <Header />
      
      <main>
        <Hero />
        <HowItWorks />
      </main>

      <Footer />
    </div>
  );
}

export default App;
