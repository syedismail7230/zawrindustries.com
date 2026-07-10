'use client';

import React, { useState, useEffect, useMemo } from 'react';

interface EventItem {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  startDate: string; // YYYY-MM-DD
  endDate: string;
  startTime: string;
  endTime: string;
  image: string;
  ticketsBooked?: string;
  ticketsCapacity?: string;
  venue?: string;
  specialNote?: string;
}

export default function EventsPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeEventIndex, setActiveEventIndex] = useState(0);
  const [swipeState, setSwipeState] = useState<'idle' | 'swiping'>('idle');
  const [selectedDayStr, setSelectedDayStr] = useState<string | null>(null);

  // RSVP Form States
  const [isRsvpModalOpen, setIsRsvpModalOpen] = useState(false);
  const [rsvpName, setRsvpName] = useState('');
  const [rsvpEmail, setRsvpEmail] = useState('');
  const [rsvpPhone, setRsvpPhone] = useState('');
  const [rsvpCompany, setRsvpCompany] = useState('');
  const [rsvpDesignation, setRsvpDesignation] = useState('');
  const [rsvpLoading, setRsvpLoading] = useState(false);
  const [rsvpSuccess, setRsvpSuccess] = useState(false);
  const formatEventDate = (dateStr: string | undefined, timeStr: string | undefined) => {
    if (!dateStr) return '';
    const dateObj = new Date(dateStr + 'T00:00:00');
    if (isNaN(dateObj.getTime())) return dateStr;
    
    const day = dateObj.getDate();
    let suffix = 'th';
    if (day === 1 || day === 21 || day === 31) suffix = 'st';
    else if (day === 2 || day === 22) suffix = 'nd';
    else if (day === 3 || day === 23) suffix = 'rd';

    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const month = months[dateObj.getMonth()];
    const year = dateObj.getFullYear();

    let timeFormatted = '';
    if (timeStr && timeStr !== '00:00:00') {
      const [h, m] = timeStr.split(':');
      let hours = parseInt(h);
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12; // 0 should be 12
      timeFormatted = ` / ${hours}:${m} ${ampm} Onwards`;
    } else {
      timeFormatted = ' / 8:00 AM Onwards';
    }

    return `${day}${suffix} ${month}, ${year}${timeFormatted}`;
  };

  // Calendar Year/Month navigation state
  const [currentCalendarDate, setCurrentCalendarDate] = useState<Date>(() => {
    // Default calendar starts in June 2026 to showcase the preset launch event perfectly!
    return new Date(2026, 5, 1);
  });

  // Load live events from the shared API (connected with Webmaster dashboard!)
  useEffect(() => {
    async function fetchEvents() {
      try {
        const res = await fetch(`/api/events?t=${Date.now()}`, { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          setEvents(data || []);

          // Auto-align calendar view and active card to the latest chronological event
          if (data && data.length > 0) {
            let latestEvent = data[0];
            let latestIdx = 0;
            for (let i = 1; i < data.length; i++) {
              if (data[i].startDate > latestEvent.startDate) {
                latestEvent = data[i];
                latestIdx = i;
              }
            }
            const latestEventDate = new Date(latestEvent.startDate + 'T00:00:00');
            if (!isNaN(latestEventDate.getTime())) {
              setCurrentCalendarDate(new Date(latestEventDate.getFullYear(), latestEventDate.getMonth(), 1));
              setActiveEventIndex(latestIdx);
            }
          }
        }
      } catch (err) {
        console.error('Error fetching live events:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchEvents();
  }, []);

  // Calendar calculations (matching investor page logic perfectly)
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
    
    // Next month padding cells to complete standard 42 grid cells
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

  const monthNames = [
    "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"
  ];
  
  const calendarYear = currentCalendarDate.getFullYear();
  const calendarMonth = currentCalendarDate.getMonth();
  const calendarDays = useMemo(() => {
    return getCalendarDays(calendarYear, calendarMonth);
  }, [calendarYear, calendarMonth]);

  // Navigate Calendar Months
  const handlePrevMonth = () => {
    setCurrentCalendarDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };
  const handleNextMonth = () => {
    setCurrentCalendarDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  // Swipe event stack logic (smooth transition animating the card off the screen)
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
      
      // Automatically sync calendar focus month to matching event date!
      const newActiveEvent = events[nextIdx];
      const evDate = new Date(newActiveEvent.startDate + 'T00:00:00');
      if (!isNaN(evDate.getTime())) {
        setCurrentCalendarDate(new Date(evDate.getFullYear(), evDate.getMonth(), 1));
      }
    }, 400);
  };

  // Dynamic day highlighting and indicator states
  const getDayHighlightStyle = (dateStr: string) => {
    // Clicked/selected day highlight (dashed white outline)
    if (selectedDayStr === dateStr) {
      return {
        border: '1.5px dashed #ffffff',
        borderRadius: '0.25rem',
        fontWeight: 'normal' as const,
        backgroundColor: 'rgba(255, 255, 255, 0.15)'
      };
    }

    if (events.length === 0) return {};
    const activeEvent = events[activeEventIndex];

    const dayDate = new Date(dateStr + 'T00:00:00');
    const start = new Date(activeEvent.startDate + 'T00:00:00');
    const end = new Date(activeEvent.endDate + 'T00:00:00');
    
    if (isNaN(dayDate.getTime()) || isNaN(start.getTime()) || isNaN(end.getTime())) return {};

    // Active focused event highlight (solid white outline box)
    if (dayDate >= start && dayDate <= end) {
      return {
        border: '1.5px solid #ffffff',
        borderRadius: '0.25rem',
        fontWeight: 'normal' as const
      };
    }

    // Other events highlights (subtle grey round circle dots)
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
            fontWeight: 'normal' as const
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
    <div style={{ backgroundColor: '#000000', minHeight: '100vh', color: '#ffffff', fontFamily: 'Inter, sans-serif', paddingBottom: '10rem' }}>
      
      {/* Dynamic Styling Overrides for Animations */}
      <style dangerouslySetInnerHTML={{__html: `
        .events-3d-stack-group:hover .event-card-white {
          transform: translateY(-8px) scale(1.02);
        }
      `}} />

      {/* Header Spacer */}
      <div style={{ height: '8rem' }}></div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
        
        {/* HERO BANNER - Clean visual display (No text overlay) */}
        <div style={{ 
          width: '100%', 
          borderRadius: '24px', 
          overflow: 'hidden', 
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8)',
          border: '1px solid rgba(255,255,255,0.05)',
          marginBottom: '5rem',
          height: '560px',
          maxHeight: '70vh',
          position: 'relative'
        }}>
          <img 
            src="https://res.cloudinary.com/murfclni/image/upload/v1783710479/zawr/assets/event-hero.png" 
            alt="Zawr Event Hero" 
            style={{ 
              width: '100%', 
              height: '100%', 
              objectFit: 'cover', 
              objectPosition: 'center',
              display: 'block'
            }} 
          />
        </div>

        {/* SECTION HEADER */}
        <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
          <h2 style={{ fontSize: '2.8rem', fontWeight: 400, letterSpacing: '-0.03em', color: '#ffffff' }}>Events</h2>
        </div>

        {/* MAIN INTERACTIVE CONTENT */}
        {events.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            color: '#9ca3af', 
            padding: '4rem 2rem', 
            border: '1px solid #1f2937', 
            borderRadius: '24px', 
            backgroundColor: '#111',
            maxWidth: '600px',
            margin: '0 auto' 
          }}>
            No events scheduled at the moment. Check back soon or visit our Webmaster portal to schedule!
          </div>
        ) : (
          <div style={{ 
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '5rem', 
            alignItems: 'start', 
            maxWidth: '960px', 
            margin: '0 auto' 
          }}>
            
            {/* LEFT COLUMN: dynamic dark calendar widget */}
            <div style={{ 
              backgroundColor: '#131315', 
              borderRadius: '24px', 
              padding: '2.5rem', 
              width: '100%', 
              maxWidth: '380px', 
              border: '1px solid #222225',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
            }}>
              {/* Calendar Month Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', padding: '0 0.5rem' }}>
                <button 
                  onClick={handlePrevMonth} 
                  style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#2a2a2e', border: 'none', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontWeight: '500' }}
                >
                  &lt;
                </button>
                <div style={{ color: '#ffffff', fontWeight: 400, fontSize: '1rem', letterSpacing: '0.02em' }}>
                  {monthNames[calendarMonth]} {calendarYear}
                </div>
                <button 
                  onClick={handleNextMonth} 
                  style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#2a2a2e', border: 'none', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontWeight: '500' }}
                >
                  &gt;
                </button>
              </div>

              {/* Weekday Titles */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', textAlign: 'center', color: '#6b7280', fontSize: '0.8rem', fontWeight: 400, marginBottom: '1.25rem' }}>
                <div>S</div><div>M</div><div>T</div><div>W</div><div>T</div><div>F</div><div>S</div>
              </div>

              {/* Dynamic Calendar Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.75rem 0', textAlign: 'center', fontSize: '0.875rem', color: '#ffffff' }}>
                {calendarDays.map((dayObj, i) => {
                  const highlightStyle = getDayHighlightStyle(dayObj.dateStr);
                  const isCurrentMonth = dayObj.isCurrentMonth;
                  
                  return (
                    <div 
                      key={i} 
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '36px', cursor: 'pointer' }}
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
                        width: '32px', 
                        height: '32px', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        color: isCurrentMonth ? '#ffffff' : '#3f3f46',
                        transition: 'all 0.2s',
                        ...highlightStyle
                      }}>
                        {dayObj.day}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* RIGHT COLUMN: 3D animated swiping stack deck */}
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
                    borderRadius: '24px',
                    padding: '1.75rem',
                    boxShadow: '0 25px 50px rgba(0,0,0,0.4)',
                    display: 'flex',
                    flexDirection: 'column',
                    color: '#000000',
                    zIndex: 10,
                  }}
                >
                  {/* Empty State Image/Placeholder */}
                  <div style={{ 
                    width: '100%', 
                    height: '240px', 
                    borderRadius: '16px', 
                    overflow: 'hidden', 
                    marginBottom: '1.5rem', 
                    flexShrink: 0, 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    backgroundColor: '#f3f4f6', 
                    border: '1px dashed #d1d5db' 
                  }}>
                    <div style={{ textAlign: 'center', color: '#9ca3af' }}>
                      <span style={{ fontSize: '4rem', display: 'block', marginBottom: '0.75rem' }}>📅</span>
                      <span style={{ fontSize: '0.85rem', fontWeight: 500 }}>No Corporate Event</span>
                    </div>
                  </div>

                  <h3 style={{ fontSize: '1.8rem', fontWeight: 500, margin: '0 0 0.5rem 0', color: '#000000', letterSpacing: '-0.02em', lineHeight: 1.15 }}>
                    No Scheduled Event
                  </h3>

                  <p style={{
                    fontSize: '0.82rem',
                    color: '#4b5563',
                    lineHeight: 1.55,
                    margin: 0,
                  }}>
                    There are no corporate events or presentations scheduled on <strong>{selectedDayStr!.split('-').reverse().join('-')}</strong>. Click this card to browse all scheduled events.
                  </p>
                </div>
              ) : (
                [-2, -1, 0, 1, 2].map((pos) => {
                  if (events.length === 0) return null;
                  
                  // pos  0 = front active card (focused)
                  // pos -1,-2 = cards fanning LEFT
                  // pos +1,+2 = cards fanning RIGHT
                  const evIdx = (activeEventIndex + pos + events.length * 10) % events.length;
                  const ev = events[evIdx];
                  if (!ev) return null;

                  const isFront = pos === 0;
                  const absPos  = Math.abs(pos);

                  // Centered vertical alignment layout matching the premium stack fanning logic:
                  const scales = [1.00, 0.92, 0.84];
                  const xOffsets = [0, 42, 84];

                  const sc  = scales[absPos];
                  const xPx = pos < 0 ? -xOffsets[absPos] : xOffsets[absPos];
                  const yPx = 0;
                  const zi  = 10 - absPos;

                  const idleT  = `translate(${xPx}px, ${yPx}px) scale(${sc})`;
                  const swipeT = isFront
                    ? 'translate(320px, -20px) rotate(10deg) scale(0.85)'
                    : idleT;

                  return (
                    <div
                      key={`card-${pos}`}
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundColor: '#ffffff',
                        borderRadius: '24px',
                        padding: '1.75rem',
                        boxShadow: isFront
                          ? '0 25px 50px rgba(0,0,0,0.4)'
                          : `0 ${6 + absPos * 2}px ${16 + absPos * 4}px rgba(0,0,0,0.15)`,
                        transition: 'transform 0.4s cubic-bezier(0.165,0.84,0.44,1), opacity 0.4s',
                        transform: swipeState === 'swiping' ? swipeT : idleT,
                        opacity: isFront && swipeState === 'swiping' ? 0 : 1,
                        zIndex: zi,
                        display: 'flex',
                        flexDirection: 'column',
                        color: '#000000',
                        pointerEvents: isFront ? 'auto' : 'none',
                      }}
                    >
                      {/* Event Card image inside stack */}
                      <div style={{ width: '100%', height: '240px', borderRadius: '16px', overflow: 'hidden', marginBottom: '1.5rem', flexShrink: 0, border: '1px solid #eaeaea' }}>
                        <img
                          src={ev.image || 'https://res.cloudinary.com/murfclni/image/upload/v1783710480/zawr/assets/event-speaker.png'}
                          alt={ev.title}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      </div>

                      {/* Event Title */}
                      <h3 style={{ fontSize: '1.8rem', fontWeight: 500, margin: '0 0 0.5rem 0', color: '#000000', letterSpacing: '-0.03em', lineHeight: 1.15 }}>
                        {ev.title}
                      </h3>

                      {/* Event Description and Link */}
                      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.75rem', marginTop: 'auto' }}>
                        <p style={{
                          flex: 1,
                          fontSize: '0.85rem',
                          color: '#4b5563',
                          lineHeight: 1.55,
                          margin: 0,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: 'vertical',
                        }}>
                          {ev.description}
                        </p>
                        <div style={{ flexShrink: 0 }}>
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2.5" style={{ transform: 'rotate(45deg)' }}>
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
        )}

        {/* LOOKING FOR TICKETS SECTION */}
        {events.length > 0 && (
          <div style={{ marginTop: '7rem', marginBottom: '4rem' }}>
            <div style={{
              display: 'flex',
              flexDirection: 'row',
              gap: '4rem',
              backgroundColor: '#131315',
              borderRadius: '28px',
              padding: '3rem',
              border: '1px solid #222225',
              boxShadow: '0 30px 60px rgba(0, 0, 0, 0.6)',
              alignItems: 'stretch',
              flexWrap: 'wrap'
            }}>
              {/* Left Side: Vertical Card Image */}
              <div style={{
                flex: '0 0 280px',
                borderRadius: '20px',
                overflow: 'hidden',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                backgroundColor: '#1a1a1e',
                minHeight: '360px',
                position: 'relative'
              }}>
                <img
                  src={events[activeEventIndex]?.image || 'https://res.cloudinary.com/murfclni/image/upload/v1783710480/zawr/assets/event-speaker.png'}
                  alt={events[activeEventIndex]?.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>

              {/* Right Side: Event Details */}
              <div style={{ flex: '1', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minWidth: '300px' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 500, letterSpacing: '0.15em', color: '#a1a1aa', textTransform: 'uppercase' }}>
                      Looking for Tickets?
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'rgba(16, 185, 129, 0.1)', padding: '0.4rem 0.8rem', borderRadius: '100px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                      <span style={{ width: '6px', height: '6px', backgroundColor: '#10b981', borderRadius: '50%', display: 'inline-block' }}></span>
                      <span style={{ fontSize: '0.75rem', fontWeight: 500, color: '#10b981' }}>Booking Open</span>
                    </div>
                  </div>

                  <h3 style={{ fontSize: '2.5rem', fontWeight: 500, letterSpacing: '-0.03em', color: '#ffffff', margin: '0 0 0.5rem 0', lineHeight: 1.1 }}>
                    {events[activeEventIndex]?.title}
                  </h3>
                  
                  {events[activeEventIndex]?.subtitle && (
                    <p style={{ fontSize: '1.1rem', color: '#a1a1aa', margin: '0 0 1.5rem 0', fontWeight: 400 }}>
                      {events[activeEventIndex]?.subtitle}
                    </p>
                  )}

                  {/* Meta Specs Grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem', borderBottom: '1px solid #222225', paddingBottom: '1.5rem' }}>
                    <div>
                      <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#71717a', fontWeight: 400, display: 'block', marginBottom: '0.25rem' }}>Date & Time</span>
                      <span style={{ fontSize: '0.95rem', color: '#ffffff', fontWeight: 400 }}>
                        {formatEventDate(events[activeEventIndex]?.startDate, events[activeEventIndex]?.startTime)}
                      </span>
                    </div>
                    <div>
                      <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#71717a', fontWeight: 400, display: 'block', marginBottom: '0.25rem' }}>Venue</span>
                      <span style={{ fontSize: '0.95rem', color: '#ffffff', fontWeight: 400 }}>
                        {events[activeEventIndex]?.venue || 'Online • Bangalore'}
                      </span>
                    </div>
                  </div>

                  {/* Capacity Progress Tracker */}
                  <div style={{ marginBottom: '2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', fontSize: '0.85rem' }}>
                      <span style={{ color: '#a1a1aa', fontWeight: 400 }}>Tickets Confirmed</span>
                      <span style={{ color: '#ffffff', fontWeight: 400 }}>
                        {events[activeEventIndex]?.ticketsBooked || '0'} / {events[activeEventIndex]?.ticketsCapacity || '100'} Booked
                      </span>
                    </div>
                    <div style={{ width: '100%', height: '6px', backgroundColor: '#222225', borderRadius: '100px', overflow: 'hidden' }}>
                      <div style={{ 
                        width: `${Math.min(100, (parseInt(events[activeEventIndex]?.ticketsBooked || '0') / parseInt(events[activeEventIndex]?.ticketsCapacity || '100')) * 100)}%`, 
                        height: '100%', 
                        backgroundColor: '#ffffff', 
                        borderRadius: '100px',
                        transition: 'width 1s cubic-bezier(0.16, 1, 0.3, 1)'
                      }} />
                    </div>
                  </div>

                  {/* Special Note Section */}
                  {events[activeEventIndex]?.specialNote && (
                    <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.02)', border: '1px solid #222225', borderRadius: '16px', padding: '1.25rem 1.5rem', marginBottom: '2rem' }}>
                      <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#ffffff', fontWeight: 500, display: 'block', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>
                        Special Note
                      </span>
                      <p style={{ fontSize: '0.85rem', color: '#a1a1aa', lineHeight: 1.6, margin: 0 }}>
                        {events[activeEventIndex]?.specialNote}
                      </p>
                    </div>
                  )}
                </div>

                {/* RSVP Action Trigger */}
                <button
                  onClick={() => setIsRsvpModalOpen(true)}
                  style={{
                    alignSelf: 'flex-start',
                    padding: '1rem 2.25rem',
                    backgroundColor: '#ffffff',
                    color: '#000000',
                    border: 'none',
                    borderRadius: '100px',
                    fontWeight: 500,
                    fontSize: '0.95rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    boxShadow: '0 10px 20px rgba(255,255,255,0.05)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 15px 30px rgba(255,255,255,0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 10px 20px rgba(255,255,255,0.05)';
                  }}
                >
                  RSVP ↗
                </button>
              </div>
            </div>
          </div>
        )}

        {/* GLASSMORPHIC RSVP BOOKING MODAL */}
        {isRsvpModalOpen && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(16px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem'
          }}>
            <div style={{
              backgroundColor: '#131315',
              border: '1px solid #222225',
              borderRadius: '24px',
              width: '100%',
              maxWidth: '520px',
              boxShadow: '0 50px 100px rgba(0,0,0,0.8)',
              overflow: 'hidden',
              position: 'relative'
            }}>
              {/* Success Screen */}
              {rsvpSuccess ? (
                <div style={{ padding: '3.5rem 2.5rem', textAlign: 'center' }}>
                  <div style={{
                    width: '72px',
                    height: '72px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    border: '1px solid rgba(16, 185, 129, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 2rem auto'
                  }}>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <h3 style={{ fontSize: '1.8rem', fontWeight: 500, color: '#ffffff', letterSpacing: '-0.02em', marginBottom: '0.75rem' }}>
                    RSVP Requested!
                  </h3>
                  <p style={{ fontSize: '0.95rem', color: '#a1a1aa', lineHeight: 1.6, marginBottom: '2rem' }}>
                    Your booking request has been sent successfully to <strong>events@zawrindustries.com</strong>. We will review details and mail your confirmation ticket shortly.
                  </p>
                  <button
                    onClick={() => {
                      setIsRsvpModalOpen(false);
                      setRsvpSuccess(false);
                      setRsvpName('');
                      setRsvpEmail('');
                      setRsvpPhone('');
                      setRsvpCompany('');
                      setRsvpDesignation('');
                    }}
                    style={{
                      width: '100%',
                      padding: '0.85rem',
                      backgroundColor: '#ffffff',
                      color: '#000000',
                      border: 'none',
                      borderRadius: '100px',
                      fontWeight: 500,
                      cursor: 'pointer'
                    }}
                  >
                    Close Window
                  </button>
                </div>
              ) : (
                /* Form Screen */
                <div style={{ padding: '2.5rem' }}>
                  {/* Close button */}
                  <button
                    onClick={() => setIsRsvpModalOpen(false)}
                    style={{
                      position: 'absolute',
                      top: '1.5rem',
                      right: '1.5rem',
                      backgroundColor: 'transparent',
                      border: 'none',
                      color: '#71717a',
                      fontSize: '1.5rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#ffffff'}
                    onMouseLeave={(e) => e.currentTarget.style.color = '#71717a'}
                  >
                    ×
                  </button>

                  <div style={{ marginBottom: '2rem' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 500, letterSpacing: '0.15em', color: '#71717a', textTransform: 'uppercase', display: 'block', marginBottom: '0.5rem' }}>
                      RSVP Reservation
                    </span>
                    <h3 style={{ fontSize: '1.6rem', fontWeight: 500, color: '#ffffff', letterSpacing: '-0.02em', margin: 0 }}>
                      Request Access Pass
                    </h3>
                    <p style={{ fontSize: '0.85rem', color: '#71717a', margin: '0.5rem 0 0 0' }}>
                      For: {events[activeEventIndex]?.title}
                    </p>
                  </div>

                  <form onSubmit={async (e) => {
                    e.preventDefault();
                    if (!rsvpName.trim() || !rsvpEmail.trim()) {
                      alert('Name and Email are required');
                      return;
                    }
                    setRsvpLoading(true);
                    try {
                      const response = await fetch('/api/rsvp', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          name: rsvpName,
                          email: rsvpEmail,
                          phone: rsvpPhone,
                          company: rsvpCompany,
                          designation: rsvpDesignation,
                          eventId: events[activeEventIndex]?.id,
                          eventTitle: events[activeEventIndex]?.title
                        })
                      });
                      if (response.ok) {
                        setRsvpSuccess(true);
                      } else {
                        alert('Failed to submit RSVP request. Please check server logs.');
                      }
                    } catch (err) {
                      alert('Network error submitting RSVP request.');
                    }
                    setRsvpLoading(false);
                  }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '2rem' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.8rem', color: '#a1a1aa', fontWeight: 400, marginBottom: '0.5rem' }}>Full Name *</label>
                        <input
                          type="text"
                          required
                          value={rsvpName}
                          onChange={(e) => setRsvpName(e.target.value)}
                          placeholder="e.g. John Doe"
                          style={{
                            width: '100%',
                            padding: '0.8rem 1rem',
                            backgroundColor: '#1a1a1e',
                            border: '1px solid #28282c',
                            borderRadius: '10px',
                            color: '#ffffff',
                            outline: 'none',
                            fontSize: '0.9rem'
                          }}
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '0.8rem', color: '#a1a1aa', fontWeight: 400, marginBottom: '0.5rem' }}>Email Address *</label>
                        <input
                          type="email"
                          required
                          value={rsvpEmail}
                          onChange={(e) => setRsvpEmail(e.target.value)}
                          placeholder="e.g. john@company.com"
                          style={{
                            width: '100%',
                            padding: '0.8rem 1rem',
                            backgroundColor: '#1a1a1e',
                            border: '1px solid #28282c',
                            borderRadius: '10px',
                            color: '#ffffff',
                            outline: 'none',
                            fontSize: '0.9rem'
                          }}
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '0.8rem', color: '#a1a1aa', fontWeight: 400, marginBottom: '0.5rem' }}>Phone Number</label>
                        <input
                          type="tel"
                          value={rsvpPhone}
                          onChange={(e) => setRsvpPhone(e.target.value)}
                          placeholder="e.g. +91 99999 99999"
                          style={{
                            width: '100%',
                            padding: '0.8rem 1rem',
                            backgroundColor: '#1a1a1e',
                            border: '1px solid #28282c',
                            borderRadius: '10px',
                            color: '#ffffff',
                            outline: 'none',
                            fontSize: '0.9rem'
                          }}
                        />
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.8rem', color: '#a1a1aa', fontWeight: 400, marginBottom: '0.5rem' }}>Company</label>
                          <input
                            type="text"
                            value={rsvpCompany}
                            onChange={(e) => setRsvpCompany(e.target.value)}
                            placeholder="e.g. Zawr Corp"
                            style={{
                              width: '100%',
                              padding: '0.8rem 1rem',
                              backgroundColor: '#1a1a1e',
                              border: '1px solid #28282c',
                              borderRadius: '10px',
                              color: '#ffffff',
                              outline: 'none',
                              fontSize: '0.9rem'
                            }}
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.8rem', color: '#a1a1aa', fontWeight: 400, marginBottom: '0.5rem' }}>Designation</label>
                          <input
                            type="text"
                            value={rsvpDesignation}
                            onChange={(e) => setRsvpDesignation(e.target.value)}
                            placeholder="e.g. Director"
                            style={{
                              width: '100%',
                              padding: '0.8rem 1rem',
                              backgroundColor: '#1a1a1e',
                              border: '1px solid #28282c',
                              borderRadius: '10px',
                              color: '#ffffff',
                              outline: 'none',
                              fontSize: '0.9rem'
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={rsvpLoading}
                      style={{
                        width: '100%',
                        padding: '0.95rem',
                        backgroundColor: '#ffffff',
                        color: '#000000',
                        border: 'none',
                        borderRadius: '100px',
                        fontWeight: 500,
                        fontSize: '0.95rem',
                        cursor: rsvpLoading ? 'not-allowed' : 'pointer',
                        opacity: rsvpLoading ? 0.7 : 1,
                        transition: 'opacity 0.2s'
                      }}
                    >
                      {rsvpLoading ? 'Submitting Request...' : 'Confirm RSVP Booking'}
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
