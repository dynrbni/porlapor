import Header from '../components/Header';
import Hero from '../components/Hero';
import HowItWorks from '../components/HowItWorks';
import RecentReports from '../components/RecentReports';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 selection:bg-blue-200">
      <Header />
      
      <main>
        <Hero />
        <RecentReports />
        <HowItWorks />
      </main>

      <Footer />
    </div>
  );
}
