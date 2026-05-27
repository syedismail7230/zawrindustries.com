'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function NotificationsPage() {
  const [showArchive, setShowArchive] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await fetch('/api/notifications');
        if (res.ok) {
          const data = await res.json();
          setNotifications(data || []);
        }
      } catch (e) {
        console.error('Error fetching notifications:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, []);

  const activeNotifs = notifications.filter((n: any) => !n.archived);
  const archivedNotifs = notifications.filter((n: any) => n.archived);
  const displayed = showArchive ? archivedNotifs : activeNotifs;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#ffffff', color: '#000000', paddingTop: '8rem', paddingBottom: '6rem', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>

        {/* Header */}
        <header style={{ borderBottom: '1px solid #e5e7eb', paddingBottom: '2.5rem', marginBottom: '3rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#6b7280', display: 'block', marginBottom: '0.75rem' }}>
            Newsroom
          </span>
          <h1 style={{ fontSize: 'clamp(2.25rem, 5vw, 3.5rem)', fontWeight: 700, letterSpacing: '-0.02em', color: '#000000', margin: 0, lineHeight: 1.1 }}>
            Notifications
          </h1>
        </header>

        {/* Archive Toggle */}
        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '2rem' }}>
          <button
            onClick={() => setShowArchive(false)}
            style={{
              padding: '0.5rem 1.25rem',
              borderRadius: '9999px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '0.8rem',
              fontWeight: 600,
              backgroundColor: !showArchive ? '#000000' : '#f3f4f6',
              color: !showArchive ? '#ffffff' : '#4b5563',
              transition: 'all 0.2s'
            }}
          >
            Active Notifications
          </button>
          <button
            onClick={() => setShowArchive(true)}
            style={{
              padding: '0.5rem 1.25rem',
              borderRadius: '9999px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '0.8rem',
              fontWeight: 600,
              backgroundColor: showArchive ? '#000000' : '#f3f4f6',
              color: showArchive ? '#ffffff' : '#4b5563',
              transition: 'all 0.2s'
            }}
          >
            Archive
          </button>
        </div>

        {/* Notifications Table */}
        <div style={{ border: '1px solid #e5e7eb', borderRadius: '1rem', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>

          {/* Table Header */}
          <div style={{
            backgroundColor: '#000000',
            padding: '0.9rem 1.75rem',
            display: 'grid',
            gridTemplateColumns: '1fr auto',
            gap: '1rem',
            alignItems: 'center'
          }}>
            <span style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.2em', color: '#ffffff' }}>Title</span>
            <span style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.2em', color: '#ffffff' }}>Date</span>
          </div>

          {/* Rows */}
          {loading ? (
            <div style={{ padding: '3rem 1.75rem', textAlign: 'center', color: '#6b7280', fontSize: '0.95rem', backgroundColor: '#ffffff' }}>
              Loading notifications...
            </div>
          ) : displayed.length === 0 ? (
            <div style={{ padding: '3rem 1.75rem', textAlign: 'center', color: '#6b7280', fontSize: '0.95rem', backgroundColor: '#ffffff' }}>
              No notifications found.
            </div>
          ) : (
            displayed.map((notif, i) => (
              <Link
                key={notif.id}
                href={`/newsroom/notifications/${notif.slug}`}
                style={{ textDecoration: 'none' }}
              >
                <div
                  style={{
                    padding: '1.1rem 1.75rem',
                    display: 'grid',
                    gridTemplateColumns: '1fr auto',
                    gap: '1.5rem',
                    alignItems: 'center',
                    borderBottom: i < displayed.length - 1 ? '1px solid #f3f4f6' : 'none',
                    backgroundColor: '#ffffff',
                    transition: 'background-color 0.15s, border-color 0.15s',
                    cursor: 'pointer'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = '#f9fafb';
                    const titleEl = e.currentTarget.querySelector('.notif-title');
                    if (titleEl) (titleEl as HTMLElement).style.color = '#666666';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = '#ffffff';
                    const titleEl = e.currentTarget.querySelector('.notif-title');
                    if (titleEl) (titleEl as HTMLElement).style.color = '#000000';
                  }}
                >
                  <div>
                    <span 
                      className="notif-title"
                      style={{ fontSize: '0.875rem', color: '#000000', fontWeight: 600, lineHeight: 1.5, display: 'block', transition: 'color 0.15s' }}
                    >
                      {notif.title}
                    </span>
                    {notif.summary && (
                      <span style={{ fontSize: '0.775rem', color: '#6b7280', marginTop: '0.25rem', display: 'block', lineHeight: 1.5 }}>
                        {notif.summary}
                      </span>
                    )}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', whiteSpace: 'nowrap' }}>
                    <span style={{ fontSize: '0.775rem', color: '#6b7280' }}>{notif.date}</span>
                    <span style={{
                      fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase',
                      letterSpacing: '0.1em', padding: '0.2rem 0.6rem',
                      borderRadius: '9999px', backgroundColor: '#f3f4f6',
                      color: '#4b5563', border: '1px solid #e5e7eb'
                    }}>
                      {notif.category}
                    </span>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>

        {!loading && (
          <p style={{ fontSize: '0.8rem', color: '#6b7280', marginTop: '1.5rem', textAlign: 'right' }}>
            Showing {displayed.length} {showArchive ? 'archived' : 'active'} notification{displayed.length !== 1 ? 's' : ''}
          </p>
        )}

      </div>
    </div>
  );
}
