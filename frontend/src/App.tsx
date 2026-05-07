import Header from './components/Header';
import Hero from './components/Hero';
import HowItWorks from './components/HowItWorks';
import Footer from './components/Footer';

function App() {
  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-blue-200">
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
