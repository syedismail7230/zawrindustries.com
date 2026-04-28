import Image from 'next/image';

export default function Home() {
  return (
    <>
      {/* Section 1: Hero */}
      <section className="hero-section">
        <div className="hero-bg" style={{ position: 'absolute', width: '100%', height: '100%', top: 0, left: 0, zIndex: 0 }}>
          <img
            src="/images/hero-bg.png"
            alt="Zawr Industries Technology Background"
            style={{ position: 'absolute', width: '100%', height: '100%', objectFit: 'cover', top: 0, left: 0 }}
          />
          <div className="hero-overlay"></div>
        </div>


      </section>

      {/* Placeholder for Section 2 */}
      <section style={{ height: '80vh', backgroundColor: '#f9f9f9' }}>
        <h2 style={{ textAlign: 'center', paddingTop: '4rem', color: '#1a1a1a' }}>Section 2</h2>
      </section>

      {/* Placeholder for Section 3 */}
      <section style={{ height: '80vh', backgroundColor: '#ffffff' }}>
        <h2 style={{ textAlign: 'center', paddingTop: '4rem', color: '#1a1a1a' }}>Section 3</h2>
      </section>

      {/* Placeholder for Section 4 */}
      <section style={{ height: '80vh', backgroundColor: '#f9f9f9' }}>
        <h2 style={{ textAlign: 'center', paddingTop: '4rem', color: '#1a1a1a' }}>Section 4</h2>
      </section>

      {/* Placeholder for Section 5 */}
      <section style={{ height: '80vh', backgroundColor: '#ffffff' }}>
        <h2 style={{ textAlign: 'center', paddingTop: '4rem', color: '#1a1a1a' }}>Section 5</h2>
      </section>

      {/* Placeholder for Section 6 */}
      <section style={{ height: '80vh', backgroundColor: '#f9f9f9' }}>
        <h2 style={{ textAlign: 'center', paddingTop: '4rem', color: '#1a1a1a' }}>Section 6</h2>
      </section>

      {/* Placeholder for Section 7 */}
      <section style={{ height: '80vh', backgroundColor: '#ffffff' }}>
        <h2 style={{ textAlign: 'center', paddingTop: '4rem', color: '#1a1a1a' }}>Section 7</h2>
      </section>
    </>
  );
}
