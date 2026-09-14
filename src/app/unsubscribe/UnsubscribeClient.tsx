'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

const PREFERENCE_OPTIONS = [
  {
    id: 'press',
    title: 'Corporate Press Releases & Official Notices',
    description: 'Real-time regulatory announcements, leadership notices, and corporate press releases.',
    defaultChecked: true,
  },
  {
    id: 'ai-tech',
    title: 'Platform Engineering & AI Innovations',
    description: 'Technical deep dives into Firm AI, VelocityOS, Sketch Studio, and Zawr AI models.',
    defaultChecked: true,
  },
  {
    id: 'investors',
    title: 'Investor Relations & Financial Disclosures',
    description: 'Quarterly financial reports, venture capital milestones, and shareholder updates.',
    defaultChecked: true,
  },
  {
    id: 'digest',
    title: 'Weekly Executive Briefing & Industrial Digest',
    description: 'Curated weekly synthesis of market trends across logistics, manufacturing, and tech.',
    defaultChecked: true,
  },
];

const REASON_OPTIONS = [
  'I receive too many emails from Zawr Industries',
  'The content is no longer relevant to my interests',
  'I never signed up for this newsletter',
  'I am changing my primary email address',
  'I prefer following announcements on LinkedIn / Website',
  'Other reason',
];

