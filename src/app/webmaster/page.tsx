"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams, notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import RichTextEditor from '@/components/RichTextEditor';
import LiveSitePreview from '@/components/LiveSitePreview';
import AnalyticsDashboard from '@/components/AnalyticsDashboard';
import ApiMonitoringDashboard from '@/components/ApiMonitoringDashboard';

export default function WebmasterDashboardPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', backgroundColor: '#000000' }} />}>
      <WebmasterDashboard />
    </Suspense>
  );
}

function WebmasterDashboard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const GATE_TOKEN = process.env.NEXT_PUBLIC_WEBMASTER_GATE_TOKEN || 'zawr-admin-gate';

  const [authorized, setAuthorized] = useState(false);
  const [stageChecked, setStageChecked] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLivePreview, setShowLivePreview] = useState(true);

  // Authentication & RBAC User State
  const [authMode, setAuthMode] = useState<'staff' | 'master'>('staff');
  const [authKey, setAuthKey] = useState<string | null>(null);
  const [authProfile, setAuthProfile] = useState<any | null>(null);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [staffLoginError, setStaffLoginError] = useState('');
  const [currentUser, setCurrentUser] = useState<{
    id: string;
    name: string;
    email: string;
    role: string;
    permissions: string[];
  } | null>(null);
  const [sessionToken, setSessionToken] = useState<string | null>(null);

  // Master Key & Challenge States
  const [loginStep, setLoginStep] = useState<'key' | 'question'>('key');
  const [accessKey, setAccessKey] = useState('');
  const [challengeQuestion, setChallengeQuestion] = useState('');
  const [challengeId, setChallengeId] = useState<number | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  // User Management Module States
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [newUserRole, setNewUserRole] = useState('Content Editor');
  const [newUserPermissions, setNewUserPermissions] = useState<string[]>(['blogs', 'press-releases']);
  const [newUserStatus, setNewUserStatus] = useState<'active' | 'suspended'>('active');
  const [editingUser, setEditingUser] = useState<any | null>(null);
  const [showResetPassModal, setShowResetPassModal] = useState<any | null>(null);
  const [resetPasswordVal, setResetPasswordVal] = useState('');
  const [createdUserCredentials, setCreatedUserCredentials] = useState<{ name: string; email: string; password: string; loginLink: string } | null>(null);
  const [copiedLinkId, setCopiedLinkId] = useState<string | null>(null);
  const [copiedCreds, setCopiedCreds] = useState(false);
  const [userMgmtLoading, setUserMgmtLoading] = useState(false);
  const [userMgmtMsg, setUserMgmtMsg] = useState('');

  const ALL_NAV_ITEMS = [
    { id: 'analytics', label: 'Analytics' },
    { id: 'api-monitoring', label: 'API Monitoring' },
    { id: 'mail-credentials', label: 'Mail Settings' },
    { id: 'email-routing', label: 'Email Routing' },
    { id: 'jobs', label: 'Manage Jobs' },
    { id: 'newsletters', label: 'Newsletters' },
    { id: 'pitch-deck', label: 'Pitch Deck' },
    { id: 'financial-reports', label: 'Financial Reports' },
    { id: 'events', label: 'Manage Events' },
    { id: 'notices', label: 'Manage Notices' },
    { id: 'notifications', label: 'Manage Notifications' },
    { id: 'press-releases', label: 'Manage Press Releases' },
    { id: 'blogs', label: 'Manage Blogs' },
    { id: 'user-management', label: 'User Management' },
  ];

  const callUsersApi = async (reqBody: any) => {
    const activeToken = sessionToken || (typeof window !== 'undefined' ? sessionStorage.getItem('webmaster_session_token') : null);
    const activeKey = accessKey || (typeof window !== 'undefined' ? sessionStorage.getItem('webmaster_master_key') : '') || 'GDkehiuih873276##@';
    
    return fetch('/api/webmaster/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(activeToken ? { 'Authorization': `Bearer ${activeToken}` } : {})
      },
      body: JSON.stringify({
        ...reqBody,
        sessionToken: activeToken,
        masterKey: activeKey
      })
    });
  };

  const fetchUsers = async () => {
    setUserMgmtLoading(true);
    try {
      const res = await callUsersApi({ action: 'list-users' });
      const data = await res.json();
      if (data.success && data.users) {
        setAllUsers(data.users);
      }
    } catch (err) {
      console.error('Failed to fetch users:', err);
    }
    setUserMgmtLoading(false);
  };

  const fetchChallengeQuestion = async (keyInput: string) => {
    setIsVerifying(true);
    try {
      const res = await fetch('/api/webmaster', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'get-challenge', accessKey: keyInput })
      });
      const data = await res.json();
      if (data.success) {
        setChallengeQuestion(data.question);
        setChallengeId(data.questionId);
        setLoginStep('question');
      } else {
        alert(data.error || 'Incorrect Access Key Password');
      }
    } catch (err) {
      alert('Error fetching security challenge.');
    }
    setIsVerifying(false);
  };

  // Check and restore session on client mount
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const urlAuthKey = searchParams.get('authKey') || searchParams.get('key') || searchParams.get('profileToken');
        if (urlAuthKey) {
          setAuthKey(urlAuthKey);
          try {
            const res = await fetch('/api/webmaster/users', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ action: 'validate-login-key', authKey: urlAuthKey })
            });
            const data = await res.json();
            if (data.success && data.profile) {
              setAuthProfile(data.profile);
              setLoginEmail(data.profile.email);
              setAuthorized(true);
              setAuthMode('staff');
            } else {
              setStaffLoginError(data.error || 'Invalid or revoked profile link.');
              setAuthorized(true);
            }
          } catch (err) {
            setStaffLoginError('Error validating unique login link.');
            setAuthorized(true);
          }
        }

        const storedToken = sessionStorage.getItem('webmaster_session_token');
        if (storedToken) {
          const res = await fetch('/api/webmaster/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'verify-session', token: storedToken })
          });
          const data = await res.json();
          if (data.success && data.user) {
            setCurrentUser(data.user);
            setSessionToken(storedToken);
            setAuthorized(true);
            setIsAuthenticated(true);
            setStageChecked(true);
            return;
          } else {
            sessionStorage.removeItem('webmaster_session_token');
          }
        }

        const storedKey = sessionStorage.getItem('webmaster_master_key');
        if (storedKey) {
          setAccessKey(storedKey);
        }

        if (sessionStorage.getItem('webmaster_logged_in') === 'true') {
          setCurrentUser({
            id: 'usr-master',
            name: 'Super Administrator',
            email: 'admin@zawrindustries.com',
            role: 'Super Administrator',
            permissions: ['*']
          });
          setAuthorized(true);
          setIsAuthenticated(true);
          setStageChecked(true);
          return;
        }
        
        if (token === GATE_TOKEN) {
          sessionStorage.setItem('webmaster_authorized', 'true');
          setAuthorized(true);
          if (!urlAuthKey) {
            setAuthMode('master');
          }
        } else if (sessionStorage.getItem('webmaster_authorized') === 'true') {
          setAuthorized(true);
          if (!urlAuthKey) {
            setAuthMode('master');
          }
        }
      } catch (e) {
        // Safeguard for private tabs sandboxes
      }
      setStageChecked(true);
    };

    restoreSession();
  }, [token, GATE_TOKEN, searchParams]);

  // Read immediately on client load to prevent layout shifts
  const urlAuthKey = searchParams.get('authKey') || searchParams.get('key') || searchParams.get('profileToken');
  const isSessionAuth = typeof window !== 'undefined' && (
    sessionStorage.getItem('webmaster_authorized') === 'true' || 
    sessionStorage.getItem('webmaster_logged_in') === 'true' || 
    sessionStorage.getItem('webmaster_session_token') !== null ||
    token === GATE_TOKEN ||
    !!urlAuthKey
  );

  // Instantly throw 404 if token or session is missing
  if (stageChecked && !authorized && !isSessionAuth) {
    notFound();
  }

  const [activeTab, setActiveTab] = useState('analytics');

  // Supabase States
  const [jobs, setJobs] = useState<any[]>([]);
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [routes, setRoutes] = useState<any[]>([
    { id: 1, source: 'Job Applications (/careers)', destination: 'hr@zawrindustries.com' },
    { id: 2, source: 'Sponsorship Inquiries', destination: 'marketing@zawrindustries.com' },
    { id: 3, source: 'Investor Relations', destination: 'investors@zawrindustries.com' }
  ]);
  const [analytics, setAnalytics] = useState<any[]>([
    { label: 'Total Visits', value: '14,209', change: '+12%' },
    { label: 'Bounce Rate', value: '42.3%', change: '-2%' },
    { label: 'Job Applications', value: '89', change: '+24%' }
  ]);
  
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Form State for new job
  const [newJob, setNewJob] = useState<{
    title: string;
    location: string;
    type: string;
    status: string;
    reporting: string;
    role: string;
    responsibilities: string[];
    education_qualifications: string;
    preferred_qualifications: string;
    required_skills: string[];
    candidate_profile: string;
    perks_and_benefits: string;
    performance_expectations: string;
  }>({ 
    title: '',
    location: '',
    type: 'Full-time',
    status: 'Active',
    reporting: '',
    role: '',
    responsibilities: [],
    education_qualifications: '',
    preferred_qualifications: '',
    required_skills: [],
    candidate_profile: '',
    perks_and_benefits: '',
    performance_expectations: ''
  });
  const [editingJob, setEditingJob] = useState<any>(null);

  // Financial Reports States
  const [reports, setReports] = useState<any[]>([]);
  const [reportTitle, setReportTitle] = useState('');
  const [editingReport, setEditingReport] = useState<any>(null);
  const [reportCategory, setReportCategory] = useState('Annual Reports');
  const [reportYear, setReportYear] = useState('2025-2026');
  const [reportIsArchived, setReportIsArchived] = useState(false);
  const [selectedTableCategory, setSelectedTableCategory] = useState('Annual Reports');

  // Events States
  const [events, setEvents] = useState<any[]>([]);
  const [eventTitle, setEventTitle] = useState('');
  const [eventSubtitle, setEventSubtitle] = useState('');
  const [eventDesc, setEventDesc] = useState('');
  const [eventStartDate, setEventStartDate] = useState('');
  const [eventEndDate, setEventEndDate] = useState('');
  const [eventStartTime, setEventStartTime] = useState('');
  const [eventEndTime, setEventEndTime] = useState('');
  const [eventTicketsBooked, setEventTicketsBooked] = useState('0');
  const [eventTicketsCapacity, setEventTicketsCapacity] = useState('100');
  const [eventVenue, setEventVenue] = useState('Online');
  const [eventSpecialNote, setEventSpecialNote] = useState('');
  const [eventImage, setEventImage] = useState('https://res.cloudinary.com/murfclni/image/upload/f_avif,q_auto:eco,w_1200,c_limit/v1783710478/zawr/assets/event-chart.png');
  const [editingEvent, setEditingEvent] = useState<any>(null);
  const [customImageFile, setCustomImageFile] = useState<File | null>(null);

  // Notices States
  const [notices, setNotices] = useState<any[]>([]);
  const [noticeTitle, setNoticeTitle] = useState('');
  const [noticeCategory, setNoticeCategory] = useState('General');
  const [noticeDate, setNoticeDate] = useState('');
  const [noticeSummary, setNoticeSummary] = useState('');
  const [noticeBody, setNoticeBody] = useState('');
  const [noticeIsArchived, setNoticeIsArchived] = useState(false);
  const [editingNotice, setEditingNotice] = useState<any>(null);
  
  // Notice dynamic attachments/links input fields
  const [noticeLinkName, setNoticeLinkName] = useState('');
  const [noticeLinkUrl, setNoticeLinkUrl] = useState('');
  const [noticeAttachmentName, setNoticeAttachmentName] = useState('');
  const [customNoticeFile, setCustomNoticeFile] = useState<File | null>(null);

  // Notifications States
  const [notifications, setNotifications] = useState<any[]>([]);
  const [notifTitle, setNotifTitle] = useState('');
  const [notifCategory, setNotifCategory] = useState('General');
  const [notifDate, setNotifDate] = useState('');
  const [notifSummary, setNotifSummary] = useState('');
  const [notifBody, setNotifBody] = useState('');
  const [notifIsArchived, setNotifIsArchived] = useState(false);
  const [editingNotif, setEditingNotif] = useState<any>(null);
  
  // Notification dynamic attachments/links input fields
  const [notifLinkName, setNotifLinkName] = useState('');
  const [notifLinkUrl, setNotifLinkUrl] = useState('');
  const [notifAttachmentName, setNotifAttachmentName] = useState('');
  const [customNotifFile, setCustomNotifFile] = useState<File | null>(null);

  // Press Releases States
  const [pressReleases, setPressReleases] = useState<any[]>([]);
  const [pressTitle, setPressTitle] = useState('');
  const [pressCategory, setPressCategory] = useState('Corporate');
  const [pressDate, setPressDate] = useState('');
  const [pressSummary, setPressSummary] = useState('');
  const [pressBody, setPressBody] = useState('');
  const [pressIsArchived, setPressIsArchived] = useState(false);
  const [editingPress, setEditingPress] = useState<any>(null);
  
  // Press Release attachments/links fields
  const [pressLinkName, setPressLinkName] = useState('');
  const [pressLinkUrl, setPressLinkUrl] = useState('');
  const [pressAttachmentName, setPressAttachmentName] = useState('');
  const [customPressFile, setCustomPressFile] = useState<File | null>(null);
  const [customPressBannerFile, setCustomPressBannerFile] = useState<File | null>(null);

  // Blogs States
  const [blogsData, setBlogsData] = useState<any[]>([]);
  const [blogTitle, setBlogTitle] = useState('');
  const [blogCategory, setBlogCategory] = useState('News');
  const [blogAuthor, setBlogAuthor] = useState('Lina Linder');
  const [blogDate, setBlogDate] = useState('');
  const [blogSummary, setBlogSummary] = useState('');
  const [blogReadTime, setBlogReadTime] = useState('5 min read');
  const [blogSections, setBlogSections] = useState<any[]>([{ title: '', body: '' }]);
  const [editingBlog, setEditingBlog] = useState<any>(null);
  const [customBlogFile, setCustomBlogFile] = useState<File | null>(null);
  const [customAuthorFile, setCustomAuthorFile] = useState<File | null>(null);

  // Fetch Data from Supabase
  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchData = async () => {
      setLoading(true);
      setErrorMsg('');
      try {
        if (activeTab === 'jobs') {
          const { data, error } = await supabase.from('jobs').select('*').order('id', { ascending: false });
          if (error) {
            // Fallback if table doesn't exist yet
            if (error.code === 'PGRST116' || error.message.includes('does not exist')) {
              setErrorMsg('Table "jobs" does not exist in Supabase yet.');
              setJobs([]);
            } else {
              throw error;
            }
          } else {
            setJobs(data || []);
          }
        }
        else if (activeTab === 'newsletters') {
          const { data, error } = await supabase.from('newsletters').select('*').order('created_at', { ascending: false });
          if (error) {
            if (error.message.includes('does not exist')) setErrorMsg('Table "newsletters" does not exist yet.');
            setSubscribers([]);
          } else {
            setSubscribers(data || []);
          }
        }
        else if (activeTab === 'email-routing') {
          const { data, error } = await supabase.from('email_routing').select('*').order('id');
          if (data && data.length > 0) setRoutes(data);
        }
        else if (activeTab === 'financial-reports') {
          const res = await fetch('/api/financial-reports');
          if (res.ok) {
            const data = await res.json();
            setReports(data || []);
          }
        }
        else if (activeTab === 'events') {
          const res = await fetch(`/api/events?t=${Date.now()}`, { cache: 'no-store' });
          if (res.ok) {
            const data = await res.json();
            setEvents(data || []);
          }
        }
        else if (activeTab === 'notices') {
          const res = await fetch('/api/notices');
          if (res.ok) {
            const data = await res.json();
            setNotices(data || []);
          }
        }
        else if (activeTab === 'notifications') {
          const res = await fetch('/api/notifications');
          if (res.ok) {
            const data = await res.json();
            setNotifications(data || []);
          }
        }
        else if (activeTab === 'press-releases') {
          const res = await fetch('/api/press-releases');
          if (res.ok) {
            const data = await res.json();
            setPressReleases(data || []);
          }
        }
        else if (activeTab === 'blogs') {
          const res = await fetch('/api/blogs');
          if (res.ok) {
            const data = await res.json();
            setBlogsData(data || []);
          }
        }
        else if (activeTab === 'user-management') {
          fetchUsers();
        }
      } catch (error: any) {
        console.error('Supabase error:', error.message);
      }
      setLoading(false);
    };

    fetchData();

    // REALTIME SUBSCRIPTIONS
    const channel = supabase.channel('webmaster-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'jobs' }, payload => {
        if (activeTab === 'jobs') fetchData();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'newsletters' }, payload => {
        if (activeTab === 'newsletters') fetchData();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [activeTab, isAuthenticated]);

  // Helper to map and merge dynamic database reports with mock placeholders for all years
  const getMappedReportsForWebmaster = () => {
    const reportYears = [
      '2026-2027', '2025-2026', '2024-2025', '2023-2024', '2022-2023',
      '2021-2022', '2020-2021', '2019-2020', '2018-2019', '2017-2018',
      '2016-2017', '2015-2016'
    ];

    // 1. Group actual database reports by selectedTableCategory
    const categorizedDbReports = reports.filter(rep => {
      if (rep.category) {
        return rep.category === selectedTableCategory;
      }
      
      // Fallback title parsing for legacy items
      const titleUpper = rep.title.toUpperCase();
      if (selectedTableCategory === 'Quarterly Results') {
        return titleUpper.includes('QUARTER') || titleUpper.includes('Q1') || titleUpper.includes('Q2') || titleUpper.includes('Q3') || titleUpper.includes('Q4') || titleUpper.includes('RESULTS');
      }
      if (selectedTableCategory === 'Financial Presentations') {
        return (titleUpper.includes('PRESENTATION') || titleUpper.includes('ROADMAP') || titleUpper.includes('PITCH')) && !titleUpper.includes('OTHER');
      }
      if (selectedTableCategory === 'CSR Reports') {
        return titleUpper.includes('CSR') || titleUpper.includes('SOCIAL') || titleUpper.includes('COMMUNITY');
      }
      if (selectedTableCategory === '10 Year Financial Highlights') {
        return titleUpper.includes('10 YEAR') || titleUpper.includes('HIGHLIGHTS') || titleUpper.includes('HIGHLIGHT');
      }
      if (selectedTableCategory === 'Other Investor Presentations') {
        return titleUpper.includes('OTHER') || titleUpper.includes('PORTFOLIO');
      }
      return !titleUpper.includes('QUARTER') && !titleUpper.includes('Q1') && !titleUpper.includes('Q2') && !titleUpper.includes('Q3') && !titleUpper.includes('Q4') && !titleUpper.includes('CSR') && !titleUpper.includes('10 YEAR');
    });

    const activeList: any[] = [];

    // First, process any actual webmaster uploads that match selected years
    categorizedDbReports.forEach(rep => {
      // Use explicit year field, with chronological title fallback for legacy
      let matchedYear = rep.year;
      if (!matchedYear) {
        const titleUpper = rep.title.toUpperCase();
        matchedYear = reportYears.find(y => {
          const [startYr, endYr] = y.split('-');
          if (y === '2025-2026' && (titleUpper.includes('2026') || titleUpper.includes('FY 2026') || titleUpper.includes('25-26'))) return true;
          if (y === '2024-2025' && (titleUpper.includes('2025') || titleUpper.includes('FY 2025') || titleUpper.includes('24-25'))) return true;
          if (y === '2023-2024' && (titleUpper.includes('2024') || titleUpper.includes('FY 2024') || titleUpper.includes('23-24'))) return true;
          if (y === '2022-2023' && (titleUpper.includes('2023') || titleUpper.includes('FY 2023') || titleUpper.includes('22-23'))) return true;
          return titleUpper.includes(startYr) || titleUpper.includes(endYr);
        });
      }

      if (matchedYear) {
        activeList.push({
          id: rep.id,
          title: rep.title,
          pdfUrl: rep.pdfUrl,
          category: selectedTableCategory,
          year: matchedYear,
          isArchived: !!rep.isArchived,
          isUserUploaded: true
        });
      }
    });

    // 2. Add placeholders for years without an upload
    reportYears.forEach(year => {
      const alreadyHasUpload = activeList.some(item => item.year === year);
      if (!alreadyHasUpload) {
        let title = '';
        if (selectedTableCategory === 'Annual Reports') {
          title = `Annual Report for the year ${year}`;
        } else if (selectedTableCategory === 'Quarterly Results') {
          title = `Quarterly Results for Q3 FY ${year}`;
        } else if (selectedTableCategory === 'Financial Presentations') {
          title = `Investor Presentation - FY ${year}`;
        } else if (selectedTableCategory === 'CSR Reports') {
          title = `Corporate Social Responsibility Report ${year}`;
        } else if (selectedTableCategory === '10 Year Financial Highlights') {
          title = `10 Year Financial and Operational Highlights (${year})`;
        } else {
          title = `Investor Presentation Portfolio - ${year}`;
        }

        activeList.push({
          id: `mock-${year}`,
          title,
          pdfUrl: '',
          category: selectedTableCategory,
          year,
          isArchived: true, // Default to archived offline
          isUserUploaded: false
        });
      }
    });

    // Sort chronologically (latest year first)
    return activeList.sort((a, b) => b.year.localeCompare(a.year));
  };

  // Job Actions (Add, Edit, Update, Status Toggle, Delete)
  const handleSaveJob = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newJob.title.trim() || !newJob.location.trim()) {
      alert('Please fill in required fields: Job Title and Location.');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        title: newJob.title.trim(),
        location: newJob.location.trim(),
        type: newJob.type,
        status: newJob.status || 'Active',
        reporting: newJob.reporting || '',
        role: newJob.role || '',
        responsibilities: newJob.responsibilities || [],
        education_qualifications: newJob.education_qualifications || '',
        preferred_qualifications: newJob.preferred_qualifications || '',
        required_skills: newJob.required_skills || [],
        candidate_profile: newJob.candidate_profile || '',
        perks_and_benefits: newJob.perks_and_benefits || '',
        performance_expectations: newJob.performance_expectations || '',
      };

      if (editingJob) {
        // Update existing job
        const { data, error } = await supabase.from('jobs').update(payload).eq('id', editingJob.id).select();
        if (error) {
          if (error.message.includes('column') && error.message.includes('schema cache')) {
            alert(`Supabase Database Update Required:\nYour Supabase 'jobs' table needs the new columns.\n\nPlease run the SQL snippet in Supabase SQL Editor:\nALTER TABLE public.jobs\nADD COLUMN IF NOT EXISTS candidate_profile TEXT,\nADD COLUMN IF NOT EXISTS education_qualifications TEXT,\nADD COLUMN IF NOT EXISTS preferred_qualifications TEXT,\nADD COLUMN IF NOT EXISTS required_skills TEXT[],\nADD COLUMN IF NOT EXISTS perks_and_benefits TEXT,\nADD COLUMN IF NOT EXISTS performance_expectations TEXT;\n\nSupabase details: ${error.message}`);
          } else {
            alert(`Error updating job: ${error.message}`);
          }
        } else {
          const updatedJob = (data && data[0]) ? data[0] : { ...editingJob, ...payload };
          setJobs(jobs.map(j => j.id === editingJob.id ? updatedJob : j));
          setEditingJob(null);
          setNewJob({
            title: '',
            location: '',
            type: 'Full-time',
            status: 'Active',
            reporting: '',
            role: '',
            responsibilities: [],
            education_qualifications: '',
            preferred_qualifications: '',
            required_skills: [],
            candidate_profile: '',
            perks_and_benefits: '',
            performance_expectations: ''
          });
          alert('Job position updated successfully!');
        }
      } else {
        // Insert new job
        const now = new Date();
        const validThrough = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        const insertPayload = {
          ...payload,
          date_posted: now.toISOString().split('T')[0],
          valid_through: validThrough,
        };
        const { data, error } = await supabase.from('jobs').insert([insertPayload]).select();
        if (error) {
          if (error.message.includes('column') && error.message.includes('schema cache')) {
            alert(`Supabase Database Update Required:\nYour Supabase 'jobs' table needs the new columns.\n\nPlease run the SQL snippet in Supabase SQL Editor:\nALTER TABLE public.jobs\nADD COLUMN IF NOT EXISTS candidate_profile TEXT,\nADD COLUMN IF NOT EXISTS education_qualifications TEXT,\nADD COLUMN IF NOT EXISTS preferred_qualifications TEXT,\nADD COLUMN IF NOT EXISTS required_skills TEXT[],\nADD COLUMN IF NOT EXISTS perks_and_benefits TEXT,\nADD COLUMN IF NOT EXISTS performance_expectations TEXT;`);
          } else {
            alert(`Error adding job: ${error.message}`);
          }
        } else if (data) {
          setJobs([data[0], ...jobs]);
          setNewJob({
            title: '',
            location: '',
            type: 'Full-time',
            status: 'Active',
            reporting: '',
            role: '',
            responsibilities: [],
            education_qualifications: '',
            preferred_qualifications: '',
            required_skills: [],
            candidate_profile: '',
            perks_and_benefits: '',
            performance_expectations: ''
          });
          alert('Job position published successfully!');
        }
      }
    } catch (err: any) {
      alert('Error saving job position: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEditJob = (job: any) => {
    setEditingJob(job);
    setNewJob({
      title: job.title || '',
      location: job.location || '',
      type: job.type || 'Full-time',
      status: job.status || 'Active',
      reporting: job.reporting || '',
      role: job.role || '',
      responsibilities: Array.isArray(job.responsibilities)
        ? job.responsibilities
        : (typeof job.responsibilities === 'string' ? job.responsibilities.split('\n').filter(Boolean) : []),
      education_qualifications: job.education_qualifications || job.education || '',
      preferred_qualifications: job.preferred_qualifications || job.preferred || '',
      required_skills: Array.isArray(job.required_skills)
        ? job.required_skills
        : (typeof job.required_skills === 'string' ? job.required_skills.split('\n').filter(Boolean) : (Array.isArray(job.skills) ? job.skills : [])),
      candidate_profile: job.candidate_profile || job.profile || '',
      perks_and_benefits: job.perks_and_benefits || job.perks || job.benefits || '',
      performance_expectations: job.performance_expectations || job.expectations || ''
    });
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleCancelJobEdit = () => {
    setEditingJob(null);
    setNewJob({
      title: '',
      location: '',
      type: 'Full-time',
      status: 'Active',
      reporting: '',
      role: '',
      responsibilities: [],
      education_qualifications: '',
      preferred_qualifications: '',
      required_skills: [],
      candidate_profile: '',
      perks_and_benefits: '',
      performance_expectations: ''
    });
  };

  const handleToggleJobStatus = async (job: any) => {
    const newStatus = job.status === 'Active' ? 'Closed' : 'Active';
    setJobs(jobs.map(j => j.id === job.id ? { ...j, status: newStatus } : j));
    const { error } = await supabase.from('jobs').update({ status: newStatus }).eq('id', job.id);
    if (error) {
      alert(`Error updating job status: ${error.message}`);
      setJobs(jobs.map(j => j.id === job.id ? { ...j, status: job.status } : j));
    }
  };

  const handleDeleteJob = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this job position? This cannot be undone.')) return;
    await supabase.from('jobs').delete().eq('id', id);
    setJobs(jobs.filter(j => j.id !== id));
    if (editingJob && editingJob.id === id) {
      handleCancelJobEdit();
    }
  };

  const handleUpdateRoute = async (id: number, newDest: string) => {
    // Optimistic UI update
    setRoutes(routes.map(r => r.id === id ? { ...r, destination: newDest } : r));
    // Try to update DB
    const { error } = await supabase.from('email_routing').update({ destination: newDest }).eq('id', id);
    if (error) console.log("Routing table might not exist, but UI updated.");
  };

  // Theme & Modal States
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showUserDropup, setShowUserDropup] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Daily Webmaster Performance Report States
  const [sendingDailyReport, setSendingDailyReport] = useState(false);
  const [showReportPreviewModal, setShowReportPreviewModal] = useState(false);
  const [reportPreviewHtml, setReportPreviewHtml] = useState<string | null>(null);
  const [reportPreviewLoading, setReportPreviewLoading] = useState(false);
  const [reportToast, setReportToast] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const handleSendDailyReport = async () => {
    setSendingDailyReport(true);
    setReportToast(null);
    try {
      const activeToken = sessionToken || (typeof window !== 'undefined' ? sessionStorage.getItem('webmaster_session_token') : null);
      const res = await fetch('/api/webmaster/daily-report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(activeToken ? { 'Authorization': `Bearer ${activeToken}` } : {})
        }
      });
      const data = await res.json();
      if (data.success) {
        setReportToast({
          text: `Daily Performance & Operations Report successfully dispatched to ${data.recipient || 'webmaster@zawrindustries.com'}!`,
          type: 'success'
        });
      } else {
        setReportToast({
          text: data.error || 'Failed to dispatch daily report email.',
          type: 'error'
        });
      }
    } catch (err: any) {
      setReportToast({
        text: 'Network error triggering daily report dispatch.',
        type: 'error'
      });
    }
    setSendingDailyReport(false);
    setTimeout(() => setReportToast(null), 8000);
  };

  const handlePreviewDailyReport = async () => {
    setShowReportPreviewModal(true);
    setReportPreviewLoading(true);
    try {
      const activeToken = sessionToken || (typeof window !== 'undefined' ? sessionStorage.getItem('webmaster_session_token') : null);
      const res = await fetch('/api/webmaster/daily-report?format=html', {
        headers: {
          ...(activeToken ? { 'Authorization': `Bearer ${activeToken}` } : {})
        }
      });
      const htmlText = await res.text();
      setReportPreviewHtml(htmlText);
    } catch (err) {
      setReportPreviewHtml('<div style="padding: 2rem; color: #ef4444; font-family: sans-serif;">Failed to load live preview report.</div>');
    }
    setReportPreviewLoading(false);
  };

  const theme = isDarkMode ? {
    bg: '#000000',
    fg: '#ffffff',
    border: '#222222',
    hover: '#111111',
    inputBg: '#0a0a0a',
    muted: '#888888',
    sidebarBg: '#08080a',
  } : {
    bg: '#ffffff',
    fg: '#09090b',
    border: '#e4e4e7',
    hover: '#f4f4f5',
    inputBg: '#f8fafc',
    muted: '#64748b',
    sidebarBg: '#f1f5f9',
  };

  if (!isAuthenticated) {
    const handleStaffLogin = async (e: React.FormEvent) => {
      e.preventDefault();
      const activeKey = authKey || searchParams.get('authKey') || searchParams.get('key') || searchParams.get('profileToken') || '';
      const activeEmail = loginEmail || authProfile?.email || '';

      if (!loginPassword.trim()) {
        setStaffLoginError('Please enter your account password.');
        return;
      }

      setIsVerifying(true);
      setStaffLoginError('');
      try {
        const res = await fetch('/api/webmaster/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'login',
            email: activeEmail,
            authKey: activeKey,
            password: loginPassword
          })
        });
        const data = await res.json();
        if (data.success && data.token && data.user) {
          sessionStorage.setItem('webmaster_session_token', data.token);
          sessionStorage.setItem('webmaster_authorized', 'true');
          setSessionToken(data.token);
          setCurrentUser(data.user);
          setIsAuthenticated(true);
          setAuthorized(true);
          
          // Switch to first allowed tab if analytics is restricted
          if (!data.user.permissions.includes('*') && !data.user.permissions.includes('analytics')) {
            const firstAllowed = ALL_NAV_ITEMS.find(item => data.user.permissions.includes(item.id));
            if (firstAllowed) {
              setActiveTab(firstAllowed.id);
            }
          }
        } else {
          setStaffLoginError(data.error || 'Invalid credentials');
        }
      } catch (err) {
        setStaffLoginError('Unable to connect to authentication service.');
      }
      setIsVerifying(false);
    };

    const handleAccessKeySubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (!accessKey.trim()) return;
      fetchChallengeQuestion(accessKey);
    };

    const handleChallengeSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!challengeId) {
        alert('Challenge not loaded yet. Please wait.');
        return;
      }
      setIsVerifying(true);
      try {
        const res = await fetch('/api/webmaster', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'verify',
            accessKey: accessKey,
            questionId: challengeId,
            answer: userAnswer
          })
        });
        const data = await res.json();
        if (data.success) {
          try {
            sessionStorage.setItem('webmaster_logged_in', 'true');
            if (data.token) {
              sessionStorage.setItem('webmaster_session_token', data.token);
              setSessionToken(data.token);
            }
            if (accessKey) {
              sessionStorage.setItem('webmaster_master_key', accessKey);
            }
          } catch (err) {}
          setCurrentUser(data.user || {
            id: 'usr-master',
            name: 'Super Administrator',
            email: 'admin@zawrindustries.com',
            role: 'Super Administrator',
            permissions: ['*']
          });
          setIsAuthenticated(true);
          setAuthorized(true);
        } else {
          alert(data.error || 'Incorrect answer');
        }
      } catch (err) {
        alert('Verification failed.');
      }
      setIsVerifying(false);
    };

    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: theme.bg,
        color: theme.fg,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: 'inherit',
        padding: '1.5rem',
        margin: 0
      }}>
        <style dangerouslySetInnerHTML={{__html: `
          header, footer, .support-widget, .cookie-banner { display: none !important; }
          body { margin: 0; background-color: ${theme.bg}; overflow: auto !important; }
          .wm-login-input {
            width: 100%;
            padding: 0.75rem 0.9rem;
            background-color: ${theme.bg};
            border: 1px solid ${theme.border};
            color: ${theme.fg};
            outline: none;
            border-radius: 6px;
            font-size: 0.875rem;
            font-family: inherit;
            color-scheme: dark;
            transition: border-color 0.15s ease;
          }
          .wm-login-input:focus {
            border-color: ${theme.fg} !important;
          }
          .wm-login-input:-webkit-autofill,
          .wm-login-input:-webkit-autofill:hover, 
          .wm-login-input:-webkit-autofill:focus, 
          .wm-login-input:-webkit-autofill:active {
            -webkit-box-shadow: 0 0 0 1000px ${theme.bg} inset !important;
            -webkit-text-fill-color: ${theme.fg} !important;
            caret-color: ${theme.fg} !important;
            color-scheme: dark !important;
          }
          .wm-login-btn {
            width: 100%;
            padding: 0.85rem;
            background-color: ${theme.fg};
            color: ${theme.bg};
            border: none;
            font-weight: 700;
            cursor: pointer;
            border-radius: 6px;
            font-size: 0.875rem;
            font-family: inherit;
            transition: opacity 0.15s ease;
          }
          .wm-login-btn:hover {
            opacity: 0.9;
          }
        `}} />

        <div style={{
          width: '100%',
          maxWidth: '440px',
          border: `1px solid ${theme.border}`,
          borderRadius: '12px',
          backgroundColor: theme.inputBg,
          boxShadow: isDarkMode ? '0 20px 50px rgba(0, 0, 0, 0.85)' : '0 20px 40px rgba(0, 0, 0, 0.08)',
          overflow: 'hidden'
        }}>
          {/* Header */}
          <div style={{ padding: '2.5rem 2rem 1.5rem 2rem', textAlign: 'center', borderBottom: `1px solid ${theme.border}` }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.25rem' }}>
              <img
                src={isDarkMode ? "/assets/logo-white.png" : "/assets/logo-black.png"}
                alt="Zawr Industries"
                style={{ height: '42px', width: 'auto', objectFit: 'contain' }}
              />
            </div>

            <h1 style={{ fontSize: '1.35rem', fontWeight: 700, margin: '0 0 0.4rem 0', letterSpacing: '-0.02em', color: theme.fg }}>
              {(authProfile || urlAuthKey) ? 'Employee Workspace' : 'Webmaster Gateway'}
            </h1>
            <p style={{ fontSize: '0.82rem', color: theme.muted, margin: 0 }}>
              {(authProfile || urlAuthKey)
                ? (authProfile ? `Welcome, ${authProfile.name} • ${authProfile.role}` : 'Dedicated Profile Authentication')
                : 'Super Administrator Authentication • Salted PBKDF2 Vault'}
            </p>
          </div>

          <div style={{ padding: '2rem' }}>
            {/* ── VIEW A: DEDICATED EMPLOYEE WORKSPACE GATEWAY (FOR ?authKey=...) ── */}
            {(authProfile || urlAuthKey) ? (
              <form onSubmit={handleStaffLogin} suppressHydrationWarning style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {authProfile && (
                  <div style={{
                    padding: '0.9rem 1rem',
                    backgroundColor: theme.bg,
                    border: `1px solid ${theme.border}`,
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.85rem'
                  }}>
                    <div style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '50%',
                      backgroundColor: theme.hover,
                      color: theme.fg,
                      border: `1px solid ${theme.border}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                      fontSize: '0.95rem',
                      flexShrink: 0
                    }}>
                      {(authProfile.name?.[0] || 'U').toUpperCase()}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem', color: theme.fg, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {authProfile.name}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: theme.muted, marginTop: '0.1rem' }}>
                        {authProfile.role} • <span style={{ fontFamily: 'monospace' }}>{authProfile.email}</span>
                      </div>
                    </div>
                  </div>
                )}

                {staffLoginError && (
                  <div style={{
                    padding: '0.75rem 1rem',
                    backgroundColor: isDarkMode ? '#1f1315' : '#fee2e2',
                    border: isDarkMode ? '1px solid #4a1d24' : '1px solid #fca5a5',
                    borderRadius: '6px',
                    color: isDarkMode ? '#f87171' : '#dc2626',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                    <span>{staffLoginError}</span>
                  </div>
                )}

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', marginBottom: '0.45rem', color: theme.muted, fontWeight: 600 }}>
                    Assigned Account Password
                  </label>
                  <input
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="wm-login-input"
                    placeholder="Enter your assigned password"
                    required
                    autoFocus
                    disabled={isVerifying}
                    autoComplete="current-password"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isVerifying || !loginPassword.trim()}
                  className="wm-login-btn"
                  style={{
                    opacity: isVerifying || !loginPassword.trim() ? 0.6 : 1,
                    cursor: isVerifying || !loginPassword.trim() ? 'not-allowed' : 'pointer'
                  }}
                >
                  {isVerifying ? (
                    'Authenticating...'
                  ) : (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                      <span>Unlock Workspace</span>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="7" y1="17" x2="17" y2="7" /><polyline points="7 7 17 7 17 17" /></svg>
                    </span>
                  )}
                </button>
              </form>
            ) : (
              /* ── VIEW B: SUPERADMIN MASTER GATEWAY (FOR ?token=zawr-admin-gate) ── */
              loginStep === 'key' ? (
                <form onSubmit={handleAccessKeySubmit} suppressHydrationWarning style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <p style={{ fontSize: '0.82rem', color: theme.muted, margin: 0, lineHeight: 1.5 }}>
                    Enter the master access key for SuperAdmin system recovery and website management.
                  </p>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', marginBottom: '0.45rem', color: theme.muted, fontWeight: 600 }}>
                      Master Access Key
                    </label>
                    <input
                      type="password"
                      value={accessKey}
                      onChange={(e) => setAccessKey(e.target.value)}
                      className="wm-login-input"
                      placeholder="Enter master access key"
                      autoFocus
                      required
                      disabled={isVerifying}
                      autoComplete="new-password"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isVerifying || !accessKey.trim()}
                    className="wm-login-btn"
                    style={{
                      opacity: isVerifying || !accessKey.trim() ? 0.6 : 1,
                      cursor: isVerifying || !accessKey.trim() ? 'not-allowed' : 'pointer'
                    }}
                  >
                    {isVerifying ? (
                      'Verifying Key...'
                    ) : (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                        <span>Continue to Security Challenge</span>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="7" y1="17" x2="17" y2="7" /><polyline points="7 7 17 7 17 17" /></svg>
                      </span>
                    )}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleChallengeSubmit} suppressHydrationWarning style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div style={{
                    padding: '1rem 1.15rem',
                    backgroundColor: theme.bg,
                    border: `1px solid ${theme.border}`,
                    borderRadius: '8px',
                    lineHeight: 1.5
                  }}>
                    <div style={{
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      letterSpacing: '0.05em',
                      color: theme.muted,
                      textTransform: 'uppercase',
                      marginBottom: '0.4rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem'
                    }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                      <span>Master Security Challenge</span>
                    </div>
                    <div style={{ fontSize: '0.9rem', color: theme.fg, fontWeight: 600 }}>
                      {challengeQuestion || 'Loading security challenge...'}
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', marginBottom: '0.45rem', color: theme.muted, fontWeight: 600 }}>
                      Security Answer
                    </label>
                    <input
                      type="text"
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                      className="wm-login-input"
                      placeholder="Enter the secret answer"
                      autoFocus
                      required
                      disabled={isVerifying}
                    />
                  </div>

                  <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.25rem' }}>
                    <button
                      type="button"
                      onClick={() => setLoginStep('key')}
                      disabled={isVerifying}
                      style={{
                        padding: '0.85rem 1.25rem',
                        backgroundColor: 'transparent',
                        color: theme.fg,
                        border: `1px solid ${theme.border}`,
                        borderRadius: '6px',
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'opacity 0.15s ease'
                      }}
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={isVerifying || !userAnswer.trim()}
                      className="wm-login-btn"
                      style={{
                        flex: 1,
                        opacity: isVerifying || !userAnswer.trim() ? 0.6 : 1,
                        cursor: isVerifying || !userAnswer.trim() ? 'not-allowed' : 'pointer'
                      }}
                    >
                      {isVerifying ? (
                        'Authenticating...'
                      ) : (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                          <span>Unlock Master Console</span>
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="7" y1="17" x2="17" y2="7" /><polyline points="7 7 17 7 17 17" /></svg>
                        </span>
                      )}
                    </button>
                  </div>
                </form>
              )
            )}
          </div>

          {/* Footer Security Badge */}
          <div style={{
            padding: '0.85rem 1.5rem',
            backgroundColor: theme.bg,
            borderTop: `1px solid ${theme.border}`,
            textAlign: 'center',
            fontSize: '0.72rem',
            color: theme.muted,
            letterSpacing: '0.04em',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.45rem'
          }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            <span>256-BIT ENCRYPTED VAULT • PBKDF2 HMAC-SHA512</span>
          </div>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'analytics':
        return <AnalyticsDashboard theme={theme} />;
      
      case 'api-monitoring':
        return <ApiMonitoringDashboard theme={theme} />;
      
      case 'mail-credentials':
        return (
          <div>
            <h2 style={{ fontSize: '2rem', fontWeight: 600, marginBottom: '2rem', letterSpacing: '-0.02em' }}>Mail Server (Nodemailer)</h2>
            <div style={{ maxWidth: '600px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', color: theme.muted }}>SMTP Server</label>
                <input type="text" defaultValue="smtp.gmail.com" disabled style={{ width: '100%', padding: '0.75rem', backgroundColor: theme.inputBg, border: `1px solid ${theme.border}`, color: theme.muted, borderRadius: '4px' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', color: theme.muted }}>System Email User (.env)</label>
                <input type="email" defaultValue="noreply@zawrindustries.com" disabled style={{ width: '100%', padding: '0.75rem', backgroundColor: theme.inputBg, border: `1px solid ${theme.border}`, color: theme.muted, borderRadius: '4px' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', color: theme.muted }}>App Password (.env)</label>
                <input type="password" defaultValue="****************" disabled style={{ width: '100%', padding: '0.75rem', backgroundColor: theme.inputBg, border: `1px solid ${theme.border}`, color: theme.muted, borderRadius: '4px' }} />
              </div>
              <p style={{ fontSize: '0.875rem', color: theme.muted }}>These values are securely loaded from your <code>.env.local</code> file and managed directly on your server/hosting platform.</p>
            </div>
          </div>
        );

      case 'email-routing':
        return (
          <div>
            <h2 style={{ fontSize: '2rem', fontWeight: 600, marginBottom: '2rem', letterSpacing: '-0.02em' }}>Live Email Routing</h2>
            <div className="wm-table-wrapper" style={{ border: `1px solid ${theme.border}`, borderRadius: '8px', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: `1px solid ${theme.border}`, backgroundColor: theme.inputBg }}>
                    <th style={{ padding: '1rem', color: theme.muted, fontWeight: 500 }}>Source / Form</th>
                    <th style={{ padding: '1rem', color: theme.muted, fontWeight: 500 }}>Destination Address</th>
                    <th style={{ padding: '1rem', color: theme.muted, fontWeight: 500 }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {routes.map((route) => (
                    <tr key={route.id} style={{ borderBottom: `1px solid ${theme.border}` }}>
                      <td style={{ padding: '1rem', whiteSpace: 'nowrap' }}>{route.source}</td>
                      <td style={{ padding: '1rem' }}>
                        <input 
                          type="text" 
                          value={route.destination} 
                          onChange={(e) => setRoutes(routes.map(r => r.id === route.id ? { ...r, destination: e.target.value } : r))}
                          style={{ width: '100%', minWidth: '180px', padding: '0.5rem', backgroundColor: 'transparent', border: 'none', color: theme.fg, borderBottom: `1px dashed ${theme.border}`, outline: 'none' }} 
                        />
                      </td>
                      <td style={{ padding: '1rem', whiteSpace: 'nowrap' }}>
                        <button onClick={() => handleUpdateRoute(route.id, route.destination)} style={{ padding: '0.25rem 0.75rem', backgroundColor: 'transparent', color: theme.fg, border: `1px solid ${theme.border}`, borderRadius: '4px', cursor: 'pointer', fontSize: '0.75rem' }}>Sync</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'jobs':
        return (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '2rem', fontWeight: 600, margin: 0, letterSpacing: '-0.02em' }}>Manage Careers (Realtime)</h2>
              {editingJob && (
                <button
                  type="button"
                  onClick={handleCancelJobEdit}
                  style={{ padding: '0.5rem 1rem', backgroundColor: 'transparent', color: '#ff6666', border: '1px solid #ff6666', borderRadius: '4px', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 600 }}
                >
                  ✕ Cancel Edit Mode
                </button>
              )}
            </div>
            
            {errorMsg && <div style={{ padding: '1rem', backgroundColor: isDarkMode ? '#3f0000' : '#fee2e2', color: isDarkMode ? '#ffaaaa' : '#dc2626', border: isDarkMode ? '1px solid #7f1d1d' : '1px solid #fca5a5', borderRadius: '8px', marginBottom: '2rem' }}>{errorMsg}</div>}

            <form onSubmit={handleSaveJob} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '3rem', padding: '1.75rem', border: `1px solid ${editingJob ? '#3b82f6' : theme.border}`, borderRadius: '8px', backgroundColor: theme.inputBg, transition: 'border-color 0.2s' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 600, margin: 0, color: editingJob ? '#60a5fa' : theme.fg }}>
                  {editingJob ? `✏️ Edit Job: ${editingJob.title} (ID: #${editingJob.id})` : '+ Post New Job'}
                </h3>
                {editingJob && (
                  <span style={{ fontSize: '0.75rem', padding: '0.2rem 0.6rem', backgroundColor: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa', border: '1px solid #3b82f6', borderRadius: '9999px', fontWeight: 600 }}>
                    Editing Live
                  </span>
                )}
              </div>
              
              <div className="wm-grid-2col" style={{ display: 'grid', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', color: theme.muted }}>Job Title *</label>
                  <input type="text" required value={newJob.title} onChange={e => setNewJob({...newJob, title: e.target.value})} placeholder="e.g. Senior AI Systems Engineer" style={{ width: '100%', padding: '0.75rem', backgroundColor: 'transparent', border: `1px solid ${theme.border}`, color: theme.fg, borderRadius: '4px' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', color: theme.muted }}>Location *</label>
                  <input type="text" required value={newJob.location} onChange={e => setNewJob({...newJob, location: e.target.value})} placeholder="e.g. Bengaluru / Hybrid / Remote" style={{ width: '100%', padding: '0.75rem', backgroundColor: 'transparent', border: `1px solid ${theme.border}`, color: theme.fg, borderRadius: '4px' }} />
                </div>
              </div>

              <div className="wm-grid-3col" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', color: theme.muted }}>Employment Type *</label>
                  <select value={newJob.type} onChange={e => setNewJob({...newJob, type: e.target.value})} style={{ width: '100%', padding: '0.75rem', backgroundColor: theme.bg, border: `1px solid ${theme.border}`, color: theme.fg, borderRadius: '4px' }}>
                    <option value="Full-time">Full-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Internship">Internship</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Freelance">Freelance</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', color: theme.muted }}>Status *</label>
                  <select value={newJob.status} onChange={e => setNewJob({...newJob, status: e.target.value})} style={{ width: '100%', padding: '0.75rem', backgroundColor: theme.bg, border: `1px solid ${theme.border}`, color: theme.fg, borderRadius: '4px' }}>
                    <option value="Active">Active (Accepting Applications)</option>
                    <option value="Closed">Closed (Archived)</option>
                    <option value="Draft">Draft (Hidden)</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', color: theme.muted }}>Reporting To</label>
                  <input type="text" value={newJob.reporting || ''} onChange={e => setNewJob({...newJob, reporting: e.target.value})} placeholder="e.g. VP of Engineering / CEO" style={{ width: '100%', padding: '0.75rem', backgroundColor: 'transparent', border: `1px solid ${theme.border}`, color: theme.fg, borderRadius: '4px' }} />
                </div>
              </div>

              {/* 1. Role Overview */}
              <RichTextEditor
                label="1. Role Overview *"
                required
                value={newJob.role || ''}
                onChange={(val) => setNewJob({ ...newJob, role: val })}
                rows={3}
                placeholder="Detailed description of the role, team context, and strategic mission..."
                theme={theme}
              />

              {/* 2. Key Responsibilities */}
              <RichTextEditor
                label="2. Key Responsibilities *"
                required
                value={(newJob.responsibilities || []).join('\n')}
                onChange={(val) => setNewJob({ ...newJob, responsibilities: val.split('\n').filter(r => r.trim() !== '') })}
                rows={5}
                placeholder="- Define strategy and architectural vision...&#10;- Write clean, robust, and tested code...&#10;- Lead sprint planning and mentor team members..."
                theme={theme}
              />

              {/* 3. Candidate Profile */}
              <RichTextEditor
                label="3. Candidate Profile"
                value={newJob.candidate_profile || ''}
                onChange={(val) => setNewJob({ ...newJob, candidate_profile: val })}
                rows={3}
                placeholder="Describe the ideal candidate's mindset, background, problem-solving approach, and work ethics..."
                theme={theme}
              />

              {/* 4. Required Skills & Competencies */}
              <RichTextEditor
                label="4. Required Skills & Competencies"
                value={Array.isArray(newJob.required_skills) ? newJob.required_skills.join('\n') : (newJob.required_skills || '')}
                onChange={(val) => setNewJob({ ...newJob, required_skills: val.split('\n').filter(s => s.trim() !== '') })}
                rows={4}
                placeholder="- 4+ years hands-on experience in Next.js, React, and TypeScript&#10;- Strong knowledge of distributed cloud architectures and API systems&#10;- Experience with PostgreSQL / Supabase and real-time state synchronization"
                theme={theme}
              />

              {/* 5. Education Qualifications */}
              <RichTextEditor
                label="5. Education Qualifications"
                value={newJob.education_qualifications || ''}
                onChange={(val) => setNewJob({ ...newJob, education_qualifications: val })}
                rows={2}
                placeholder="e.g. Bachelor's / Master's degree in Computer Science, Engineering, Mathematics, or equivalent practical experience..."
                theme={theme}
              />

              {/* 6. Preferred Qualifications */}
              <RichTextEditor
                label="6. Preferred Qualifications"
                value={newJob.preferred_qualifications || ''}
                onChange={(val) => setNewJob({ ...newJob, preferred_qualifications: val })}
                rows={3}
                placeholder="- Prior experience in high-growth technology startups or multi-tenant SaaS products&#10;- Contributions to open-source software or published research..."
                theme={theme}
              />

              {/* 7. Performance Expectations */}
              <RichTextEditor
                label="7. Performance Expectations (30 / 60 / 90 Days)"
                value={newJob.performance_expectations || ''}
                onChange={(val) => setNewJob({ ...newJob, performance_expectations: val })}
                rows={3}
                placeholder="Outline what success looks like in this role during the first 30, 60, and 90 days of onboarding..."
                theme={theme}
              />

              {/* 8. Perks & Benefits */}
              <RichTextEditor
                label="8. Perks & Benefits"
                value={newJob.perks_and_benefits || ''}
                onChange={(val) => setNewJob({ ...newJob, perks_and_benefits: val })}
                rows={3}
                placeholder="- Competitive compensation and performance bonuses&#10;- Comprehensive health & wellness coverage&#10;- Flexible hybrid/remote work schedule & latest workstation hardware"
                theme={theme}
              />

              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginTop: '0.5rem' }}>
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    padding: '0.85rem 1.75rem',
                    backgroundColor: editingJob ? '#2563eb' : theme.fg,
                    color: editingJob ? '#ffffff' : theme.bg,
                    border: 'none',
                    fontWeight: 600,
                    borderRadius: '4px',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    opacity: loading ? 0.7 : 1,
                    transition: 'all 0.2s'
                  }}
                >
                  {loading ? 'Saving...' : editingJob ? '💾 Save Changes' : '+ Publish Job'}
                </button>

                {editingJob && (
                  <button
                    type="button"
                    onClick={handleCancelJobEdit}
                    style={{
                      padding: '0.85rem 1.5rem',
                      backgroundColor: 'transparent',
                      color: theme.fg,
                      border: `1px solid ${theme.border}`,
                      fontWeight: 500,
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
            
            {loading && jobs.length === 0 ? <div style={{ color: theme.muted }}>Syncing with Supabase...</div> : (
              <div style={{ border: `1px solid ${theme.border}`, borderRadius: '8px', overflow: 'hidden' }}>
                <div style={{ padding: '1rem 1.25rem', backgroundColor: theme.inputBg, borderBottom: `1px solid ${theme.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 600, margin: 0 }}>Active & Posted Jobs ({jobs.length})</h3>
                  <span style={{ fontSize: '0.8rem', color: theme.muted }}>Click "Edit" to modify any position</span>
                </div>
                {jobs.length === 0 ? (
                  <div style={{ padding: '2rem', textAlign: 'center', color: theme.muted }}>No jobs found or table missing.</div>
                ) : jobs.map((job) => (
                  <div
                    key={job.id}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: '0.75rem',
                      padding: '1.25rem',
                      borderBottom: `1px solid ${theme.border}`,
                      backgroundColor: editingJob?.id === job.id ? (isDarkMode ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.05)') : theme.bg,
                      transition: 'background-color 0.2s'
                    }}
                  >
                    <div style={{ flex: '1 1 300px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                        <span style={{ fontWeight: 600, fontSize: '1rem' }}>{job.title}</span>
                        {editingJob?.id === job.id && (
                          <span style={{ fontSize: '0.7rem', padding: '0.1rem 0.4rem', backgroundColor: '#3b82f6', color: '#fff', borderRadius: '4px', fontWeight: 600 }}>Currently Editing</span>
                        )}
                      </div>
                      <div style={{ fontSize: '0.875rem', color: theme.muted }}>
                        {job.location} • {job.type} • Reporting to: {job.reporting || 'N/A'}
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      {/* Clickable Status Toggle */}
                      <button
                        type="button"
                        onClick={() => handleToggleJobStatus(job)}
                        title="Click to toggle Active / Closed status"
                        style={{
                          fontSize: '0.75rem',
                          padding: '0.3rem 0.65rem',
                          border: `1px solid ${job.status === 'Active' ? '#10b981' : theme.muted}`,
                          borderRadius: '4px',
                          backgroundColor: job.status === 'Active' ? 'rgba(16, 185, 129, 0.1)' : 'transparent',
                          color: job.status === 'Active' ? '#10b981' : theme.muted,
                          cursor: 'pointer',
                          fontWeight: 600,
                          transition: 'all 0.2s'
                        }}
                      >
                        {job.status || 'Active'}
                      </button>

                      {/* Edit Button */}
                      <button
                        type="button"
                        onClick={() => handleEditJob(job)}
                        style={{
                          padding: '0.35rem 0.85rem',
                          backgroundColor: editingJob?.id === job.id ? theme.fg : 'transparent',
                          color: editingJob?.id === job.id ? theme.bg : theme.fg,
                          border: `1px solid ${theme.border}`,
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '0.8125rem',
                          fontWeight: 600,
                          transition: 'all 0.2s'
                        }}
                      >
                        {editingJob?.id === job.id ? 'Editing...' : 'Edit'}
                      </button>

                      {/* Delete Button */}
                      <button
                        type="button"
                        onClick={() => handleDeleteJob(job.id)}
                        style={{
                          padding: '0.35rem 0.65rem',
                          background: 'none',
                          border: 'none',
                          color: '#ff4444',
                          cursor: 'pointer',
                          fontSize: '0.8125rem',
                          fontWeight: 500,
                          transition: 'color 0.2s'
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case 'newsletters':
        return (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '2rem', fontWeight: 600, letterSpacing: '-0.02em', margin: 0 }}>Newsletter Subscribers</h2>
              <button style={{ padding: '0.5rem 1.5rem', backgroundColor: theme.fg, color: theme.bg, border: 'none', fontWeight: 600, borderRadius: '4px', cursor: 'pointer' }}>Export CSV</button>
            </div>
            {errorMsg && <div style={{ padding: '1rem', backgroundColor: isDarkMode ? '#3f0000' : '#fee2e2', color: isDarkMode ? '#ffaaaa' : '#dc2626', border: isDarkMode ? '1px solid #7f1d1d' : '1px solid #fca5a5', borderRadius: '8px', marginBottom: '2rem' }}>{errorMsg}</div>}
            
            {loading ? <div style={{ color: theme.muted }}>Loading from Supabase...</div> : (
              <div className="wm-table-wrapper" style={{ border: `1px solid ${theme.border}`, borderRadius: '8px', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ borderBottom: `1px solid ${theme.border}`, backgroundColor: theme.inputBg }}>
                      <th style={{ padding: '1rem', color: theme.muted, fontWeight: 500 }}>Email Address</th>
                      <th style={{ padding: '1rem', color: theme.muted, fontWeight: 500 }}>Date Subscribed</th>
                      <th style={{ padding: '1rem', color: theme.muted, fontWeight: 500 }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subscribers.length === 0 ? (
                      <tr><td colSpan={3} style={{ padding: '2rem', textAlign: 'center', color: theme.muted }}>No subscribers found.</td></tr>
                    ) : subscribers.map((sub) => (
                      <tr key={sub.id} style={{ borderBottom: `1px solid ${theme.border}` }}>
                        <td style={{ padding: '1rem' }}>{sub.email}</td>
                        <td style={{ padding: '1rem', color: theme.muted }}>{new Date(sub.created_at).toLocaleDateString()}</td>
                        <td style={{ padding: '1rem' }}>
                          <span style={{ color: sub.status === 'Active' ? '#ffffff' : theme.muted }}>{sub.status || 'Active'}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        );
      case 'pitch-deck':
        return (
          <div>
            <h2 style={{ fontSize: '2rem', fontWeight: 600, marginBottom: '2rem', letterSpacing: '-0.02em' }}>Upload Pitch Deck</h2>
            <div style={{ padding: '2rem', border: `1px solid ${theme.border}`, borderRadius: '8px', backgroundColor: theme.inputBg }}>
              <p style={{ color: theme.muted, marginBottom: '1.5rem' }}>Upload a PDF of your Pitch Deck. It will instantly replace the placeholder slides on the Investors page.</p>
              
              <input 
                type="file" 
                accept="application/pdf"
                id="pitchDeckUpload"
                style={{ display: 'none' }}
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  setLoading(true);
                  const formData = new FormData();
                  formData.append('file', file);
                  
                  try {
                    const res = await fetch('/api/upload-pitch-deck', { method: 'POST', body: formData });
                    if (res.ok) {
                      localStorage.setItem('zawr_pitch_deck_uploaded', 'true');
                      alert('Pitch Deck uploaded successfully!');
                    } else {
                      alert('Failed to upload. Ensure server allows file writing.');
                    }
                  } catch (err) {
                    alert('Error uploading pitch deck.');
                  }
                  setLoading(false);
                }}
              />
              
              <button 
                onClick={() => document.getElementById('pitchDeckUpload')?.click()}
                disabled={loading}
                style={{ padding: '0.75rem 1.5rem', backgroundColor: theme.fg, color: theme.bg, border: 'none', fontWeight: 600, borderRadius: '4px', cursor: 'pointer' }}
              >
                {loading ? 'Uploading...' : 'Select PDF File'}
              </button>
            </div>
          </div>
        );
      
      case 'financial-reports':
        return (
          <div>
            <h2 style={{ fontSize: '2rem', fontWeight: 600, marginBottom: '2rem', letterSpacing: '-0.02em' }}>Financial Reports</h2>
            
            {/* Add / Edit Form */}
            <div style={{ padding: '2rem', border: `1px solid ${theme.border}`, borderRadius: '8px', backgroundColor: theme.inputBg, marginBottom: '3rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem' }}>{editingReport ? 'Edit Report' : 'Add New Report'}</h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '500px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', color: theme.muted }}>Report Title (e.g. FY 2026)</label>
                  <input 
                    type="text" 
                    value={reportTitle} 
                    onChange={(e) => setReportTitle(e.target.value)} 
                    style={{ width: '100%', padding: '0.75rem', backgroundColor: theme.bg, border: `1px solid ${theme.border}`, color: theme.fg, outline: 'none', borderRadius: '4px' }} 
                    placeholder="Enter report title"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', color: theme.muted }}>Category</label>
                  <select 
                    value={reportCategory}
                    onChange={(e) => setReportCategory(e.target.value)}
                    style={{ width: '100%', padding: '0.75rem', backgroundColor: theme.bg, border: `1px solid ${theme.border}`, color: theme.fg, outline: 'none', borderRadius: '4px' }}
                  >
                    <option value="Annual Reports">Annual Reports</option>
                    <option value="Quarterly Results">Quarterly Results</option>
                    <option value="Financial Presentations">Financial Presentations</option>
                    <option value="CSR Reports">CSR Reports</option>
                    <option value="10 Year Financial Highlights">10 Year Financial Highlights</option>
                    <option value="Other Investor Presentations">Other Investor Presentations</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', color: theme.muted }}>Fiscal Year</label>
                  <select 
                    value={reportYear}
                    onChange={(e) => setReportYear(e.target.value)}
                    style={{ width: '100%', padding: '0.75rem', backgroundColor: theme.bg, border: `1px solid ${theme.border}`, color: theme.fg, outline: 'none', borderRadius: '4px' }}
                  >
                    <option value="2026-2027">2026-2027</option>
                    <option value="2025-2026">2025-2026</option>
                    <option value="2024-2025">2024-2025</option>
                    <option value="2023-2024">2023-2024</option>
                    <option value="2022-2023">2022-2023</option>
                    <option value="2021-2022">2021-2022</option>
                    <option value="2020-2021">2020-2021</option>
                    <option value="2019-2020">2019-2020</option>
                    <option value="2018-2019">2018-2019</option>
                    <option value="2017-2018">2017-2018</option>
                    <option value="2016-2017">2016-2017</option>
                    <option value="2015-2016">2015-2016</option>
                  </select>
                </div>
                
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', color: theme.muted }}>PDF File</label>
                  <input 
                    type="file" 
                    accept="application/pdf"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        (window as any)._selectedReportFile = file;
                      }
                    }}
                    style={{ color: theme.fg }}
                  />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', userSelect: 'none' }}>
                    <input 
                      type="checkbox"
                      checked={reportIsArchived}
                      onChange={(e) => setReportIsArchived(e.target.checked)}
                      style={{ width: '16px', height: '16px', accentColor: theme.fg }}
                    />
                    <span style={{ fontSize: '0.875rem', color: theme.fg }}>Mark as Archived (Offline Database Alert)</span>
                  </label>
                </div>

                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                  <button 
                    onClick={async () => {
                      if (!reportTitle.trim()) {
                        alert('Please enter a title');
                        return;
                      }
                      setLoading(true);

                      let pdfUrl = editingReport ? editingReport.pdfUrl : '';
                      const file = (window as any)._selectedReportFile;
                      
                      if (file) {
                        try {
                          const fileName = `reports/report-${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
                          const { data, error } = await supabase.storage
                            .from('zawr-media')
                            .upload(fileName, file, { cacheControl: '3600', upsert: true });
                          
                          if (error) {
                            alert('Supabase Storage Upload Error: ' + error.message);
                            setLoading(false);
                            return;
                          }
                          const { data: { publicUrl } } = supabase.storage.from('zawr-media').getPublicUrl(fileName);
                          pdfUrl = publicUrl;
                        } catch (err: any) {
                          alert('Error uploading to Supabase Storage: ' + err.message);
                          setLoading(false);
                          return;
                        }
                      }

                      const formData = new FormData();
                      formData.append('action', editingReport ? 'update' : 'add');
                      formData.append('title', reportTitle);
                      formData.append('pdfUrl', pdfUrl);
                      formData.append('category', reportCategory);
                      formData.append('year', reportYear);
                      formData.append('isArchived', String(reportIsArchived));
                      if (editingReport) {
                        formData.append('id', editingReport.id);
                      }

                      try {
                        const res = await fetch('/api/financial-reports', {
                          method: 'POST',
                          body: formData
                        });
                        if (res.ok) {
                          const data = await res.json();
                          setReports(data.reports || []);
                          setReportTitle('');
                          setReportCategory('Annual Reports');
                          setReportYear('2025-2026');
                          setReportIsArchived(false);
                          setEditingReport(null);
                          (window as any)._selectedReportFile = null;
                          alert(editingReport ? 'Report updated successfully!' : 'Report added successfully!');
                        } else {
                          alert('Failed to save report.');
                        }
                      } catch (err) {
                        alert('Error saving report.');
                      }
                      setLoading(false);
                    }}
                    disabled={loading}
                    style={{ padding: '0.75rem 1.5rem', backgroundColor: theme.fg, color: theme.bg, border: 'none', fontWeight: 600, borderRadius: '4px', cursor: 'pointer' }}
                  >
                    {loading ? 'Saving...' : editingReport ? 'Update Report' : 'Add Report'}
                  </button>
                  
                  {editingReport && (
                    <button 
                      onClick={() => {
                        setEditingReport(null);
                        setReportTitle('');
                        setReportCategory('Annual Reports');
                        setReportYear('2025-2026');
                        setReportIsArchived(false);
                        (window as any)._selectedReportFile = null;
                      }}
                      style={{ padding: '0.75rem 1.5rem', backgroundColor: 'transparent', color: theme.fg, border: `1px solid ${theme.border}`, borderRadius: '4px', cursor: 'pointer' }}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* List of Reports */}
            <div style={{ padding: '2rem', border: `1px solid ${theme.border}`, borderRadius: '8px', backgroundColor: theme.inputBg }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 600, margin: 0 }}>Financial Reports Database Explorer</h3>
                <span style={{ fontSize: '0.85rem', color: theme.muted }}>Viewing all managed report slots and placeholders</span>
              </div>
              
              {/* Category Filter Tabs inside Webmaster Panel */}
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', overflowX: 'auto', paddingBottom: '0.5rem', borderBottom: `1px solid ${theme.border}` }}>
                {[
                  'Annual Reports',
                  'Quarterly Results',
                  'Financial Presentations',
                  'CSR Reports',
                  '10 Year Financial Highlights',
                  'Other Investor Presentations'
                ].map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedTableCategory(cat)}
                    style={{
                      padding: '0.6rem 1.2rem',
                      borderRadius: '4px',
                      backgroundColor: selectedTableCategory === cat ? theme.fg : 'transparent',
                      color: selectedTableCategory === cat ? theme.bg : theme.muted,
                      border: `1px solid ${selectedTableCategory === cat ? theme.fg : theme.border}`,
                      cursor: 'pointer',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      transition: 'all 0.2s',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              
              <div className="wm-table-wrapper">
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ borderBottom: `1px solid ${theme.border}` }}>
                      <th style={{ padding: '1rem', color: theme.muted, fontWeight: 500 }}>Title</th>
                      <th style={{ padding: '1rem', color: theme.muted, fontWeight: 500 }}>Category</th>
                      <th style={{ padding: '1rem', color: theme.muted, fontWeight: 500 }}>Year</th>
                      <th style={{ padding: '1rem', color: theme.muted, fontWeight: 500 }}>PDF URL Status</th>
                      <th style={{ padding: '1rem', color: theme.muted, fontWeight: 500, textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getMappedReportsForWebmaster().map((rep) => (
                      <tr key={rep.id} style={{ borderBottom: `1px solid ${theme.border}`, opacity: rep.isUserUploaded ? 1 : 0.65 }}>
                        <td style={{ padding: '1rem', fontWeight: 500 }}>{rep.title}</td>
                        <td style={{ padding: '1rem', color: '#fff' }}>{rep.category}</td>
                        <td style={{ padding: '1rem', color: '#fff' }}>{rep.year}</td>
                        <td style={{ padding: '1rem', color: theme.muted, fontSize: '0.875rem' }}>
                          {rep.isUserUploaded ? (
                            rep.isArchived ? (
                              <span style={{ color: '#ffaaaa', backgroundColor: '#3a0c0c', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600 }}>Archived Offline</span>
                            ) : (
                              <a href={rep.pdfUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#aaaaff', textDecoration: 'underline' }}>
                                {rep.pdfUrl.length > 50 ? `${rep.pdfUrl.substring(0, 50)}...` : rep.pdfUrl}
                              </a>
                            )
                          ) : (
                            <span style={{ color: '#f59e0b', fontSize: '0.78rem' }}>Default Placeholder</span>
                          )}
                        </td>
                        <td style={{ padding: '1rem', textAlign: 'right', whiteSpace: 'nowrap' }}>
                          {rep.isUserUploaded ? (
                            <>
                              <button 
                                onClick={() => {
                                  setEditingReport(rep);
                                  setReportTitle(rep.title);
                                  setReportCategory(rep.category);
                                  setReportYear(rep.year);
                                  setReportIsArchived(!!rep.isArchived);
                                  window.scrollTo({ top: 0, behavior: 'smooth' });
                                }}
                                style={{ padding: '0.5rem 1rem', backgroundColor: 'transparent', color: theme.fg, border: `1px solid ${theme.border}`, borderRadius: '4px', cursor: 'pointer', marginRight: '0.5rem', fontSize: '0.875rem' }}
                              >
                                Edit
                              </button>
                              <button 
                                onClick={async () => {
                                  if (!window.confirm(`Are you sure you want to delete "${rep.title}"?`)) return;
                                  setLoading(true);
                                  const formData = new FormData();
                                  formData.append('action', 'delete');
                                  formData.append('id', rep.id);
                                  try {
                                    const res = await fetch('/api/financial-reports', { method: 'POST', body: formData });
                                    if (res.ok) {
                                      const data = await res.json();
                                      setReports(data.reports || []);
                                    } else {
                                      alert('Failed to delete report.');
                                    }
                                  } catch (err) {
                                    alert('Error deleting report.');
                                  }
                                  setLoading(false);
                                }}
                                style={{ padding: '0.5rem 1rem', backgroundColor: '#3f0000', color: '#ffaaaa', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.875rem' }}
                              >
                                Delete
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={() => {
                                setEditingReport(null);
                                setReportTitle(rep.title);
                                setReportCategory(rep.category);
                                setReportYear(rep.year);
                                setReportIsArchived(false);
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                                setTimeout(() => {
                                  alert(`Ready to upload! Choose a PDF file above for "${rep.title}" (${rep.year}) and click "Add Report".`);
                                }, 300);
                              }}
                              style={{ padding: '0.5rem 1rem', backgroundColor: '#ffffff', color: '#000000', border: 'none', borderRadius: '4px', fontWeight: 600, cursor: 'pointer', fontSize: '0.875rem' }}
                            >
                              Upload PDF File
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case 'events':
        return (
          <div>
            <h2 style={{ fontSize: '2rem', fontWeight: 600, marginBottom: '2rem', letterSpacing: '-0.02em' }}>Manage Events</h2>
            
            {/* Add / Edit Form */}
            <div style={{ padding: '2rem', border: `1px solid ${theme.border}`, borderRadius: '8px', backgroundColor: theme.inputBg, marginBottom: '3rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem' }}>{editingEvent ? 'Edit Event' : 'Add New Event'}</h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '600px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', color: theme.muted }}>Event Title</label>
                  <input 
                    type="text" 
                    value={eventTitle} 
                    onChange={(e) => setEventTitle(e.target.value)} 
                    style={{ width: '100%', padding: '0.75rem', backgroundColor: theme.bg, border: `1px solid ${theme.border}`, color: theme.fg, outline: 'none', borderRadius: '4px' }} 
                    placeholder="e.g. AGM, IT Services Launch"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', color: theme.muted }}>Event Subtitle</label>
                  <input 
                    type="text" 
                    value={eventSubtitle} 
                    onChange={(e) => setEventSubtitle(e.target.value)} 
                    style={{ width: '100%', padding: '0.75rem', backgroundColor: theme.bg, border: `1px solid ${theme.border}`, color: theme.fg, outline: 'none', borderRadius: '4px' }} 
                    placeholder="e.g. Zawr Industries website launch event"
                  />
                </div>

                <RichTextEditor
                  label="Event Description"
                  value={eventDesc}
                  onChange={(val) => setEventDesc(val)}
                  rows={4}
                  placeholder="Comprehensive event details, keynote speakers, and session breakdown..."
                  theme={theme}
                />

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', color: theme.muted }}>Tickets Booked</label>
                    <input 
                      type="text" 
                      value={eventTicketsBooked} 
                      onChange={(e) => setEventTicketsBooked(e.target.value)} 
                      style={{ width: '100%', padding: '0.75rem', backgroundColor: theme.bg, border: `1px solid ${theme.border}`, color: theme.fg, outline: 'none', borderRadius: '4px' }} 
                      placeholder="e.g. 150"
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', color: theme.muted }}>Total Tickets Capacity</label>
                    <input 
                      type="text" 
                      value={eventTicketsCapacity} 
                      onChange={(e) => setEventTicketsCapacity(e.target.value)} 
                      style={{ width: '100%', padding: '0.75rem', backgroundColor: theme.bg, border: `1px solid ${theme.border}`, color: theme.fg, outline: 'none', borderRadius: '4px' }} 
                      placeholder="e.g. 200"
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', color: theme.muted }}>Venue / Location</label>
                  <input 
                    type="text" 
                    value={eventVenue} 
                    onChange={(e) => setEventVenue(e.target.value)} 
                    style={{ width: '100%', padding: '0.75rem', backgroundColor: theme.bg, border: `1px solid ${theme.border}`, color: theme.fg, outline: 'none', borderRadius: '4px' }} 
                    placeholder="e.g. Online • Bangalore"
                  />
                </div>

                <RichTextEditor
                  label="Special Note / Terms"
                  value={eventSpecialNote}
                  onChange={(val) => setEventSpecialNote(val)}
                  rows={3}
                  placeholder="Detailed terms, ticketing rules, or special attendee instructions..."
                  theme={theme}
                />

                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', color: theme.muted }}>Card Thumbnail Image / Banner</label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0] || null;
                        setCustomImageFile(file);
                      }}
                      style={{ color: theme.fg }}
                    />
                    {customImageFile && (
                      <div style={{ fontSize: '0.75rem', color: '#10b981' }}>
                        Selected Custom Photo: <strong>{customImageFile.name}</strong> (Will upload to Supabase CDN)
                      </div>
                    )}
                    {!customImageFile && (
                      <div>
                        <span style={{ fontSize: '0.75rem', color: theme.muted, display: 'block', marginBottom: '0.25rem' }}>Or use standard preset:</span>
                        <select 
                          value={eventImage} 
                          onChange={(e) => setEventImage(e.target.value)} 
                          style={{ width: '100%', padding: '0.75rem', backgroundColor: theme.bg, border: `1px solid ${theme.border}`, color: theme.fg, outline: 'none', borderRadius: '4px' }}
                        >
                          <option value="https://res.cloudinary.com/murfclni/image/upload/f_avif,q_auto:eco,w_1200,c_limit/v1783710478/zawr/assets/event-chart.png">Stock Chart Gradient</option>
                          <option value="https://res.cloudinary.com/murfclni/image/upload/f_avif,q_auto:eco,w_1200,c_limit/v1783710480/zawr/assets/event-speaker.png">Keynote Stage Presenter</option>
                        </select>
                      </div>
                    )}
                  </div>
                </div>

                <div className="wm-grid-2col" style={{ display: 'grid', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', color: theme.muted }}>Start Date</label>
                    <input 
                      type="date" 
                      value={eventStartDate} 
                      onChange={(e) => setEventStartDate(e.target.value)} 
                      style={{ width: '100%', padding: '0.75rem', backgroundColor: theme.bg, border: `1px solid ${theme.border}`, color: theme.fg, outline: 'none', borderRadius: '4px', colorScheme: isDarkMode ? 'dark' : 'light' }} 
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', color: theme.muted }}>End Date (Leave blank for single date)</label>
                    <input 
                      type="date" 
                      value={eventEndDate} 
                      onChange={(e) => setEventEndDate(e.target.value)} 
                      style={{ width: '100%', padding: '0.75rem', backgroundColor: theme.bg, border: `1px solid ${theme.border}`, color: theme.fg, outline: 'none', borderRadius: '4px', colorScheme: isDarkMode ? 'dark' : 'light' }} 
                    />
                  </div>
                </div>

                <div className="wm-grid-2col" style={{ display: 'grid', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', color: theme.muted }}>Start Time</label>
                    <input 
                      type="time" 
                      value={eventStartTime} 
                      onChange={(e) => setEventStartTime(e.target.value)} 
                      style={{ width: '100%', padding: '0.75rem', backgroundColor: theme.bg, border: `1px solid ${theme.border}`, color: theme.fg, outline: 'none', borderRadius: '4px', colorScheme: isDarkMode ? 'dark' : 'light' }} 
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', color: theme.muted }}>End Time</label>
                    <input 
                      type="time" 
                      value={eventEndTime} 
                      onChange={(e) => setEventEndTime(e.target.value)} 
                      style={{ width: '100%', padding: '0.75rem', backgroundColor: theme.bg, border: `1px solid ${theme.border}`, color: theme.fg, outline: 'none', borderRadius: '4px', colorScheme: isDarkMode ? 'dark' : 'light' }} 
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                  <button 
                    onClick={async () => {
                      if (!eventTitle.trim() || !eventStartDate) {
                        alert('Title and Start Date are required');
                        return;
                      }
                      setLoading(true);

                      let finalImageUrl = eventImage;
                      if (customImageFile) {
                        try {
                          const fileName = `events/event-${Date.now()}-${customImageFile.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
                          const { data, error } = await supabase.storage
                              .from('zawr-media')
                              .upload(fileName, customImageFile, { cacheControl: '3600', upsert: true });
                          
                          if (error) {
                            alert('Supabase Storage Upload Error: ' + error.message);
                            setLoading(false);
                            return;
                          }
                          const { data: { publicUrl } } = supabase.storage.from('zawr-media').getPublicUrl(fileName);
                          finalImageUrl = publicUrl;
                        } catch (err: any) {
                          alert('Error uploading event image: ' + err.message);
                          setLoading(false);
                          return;
                        }
                      }

                      const formData = new FormData();
                      formData.append('action', editingEvent ? 'update' : 'add');
                      formData.append('title', eventTitle);
                      formData.append('subtitle', eventSubtitle);
                      formData.append('description', eventDesc);
                      formData.append('startDate', eventStartDate);
                      formData.append('endDate', eventEndDate || eventStartDate);
                      formData.append('startTime', eventStartTime ? (eventStartTime.length === 5 ? `${eventStartTime}:00` : eventStartTime) : '00:00:00');
                      formData.append('endTime', eventEndTime ? (eventEndTime.length === 5 ? `${eventEndTime}:00` : eventEndTime) : '00:00:00');
                      formData.append('ticketsBooked', eventTicketsBooked);
                      formData.append('ticketsCapacity', eventTicketsCapacity);
                      formData.append('venue', eventVenue);
                      formData.append('specialNote', eventSpecialNote);
                      formData.append('image', finalImageUrl);
                      if (editingEvent) {
                        formData.append('id', editingEvent.id);
                      }

                      try {
                        const res = await fetch('/api/events', {
                          method: 'POST',
                          body: formData
                        });
                        if (res.ok) {
                          const data = await res.json();
                          setEvents(data.events || []);
                          // Clear states
                          setEventTitle('');
                          setEventSubtitle('');
                          setEventDesc('');
                          setEventStartDate('');
                          setEventEndDate('');
                          setEventStartTime('');
                          setEventEndTime('');
                          setEventTicketsBooked('0');
                          setEventTicketsCapacity('100');
                          setEventVenue('Online');
                          setEventSpecialNote('');
                          setEventImage('https://res.cloudinary.com/murfclni/image/upload/f_avif,q_auto:eco,w_1200,c_limit/v1783710478/zawr/assets/event-chart.png');
                          setCustomImageFile(null);
                          setEditingEvent(null);
                          alert(editingEvent ? 'Event updated successfully!' : 'Event added successfully!');
                        } else {
                          alert('Failed to save event.');
                        }
                      } catch (err) {
                        alert('Error saving event.');
                      }
                      setLoading(false);
                    }}
                    disabled={loading}
                    style={{ padding: '0.75rem 1.5rem', backgroundColor: theme.fg, color: theme.bg, border: 'none', fontWeight: 600, borderRadius: '4px', cursor: 'pointer' }}
                  >
                    {loading ? 'Saving...' : editingEvent ? 'Update Event' : 'Add Event'}
                  </button>
                  
                  {editingEvent && (
                    <button 
                      onClick={() => {
                        setEditingEvent(null);
                        setEventTitle('');
                        setEventSubtitle('');
                        setEventDesc('');
                        setEventStartDate('');
                        setEventEndDate('');
                        setEventStartTime('');
                        setEventEndTime('');
                        setEventTicketsBooked('0');
                        setEventTicketsCapacity('100');
                        setEventVenue('Online');
                        setEventSpecialNote('');
                        setEventImage('https://res.cloudinary.com/murfclni/image/upload/f_avif,q_auto:eco,w_1200,c_limit/v1783710478/zawr/assets/event-chart.png');
                        setCustomImageFile(null);
                      }}
                      style={{ padding: '0.75rem 1.5rem', backgroundColor: 'transparent', color: theme.fg, border: `1px solid ${theme.border}`, borderRadius: '4px', cursor: 'pointer' }}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* List of Events */}
            <div style={{ padding: '2rem', border: `1px solid ${theme.border}`, borderRadius: '8px', backgroundColor: theme.inputBg }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem' }}>Current Events</h3>
              
              <div className="wm-table-wrapper">
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ borderBottom: `1px solid ${theme.border}` }}>
                      <th style={{ padding: '1rem', color: theme.muted, fontWeight: 500 }}>Event Title</th>
                      <th style={{ padding: '1rem', color: theme.muted, fontWeight: 500 }}>Dates</th>
                      <th style={{ padding: '1rem', color: theme.muted, fontWeight: 500 }}>Venue & Tickets</th>
                      <th style={{ padding: '1rem', color: theme.muted, fontWeight: 500, textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {events.length === 0 ? (
                      <tr><td colSpan={4} style={{ padding: '2rem', textAlign: 'center', color: theme.muted }}>No events found.</td></tr>
                    ) : events.map((ev) => (
                      <tr key={ev.id} style={{ borderBottom: `1px solid ${theme.border}` }}>
                        <td style={{ padding: '1rem', fontWeight: 500 }}>
                          <div>{ev.title}</div>
                          <div style={{ fontSize: '0.75rem', color: theme.muted }}>{ev.subtitle}</div>
                        </td>
                        <td style={{ padding: '1rem', color: theme.muted }}>
                          {ev.startDate === ev.endDate ? ev.startDate : `${ev.startDate} to ${ev.endDate}`}
                        </td>
                        <td style={{ padding: '1rem', color: theme.muted }}>
                          <div>{ev.venue}</div>
                          <div style={{ fontSize: '0.75rem' }}>Booked: {ev.ticketsBooked || '0'} / {ev.ticketsCapacity || '100'}</div>
                        </td>
                        <td style={{ padding: '1rem', textAlign: 'right', whiteSpace: 'nowrap' }}>
                          <button 
                            onClick={() => {
                              setEditingEvent(ev);
                              setEventTitle(ev.title);
                              setEventSubtitle(ev.subtitle || '');
                              setEventDesc(ev.description || '');
                              setEventStartDate(ev.startDate);
                              setEventEndDate(ev.endDate === ev.startDate ? '' : ev.endDate);
                              setEventStartTime(ev.startTime ? ev.startTime.substring(0, 5) : '');
                              setEventEndTime(ev.endTime ? ev.endTime.substring(0, 5) : '');
                              setEventTicketsBooked(ev.ticketsBooked || '0');
                              setEventTicketsCapacity(ev.ticketsCapacity || '100');
                              setEventVenue(ev.venue || 'Online');
                              setEventSpecialNote(ev.specialNote || '');
                              setEventImage(ev.image || 'https://res.cloudinary.com/murfclni/image/upload/f_avif,q_auto:eco,w_1200,c_limit/v1783710478/zawr/assets/event-chart.png');
                            }}
                            style={{ padding: '0.5rem 1rem', backgroundColor: 'transparent', color: theme.fg, border: `1px solid ${theme.border}`, borderRadius: '4px', cursor: 'pointer', marginRight: '0.5rem', fontSize: '0.875rem' }}
                          >
                            Edit
                          </button>
                          <button 
                            onClick={async () => {
                              if (!window.confirm(`Are you sure you want to delete "${ev.title}"?`)) return;
                              setLoading(true);
                              const formData = new FormData();
                              formData.append('action', 'delete');
                              formData.append('id', ev.id);
                              try {
                                const res = await fetch('/api/events', { method: 'POST', body: formData });
                                if (res.ok) {
                                  const data = await res.json();
                                  setEvents(data.events || []);
                                } else {
                                  alert('Failed to delete event.');
                                }
                              } catch (e) {
                                alert('Error deleting event.');
                              }
                              setLoading(false);
                            }}
                            style={{ padding: '0.5rem 1rem', backgroundColor: isDarkMode ? '#3f0000' : '#fee2e2', color: isDarkMode ? '#ffaaaa' : '#dc2626', border: isDarkMode ? '1px solid #7f1d1d' : '1px solid #fca5a5', borderRadius: '4px', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 600 }}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      
      case 'notices':
        return (
          <div>
            <h2 style={{ fontSize: '2rem', fontWeight: 600, marginBottom: '2rem', letterSpacing: '-0.02em' }}>Manage Notices</h2>
            
            {/* Add / Edit Form */}
            <div style={{ padding: '2rem', border: `1px solid ${theme.border}`, borderRadius: '8px', backgroundColor: theme.inputBg, marginBottom: '3rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem' }}>{editingNotice ? 'Edit Notice' : 'Add New Notice'}</h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '600px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', color: theme.muted }}>Notice Title *</label>
                  <input 
                    type="text" 
                    value={noticeTitle} 
                    onChange={(e) => setNoticeTitle(e.target.value)} 
                    style={{ width: '100%', padding: '0.75rem', backgroundColor: theme.bg, border: `1px solid ${theme.border}`, color: theme.fg, outline: 'none', borderRadius: '4px' }} 
                    placeholder="e.g. Notice Inviting Offer — Sale of CBM"
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', color: theme.muted }}>Category *</label>
                    <select 
                      value={noticeCategory}
                      onChange={(e) => setNoticeCategory(e.target.value)}
                      style={{ width: '100%', padding: '0.75rem', backgroundColor: theme.bg, border: `1px solid ${theme.border}`, color: theme.fg, outline: 'none', borderRadius: '4px' }}
                    >
                      <option value="General">General</option>
                      <option value="Corporate">Corporate</option>
                      <option value="Procurement">Procurement</option>
                      <option value="Legal">Legal</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', color: theme.muted }}>Publish Date * (e.g. January 16, 2026)</label>
                    <input 
                      type="text" 
                      value={noticeDate} 
                      onChange={(e) => setNoticeDate(e.target.value)} 
                      style={{ width: '100%', padding: '0.75rem', backgroundColor: theme.bg, border: `1px solid ${theme.border}`, color: theme.fg, outline: 'none', borderRadius: '4px' }}
                      placeholder="e.g. January 16, 2026"
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', color: theme.muted }}>One-line Summary * (Shown on notices list)</label>
                  <input 
                    type="text" 
                    value={noticeSummary} 
                    onChange={(e) => setNoticeSummary(e.target.value)} 
                    style={{ width: '100%', padding: '0.75rem', backgroundColor: theme.bg, border: `1px solid ${theme.border}`, color: theme.fg, outline: 'none', borderRadius: '4px' }} 
                    placeholder="Short summary of this notice..."
                  />
                </div>

                <RichTextEditor
                  label="Notice Body Content (Detail page paragraph)"
                  value={noticeBody}
                  onChange={(val) => setNoticeBody(val)}
                  rows={5}
                  placeholder="Write detailed notice information, terms, instructions, or agenda here..."
                  theme={theme}
                />

                {/* File Attachment Upload */}
                <div style={{ padding: '1rem', border: `1px solid ${theme.border}`, borderRadius: '6px', backgroundColor: theme.bg }}>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.75rem' }}>Upload Notice PDF Attachment (Optional)</label>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <div className="wm-grid-2col" style={{ display: 'grid', gap: '1rem' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.75rem', marginBottom: '0.25rem', color: theme.muted }}>Attachment Label</label>
                        <input 
                          type="text" 
                          value={noticeAttachmentName} 
                          onChange={(e) => setNoticeAttachmentName(e.target.value)} 
                          style={{ width: '100%', padding: '0.5rem', backgroundColor: theme.inputBg, border: `1px solid ${theme.border}`, color: theme.fg, borderRadius: '4px' }} 
                          placeholder="e.g. Notice Inviting Offer"
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.75rem', marginBottom: '0.25rem', color: theme.muted }}>Choose PDF File</label>
                        <input 
                          type="file" 
                          accept="application/pdf"
                          onChange={(e) => {
                            const file = e.target.files?.[0] || null;
                            setCustomNoticeFile(file);
                          }}
                          style={{ color: theme.fg, fontSize: '0.8rem', paddingTop: '0.25rem' }}
                        />
                      </div>
                    </div>
                    {editingNotice && editingNotice.attachments && editingNotice.attachments.length > 0 && (
                      <div style={{ fontSize: '0.75rem', color: theme.muted, marginTop: '0.25rem' }}>
                        Current attachment: <strong>{editingNotice.attachments[0].label}</strong> ({editingNotice.attachments[0].url})
                      </div>
                    )}
                  </div>
                </div>

                {/* External Portal Links */}
                <div style={{ padding: '1rem', border: `1px solid ${theme.border}`, borderRadius: '6px', backgroundColor: theme.bg }}>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.75rem' }}>Manage External Portals / Links (Optional)</label>
                  
                  <div className="wm-grid-2col" style={{ display: 'grid', gap: '1rem', marginBottom: '0.5rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', marginBottom: '0.25rem', color: theme.muted }}>Portal / Link Label</label>
                      <input 
                        type="text" 
                        value={noticeLinkName} 
                        onChange={(e) => setNoticeLinkName(e.target.value)} 
                        style={{ width: '100%', padding: '0.5rem', backgroundColor: theme.inputBg, border: `1px solid ${theme.border}`, color: theme.fg, borderRadius: '4px' }} 
                        placeholder="e.g. e-Bidding Portal"
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', marginBottom: '0.25rem', color: theme.muted }}>Portal URL</label>
                      <input 
                        type="text" 
                        value={noticeLinkUrl} 
                        onChange={(e) => setNoticeLinkUrl(e.target.value)} 
                        style={{ width: '100%', padding: '0.5rem', backgroundColor: theme.inputBg, border: `1px solid ${theme.border}`, color: theme.fg, borderRadius: '4px' }} 
                        placeholder="https://..."
                      />
                    </div>
                  </div>
                  {editingNotice && editingNotice.links && editingNotice.links.length > 0 && (
                    <div style={{ fontSize: '0.75rem', color: theme.muted, marginTop: '0.25rem' }}>
                      Current Link: <strong>{editingNotice.links[0].label}</strong> ({editingNotice.links[0].url})
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', userSelect: 'none' }}>
                    <input 
                      type="checkbox"
                      checked={noticeIsArchived}
                      onChange={(e) => setNoticeIsArchived(e.target.checked)}
                      style={{ width: '16px', height: '16px', accentColor: theme.fg }}
                    />
                    <span style={{ fontSize: '0.875rem', color: theme.fg }}>Mark as Archived (Move to archive tab)</span>
                  </label>
                </div>

                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                  <button 
                    onClick={async () => {
                      if (!noticeTitle.trim() || !noticeDate.trim() || !noticeSummary.trim()) {
                        alert('Title, date, and summary are required');
                        return;
                      }
                      setLoading(true);

                      const formData = new FormData();
                      formData.append('action', editingNotice ? 'update' : 'add');
                      formData.append('title', noticeTitle);
                      formData.append('category', noticeCategory);
                      formData.append('date', noticeDate);
                      formData.append('summary', noticeSummary);
                      formData.append('body', noticeBody);
                      formData.append('archived', String(noticeIsArchived));

                      if (editingNotice) {
                        formData.append('id', editingNotice.id);
                      }

                      // Dynamic Links list
                      let linkList = [];
                      if (noticeLinkName.trim() && noticeLinkUrl.trim()) {
                        linkList.push({ label: noticeLinkName, url: noticeLinkUrl });
                      } else if (editingNotice && editingNotice.links) {
                        linkList = editingNotice.links;
                      }
                      formData.append('links', JSON.stringify(linkList));

                      // Dynamic Attachments list
                      let attachmentList = [];
                      if (editingNotice && editingNotice.attachments) {
                        attachmentList = editingNotice.attachments;
                      }
                      formData.append('attachments', JSON.stringify(attachmentList));

                      // Custom PDF file upload
                      if (customNoticeFile) {
                        formData.append('file', customNoticeFile);
                        formData.append('fileLabel', noticeAttachmentName || 'Notice Document');
                      }

                      try {
                        const res = await fetch('/api/notices', {
                          method: 'POST',
                          body: formData
                        });
                        if (res.ok) {
                          const data = await res.json();
                          setNotices(data.notices || []);
                          
                          // Clear states
                          setNoticeTitle('');
                          setNoticeCategory('General');
                          setNoticeDate('');
                          setNoticeSummary('');
                          setNoticeBody('');
                          setNoticeIsArchived(false);
                          setNoticeLinkName('');
                          setNoticeLinkUrl('');
                          setNoticeAttachmentName('');
                          setCustomNoticeFile(null);
                          setEditingNotice(null);
                          alert(editingNotice ? 'Notice updated successfully!' : 'Notice added successfully!');
                        } else {
                          alert('Failed to save notice.');
                        }
                      } catch (err) {
                        alert('Error saving notice.');
                      }
                      setLoading(false);
                    }}
                    disabled={loading}
                    style={{ padding: '0.75rem 1.5rem', backgroundColor: theme.fg, color: theme.bg, border: 'none', fontWeight: 600, borderRadius: '4px', cursor: 'pointer' }}
                  >
                    {loading ? 'Saving...' : editingNotice ? 'Update Notice' : 'Add Notice'}
                  </button>
                  
                  {editingNotice && (
                    <button 
                      onClick={() => {
                        setEditingNotice(null);
                        setNoticeTitle('');
                        setNoticeCategory('General');
                        setNoticeDate('');
                        setNoticeSummary('');
                        setNoticeBody('');
                        setNoticeIsArchived(false);
                        setNoticeLinkName('');
                        setNoticeLinkUrl('');
                        setNoticeAttachmentName('');
                        setCustomNoticeFile(null);
                      }}
                      style={{ padding: '0.75rem 1.5rem', backgroundColor: 'transparent', color: theme.fg, border: `1px solid ${theme.border}`, borderRadius: '4px', cursor: 'pointer' }}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* List of Notices */}
            <div style={{ padding: '2rem', border: `1px solid ${theme.border}`, borderRadius: '8px', backgroundColor: theme.inputBg }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem' }}>Current Notices</h3>
              
              <div className="wm-table-wrapper">
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ borderBottom: `1px solid ${theme.border}` }}>
                      <th style={{ padding: '1rem', color: theme.muted, fontWeight: 500 }}>Title</th>
                      <th style={{ padding: '1rem', color: theme.muted, fontWeight: 500 }}>Date</th>
                      <th style={{ padding: '1rem', color: theme.muted, fontWeight: 500 }}>Category</th>
                      <th style={{ padding: '1rem', color: theme.muted, fontWeight: 500 }}>Status</th>
                      <th style={{ padding: '1rem', color: theme.muted, fontWeight: 500, textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {notices.length === 0 ? (
                      <tr><td colSpan={5} style={{ padding: '2rem', textAlign: 'center', color: theme.muted }}>No notices found.</td></tr>
                    ) : notices.map((nt) => (
                      <tr key={nt.id} style={{ borderBottom: `1px solid ${theme.border}` }}>
                        <td style={{ padding: '1rem', fontWeight: 500 }}>{nt.title}</td>
                        <td style={{ padding: '1rem', color: theme.muted }}>{nt.date}</td>
                        <td style={{ padding: '1rem', color: theme.muted }}>{nt.category}</td>
                        <td style={{ padding: '1rem', color: theme.muted }}>
                          {nt.archived ? (
                            <span style={{ color: '#f97316', backgroundColor: '#431407', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600 }}>Archived</span>
                          ) : (
                            <span style={{ color: '#10b981', backgroundColor: '#064e3b', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600 }}>Active</span>
                          )}
                        </td>
                        <td style={{ padding: '1rem', textAlign: 'right', whiteSpace: 'nowrap' }}>
                          <button 
                            onClick={() => {
                              setEditingNotice(nt);
                              setNoticeTitle(nt.title);
                              setNoticeCategory(nt.category || 'General');
                              setNoticeDate(nt.date);
                              setNoticeSummary(nt.summary || '');
                              setNoticeBody(nt.body || '');
                              setNoticeIsArchived(!!nt.archived);
                              
                              // Load existing link/attachment fields if populated
                              if (nt.links && nt.links.length > 0) {
                                setNoticeLinkName(nt.links[0].label);
                                setNoticeLinkUrl(nt.links[0].url);
                              } else {
                                setNoticeLinkName('');
                                setNoticeLinkUrl('');
                              }
                              if (nt.attachments && nt.attachments.length > 0) {
                                setNoticeAttachmentName(nt.attachments[0].label);
                              } else {
                                setNoticeAttachmentName('');
                              }

                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            style={{ padding: '0.5rem 1rem', backgroundColor: 'transparent', color: theme.fg, border: `1px solid ${theme.border}`, borderRadius: '4px', cursor: 'pointer', marginRight: '0.5rem', fontSize: '0.875rem' }}
                          >
                            Edit
                          </button>
                          <button 
                            onClick={async () => {
                              setLoading(true);
                              const formData = new FormData();
                              formData.append('action', 'update');
                              formData.append('id', nt.id);
                              formData.append('title', nt.title);
                              formData.append('category', nt.category);
                              formData.append('date', nt.date);
                              formData.append('summary', nt.summary || '');
                              formData.append('body', nt.body || '');
                              formData.append('archived', String(!nt.archived));
                              formData.append('links', JSON.stringify(nt.links || []));
                              formData.append('attachments', JSON.stringify(nt.attachments || []));
                              try {
                                const res = await fetch('/api/notices', { method: 'POST', body: formData });
                                if (res.ok) {
                                  const data = await res.json();
                                  setNotices(data.notices || []);
                                } else {
                                  alert('Failed to toggle archive status.');
                                }
                              } catch (e) {
                                alert('Error toggling archive status.');
                              }
                              setLoading(false);
                            }}
                            style={{ 
                              padding: '0.5rem 1rem', 
                              backgroundColor: nt.archived ? '#0c3a0c' : '#222225', 
                              color: nt.archived ? '#aaffaa' : '#ffffff', 
                              border: nt.archived ? 'none' : `1px solid ${theme.border}`, 
                              borderRadius: '4px', 
                              cursor: 'pointer', 
                              marginRight: '0.5rem', 
                              fontSize: '0.875rem',
                              fontWeight: 600,
                              transition: 'all 0.2s'
                            }}
                          >
                            {nt.archived ? 'Unarchive' : 'Archive'}
                          </button>
                          <button 
                            onClick={async () => {
                              if (!window.confirm(`Are you sure you want to delete "${nt.title}"?`)) return;
                              setLoading(true);
                              const formData = new FormData();
                              formData.append('action', 'delete');
                              formData.append('id', nt.id);
                              try {
                                const res = await fetch('/api/notices', { method: 'POST', body: formData });
                                if (res.ok) {
                                  const data = await res.json();
                                  setNotices(data.notices || []);
                                } else {
                                  alert('Failed to delete notice.');
                                }
                              } catch (e) {
                                alert('Error deleting notice.');
                              }
                              setLoading(false);
                            }}
                            style={{ padding: '0.5rem 1rem', backgroundColor: '#3f0000', color: '#ffaaaa', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.875rem' }}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case 'press-releases':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', height: '100%', overflowY: 'auto', paddingRight: '1rem' }}>
            
            {/* Create/Edit Form */}
            <div style={{ padding: '2rem', border: `1px solid ${theme.border}`, borderRadius: '8px', backgroundColor: theme.inputBg }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1.5rem', letterSpacing: '-0.02em' }}>
                {editingPress ? `Edit Press Release: ${editingPress.title}` : 'Publish New Press Release'}
              </h2>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div className="wm-grid-2col" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', marginBottom: '0.25rem', color: theme.muted }}>Title</label>
                    <input 
                      type="text" 
                      value={pressTitle} 
                      onChange={(e) => setPressTitle(e.target.value)} 
                      style={{ width: '100%', padding: '0.5rem', backgroundColor: theme.inputBg, border: `1px solid ${theme.border}`, color: theme.fg, borderRadius: '4px' }} 
                      placeholder="e.g. Zawr Industries Announces Expansion..."
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', marginBottom: '0.25rem', color: theme.muted }}>Category</label>
                    <select 
                      value={pressCategory} 
                      onChange={(e) => setPressCategory(e.target.value)} 
                      style={{ width: '100%', padding: '0.5rem', backgroundColor: theme.inputBg, border: `1px solid ${theme.border}`, color: theme.fg, borderRadius: '4px' }}
                    >
                      <option value="Corporate">Corporate</option>
                      <option value="Product">Product</option>
                      <option value="Sustainability">Sustainability</option>
                      <option value="Partnership">Partnership</option>
                      <option value="General">General</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', marginBottom: '0.25rem', color: theme.muted }}>Date</label>
                    <input 
                      type="text" 
                      value={pressDate} 
                      onChange={(e) => setPressDate(e.target.value)} 
                      style={{ width: '100%', padding: '0.5rem', backgroundColor: theme.inputBg, border: `1px solid ${theme.border}`, color: theme.fg, borderRadius: '4px' }} 
                      placeholder="e.g. May 18, 2026"
                    />
                  </div>
                </div>

                <RichTextEditor
                  label="Summary (Short teaser shown in list)"
                  value={pressSummary}
                  onChange={(val) => setPressSummary(val)}
                  rows={3}
                  placeholder="Short summary of the corporate release..."
                  theme={theme}
                />

                <RichTextEditor
                  label="Full Editorial Body Content"
                  value={pressBody}
                  onChange={(val) => setPressBody(val)}
                  rows={8}
                  placeholder="Type the full official press release statement here with headings, quotes, bullet points..."
                  theme={theme}
                />

                {/* Upload Attachment */}
                <div style={{ border: `1px solid ${theme.border}`, padding: '1rem', borderRadius: '6px' }}>
                  <h4 style={{ fontSize: '0.875rem', fontWeight: 600, margin: '0 0 0.75rem 0' }}>Attach PDF Document</h4>
                  <div className="wm-grid-2col" style={{ display: 'grid', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', marginBottom: '0.25rem', color: theme.muted }}>Document Label</label>
                      <input 
                        type="text" 
                        value={pressAttachmentName} 
                        onChange={(e) => setPressAttachmentName(e.target.value)} 
                        style={{ width: '100%', padding: '0.5rem', backgroundColor: theme.inputBg, border: `1px solid ${theme.border}`, color: theme.fg, borderRadius: '4px' }} 
                        placeholder="e.g. Official Statement PDF"
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', marginBottom: '0.25rem', color: theme.muted }}>PDF File</label>
                      <input 
                        type="file" 
                        accept="application/pdf"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) setCustomPressFile(file);
                        }} 
                        style={{ color: theme.fg, fontSize: '0.85rem', paddingTop: '0.25rem' }} 
                      />
                    </div>
                  </div>
                </div>

                {/* Upload Banner Image */}
                <div style={{ border: `1px solid ${theme.border}`, padding: '1rem', borderRadius: '6px' }}>
                  <h4 style={{ fontSize: '0.875rem', fontWeight: 600, margin: '0 0 0.75rem 0' }}>Upload Press Release Card Banner Image</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) setCustomPressBannerFile(file);
                      }} 
                      style={{ color: theme.fg, fontSize: '0.85rem' }} 
                    />
                    {editingPress && editingPress.banner && (
                      <span style={{ fontSize: '0.75rem', color: theme.muted }}>
                        Current banner: <strong style={{ color: theme.fg }}>{editingPress.banner}</strong>
                      </span>
                    )}
                  </div>
                </div>

                {/* External Links */}
                <div style={{ border: `1px solid ${theme.border}`, padding: '1rem', borderRadius: '6px' }}>
                  <h4 style={{ fontSize: '0.875rem', fontWeight: 600, margin: '0 0 0.75rem 0' }}>Related External Link</h4>
                  <div className="wm-grid-2col" style={{ display: 'grid', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', marginBottom: '0.25rem', color: theme.muted }}>Link Label</label>
                      <input 
                        type="text" 
                        value={pressLinkName} 
                        onChange={(e) => setPressLinkName(e.target.value)} 
                        style={{ width: '100%', padding: '0.5rem', backgroundColor: theme.inputBg, border: `1px solid ${theme.border}`, color: theme.fg, borderRadius: '4px' }} 
                        placeholder="e.g. Platform Live Workspace"
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', marginBottom: '0.25rem', color: theme.muted }}>Link URL</label>
                      <input 
                        type="text" 
                        value={pressLinkUrl} 
                        onChange={(e) => setPressLinkUrl(e.target.value)} 
                        style={{ width: '100%', padding: '0.5rem', backgroundColor: theme.inputBg, border: `1px solid ${theme.border}`, color: theme.fg, borderRadius: '4px' }} 
                        placeholder="https://..."
                      />
                    </div>
                  </div>
                  {editingPress && editingPress.links && editingPress.links.length > 0 && (
                    <div style={{ fontSize: '0.75rem', color: theme.muted, marginTop: '0.25rem' }}>
                      Current Link: <strong>{editingPress.links[0].label}</strong> ({editingPress.links[0].url})
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', userSelect: 'none' }}>
                    <input 
                      type="checkbox"
                      checked={pressIsArchived}
                      onChange={(e) => setPressIsArchived(e.target.checked)}
                      style={{ width: '16px', height: '16px', accentColor: theme.fg }}
                    />
                    <span style={{ fontSize: '0.875rem', color: theme.fg }}>Mark as Archived (Move to archive tab)</span>
                  </label>
                </div>

                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                  <button 
                    onClick={async () => {
                      if (!pressTitle.trim() || !pressDate.trim() || !pressSummary.trim()) {
                        alert('Title, date, and summary are required');
                        return;
                      }
                      setLoading(true);

                      const formData = new FormData();
                      formData.append('action', editingPress ? 'update' : 'add');
                      formData.append('title', pressTitle);
                      formData.append('category', pressCategory);
                      formData.append('date', pressDate);
                      formData.append('summary', pressSummary);
                      formData.append('body', pressBody);
                      formData.append('archived', String(pressIsArchived));

                      if (editingPress) {
                        formData.append('id', editingPress.id);
                      }

                      // Dynamic Links list
                      let linkList = [];
                      if (pressLinkName.trim() && pressLinkUrl.trim()) {
                        linkList.push({ label: pressLinkName, url: pressLinkUrl });
                      } else if (editingPress && editingPress.links) {
                        linkList = editingPress.links;
                      }
                      formData.append('links', JSON.stringify(linkList));

                      // Dynamic Attachments list
                      let attachmentList = [];
                      if (editingPress && editingPress.attachments) {
                        attachmentList = editingPress.attachments;
                      }
                      formData.append('attachments', JSON.stringify(attachmentList));

                      // Custom PDF file upload
                      if (customPressFile) {
                        formData.append('file', customPressFile);
                        formData.append('fileLabel', pressAttachmentName || 'Official PDF Attachment');
                      }

                      // Custom Banner Image file upload
                      if (customPressBannerFile) {
                        formData.append('bannerFile', customPressBannerFile);
                      }
                      if (editingPress && editingPress.banner) {
                        formData.append('existingBanner', editingPress.banner);
                      }

                      try {
                        const res = await fetch('/api/press-releases', {
                          method: 'POST',
                          body: formData
                        });
                        if (res.ok) {
                          const data = await res.json();
                          setPressReleases(data.releases || []);
                          
                          // Clear states
                          setPressTitle('');
                          setPressCategory('Corporate');
                          setPressDate('');
                          setPressSummary('');
                          setPressBody('');
                          setPressIsArchived(false);
                          setPressLinkName('');
                          setPressLinkUrl('');
                          setPressAttachmentName('');
                          setCustomPressFile(null);
                          setCustomPressBannerFile(null);
                          setEditingPress(null);
                          alert(editingPress ? 'Press release updated successfully!' : 'Press release added successfully!');
                          // Trigger reload of active tab to fetch updated data
                          const updatedRes = await fetch('/api/press-releases');
                          if (updatedRes.ok) {
                            const updatedData = await updatedRes.json();
                            setPressReleases(updatedData);
                          }
                        } else {
                          alert('Failed to save press release.');
                        }
                      } catch (err) {
                        alert('Error saving press release.');
                      }
                      setLoading(false);
                    }}
                    disabled={loading}
                    style={{ padding: '0.75rem 1.5rem', backgroundColor: theme.fg, color: theme.bg, border: 'none', fontWeight: 600, borderRadius: '4px', cursor: 'pointer' }}
                  >
                    {loading ? 'Saving...' : editingPress ? 'Update Release' : 'Add Release'}
                  </button>
                  
                  {editingPress && (
                    <button 
                      onClick={() => {
                        setEditingPress(null);
                        setPressTitle('');
                        setPressCategory('Corporate');
                        setPressDate('');
                        setPressSummary('');
                        setPressBody('');
                        setPressIsArchived(false);
                        setPressLinkName('');
                        setPressLinkUrl('');
                        setPressAttachmentName('');
                        setCustomPressFile(null);
                        setCustomPressBannerFile(null);
                      }}
                      style={{ padding: '0.75rem 1.5rem', backgroundColor: 'transparent', color: theme.fg, border: `1px solid ${theme.border}`, borderRadius: '4px', cursor: 'pointer' }}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* List of Releases */}
            <div style={{ padding: '2rem', border: `1px solid ${theme.border}`, borderRadius: '8px', backgroundColor: theme.inputBg }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem' }}>Current Press Releases</h3>
              
              <div className="wm-table-wrapper">
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ borderBottom: `1px solid ${theme.border}` }}>
                      <th style={{ padding: '1rem', color: theme.muted, fontWeight: 500 }}>Title</th>
                      <th style={{ padding: '1rem', color: theme.muted, fontWeight: 500 }}>Date</th>
                      <th style={{ padding: '1rem', color: theme.muted, fontWeight: 500 }}>Category</th>
                      <th style={{ padding: '1rem', color: theme.muted, fontWeight: 500 }}>Status</th>
                      <th style={{ padding: '1rem', color: theme.muted, fontWeight: 500, textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pressReleases.length === 0 ? (
                      <tr><td colSpan={5} style={{ padding: '2rem', textAlign: 'center', color: theme.muted }}>No press releases found.</td></tr>
                    ) : pressReleases.map((pr) => (
                      <tr key={pr.id} style={{ borderBottom: `1px solid ${theme.border}` }}>
                        <td style={{ padding: '1rem', fontWeight: 500 }}>{pr.title}</td>
                        <td style={{ padding: '1rem', color: theme.muted }}>{pr.date}</td>
                        <td style={{ padding: '1rem', color: theme.muted }}>{pr.category}</td>
                        <td style={{ padding: '1rem', color: theme.muted }}>
                          {pr.archived ? (
                            <span style={{ color: '#f97316', backgroundColor: '#431407', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600 }}>Archived</span>
                          ) : (
                            <span style={{ color: '#10b981', backgroundColor: '#064e3b', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600 }}>Active</span>
                          )}
                        </td>
                        <td style={{ padding: '1rem', textAlign: 'right', whiteSpace: 'nowrap' }}>
                          <button 
                            onClick={() => {
                              setEditingPress(pr);
                              setPressTitle(pr.title);
                              setPressCategory(pr.category || 'Corporate');
                              setPressDate(pr.date);
                              setPressSummary(pr.summary || '');
                              setPressBody(pr.body || '');
                              setPressIsArchived(!!pr.archived);
                              
                              if (pr.links && pr.links.length > 0) {
                                setPressLinkName(pr.links[0].label);
                                setPressLinkUrl(pr.links[0].url);
                              } else {
                                setPressLinkName('');
                                setPressLinkUrl('');
                              }
                              if (pr.attachments && pr.attachments.length > 0) {
                                setPressAttachmentName(pr.attachments[0].label);
                              } else {
                                setPressAttachmentName('');
                              }

                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            style={{ padding: '0.5rem 1rem', backgroundColor: 'transparent', color: theme.fg, border: `1px solid ${theme.border}`, borderRadius: '4px', cursor: 'pointer', marginRight: '0.5rem', fontSize: '0.875rem' }}
                          >
                            Edit
                          </button>
                          <button 
                            onClick={async () => {
                              setLoading(true);
                              const formData = new FormData();
                              formData.append('action', 'update');
                              formData.append('id', pr.id);
                              formData.append('title', pr.title);
                              formData.append('category', pr.category);
                              formData.append('date', pr.date);
                              formData.append('summary', pr.summary || '');
                              formData.append('body', pr.body || '');
                              formData.append('archived', String(!pr.archived));
                              formData.append('links', JSON.stringify(pr.links || []));
                              formData.append('attachments', JSON.stringify(pr.attachments || []));
                              try {
                                const res = await fetch('/api/press-releases', { method: 'POST', body: formData });
                                if (res.ok) {
                                  const data = await res.json();
                                  setPressReleases(data.releases || []);
                                  const updatedRes = await fetch('/api/press-releases');
                                  if (updatedRes.ok) {
                                    const updatedData = await updatedRes.json();
                                    setPressReleases(updatedData);
                                  }
                                } else {
                                  alert('Failed to update status.');
                                }
                              } catch (e) {
                                alert('Error updating status.');
                              }
                              setLoading(false);
                            }}
                            style={{ 
                              padding: '0.5rem 1rem', 
                              backgroundColor: 'transparent', 
                              color: pr.archived ? '#10b981' : '#f59e0b', 
                              border: pr.archived ? '1px solid #059669' : '1px solid #d97706', 
                              borderRadius: '4px', 
                              cursor: 'pointer', 
                              marginRight: '0.5rem', 
                              fontSize: '0.875rem' 
                            }}
                          >
                            {pr.archived ? 'Unarchive' : 'Archive'}
                          </button>
                          <button 
                            onClick={async () => {
                              if (!window.confirm(`Are you sure you want to delete "${pr.title}"?`)) return;
                              setLoading(true);
                              const formData = new FormData();
                              formData.append('action', 'delete');
                              formData.append('id', pr.id);
                              try {
                                const res = await fetch('/api/press-releases', { method: 'POST', body: formData });
                                if (res.ok) {
                                  const data = await res.json();
                                  setPressReleases(data.releases || []);
                                  // Trigger reload of active tab to fetch updated data
                                  const updatedRes = await fetch('/api/press-releases');
                                  if (updatedRes.ok) {
                                    const updatedData = await updatedRes.json();
                                    setPressReleases(updatedData);
                                  }
                                } else {
                                  alert('Failed to delete press release.');
                                }
                              } catch (e) {
                                alert('Error deleting press release.');
                              }
                              setLoading(false);
                            }}
                            style={{ padding: '0.5rem 1rem', backgroundColor: '#3f0000', color: '#ffaaaa', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.875rem' }}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      
      case 'notifications':
        return (
          <div>
            <h2 style={{ fontSize: '2rem', fontWeight: 600, marginBottom: '2rem', letterSpacing: '-0.02em' }}>Manage Notifications</h2>
            
            {/* Add / Edit Form */}
            <div style={{ padding: '2rem', border: `1px solid ${theme.border}`, borderRadius: '8px', backgroundColor: theme.inputBg, marginBottom: '3rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem' }}>{editingNotif ? 'Edit Notification' : 'Add New Notification'}</h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '600px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', color: theme.muted }}>Notification Title *</label>
                  <input 
                    type="text" 
                    value={notifTitle} 
                    onChange={(e) => setNotifTitle(e.target.value)} 
                    style={{ width: '100%', padding: '0.75rem', backgroundColor: theme.bg, border: `1px solid ${theme.border}`, color: theme.fg, outline: 'none', borderRadius: '4px' }} 
                    placeholder="e.g. Q2 2026 Earnings Call Notice"
                  />
                </div>

                <div className="wm-grid-2col" style={{ display: 'grid', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', color: theme.muted }}>Category *</label>
                    <select 
                      value={notifCategory}
                      onChange={(e) => setNotifCategory(e.target.value)}
                      style={{ width: '100%', padding: '0.75rem', backgroundColor: theme.bg, border: `1px solid ${theme.border}`, color: theme.fg, outline: 'none', borderRadius: '4px' }}
                    >
                      <option value="General">General</option>
                      <option value="Investor">Investor</option>
                      <option value="Operations">Operations</option>
                      <option value="Corporate">Corporate</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', color: theme.muted }}>Publish Date * (e.g. 27th May 2026)</label>
                    <input 
                      type="text" 
                      value={notifDate} 
                      onChange={(e) => setNotifDate(e.target.value)} 
                      style={{ width: '100%', padding: '0.75rem', backgroundColor: theme.bg, border: `1px solid ${theme.border}`, color: theme.fg, outline: 'none', borderRadius: '4px' }}
                      placeholder="e.g. 27th May 2026"
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', color: theme.muted }}>One-line Summary * (Shown on list)</label>
                  <input 
                    type="text" 
                    value={notifSummary} 
                    onChange={(e) => setNotifSummary(e.target.value)} 
                    style={{ width: '100%', padding: '0.75rem', backgroundColor: theme.bg, border: `1px solid ${theme.border}`, color: theme.fg, outline: 'none', borderRadius: '4px' }} 
                    placeholder="Short summary of this notification..."
                  />
                </div>

                <RichTextEditor
                  label="Notification Body Content (Paragraph on detail page)"
                  value={notifBody}
                  onChange={(val) => setNotifBody(val)}
                  rows={5}
                  placeholder="Write detailed notification information, corporate updates, or instructions here..."
                  theme={theme}
                />

                {/* File Attachment Upload */}
                <div style={{ padding: '1rem', border: `1px solid ${theme.border}`, borderRadius: '6px', backgroundColor: theme.bg }}>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.75rem' }}>Upload Notification PDF Attachment (Optional)</label>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <div className="wm-grid-2col" style={{ display: 'grid', gap: '1rem' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.75rem', marginBottom: '0.25rem', color: theme.muted }}>Attachment Label</label>
                        <input 
                          type="text" 
                          value={notifAttachmentName} 
                          onChange={(e) => setNotifAttachmentName(e.target.value)} 
                          style={{ width: '100%', padding: '0.5rem', backgroundColor: theme.inputBg, border: `1px solid ${theme.border}`, color: theme.fg, borderRadius: '4px' }} 
                          placeholder="e.g. AGM Invitation PDF"
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.75rem', marginBottom: '0.25rem', color: theme.muted }}>Choose PDF File</label>
                        <input 
                          type="file" 
                          accept="application/pdf"
                          onChange={(e) => {
                            const file = e.target.files?.[0] || null;
                            setCustomNotifFile(file);
                          }}
                          style={{ color: theme.fg, fontSize: '0.8rem', paddingTop: '0.25rem' }}
                        />
                      </div>
                    </div>
                    {editingNotif && editingNotif.attachments && editingNotif.attachments.length > 0 && (
                      <div style={{ fontSize: '0.75rem', color: theme.muted, marginTop: '0.25rem' }}>
                        Current attachment: <strong>{editingNotif.attachments[0].label}</strong> ({editingNotif.attachments[0].url})
                      </div>
                    )}
                  </div>
                </div>

                {/* External Portal Links */}
                <div style={{ padding: '1rem', border: `1px solid ${theme.border}`, borderRadius: '6px', backgroundColor: theme.bg }}>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.75rem' }}>Manage External Portals / Links (Optional)</label>
                  
                  <div className="wm-grid-2col" style={{ display: 'grid', gap: '1rem', marginBottom: '0.5rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', marginBottom: '0.25rem', color: theme.muted }}>Portal / Link Label</label>
                      <input 
                        type="text" 
                        value={notifLinkName} 
                        onChange={(e) => setNotifLinkName(e.target.value)} 
                        style={{ width: '100%', padding: '0.5rem', backgroundColor: theme.inputBg, border: `1px solid ${theme.border}`, color: theme.fg, borderRadius: '4px' }} 
                        placeholder="e.g. Registration Link"
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', marginBottom: '0.25rem', color: theme.muted }}>Portal URL</label>
                      <input 
                        type="text" 
                        value={notifLinkUrl} 
                        onChange={(e) => setNotifLinkUrl(e.target.value)} 
                        style={{ width: '100%', padding: '0.5rem', backgroundColor: theme.inputBg, border: `1px solid ${theme.border}`, color: theme.fg, borderRadius: '4px' }} 
                        placeholder="https://..."
                      />
                    </div>
                  </div>
                  {editingNotif && editingNotif.links && editingNotif.links.length > 0 && (
                    <div style={{ fontSize: '0.75rem', color: theme.muted, marginTop: '0.25rem' }}>
                      Current Link: <strong>{editingNotif.links[0].label}</strong> ({editingNotif.links[0].url})
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', userSelect: 'none' }}>
                    <input 
                      type="checkbox"
                      checked={notifIsArchived}
                      onChange={(e) => setNotifIsArchived(e.target.checked)}
                      style={{ width: '16px', height: '16px', accentColor: theme.fg }}
                    />
                    <span style={{ fontSize: '0.875rem', color: theme.fg }}>Mark as Archived (Move to archive tab)</span>
                  </label>
                </div>

                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                  <button 
                    onClick={async () => {
                      if (!notifTitle.trim() || !notifDate.trim() || !notifSummary.trim()) {
                        alert('Title, date, and summary are required');
                        return;
                      }
                      setLoading(true);

                      const formData = new FormData();
                      formData.append('action', editingNotif ? 'update' : 'add');
                      formData.append('title', notifTitle);
                      formData.append('category', notifCategory);
                      formData.append('date', notifDate);
                      formData.append('summary', notifSummary);
                      formData.append('body', notifBody);
                      formData.append('archived', String(notifIsArchived));

                      if (editingNotif) {
                        formData.append('id', editingNotif.id);
                      }

                      // Dynamic Links list
                      let linkList = [];
                      if (notifLinkName.trim() && notifLinkUrl.trim()) {
                        linkList.push({ label: notifLinkName, url: notifLinkUrl });
                      } else if (editingNotif && editingNotif.links) {
                        linkList = editingNotif.links;
                      }
                      formData.append('links', JSON.stringify(linkList));

                      // Dynamic Attachments list
                      let attachmentList = [];
                      if (editingNotif && editingNotif.attachments) {
                        attachmentList = editingNotif.attachments;
                      }
                      formData.append('attachments', JSON.stringify(attachmentList));

                      // Custom PDF file upload
                      if (customNotifFile) {
                        formData.append('file', customNotifFile);
                        formData.append('fileLabel', notifAttachmentName || 'Notification Document');
                      }

                      try {
                        const res = await fetch('/api/notifications', {
                          method: 'POST',
                          body: formData
                        });
                        if (res.ok) {
                          const data = await res.json();
                          setNotifications(data.notifications || []);
                          
                          // Clear states
                          setNotifTitle('');
                          setNotifCategory('General');
                          setNotifDate('');
                          setNotifSummary('');
                          setNotifBody('');
                          setNotifIsArchived(false);
                          setNotifLinkName('');
                          setNotifLinkUrl('');
                          setNotifAttachmentName('');
                          setCustomNotifFile(null);
                          setEditingNotif(null);
                          alert(editingNotif ? 'Notification updated successfully!' : 'Notification added successfully!');
                        } else {
                          alert('Failed to save notification.');
                        }
                      } catch (err) {
                        alert('Error saving notification.');
                      }
                      setLoading(false);
                    }}
                    disabled={loading}
                    style={{ padding: '0.75rem 1.5rem', backgroundColor: theme.fg, color: theme.bg, border: 'none', fontWeight: 600, borderRadius: '4px', cursor: 'pointer' }}
                  >
                    {loading ? 'Saving...' : editingNotif ? 'Update Notification' : 'Add Notification'}
                  </button>
                  
                  {editingNotif && (
                    <button 
                      onClick={() => {
                        setEditingNotif(null);
                        setNotifTitle('');
                        setNotifCategory('General');
                        setNotifDate('');
                        setNotifSummary('');
                        setNotifBody('');
                        setNotifIsArchived(false);
                        setNotifLinkName('');
                        setNotifLinkUrl('');
                        setNotifAttachmentName('');
                        setCustomNotifFile(null);
                      }}
                      style={{ padding: '0.75rem 1.5rem', backgroundColor: 'transparent', color: theme.fg, border: `1px solid ${theme.border}`, borderRadius: '4px', cursor: 'pointer' }}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* List of Notifications */}
            <div style={{ padding: '2rem', border: `1px solid ${theme.border}`, borderRadius: '8px', backgroundColor: theme.inputBg }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem' }}>Current Notifications</h3>
              
              <div className="wm-table-wrapper">
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ borderBottom: `1px solid ${theme.border}` }}>
                      <th style={{ padding: '1rem', color: theme.muted, fontWeight: 500 }}>Title</th>
                      <th style={{ padding: '1rem', color: theme.muted, fontWeight: 500 }}>Date</th>
                      <th style={{ padding: '1rem', color: theme.muted, fontWeight: 500 }}>Category</th>
                      <th style={{ padding: '1rem', color: theme.muted, fontWeight: 500 }}>Status</th>
                      <th style={{ padding: '1rem', color: theme.muted, fontWeight: 500, textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {notifications.length === 0 ? (
                      <tr><td colSpan={5} style={{ padding: '2rem', textAlign: 'center', color: theme.muted }}>No notifications found.</td></tr>
                    ) : notifications.map((nt) => (
                      <tr key={nt.id} style={{ borderBottom: `1px solid ${theme.border}` }}>
                        <td style={{ padding: '1rem', fontWeight: 500 }}>{nt.title}</td>
                        <td style={{ padding: '1rem', color: theme.muted }}>{nt.date}</td>
                        <td style={{ padding: '1rem', color: theme.muted }}>{nt.category}</td>
                        <td style={{ padding: '1rem', color: theme.muted }}>
                          {nt.archived ? (
                            <span style={{ color: '#f97316', backgroundColor: '#431407', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600 }}>Archived</span>
                          ) : (
                            <span style={{ color: '#10b981', backgroundColor: '#064e3b', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600 }}>Active</span>
                          )}
                        </td>
                        <td style={{ padding: '1rem', textAlign: 'right', whiteSpace: 'nowrap' }}>
                          <button 
                            onClick={() => {
                              setEditingNotif(nt);
                              setNotifTitle(nt.title);
                              setNotifCategory(nt.category || 'General');
                              setNotifDate(nt.date);
                              setNotifSummary(nt.summary || '');
                              setNotifBody(nt.body || '');
                              setNotifIsArchived(!!nt.archived);
                              
                              if (nt.links && nt.links.length > 0) {
                                setNotifLinkName(nt.links[0].label);
                                setNotifLinkUrl(nt.links[0].url);
                              } else {
                                setNotifLinkName('');
                                setNotifLinkUrl('');
                              }
                              if (nt.attachments && nt.attachments.length > 0) {
                                setNotifAttachmentName(nt.attachments[0].label);
                              } else {
                                setNotifAttachmentName('');
                              }

                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            style={{ padding: '0.5rem 1rem', backgroundColor: 'transparent', color: theme.fg, border: `1px solid ${theme.border}`, borderRadius: '4px', cursor: 'pointer', marginRight: '0.5rem', fontSize: '0.875rem' }}
                          >
                            Edit
                          </button>
                          <button 
                            onClick={async () => {
                              setLoading(true);
                              const formData = new FormData();
                              formData.append('action', 'update');
                              formData.append('id', nt.id);
                              formData.append('title', nt.title);
                              formData.append('category', nt.category);
                              formData.append('date', nt.date);
                              formData.append('summary', nt.summary || '');
                              formData.append('body', nt.body || '');
                              formData.append('archived', String(!nt.archived));
                              formData.append('links', JSON.stringify(nt.links || []));
                              formData.append('attachments', JSON.stringify(nt.attachments || []));
                              try {
                                const res = await fetch('/api/notifications', { method: 'POST', body: formData });
                                if (res.ok) {
                                  const data = await res.json();
                                  setNotifications(data.notifications || []);
                                } else {
                                  alert('Failed to update status.');
                                }
                              } catch (e) {
                                alert('Error updating status.');
                              }
                              setLoading(false);
                            }}
                            style={{ 
                              padding: '0.5rem 1rem', 
                              backgroundColor: 'transparent', 
                              color: nt.archived ? '#10b981' : '#f59e0b', 
                              border: nt.archived ? '1px solid #059669' : '1px solid #d97706', 
                              borderRadius: '4px', 
                              cursor: 'pointer', 
                              marginRight: '0.5rem', 
                              fontSize: '0.875rem' 
                            }}
                          >
                            {nt.archived ? 'Unarchive' : 'Archive'}
                          </button>
                          <button 
                            onClick={async () => {
                              if (!window.confirm(`Are you sure you want to delete "${nt.title}"?`)) return;
                              setLoading(true);
                              const formData = new FormData();
                              formData.append('action', 'delete');
                              formData.append('id', nt.id);
                              try {
                                const res = await fetch('/api/notifications', { method: 'POST', body: formData });
                                if (res.ok) {
                                  const data = await res.json();
                                  setNotifications(data.notifications || []);
                                } else {
                                  alert('Failed to delete notification.');
                                }
                              } catch (e) {
                                alert('Error deleting notification.');
                              }
                              setLoading(false);
                            }}
                            style={{ padding: '0.5rem 1rem', backgroundColor: '#3f0000', color: '#ffaaaa', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.875rem' }}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case 'blogs':
        return (
          <div>
            <h2 style={{ fontSize: '2rem', fontWeight: 600, marginBottom: '2rem', letterSpacing: '-0.02em' }}>Manage Blog Articles</h2>
            
            {/* Blog Form */}
            <div style={{ padding: '2rem', border: `1px solid ${theme.border}`, borderRadius: '8px', backgroundColor: theme.inputBg, marginBottom: '3rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem' }}>
                {editingBlog ? `Edit Blog Article: ${editingBlog.title}` : 'Write New Blog Article'}
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div className="wm-grid-2col" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', color: theme.muted }}>Blog Title *</label>
                    <input 
                      type="text" 
                      value={blogTitle} 
                      onChange={(e) => setBlogTitle(e.target.value)} 
                      style={{ width: '100%', padding: '0.75rem', backgroundColor: theme.bg, border: `1px solid ${theme.border}`, color: theme.fg, borderRadius: '4px', outline: 'none' }} 
                      placeholder="e.g. The art of hiring: insights from Khosla Ventures"
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', color: theme.muted }}>Category</label>
                    <select 
                      value={blogCategory} 
                      onChange={(e) => setBlogCategory(e.target.value)} 
                      style={{ width: '100%', padding: '0.75rem', backgroundColor: theme.bg, border: `1px solid ${theme.border}`, color: theme.fg, borderRadius: '4px', outline: 'none' }}
                    >
                      <option value="News">News</option>
                      <option value="Technology">Technology</option>
                      <option value="Business">Business</option>
                      <option value="Corporate">Corporate</option>
                      <option value="Opinion">Opinion</option>
                    </select>
                  </div>
                </div>

                <div className="wm-grid-2col" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.5rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', color: theme.muted }}>Author Name</label>
                    <input 
                      type="text" 
                      value={blogAuthor} 
                      onChange={(e) => setBlogAuthor(e.target.value)} 
                      style={{ width: '100%', padding: '0.75rem', backgroundColor: theme.bg, border: `1px solid ${theme.border}`, color: theme.fg, borderRadius: '4px', outline: 'none' }} 
                      placeholder="Lina Linder"
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', color: theme.muted }}>Date</label>
                    <input 
                      type="text" 
                      value={blogDate} 
                      onChange={(e) => setBlogDate(e.target.value)} 
                      style={{ width: '100%', padding: '0.75rem', backgroundColor: theme.bg, border: `1px solid ${theme.border}`, color: theme.fg, borderRadius: '4px', outline: 'none' }} 
                      placeholder="e.g. 12 January 2025"
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', color: theme.muted }}>Read Time</label>
                    <input 
                      type="text" 
                      value={blogReadTime} 
                      onChange={(e) => setBlogReadTime(e.target.value)} 
                      style={{ width: '100%', padding: '0.75rem', backgroundColor: theme.bg, border: `1px solid ${theme.border}`, color: theme.fg, borderRadius: '4px', outline: 'none' }} 
                      placeholder="e.g. 5 min read"
                    />
                  </div>
                </div>

                <RichTextEditor
                  label="Summary / Excerpt"
                  required
                  value={blogSummary}
                  onChange={(val) => setBlogSummary(val)}
                  rows={3}
                  placeholder="Short, compelling executive summary of the insight for editorial cards and search previews..."
                  theme={theme}
                />

                <div className="wm-grid-2col" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', color: theme.muted }}>Upload Featured Image</label>
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={(e) => setCustomBlogFile(e.target.files?.[0] || null)}
                      style={{ width: '100%', padding: '0.5rem', backgroundColor: theme.bg, border: `1px solid ${theme.border}`, color: theme.fg, borderRadius: '4px' }} 
                    />
                    {editingBlog && editingBlog.image && (
                      <div style={{ fontSize: '0.75rem', color: theme.muted, marginTop: '0.25rem' }}>
                        Current Image: <strong>{editingBlog.image}</strong>
                      </div>
                    )}
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', color: theme.muted }}>Upload Author Avatar (Optional)</label>
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={(e) => setCustomAuthorFile(e.target.files?.[0] || null)}
                      style={{ width: '100%', padding: '0.5rem', backgroundColor: theme.bg, border: `1px solid ${theme.border}`, color: theme.fg, borderRadius: '4px' }} 
                    />
                    {editingBlog && editingBlog.authorImage && (
                      <div style={{ fontSize: '0.75rem', color: theme.muted, marginTop: '0.25rem' }}>
                        Current Avatar: <strong>{editingBlog.authorImage}</strong>
                      </div>
                    )}
                  </div>
                </div>

                {/* Sections Editor */}
                <div style={{ padding: '1rem', border: `1px solid ${theme.border}`, borderRadius: '6px', backgroundColor: theme.bg }}>
                  <label style={{ display: 'block', fontSize: '0.95rem', fontWeight: 600, marginBottom: '1rem' }}>Article Content Sections</label>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {blogSections.map((sect, i) => (
                      <div key={i} style={{ padding: '1rem', border: `1px solid ${theme.border}`, borderRadius: '6px', backgroundColor: theme.inputBg, position: 'relative' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: theme.fg }}>Section #{i + 1}</span>
                          {blogSections.length > 1 && (
                            <button 
                              type="button" 
                              onClick={() => setBlogSections(blogSections.filter((_, idx) => idx !== i))}
                              style={{ padding: '0.2rem 0.6rem', backgroundColor: '#3f0000', color: '#ffaaaa', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.75rem' }}
                            >
                              Remove
                            </button>
                          )}
                        </div>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                          <div>
                            <label style={{ display: 'block', fontSize: '0.75rem', marginBottom: '0.25rem', color: theme.muted }}>Section Heading / Title</label>
                            <input 
                              type="text" 
                              value={sect.title}
                              onChange={(e) => {
                                const next = [...blogSections];
                                next[i].title = e.target.value;
                                setBlogSections(next);
                              }}
                              style={{ width: '100%', padding: '0.5rem', backgroundColor: theme.bg, border: `1px solid ${theme.border}`, color: theme.fg, borderRadius: '4px', outline: 'none' }}
                              placeholder="e.g. 1. The First Principles of Talent Acquisition"
                            />
                          </div>
                          
                          <RichTextEditor
                            label="Section Body Content"
                            value={sect.body}
                            onChange={(val) => {
                              const next = [...blogSections];
                              next[i].body = val;
                              setBlogSections(next);
                            }}
                            rows={6}
                            placeholder="Type section contents, paragraphs, quotes, and bullet insights here..."
                            theme={theme}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <button 
                    type="button" 
                    onClick={() => setBlogSections([...blogSections, { title: '', body: '' }])}
                    style={{ marginTop: '1rem', padding: '0.5rem 1rem', backgroundColor: 'transparent', color: theme.fg, border: `1px dashed ${theme.border}`, borderRadius: '4px', cursor: 'pointer', fontSize: '0.875rem' }}
                  >
                    + Add Another Section
                  </button>
                </div>

                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                  <button 
                    onClick={async () => {
                      if (!blogTitle.trim() || !blogSummary.trim()) {
                        alert('Title and summary are required');
                        return;
                      }
                      setLoading(true);

                      const formData = new FormData();
                      formData.append('action', editingBlog ? 'update' : 'add');
                      formData.append('title', blogTitle);
                      formData.append('category', blogCategory);
                      formData.append('author', blogAuthor);
                      formData.append('date', blogDate);
                      formData.append('readTime', blogReadTime);
                      formData.append('summary', blogSummary);
                      formData.append('sections', JSON.stringify(blogSections));

                      if (editingBlog) {
                        formData.append('id', editingBlog.id);
                      }

                      if (customBlogFile) {
                        formData.append('imageFile', customBlogFile);
                      }
                      if (customAuthorFile) {
                        formData.append('authorImageFile', customAuthorFile);
                      }

                      try {
                        const res = await fetch('/api/blogs', {
                          method: 'POST',
                          body: formData
                        });
                        if (res.ok) {
                          const data = await res.json();
                          setBlogsData(data.blogs || []);
                          
                          // Clear states
                          setBlogTitle('');
                          setBlogCategory('News');
                          setBlogAuthor('Lina Linder');
                          setBlogDate('');
                          setBlogSummary('');
                          setBlogReadTime('5 min read');
                          setBlogSections([{ title: '', body: '' }]);
                          setCustomBlogFile(null);
                          setCustomAuthorFile(null);
                          setEditingBlog(null);
                          alert(editingBlog ? 'Blog article updated successfully!' : 'Blog article published successfully!');
                        } else {
                          alert('Failed to publish blog.');
                        }
                      } catch (err) {
                        alert('Error saving blog.');
                      }
                      setLoading(false);
                    }}
                    disabled={loading}
                    style={{ padding: '0.75rem 1.5rem', backgroundColor: theme.fg, color: theme.bg, border: 'none', fontWeight: 600, borderRadius: '4px', cursor: 'pointer' }}
                  >
                    {loading ? 'Publishing...' : editingBlog ? 'Update Article' : 'Publish Article'}
                  </button>
                  
                  {editingBlog && (
                    <button 
                      onClick={() => {
                        setEditingBlog(null);
                        setBlogTitle('');
                        setBlogCategory('News');
                        setBlogAuthor('Lina Linder');
                        setBlogDate('');
                        setBlogSummary('');
                        setBlogReadTime('5 min read');
                        setBlogSections([{ title: '', body: '' }]);
                        setCustomBlogFile(null);
                        setCustomAuthorFile(null);
                      }}
                      style={{ padding: '0.75rem 1.5rem', backgroundColor: 'transparent', color: theme.fg, border: `1px solid ${theme.border}`, borderRadius: '4px', cursor: 'pointer' }}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* List of Blogs */}
            <div style={{ padding: '2rem', border: `1px solid ${theme.border}`, borderRadius: '8px', backgroundColor: theme.inputBg }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem' }}>Published Blog Articles</h3>
              
              <div className="wm-table-wrapper">
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ borderBottom: `1px solid ${theme.border}` }}>
                      <th style={{ padding: '1rem', color: theme.muted, fontWeight: 500 }}>Title</th>
                      <th style={{ padding: '1rem', color: theme.muted, fontWeight: 500 }}>Author</th>
                      <th style={{ padding: '1rem', color: theme.muted, fontWeight: 500 }}>Category</th>
                      <th style={{ padding: '1rem', color: theme.muted, fontWeight: 500 }}>Date</th>
                      <th style={{ padding: '1rem', color: theme.muted, fontWeight: 500, textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {blogsData.length === 0 ? (
                      <tr><td colSpan={5} style={{ padding: '2rem', textAlign: 'center', color: theme.muted }}>No blog articles found.</td></tr>
                    ) : blogsData.map((b) => (
                      <tr key={b.id} style={{ borderBottom: `1px solid ${theme.border}` }}>
                        <td style={{ padding: '1rem', fontWeight: 500 }}>{b.title}</td>
                        <td style={{ padding: '1rem', color: theme.muted }}>{b.author}</td>
                        <td style={{ padding: '1rem', color: theme.muted }}>{b.category}</td>
                        <td style={{ padding: '1rem', color: theme.muted }}>{b.date}</td>
                        <td style={{ padding: '1rem', textAlign: 'right', whiteSpace: 'nowrap' }}>
                          <button 
                            onClick={() => {
                              setEditingBlog(b);
                              setBlogTitle(b.title);
                              setBlogCategory(b.category || 'News');
                              setBlogAuthor(b.author || 'Lina Linder');
                              setBlogDate(b.date || '');
                              setBlogSummary(b.summary || '');
                              setBlogReadTime(b.readTime || '5 min read');
                              setBlogSections(b.sections || [{ title: '', body: '' }]);
                              
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            style={{ padding: '0.5rem 1rem', backgroundColor: 'transparent', color: theme.fg, border: `1px solid ${theme.border}`, borderRadius: '4px', cursor: 'pointer', marginRight: '0.5rem', fontSize: '0.875rem' }}
                          >
                            Edit
                          </button>
                          <button 
                            onClick={async () => {
                              if (!window.confirm(`Are you sure you want to delete "${b.title}"?`)) return;
                              setLoading(true);
                              const formData = new FormData();
                              formData.append('action', 'delete');
                              formData.append('id', b.id);
                              try {
                                const res = await fetch('/api/blogs', { method: 'POST', body: formData });
                                if (res.ok) {
                                  const data = await res.json();
                                  setBlogsData(data.blogs || []);
                                } else {
                                  alert('Failed to delete blog.');
                                }
                              } catch (e) {
                                alert('Error deleting blog.');
                              }
                              setLoading(false);
                            }}
                            style={{ padding: '0.5rem 1rem', backgroundColor: isDarkMode ? '#3f0000' : '#fee2e2', color: isDarkMode ? '#ffaaaa' : '#dc2626', border: isDarkMode ? '1px solid #7f1d1d' : '1px solid #fca5a5', borderRadius: '4px', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 600 }}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case 'user-management':
        return (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
              <div>
                <h2 style={{ fontSize: '2rem', fontWeight: 700, margin: '0 0 0.5rem 0', letterSpacing: '-0.02em', color: theme.fg }}>
                  User Profiles &amp; Access Control (RBAC)
                </h2>
                <p style={{ fontSize: '0.875rem', color: theme.muted, margin: 0 }}>
                  Create employee profiles, assign custom roles, and grant granular page permissions with salted PBKDF2 encryption.
                </p>
              </div>
              <button
                type="button"
                onClick={fetchUsers}
                disabled={userMgmtLoading}
                style={{
                  padding: '0.6rem 1.25rem',
                  backgroundColor: theme.inputBg,
                  border: `1px solid ${theme.border}`,
                  color: theme.fg,
                  borderRadius: '8px',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  cursor: userMgmtLoading ? 'not-allowed' : 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ animation: userMgmtLoading ? 'spin 1s linear infinite' : 'none' }}>
                  <polyline points="23 4 23 10 17 10"/>
                  <polyline points="1 20 1 14 7 14"/>
                  <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
                </svg>
                <span>{userMgmtLoading ? 'Refreshing...' : 'Refresh Profiles'}</span>
              </button>
            </div>

            {userMgmtMsg && (
              <div style={{
                padding: '0.85rem 1.25rem',
                backgroundColor: isDarkMode ? '#052e16' : '#dcfce7',
                border: isDarkMode ? '1px solid #166534' : '1px solid #86efac',
                color: isDarkMode ? '#4ade80' : '#15803d',
                borderRadius: '8px',
                fontSize: '0.875rem',
                fontWeight: 600,
                marginBottom: '2rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  <span>{userMgmtMsg}</span>
                </div>
                <button type="button" onClick={() => setUserMgmtMsg('')} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', fontWeight: 700 }}>✕</button>
              </div>
            )}

            {/* Add / Edit Profile Form */}
            <div style={{ padding: '2rem', border: `1px solid ${theme.border}`, borderRadius: '12px', backgroundColor: theme.inputBg, marginBottom: '3rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem', color: theme.fg, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>
                <span>{editingUser ? `Edit Profile: ${editingUser.name}` : 'Create New Employee Profile'}</span>
              </h3>

              <form onSubmit={async (e) => {
                e.preventDefault();
                if (!newUserName.trim() || !newUserEmail.trim()) {
                  alert('Full name and email are required.');
                  return;
                }
                if (!editingUser && (!newUserPassword || newUserPassword.length < 6)) {
                  alert('Password must be at least 6 characters.');
                  return;
                }
                if (newUserPermissions.length === 0) {
                  alert('Please select at least one page permission for this profile.');
                  return;
                }

                setUserMgmtLoading(true);
                try {
                  const res = await callUsersApi({
                    action: editingUser ? 'update-user' : 'create-user',
                    id: editingUser?.id,
                    name: newUserName,
                    email: newUserEmail,
                    password: newUserPassword,
                    role: newUserRole,
                    permissions: newUserPermissions,
                    status: newUserStatus
                  });
                  const data = await res.json();
                  if (data.success) {
                    const origin = typeof window !== 'undefined' ? window.location.origin : '';
                    const generatedLink = `${origin}/webmaster?authKey=${data.loginKey || data.user?.loginKey}`;
                    
                    if (!editingUser) {
                      setCreatedUserCredentials({
                        name: newUserName,
                        email: newUserEmail,
                        password: newUserPassword,
                        loginLink: generatedLink
                      });
                    }

                    setUserMgmtMsg(editingUser ? 'Profile updated successfully.' : `Profile for ${newUserName} created successfully.`);
                    setNewUserName('');
                    setNewUserEmail('');
                    setNewUserPassword('');
                    setNewUserRole('Content Editor');
                    setNewUserPermissions(['blogs', 'press-releases']);
                    setNewUserStatus('active');
                    setEditingUser(null);
                    fetchUsers();
                  } else {
                    alert(data.error || 'Failed to save profile.');
                  }
                } catch (err) {
                  alert('Error saving user profile.');
                }
                setUserMgmtLoading(false);
              }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <div className="wm-grid-2col" style={{ display: 'grid', gap: '1.25rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.82rem', marginBottom: '0.45rem', color: theme.muted, fontWeight: 600 }}>Employee Full Name *</label>
                      <input
                        type="text"
                        value={newUserName}
                        onChange={(e) => setNewUserName(e.target.value)}
                        style={{ width: '100%', padding: '0.75rem', backgroundColor: theme.bg, border: `1px solid ${theme.border}`, color: theme.fg, outline: 'none', borderRadius: '6px' }}
                        placeholder="e.g. Sarah Jenkins"
                        required
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.82rem', marginBottom: '0.45rem', color: theme.muted, fontWeight: 600 }}>Official Email Address *</label>
                      <input
                        type="email"
                        value={newUserEmail}
                        onChange={(e) => setNewUserEmail(e.target.value)}
                        style={{ width: '100%', padding: '0.75rem', backgroundColor: theme.bg, border: `1px solid ${theme.border}`, color: theme.fg, outline: 'none', borderRadius: '6px' }}
                        placeholder="e.g. sarah@zawrindustries.com"
                        required
                        disabled={!!editingUser}
                      />
                    </div>
                  </div>

                  <div className="wm-grid-2col" style={{ display: 'grid', gap: '1.25rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.82rem', marginBottom: '0.45rem', color: theme.muted, fontWeight: 600 }}>Role / Job Title *</label>
                      <input
                        type="text"
                        value={newUserRole}
                        onChange={(e) => setNewUserRole(e.target.value)}
                        style={{ width: '100%', padding: '0.75rem', backgroundColor: theme.bg, border: `1px solid ${theme.border}`, color: theme.fg, outline: 'none', borderRadius: '6px' }}
                        placeholder="e.g. Content Lead / HR Specialist / Financial Analyst"
                        required
                      />
                    </div>
                    
                    {!editingUser && (
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.45rem' }}>
                          <label style={{ fontSize: '0.82rem', color: theme.muted, fontWeight: 600 }}>Assigned Initial Password *</label>
                          <button
                            type="button"
                            onClick={() => {
                              const randomPass = 'Zawr_' + Math.random().toString(36).substring(2, 8) + '!' + Math.floor(100 + Math.random() * 900);
                              setNewUserPassword(randomPass);
                            }}
                            style={{ background: 'none', border: 'none', color: '#38bdf8', fontSize: '0.75rem', cursor: 'pointer', fontWeight: 600, padding: 0, display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}
                          >
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                            <span>Auto Generate</span>
                          </button>
                        </div>
                        <input
                          type="text"
                          value={newUserPassword}
                          onChange={(e) => setNewUserPassword(e.target.value)}
                          style={{ width: '100%', padding: '0.75rem', backgroundColor: theme.bg, border: `1px solid ${theme.border}`, color: theme.fg, outline: 'none', borderRadius: '6px', fontFamily: 'monospace' }}
                          placeholder="Enter or generate temporary password"
                          required
                        />
                      </div>
                    )}
                  </div>

                  {/* Quick Preset Buttons */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', marginBottom: '0.65rem', color: theme.muted, fontWeight: 600 }}>
                      Role Access Presets:
                    </label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                      <button
                        type="button"
                        onClick={() => setNewUserPermissions(['*'])}
                        style={{ padding: '0.4rem 0.85rem', backgroundColor: newUserPermissions.includes('*') ? theme.fg : theme.bg, color: newUserPermissions.includes('*') ? theme.bg : theme.fg, border: `1px solid ${theme.border}`, borderRadius: '6px', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
                      >
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
                        <span>Super Admin (Full Access)</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setNewUserPermissions(['blogs', 'press-releases', 'notices', 'notifications'])}
                        style={{ padding: '0.4rem 0.85rem', backgroundColor: theme.bg, border: `1px solid ${theme.border}`, color: theme.fg, borderRadius: '6px', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
                      >
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                        <span>Content Desk (Blogs, Press, Notices)</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setNewUserPermissions(['jobs', 'email-routing'])}
                        style={{ padding: '0.4rem 0.85rem', backgroundColor: theme.bg, border: `1px solid ${theme.border}`, color: theme.fg, borderRadius: '6px', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
                      >
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
                        <span>HR &amp; Careers (Jobs, Routing)</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setNewUserPermissions(['financial-reports', 'events', 'pitch-deck'])}
                        style={{ padding: '0.4rem 0.85rem', backgroundColor: theme.bg, border: `1px solid ${theme.border}`, color: theme.fg, borderRadius: '6px', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
                      >
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
                        <span>Investor Desk (Financials, Events, Deck)</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setNewUserPermissions(['analytics', 'api-monitoring', 'mail-credentials'])}
                        style={{ padding: '0.4rem 0.85rem', backgroundColor: theme.bg, border: `1px solid ${theme.border}`, color: theme.fg, borderRadius: '6px', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
                      >
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                        <span>DevOps &amp; Telemetry (Analytics, Probes)</span>
                      </button>
                    </div>
                  </div>

                  {/* Granular Permission Checkbox Matrix */}
                  <div style={{ padding: '1.25rem', border: `1px solid ${theme.border}`, borderRadius: '8px', backgroundColor: theme.bg }}>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.85rem', color: theme.fg }}>
                      Granular Page Permissions Matrix:
                    </label>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))', gap: '0.75rem' }}>
                      {[
                        { id: 'analytics', label: 'Realtime Analytics', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg> },
                        { id: 'api-monitoring', label: 'API Health Probes', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg> },
                        { id: 'mail-credentials', label: 'Mail Settings', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg> },
                        { id: 'email-routing', label: 'Email Routing', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg> },
                        { id: 'jobs', label: 'Careers & Jobs', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg> },
                        { id: 'newsletters', label: 'Newsletters', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"/><path d="M18 14h-8"/><path d="M15 18h-5"/><path d="M10 6h8v4h-8z"/></svg> },
                        { id: 'pitch-deck', label: 'Pitch Deck', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg> },
                        { id: 'financial-reports', label: 'Financial Reports', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg> },
                        { id: 'events', label: 'Corporate Events', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg> },
                        { id: 'notices', label: 'Statutory Notices', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg> },
                        { id: 'notifications', label: 'Notifications', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg> },
                        { id: 'press-releases', label: 'Press Releases', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 11l18-5v12L3 13v-2z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/></svg> },
                        { id: 'blogs', label: 'Blog Articles', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg> },
                        { id: 'user-management', label: 'User & Access Control', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> },
                      ].map((mod) => {
                        const isChecked = newUserPermissions.includes('*') || newUserPermissions.includes(mod.id);
                        return (
                          <label
                            key={mod.id}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.6rem',
                              padding: '0.6rem 0.8rem',
                              backgroundColor: isChecked ? theme.hover : theme.inputBg,
                              border: isChecked ? `1px solid ${theme.fg}` : `1px solid ${theme.border}`,
                              borderRadius: '6px',
                              cursor: 'pointer',
                              fontSize: '0.8rem',
                              fontWeight: isChecked ? 700 : 400,
                              color: isChecked ? theme.fg : theme.muted,
                              transition: 'all 0.15s'
                            }}
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={(e) => {
                                if (newUserPermissions.includes('*')) {
                                  if (!e.target.checked) {
                                    setNewUserPermissions([
                                      'analytics', 'api-monitoring', 'mail-credentials', 'email-routing',
                                      'jobs', 'newsletters', 'pitch-deck', 'financial-reports',
                                      'events', 'notices', 'notifications', 'press-releases', 'blogs', 'user-management'
                                    ].filter(id => id !== mod.id));
                                  }
                                } else {
                                  if (e.target.checked) {
                                    setNewUserPermissions([...newUserPermissions, mod.id]);
                                  } else {
                                    setNewUserPermissions(newUserPermissions.filter(id => id !== mod.id));
                                  }
                                }
                              }}
                              style={{ accentColor: isDarkMode ? '#ffffff' : '#000000' }}
                            />
                            <span style={{ display: 'inline-flex', alignItems: 'center', opacity: isChecked ? 1 : 0.7 }}>{mod.icon}</span>
                            <span>{mod.label}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  {/* Account Status Toggle */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', userSelect: 'none' }}>
                      <input
                        type="checkbox"
                        checked={newUserStatus === 'active'}
                        onChange={(e) => setNewUserStatus(e.target.checked ? 'active' : 'suspended')}
                        style={{ width: '16px', height: '16px', accentColor: '#10b981' }}
                      />
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.875rem', fontWeight: 600, color: newUserStatus === 'active' ? '#10b981' : '#f59e0b' }}>
                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: newUserStatus === 'active' ? '#10b981' : '#f59e0b', boxShadow: newUserStatus === 'active' ? '0 0 8px #10b981' : '0 0 8px #f59e0b' }} />
                        {newUserStatus === 'active' ? 'Account Status: Active (Can sign in)' : 'Account Status: Suspended (Access locked)'}
                      </span>
                    </label>
                  </div>

                  {/* Submit & Cancel Buttons */}
                  <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                    <button
                      type="submit"
                      disabled={userMgmtLoading}
                      style={{
                        padding: '0.75rem 1.75rem',
                        backgroundColor: theme.fg,
                        color: theme.bg,
                        border: 'none',
                        fontWeight: 800,
                        borderRadius: '6px',
                        cursor: userMgmtLoading ? 'not-allowed' : 'pointer',
                        fontSize: '0.875rem'
                      }}
                    >
                      {userMgmtLoading ? 'Saving Profile...' : editingUser ? 'Update Profile' : 'Create Staff Profile'}
                    </button>

                    {editingUser && (
                      <button
                        type="button"
                        onClick={() => {
                          setEditingUser(null);
                          setNewUserName('');
                          setNewUserEmail('');
                          setNewUserPassword('');
                          setNewUserRole('Content Editor');
                          setNewUserPermissions(['blogs', 'press-releases']);
                          setNewUserStatus('active');
                        }}
                        style={{
                          padding: '0.75rem 1.5rem',
                          backgroundColor: 'transparent',
                          color: theme.fg,
                          border: `1px solid ${theme.border}`,
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '0.875rem'
                        }}
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </form>
            </div>

            {/* Modal for Newly Generated Profile Credentials & Unique Login Link */}
            {createdUserCredentials && (
              <div style={{
                position: 'fixed',
                inset: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                backdropFilter: 'blur(6px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 10000,
                padding: '1.25rem'
              }}>
                <div style={{
                  backgroundColor: theme.inputBg,
                  border: `1px solid ${theme.border}`,
                  borderRadius: '16px',
                  padding: '2.25rem',
                  maxWidth: '540px',
                  width: '100%',
                  boxShadow: '0 25px 60px rgba(0, 0, 0, 0.9)'
                }}>
                  <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '56px', height: '56px', borderRadius: '50%', backgroundColor: isDarkMode ? '#052e16' : '#dcfce7', color: '#10b981', marginBottom: '1rem', border: '1px solid #10b981' }}>
                      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                    </div>
                    <h3 style={{ fontSize: '1.4rem', fontWeight: 800, margin: '0 0 0.4rem 0', color: theme.fg }}>
                      Profile &amp; Unique Login Link Generated!
                    </h3>
                    <p style={{ fontSize: '0.82rem', color: theme.muted, margin: 0 }}>
                      Share these official credentials and the unique login link with the employee.
                    </p>
                  </div>

                  <div style={{ backgroundColor: theme.bg, border: `1px solid ${theme.border}`, borderRadius: '10px', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.9rem', marginBottom: '1.5rem', fontSize: '0.85rem' }}>
                    <div>
                      <span style={{ color: theme.muted, fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Employee Name</span>
                      <div style={{ fontWeight: 700, color: theme.fg, marginTop: '0.2rem' }}>{createdUserCredentials.name}</div>
                    </div>
                    <div>
                      <span style={{ color: theme.muted, fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Official Email</span>
                      <div style={{ fontWeight: 700, color: theme.fg, fontFamily: 'monospace', marginTop: '0.2rem' }}>{createdUserCredentials.email}</div>
                    </div>
                    <div>
                      <span style={{ color: theme.muted, fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Temporary Password</span>
                      <div style={{ fontWeight: 700, color: '#38bdf8', fontFamily: 'monospace', marginTop: '0.2rem' }}>{createdUserCredentials.password}</div>
                    </div>
                    <div>
                      <span style={{ color: theme.muted, fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Unique Profile Login Link</span>
                      <div style={{ fontWeight: 600, color: '#38bdf8', fontFamily: 'monospace', fontSize: '0.78rem', wordBreak: 'break-all', backgroundColor: theme.inputBg, padding: '0.65rem 0.75rem', borderRadius: '6px', border: `1px solid ${theme.border}`, marginTop: '0.35rem' }}>
                        {createdUserCredentials.loginLink}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                    <button
                      type="button"
                      onClick={() => {
                        const textToCopy = `Official Webmaster Access Credentials:\n\n• Name: ${createdUserCredentials.name}\n• Email: ${createdUserCredentials.email}\n• Password: ${createdUserCredentials.password}\n• Login Link: ${createdUserCredentials.loginLink}\n\nPlease keep these credentials secure.`;
                        navigator.clipboard.writeText(textToCopy);
                        setCopiedCreds(true);
                        setTimeout(() => setCopiedCreds(false), 3000);
                      }}
                      style={{
                        flex: 1,
                        padding: '0.75rem 1rem',
                        backgroundColor: copiedCreds ? '#10b981' : theme.fg,
                        color: copiedCreds ? '#ffffff' : theme.bg,
                        border: 'none',
                        borderRadius: '8px',
                        fontWeight: 800,
                        fontSize: '0.85rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem'
                      }}
                    >
                      {copiedCreds ? (
                        <>
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                          <span>All Credentials Copied!</span>
                        </>
                      ) : (
                        <>
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                          <span>Copy All Credentials</span>
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => setCreatedUserCredentials(null)}
                      style={{
                        padding: '0.75rem 1.25rem',
                        backgroundColor: 'transparent',
                        border: `1px solid ${theme.border}`,
                        color: theme.fg,
                        borderRadius: '8px',
                        fontWeight: 600,
                        fontSize: '0.85rem',
                        cursor: 'pointer'
                      }}
                    >
                      Done
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* User Directory Table */}
            <div style={{ padding: '2rem', border: `1px solid ${theme.border}`, borderRadius: '12px', backgroundColor: theme.inputBg }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem', color: theme.fg, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                <span>Registered Staff &amp; Access Profiles ({allUsers.length})</span>
              </h3>

              <div className="wm-table-wrapper">
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
                  <thead>
                    <tr style={{ borderBottom: `1px solid ${theme.border}` }}>
                      <th style={{ padding: '1rem', color: theme.muted, fontWeight: 600 }}>Employee Name &amp; Email</th>
                      <th style={{ padding: '1rem', color: theme.muted, fontWeight: 600 }}>Role</th>
                      <th style={{ padding: '1rem', color: theme.muted, fontWeight: 600 }}>Granted Pages</th>
                      <th style={{ padding: '1rem', color: theme.muted, fontWeight: 600 }}>Unique Login Link</th>
                      <th style={{ padding: '1rem', color: theme.muted, fontWeight: 600 }}>Status</th>
                      <th style={{ padding: '1rem', color: theme.muted, fontWeight: 600 }}>Last Login</th>
                      <th style={{ padding: '1rem', color: theme.muted, fontWeight: 600, textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allUsers.length === 0 ? (
                      <tr><td colSpan={7} style={{ padding: '2rem', textAlign: 'center', color: theme.muted }}>No user profiles registered yet.</td></tr>
                    ) : allUsers.map((u) => (
                      <tr key={u.id} style={{ borderBottom: `1px solid ${theme.border}` }}>
                        <td style={{ padding: '1rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                            <div style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '50%',
                              backgroundColor: isDarkMode ? '#27272a' : '#e2e8f0',
                              color: theme.fg,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontWeight: 800,
                              fontSize: '0.8rem'
                            }}>
                              {(u.name?.[0] || 'U').toUpperCase()}
                            </div>
                            <div>
                              <div style={{ fontWeight: 700, color: theme.fg }}>{u.name}</div>
                              <div style={{ fontSize: '0.75rem', color: theme.muted }}>{u.email}</div>
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: '1rem', fontWeight: 600 }}>{u.role}</td>
                        <td style={{ padding: '1rem' }}>
                          {u.permissions.includes('*') ? (
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', padding: '0.25rem 0.6rem', backgroundColor: isDarkMode ? '#1e1b4b' : '#eff6ff', color: '#38bdf8', border: isDarkMode ? '1px solid #3730a3' : '1px solid #bfdbfe', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700 }}>
                              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
                              <span>Full Master Access</span>
                            </span>
                          ) : (
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem', maxWidth: '240px' }}>
                              {u.permissions.map((p: string) => (
                                <span key={p} style={{ padding: '0.15rem 0.4rem', backgroundColor: theme.bg, border: `1px solid ${theme.border}`, borderRadius: '4px', fontSize: '0.7rem', color: theme.muted }}>
                                  {p}
                                </span>
                              ))}
                            </div>
                          )}
                        </td>
                        <td style={{ padding: '1rem', whiteSpace: 'nowrap' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                            <button
                              type="button"
                              onClick={() => {
                                const origin = typeof window !== 'undefined' ? window.location.origin : '';
                                const fullUrl = `${origin}/webmaster?authKey=${u.loginKey}`;
                                navigator.clipboard.writeText(fullUrl);
                                setCopiedLinkId(u.id);
                                setTimeout(() => setCopiedLinkId(null), 2500);
                              }}
                              style={{
                                padding: '0.35rem 0.65rem',
                                backgroundColor: copiedLinkId === u.id ? '#10b981' : (isDarkMode ? '#1e1b4b' : '#eff6ff'),
                                color: copiedLinkId === u.id ? '#ffffff' : (isDarkMode ? '#38bdf8' : '#0284c7'),
                                border: copiedLinkId === u.id ? '1px solid #10b981' : `1px solid ${isDarkMode ? '#3730a3' : '#bfdbfe'}`,
                                borderRadius: '6px',
                                fontSize: '0.74rem',
                                fontWeight: 700,
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.35rem',
                                transition: 'all 0.15s'
                              }}
                            >
                              {copiedLinkId === u.id ? (
                                <>
                                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                                  <span>Copied Link!</span>
                                </>
                              ) : (
                                <>
                                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
                                  <span>Copy Login Link</span>
                                </>
                              )}
                            </button>
                            
                            <button
                              type="button"
                              title="Regenerate & Revoke Old Link"
                              onClick={async () => {
                                if (!window.confirm(`Regenerate unique login link for "${u.name}"? The previous link will be permanently revoked.`)) return;
                                 setUserMgmtLoading(true);
                                try {
                                  const res = await callUsersApi({
                                    action: 'regenerate-login-key',
                                    id: u.id
                                  });
                                  const data = await res.json();
                                  if (data.success && data.loginKey) {
                                    const origin = typeof window !== 'undefined' ? window.location.origin : '';
                                    const fullUrl = `${origin}/webmaster?authKey=${data.loginKey}`;
                                    alert(`New unique login link generated for ${u.name}!\n\nLink: ${fullUrl}`);
                                    fetchUsers();
                                  } else {
                                    alert(data.error || 'Failed to regenerate link.');
                                  }
                                } catch (err) {
                                  alert('Error regenerating link.');
                                }
                                setUserMgmtLoading(false);
                              }}
                              style={{
                                padding: '0.35rem 0.5rem',
                                backgroundColor: 'transparent',
                                color: theme.muted,
                                border: `1px solid ${theme.border}`,
                                borderRadius: '6px',
                                fontSize: '0.74rem',
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                              }}
                            >
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>
                            </button>
                          </div>
                        </td>
                        <td style={{ padding: '1rem' }}>
                          {u.status === 'active' ? (
                            <span style={{ color: '#10b981', backgroundColor: isDarkMode ? '#064e3b' : '#dcfce7', padding: '0.25rem 0.6rem', borderRadius: '9999px', fontSize: '0.72rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                              <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10b981' }} />
                              <span>Active</span>
                            </span>
                          ) : (
                            <span style={{ color: '#f59e0b', backgroundColor: isDarkMode ? '#451a03' : '#fef3c7', padding: '0.25rem 0.6rem', borderRadius: '9999px', fontSize: '0.72rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                              <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#f59e0b' }} />
                              <span>Suspended</span>
                            </span>
                          )}
                        </td>
                        <td style={{ padding: '1rem', fontSize: '0.78rem', color: theme.muted }}>
                          {u.lastLogin ? new Date(u.lastLogin).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Never logged in'}
                        </td>
                        <td style={{ padding: '1rem', textAlign: 'right', whiteSpace: 'nowrap' }}>
                          <button
                            type="button"
                            onClick={() => {
                              setEditingUser(u);
                              setNewUserName(u.name);
                              setNewUserEmail(u.email);
                              setNewUserRole(u.role);
                              setNewUserPermissions(u.permissions);
                              setNewUserStatus(u.status);
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            style={{ padding: '0.45rem 0.75rem', backgroundColor: 'transparent', color: theme.fg, border: `1px solid ${theme.border}`, borderRadius: '4px', cursor: 'pointer', marginRight: '0.4rem', fontSize: '0.78rem', fontWeight: 600 }}
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={async () => {
                              const newPass = prompt(`Enter new temporary password for ${u.name} (min 6 characters):`);
                              if (!newPass) return;
                              if (newPass.length < 6) {
                                alert('Password must be at least 6 characters.');
                                return;
                              }
                              setUserMgmtLoading(true);
                              try {
                                const res = await callUsersApi({
                                  action: 'reset-password',
                                  id: u.id,
                                  newPassword: newPass
                                });
                                const data = await res.json();
                                if (data.success) {
                                  alert(`Password for ${u.name} reset successfully!\nShare new password with employee: ${newPass}`);
                                } else {
                                  alert(data.error || 'Failed to reset password.');
                                }
                              } catch (err) {
                                alert('Error resetting password.');
                              }
                              setUserMgmtLoading(false);
                            }}
                            style={{ padding: '0.45rem 0.75rem', backgroundColor: 'transparent', color: theme.fg, border: `1px solid ${theme.border}`, borderRadius: '4px', cursor: 'pointer', marginRight: '0.4rem', fontSize: '0.78rem', fontWeight: 600 }}
                          >
                            Reset Pass
                          </button>
                          <button
                            type="button"
                            onClick={async () => {
                              const nextStatus = u.status === 'active' ? 'suspended' : 'active';
                              setUserMgmtLoading(true);
                              try {
                                const res = await callUsersApi({
                                  action: 'update-user',
                                  id: u.id,
                                  status: nextStatus
                                });
                                const data = await res.json();
                                if (data.success) {
                                  fetchUsers();
                                } else {
                                  alert(data.error || 'Failed to toggle status.');
                                }
                              } catch (err) {
                                alert('Error toggling status.');
                              }
                              setUserMgmtLoading(false);
                            }}
                            style={{ padding: '0.45rem 0.75rem', backgroundColor: 'transparent', color: u.status === 'active' ? '#f59e0b' : '#10b981', border: u.status === 'active' ? '1px solid #d97706' : '1px solid #059669', borderRadius: '4px', cursor: 'pointer', marginRight: '0.4rem', fontSize: '0.78rem', fontWeight: 600 }}
                          >
                            {u.status === 'active' ? 'Suspend' : 'Activate'}
                          </button>
                          <button
                            type="button"
                            onClick={async () => {
                              if (!window.confirm(`Are you sure you want to permanently delete user profile for "${u.name}" (${u.email})?`)) return;
                              setUserMgmtLoading(true);
                              try {
                                const res = await callUsersApi({
                                  action: 'delete-user',
                                  id: u.id
                                });
                                const data = await res.json();
                                if (data.success) {
                                  fetchUsers();
                                } else {
                                  alert(data.error || 'Failed to delete user.');
                                }
                              } catch (err) {
                                alert('Error deleting user.');
                              }
                              setUserMgmtLoading(false);
                            }}
                            style={{ padding: '0.45rem 0.75rem', backgroundColor: isDarkMode ? '#3f0000' : '#fee2e2', color: isDarkMode ? '#ffaaaa' : '#dc2626', border: isDarkMode ? '1px solid #7f1d1d' : '1px solid #fca5a5', borderRadius: '4px', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600 }}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const navItems = ALL_NAV_ITEMS.filter((item: { id: string; label: string }) => {
    if (!currentUser) return true;
    if (currentUser.permissions.includes('*')) return true;
    return currentUser.permissions.includes(item.id);
  });

  const isSuperAdmin = currentUser ? (currentUser.permissions.includes('*') || currentUser.role === 'Super Administrator') : false;

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: theme.bg, color: theme.fg, fontFamily: 'sans-serif', overflow: 'hidden' }}>
      
      <style dangerouslySetInnerHTML={{__html: `
        header, footer, .support-widget, .cookie-banner { display: none !important; }
        body { overflow: hidden !important; margin: 0; }
        
        /* Mobile-First Responsive Classes */
        @media (max-width: 1024px) {
          .wm-mobile-header { display: flex !important; }
          .wm-sidebar-overlay { display: block !important; }
          .wm-sidebar {
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            bottom: 0 !important;
            z-index: 1000 !important;
            box-shadow: 0 0 50px rgba(0, 0, 0, 0.85) !important;
            transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1) !important;
          }
          .wm-sidebar-closed { transform: translateX(-100%) !important; }
          .wm-sidebar-open { transform: translateX(0) !important; }
          .wm-main-area { flex-direction: column !important; height: calc(100vh - 60px) !important; }
          .wm-workspace-col { padding: 1.25rem 1rem !important; flex: 1 1 100% !important; max-width: 100% !important; }
          .wm-grid-2col { grid-template-columns: 1fr !important; }
          .wm-preview-col {
            position: fixed !important;
            bottom: 0 !important;
            left: 0 !important;
            right: 0 !important;
            height: 82vh !important;
            z-index: 990 !important;
            width: 100% !important;
            max-width: 100% !important;
            border-radius: 16px 16px 0 0 !important;
            box-shadow: 0 -10px 40px rgba(0, 0, 0, 0.7) !important;
          }
        }

        @media (min-width: 1025px) {
          .wm-mobile-header { display: none !important; }
          .wm-sidebar-overlay { display: none !important; }
          .wm-sidebar { position: relative !important; transform: none !important; }
          .wm-main-area { flex-direction: row !important; height: 100vh !important; }
          .wm-workspace-col { padding: 2.5rem 3rem !important; }
          .wm-grid-2col { grid-template-columns: 1fr 1fr !important; }
        }

        /* Responsive Table Containers */
        .wm-table-wrapper {
          width: 100%;
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
        }
        .wm-table-wrapper table {
          min-width: 580px;
        }
      `}} />

      {/* Mobile Top Header Bar (Visible on <= 1024px) */}
      <div className="wm-mobile-header" style={{
        display: 'none',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0.75rem 1rem',
        backgroundColor: theme.sidebarBg || theme.bg,
        borderBottom: `1px solid ${theme.border}`,
        position: 'sticky',
        top: 0,
        zIndex: 900,
        flexShrink: 0,
        height: '60px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '6px',
              backgroundColor: theme.inputBg,
              border: `1px solid ${theme.border}`,
              color: theme.fg,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              fontSize: '1.2rem',
              padding: 0,
            }}
            aria-label="Toggle Navigation Menu"
          >
            {isMobileMenuOpen ? '✕' : '☰'}
          </button>
          <img
            src={isDarkMode ? "/assets/logo-white.png" : "/assets/logo-black.png"}
            alt="Zawr Industries"
            style={{ height: '36px', width: 'auto', maxWidth: '140px', objectFit: 'contain' }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{
            fontSize: '0.75rem',
            fontWeight: 700,
            padding: '0.25rem 0.55rem',
            borderRadius: '6px',
            backgroundColor: theme.inputBg,
            border: `1px solid ${theme.border}`,
            color: theme.fg,
            maxWidth: '120px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}>
            {navItems.find(n => n.id === activeTab)?.label || 'Dashboard'}
          </span>
          <button
            type="button"
            onClick={() => setIsDarkMode(!isDarkMode)}
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '6px',
              backgroundColor: theme.inputBg,
              border: `1px solid ${theme.border}`,
              color: isDarkMode ? '#f59e0b' : '#3b82f6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
            aria-label="Toggle Theme"
          >
            {isDarkMode ? '☀' : '☾'}
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div className="wm-main-area" style={{ flex: 1, display: 'flex', overflow: 'hidden', position: 'relative' }}>

        {/* Mobile Drawer Backdrop Overlay */}
        {isMobileMenuOpen && (
          <div
            className="wm-sidebar-overlay"
            onClick={() => setIsMobileMenuOpen(false)}
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.65)',
              backdropFilter: 'blur(4px)',
              zIndex: 998,
            }}
          />
        )}

        {/* Sidebar (Desktop Static / Mobile Off-Canvas Drawer) */}
        <div className={`wm-sidebar ${isMobileMenuOpen ? 'wm-sidebar-open' : 'wm-sidebar-closed'}`} style={{
          width: '280px',
          borderRight: `1px solid ${theme.border}`,
          display: 'flex',
          flexDirection: 'column',
          flexShrink: 0,
          backgroundColor: theme.sidebarBg || theme.bg,
          height: '100%',
        }}>
          {/* Sidebar Header with Company Logo */}
          <div style={{ padding: '1.25rem 1.75rem 1.15rem 1.75rem', borderBottom: `1px solid ${theme.border}` }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.65rem' }}>
              <img
                src={isDarkMode ? "/assets/logo-white.png" : "/assets/logo-black.png"}
                alt="Zawr Industries"
                style={{
                  height: '76px',
                  width: 'auto',
                  maxWidth: '225px',
                  objectFit: 'contain',
                  objectPosition: 'left center',
                  display: 'block'
                }}
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.75rem', color: theme.muted }}>
              <span style={{ width: '8px', height: '8px', backgroundColor: '#10b981', borderRadius: '50%', display: 'inline-block', boxShadow: '0 0 8px rgba(16, 185, 129, 0.6)' }} />
              <span style={{ fontWeight: 600 }}>Webmaster • Live Synced</span>
            </div>
          </div>
          
          <nav style={{ flex: 1, padding: '1rem 0', overflowY: 'auto' }}>
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsMobileMenuOpen(false);
                }}
                style={{
                  width: '100%',
                  textAlign: 'left',
                  padding: '0.75rem 1.75rem',
                  backgroundColor: activeTab === item.id ? theme.hover : 'transparent',
                  border: 'none',
                  color: activeTab === item.id ? theme.fg : theme.muted,
                  fontWeight: activeTab === item.id ? 700 : 400,
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <span>{item.label}</span>
                {activeTab === item.id && (
                  <span style={{ width: '5px', height: '5px', backgroundColor: '#38bdf8', borderRadius: '50%' }} />
                )}
              </button>
            ))}
          </nav>

          {/* Sidebar Footer with Dropup Profile & Controls */}
          <div style={{ padding: '1rem 1.25rem', borderTop: `1px solid ${theme.border}`, backgroundColor: theme.sidebarBg || theme.bg, position: 'relative' }}>
            
            {/* Backdrop for closing dropup when clicking outside */}
            {showUserDropup && (
              <div
                onClick={() => setShowUserDropup(false)}
                style={{ position: 'fixed', inset: 0, zIndex: 100 }}
              />
            )}

            {/* Vertical Dropup Menu Card */}
            {showUserDropup && (
              <div style={{
                position: 'absolute',
                bottom: 'calc(100% + 0.5rem)',
                left: '1.25rem',
                right: '1.25rem',
                backgroundColor: theme.bg,
                border: `1px solid ${theme.border}`,
                borderRadius: '10px',
                boxShadow: isDarkMode ? '0 12px 30px rgba(0, 0, 0, 0.85)' : '0 12px 30px rgba(0, 0, 0, 0.12)',
                padding: '0.4rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.2rem',
                zIndex: 101,
              }}>
                {/* Option 1: Profile */}
                <button
                  type="button"
                  onClick={() => {
                    setShowProfileModal(true);
                    setShowUserDropup(false);
                  }}
                  style={{
                    width: '100%',
                    padding: '0.6rem 0.75rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.65rem',
                    backgroundColor: 'transparent',
                    color: theme.fg,
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    textAlign: 'left',
                    transition: 'background-color 0.15s ease',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = theme.hover || 'rgba(255,255,255,0.05)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  <span>Profile</span>
                </button>

                {/* Option 2: Theme Toggle */}
                <button
                  type="button"
                  onClick={() => {
                    setIsDarkMode(!isDarkMode);
                  }}
                  style={{
                    width: '100%',
                    padding: '0.6rem 0.75rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    backgroundColor: 'transparent',
                    color: theme.fg,
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    textAlign: 'left',
                    transition: 'background-color 0.15s ease',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = theme.hover || 'rgba(255,255,255,0.05)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    {isDarkMode ? (
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
                    ) : (
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
                    )}
                    <span>Theme</span>
                  </div>
                  <span style={{ fontSize: '0.72rem', color: isDarkMode ? '#f59e0b' : '#3b82f6', backgroundColor: theme.inputBg, border: `1px solid ${theme.border}`, padding: '0.15rem 0.45rem', borderRadius: '4px', fontWeight: 700 }}>
                    {isDarkMode ? 'Dark' : 'Light'}
                  </span>
                </button>

                {/* Option 3: Settings (Super Administrator Only) */}
                {isSuperAdmin && (
                  <button
                    type="button"
                    onClick={() => {
                      setShowSettingsModal(true);
                      setShowUserDropup(false);
                    }}
                    style={{
                      width: '100%',
                      padding: '0.6rem 0.75rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.65rem',
                      backgroundColor: 'transparent',
                      color: theme.fg,
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      textAlign: 'left',
                      transition: 'background-color 0.15s ease',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = theme.hover || 'rgba(255,255,255,0.05)'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
                    <span>Settings</span>
                  </button>
                )}

                <div style={{ height: '1px', backgroundColor: theme.border, margin: '0.2rem 0.25rem' }} />

                {/* Option 4: Logout */}
                <button
                  type="button"
                  onClick={() => {
                    setShowUserDropup(false);
                    try {
                      sessionStorage.removeItem('webmaster_session_token');
                      sessionStorage.removeItem('webmaster_logged_in');
                      sessionStorage.removeItem('webmaster_authorized');
                    } catch (e) {}
                    setCurrentUser(null);
                    setSessionToken(null);
                    setIsAuthenticated(false);
                    setAuthorized(false);
                    router.push('/');
                  }}
                  style={{
                    width: '100%',
                    padding: '0.6rem 0.75rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.65rem',
                    backgroundColor: 'transparent',
                    color: '#ef4444',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    textAlign: 'left',
                    transition: 'background-color 0.15s ease',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = isDarkMode ? 'rgba(239, 68, 68, 0.1)' : '#fee2e2'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                  <span>Logout / Exit</span>
                </button>
              </div>
            )}

            {/* Main User Card / Dropup Trigger Button */}
            <button
              type="button"
              onClick={() => setShowUserDropup(!showUserDropup)}
              style={{
                width: '100%',
                padding: '0.6rem 0.75rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: showUserDropup ? theme.inputBg : 'transparent',
                border: `1px solid ${showUserDropup ? theme.fg : theme.border}`,
                borderRadius: '8px',
                cursor: 'pointer',
                color: theme.fg,
                transition: 'all 0.15s ease',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: isDarkMode ? '#27272a' : '#09090b',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '0.85rem'
                }}>
                  {(currentUser?.name?.[0] || 'A').toUpperCase()}
                </div>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, lineHeight: 1.2, color: theme.fg }}>{currentUser?.name || 'Admin User'}</div>
                  <div style={{ fontSize: '0.7rem', color: theme.muted, lineHeight: 1.2 }}>{currentUser?.role || currentUser?.email || 'Super Administrator'}</div>
                </div>
              </div>

              {/* Dropup Chevron Indicator */}
              <div style={{ display: 'flex', alignItems: 'center', color: theme.muted, padding: '0.2rem' }}>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{
                    transform: showUserDropup ? 'rotate(180deg)' : 'none',
                    transition: 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                >
                  <polyline points="18 15 12 9 6 15"/>
                </svg>
              </div>
            </button>
          </div>
        </div>

        {/* Main Workspace Area (Split into Editor & Realtime Live Site Preview) */}
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden', position: 'relative', width: '100%' }}>
          
          {/* Left/Middle: Editor Form Column */}
          <div className="wm-workspace-col" style={{ flex: showLivePreview ? '1 1 55%' : '1 1 100%', overflowY: 'auto', transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)' }}>
            
            {/* Top Workspace Header with Toggle Button */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.5rem' }}>
              <button
                type="button"
                onClick={() => setShowLivePreview(!showLivePreview)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.4rem 0.85rem',
                  backgroundColor: showLivePreview ? theme.inputBg : theme.fg,
                  color: showLivePreview ? theme.fg : theme.bg,
                  border: `1px solid ${theme.border}`,
                  borderRadius: '6px',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                {showLivePreview ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                ) : (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
                )}
                {showLivePreview ? 'Hide Live Browser Mirror' : 'Show Live Browser Mirror'}
              </button>
            </div>

            <div style={{ maxWidth: showLivePreview ? '920px' : '100%', width: '100%', transition: 'max-width 0.3s cubic-bezier(0.16, 1, 0.3, 1)' }}>
              {renderContent()}
            </div>
          </div>

          {/* Right: Live Interactive Browser Preview Panel */}
          {showLivePreview && (
            <div className="wm-preview-col" style={{ width: '480px', minWidth: '340px', maxWidth: '580px', flex: '1 1 45%', height: '100%', display: 'flex', flexDirection: 'column' }}>
              <LiveSitePreview
                activeTab={activeTab}
                theme={theme}
                onClose={() => setShowLivePreview(false)}
                data={{
                  // Jobs
                newJob,
                // Blogs
                blogTitle,
                blogCategory,
                blogAuthor,
                blogDate,
                blogReadTime,
                blogSummary,
                blogSections,
                blogImage: editingBlog ? editingBlog.image : undefined,
                authorImage: editingBlog ? editingBlog.authorImage : undefined,
                // Notices
                noticeTitle,
                noticeCategory,
                noticeDate,
                noticeSummary,
                noticeBody,
                noticeAttachmentName: customNoticeFile ? customNoticeFile.name : (editingNotice ? 'Notice Document.pdf' : undefined),
                noticeLinkName,
                noticeLinkUrl,
                // Notifications
                notifTitle,
                notifCategory,
                notifDate,
                notifSummary,
                notifBody,
                // Events
                eventTitle,
                eventSubtitle,
                eventDesc,
                eventStartDate,
                eventEndDate,
                eventStartTime,
                eventEndTime,
                eventVenue,
                eventSpecialNote,
                eventTicketsBooked,
                eventTicketsCapacity,
                eventImage,
                // Press Releases
                pressTitle,
                pressCategory,
                pressDate,
                pressSummary,
                pressBody,
                pressAttachmentName: customPressFile ? customPressFile.name : (editingPress ? 'Press Release Document.pdf' : undefined),
                pressLinkName,
                pressLinkUrl,
              }}
            />
          </div>
        )}

      </div>
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* WEBMASTER PROFILE MODAL */}
      {/* ───────────────────────────────────────────────────────────── */}
      {showProfileModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(6px)',
          zIndex: 99999,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '1.5rem'
        }}>
          <div style={{
            width: '100%',
            maxWidth: '520px',
            backgroundColor: theme.bg,
            border: `1px solid ${theme.border}`,
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: '0 25px 60px rgba(0,0,0,0.85)'
          }}>
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: `1px solid ${theme.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: theme.inputBg }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  backgroundColor: theme.hover,
                  color: theme.fg,
                  border: `1px solid ${theme.border}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '0.95rem'
                }}>
                  {(currentUser?.name?.[0] || 'U').toUpperCase()}
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: theme.fg }}>{currentUser?.name || 'User Profile'}</h3>
                  <span style={{ fontSize: '0.72rem', color: theme.muted }}>{currentUser?.role || 'Staff Account'}</span>
                </div>
              </div>
              <button
                onClick={() => setShowProfileModal(false)}
                style={{ background: 'none', border: 'none', color: theme.muted, cursor: 'pointer', fontSize: '1.25rem', padding: '0.25rem' }}
              >
                ✕
              </button>
            </div>

            <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ padding: '1rem', backgroundColor: theme.inputBg, border: `1px solid ${theme.border}`, borderRadius: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <span style={{ fontSize: '0.75rem', color: theme.muted }}>Role &amp; Access Tier</span>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: isSuperAdmin ? '#10b981' : '#38bdf8', backgroundColor: isSuperAdmin ? 'rgba(16,185,129,0.1)' : 'rgba(56,189,248,0.1)', padding: '0.2rem 0.6rem', borderRadius: '20px' }}>
                    {isSuperAdmin ? 'Super Administrator (Tier 1)' : `${currentUser?.role || 'Staff Member'} (Restricted)`}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <span style={{ fontSize: '0.75rem', color: theme.muted }}>Official Email</span>
                  <span style={{ fontSize: '0.78rem', fontWeight: 700, color: theme.fg }}>{currentUser?.email || 'N/A'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <span style={{ fontSize: '0.75rem', color: theme.muted }}>Authentication Protocol</span>
                  <span style={{ fontSize: '0.78rem', fontWeight: 700, color: theme.fg }}>{isSuperAdmin ? 'Master Challenge Protocol' : 'Unique HMAC Profile Token'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.75rem', color: theme.muted }}>Session Status</span>
                  <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#10b981' }}>Active &amp; Authenticated</span>
                </div>
              </div>

              <div>
                <h4 style={{ fontSize: '0.8rem', fontWeight: 700, color: theme.muted, textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 0.5rem 0' }}>
                  {isSuperAdmin ? 'Master Access Privileges' : 'Granted Desk Permissions'}
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem', fontSize: '0.75rem' }}>
                  {isSuperAdmin ? (
                    <div style={{ padding: '0.45rem 0.6rem', backgroundColor: theme.inputBg, border: `1px solid ${theme.border}`, borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '0.4rem', gridColumn: '1 / -1' }}>
                      <span style={{ color: '#10b981' }}>✓</span> Full Master Access Across All 14 Desks &amp; User Controls
                    </div>
                  ) : (
                    ALL_NAV_ITEMS.filter(item => currentUser?.permissions?.includes(item.id)).map(item => (
                      <div key={item.id} style={{ padding: '0.45rem 0.6rem', backgroundColor: theme.inputBg, border: `1px solid ${theme.border}`, borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <span style={{ color: '#10b981' }}>✓</span> {item.label}
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                <button
                  onClick={() => setShowProfileModal(false)}
                  style={{
                    padding: '0.55rem 1.25rem',
                    backgroundColor: theme.fg,
                    color: theme.bg,
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Close Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* WEBMASTER SETTINGS MODAL (SUPERADMIN ONLY) */}
      {/* ───────────────────────────────────────────────────────────── */}
      {showSettingsModal && isSuperAdmin && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(6px)',
          zIndex: 99999,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '1.5rem'
        }}>
          <div style={{
            width: '100%',
            maxWidth: '540px',
            backgroundColor: theme.bg,
            border: `1px solid ${theme.border}`,
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: '0 25px 60px rgba(0,0,0,0.85)'
          }}>
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: `1px solid ${theme.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: theme.inputBg }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: theme.fg }}>System &amp; Console Settings</h3>
                <span style={{ fontSize: '0.72rem', color: theme.muted }}>Configure webmaster environment preferences</span>
              </div>
              <button
                onClick={() => setShowSettingsModal(false)}
                style={{ background: 'none', border: 'none', color: theme.muted, cursor: 'pointer', fontSize: '1.25rem', padding: '0.25rem' }}
              >
                ✕
              </button>
            </div>

            <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              
              {/* Theme Preference */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 1rem', backgroundColor: theme.inputBg, border: `1px solid ${theme.border}`, borderRadius: '8px' }}>
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: theme.fg }}>Dashboard Theme</div>
                  <div style={{ fontSize: '0.72rem', color: theme.muted }}>Current interface theme: {isDarkMode ? 'Dark Stealth' : 'Light Clean'}</div>
                </div>
                <button
                  onClick={() => setIsDarkMode(!isDarkMode)}
                  style={{
                    padding: '0.4rem 0.9rem',
                    backgroundColor: theme.hover,
                    color: theme.fg,
                    border: `1px solid ${theme.border}`,
                    borderRadius: '6px',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Switch to {isDarkMode ? 'Light' : 'Dark'}
                </button>
              </div>

              {/* Database Status */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 1rem', backgroundColor: theme.inputBg, border: `1px solid ${theme.border}`, borderRadius: '8px' }}>
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: theme.fg }}>Supabase Realtime Database</div>
                  <div style={{ fontSize: '0.72rem', color: theme.muted }}>PostgreSQL engine with edge socket listener</div>
                </div>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#10b981', backgroundColor: 'rgba(16,185,129,0.1)', padding: '0.25rem 0.65rem', borderRadius: '20px' }}>Connected</span>
              </div>

              {/* Mail Gateway */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 1rem', backgroundColor: theme.inputBg, border: `1px solid ${theme.border}`, borderRadius: '8px' }}>
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: theme.fg }}>Gmail SMTP Dispatch Relay</div>
                  <div style={{ fontSize: '0.72rem', color: theme.muted }}>SSL Transport via smtp.gmail.com:465</div>
                </div>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#38bdf8', backgroundColor: 'rgba(56,189,248,0.1)', padding: '0.25rem 0.65rem', borderRadius: '20px' }}>Active</span>
              </div>

              {/* Daily Webmaster Report Dispatcher */}
              <div style={{ padding: '1rem', backgroundColor: theme.inputBg, border: `1px solid ${theme.border}`, borderRadius: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                  <div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 800, color: theme.fg, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span>Daily Webmaster Executive Report</span>
                      <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#10b981', backgroundColor: 'rgba(16,185,129,0.1)', padding: '0.15rem 0.5rem', borderRadius: '12px' }}>
                        ● Active (Daily @ 05:30 AM IST)
                      </span>
                    </div>
                    <div style={{ fontSize: '0.72rem', color: theme.muted, marginTop: '0.25rem', lineHeight: 1.4 }}>
                      Dispatches full 24h website performance, email communication logs, applications breakdown, action items, and critical alerts directly to <strong style={{ color: theme.fg }}>webmaster@zawrindustries.com</strong>.
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.6rem', marginTop: '0.85rem' }}>
                  <button
                    type="button"
                    onClick={handlePreviewDailyReport}
                    style={{
                      flex: 1,
                      padding: '0.5rem 0.75rem',
                      backgroundColor: theme.hover,
                      color: theme.fg,
                      border: `1px solid ${theme.border}`,
                      borderRadius: '6px',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    Preview Today's Report
                  </button>
                  <button
                    type="button"
                    disabled={sendingDailyReport}
                    onClick={handleSendDailyReport}
                    style={{
                      flex: 1,
                      padding: '0.5rem 0.75rem',
                      backgroundColor: theme.fg,
                      color: theme.bg,
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '0.78rem',
                      fontWeight: 800,
                      cursor: sendingDailyReport ? 'not-allowed' : 'pointer',
                      opacity: sendingDailyReport ? 0.7 : 1
                    }}
                  >
                    {sendingDailyReport ? 'Dispatching...' : 'Send Report Now'}
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button
                  onClick={() => {
                    sessionStorage.removeItem('webmaster_logged_in');
                    alert('Session cache cleared. You will be prompted for security key upon next reload.');
                  }}
                  style={{
                    padding: '0.55rem 1rem',
                    backgroundColor: 'transparent',
                    color: theme.muted,
                    border: `1px solid ${theme.border}`,
                    borderRadius: '8px',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Clear Session Cache
                </button>
                <button
                  onClick={() => setShowSettingsModal(false)}
                  style={{
                    padding: '0.55rem 1.25rem',
                    backgroundColor: theme.fg,
                    color: theme.bg,
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* DAILY REPORT LIVE PREVIEW MODAL */}
      {/* ───────────────────────────────────────────────────────────── */}
      {showReportPreviewModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.85)',
          backdropFilter: 'blur(8px)',
          zIndex: 100000,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '1.5rem'
        }}>
          <div style={{
            width: '100%',
            maxWidth: '780px',
            maxHeight: '90vh',
            backgroundColor: theme.bg,
            border: `1px solid ${theme.border}`,
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: '0 25px 70px rgba(0,0,0,0.9)',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: `1px solid ${theme.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: theme.inputBg }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: theme.fg }}>Daily Webmaster Report Live Preview</h3>
                <span style={{ fontSize: '0.72rem', color: theme.muted }}>Official 24-Hour Operations &amp; Performance Summary</span>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <button
                  type="button"
                  disabled={sendingDailyReport}
                  onClick={handleSendDailyReport}
                  style={{
                    padding: '0.4rem 0.9rem',
                    backgroundColor: theme.fg,
                    color: theme.bg,
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '0.78rem',
                    fontWeight: 800,
                    cursor: sendingDailyReport ? 'not-allowed' : 'pointer'
                  }}
                >
                  {sendingDailyReport ? 'Sending...' : 'Email to Webmaster'}
                </button>
                <button
                  onClick={() => setShowReportPreviewModal(false)}
                  style={{ background: 'none', border: 'none', color: theme.muted, cursor: 'pointer', fontSize: '1.25rem', padding: '0.25rem' }}
                >
                  ✕
                </button>
              </div>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', backgroundColor: '#0a0a0a', padding: '1rem' }}>
              {reportPreviewLoading ? (
                <div style={{ padding: '4rem', textAlign: 'center', color: '#ffffff', fontSize: '0.9rem' }}>
                  Generating 24-Hour Telemetry &amp; Email Activity Digest...
                </div>
              ) : (
                <div dangerouslySetInnerHTML={{ __html: reportPreviewHtml || '' }} />
              )}
            </div>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* FLOATING REPORT TOAST NOTIFICATION */}
      {/* ───────────────────────────────────────────────────────────── */}
      {reportToast && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 100001,
          backgroundColor: reportToast.type === 'success' ? '#064e3b' : '#7f1d1d',
          color: '#ffffff',
          border: `1px solid ${reportToast.type === 'success' ? '#059669' : '#dc2626'}`,
          borderRadius: '10px',
          padding: '1rem 1.25rem',
          boxShadow: '0 12px 36px rgba(0,0,0,0.5)',
          maxWidth: '420px',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          fontSize: '0.85rem',
          fontWeight: 600,
          animation: 'fadeIn 0.2s ease-in-out'
        }}>
          <span>{reportToast.type === 'success' ? '✓' : '✕'}</span>
          <span style={{ flex: 1 }}>{reportToast.text}</span>
          <button
            onClick={() => setReportToast(null)}
            style={{ background: 'none', border: 'none', color: '#ffffff', cursor: 'pointer', fontSize: '1rem', padding: 0 }}
          >
            ✕
          </button>
        </div>
      )}

    </div>
  );
}
