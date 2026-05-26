"use client";

import React from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';

const PitchDeckViewer = dynamic(() => import('./PitchDeckViewer'), {
  ssr: false,
  loading: () => <div style={{ color: '#fff', fontSize: '1.25rem' }}>Loading Pitch Deck...</div>
});

// Main Page Component
export default function InvestorsPage() {
  const [isPitchDeckOpen, setIsPitchDeckOpen] = React.useState(false);
  const [hasPitchDeck, setHasPitchDeck] = React.useState(false);
  const [reports, setReports] = React.useState<any[]>([]);
  
  // Dynamic Events States
  const [events, setEvents] = React.useState<any[]>([]);
  const [activeEventIndex, setActiveEventIndex] = React.useState(0);
  const [swipeState, setSwipeState] = React.useState<'idle' | 'swiping'>('idle');

  // Calendar Navigation month/year state
  const [currentCalendarDate, setCurrentCalendarDate] = React.useState<Date>(new Date(2023, 0, 1)); // Default to January 2023 for theme consistency
  const [selectedDayStr, setSelectedDayStr] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      if (localStorage.getItem('zawr_pitch_deck_uploaded') === 'true') {
        setHasPitchDeck(true);
      }
    }

    const fetchReports = async () => {
      try {
        const res = await fetch('/api/financial-reports');
        if (res.ok) {
          const data = await res.json();
          setReports(data || []);
        }
      } catch (e) {
        console.error('Error fetching reports:', e);
      }
    };

    const fetchEvents = async () => {
      try {
        const res = await fetch('/api/events');
        if (res.ok) {
          const data = await res.json();
          setEvents(data || []);
          
          // If events are loaded, set initial calendar view to match the first event's month
          if (data && data.length > 0) {
            const firstEventDate = new Date(data[0].startDate + 'T00:00:00');
            if (!isNaN(firstEventDate.getTime())) {
              setCurrentCalendarDate(new Date(firstEventDate.getFullYear(), firstEventDate.getMonth(), 1));
            }
          }
        }
      } catch (e) {
        console.error('Error fetching events:', e);
      }
    };

    fetchReports();
    fetchEvents();
  }, []);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#000000', color: '#ffffff', fontFamily: 'sans-serif' }}>
      
      {/* 2D Redesigned Hero Section */}
      <div style={{ 
        position: 'relative', 
        width: '100%', 
        height: '100vh', 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center', 
        overflow: 'hidden',
        backgroundImage: 'url(/assets/investors-hero-bg.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}>
        
        {/* Dark gradient overlay to ensure text is readable, stronger on top and left */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 60%), linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0) 30%)', pointerEvents: 'none' }}></div>

        {/* Overlay Content */}
        <div style={{ position: 'relative', zIndex: 10, padding: '0 4rem', width: '100%', maxWidth: '80rem', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', height: '100%', paddingBottom: '4rem' }}>
          
          {/* Left Side: Typography & CTA */}
          <div style={{ paddingBottom: '4rem', maxWidth: '40rem' }}>
            <h1 style={{ fontSize: 'clamp(3rem, 5vw, 4.5rem)', fontWeight: 500, marginBottom: '1.5rem', lineHeight: 1.1, letterSpacing: '-0.02em', fontFamily: 'inherit' }}>
              Invest with confidence.<br/>
              Grow with purpose
            </h1>
            <p style={{ fontSize: '1.125rem', color: '#d1d5db', marginBottom: '3rem', fontWeight: 400 }}>
              Smart investing made personal, purposeful, and powerful.
            </p>
            <Link 
              href="/investors/interest"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '1rem', padding: '1rem 1.5rem', backgroundColor: '#ffffff', color: '#000000', fontSize: '0.875rem', fontWeight: 600, letterSpacing: '0.05em', border: 'none', cursor: 'pointer', transition: 'opacity 0.2s', textDecoration: 'none' }}
              onMouseOver={(e) => e.currentTarget.style.opacity = '0.9'}
              onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
            >
              INVESTMENT ENQUIRY
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17L17 7"/><path d="M7 7h10v10"/></svg>
            </Link>
          </div>

          {/* Right Side: Glassmorphism Card */}
          <div style={{ paddingBottom: '0rem' }}>
            <div style={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.1)', 
              backdropFilter: 'blur(16px)', 
              WebkitBackdropFilter: 'blur(16px)',
              border: '1px solid rgba(255, 255, 255, 0.2)', 
              padding: '2rem', 
              width: '18rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.5rem'
            }}>
              <span style={{ fontSize: '1rem', color: '#e5e7eb', fontWeight: 400 }}>YoY performance</span>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '4rem', fontWeight: 300, lineHeight: 1, fontFamily: 'sans-serif' }}>28%</span>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17L17 7"/><path d="M7 7h10v10"/></svg>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Main Content Container */}
      <div style={{ maxWidth: '72rem', margin: '0 auto', padding: '6rem 1.5rem' }}>
        
        {/* Flagship Project Section */}
        <section style={{ marginBottom: '8rem', backgroundColor: '#ffffff', borderRadius: '2rem', padding: '4rem', display: 'flex', flexWrap: 'wrap', gap: '3rem', alignItems: 'center' }}>
          <div style={{ flex: '1.2 1 500px', display: 'flex', justifyContent: 'center' }}>
            <img 
              src="/assets/firmai-dashboard.png" 
              alt="Firm AI Dashboard" 
              style={{ width: '100%', maxWidth: '1100px', height: 'auto', objectFit: 'contain', borderRadius: '1rem', boxShadow: '0 20px 40px -10px rgba(0,0,0,0.1)' }} 
            />
          </div>
          <div style={{ flex: '1 1 350px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ margin: '-4rem 0 -4rem -1.5rem' }}>
              <img src="/assets/firmai-logo-dark.png" alt="Firm AI" style={{ width: '100%', maxWidth: '20rem', height: 'auto', objectFit: 'contain' }} />
            </div>
            <p style={{ fontSize: '1.125rem', color: '#374151', lineHeight: 1.7, fontWeight: 500, paddingRight: '1rem' }}>
              Firm AI is Zawr Industries' current flagship project—an AI-powered Business Intelligence Orchestra designed to unify data, automate decision workflows, and orchestrate intelligent business operations through a single connected ecosystem.
            </p>
          </div>
        </section>

        {/* Managing Director Message */}
        <section style={{ marginBottom: '8rem', display: 'flex', flexWrap: 'wrap', gap: '4rem', alignItems: 'center' }}>
          <style>{`
            .md-desktop-name { display: block; }
            .md-mobile-name { display: none; }
            @media (max-width: 768px) {
              .md-desktop-name { display: none; }
              .md-mobile-name { display: block; margin-top: 1.5rem; }
            }
          `}</style>
          <div style={{ flex: '1.5 1 500px' }}>
            <div style={{ marginBottom: '2rem', color: '#ffffff' }}>
              <svg width="72" height="72" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M14.017 18L14.017 10.609C14.017 4.905 17.748 1.039 23 0L23.995 2.151C21.563 3.068 20 5.789 20 8L24 8L24 18L14.017 18ZM0 18L0 10.609C0 4.905 3.748 1.039 9 0L9.996 2.151C7.563 3.068 6 5.789 6 8L9.983 8L9.983 18L0 18Z" />
              </svg>
            </div>
            <p style={{ fontSize: '1.125rem', color: '#e5e7eb', lineHeight: 1.8, fontStyle: 'italic', marginBottom: '1.5rem', fontWeight: 400 }}>
              At Zawr Industries, we believe that sustainable growth is created through innovation, disciplined execution, and a long-term vision. Our mission is to build an ecosystem of businesses that not only deliver value today but create opportunities for the future through technology, intelligence, and strategic expansion.
            </p>
            <p style={{ fontSize: '1.125rem', color: '#e5e7eb', lineHeight: 1.8, fontStyle: 'italic', marginBottom: '3rem', fontWeight: 400 }}>
              As we continue our journey, our focus remains on empowering industries, creating meaningful impact, and building solutions that are scalable, reliable, and globally competitive. We thank our partners, clients, investors, and team members for being part of this vision and shaping the future together.
            </p>
            <div className="md-desktop-name">
              <h4 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.25rem', fontStyle: 'italic' }}>Mohammed Ahmed</h4>
              <p style={{ fontSize: '1rem', color: '#d1d5db', fontWeight: 400, fontStyle: 'italic' }}>Managing Director, Zawr Industries</p>
            </div>
          </div>
          <div style={{ flex: '1 1 450px', display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
            <img 
              src="/assets/md-portrait.png" 
              alt="Mohammed Ahmed, Managing Director" 
              style={{ width: '100%', maxWidth: '750px', height: 'auto', objectFit: 'contain' }} 
            />
            <div className="md-mobile-name" style={{ width: '100%', textAlign: 'left' }}>
              <h4 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.25rem', fontStyle: 'italic' }}>Mohammed Ahmed</h4>
              <p style={{ fontSize: '1rem', color: '#d1d5db', fontWeight: 400, fontStyle: 'italic' }}>Managing Director, Zawr Industries</p>
            </div>
          </div>
        </section>

      </div> {/* Close Main Content Container for full-bleed section */}

        {/* Pitch Deck Interactive Section */}
        <section 
          style={{ 
            marginBottom: '8rem', 
            width: '100%', 
            height: '100vh',
            backgroundImage: 'url(/assets/pitch-deck-bg.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundColor: '#073840', // Fallback color
            position: 'relative', 
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)' 
          }}
        >
          {/* Button that transforms into Slide 1 background */}
          <div 
            onClick={() => !isPitchDeckOpen && setIsPitchDeckOpen(true)}
            style={{ 
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: isPitchDeckOpen ? '80vw' : '280px',
              height: isPitchDeckOpen ? '70vh' : '56px',
              backgroundColor: isPitchDeckOpen ? '#f3f4f6' : '#ffffff', 
              borderRadius: isPitchDeckOpen ? '1.5rem' : '2rem', 
              opacity: isPitchDeckOpen ? 0 : 1,
              cursor: isPitchDeckOpen ? 'default' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: isPitchDeckOpen 
                ? 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1), height 0.6s cubic-bezier(0.4, 0, 0.2, 1), border-radius 0.6s cubic-bezier(0.4, 0, 0.2, 1), background-color 0.6s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.6s cubic-bezier(0.4, 0, 0.2, 1), opacity 0s 0.8s' 
                : 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: isPitchDeckOpen ? 'none' : '0 10px 25px -5px rgba(0,0,0,0.3)',
              zIndex: 10
            }}
          >
            <span style={{ 
              color: '#1f2937', 
              fontSize: '1.125rem', 
              fontWeight: 500,
              opacity: isPitchDeckOpen ? 0 : 1,
              transition: 'opacity 0.3s ease',
              whiteSpace: 'nowrap',
              pointerEvents: 'none'
            }}>
              Click to open pitch deck
            </span>
          </div>

          {/* Carousel Container */}
          <div 
            style={{ 
              position: 'absolute',
              inset: 0,
              display: 'flex', 
              alignItems: 'center',
              justifyContent: 'center', 
              opacity: isPitchDeckOpen ? 1 : 0,
              pointerEvents: isPitchDeckOpen ? 'auto' : 'none',
              transition: 'opacity 0.3s ease 0.5s', // Fade in right as the expansion finishes
              zIndex: 11
            }}
          >
            {hasPitchDeck ? (
              <PitchDeckViewer />
            ) : (
              <div style={{ display: 'flex', overflowX: 'auto', gap: '4rem', padding: '0 10vw', width: '100%', scrollSnapType: 'x mandatory', scrollBehavior: 'smooth', msOverflowStyle: 'none', scrollbarWidth: 'none' }} className="pitch-deck-scroll">
                <style>{`
                  .pitch-deck-scroll::-webkit-scrollbar { display: none; }
                  .placeholder-slide { width: 80vw; height: 70vh; }
                  @media (max-width: 768px) { .placeholder-slide { width: 85vw; height: 50vh; } }
                `}</style>
                {[1, 2, 3, 4, 5].map((slide) => (
                  <div key={slide} className="placeholder-slide" style={{ flexShrink: 0, backgroundColor: '#f3f4f6', borderRadius: '1.5rem', scrollSnapAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 20px 40px -10px rgba(0,0,0,0.4)' }}>
                    <p style={{ color: '#9ca3af', fontSize: '1.5rem', fontWeight: 500 }}>Slide {slide} Placeholder</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Close Button */}
          <button 
            onClick={(e) => { e.stopPropagation(); setIsPitchDeckOpen(false); }}
            style={{
              position: 'absolute',
              bottom: '2rem',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '3.5rem',
              height: '3.5rem',
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: isPitchDeckOpen ? 1 : 0,
              pointerEvents: isPitchDeckOpen ? 'auto' : 'none',
              transition: 'all 0.3s ease',
              transitionDelay: isPitchDeckOpen ? '0.6s' : '0s',
              zIndex: 20
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.4)'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </section>

      {/* Resume Main Content Container */}
      <div style={{ maxWidth: '72rem', margin: '0 auto', padding: '0 1.5rem 6rem' }}>

        {/* Financial Reports */}
        <section id="financial-reports" style={{ marginBottom: '8rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 500, color: '#ffffff' }}>Financial Reports</h2>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2.5rem', maxWidth: '750px', margin: '0 auto' }}>
            {reports.length === 0 ? (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#9ca3af', padding: '2rem' }}>
                No financial reports uploaded yet.
              </div>
            ) : reports.map((report) => (
              <Link 
                href={`/investors/financial-report?id=${report.id}`} 
                key={report.id} 
                style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column' }}
              >
                <div style={{ backgroundColor: '#ffffff', borderRadius: '1rem', padding: '1.25rem', cursor: 'pointer', transition: 'transform 0.3s ease', display: 'flex', flexDirection: 'column', width: '100%', height: '100%' }} onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-8px)'} onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                  <div style={{ position: 'relative', width: '100%', height: '180px', borderRadius: '0.75rem', overflow: 'hidden', marginBottom: '1.5rem' }}>
                    <img src="/assets/financial-chart.png" alt={report.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', paddingBottom: '0.5rem', paddingLeft: '0.5rem', paddingRight: '0.5rem' }}>
                    <span style={{ color: '#000000', fontSize: '1.6rem', fontWeight: 500 }}>{report.title}</span>
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="7" y1="17" x2="17" y2="7"></line>
                      <polyline points="7 7 17 7 17 17"></polyline>
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
        {/* Events and presentation */}
        <section id="events-presentations" style={{ marginBottom: '8rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 500, color: '#ffffff' }}>Events and presentation</h2>
          </div>

          {events.length === 0 ? (
            <div style={{ textAlign: 'center', color: '#9ca3af', padding: '3rem', border: '1px solid #1f2937', borderRadius: '1.5rem', backgroundColor: '#111' }}>
              No events scheduled at the moment. Check back soon!
            </div>
          ) : (() => {
            const activeEvent = events[activeEventIndex];
            const nextEvent1 = events[(activeEventIndex + 1) % events.length];
            const nextEvent2 = events[(activeEventIndex + 2) % events.length];

            // Calendar calculations
            const getCalendarDays = (year: number, month: number) => {
              const date = new Date(year, month, 1);
              const days = [];
              const firstDayOfWeek = date.getDay();
              const prevMonthDate = new Date(year, month, 0);
              const prevMonthDays = prevMonthDate.getDate();
              
              // Previous month padding cells
              for (let i = firstDayOfWeek - 1; i >= 0; i--) {
                const prevDay = prevMonthDays - i;
                const prevMonth = month === 0 ? 11 : month - 1;
                const prevYear = month === 0 ? year - 1 : year;
                days.push({
                  day: prevDay,
                  isCurrentMonth: false,
                  dateStr: `${prevYear}-${String(prevMonth + 1).padStart(2, '0')}-${String(prevDay).padStart(2, '0')}`
                });
              }
              
              // Current month cells
              const currentMonthDays = new Date(year, month + 1, 0).getDate();
              for (let i = 1; i <= currentMonthDays; i++) {
                days.push({
                  day: i,
                  isCurrentMonth: true,
                  dateStr: `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`
                });
              }
              
              // Next month padding cells to make 42 grids
              const totalCells = 42;
              const remaining = totalCells - days.length;
              for (let i = 1; i <= remaining; i++) {
                const nextMonth = month === 11 ? 0 : month + 1;
                const nextYear = month === 11 ? year + 1 : year;
                days.push({
                  day: i,
                  isCurrentMonth: false,
                  dateStr: `${nextYear}-${String(nextMonth + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`
                });
              }
              
              return days;
            };

            const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
            const calendarYear = currentCalendarDate.getFullYear();
            const calendarMonth = currentCalendarDate.getMonth();
            const calendarDays = getCalendarDays(calendarYear, calendarMonth);

            // Navigate months
            const handlePrevMonth = () => {
              setCurrentCalendarDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
            };
            const handleNextMonth = () => {
              setCurrentCalendarDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
            };

            // Swipe events stack
            const triggerSwipe = () => {
              if (selectedDayStr) {
                setSelectedDayStr(null);
                return;
              }
              if (events.length <= 1 || swipeState === 'swiping') return;
              setSwipeState('swiping');
              setTimeout(() => {
                const nextIdx = (activeEventIndex + 1) % events.length;
                setActiveEventIndex(nextIdx);
                setSwipeState('idle');
                
                // Automatically sync calendar month to the swiped event's start date!
                const newActiveEvent = events[nextIdx];
                const evDate = new Date(newActiveEvent.startDate + 'T00:00:00');
                if (!isNaN(evDate.getTime())) {
                  setCurrentCalendarDate(new Date(evDate.getFullYear(), evDate.getMonth(), 1));
                }
              }, 400);
            };

            // Dynamic date styling
            const getDayHighlightStyle = (dateStr: string) => {
              const dayDate = new Date(dateStr + 'T00:00:00');

              // Clicked/selected day highlight (dashed white outline)
              if (selectedDayStr === dateStr) {
                return {
                  border: '1.5px dashed #ffffff',
                  borderRadius: '0.25rem',
                  fontWeight: 'bold' as const,
                  backgroundColor: 'rgba(255, 255, 255, 0.15)'
                };
              }

              const start = new Date(activeEvent.startDate + 'T00:00:00');
              const end = new Date(activeEvent.endDate + 'T00:00:00');
              
              if (isNaN(dayDate.getTime()) || isNaN(start.getTime()) || isNaN(end.getTime())) return {};

              // Active selected event highlights (perfect white border square/rectangle)
              if (dayDate >= start && dayDate <= end) {
                return {
                  border: '1.5px solid #ffffff',
                  borderRadius: '0.25rem',
                  fontWeight: 'bold' as const
                };
              }

              // Inactive events grey perfect circle fallback
              for (let i = 0; i < events.length; i++) {
                if (i === activeEventIndex) continue;
                const ev = events[i];
                const evStart = new Date(ev.startDate + 'T00:00:00');
                const evEnd = new Date(ev.endDate + 'T00:00:00');
                if (!isNaN(evStart.getTime()) && !isNaN(evEnd.getTime())) {
                  if (dayDate >= evStart && dayDate <= evEnd) {
                    return {
                      backgroundColor: 'rgba(255, 255, 255, 0.12)',
                      borderRadius: '50%',
                      fontWeight: 'bold' as const
                    };
                  }
                }
              }

              return {};
            };

            const selectedEventIdx = selectedDayStr 
              ? events.findIndex(ev => {
                  const start = ev.startDate;
                  const end = ev.endDate;
                  return selectedDayStr >= start && selectedDayStr <= end;
                })
              : -1;
            const showNoEventCard = selectedDayStr !== null && selectedEventIdx === -1;

            return (
              <div className="events-container">
                
                {/* Left Column: Dark Dynamic Calendar Widget */}
                <div style={{ 
                  backgroundColor: '#131315', 
                  borderRadius: '1.5rem', 
                  padding: '2rem', 
                  width: '100%', 
                  maxWidth: '380px', 
                  border: '1px solid #222225',
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
                }}>
                  {/* Date / Time Fields linked to active event */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                    <div>
                      <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.25rem', paddingLeft: '0.25rem' }}>Start</div>
                      <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#1e1e21', border: '1px solid #2a2a2e', borderRadius: '0.5rem', padding: '0.5rem 0.75rem', color: '#ffffff', fontSize: '0.85rem' }}>
                        <span style={{ marginRight: '0.5rem' }}>📅</span>
                        {activeEvent.startDate.split('-').reverse().join('-')}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.25rem', paddingLeft: '0.25rem' }}>Due</div>
                      <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#1e1e21', border: '1px solid #2a2a2e', borderRadius: '0.5rem', padding: '0.5rem 0.75rem', color: '#ffffff', fontSize: '0.85rem' }}>
                        <span style={{ marginRight: '0.5rem' }}>📅</span>
                        {activeEvent.endDate.split('-').reverse().join('-')}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#1e1e21', border: '1px solid #2a2a2e', borderRadius: '0.5rem', padding: '0.5rem 0.75rem', color: '#ffffff', fontSize: '0.85rem' }}>
                      <span style={{ marginRight: '0.5rem' }}>🕒</span>
                      {activeEvent.startTime}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#1e1e21', border: '1px solid #2a2a2e', borderRadius: '0.5rem', padding: '0.5rem 0.75rem', color: '#ffffff', fontSize: '0.85rem' }}>
                      <span style={{ marginRight: '0.5rem' }}>🕒</span>
                      {activeEvent.endTime}
                    </div>
                  </div>

                  {/* Calendar Month Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', padding: '0 0.5rem' }}>
                    <button onClick={handlePrevMonth} style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#2a2a2e', border: 'none', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>&lt;</button>
                    <div style={{ color: '#ffffff', fontWeight: 500, fontSize: '0.95rem' }}>{monthNames[calendarMonth]} {calendarYear}</div>
                    <button onClick={handleNextMonth} style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#2a2a2e', border: 'none', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>&gt;</button>
                  </div>

                  {/* Weekday Titles */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', textAlign: 'center', color: '#6b7280', fontSize: '0.8rem', fontWeight: 500, marginBottom: '1rem' }}>
                    <div>S</div><div>M</div><div>T</div><div>W</div><div>T</div><div>F</div><div>S</div>
                  </div>

                  {/* Dynamic Calendar Grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.5rem 0', textAlign: 'center', fontSize: '0.85rem', color: '#ffffff' }}>
                    {calendarDays.map((dayObj, i) => {
                      const highlightStyle = getDayHighlightStyle(dayObj.dateStr);
                      const isCurrentMonth = dayObj.isCurrentMonth;
                      
                      return (
                        <div 
                          key={i} 
                          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '32px', cursor: 'pointer' }}
                          onClick={() => {
                            setSelectedDayStr(dayObj.dateStr);
                            const foundIdx = events.findIndex(ev => {
                              const start = ev.startDate;
                              const end = ev.endDate;
                              return dayObj.dateStr >= start && dayObj.dateStr <= end;
                            });
                            if (foundIdx !== -1) {
                              setActiveEventIndex(foundIdx);
                            }
                          }}
                        >
                          <div style={{ 
                            width: '28px', 
                            height: '28px', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            color: isCurrentMonth ? '#ffffff' : '#3f3f46',
                            ...highlightStyle
                          }}>
                            {dayObj.day}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Right Column: Dynamic Swipeable 3D Card Stack */}
                <div 
                  style={{ position: 'relative', width: '320px', height: '500px', cursor: 'pointer' }} 
                  onClick={triggerSwipe}
                  className="events-3d-stack-group"
                >
                  {showNoEventCard ? (
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedDayStr(null);
                      }}
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundColor: '#ffffff',
                        borderRadius: '1.5rem',
                        padding: '1.5rem',
                        boxShadow: '0 24px 48px rgba(0,0,0,0.20)',
                        display: 'flex',
                        flexDirection: 'column',
                        color: '#000',
                        cursor: 'pointer',
                        zIndex: 10,
                      }}
                    >
                      {/* Thumbnail Placeholder */}
                      <div style={{ width: '100%', height: '300px', borderRadius: '1rem', overflow: 'hidden', marginBottom: '1.25rem', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f3f4f6', border: '1px dashed #d1d5db' }}>
                        <div style={{ textAlign: 'center', color: '#9ca3af' }}>
                          <span style={{ fontSize: '4.5rem', display: 'block', marginBottom: '1rem' }}>📅</span>
                          <span style={{ fontSize: '0.85rem', fontWeight: 500 }}>No Corporate Event</span>
                        </div>
                      </div>

                      {/* Title */}
                      <h3 style={{ fontSize: '2.2rem', fontWeight: 400, margin: '0 0 0.5rem 0', color: '#000000', fontFamily: 'sans-serif', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
                        No Event
                      </h3>

                      {/* Description */}
                      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.75rem', marginTop: 'auto' }}>
                        <p style={{
                          flex: 1,
                          fontSize: '0.82rem',
                          color: '#4b5563',
                          lineHeight: 1.55,
                          margin: 0,
                          fontFamily: 'sans-serif',
                        }}>
                          There are no corporate events or presentations scheduled on <strong>{selectedDayStr!.split('-').reverse().join('-')}</strong>. Click this card to browse all events.
                        </p>
                      </div>
                    </div>
                  ) : (
                    [-2, -1, 0, 1, 2].map((pos) => {
                      if (events.length === 0) return null;
                      // pos  0 = front active card (center)
                      // pos -1,-2 = cards fanning LEFT
                      // pos +1,+2 = cards fanning RIGHT
                      const evIdx = (activeEventIndex + pos + events.length * 10) % events.length;
                      const ev = events[evIdx];
                      if (!ev) return null;

                      const isFront = pos === 0;
                      const absPos  = Math.abs(pos);

                      // Perfectly centered vertical alignment with symmetric horizontal offset and scaling:
                      // This makes the top step down and the bottom step up perfectly symmetrically.
                      const scales = [1.00, 0.92, 0.84];
                      const xOffsets = [0, 42, 84];

                      const sc  = scales[absPos];
                      const xPx = pos < 0 ? -xOffsets[absPos] : xOffsets[absPos];
                      const yPx = 0; // Vertically centered
                      const deg = 0; // Perfectly upright cards
                      const zi  = 10 - absPos;

                      const idleT  = `translate(${xPx}px, ${yPx}px) scale(${sc})`;
                      const swipeT = isFront
                        ? 'translate(320px, -20px) rotate(10deg) scale(0.85)'
                        : idleT;

                      return (
                        <div
                          key={`card-${pos}`}
                          className="event-card-white"
                          style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            backgroundColor: '#ffffff',
                            borderRadius: '1.5rem',
                            padding: '1.5rem',
                            boxShadow: isFront
                              ? '0 24px 48px rgba(0,0,0,0.20)'
                              : `0 ${6 + absPos * 2}px ${16 + absPos * 4}px rgba(0,0,0,0.10)`,
                            transition: 'transform 0.4s cubic-bezier(0.165,0.84,0.44,1), opacity 0.4s',
                            transform: swipeState === 'swiping' ? swipeT : idleT,
                            opacity: isFront && swipeState === 'swiping' ? 0 : 1,
                            zIndex: zi,
                            display: 'flex',
                            flexDirection: 'column',
                            color: '#000',
                            pointerEvents: isFront ? 'auto' : 'none',
                          }}
                        >
                          {/* Thumbnail */}
                          <div style={{ width: '100%', height: '300px', borderRadius: '1rem', overflow: 'hidden', marginBottom: '1.25rem', flexShrink: 0, backgroundColor: '#ffffff' }}>
                            <img
                              src={ev.image || '/assets/event-speaker.png'}
                              alt={ev.title}
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                          </div>

                          {/* Title */}
                          <h3 style={{ fontSize: '2.2rem', fontWeight: 400, margin: '0 0 0.5rem 0', color: '#000000', fontFamily: 'sans-serif', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
                            {ev.title}
                          </h3>

                          {/* Description + Arrow */}
                          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.75rem', marginTop: 'auto' }}>
                            <p style={{
                              flex: 1,
                              fontSize: '0.82rem',
                              color: '#374151',
                              lineHeight: 1.55,
                              margin: 0,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              display: '-webkit-box',
                              WebkitLineClamp: 4,
                              WebkitBoxOrient: 'vertical',
                              fontFamily: 'sans-serif',
                              textDecoration: 'none',
                            }}>
                              {ev.description}
                            </p>
                            <div style={{ flexShrink: 0 }}>
                              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="7" y1="17" x2="17" y2="7" />
                                <polyline points="7 7 17 7 17 17" />
                              </svg>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

              </div>
            );
          })()}
        </section>

        {/* Why Invest */}
        <section style={{ marginBottom: '8rem', display: 'flex', flexWrap: 'wrap', gap: '4rem', alignItems: 'center' }}>
          <div style={{ flex: '1 1 400px' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '1.5rem' }}>Why Invest in Zawr?</h2>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {[
                { title: 'Diversified Portfolio', desc: 'Our investments span AI, Logistics, Healthcare, and Real Estate, ensuring risk mitigation and stable returns.' },
                { title: 'Visionary Leadership', desc: 'Led by a team of serial entrepreneurs and industry veterans with a proven track record of scaling global businesses.' },
                { title: 'Innovation First', desc: 'We heavily reinvest in R&D to maintain a technological edge and disrupt traditional market models.' }
              ].map((item, i) => (
                <li key={i} style={{ display: 'flex', gap: '1rem' }}>
                  <div style={{ color: '#ffffff', marginTop: '0.25rem' }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.25rem' }}>{item.title}</h3>
                    <p style={{ color: '#9ca3af', lineHeight: 1.5 }}>{item.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div style={{ flex: '1 1 400px', backgroundColor: '#111111', borderRadius: '1.5rem', padding: '3rem', border: '1px solid #1f2937' }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '2rem' }}>Corporate Governance</h3>
            <p style={{ color: '#9ca3af', lineHeight: 1.6, marginBottom: '1.5rem' }}>
              We adhere to the highest standards of corporate governance, ensuring transparency, accountability, and ethical business practices across all our subsidiaries and global operations.
            </p>
            <p style={{ color: '#9ca3af', lineHeight: 1.6 }}>
              Our board of directors brings together decades of diverse experience to oversee our strategic direction and safeguard shareholder value.
            </p>
          </div>
        </section>



      </div>
      
      {/* CSS Animation for Bounce and Layout Responsiveness */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% { transform: translateY(0) translateX(-50%); }
          40% { transform: translateY(-20px) translateX(-50%); }
          60% { transform: translateY(-10px) translateX(-50%); }
        }

        .events-container {
          display: flex;
          flex-wrap: wrap;
          gap: 4rem;
          justify-content: center;
          align-items: center;
          width: 100%;
        }

        .events-3d-stack-group {
          transition: transform 0.3s ease;
        }
        .events-3d-stack-group:hover {
          transform: scale(1.01);
        }

        @media (max-width: 900px) {
          .events-container {
            flex-direction: column !important;
            gap: 3rem !important;
          }
        }

        @media (max-width: 480px) {
          .events-container {
            gap: 2rem !important;
          }
          .events-3d-stack-group {
            width: 100% !important;
            max-width: 320px !important;
            height: 380px !important;
          }
          .events-3d-stack-group > div {
            width: 100% !important;
            max-width: 320px !important;
            height: 380px !important;
            padding: 1.25rem !important;
          }
          .events-3d-stack-group img {
            height: 180px !important;
          }
          .events-3d-stack-group h3 {
            font-size: 1.6rem !important;
          }
        }
      `}} />
    </div>
  );
}
