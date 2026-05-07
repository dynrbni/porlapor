import Header from './components/Header';
import Hero from './components/Hero';
import HowItWorks from './components/HowItWorks';
import Footer from './components/Footer';

function App() {
  return (
    <>
      <div className="noise-overlay"></div>
      <div className="min-h-screen bg-[--color-paper] text-[--color-ink] selection:bg-[--color-brand] selection:text-white flex flex-col pt-16">
        <Header />
        
        <main className="flex-1 flex flex-col">
          <Hero />
          <HowItWorks />
        </main>

        <Footer />
      </div>
    </>
  );
}

export default App;