function UnsubscribeContent() {
  const searchParams = useSearchParams();
  const emailParam = searchParams.get('email') || '';

  const [email, setEmail] = useState('');
  const [selectedReasons, setSelectedReasons] = useState<string[]>([]);
  const [otherFeedback, setOtherFeedback] = useState('');
  const [preferences, setPreferences] = useState<{ [key: string]: boolean }>({
    press: true,
    'ai-tech': true,
    investors: true,
    digest: true,
  });

  const [currentStatus, setCurrentStatus] = useState<'Active' | 'Unsubscribed' | 'Unknown'>('Active');
  const [activeView, setActiveView] = useState<'unsubscribe' | 'preferences' | 'success' | 'reactivated'>('unsubscribe');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Prepopulate email and check initial status
  useEffect(() => {
    if (emailParam) {
      const decoded = decodeURIComponent(emailParam).trim();
      setEmail(decoded);
      checkStatus(decoded);
    }
  }, [emailParam]);

  const checkStatus = async (targetEmail: string) => {
    try {
      const res = await fetch(`/api/unsubscribe?email=${encodeURIComponent(targetEmail)}`);
      const data = await res.json();
      if (data.found) {
        if (data.status === 'Unsubscribed') {
          setCurrentStatus('Unsubscribed');
        } else {
          setCurrentStatus('Active');
        }
      }
    } catch {
      // ignore
    }
  };

  const handleToggleReason = (reason: string) => {
    if (selectedReasons.includes(reason)) {
      setSelectedReasons(selectedReasons.filter((r) => r !== reason));
    } else {
      setSelectedReasons([...selectedReasons, reason]);
    }
  };

  const handleTogglePref = (prefId: string) => {
    setPreferences((prev) => ({
      ...prev,
      [prefId]: !prev[prefId],
    }));
  };

  const handleUnsubscribe = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!email || !email.includes('@')) {
      setErrorMsg('Please provide a valid email address.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/unsubscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          reason: selectedReasons.join('; ') || 'User Unsubscribe Request',
          feedback: otherFeedback,
          action: 'unsubscribe',
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setCurrentStatus('Unsubscribed');
        setActiveView('success');
        setSuccessMsg(data.message || 'You have been successfully unsubscribed.');
      } else {
        setErrorMsg(data.error || 'Unable to complete unsubscribe. Please try again.');
      }
    } catch {
      setErrorMsg('Network error. Please try again or contact support.');
    } finally {
      setLoading(false);
    }
  };

  const handleSavePreferences = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setErrorMsg('Please provide a valid email address.');
      return;
    }

    // If user unselected all preferences, trigger full unsubscribe
    const selectedKeys = Object.keys(preferences).filter((k) => preferences[k]);
    if (selectedKeys.length === 0) {
      return handleUnsubscribe();
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/unsubscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          preferences: selectedKeys,
          action: 'update_preferences',
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setActiveView('success');
        setSuccessMsg('Your email preferences have been updated successfully.');
      } else {
        setErrorMsg(data.error || 'Failed to update preferences.');
      }
    } catch {
      setErrorMsg('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResubscribe = async () => {
    if (!email || !email.includes('@')) return;

    setLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/unsubscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          action: 'resubscribe',
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setCurrentStatus('Active');
        setActiveView('reactivated');
        setSuccessMsg('Your subscription has been successfully reactivated.');
      } else {
        setErrorMsg(data.error || 'Failed to reactivate subscription.');
      }
    } catch {
      setErrorMsg('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#000000',
        color: '#ffffff',
        fontFamily: "'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '9rem 1.5rem 5rem 1.5rem',
      }}
    >
      <div style={{ maxWidth: '640px', width: '100%', margin: '0 auto' }}>
        
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.35rem 0.9rem',
              borderRadius: '999px',
              backgroundColor: '#111111',
              border: '1px solid #222222',
              fontSize: '0.72rem',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              color: '#aaaaaa',
              marginBottom: '0.5rem',
            }}
          >
            <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#ffffff' }} />
            Corporate Newsroom &amp; Dispatch Preferences
          </div>
        </div>

        {/* Main Card */}
        <div
          style={{
            backgroundColor: '#0a0a0a',
            border: '1px solid #222222',
            borderRadius: '12px',
            padding: '2.25rem 2rem',
            boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
          }}
        >
          {/* Error Alert */}
          {errorMsg && (
            <div
              style={{
                marginBottom: '1.5rem',
                padding: '0.9rem 1.2rem',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: '8px',
                color: '#f87171',
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <span>⚠</span> {errorMsg}
            </div>
          )}

          {/* VIEW: SUCCESS / UNSUBSCRIBED */}
          {activeView === 'success' && (
            <div style={{ textAlign: 'center', padding: '1rem 0' }}>
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  backgroundColor: '#171717',
                  border: '1px solid #333333',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.5rem auto',
                  fontSize: '1.5rem',
                  color: '#ffffff',
                }}
              >
                ✓
              </div>
              <h1
                style={{
                  fontSize: '1.4rem',
                  fontWeight: 600,
                  margin: '0 0 0.75rem 0',
                  letterSpacing: '-0.02em',
                }}
              >
                Unsubscribed Successfully
              </h1>
              <p
                style={{
                  fontSize: '0.9rem',
                  color: '#999999',
                  lineHeight: 1.6,
                  marginBottom: '1.75rem',
                }}
              >
                <strong style={{ color: '#ffffff' }}>{email}</strong> has been removed from all future newsletter broadcasts and corporate press dispatches.
              </p>

              <div
                style={{
                  padding: '1rem',
                  backgroundColor: '#111111',
                  borderRadius: '8px',
                  border: '1px solid #1f1f1f',
                  marginBottom: '2rem',
                  textAlign: 'left',
                }}
              >
                <div style={{ fontSize: '0.8rem', color: '#aaaaaa', lineHeight: 1.5 }}>
                  Unsubscribed by mistake? You can restore your subscription at any time:
                </div>
                <button
                  onClick={handleResubscribe}
                  disabled={loading}
                  style={{
                    marginTop: '0.75rem',
                    padding: '0.5rem 1rem',
                    backgroundColor: '#ffffff',
                    color: '#000000',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'opacity 0.2s',
                  }}
                >
                  {loading ? 'Reactivating...' : '↺ Reactivate My Subscription'}
                </button>
              </div>

              <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
                <Link
                  href="/"
                  style={{
                    fontSize: '0.85rem',
                    color: '#888888',
                    textDecoration: 'none',
                    borderBottom: '1px solid #444444',
                    paddingBottom: '2px',
                  }}
                >
                  &larr; Return to Zawr Industries Home
                </Link>
              </div>
            </div>
          )}

          {/* VIEW: REACTIVATED */}
          {activeView === 'reactivated' && (
            <div style={{ textAlign: 'center', padding: '1rem 0' }}>
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  backgroundColor: '#10b98115',
                  border: '1px solid #34d39940',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.5rem auto',
                  fontSize: '1.5rem',
                  color: '#34d399',
                }}
              >
                ✓
              </div>
              <h1
                style={{
                  fontSize: '1.4rem',
                  fontWeight: 600,
                  margin: '0 0 0.75rem 0',
                  letterSpacing: '-0.02em',
                }}
              >
                Subscription Reactivated
              </h1>
              <p
                style={{
                  fontSize: '0.9rem',
                  color: '#999999',
                  lineHeight: 1.6,
                  marginBottom: '2rem',
                }}
              >
                Welcome back! <strong style={{ color: '#ffffff' }}>{email}</strong> is once again set to receive official corporate news alerts and executive briefings.
              </p>

              <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
                <Link
                  href="/"
                  style={{
                    padding: '0.65rem 1.4rem',
                    backgroundColor: '#ffffff',
                    color: '#000000',
                    borderRadius: '6px',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    textDecoration: 'none',
                  }}
                >
                  Return to Home
                </Link>
              </div>
            </div>
          )}

          {/* VIEW: UNSUBSCRIBE FORM OR PREFERENCES */}
          {activeView !== 'success' && activeView !== 'reactivated' && (
            <div>
              {/* Header inside Card */}
              <div style={{ marginBottom: '1.75rem' }}>
                <h1
                  style={{
                    fontSize: '1.35rem',
                    fontWeight: 600,
                    margin: '0 0 0.5rem 0',
                    letterSpacing: '-0.02em',
                  }}
                >
                  Manage Email Subscription
                </h1>
                <p style={{ fontSize: '0.85rem', color: '#888888', margin: 0, lineHeight: 1.5 }}>
                  Configure your communication preferences or opt-out from Zawr Industries dispatches.
                </p>
              </div>

              {/* Email Input Field */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    color: '#aaaaaa',
                    marginBottom: '0.5rem',
                  }}
                >
                  Subscriber Email Address
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    required
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      backgroundColor: '#111111',
                      border: '1px solid #333333',
                      borderRadius: '8px',
                      color: '#ffffff',
                      fontSize: '0.9rem',
                      fontFamily: 'inherit',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                  {currentStatus === 'Unsubscribed' && (
                    <div
                      style={{
                        marginTop: '0.5rem',
                        fontSize: '0.78rem',
                        color: '#f87171',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                      }}
                    >
                      <span>ℹ</span> This email is currently unsubscribed.
                    </div>
                  )}
                </div>
              </div>

              {/* View Switcher Tabs */}
              <div
                style={{
                  display: 'flex',
                  borderBottom: '1px solid #222222',
                  marginBottom: '1.75rem',
                  gap: '1rem',
                }}
              >
                <button
                  type="button"
                  onClick={() => setActiveView('unsubscribe')}
                  style={{
                    background: 'none',
                    border: 'none',
                    borderBottom: activeView === 'unsubscribe' ? '2px solid #ffffff' : '2px solid transparent',
                    padding: '0.5rem 0.25rem',
                    color: activeView === 'unsubscribe' ? '#ffffff' : '#777777',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    marginBottom: '-1px',
                  }}
                >
                  Unsubscribe Completely
                </button>
                <button
                  type="button"
                  onClick={() => setActiveView('preferences')}
                  style={{
                    background: 'none',
                    border: 'none',
                    borderBottom: activeView === 'preferences' ? '2px solid #ffffff' : '2px solid transparent',
                    padding: '0.5rem 0.25rem',
                    color: activeView === 'preferences' ? '#ffffff' : '#777777',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    marginBottom: '-1px',
                  }}
                >
                  Custom Preferences
                </button>
              </div>

              {/* TAB 1: COMPLETE UNSUBSCRIBE */}
              {activeView === 'unsubscribe' && (
                <form onSubmit={handleUnsubscribe}>
                  <div style={{ marginBottom: '1.5rem' }}>
                    <div
                      style={{
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        color: '#cccccc',
                        marginBottom: '0.75rem',
                      }}
                    >
                      Please tell us why you are unsubscribing (Optional):
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {REASON_OPTIONS.map((reason, idx) => (
                        <label
                          key={idx}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.65rem',
                            fontSize: '0.8rem',
                            color: '#999999',
                            cursor: 'pointer',
                            userSelect: 'none',
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={selectedReasons.includes(reason)}
                            onChange={() => handleToggleReason(reason)}
                            style={{
                              accentColor: '#ffffff',
                              cursor: 'pointer',
                            }}
                          />
                          <span>{reason}</span>
                        </label>
                      ))}
                    </div>

                    {selectedReasons.includes('Other reason') && (
                      <textarea
                        value={otherFeedback}
                        onChange={(e) => setOtherFeedback(e.target.value)}
                        placeholder="Help us improve our communications..."
                        rows={2}
                        style={{
                          width: '100%',
                          marginTop: '0.75rem',
                          padding: '0.65rem',
                          backgroundColor: '#111111',
                          border: '1px solid #333333',
                          borderRadius: '6px',
                          color: '#ffffff',
                          fontSize: '0.8rem',
                          outline: 'none',
                          fontFamily: 'inherit',
                          boxSizing: 'border-box',
                        }}
                      />
                    )}
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <button
                      type="submit"
                      disabled={loading || !email}
                      style={{
                        width: '100%',
                        padding: '0.85rem',
                        backgroundColor: '#ffffff',
                        color: '#000000',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '0.88rem',
                        fontWeight: 700,
                        cursor: loading || !email ? 'not-allowed' : 'pointer',
                        opacity: loading || !email ? 0.6 : 1,
                        transition: 'opacity 0.2s',
                        letterSpacing: '0.02em',
                      }}
                    >
                      {loading ? 'Processing Unsubscribe...' : 'Confirm Unsubscribe'}
                    </button>
                  </div>
                </form>
              )}

              {/* TAB 2: CUSTOM PREFERENCES */}
              {activeView === 'preferences' && (
                <form onSubmit={handleSavePreferences}>
                  <div style={{ marginBottom: '1.75rem' }}>
                    <div
                      style={{
                        fontSize: '0.8rem',
                        color: '#999999',
                        lineHeight: 1.5,
                        marginBottom: '1rem',
                      }}
                    >
                      Select which categories of updates you would like to keep receiving:
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      {PREFERENCE_OPTIONS.map((opt) => (
                        <div
                          key={opt.id}
                          onClick={() => handleTogglePref(opt.id)}
                          style={{
                            padding: '0.9rem 1rem',
                            backgroundColor: '#111111',
                            border: `1px solid ${preferences[opt.id] ? '#444444' : '#1f1f1f'}`,
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '0.75rem',
                            cursor: 'pointer',
                            transition: 'border-color 0.2s',
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={preferences[opt.id] || false}
                            onChange={() => {}} // Handled by container
                            style={{
                              accentColor: '#ffffff',
                              cursor: 'pointer',
                              marginTop: '0.2rem',
                            }}
                          />
                          <div>
                            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#ffffff', marginBottom: '0.2rem' }}>
                              {opt.title}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: '#888888', lineHeight: 1.4 }}>
                              {opt.description}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading || !email}
                    style={{
                      width: '100%',
                      padding: '0.85rem',
                      backgroundColor: '#ffffff',
                      color: '#000000',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '0.88rem',
                      fontWeight: 700,
                      cursor: loading || !email ? 'not-allowed' : 'pointer',
                      opacity: loading || !email ? 0.6 : 1,
                      transition: 'opacity 0.2s',
                    }}
                  >
                    {loading ? 'Saving Preferences...' : 'Save Email Preferences'}
                  </button>
                </form>
              )}
            </div>
          )}
        </div>

        {/* Footer info & Support */}
        <div
          style={{
            marginTop: '2rem',
            textAlign: 'center',
            fontSize: '0.75rem',
            color: '#666666',
            lineHeight: 1.6,
          }}
        >
          <div>
            Need assistance? Reach our Newsroom team at{' '}
            <a
              href="mailto:media@zawrindustries.com"
              style={{ color: '#aaaaaa', textDecoration: 'underline' }}
            >
              media@zawrindustries.com
            </a>
          </div>
          <div style={{ marginTop: '0.5rem' }}>
            <Link
              href="/privacy-policy"
              style={{ color: '#666666', textDecoration: 'underline', marginRight: '0.75rem' }}
            >
              Privacy Policy
            </Link>
            ·
            <Link
              href="/legal/terms"
              style={{ color: '#666666', textDecoration: 'underline', marginLeft: '0.75rem', marginRight: '0.75rem' }}
            >
              Terms of Service
            </Link>
            ·
            <Link
              href="/"
              style={{ color: '#666666', textDecoration: 'underline', marginLeft: '0.75rem' }}
            >
              Zawr Industries
            </Link>
          </div>
          <div style={{ marginTop: '0.5rem', color: '#444444' }}>
            © {new Date().getFullYear()} Zawr Industries LLP. All rights reserved.
          </div>
        </div>

      </div>
    </div>
  );
}

export default function UnsubscribeClient() {
  return (
    <Suspense
      fallback={
        <div
          style={{
            minHeight: '100vh',
            backgroundColor: '#000000',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: "'Poppins', sans-serif",
            fontSize: '0.9rem',
            letterSpacing: '0.04em',
          }}
        >
          Loading preferences...
        </div>
      }
    >
      <UnsubscribeContent />
    </Suspense>
  );
}
