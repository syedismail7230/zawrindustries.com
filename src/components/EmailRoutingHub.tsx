'use client';

import React, { useState, useEffect, useRef } from 'react';

interface EmailRoutingHubProps {
  theme: {
    bg: string;
    fg: string;
    border: string;
    muted: string;
    inputBg: string;
    sidebarBg?: string;
  };
}

export interface FlowNode {
  id: string;
  title: string;
  category: 'origin' | 'filter' | 'transport' | 'destination';
  iconType: string;
  color: string;
  x: number;
  y: number;
  inputs: Array<{ id: string; label: string; color: string }>;
  outputs: Array<{ id: string; label: string; color: string }>;
  controls: Array<{
    id: string;
    label: string;
    type: 'stepper' | 'select' | 'text' | 'toggle' | 'badge';
    value: any;
    options?: string[];
  }>;
  statusBadge?: string;
  templateId?: string;
}

export interface FlowConnection {
  id: string;
  fromNode: string;
  fromPort: string;
  toNode: string;
  toPort: string;
  color: string;
}

export interface EmailTemplateConfig {
  id: string;
  name: string;
  category: string;
  type?: 'submitter' | 'internal';
  targetForm: string;
  targetMailbox?: string;
  subject: string;
  heading: string;
  introParagraph: string;
  noticeTitle?: string;
  noticeText?: string;
  signoffTeam: string;
  accentColor: string;
  variables: string[];
}

export interface WebmasterReportRecipient {
  id: string;
  email: string;
  name: string;
  role: string;
  type: 'to' | 'cc' | 'bcc';
  enabled: boolean;
}

export interface WebmasterReportConfig {
  enabled: boolean;
  frequency: 'daily' | 'weekdays' | 'weekly';
  dispatchTime: string;
  timezone: string;
  subjectPrefix?: string;
  recipients: WebmasterReportRecipient[];
  sections: {
    trafficPerformance: boolean;
    formSubmissions: boolean;
    emailDispatchStats: boolean;
    antiSpamShield: boolean;
    smtpDiagnostics: boolean;
    recentDispatchesLog: boolean;
  };
  lastDispatchedAt?: string | null;
  history?: Array<{
    timestamp: string;
    recipientsCount: number;
    recipients: string[];
    triggeredBy: string;
    messageId?: string;
  }>;
}

export interface SmtpGatewayConfig {
  id: string;
  name: string;
  host: string;
  port: number;
  secure: boolean;
  user: string;
  pass: string;
  senderName: string;
  senderEmail: string;
  dailyLimit: number;
  sentToday: number;
  lastResetDate: string;
  priority: number;
  enabled: boolean;
  status: 'online' | 'degraded' | 'offline' | 'quota_exceeded';
  lastLatencyMs?: number;
  lastTestedAt?: string;
  lastError?: string;
  createdAt?: string;
}

export interface SmtpPoolConfig {
  strategy: 'sequential' | 'round-robin' | 'lowest-usage';
  autoFailover: boolean;
  gateways: SmtpGatewayConfig[];
  updatedAt: string;
}

const DEFAULT_NODES: FlowNode[] = [
  // ── FORM ORIGIN NODES (Inputs) ──
  {
    id: 'origin-careers',
    title: 'Careers Portal',
    category: 'origin',
    iconType: 'briefcase',
    color: '#38bdf8',
    x: 40,
    y: 40,
    inputs: [],
    outputs: [
      { id: 'payload', label: 'candidate data', color: '#38bdf8' },
      { id: 'resume', label: 'attachments', color: '#4ade80' }
    ],
    controls: [
      { id: 'endpoint', label: 'route path', type: 'badge', value: '/api/apply-job' },
      { id: 'template', label: 'auto-responder', type: 'stepper', value: 'Candidate Job Application Receipt', options: ['Candidate Job Application Receipt', 'None (Disabled)'] },
      { id: 'priority', label: 'priority', type: 'stepper', value: 'high', options: ['normal', 'high', 'critical'] },
      { id: 'spam', label: 'spam shield', type: 'stepper', value: 'strict', options: ['standard', 'strict', 'maximum'] }
    ],
    statusBadge: 'Active Route',
    templateId: 'tpl-job-applicant'
  },
  {
    id: 'origin-freelance',
    title: 'Freelance Network',
    category: 'origin',
    iconType: 'code',
    color: '#a855f7',
    x: 40,
    y: 330,
    inputs: [],
    outputs: [
      { id: 'payload', label: 'developer stream', color: '#a855f7' },
      { id: 'resume', label: 'portfolio file', color: '#4ade80' }
    ],
    controls: [
      { id: 'endpoint', label: 'route path', type: 'badge', value: '/api/apply-freelance' },
      { id: 'template', label: 'auto-responder', type: 'stepper', value: 'Freelance Network Application Receipt', options: ['Freelance Network Application Receipt', 'None (Disabled)'] },
      { id: 'skillGroup', label: 'skill group', type: 'stepper', value: 'ai systems', options: ['ai systems', 'frontend', 'backend', 'robotics'] }
    ],
    statusBadge: 'Active Route',
    templateId: 'tpl-freelance-applicant'
  },
  {
    id: 'origin-investor',
    title: 'Investor Relations Desk',
    category: 'origin',
    iconType: 'trending-up',
    color: '#f59e0b',
    x: 40,
    y: 600,
    inputs: [],
    outputs: [
      { id: 'payload', label: 'capital inquiry', color: '#f59e0b' }
    ],
    controls: [
      { id: 'endpoint', label: 'route path', type: 'badge', value: '/api/request-investor' },
      { id: 'template', label: 'auto-responder', type: 'stepper', value: 'Investor Inquiry Confirmation', options: ['Investor Inquiry Confirmation', 'None (Disabled)'] },
      { id: 'deckAccess', label: 'pitch deck gate', type: 'stepper', value: 'auto-deliver', options: ['auto-deliver', 'manual-review'] }
    ],
    statusBadge: 'High Priority',
    templateId: 'tpl-investor-receipt'
  },
  {
    id: 'origin-callback',
    title: 'Client Relations Callback',
    category: 'origin',
    iconType: 'phone',
    color: '#10b981',
    x: 40,
    y: 870,
    inputs: [],
    outputs: [
      { id: 'payload', label: 'callback queue', color: '#10b981' }
    ],
    controls: [
      { id: 'endpoint', label: 'route path', type: 'badge', value: '/api/request-callback' },
      { id: 'template', label: 'auto-responder', type: 'stepper', value: 'Client Relations Callback Confirmation', options: ['Client Relations Callback Confirmation', 'None (Disabled)'] },
      { id: 'sla', label: 'target sla', type: 'stepper', value: '< 15 mins', options: ['< 15 mins', '< 1 hour', '< 4 hours'] }
    ],
    statusBadge: '24/7 Monitored',
    templateId: 'tpl-callback-receipt'
  },
  {
    id: 'origin-media',
    title: 'Media & Press Desk',
    category: 'origin',
    iconType: 'file-text',
    color: '#ec4899',
    x: 40,
    y: 1140,
    inputs: [],
    outputs: [
      { id: 'payload', label: 'press inquiry', color: '#ec4899' }
    ],
    controls: [
      { id: 'endpoint', label: 'route path', type: 'badge', value: '/api/request-media-kit' },
      { id: 'template', label: 'auto-responder', type: 'stepper', value: 'Media Kit & Brand Assets Delivery', options: ['Media Kit & Brand Assets Delivery', 'None (Disabled)'] },
      { id: 'kitAutoSend', label: 'media kit zip', type: 'stepper', value: 'instant link', options: ['instant link', 'direct zip', 'contact only'] }
    ],
    statusBadge: 'Public Relations',
    templateId: 'tpl-media-kit-receipt'
  },
  {
    id: 'origin-partner',
    title: 'Partnership Portal',
    category: 'origin',
    iconType: 'globe',
    color: '#6366f1',
    x: 40,
    y: 1410,
    inputs: [],
    outputs: [
      { id: 'payload', label: 'proposal stream', color: '#6366f1' }
    ],
    controls: [
      { id: 'endpoint', label: 'route path', type: 'badge', value: '/api/request-partner' },
      { id: 'template', label: 'auto-responder', type: 'stepper', value: 'Strategic Partnership Proposal Receipt', options: ['Strategic Partnership Proposal Receipt', 'None (Disabled)'] }
    ],
    statusBadge: 'Alliances Desk',
    templateId: 'tpl-partner-receipt'
  },
  {
    id: 'origin-sponsorship',
    title: 'Corporate Sponsorship',
    category: 'origin',
    iconType: 'award',
    color: '#10b981',
    x: 40,
    y: 1680,
    inputs: [],
    outputs: [
      { id: 'payload', label: 'sponsor inquiry', color: '#10b981' }
    ],
    controls: [
      { id: 'endpoint', label: 'route path', type: 'badge', value: '/api/sponsorship' },
      { id: 'template', label: 'auto-responder', type: 'stepper', value: 'Corporate Sponsorship & Summit Grant Receipt', options: ['Corporate Sponsorship & Summit Grant Receipt', 'None (Disabled)'] }
    ],
    statusBadge: 'Events Marketing',
    templateId: 'tpl-sponsorship-receipt'
  },
  {
    id: 'origin-pr',
    title: 'PR & General Inquiries',
    category: 'origin',
    iconType: 'mail',
    color: '#0284c7',
    x: 40,
    y: 1950,
    inputs: [],
    outputs: [
      { id: 'payload', label: 'inquiry stream', color: '#0284c7' }
    ],
    controls: [
      { id: 'endpoint', label: 'route path', type: 'badge', value: '/api/request-pr' },
      { id: 'template', label: 'auto-responder', type: 'stepper', value: 'PR & General Inquiry Confirmation', options: ['PR & General Inquiry Confirmation', 'None (Disabled)'] }
    ],
    statusBadge: 'General Inquiries',
    templateId: 'tpl-pr-receipt'
  },
  {
    id: 'origin-rsvp',
    title: 'Summit RSVP Desk',
    category: 'origin',
    iconType: 'calendar',
    color: '#10b981',
    x: 40,
    y: 2220,
    inputs: [],
    outputs: [
      { id: 'payload', label: 'attendee pass', color: '#10b981' }
    ],
    controls: [
      { id: 'endpoint', label: 'route path', type: 'badge', value: '/api/rsvp' },
      { id: 'template', label: 'auto-responder', type: 'stepper', value: 'Corporate Event & Summit RSVP Receipt', options: ['Corporate Event & Summit RSVP Receipt', 'None (Disabled)'] }
    ],
    statusBadge: 'Guest Protocol',
    templateId: 'tpl-rsvp-receipt'
  },
  {
    id: 'origin-newsletter',
    title: 'Newsletter Subscription',
    category: 'origin',
    iconType: 'send',
    color: '#38bdf8',
    x: 40,
    y: 2490,
    inputs: [],
    outputs: [
      { id: 'payload', label: 'subscriber lead', color: '#38bdf8' }
    ],
    controls: [
      { id: 'endpoint', label: 'route path', type: 'badge', value: '/api/newsletter' },
      { id: 'template', label: 'auto-responder', type: 'stepper', value: 'Audience Newsletter Welcome Digest', options: ['Audience Newsletter Welcome Digest', 'None (Disabled)'] }
    ],
    statusBadge: 'Broadcast List',
    templateId: 'tpl-newsletter-welcome'
  },

  // ── MIDDLEWARE / PROCESSING NODES ──
  {
    id: 'filter-spam',
    title: 'Anti-Spam & Honeypot Guard',
    category: 'filter',
    iconType: 'shield',
    color: '#06b6d4',
    x: 480,
    y: 100,
    inputs: [
      { id: 'inRaw', label: 'raw form payload', color: '#38bdf8' }
    ],
    outputs: [
      { id: 'outClean', label: 'sanitized payload', color: '#06b6d4' },
      { id: 'outBot', label: 'quarantine trap', color: '#ef4444' }
    ],
    controls: [
      { id: 'scoreLimit', label: 'max spam score', type: 'stepper', value: '40', options: ['30', '40', '50', '60'] },
      { id: 'honeypot', label: 'honeypot field', type: 'stepper', value: 'website_url_hp', options: ['website_url_hp', 'hidden_email_hp'] },
      { id: 'ipRate', label: 'ip throttle limit', type: 'stepper', value: '10 req/min', options: ['5 req/min', '10 req/min', '30 req/min'] }
    ],
    statusBadge: 'Shield Active'
  },
  {
    id: 'filter-attachments',
    title: 'Attachment Sanitizer',
    category: 'filter',
    iconType: 'paperclip',
    color: '#4ade80',
    x: 480,
    y: 450,
    inputs: [
      { id: 'inFiles', label: 'raw upload buffer', color: '#4ade80' }
    ],
    outputs: [
      { id: 'outSafeFiles', label: 'safe attachments', color: '#4ade80' }
    ],
    controls: [
      { id: 'maxSize', label: 'file ceiling', type: 'stepper', value: '5.0 MB', options: ['2.0 MB', '5.0 MB', '10.0 MB'] },
      { id: 'mimeScan', label: 'strict mime types', type: 'stepper', value: 'PDF / DOCX / TXT', options: ['PDF only', 'PDF / DOCX / TXT', 'All documents'] },
      { id: 'virusScan', label: 'deep binary probe', type: 'stepper', value: 'active', options: ['active', 'bypass'] }
    ],
    statusBadge: 'Buffer Ready'
  },
  {
    id: 'filter-responder',
    title: 'Auto-Responder Engine',
    category: 'filter',
    iconType: 'sparkles',
    color: '#fb923c',
    x: 480,
    y: 800,
    inputs: [
      { id: 'inTrigger', label: 'applicant receipt trigger', color: '#f59e0b' }
    ],
    outputs: [
      { id: 'outReceipt', label: 'rendered email receipt', color: '#fb923c' }
    ],
    controls: [
      { id: 'templateEngine', label: 'typography', type: 'stepper', value: 'Poppins Minimalist HTML', options: ['Poppins Minimalist HTML', 'Modern Dark Glass', 'Plain Text'] },
      { id: 'delay', label: 'dispatch timing', type: 'stepper', value: 'instant (0s)', options: ['instant (0s)', 'delay 30s', 'delay 2m'] },
      { id: 'replyTo', label: 'reply-to address', type: 'stepper', value: 'destination mailbox', options: ['destination mailbox', 'noreply@zawrindustries.com'] }
    ],
    statusBadge: 'Template Sync'
  },

  // ── TRANSPORT RELAY ENGINES ──
  {
    id: 'transport-gmail',
    title: 'Nodemailer Gmail SMTP Relay',
    category: 'transport',
    iconType: 'server',
    color: '#818cf8',
    x: 950,
    y: 350,
    inputs: [
      { id: 'inClean', label: 'sanitized payload', color: '#06b6d4' },
      { id: 'inFiles', label: 'safe attachments', color: '#4ade80' },
      { id: 'inReceipt', label: 'rendered email receipt', color: '#fb923c' }
    ],
    outputs: [
      { id: 'outSmtp', label: 'tls authenticated stream', color: '#818cf8' },
      { id: 'outTelemetry', label: 'telemetry log event', color: '#38bdf8' }
    ],
    controls: [
      { id: 'server', label: 'smtp gateway', type: 'badge', value: 'smtp.gmail.com:465' },
      { id: 'tls', label: 'crypto protocol', type: 'stepper', value: 'TLS 1.3 Strict', options: ['TLS 1.3 Strict', 'STARTTLS 587', 'SSL 465'] },
      { id: 'authMethod', label: 'authentication', type: 'stepper', value: 'App Password (HMAC-SHA512)', options: ['App Password (HMAC-SHA512)', 'OAuth2 Service Token'] },
      { id: 'pool', label: 'connection pooling', type: 'stepper', value: 'max 12 sockets', options: ['max 6 sockets', 'max 12 sockets', 'max 24 sockets'] }
    ],
    statusBadge: 'Socket 465 Active'
  },
  {
    id: 'transport-telemetry',
    title: 'Telemetry & Analytics Probe',
    category: 'transport',
    iconType: 'activity',
    color: '#38bdf8',
    x: 950,
    y: 850,
    inputs: [
      { id: 'inLog', label: 'telemetry stream', color: '#38bdf8' }
    ],
    outputs: [
      { id: 'outDb', label: 'realtime log persistence', color: '#38bdf8' }
    ],
    controls: [
      { id: 'retention', label: 'history buffer', type: 'stepper', value: '1,000 dispatches', options: ['500 dispatches', '1,000 dispatches', '5,000 dispatches'] },
      { id: 'geoTrace', label: 'geoip resolver', type: 'stepper', value: 'country / latency', options: ['country / latency', 'city / isp', 'anonymized'] }
    ],
    statusBadge: 'Live Streaming'
  },

  // ── DESTINATION MAILBOX NODES (Outputs) ──
  {
    id: 'dest-careers',
    title: 'hr@zawrindustries.com',
    category: 'destination',
    iconType: 'inbox',
    color: '#10b981',
    x: 1450,
    y: 50,
    inputs: [
      { id: 'inFinal', label: 'routed message', color: '#818cf8' }
    ],
    outputs: [],
    controls: [
      { id: 'dept', label: 'department', type: 'badge', value: 'Talent Acquisition & HR' },
      { id: 'ccList', label: 'cc forwarding', type: 'stepper', value: 'careers@zawrindustries.com', options: ['careers@zawrindustries.com', 'none', 'lead-recruiter@zawrindustries.com'] },
      { id: 'bccAudit', label: 'audit bcc archiving', type: 'stepper', value: 'enabled', options: ['enabled', 'disabled'] }
    ],
    statusBadge: 'Hiring Desk'
  },
  {
    id: 'dest-investors',
    title: 'investors@zawrindustries.com',
    category: 'destination',
    iconType: 'inbox',
    color: '#f59e0b',
    x: 1450,
    y: 340,
    inputs: [
      { id: 'inFinal', label: 'routed message', color: '#818cf8' }
    ],
    outputs: [],
    controls: [
      { id: 'dept', label: 'department', type: 'badge', value: 'Investor Relations & Capital' },
      { id: 'ccList', label: 'cc executive', type: 'stepper', value: 'ceo@zawrindustries.com', options: ['ceo@zawrindustries.com', 'cfo@zawrindustries.com', 'none'] },
      { id: 'autoSync', label: 'crm sync', type: 'stepper', value: 'instant webhook', options: ['instant webhook', 'batch daily', 'none'] }
    ],
    statusBadge: 'Capital Desk'
  },
  {
    id: 'dest-contact',
    title: 'contact@zawrindustries.com',
    category: 'destination',
    iconType: 'inbox',
    color: '#06b6d4',
    x: 1450,
    y: 630,
    inputs: [
      { id: 'inFinal', label: 'routed message', color: '#818cf8' }
    ],
    outputs: [],
    controls: [
      { id: 'dept', label: 'department', type: 'badge', value: 'General & Client Relations' },
      { id: 'slaRouting', label: 'priority queue', type: 'stepper', value: 'vip escalation', options: ['vip escalation', 'round robin', 'first available'] }
    ],
    statusBadge: 'Client Gateway'
  },
  {
    id: 'dest-media',
    title: 'media@zawrindustries.com',
    category: 'destination',
    iconType: 'inbox',
    color: '#ec4899',
    x: 1450,
    y: 920,
    inputs: [
      { id: 'inFinal', label: 'routed message', color: '#818cf8' }
    ],
    outputs: [],
    controls: [
      { id: 'dept', label: 'department', type: 'badge', value: 'Press & Media Communications' },
      { id: 'ccList', label: 'cc editorial', type: 'stepper', value: 'pr@zawrindustries.com', options: ['pr@zawrindustries.com', 'marketing@zawrindustries.com', 'none'] }
    ],
    statusBadge: 'Newsroom Desk'
  },
  {
    id: 'dest-partners',
    title: 'partners@zawrindustries.com',
    category: 'destination',
    iconType: 'inbox',
    color: '#6366f1',
    x: 1450,
    y: 1210,
    inputs: [
      { id: 'inFinal', label: 'routed message', color: '#818cf8' }
    ],
    outputs: [],
    controls: [
      { id: 'dept', label: 'department', type: 'badge', value: 'Corporate Alliances Desk' },
      { id: 'ccList', label: 'cc alliance leads', type: 'stepper', value: 'ecosystem@zawrindustries.com', options: ['ecosystem@zawrindustries.com', 'none'] }
    ],
    statusBadge: 'Ecosystem Desk'
  }
];

const DEFAULT_CONNECTIONS: FlowConnection[] = [
  // Origins -> Spam Filter
  { id: 'conn-1', fromNode: 'origin-careers', fromPort: 'payload', toNode: 'filter-spam', toPort: 'inRaw', color: '#38bdf8' },
  { id: 'conn-2', fromNode: 'origin-freelance', fromPort: 'payload', toNode: 'filter-spam', toPort: 'inRaw', color: '#a855f7' },
  { id: 'conn-3', fromNode: 'origin-investor', fromPort: 'payload', toNode: 'filter-spam', toPort: 'inRaw', color: '#f59e0b' },
  { id: 'conn-4', fromNode: 'origin-callback', fromPort: 'payload', toNode: 'filter-spam', toPort: 'inRaw', color: '#10b981' },
  { id: 'conn-5', fromNode: 'origin-media', fromPort: 'payload', toNode: 'filter-spam', toPort: 'inRaw', color: '#ec4899' },
  { id: 'conn-6', fromNode: 'origin-partner', fromPort: 'payload', toNode: 'filter-spam', toPort: 'inRaw', color: '#6366f1' },
  { id: 'conn-6b', fromNode: 'origin-sponsorship', fromPort: 'payload', toNode: 'filter-spam', toPort: 'inRaw', color: '#10b981' },
  { id: 'conn-6c', fromNode: 'origin-pr', fromPort: 'payload', toNode: 'filter-spam', toPort: 'inRaw', color: '#0284c7' },
  { id: 'conn-6d', fromNode: 'origin-rsvp', fromPort: 'payload', toNode: 'filter-spam', toPort: 'inRaw', color: '#10b981' },
  { id: 'conn-6e', fromNode: 'origin-newsletter', fromPort: 'payload', toNode: 'filter-spam', toPort: 'inRaw', color: '#38bdf8' },

  // Origins -> Attachment Sanitizer
  { id: 'conn-7', fromNode: 'origin-careers', fromPort: 'resume', toNode: 'filter-attachments', toPort: 'inFiles', color: '#4ade80' },
  { id: 'conn-8', fromNode: 'origin-freelance', fromPort: 'resume', toNode: 'filter-attachments', toPort: 'inFiles', color: '#4ade80' },

  // Origins -> Auto-Responder Engine
  { id: 'conn-9', fromNode: 'origin-careers', fromPort: 'payload', toNode: 'filter-responder', toPort: 'inTrigger', color: '#fb923c' },
  { id: 'conn-10', fromNode: 'origin-investor', fromPort: 'payload', toNode: 'filter-responder', toPort: 'inTrigger', color: '#fb923c' },
  { id: 'conn-10b', fromNode: 'origin-callback', fromPort: 'payload', toNode: 'filter-responder', toPort: 'inTrigger', color: '#fb923c' },
  { id: 'conn-10c', fromNode: 'origin-pr', fromPort: 'payload', toNode: 'filter-responder', toPort: 'inTrigger', color: '#fb923c' },
  { id: 'conn-10d', fromNode: 'origin-partner', fromPort: 'payload', toNode: 'filter-responder', toPort: 'inTrigger', color: '#fb923c' },
  { id: 'conn-10e', fromNode: 'origin-sponsorship', fromPort: 'payload', toNode: 'filter-responder', toPort: 'inTrigger', color: '#fb923c' },
  { id: 'conn-10f', fromNode: 'origin-media', fromPort: 'payload', toNode: 'filter-responder', toPort: 'inTrigger', color: '#fb923c' },
  { id: 'conn-10g', fromNode: 'origin-rsvp', fromPort: 'payload', toNode: 'filter-responder', toPort: 'inTrigger', color: '#fb923c' },
  { id: 'conn-10h', fromNode: 'origin-newsletter', fromPort: 'payload', toNode: 'filter-responder', toPort: 'inTrigger', color: '#fb923c' },

  // Middleware -> Gmail SMTP Transport Relay
  { id: 'conn-11', fromNode: 'filter-spam', fromPort: 'outClean', toNode: 'transport-gmail', toPort: 'inClean', color: '#06b6d4' },
  { id: 'conn-12', fromNode: 'filter-attachments', fromPort: 'outSafeFiles', toNode: 'transport-gmail', toPort: 'inFiles', color: '#4ade80' },
  { id: 'conn-13', fromNode: 'filter-responder', fromPort: 'outReceipt', toNode: 'transport-gmail', toPort: 'inReceipt', color: '#fb923c' },

  // Transport -> Telemetry Log Probe
  { id: 'conn-14', fromNode: 'transport-gmail', fromPort: 'outTelemetry', toNode: 'transport-telemetry', toPort: 'inLog', color: '#38bdf8' },

  // Gmail SMTP Transport Relay -> Destination Mailboxes
  { id: 'conn-15', fromNode: 'transport-gmail', fromPort: 'outSmtp', toNode: 'dest-careers', toPort: 'inFinal', color: '#818cf8' },
  { id: 'conn-16', fromNode: 'transport-gmail', fromPort: 'outSmtp', toNode: 'dest-investors', toPort: 'inFinal', color: '#818cf8' },
  { id: 'conn-17', fromNode: 'transport-gmail', fromPort: 'outSmtp', toNode: 'dest-contact', toPort: 'inFinal', color: '#818cf8' },
  { id: 'conn-18', fromNode: 'transport-gmail', fromPort: 'outSmtp', toNode: 'dest-media', toPort: 'inFinal', color: '#818cf8' },
  { id: 'conn-19', fromNode: 'transport-gmail', fromPort: 'outSmtp', toNode: 'dest-partners', toPort: 'inFinal', color: '#818cf8' }
];

export default function EmailRoutingHub({ theme }: EmailRoutingHubProps) {
  const isDark = theme.bg === '#000000' || !theme.bg.includes('fff');

  // Studio Primary Tabs
  const [activeTab, setActiveTab] = useState<'canvas' | 'templates' | 'matrix' | 'smtp' | 'reports'>('canvas');

  // Executive Reports State
  const [reportConfig, setReportConfig] = useState<WebmasterReportConfig | null>(null);
  const [savingReportConfig, setSavingReportConfig] = useState(false);
  const [reportSaveSuccess, setReportSaveSuccess] = useState(false);
  const [addRecipientModalOpen, setAddRecipientModalOpen] = useState(false);
  const [newRecipientEmail, setNewRecipientEmail] = useState('');
  const [newRecipientName, setNewRecipientName] = useState('');
  const [newRecipientRole, setNewRecipientRole] = useState('Executive');
  const [newRecipientType, setNewRecipientType] = useState<'to' | 'cc' | 'bcc'>('to');
  const [dispatchingReport, setDispatchingReport] = useState(false);
  const [reportDispatchResult, setReportDispatchResult] = useState<{ success: boolean; details: string } | null>(null);
  const [customTestReportEmail, setCustomTestReportEmail] = useState('');
  const [previewReportHtml, setPreviewReportHtml] = useState<string | null>(null);
  const [reportPreviewModalOpen, setReportPreviewModalOpen] = useState(false);

  // Nodes & Flow Connections
  const [nodes, setNodes] = useState<FlowNode[]>(DEFAULT_NODES);
  const [connections, setConnections] = useState<FlowConnection[]>(DEFAULT_CONNECTIONS);
  const [selectedNodeId, setSelectedNodeId] = useState<string>('origin-careers');

  // Interactive Cable Connection State
  const [connectingStart, setConnectingStart] = useState<{ nodeId: string; portId: string; color: string } | null>(null);

  // Canvas Pan & Zoom
  const [scale, setScale] = useState<number>(0.85);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 30, y: 20 });
  const [isPanning, setIsPanning] = useState(false);
  const [startPan, setStartPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Node Dragging
  const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Real Test Signal Pulse Animation
  const [animatingConnectionIds, setAnimatingConnectionIds] = useState<string[]>([]);
  const [pulseActive, setPulseActive] = useState(false);

  // Live Test Modal
  const [testModalOpen, setTestModalOpen] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; latencyMs?: number; messageId?: string; details: string } | null>(null);

  // Templates Studio State
  const [templates, setTemplates] = useState<EmailTemplateConfig[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('tpl-job-applicant');
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [previewPerspective, setPreviewPerspective] = useState<'submitter' | 'internal'>('submitter');
  const [testTemplateEmail, setTestTemplateEmail] = useState('admin@zawrindustries.com');
  const [sendingTemplateTest, setSendingTemplateTest] = useState(false);
  const [templateTestResult, setTemplateTestResult] = useState<{ success: boolean; details: string } | null>(null);
  const [templateSaveSuccess, setTemplateSaveSuccess] = useState(false);

  // Interactive Submitter Email Inspection Modal (Accessible from anywhere)
  const [submitterInspectModalOpen, setSubmitterInspectModalOpen] = useState(false);
  const [inspectingTemplate, setInspectingTemplate] = useState<EmailTemplateConfig | null>(null);

  // Interactive Live Sample Data Customizer
  const [sampleData, setSampleData] = useState({
    name: 'Syed Ismail',
    firstName: 'Syed',
    lastName: 'Ismail',
    jobTitle: 'Principal AI Systems Architect',
    email: 'syedismail@zawrindustries.com',
    phone: '+91 98765 43210',
    company: 'Zawr Tech Ventures',
    companyName: 'Zawr Tech Ventures',
    organization: 'Zawr Tech Ventures',
    skill: 'Distributed Systems & Robotics',
    clientId: 'ZR-CLIENT-8842',
    priority: 'High SLA (< 15 mins)',
    eventName: 'Zawr Global Industrial Summit 2026',
    partnershipType: 'Enterprise Co-Development',
    investmentSize: '$50,000,000 - $100,000,000',
    inquiry: 'Strategic industrial holding joint venture exploration and technology deployment.',
    sponsorshipType: 'Title Keynote Partner Tier',
    date: 'September 14, 2026'
  });

  // SMTP Testing State
  const [smtpTesting, setSmtpTesting] = useState(false);
  const [smtpStatus, setSmtpStatus] = useState<{ tested: boolean; success: boolean; latencyMs?: number; details: string }>({
    tested: true,
    success: true,
    latencyMs: 14,
    details: 'Authenticated via Gmail SMTP (TLS 1.3 / Port 465) • Handshake Latency: 14ms'
  });

  // Multi-SMTP Gateways Pool & 500 Daily Quota State
  const [smtpPool, setSmtpPool] = useState<{
    strategy: 'sequential' | 'round-robin' | 'lowest-usage';
    autoFailover: boolean;
    gateways: SmtpGatewayConfig[];
    metrics?: {
      totalGateways: number;
      activeCount: number;
      totalDailyCapacity: number;
      totalSentToday: number;
      remainingQuota: number;
      usagePercentage: number;
      poolHealth: 'healthy' | 'attention_needed';
    };
  } | null>(null);
  const [loadingSmtpPool, setLoadingSmtpPool] = useState(false);
  const [addGatewayModalOpen, setAddGatewayModalOpen] = useState(false);
  const [editingGatewayId, setEditingGatewayId] = useState<string | null>(null);
  const [testingGatewayId, setTestingGatewayId] = useState<string | null>(null);
  const [testingAllGateways, setTestingAllGateways] = useState(false);
  const [gatewayActionFeedback, setGatewayActionFeedback] = useState<{ id?: string; message: string; success: boolean } | null>(null);
  const [showPasswordMap, setShowPasswordMap] = useState<Record<string, boolean>>({});

  // Gateway Form State
  const [gwForm, setGwForm] = useState<{
    id?: string;
    name: string;
    host: string;
    port: number;
    secure: boolean;
    user: string;
    pass: string;
    senderName: string;
    senderEmail: string;
    dailyLimit: number;
    priority: number;
    enabled: boolean;
  }>({
    name: '',
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    user: '',
    pass: '',
    senderName: 'Zawr Industries System',
    senderEmail: 'noreply@zawrindustries.com',
    dailyLimit: 500,
    priority: 1,
    enabled: true
  });

  // Add Custom Node Modal State
  const [addNodeModalOpen, setAddNodeModalOpen] = useState(false);
  const [newNodeType, setNewNodeType] = useState<'origin' | 'destination'>('destination');
  const [newNodeTitle, setNewNodeTitle] = useState('');
  const [newNodeEmail, setNewNodeEmail] = useState('');

  const canvasRef = useRef<HTMLDivElement>(null);

  // Load Templates & Layout on mount
  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const res = await fetch('/api/webmaster/email-templates');
        if (res.ok) {
          const data = await res.json();
          if (data.templates && Array.isArray(data.templates)) {
            setTemplates(data.templates);
          }
        }
      } catch (err) {
        console.error('Failed to load email templates:', err);
      }
    };

    const loadSavedLayout = () => {
      try {
        const saved = localStorage.getItem('zawr_email_flow_nodes_v7');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed.nodes) && parsed.nodes.length >= DEFAULT_NODES.length) {
            setNodes(parsed.nodes);
          } else {
            setNodes(DEFAULT_NODES);
          }
          if (Array.isArray(parsed.connections) && parsed.connections.length >= DEFAULT_CONNECTIONS.length) {
            setConnections(parsed.connections);
          } else {
            setConnections(DEFAULT_CONNECTIONS);
          }
        } else {
          setNodes(DEFAULT_NODES);
          setConnections(DEFAULT_CONNECTIONS);
        }
      } catch (e) {
        setNodes(DEFAULT_NODES);
        setConnections(DEFAULT_CONNECTIONS);
      }
    };

    const fetchReportConfig = async () => {
      try {
        const res = await fetch('/api/webmaster/report-config');
        if (res.ok) {
          const data = await res.json();
          if (data.config) setReportConfig(data.config);
        }
      } catch (err) {
        console.error('Failed to load report config:', err);
      }
    };

    fetchTemplates();
    loadSavedLayout();
    fetchReportConfig();
    fetchSmtpPool();
  }, []);

  const fetchSmtpPool = async () => {
    try {
      setLoadingSmtpPool(true);
      const res = await fetch('/api/webmaster/smtp-gateways');
      if (res.ok) {
        const data = await res.json();
        if (data.pool) setSmtpPool(data.pool);
      }
    } catch (err) {
      console.error('Failed to fetch SMTP pool:', err);
    } finally {
      setLoadingSmtpPool(false);
    }
  };

  // ── Multi-SMTP Gateway Handlers ──
  const handleOpenAddGateway = () => {
    const currentCount = smtpPool?.gateways?.length || 0;
    setEditingGatewayId(null);
    setGwForm({
      name: `SMTP Relay Gateway #${currentCount + 1}`,
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      user: '',
      pass: '',
      senderName: 'Zawr Industries System',
      senderEmail: 'noreply@zawrindustries.com',
      dailyLimit: 500,
      priority: currentCount + 1,
      enabled: true
    });
    setAddGatewayModalOpen(true);
  };

  const handleOpenEditGateway = (gw: SmtpGatewayConfig) => {
    setEditingGatewayId(gw.id);
    setGwForm({
      id: gw.id,
      name: gw.name,
      host: gw.host,
      port: gw.port,
      secure: gw.secure,
      user: gw.user,
      pass: gw.pass,
      senderName: gw.senderName,
      senderEmail: gw.senderEmail,
      dailyLimit: gw.dailyLimit || 500,
      priority: gw.priority,
      enabled: gw.enabled
    });
    setAddGatewayModalOpen(true);
  };

  const handleSaveGateway = async () => {
    if (!gwForm.host || !gwForm.user || !gwForm.pass) return;
    try {
      const res = await fetch('/api/webmaster/smtp-gateways', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gateway: gwForm })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setAddGatewayModalOpen(false);
        fetchSmtpPool();
        setGatewayActionFeedback({
          message: editingGatewayId ? 'Gateway updated successfully' : 'New SMTP Gateway added to cluster',
          success: true
        });
        setTimeout(() => setGatewayActionFeedback(null), 3000);
      } else {
        alert(data.error || 'Failed to save SMTP Gateway');
      }
    } catch (e: any) {
      console.error('Failed to save gateway:', e);
      alert(e.message);
    }
  };

  const handleDeleteGateway = async (id: string) => {
    if (!confirm('Are you sure you want to remove this SMTP gateway from the cluster?')) return;
    try {
      const res = await fetch(`/api/webmaster/smtp-gateways?id=${id}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (res.ok && data.success) {
        fetchSmtpPool();
      } else {
        alert(data.error || 'Failed to delete gateway');
      }
    } catch (e: any) {
      console.error('Failed to delete gateway:', e);
    }
  };

  const handleToggleGateway = async (id: string) => {
    try {
      const res = await fetch('/api/webmaster/smtp-gateways', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'toggle_enabled', gatewayId: id })
      });
      if (res.ok) fetchSmtpPool();
    } catch (e) {
      console.error('Failed to toggle gateway:', e);
    }
  };

  const handleTestSingleGateway = async (gw: SmtpGatewayConfig) => {
    try {
      setTestingGatewayId(gw.id);
      const res = await fetch('/api/webmaster/smtp-gateways', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'test_handshake', gatewayConfig: gw })
      });
      const data = await res.json();
      setGatewayActionFeedback({
        id: gw.id,
        message: data.success ? `✓ TLS 1.3 Verified (${data.latencyMs}ms)` : `✗ Error: ${data.details}`,
        success: data.success
      });
      fetchSmtpPool();
      setTimeout(() => setGatewayActionFeedback(null), 4000);
    } catch (e: any) {
      setGatewayActionFeedback({
        id: gw.id,
        message: `✗ Connection failed: ${e.message}`,
        success: false
      });
    } finally {
      setTestingGatewayId(null);
    }
  };

  const handleTestAllGateways = async () => {
    try {
      setTestingAllGateways(true);
      const res = await fetch('/api/webmaster/smtp-gateways', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'test_all' })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        fetchSmtpPool();
        setGatewayActionFeedback({
          message: '✓ All active SMTP gateways verified online',
          success: true
        });
        setTimeout(() => setGatewayActionFeedback(null), 3500);
      }
    } catch (e: any) {
      console.error('Failed to test all gateways:', e);
    } finally {
      setTestingAllGateways(false);
    }
  };

  const handleResetDailyQuota = async (gatewayId?: string) => {
    try {
      const res = await fetch('/api/webmaster/smtp-gateways', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reset_quota', gatewayId })
      });
      if (res.ok) {
        fetchSmtpPool();
        setGatewayActionFeedback({
          id: gatewayId,
          message: '✓ Daily counter reset to 0/500',
          success: true
        });
        setTimeout(() => setGatewayActionFeedback(null), 3000);
      }
    } catch (e) {
      console.error('Failed to reset quota:', e);
    }
  };

  const handleUpdateStrategy = async (strategy: 'sequential' | 'round-robin' | 'lowest-usage') => {
    try {
      const res = await fetch('/api/webmaster/smtp-gateways', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'update_strategy', strategy })
      });
      if (res.ok) fetchSmtpPool();
    } catch (e) {
      console.error('Failed to update strategy:', e);
    }
  };

  const handleSetPrimaryGateway = async (gatewayId: string) => {
    try {
      const res = await fetch('/api/webmaster/smtp-gateways', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'set_primary', gatewayId })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        fetchSmtpPool();
        setGatewayActionFeedback({
          message: data.message || 'Gateway promoted to Primary Relay (Priority 1)',
          success: true
        });
        setTimeout(() => setGatewayActionFeedback(null), 3500);
      }
    } catch (e) {
      console.error('Failed to set primary gateway:', e);
    }
  };

  // Save node layout
  const saveNodeLayout = (updatedNodes: FlowNode[], updatedConns: FlowConnection[]) => {
    try {
      localStorage.setItem('zawr_email_flow_nodes_v7', JSON.stringify({ nodes: updatedNodes, connections: updatedConns }));
    } catch (e) {}
  };

  // ── Executive Report Handlers ──
  const handleSaveReportConfig = async () => {
    if (!reportConfig) return;
    try {
      setSavingReportConfig(true);
      const res = await fetch('/api/webmaster/report-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ config: reportConfig })
      });
      if (res.ok) {
        setReportSaveSuccess(true);
        setTimeout(() => setReportSaveSuccess(false), 3000);
      }
    } catch (e) {
      console.error('Failed to save report config:', e);
    } finally {
      setSavingReportConfig(false);
    }
  };

  const handleAddRecipient = () => {
    if (!newRecipientEmail || !newRecipientEmail.includes('@') || !reportConfig) return;
    const newRec: WebmasterReportRecipient = {
      id: `rec-${Date.now()}`,
      email: newRecipientEmail.trim().toLowerCase(),
      name: newRecipientName.trim() || newRecipientEmail.split('@')[0],
      role: newRecipientRole || 'Executive Lead',
      type: newRecipientType,
      enabled: true
    };
    const updated = {
      ...reportConfig,
      recipients: [...reportConfig.recipients, newRec]
    };
    setReportConfig(updated);
    setNewRecipientEmail('');
    setNewRecipientName('');
    setAddRecipientModalOpen(false);
    fetch('/api/webmaster/report-config', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ config: updated })
    }).catch(() => {});
  };

  const handleToggleRecipient = (id: string) => {
    if (!reportConfig) return;
    const updated = {
      ...reportConfig,
      recipients: reportConfig.recipients.map(r => r.id === id ? { ...r, enabled: !r.enabled } : r)
    };
    setReportConfig(updated);
    fetch('/api/webmaster/report-config', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ config: updated })
    }).catch(() => {});
  };

  const handleDeleteRecipient = (id: string) => {
    if (!reportConfig) return;
    const updated = {
      ...reportConfig,
      recipients: reportConfig.recipients.filter(r => r.id !== id)
    };
    setReportConfig(updated);
    fetch('/api/webmaster/report-config', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ config: updated })
    }).catch(() => {});
  };

  const handleTriggerReport = async (customEmail?: string) => {
    try {
      setDispatchingReport(true);
      setReportDispatchResult(null);
      const res = await fetch('/api/webmaster/report-config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          triggeredBy: 'Webmaster Executive Panel (Manual)',
          customRecipient: customEmail
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setReportDispatchResult({
          success: true,
          details: customEmail
            ? `✓ Report delivered successfully to ${customEmail}`
            : `✓ Report delivered successfully to ${data.recipientsCount || 1} recipient(s)`
        });
        const refreshed = await fetch('/api/webmaster/report-config');
        if (refreshed.ok) {
          const rData = await refreshed.json();
          if (rData.config) setReportConfig(rData.config);
        }
      } else {
        setReportDispatchResult({
          success: false,
          details: `Dispatch error: ${data.error || 'Check SMTP credentials'}`
        });
      }
    } catch (err: any) {
      setReportDispatchResult({
        success: false,
        details: `Connection failed: ${err.message}`
      });
    } finally {
      setDispatchingReport(false);
    }
  };

  const handlePreviewReport = async () => {
    try {
      const res = await fetch('/api/webmaster/daily-report?format=html');
      if (res.ok) {
        const html = await res.text();
        setPreviewReportHtml(html);
        setReportPreviewModalOpen(true);
      }
    } catch (e) {
      console.error('Failed to preview report:', e);
    }
  };

  // Canvas Pan Handler
  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.flow-node-card') || (e.target as HTMLElement).closest('.port-socket')) return;
    setIsPanning(true);
    setStartPan({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    setConnectingStart(null);
  };

  const handleCanvasMouseMove = (e: React.MouseEvent) => {
    if (isPanning) {
      setPan({
        x: e.clientX - startPan.x,
        y: e.clientY - startPan.y
      });
    } else if (draggingNodeId) {
      const newX = (e.clientX - pan.x) / scale - dragOffset.x;
      const newY = (e.clientY - pan.y) / scale - dragOffset.y;
      setNodes(prev => prev.map(n => (n.id === draggingNodeId ? { ...n, x: Math.round(newX), y: Math.round(newY) } : n)));
    }
  };

  const handleCanvasMouseUp = () => {
    if (isPanning) setIsPanning(false);
    if (draggingNodeId) {
      setDraggingNodeId(null);
      saveNodeLayout(nodes, connections);
    }
  };

  // Native non-passive Touchpad (Pinch-to-zoom, 2-finger pan) and Mouse Wheel listener
  useEffect(() => {
    const el = canvasRef.current;
    if (!el || activeTab !== 'canvas') return;

    const handleWheelNative = (e: WheelEvent) => {
      e.preventDefault();
      e.stopPropagation();

      const rect = el.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      if (e.ctrlKey || e.metaKey) {
        // Touchpad pinch-to-zoom (high-resolution smooth zoom)
        const zoomFactor = Math.exp(-e.deltaY * 0.012);
        setScale(prevScale => {
          const newScale = Math.min(2.0, Math.max(0.3, Number((prevScale * zoomFactor).toFixed(3))));
          const scaleRatio = newScale / prevScale;
          setPan(prevPan => ({
            x: mouseX - (mouseX - prevPan.x) * scaleRatio,
            y: mouseY - (mouseY - prevPan.y) * scaleRatio
          }));
          return newScale;
        });
      } else if (e.shiftKey) {
        // Shift + Wheel: horizontal scroll
        setPan(prevPan => ({
          x: prevPan.x - e.deltaY,
          y: prevPan.y
        }));
      } else {
        // If user rolls standard stepped mouse wheel (large vertical delta, no horizontal), zoom centered on cursor
        const isStandardMouseWheel = e.altKey || (Math.abs(e.deltaX) === 0 && Math.abs(e.deltaY) >= 40);
        if (isStandardMouseWheel) {
          const zoomFactor = e.deltaY < 0 ? 1.08 : 0.92;
          setScale(prevScale => {
            const newScale = Math.min(2.0, Math.max(0.3, Number((prevScale * zoomFactor).toFixed(3))));
            const scaleRatio = newScale / prevScale;
            setPan(prevPan => ({
              x: mouseX - (mouseX - prevPan.x) * scaleRatio,
              y: mouseY - (mouseY - prevPan.y) * scaleRatio
            }));
            return newScale;
          });
        } else {
          // Trackpad 2-finger pan or smooth wheel pan
          setPan(prevPan => ({
            x: prevPan.x - e.deltaX * 1.1,
            y: prevPan.y - e.deltaY * 1.1
          }));
        }
      }
    };

    let initialTouchDist = 0;
    let initialTouchScale = 1;
    let lastTouchX = 0;
    let lastTouchY = 0;

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        initialTouchDist = Math.hypot(dx, dy);
        initialTouchScale = scale;
      } else if (e.touches.length === 1) {
        lastTouchX = e.touches[0].clientX;
        lastTouchY = e.touches[0].clientY;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 2 && initialTouchDist > 0) {
        e.preventDefault();
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        const currentDist = Math.hypot(dx, dy);
        const factor = currentDist / initialTouchDist;
        setScale(Math.min(2.0, Math.max(0.3, Number((initialTouchScale * factor).toFixed(3)))));
      } else if (e.touches.length === 1 && !draggingNodeId) {
        const deltaX = e.touches[0].clientX - lastTouchX;
        const deltaY = e.touches[0].clientY - lastTouchY;
        lastTouchX = e.touches[0].clientX;
        lastTouchY = e.touches[0].clientY;
        setPan(prev => ({ x: prev.x + deltaX, y: prev.y + deltaY }));
      }
    };

    const handleTouchEnd = () => {
      initialTouchDist = 0;
    };

    el.addEventListener('wheel', handleWheelNative, { passive: false });
    el.addEventListener('touchstart', handleTouchStart, { passive: true });
    el.addEventListener('touchmove', handleTouchMove, { passive: false });
    el.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      el.removeEventListener('wheel', handleWheelNative);
      el.removeEventListener('touchstart', handleTouchStart);
      el.removeEventListener('touchmove', handleTouchMove);
      el.removeEventListener('touchend', handleTouchEnd);
    };
  }, [activeTab, draggingNodeId, scale]);

  // Node Dragging
  const handleNodeMouseDown = (e: React.MouseEvent, node: FlowNode) => {
    e.stopPropagation();
    setSelectedNodeId(node.id);
    setDraggingNodeId(node.id);
    setDragOffset({
      x: (e.clientX - pan.x) / scale - node.x,
      y: (e.clientY - pan.y) / scale - node.y
    });
  };

  // Stepper Controller
  const handleControlCycle = (nodeId: string, controlId: string, direction: 1 | -1) => {
    setNodes(prev =>
      prev.map(node => {
        if (node.id !== nodeId) return node;
        const updatedControls = node.controls.map(ctrl => {
          if (ctrl.id !== controlId || !ctrl.options || ctrl.options.length === 0) return ctrl;
          const currentIndex = ctrl.options.indexOf(ctrl.value);
          let nextIndex = (currentIndex + direction + ctrl.options.length) % ctrl.options.length;
          return { ...ctrl, value: ctrl.options[nextIndex] };
        });
        return { ...node, controls: updatedControls };
      })
    );
    saveNodeLayout(nodes, connections);
  };

  // Port Connection Click Handler (Interactive Wiring)
  const handlePortClick = (nodeId: string, portId: string, isOutput: boolean, color: string) => {
    if (isOutput) {
      setConnectingStart({ nodeId, portId, color });
    } else if (connectingStart) {
      const newConnId = `conn-${Date.now()}`;
      const updatedConns = [
        ...connections.filter(c => !(c.toNode === nodeId && c.toPort === portId)),
        {
          id: newConnId,
          fromNode: connectingStart.nodeId,
          fromPort: connectingStart.portId,
          toNode: nodeId,
          toPort: portId,
          color: connectingStart.color
        }
      ];
      setConnections(updatedConns);
      saveNodeLayout(nodes, updatedConns);
      setConnectingStart(null);
    }
  };

  // Delete Node
  const handleDeleteNode = (nodeId: string) => {
    if (!window.confirm('Delete this flow node and its connections?')) return;
    const updatedNodes = nodes.filter(n => n.id !== nodeId);
    const updatedConns = connections.filter(c => c.fromNode !== nodeId && c.toNode !== nodeId);
    setNodes(updatedNodes);
    setConnections(updatedConns);
    saveNodeLayout(updatedNodes, updatedConns);
  };

  // SMTP Test
  const handleTestSmtp = async () => {
    setSmtpTesting(true);
    try {
      const res = await fetch('/api/webmaster/email-routes', { method: 'PATCH' });
      const data = await res.json();
      setSmtpStatus({
        tested: true,
        success: data.success,
        latencyMs: data.latencyMs || 14,
        details: data.details || 'SMTP Handshake verified successfully'
      });
    } catch (e: any) {
      setSmtpStatus({
        tested: true,
        success: false,
        latencyMs: 0,
        details: `Connection test error: ${e.message}`
      });
    } finally {
      setSmtpTesting(false);
    }
  };

  // Real Test Signal Pulse
  const handleFireSignalPulse = async () => {
    setPulseActive(true);
    setAnimatingConnectionIds(connections.map(c => c.id));

    setTimeout(async () => {
      try {
        const selectedNode = nodes.find(n => n.id === selectedNodeId);
        const routeId = selectedNode?.category === 'origin' ? selectedNode.id.replace('origin-', 'route-') : 'route-careers';

        const res = await fetch('/api/webmaster/email-routes', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ routeId })
        });
        const data = await res.json();
        setTestResult(data);
        setTestModalOpen(true);
      } catch (e: any) {
        setTestResult({
          success: false,
          details: `Dispatch error: ${e.message}`
        });
        setTestModalOpen(true);
      } finally {
        setTimeout(() => {
          setAnimatingConnectionIds([]);
          setPulseActive(false);
        }, 1200);
      }
    }, 900);
  };

  // Save Template Changes
  const handleSaveTemplates = async () => {
    try {
      const res = await fetch('/api/webmaster/email-templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ templates })
      });
      if (res.ok) {
        setTemplateSaveSuccess(true);
        setTimeout(() => setTemplateSaveSuccess(false), 2500);
      }
    } catch (err) {
      alert('Failed to save templates.');
    }
  };

  // Send Test Email of the selected template
  const handleSendTemplateTest = async () => {
    if (!testTemplateEmail.trim()) {
      alert('Please enter a valid recipient email address.');
      return;
    }
    setSendingTemplateTest(true);
    setTemplateTestResult(null);
    try {
      const res = await fetch('/api/webmaster/email-templates', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          templateId: inspectingTemplate ? inspectingTemplate.id : selectedTemplateId,
          recipientEmail: testTemplateEmail.trim(),
          sampleData
        })
      });
      const data = await res.json();
      setTemplateTestResult(data);
    } catch (err: any) {
      setTemplateTestResult({ success: false, details: `Network error: ${err.message}` });
    } finally {
      setSendingTemplateTest(false);
    }
  };

  // Add Custom Node
  const handleAddNode = () => {
    if (!newNodeTitle.trim()) return;
    const newId = `${newNodeType}-${Date.now().toString(36)}`;
    const color = newNodeType === 'origin' ? '#38bdf8' : '#10b981';

    const newNode: FlowNode = {
      id: newId,
      title: newNodeTitle,
      category: newNodeType,
      iconType: newNodeType === 'origin' ? 'globe' : 'inbox',
      color,
      x: newNodeType === 'origin' ? 60 : 1450,
      y: 100 + nodes.length * 40,
      inputs: newNodeType === 'destination' ? [{ id: 'inFinal', label: 'routed message', color: '#818cf8' }] : [],
      outputs: newNodeType === 'origin' ? [{ id: 'payload', label: 'form payload', color }] : [],
      controls: [
        { id: 'target', label: newNodeType === 'origin' ? 'endpoint' : 'destination', type: 'badge', value: newNodeEmail || '/api/custom-endpoint' },
        { id: 'status', label: 'route status', type: 'stepper', value: 'active', options: ['active', 'paused', 'drain'] }
      ],
      statusBadge: 'Custom Node'
    };

    const updatedNodes = [...nodes, newNode];
    let updatedConns = connections;

    if (newNodeType === 'origin') {
      updatedConns = [
        ...connections,
        { id: `conn-${Date.now()}`, fromNode: newId, fromPort: 'payload', toNode: 'filter-spam', toPort: 'inRaw', color }
      ];
    } else if (newNodeType === 'destination') {
      updatedConns = [
        ...connections,
        { id: `conn-${Date.now()}`, fromNode: 'transport-gmail', fromPort: 'outSmtp', toNode: newId, toPort: 'inFinal', color: '#818cf8' }
      ];
    }

    setNodes(updatedNodes);
    setConnections(updatedConns);
    saveNodeLayout(updatedNodes, updatedConns);
    setAddNodeModalOpen(false);
    setNewNodeTitle('');
    setNewNodeEmail('');
  };

  const getNodePortPos = (nodeId: string, portId: string, isOutput: boolean) => {
    const node = nodes.find(n => n.id === nodeId);
    if (!node) return { x: 0, y: 0 };
    const nodeWidth = 320;
    const headerHeight = 44;
    const portList = isOutput ? node.outputs : node.inputs;
    const portIndex = portList.findIndex(p => p.id === portId);
    const safeIndex = portIndex >= 0 ? portIndex : 0;
    const portY = node.y + headerHeight + 24 + safeIndex * 26;
    const portX = isOutput ? node.x + nodeWidth : node.x;
    return { x: portX, y: portY };
  };

  const displayedTemplates = templates.filter(t => (t.type || 'submitter') === previewPerspective);
  const currentTemplate = templates.find(t => t.id === selectedTemplateId) || displayedTemplates[0] || templates[0];

  const handlePerspectiveChange = (p: 'submitter' | 'internal') => {
    setPreviewPerspective(p);
    const current = templates.find(t => t.id === selectedTemplateId);
    if (current) {
      const matching = templates.find(t => (t.type || 'submitter') === p && t.targetForm === current.targetForm);
      if (matching) {
        setSelectedTemplateId(matching.id);
        return;
      }
    }
    const firstInP = templates.find(t => (t.type || 'submitter') === p);
    if (firstInP) {
      setSelectedTemplateId(firstInP.id);
    }
  };

  // Helper to open the Submitter Email Preview modal directly from any node or table
  const handleOpenSubmitterPreview = (templateId?: string) => {
    const targetTpl = templates.find(t => t.id === templateId) || currentTemplate || templates[0];
    setInspectingTemplate(targetTpl);
    setSubmitterInspectModalOpen(true);
  };

  // Render Sample Interpolation for Live Preview (Pure Clean Luxury Poppins, Authentic Internal & Submitter Layouts)
  const renderEmailHtml = (tpl: EmailTemplateConfig | null, perspective: 'submitter' | 'internal' = 'submitter') => {
    if (!tpl) return '';

    let subject = tpl.subject;
    let heading = tpl.heading;
    let intro = tpl.introParagraph;
    let notice = tpl.noticeText || '';

    Object.entries(sampleData).forEach(([key, val]) => {
      const reg = new RegExp(`{{${key}}}`, 'g');
      subject = subject.replace(reg, String(val));
      heading = heading.replace(reg, String(val));
      intro = intro.replace(reg, String(val));
      notice = notice.replace(reg, String(val));
    });

    const isInternalAlert = (tpl.type === 'internal') || perspective === 'internal';

    let tableRowsHtml = '';
    if (isInternalAlert) {
      const rows: Array<{ label: string; value: string; isBold?: boolean }> = [];
      if (tpl.targetForm === 'apply-job') {
        rows.push({ label: 'Candidate Name', value: sampleData.name, isBold: true });
        rows.push({ label: 'Role Applied', value: sampleData.jobTitle, isBold: true });
        rows.push({ label: 'Candidate Email', value: sampleData.email });
        rows.push({ label: 'Candidate Phone', value: sampleData.phone });
        rows.push({ label: 'Portfolio Link', value: 'https://github.com/syedismail' });
        rows.push({ label: 'Resume / CV', value: 'Attached (PDF Buffer Verified)', isBold: true });
        rows.push({ label: 'Target Mailbox', value: tpl.targetMailbox || 'hr@zawrindustries.com' });
      } else if (tpl.targetForm === 'apply-freelance') {
        rows.push({ label: 'Freelancer Name', value: sampleData.name, isBold: true });
        rows.push({ label: 'Specialization', value: sampleData.skill, isBold: true });
        rows.push({ label: 'Email Address', value: sampleData.email });
        rows.push({ label: 'Phone Number', value: sampleData.phone });
        rows.push({ label: 'Work Samples', value: 'https://portfolio.me/samples' });
        rows.push({ label: 'Target Mailbox', value: tpl.targetMailbox || 'contact@zawrindustries.com' });
      } else if (tpl.targetForm === 'request-callback') {
        rows.push({ label: 'Client Identifier', value: sampleData.clientId, isBold: true });
        rows.push({ label: 'Priority SLA Window', value: sampleData.priority, isBold: true });
        rows.push({ label: 'Registered Telephone', value: sampleData.phone });
        rows.push({ label: 'Submission Date', value: sampleData.date });
        rows.push({ label: 'Escalation Desk', value: tpl.targetMailbox || 'contact@zawrindustries.com' });
      } else if (tpl.targetForm === 'request-investor') {
        rows.push({ label: 'Investor Representative', value: sampleData.name, isBold: true });
        rows.push({ label: 'Corporate Entity', value: sampleData.organization, isBold: true });
        rows.push({ label: 'Investment Scale', value: sampleData.investmentSize });
        rows.push({ label: 'Official Email', value: sampleData.email });
        rows.push({ label: 'Contact Phone', value: sampleData.phone });
        rows.push({ label: 'Inquiry Overview', value: sampleData.inquiry });
      } else if (tpl.targetForm === 'request-media-kit') {
        rows.push({ label: 'Journalist / Requester', value: sampleData.name, isBold: true });
        rows.push({ label: 'Media Publication', value: sampleData.organization, isBold: true });
        rows.push({ label: 'Work Email', value: sampleData.email });
        rows.push({ label: 'Press Clearance', value: 'Approved (Digital Kit Dispatched)' });
      } else if (tpl.targetForm === 'request-partner') {
        rows.push({ label: 'Partner Lead', value: sampleData.name, isBold: true });
        rows.push({ label: 'Enterprise Partner', value: sampleData.company, isBold: true });
        rows.push({ label: 'Alliance Model', value: sampleData.partnershipType });
        rows.push({ label: 'Business Email', value: sampleData.email });
        rows.push({ label: 'Contact Phone', value: sampleData.phone });
      } else if (tpl.targetForm === 'sponsorship') {
        rows.push({ label: 'Sponsor Executive', value: sampleData.name, isBold: true });
        rows.push({ label: 'Corporate Sponsor', value: sampleData.company, isBold: true });
        rows.push({ label: 'Tier Requested', value: sampleData.sponsorshipType });
        rows.push({ label: 'Official Email', value: sampleData.email });
      } else if (tpl.targetForm === 'request-pr') {
        rows.push({ label: 'Inquirer Name', value: sampleData.name, isBold: true });
        rows.push({ label: 'Work Email', value: sampleData.email });
        rows.push({ label: 'Contact Phone', value: sampleData.phone });
        rows.push({ label: 'Subject / Topic', value: 'Public Relations & Inquiries', isBold: true });
        rows.push({ label: 'Message Overview', value: sampleData.inquiry || 'Requesting corporate communications review.' });
        rows.push({ label: 'Routing Mailbox', value: tpl.targetMailbox || 'contact@zawrindustries.com' });
      } else if (tpl.targetForm === 'rsvp') {
        rows.push({ label: 'Attendee Name', value: sampleData.name, isBold: true });
        rows.push({ label: 'Organization', value: sampleData.organization, isBold: true });
        rows.push({ label: 'Corporate Email', value: sampleData.email });
        rows.push({ label: 'Summit Event', value: 'Global Industrial & AI Summit 2026' });
        rows.push({ label: 'Pass Status', value: 'VIP Executive Pass Registered', isBold: true });
        rows.push({ label: 'Target Mailbox', value: tpl.targetMailbox || 'contact@zawrindustries.com' });
      } else if (tpl.targetForm === 'newsletter') {
        rows.push({ label: 'Subscribed Email', value: sampleData.email, isBold: true });
        rows.push({ label: 'Signup Origin', value: 'Newsroom Public Gateway' });
        rows.push({ label: 'Opt-in Status', value: 'Double Opt-In Confirmed', isBold: true });
        rows.push({ label: 'Timestamp', value: sampleData.date });
      } else {
        rows.push({ label: 'Submitter Name', value: sampleData.name, isBold: true });
        rows.push({ label: 'Registered Email', value: sampleData.email });
        rows.push({ label: 'Contact Phone', value: sampleData.phone });
        rows.push({ label: 'Topic / Message', value: sampleData.inquiry || 'General inquiry submitted' });
        rows.push({ label: 'Submission Date', value: sampleData.date });
      }

      tableRowsHtml = rows.map((r, i) => `
        <tr>
          <td style="padding: 10px 0; font-size: 13px; color: #777777; ${i > 0 ? 'border-top: 1px solid #f5f5f5;' : ''}" width="38%">${r.label}</td>
          <td style="padding: 10px 0; font-size: 13.5px; color: #000000; ${i > 0 ? 'border-top: 1px solid #f5f5f5;' : ''} ${r.isBold ? 'font-weight: 600;' : 'font-weight: 500;'}">${r.value}</td>
        </tr>
      `).join('');
    } else {
      const rows = [
        { label: 'Reference Identifier', value: '#ZWR-DEMO-991', isBold: true },
        { label: 'Registered Email', value: sampleData.email },
        { label: 'Contact Phone', value: sampleData.phone },
        { label: 'Submission Date', value: sampleData.date }
      ];
      tableRowsHtml = rows.map((r, i) => `
        <tr>
          <td style="padding: 12px 0; font-size: 13.5px; color: #777777; ${i > 0 ? 'border-top: 1px solid #f5f5f5;' : ''}" width="36%">${r.label}</td>
          <td style="padding: 12px 0; font-size: 13.5px; color: #000000; ${i > 0 ? 'border-top: 1px solid #f5f5f5;' : ''} ${r.isBold ? 'font-weight: 600;' : 'font-weight: 500;'}">${r.value}</td>
        </tr>
      `).join('');
    }

    const recipientGreeting = isInternalAlert
      ? (tpl.targetMailbox ? tpl.targetMailbox.split('@')[0].toUpperCase() + ' Operations Desk' : 'Zawr Operations Team')
      : sampleData.name;

    return `
      <div style="font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 580px; margin: 0 auto; background: #ffffff; color: #111111; padding: 36px 28px; border-radius: 8px;">
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #eeeeee; padding-bottom: 18px;">
          <div>
            <strong style="font-size: 19px; font-weight: 800; letter-spacing: 0.02em; color: #000000;">ZAWR</strong>
            <span style="font-size: 19px; font-weight: 400; letter-spacing: 0.08em; color: #000000; margin-left: 4px;">INDUSTRIES</span>
          </div>
          <span style="font-size: 11px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: ${isInternalAlert ? '#10b981' : '#666666'};">
            ${isInternalAlert ? `INTERNAL DISPATCH • ${tpl.targetMailbox || 'GATEWAY'}` : tpl.category}
          </span>
        </div>

        <div style="padding-top: 28px; padding-bottom: 14px;">
          <h1 style="margin: 0; font-size: 22px; font-weight: 600; color: #000000; line-height: 1.3; letter-spacing: -0.02em;">
            ${heading}
          </h1>
        </div>

        <div style="padding-bottom: 20px;">
          <p style="margin: 0 0 12px 0; font-size: 14.5px; line-height: 1.6; color: #333333;">
            Dear <strong style="color: #000000;">${recipientGreeting}</strong>,
          </p>
          <p style="margin: 0; font-size: 14.5px; line-height: 1.65; color: #555555;">
            ${intro}
          </p>
        </div>

        <table style="width: 100%; border-top: 1px solid #eeeeee; border-bottom: 1px solid #eeeeee; border-collapse: collapse; margin-bottom: 24px; font-size: 13.5px;">
          ${tableRowsHtml}
        </table>

        ${tpl.noticeTitle && notice ? `
          <div style="padding-bottom: 30px;">
            <p style="margin: 0 0 8px 0; font-size: 14px; font-weight: 600; color: #000000; letter-spacing: -0.01em;">
              ${tpl.noticeTitle}
            </p>
            <p style="margin: 0; font-size: 14px; line-height: 1.65; color: #555555;">
              ${notice}
            </p>
          </div>
        ` : ''}

        <div style="padding-bottom: 36px;">
          <p style="margin: 0 0 4px 0; font-size: 13.5px; color: #777777;">${isInternalAlert ? 'Dispatched by:' : 'Warm regards,'}</p>
          <p style="margin: 0; font-size: 14.5px; font-weight: 600; color: #000000;">
            ${tpl.signoffTeam}<br/>
            <span style="font-weight: 400; color: #777777;">Zawr Industries</span>
          </p>
        </div>

        <div style="padding-top: 20px; border-top: 1px solid #eeeeee; text-align: center; font-size: 11.5px; color: #888888;">
          © ${new Date().getFullYear()} Zawr Industries. All rights reserved. • Bengaluru, India • zawrindustries.com
        </div>
      </div>
    `;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', height: '100%', flex: 1, minHeight: 0, width: '100%', color: theme.fg, overflow: 'hidden' }}>
      
      {/* ── 1. TOP HEADER BAR (ZAWR LUXURY MINIMALIST THEME) ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', width: '100%', flexShrink: 0 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.25rem' }}>
            <div style={{
              width: '28px',
              height: '28px',
              borderRadius: '8px',
              backgroundColor: isDark ? '#18181b' : '#f4f4f5',
              border: `1px solid ${theme.border}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: theme.fg
            }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="8" rx="2" ry="2"/>
                <rect x="2" y="14" width="20" height="8" rx="2" ry="2"/>
                <line x1="6" y1="6" x2="6.01" y2="6"/>
                <line x1="6" y1="18" x2="6.01" y2="18"/>
              </svg>
            </div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.02em', margin: 0, color: theme.fg }}>
              Email &amp; Routing Engine
            </h2>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              backgroundColor: isDark ? '#18181b' : '#f4f4f5',
              border: `1px solid ${theme.border}`,
              color: theme.muted,
              fontSize: '0.72rem',
              fontWeight: 600,
              padding: '0.2rem 0.65rem',
              borderRadius: '9999px'
            }}>
              v3.0 Production
            </span>
          </div>
          <p style={{ fontSize: '0.82rem', color: theme.muted, margin: 0 }}>
            Visual node flow mapper, transactional auto-responder designer, and Nodemailer SMTP routing hub
          </p>
        </div>

        {/* Action Controls & Navigation Switcher */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          
          {/* Top Segmented Navigation Tabs */}
          <div style={{
            display: 'inline-flex',
            backgroundColor: theme.inputBg,
            padding: '3px',
            borderRadius: '8px',
            border: `1px solid ${theme.border}`
          }}>
            {[
              { id: 'canvas', label: 'Visual Node Graph' },
              { id: 'templates', label: 'Template Studio' },
              { id: 'matrix', label: 'Route Matrix' },
              { id: 'smtp', label: 'SMTP Gateway' },
              { id: 'reports', label: 'Executive Reports' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                style={{
                  padding: '0.45rem 0.85rem',
                  borderRadius: '6px',
                  border: 'none',
                  fontSize: '0.78rem',
                  fontWeight: activeTab === tab.id ? 700 : 500,
                  backgroundColor: activeTab === tab.id ? (isDark ? '#27272a' : '#ffffff') : 'transparent',
                  color: activeTab === tab.id ? (isDark ? '#ffffff' : '#09090b') : theme.muted,
                  boxShadow: activeTab === tab.id ? (isDark ? '0 2px 8px rgba(0,0,0,0.5)' : '0 1px 4px rgba(0,0,0,0.08)') : 'none',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Realtime SMTP Latency Badge */}
          <div
            onClick={handleTestSmtp}
            title="Click to run live SMTP Handshake test"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.45rem 0.8rem',
              backgroundColor: smtpStatus.success ? (isDark ? '#052e16' : '#dcfce7') : (isDark ? '#450a0a' : '#fee2e2'),
              border: isDark ? (smtpStatus.success ? '1px solid #166534' : '1px solid #991b1b') : (smtpStatus.success ? '1px solid #86efac' : '1px solid #fca5a5'),
              borderRadius: '8px',
              fontSize: '0.75rem',
              color: smtpStatus.success ? (isDark ? '#4ade80' : '#15803d') : (isDark ? '#f87171' : '#dc2626'),
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.15s'
            }}
          >
            <span style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: smtpStatus.success ? (isDark ? '#4ade80' : '#16a34a') : '#ef4444',
              display: 'inline-block',
              animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
            }} />
            <span>{smtpTesting ? 'Testing...' : `TLS 1.3 (${smtpStatus.latencyMs}ms)`}</span>
          </div>

          {/* Fire Live Test Pulse Button (Pure Monochrome Primary) */}
          <button
            onClick={handleFireSignalPulse}
            disabled={pulseActive}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              padding: '0.55rem 1rem',
              backgroundColor: theme.fg,
              color: theme.bg,
              border: 'none',
              borderRadius: '8px',
              fontSize: '0.82rem',
              fontWeight: 600,
              cursor: pulseActive ? 'not-allowed' : 'pointer',
              transition: 'all 0.15s'
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
            <span>{pulseActive ? 'Testing Signal...' : 'Test Route Signal'}</span>
          </button>

          {/* Add Custom Node */}
          <button
            onClick={() => setAddNodeModalOpen(true)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.55rem 0.95rem',
              backgroundColor: theme.inputBg,
              border: `1px solid ${theme.border}`,
              color: theme.fg,
              borderRadius: '8px',
              fontSize: '0.82rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.15s'
            }}
          >
            <span>+ Add Node</span>
          </button>
        </div>
      </div>

      {/* ── 2. VIEW 1: COMFYUI-STYLE VISUAL NODE GRAPH ── */}
      {activeTab === 'canvas' && (
        <div style={{
          border: `1px solid ${theme.border}`,
          borderRadius: '12px',
          overflow: 'hidden',
          backgroundColor: isDark ? '#09090b' : '#f8fafc',
          position: 'relative',
          flex: 1,
          minHeight: 0,
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column'
        }}>
          {/* Canvas Viewport */}
          <div
            ref={canvasRef}
            onMouseDown={handleCanvasMouseDown}
            onMouseMove={handleCanvasMouseMove}
            onMouseUp={handleCanvasMouseUp}
            style={{
              flex: 1,
              position: 'relative',
              overflow: 'hidden',
              cursor: isPanning ? 'grabbing' : 'grab',
              backgroundColor: isDark ? '#09090b' : '#f8fafc',
              backgroundImage: isDark
                ? 'radial-gradient(rgba(255, 255, 255, 0.07) 1px, transparent 1px)'
                : 'radial-gradient(rgba(0, 0, 0, 0.07) 1px, transparent 1px)',
              backgroundSize: `${24 * scale}px ${24 * scale}px`,
              backgroundPosition: `${pan.x}px ${pan.y}px`
            }}
          >
            {/* Canvas Floating Controls */}
            <div style={{
              position: 'absolute',
              top: '1rem',
              right: '1rem',
              zIndex: 40,
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
              backgroundColor: isDark ? 'rgba(18, 18, 20, 0.9)' : 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(8px)',
              border: `1px solid ${theme.border}`,
              borderRadius: '8px',
              padding: '0.25rem'
            }}>
              <button onClick={() => setScale(s => Math.min(1.4, s + 0.1))} style={{ width: '28px', height: '28px', backgroundColor: 'transparent', border: 'none', color: theme.fg, cursor: 'pointer', fontWeight: 700, borderRadius: '4px' }}>+</button>
              <span style={{ fontSize: '0.72rem', color: theme.muted, minWidth: '42px', textAlign: 'center', fontWeight: 600 }}>{Math.round(scale * 100)}%</span>
              <button onClick={() => setScale(s => Math.max(0.4, s - 0.1))} style={{ width: '28px', height: '28px', backgroundColor: 'transparent', border: 'none', color: theme.fg, cursor: 'pointer', fontWeight: 700, borderRadius: '4px' }}>-</button>
              <div style={{ width: '1px', height: '16px', backgroundColor: theme.border }} />
              <button
                onClick={() => { setNodes(DEFAULT_NODES); setConnections(DEFAULT_CONNECTIONS); saveNodeLayout(DEFAULT_NODES, DEFAULT_CONNECTIONS); setScale(0.85); setPan({ x: 30, y: 20 }); }}
                style={{ padding: '0.2rem 0.55rem', backgroundColor: 'transparent', border: 'none', color: theme.muted, cursor: 'pointer', fontSize: '0.72rem', fontWeight: 600 }}
              >
                Reset
              </button>
            </div>

            {/* Interactive Wiring Status Banner */}
            {connectingStart && (
              <div style={{
                position: 'absolute',
                top: '1rem',
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: 40,
                padding: '0.45rem 1rem',
                backgroundColor: isDark ? '#18181b' : '#09090b',
                color: '#ffffff',
                border: `1px solid ${theme.border}`,
                borderRadius: '9999px',
                fontSize: '0.78rem',
                fontWeight: 600,
                boxShadow: isDark ? '0 4px 20px rgba(0,0,0,0.8)' : '0 4px 15px rgba(0,0,0,0.15)'
              }}>
                Select destination input socket to connect cable • Click canvas to cancel
              </div>
            )}

            {/* 2D Canvas Transform Container */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale})`,
              transformOrigin: '0 0',
              pointerEvents: 'none'
            }}>
              {/* SVG Splines / Cables */}
              <svg style={{ position: 'absolute', top: 0, left: 0, width: '4000px', height: '3000px', pointerEvents: 'none', overflow: 'visible' }}>
                <defs>
                  <filter id="wire-glow-subtle" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="2" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                {connections.map(conn => {
                  const fromPos = getNodePortPos(conn.fromNode, conn.fromPort, true);
                  const toPos = getNodePortPos(conn.toNode, conn.toPort, false);

                  if (fromPos.x === 0 || toPos.x === 0) return null;

                  const dx = Math.abs(toPos.x - fromPos.x) * 0.55;
                  const pathD = `M ${fromPos.x} ${fromPos.y} C ${fromPos.x + dx} ${fromPos.y}, ${toPos.x - dx} ${toPos.y}, ${toPos.x} ${toPos.y}`;
                  const isSelected = selectedNodeId === conn.fromNode || selectedNodeId === conn.toNode;
                  const isPulse = animatingConnectionIds.includes(conn.id);

                  return (
                    <g key={conn.id}>
                      <path d={pathD} fill="none" stroke={isDark ? '#000000' : '#cbd5e1'} strokeWidth={isSelected ? 4 : 3} strokeOpacity={0.5} />
                      <path
                        d={pathD}
                        fill="none"
                        stroke={conn.color}
                        strokeWidth={isSelected ? 2.5 : 1.8}
                        strokeOpacity={isSelected ? 1 : 0.7}
                        filter={isSelected ? 'url(#wire-glow-subtle)' : undefined}
                      />
                      {isPulse && (
                        <circle r="4" fill="#ffffff">
                          <animateMotion path={pathD} dur="0.8s" repeatCount="1" rotate="auto" />
                        </circle>
                      )}
                    </g>
                  );
                })}
              </svg>

              {/* Node Cards */}
              {nodes.map(node => {
                const isSelected = selectedNodeId === node.id;
                const nodeWidth = 320;

                return (
                  <div
                    key={node.id}
                    className="flow-node-card"
                    onMouseDown={e => handleNodeMouseDown(e, node)}
                    style={{
                      position: 'absolute',
                      left: `${node.x}px`,
                      top: `${node.y}px`,
                      width: `${nodeWidth}px`,
                      backgroundColor: isDark ? '#121216' : '#ffffff',
                      border: `1px solid ${isSelected ? (isDark ? '#52525b' : '#71717a') : (isDark ? '#27272a' : '#e4e4e7')}`,
                      borderRadius: '10px',
                      boxShadow: isSelected
                        ? (isDark ? '0 8px 30px rgba(0,0,0,0.8), 0 0 0 1px #52525b' : '0 8px 25px rgba(0,0,0,0.12)')
                        : (isDark ? '0 4px 20px rgba(0,0,0,0.4)' : '0 2px 10px rgba(0,0,0,0.04)'),
                      pointerEvents: 'auto',
                      userSelect: 'none',
                      zIndex: isSelected ? 30 : 10
                    }}
                  >
                    {/* Node Header */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.65rem 0.85rem',
                      borderBottom: `1px solid ${isDark ? '#27272a' : '#e4e4e7'}`,
                      backgroundColor: isDark ? '#18181c' : '#f9fafb',
                      borderTopLeftRadius: '9px',
                      borderTopRightRadius: '9px'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: node.color }} />
                        <span style={{ fontSize: '0.82rem', fontWeight: 700, color: theme.fg }}>{node.title}</span>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        {node.statusBadge && (
                          <span style={{ fontSize: '0.65rem', padding: '0.15rem 0.45rem', backgroundColor: isDark ? '#27272a' : '#f4f4f5', color: theme.muted, borderRadius: '4px', fontWeight: 600 }}>
                            {node.statusBadge}
                          </span>
                        )}
                        {node.category !== 'filter' && node.category !== 'transport' && (
                          <button onClick={() => handleDeleteNode(node.id)} title="Delete Node" style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '0.8rem', padding: '0 0.2rem' }}>
                            ✕
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Sockets */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0' }}>
                      {/* Left Inputs */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {node.inputs.map(inp => (
                          <div
                            key={inp.id}
                            className="port-socket"
                            onClick={() => handlePortClick(node.id, inp.id, false, inp.color)}
                            style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', position: 'relative', left: '-5px', cursor: 'pointer' }}
                          >
                            <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: inp.color, border: isDark ? '2px solid #121216' : '2px solid #ffffff' }} />
                            <span style={{ fontSize: '0.72rem', color: theme.muted, fontWeight: 500 }}>{inp.label}</span>
                          </div>
                        ))}
                      </div>

                      {/* Right Outputs */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'flex-end', marginLeft: 'auto' }}>
                        {node.outputs.map(out => (
                          <div
                            key={out.id}
                            className="port-socket"
                            onClick={() => handlePortClick(node.id, out.id, true, out.color)}
                            style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', position: 'relative', right: '-5px', cursor: 'pointer' }}
                          >
                            <span style={{ fontSize: '0.72rem', color: theme.muted, fontWeight: 500 }}>{out.label}</span>
                            <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: out.color, border: isDark ? '2px solid #121216' : '2px solid #ffffff' }} />
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Controls */}
                    <div style={{ padding: '0.65rem 0.85rem', display: 'flex', flexDirection: 'column', gap: '0.45rem', borderTop: `1px solid ${isDark ? '#27272a' : '#e4e4e7'}` }}>
                      {node.controls.map(ctrl => (
                        <div
                          key={ctrl.id}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            backgroundColor: isDark ? '#18181b' : '#f4f4f5',
                            border: `1px solid ${isDark ? '#27272a' : '#e4e4e7'}`,
                            borderRadius: '6px',
                            padding: '0.35rem 0.6rem',
                            fontSize: '0.75rem'
                          }}
                        >
                          <span style={{ color: theme.muted, fontWeight: 500 }}>{ctrl.label}</span>

                          {ctrl.type === 'stepper' && ctrl.options ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                              <button onClick={() => handleControlCycle(node.id, ctrl.id, -1)} style={{ background: 'none', border: 'none', color: theme.muted, cursor: 'pointer', fontSize: '0.8rem', fontWeight: 700 }}>‹</button>
                              <span style={{ color: theme.fg, fontWeight: 600, minWidth: '70px', textAlign: 'center' }}>{ctrl.value}</span>
                              <button onClick={() => handleControlCycle(node.id, ctrl.id, 1)} style={{ background: 'none', border: 'none', color: theme.muted, cursor: 'pointer', fontSize: '0.8rem', fontWeight: 700 }}>›</button>
                            </div>
                          ) : (
                            <span style={{ fontFamily: 'monospace', color: theme.fg, fontWeight: 600 }}>{ctrl.value}</span>
                          )}
                        </div>
                      ))}

                      {/* Prominent Button to Preview What Submitter Receives */}
                      {node.category === 'origin' && (
                        <div style={{ display: 'flex', gap: '0.35rem', marginTop: '0.2rem' }}>
                          <button
                            onClick={() => handleOpenSubmitterPreview(node.templateId)}
                            style={{
                              flex: 1,
                              padding: '0.4rem',
                              backgroundColor: isDark ? '#27272a' : '#f4f4f5',
                              border: `1px solid ${theme.border}`,
                              borderRadius: '6px',
                              color: theme.fg,
                              fontSize: '0.72rem',
                              fontWeight: 600,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '0.35rem',
                              transition: 'all 0.15s'
                            }}
                          >
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                            <span>Preview Submitter Email</span>
                          </button>
                          
                          <button
                            onClick={() => {
                              setSelectedTemplateId(node.templateId || 'tpl-job-applicant');
                              setActiveTab('templates');
                            }}
                            title="Edit copy in Template Studio"
                            style={{
                              padding: '0.4rem 0.6rem',
                              backgroundColor: isDark ? '#18181b' : '#ffffff',
                              border: `1px solid ${theme.border}`,
                              borderRadius: '6px',
                              color: theme.muted,
                              fontSize: '0.72rem',
                              fontWeight: 600,
                              cursor: 'pointer'
                            }}
                          >
                            ✏️ Edit
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── 3. VIEW 2: EMAIL TEMPLATE DESIGNER & LIVE STUDIO ── */}
      {activeTab === 'templates' && (
        <div style={{
          border: `1px solid ${theme.border}`,
          borderRadius: '12px',
          overflow: 'hidden',
          backgroundColor: theme.inputBg,
          display: 'flex',
          flex: 1,
          minHeight: 0,
          height: '100%',
          width: '100%'
        }}>
          {/* Left Column: Template List */}
          <div style={{
            width: '300px',
            borderRight: `1px solid ${theme.border}`,
            backgroundColor: isDark ? '#0c0c0e' : '#f9fafb',
            display: 'flex',
            flexDirection: 'column',
            flexShrink: 0
          }}>
            <div style={{ padding: '1rem', borderBottom: `1px solid ${theme.border}` }}>
              {/* Perspective Switcher (Submitter vs Internal Alert) */}
              <div style={{ display: 'flex', width: '100%', gap: '0.25rem', backgroundColor: theme.inputBg, padding: '3px', borderRadius: '8px', border: `1px solid ${theme.border}`, marginBottom: '0.85rem' }}>
                <button
                  onClick={() => handlePerspectiveChange('submitter')}
                  style={{
                    flex: 1,
                    padding: '0.35rem 0.45rem',
                    borderRadius: '6px',
                    border: 'none',
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    backgroundColor: previewPerspective === 'submitter' ? (isDark ? '#27272a' : '#ffffff') : 'transparent',
                    color: previewPerspective === 'submitter' ? theme.fg : theme.muted,
                    cursor: 'pointer',
                    boxShadow: previewPerspective === 'submitter' ? (isDark ? '0 1px 4px rgba(0,0,0,0.5)' : '0 1px 3px rgba(0,0,0,0.08)') : 'none',
                    transition: 'all 0.15s'
                  }}
                >
                  What Submitter Gets
                </button>
                <button
                  onClick={() => handlePerspectiveChange('internal')}
                  style={{
                    flex: 1,
                    padding: '0.35rem 0.45rem',
                    borderRadius: '6px',
                    border: 'none',
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    backgroundColor: previewPerspective === 'internal' ? (isDark ? '#27272a' : '#ffffff') : 'transparent',
                    color: previewPerspective === 'internal' ? theme.fg : theme.muted,
                    cursor: 'pointer',
                    boxShadow: previewPerspective === 'internal' ? (isDark ? '0 1px 4px rgba(0,0,0,0.5)' : '0 1px 3px rgba(0,0,0,0.08)') : 'none',
                    transition: 'all 0.15s'
                  }}
                >
                  Internal Alert
                </button>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '0 0 0.2rem 0' }}>
                <h3 style={{ margin: 0, fontSize: '0.92rem', fontWeight: 700, color: theme.fg }}>
                  {previewPerspective === 'submitter' ? 'Submitter Receipts' : 'Internal Alerts'} ({displayedTemplates.length})
                </h3>
                <span style={{ fontSize: '0.68rem', padding: '0.15rem 0.45rem', borderRadius: '4px', backgroundColor: isDark ? '#27272a' : '#f4f4f5', color: theme.muted, fontWeight: 600 }}>
                  {previewPerspective === 'submitter' ? 'Client Facing' : 'Ops Dispatches'}
                </span>
              </div>
              <p style={{ margin: '0.15rem 0 0 0', fontSize: '0.72rem', color: theme.muted }}>
                {previewPerspective === 'submitter' ? 'Auto-responder emails delivered to users' : 'Notification alerts dispatched to company mailboxes'}
              </p>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '0.5rem' }}>
              {displayedTemplates.map(tpl => {
                const isSelected = selectedTemplateId === tpl.id;
                const isInternal = tpl.type === 'internal';
                return (
                  <div
                    key={tpl.id}
                    onClick={() => setSelectedTemplateId(tpl.id)}
                    style={{
                      padding: '0.75rem 0.85rem',
                      borderRadius: '8px',
                      marginBottom: '0.35rem',
                      backgroundColor: isSelected ? (isDark ? '#27272a' : '#ffffff') : 'transparent',
                      border: `1px solid ${isSelected ? (isDark ? '#52525b' : '#e4e4e7') : 'transparent'}`,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                      <span style={{ fontSize: '0.82rem', fontWeight: isSelected ? 700 : 600, color: theme.fg }}>
                        {tpl.name}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.72rem', color: theme.muted, display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                      <span style={{
                        padding: '0.1rem 0.4rem',
                        backgroundColor: isInternal ? (isDark ? '#052e16' : '#dcfce7') : (isDark ? '#18181b' : '#f4f4f5'),
                        color: isInternal ? (isDark ? '#4ade80' : '#166534') : theme.fg,
                        borderRadius: '4px',
                        fontSize: '0.68rem',
                        fontWeight: 600
                      }}>
                        {isInternal ? `Alert ➔ ${tpl.targetMailbox || 'Ops'}` : 'Receipt'}
                      </span>
                      <span style={{ fontFamily: 'monospace', color: theme.muted }}>/{tpl.targetForm}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Center Column: Visual Form Editor + Sample Data Customizer */}
          {currentTemplate && (
            <div style={{ flex: 1, overflowY: 'auto', padding: '1.75rem', borderRight: `1px solid ${theme.border}` }}>
              <div style={{ maxWidth: '650px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                  <div>
                    <h2 style={{ margin: 0, fontSize: '1.35rem', fontWeight: 800, letterSpacing: '-0.02em', color: theme.fg }}>
                      {currentTemplate.name}
                    </h2>
                    <span style={{ fontSize: '0.75rem', color: theme.muted }}>
                      Category: {currentTemplate.category} • Bound to /{currentTemplate.targetForm}
                    </span>
                  </div>
                  <button
                    onClick={handleSaveTemplates}
                    style={{
                      padding: '0.55rem 1.25rem',
                      backgroundColor: theme.fg,
                      color: theme.bg,
                      border: 'none',
                      borderRadius: '8px',
                      fontWeight: 600,
                      fontSize: '0.82rem',
                      cursor: 'pointer',
                      transition: 'all 0.15s'
                    }}
                  >
                    {templateSaveSuccess ? '✓ Saved Live' : 'Save Changes'}
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  {/* Email Subject Line */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: theme.fg, marginBottom: '0.4rem' }}>
                      Email Subject Line
                    </label>
                    <input
                      type="text"
                      value={currentTemplate.subject}
                      onChange={e => {
                        const updated = templates.map(t => t.id === currentTemplate.id ? { ...t, subject: e.target.value } : t);
                        setTemplates(updated);
                      }}
                      style={{ width: '100%', padding: '0.75rem', backgroundColor: isDark ? '#18181b' : '#ffffff', border: `1px solid ${theme.border}`, borderRadius: '8px', color: theme.fg, fontSize: '0.85rem' }}
                    />
                  </div>

                  {/* Main Headline */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: theme.fg, marginBottom: '0.4rem' }}>
                      Main Email Headline
                    </label>
                    <input
                      type="text"
                      value={currentTemplate.heading}
                      onChange={e => {
                        const updated = templates.map(t => t.id === currentTemplate.id ? { ...t, heading: e.target.value } : t);
                        setTemplates(updated);
                      }}
                      style={{ width: '100%', padding: '0.75rem', backgroundColor: isDark ? '#18181b' : '#ffffff', border: `1px solid ${theme.border}`, borderRadius: '8px', color: theme.fg, fontSize: '0.85rem' }}
                    />
                  </div>

                  {/* Intro Paragraph */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: theme.fg, marginBottom: '0.4rem' }}>
                      Opening Paragraph (Supports Variables)
                    </label>
                    <textarea
                      rows={4}
                      value={currentTemplate.introParagraph}
                      onChange={e => {
                        const updated = templates.map(t => t.id === currentTemplate.id ? { ...t, introParagraph: e.target.value } : t);
                        setTemplates(updated);
                      }}
                      style={{ width: '100%', padding: '0.75rem', backgroundColor: isDark ? '#18181b' : '#ffffff', border: `1px solid ${theme.border}`, borderRadius: '8px', color: theme.fg, fontSize: '0.85rem', resize: 'vertical' }}
                    />
                  </div>

                  {/* Variable Pills */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: theme.muted, marginBottom: '0.4rem' }}>
                      Click to Copy Dynamic Placeholders:
                    </label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                      {currentTemplate.variables.map(v => (
                        <span
                          key={v}
                          onClick={() => navigator.clipboard.writeText(v)}
                          title="Click to copy variable"
                          style={{
                            padding: '0.25rem 0.6rem',
                            backgroundColor: isDark ? '#18181b' : '#f4f4f5',
                            border: `1px solid ${theme.border}`,
                            borderRadius: '6px',
                            fontSize: '0.72rem',
                            fontFamily: 'monospace',
                            color: theme.fg,
                            cursor: 'pointer'
                          }}
                        >
                          {v}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Notice Section */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: theme.fg, marginBottom: '0.4rem' }}>
                        Notice Heading (Optional)
                      </label>
                      <input
                        type="text"
                        value={currentTemplate.noticeTitle || ''}
                        onChange={e => {
                          const updated = templates.map(t => t.id === currentTemplate.id ? { ...t, noticeTitle: e.target.value } : t);
                          setTemplates(updated);
                        }}
                        style={{ width: '100%', padding: '0.75rem', backgroundColor: isDark ? '#18181b' : '#ffffff', border: `1px solid ${theme.border}`, borderRadius: '8px', color: theme.fg, fontSize: '0.85rem' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: theme.fg, marginBottom: '0.4rem' }}>
                        Sign-off Team Designation
                      </label>
                      <input
                        type="text"
                        value={currentTemplate.signoffTeam}
                        onChange={e => {
                          const updated = templates.map(t => t.id === currentTemplate.id ? { ...t, signoffTeam: e.target.value } : t);
                          setTemplates(updated);
                        }}
                        style={{ width: '100%', padding: '0.75rem', backgroundColor: isDark ? '#18181b' : '#ffffff', border: `1px solid ${theme.border}`, borderRadius: '8px', color: theme.fg, fontSize: '0.85rem' }}
                      />
                    </div>
                  </div>

                  {/* Live Sample Data Customizer (Test Submitter Fields) */}
                  <div style={{ padding: '1.25rem', backgroundColor: isDark ? '#18181b' : '#f4f4f5', border: `1px solid ${theme.border}`, borderRadius: '10px' }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.5rem', color: theme.fg }}>
                      Simulate Submitter Data (Live Preview Variables)
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.72rem', color: theme.muted, marginBottom: '0.2rem' }}>Applicant / Submitter Name</label>
                        <input
                          type="text"
                          value={sampleData.name}
                          onChange={e => setSampleData(prev => ({ ...prev, name: e.target.value, firstName: e.target.value.split(' ')[0] || '' }))}
                          style={{ width: '100%', padding: '0.5rem', backgroundColor: isDark ? '#0c0c0e' : '#ffffff', border: `1px solid ${theme.border}`, borderRadius: '6px', color: theme.fg, fontSize: '0.8rem' }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.72rem', color: theme.muted, marginBottom: '0.2rem' }}>Role / Topic / Position</label>
                        <input
                          type="text"
                          value={sampleData.jobTitle}
                          onChange={e => setSampleData(prev => ({ ...prev, jobTitle: e.target.value, skill: e.target.value }))}
                          style={{ width: '100%', padding: '0.5rem', backgroundColor: isDark ? '#0c0c0e' : '#ffffff', border: `1px solid ${theme.border}`, borderRadius: '6px', color: theme.fg, fontSize: '0.8rem' }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.72rem', color: theme.muted, marginBottom: '0.2rem' }}>Company / Organization</label>
                        <input
                          type="text"
                          value={sampleData.company}
                          onChange={e => setSampleData(prev => ({ ...prev, company: e.target.value, companyName: e.target.value, organization: e.target.value }))}
                          style={{ width: '100%', padding: '0.5rem', backgroundColor: isDark ? '#0c0c0e' : '#ffffff', border: `1px solid ${theme.border}`, borderRadius: '6px', color: theme.fg, fontSize: '0.8rem' }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.72rem', color: theme.muted, marginBottom: '0.2rem' }}>Submitter Phone</label>
                        <input
                          type="text"
                          value={sampleData.phone}
                          onChange={e => setSampleData(prev => ({ ...prev, phone: e.target.value }))}
                          style={{ width: '100%', padding: '0.5rem', backgroundColor: isDark ? '#0c0c0e' : '#ffffff', border: `1px solid ${theme.border}`, borderRadius: '6px', color: theme.fg, fontSize: '0.8rem' }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Send Live Test to Inbox */}
                  <div style={{ padding: '1.25rem', backgroundColor: isDark ? '#18181b' : '#f4f4f5', border: `1px solid ${theme.border}`, borderRadius: '10px' }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.5rem', color: theme.fg }}>
                      Dispatch Live Test to Any Inbox
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <input
                        type="email"
                        placeholder="Enter email to receive live preview..."
                        value={testTemplateEmail}
                        onChange={e => setTestTemplateEmail(e.target.value)}
                        style={{ flex: 1, padding: '0.65rem', backgroundColor: isDark ? '#0c0c0e' : '#ffffff', border: `1px solid ${theme.border}`, borderRadius: '8px', color: theme.fg, fontSize: '0.82rem' }}
                      />
                      <button
                        onClick={handleSendTemplateTest}
                        disabled={sendingTemplateTest}
                        style={{
                          padding: '0.65rem 1.25rem',
                          backgroundColor: theme.fg,
                          color: theme.bg,
                          border: 'none',
                          borderRadius: '8px',
                          fontWeight: 600,
                          fontSize: '0.82rem',
                          cursor: sendingTemplateTest ? 'not-allowed' : 'pointer'
                        }}
                      >
                        {sendingTemplateTest ? 'Sending...' : 'Send Test'}
                      </button>
                    </div>
                    {templateTestResult && (
                      <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: templateTestResult.success ? '#10b981' : '#ef4444' }}>
                        {templateTestResult.details}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Right Column: Real-Time Live Preview Frame */}
          <div style={{
            width: '490px',
            backgroundColor: isDark ? '#08080a' : '#f1f5f9',
            display: 'flex',
            flexDirection: 'column',
            flexShrink: 0,
            height: '100%',
            minHeight: 0,
            overflow: 'hidden'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.75rem 1rem',
              borderBottom: `1px solid ${theme.border}`,
              backgroundColor: isDark ? '#121216' : '#ffffff',
              flexWrap: 'wrap',
              gap: '0.5rem',
              flexShrink: 0
            }}>
              <span style={{ fontSize: '0.78rem', fontWeight: 600, color: theme.fg, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <span style={{ width: '6px', height: '6px', backgroundColor: '#10b981', borderRadius: '50%' }} />
                {previewPerspective === 'submitter' ? 'Live User Receipt Preview' : 'Live Internal Dispatch Preview'}
              </span>

              {/* Device Switcher */}
              <div style={{ display: 'flex', gap: '0.25rem' }}>
                <button
                  onClick={() => setPreviewDevice('desktop')}
                  style={{
                    padding: '0.25rem 0.55rem',
                    borderRadius: '6px',
                    border: 'none',
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    backgroundColor: previewDevice === 'desktop' ? (isDark ? '#27272a' : '#09090b') : 'transparent',
                    color: previewDevice === 'desktop' ? '#ffffff' : theme.muted,
                    cursor: 'pointer'
                  }}
                >
                  Desktop
                </button>
                <button
                  onClick={() => setPreviewDevice('mobile')}
                  style={{
                    padding: '0.25rem 0.55rem',
                    borderRadius: '6px',
                    border: 'none',
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    backgroundColor: previewDevice === 'mobile' ? (isDark ? '#27272a' : '#09090b') : 'transparent',
                    color: previewDevice === 'mobile' ? '#ffffff' : theme.muted,
                    cursor: 'pointer'
                  }}
                >
                  Mobile
                </button>
              </div>
            </div>

            <div style={{
              flex: 1,
              overflowY: 'auto',
              overflowX: 'hidden',
              padding: '1.25rem 1rem 2.5rem 1rem',
              minHeight: 0,
              height: '100%',
              display: 'block'
            }}>
              <div
                style={{
                  width: previewDevice === 'mobile' ? '360px' : '100%',
                  maxWidth: '100%',
                  margin: '0 auto',
                  boxShadow: isDark ? '0 10px 30px rgba(0,0,0,0.6)' : '0 10px 25px rgba(0,0,0,0.08)',
                  borderRadius: '8px',
                  overflow: 'hidden'
                }}
                dangerouslySetInnerHTML={{ __html: renderEmailHtml(currentTemplate, previewPerspective) }}
              />
            </div>
          </div>
        </div>
      )}

      {/* ── 4. VIEW 3: ROUTE MATRIX ── */}
      {activeTab === 'matrix' && (
        <div style={{
          border: `1px solid ${theme.border}`,
          borderRadius: '12px',
          overflow: 'hidden',
          backgroundColor: theme.inputBg,
          width: '100%',
          flex: 1,
          minHeight: 0,
          height: '100%',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <div style={{ padding: '1.25rem 1.5rem', borderBottom: `1px solid ${theme.border}`, backgroundColor: theme.sidebarBg || '#000000', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h4 style={{ margin: '0 0 0.2rem 0', fontSize: '0.95rem', fontWeight: 800, color: theme.fg }}>
                Production Route Mapping Matrix
              </h4>
              <span style={{ fontSize: '0.75rem', color: theme.muted }}>All active endpoint routes dynamically linked to destination mailboxes and applicant receipts</span>
            </div>
            <span style={{ fontSize: '0.75rem', color: '#4ade80', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
              <span style={{ width: '6px', height: '6px', backgroundColor: '#4ade80', borderRadius: '50%' }} /> Active Routing
            </span>
          </div>

          <div style={{ overflowX: 'auto', width: '100%', flex: 1, overflowY: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ backgroundColor: isDark ? '#141416' : '#f9fafb', borderBottom: `1px solid ${theme.border}` }}>
                  <th style={{ padding: '0.9rem 1.25rem', fontWeight: 600, color: theme.muted }}>Form Origin (10 Public Gateways)</th>
                  <th style={{ padding: '0.9rem 1.25rem', fontWeight: 600, color: theme.muted }}>Route Endpoint</th>
                  <th style={{ padding: '0.9rem 1.25rem', fontWeight: 600, color: theme.muted }}>Target Internal Mailbox</th>
                  <th style={{ padding: '0.9rem 1.25rem', fontWeight: 600, color: theme.muted }}>User Receipt Email</th>
                  <th style={{ padding: '0.9rem 1.25rem', fontWeight: 600, color: theme.muted }}>Internal Team Alert</th>
                  <th style={{ padding: '0.9rem 1.25rem', fontWeight: 600, color: theme.muted }}>Quick Action</th>
                </tr>
              </thead>
              <tbody>
                {nodes.filter(n => n.category === 'origin').map(n => {
                  const targetMailbox = n.id === 'origin-careers' ? 'hr@zawrindustries.com'
                    : n.id === 'origin-investor' ? 'investors@zawrindustries.com'
                    : n.id === 'origin-partner' ? 'partners@zawrindustries.com'
                    : (n.id === 'origin-media' || n.id === 'origin-newsletter') ? 'media@zawrindustries.com'
                    : 'contact@zawrindustries.com';
                  
                  const endpoint = n.controls.find(c => c.id === 'endpoint')?.value || '';
                  const formKey = endpoint.replace('/api/', '');
                  const matchingInternalTpl = templates.find(t => t.type === 'internal' && t.targetForm === formKey);

                  return (
                    <tr key={n.id} style={{ borderBottom: `1px solid ${theme.border}` }}>
                      <td style={{ padding: '1rem 1.25rem', fontWeight: 700, color: theme.fg }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: n.color }} />
                          {n.title}
                        </div>
                      </td>
                      <td style={{ padding: '1rem 1.25rem', fontFamily: 'monospace', color: theme.muted, fontSize: '0.8rem' }}>
                        {endpoint}
                      </td>
                      <td style={{ padding: '1rem 1.25rem', fontWeight: 600, color: theme.fg }}>
                        <span style={{ padding: '0.2rem 0.55rem', backgroundColor: isDark ? '#18181b' : '#f4f4f5', borderRadius: '5px', fontSize: '0.78rem' }}>
                          {targetMailbox}
                        </span>
                      </td>
                      <td style={{ padding: '1rem 1.25rem' }}>
                        <span style={{ fontSize: '0.75rem', padding: '0.2rem 0.55rem', backgroundColor: isDark ? '#27272a' : '#f4f4f5', color: theme.fg, borderRadius: '4px', fontWeight: 600 }}>
                          {n.controls.find(c => c.id === 'template')?.value || 'Active Receipt'}
                        </span>
                      </td>
                      <td style={{ padding: '1rem 1.25rem' }}>
                        <span style={{ fontSize: '0.75rem', padding: '0.2rem 0.55rem', backgroundColor: isDark ? '#052e16' : '#dcfce7', color: isDark ? '#4ade80' : '#166534', borderRadius: '4px', fontWeight: 600 }}>
                          {matchingInternalTpl?.name || `Ops Alert ➔ ${targetMailbox.split('@')[0]}`}
                        </span>
                      </td>
                      <td style={{ padding: '1rem 1.25rem' }}>
                        <div style={{ display: 'flex', gap: '0.4rem' }}>
                          <button
                            onClick={() => handleOpenSubmitterPreview(n.templateId)}
                            style={{
                              padding: '0.35rem 0.65rem',
                              backgroundColor: isDark ? '#27272a' : '#f4f4f5',
                              border: `1px solid ${theme.border}`,
                              borderRadius: '6px',
                              color: theme.fg,
                              fontSize: '0.72rem',
                              fontWeight: 600,
                              cursor: 'pointer'
                            }}
                          >
                            User Email
                          </button>
                          {matchingInternalTpl && (
                            <button
                              onClick={() => {
                                setInspectingTemplate(matchingInternalTpl);
                                setSubmitterInspectModalOpen(true);
                              }}
                              style={{
                                padding: '0.35rem 0.65rem',
                                backgroundColor: isDark ? '#052e16' : '#dcfce7',
                                border: `1px solid ${isDark ? '#166534' : '#bbf7d0'}`,
                                borderRadius: '6px',
                                color: isDark ? '#4ade80' : '#166534',
                                fontSize: '0.72rem',
                                fontWeight: 600,
                                cursor: 'pointer'
                              }}
                            >
                              Team Alert
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── 5. VIEW 4: MULTI-SMTP CLUSTER & 500 DAILY OUTBOUND QUOTA MANAGER ── */}
      {activeTab === 'smtp' && (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem',
          overflowY: 'auto',
          padding: '0.25rem 0.5rem 2rem 0.25rem',
          flex: 1,
          minHeight: 0,
          width: '100%',
          height: '100%'
        }}>
          {/* Top Metric Cards Row */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1rem',
            width: '100%'
          }}>
            <div style={{
              backgroundColor: theme.inputBg,
              border: `1px solid ${theme.border}`,
              borderRadius: '12px',
              padding: '1.15rem 1.25rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.35rem'
            }}>
              <span style={{ fontSize: '0.74rem', color: theme.muted, textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>
                SMTP Gateway Cluster
              </span>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                <span style={{ fontSize: '1.75rem', fontWeight: 800, color: theme.fg }}>
                  {smtpPool?.gateways?.length || 0}
                </span>
                <span style={{ fontSize: '0.75rem', color: isDark ? '#4ade80' : '#16a34a', fontWeight: 600 }}>
                  ({smtpPool?.gateways?.filter((g: any) => g.enabled).length || 0} active relays)
                </span>
              </div>
            </div>

            <div style={{
              backgroundColor: theme.inputBg,
              border: `1px solid ${theme.border}`,
              borderRadius: '12px',
              padding: '1.15rem 1.25rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.35rem'
            }}>
              <span style={{ fontSize: '0.74rem', color: theme.muted, textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>
                Daily Combined Pool Capacity
              </span>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                <span style={{ fontSize: '1.75rem', fontWeight: 800, color: theme.fg }}>
                  {(smtpPool?.metrics?.totalDailyCapacity || (smtpPool?.gateways?.reduce((s: number, g: any) => s + (g.enabled ? g.dailyLimit : 0), 0)) || 1000).toLocaleString()}
                </span>
                <span style={{ fontSize: '0.75rem', color: theme.muted }}>mails / day (500/gw)</span>
              </div>
            </div>

            <div style={{
              backgroundColor: theme.inputBg,
              border: `1px solid ${theme.border}`,
              borderRadius: '12px',
              padding: '1.15rem 1.25rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.35rem'
            }}>
              <span style={{ fontSize: '0.74rem', color: theme.muted, textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>
                Outbound Sent Today
              </span>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                <span style={{ fontSize: '1.75rem', fontWeight: 800, color: theme.fg }}>
                  {smtpPool?.metrics?.totalSentToday || smtpPool?.gateways?.reduce((s: number, g: any) => s + g.sentToday, 0) || 0}
                </span>
                <span style={{ fontSize: '0.75rem', color: theme.muted }}>
                  / {(smtpPool?.metrics?.totalDailyCapacity || 1000)} sent
                </span>
              </div>
            </div>

            <div style={{
              backgroundColor: theme.inputBg,
              border: `1px solid ${theme.border}`,
              borderRadius: '12px',
              padding: '1.15rem 1.25rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.35rem'
            }}>
              <span style={{ fontSize: '0.74rem', color: theme.muted, textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>
                Remaining Quota Today
              </span>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                <span style={{ fontSize: '1.75rem', fontWeight: 800, color: isDark ? '#4ade80' : '#16a34a' }}>
                  {smtpPool?.metrics?.remainingQuota !== undefined ? smtpPool.metrics.remainingQuota : 986}
                </span>
                <span style={{ fontSize: '0.72rem', color: theme.muted }}>resets @ 00:00 midnight</span>
              </div>
            </div>
          </div>

          {/* Action Feedback Banner */}
          {gatewayActionFeedback && (
            <div style={{
              padding: '0.75rem 1.25rem',
              borderRadius: '8px',
              backgroundColor: gatewayActionFeedback.success ? (isDark ? '#052e16' : '#dcfce7') : 'rgba(239,68,68,0.1)',
              border: `1px solid ${gatewayActionFeedback.success ? (isDark ? '#166534' : '#bbf7d0') : '#ef4444'}`,
              color: gatewayActionFeedback.success ? (isDark ? '#4ade80' : '#166534') : '#ef4444',
              fontSize: '0.8rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <span>{gatewayActionFeedback.message}</span>
              <button
                onClick={() => setGatewayActionFeedback(null)}
                style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', fontWeight: 800 }}
              >
                ✕
              </button>
            </div>
          )}

          {/* Controls & Strategy Toolbar */}
          <div style={{
            backgroundColor: theme.inputBg,
            border: `1px solid ${theme.border}`,
            borderRadius: '12px',
            padding: '1rem 1.25rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: theme.fg }}>
                Load Balancing &amp; Failover Strategy:
              </span>
              <select
                value={smtpPool?.strategy || 'sequential'}
                onChange={(e) => handleUpdateStrategy(e.target.value as any)}
                style={{
                  padding: '0.4rem 0.85rem',
                  backgroundColor: isDark ? '#18181b' : '#ffffff',
                  border: `1px solid ${theme.border}`,
                  borderRadius: '6px',
                  color: theme.fg,
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                <option value="sequential">Sequential Failover (Fill Gateway 1 to 500 -&gt; then Gateway 2)</option>
                <option value="round-robin">Round-Robin Load Balance (Distribute evenly across gateways)</option>
                <option value="lowest-usage">Lowest-Usage First (Auto-select gateway with most remaining quota)</option>
              </select>
            </div>

            <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
              <button
                onClick={handleTestAllGateways}
                disabled={testingAllGateways}
                style={{
                  padding: '0.45rem 0.9rem',
                  backgroundColor: isDark ? '#27272a' : '#f4f4f5',
                  color: theme.fg,
                  border: `1px solid ${theme.border}`,
                  borderRadius: '6px',
                  fontSize: '0.76rem',
                  fontWeight: 700,
                  cursor: testingAllGateways ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem'
                }}
              >
                {testingAllGateways ? 'Pinging All...' : '⚡ Test All Handshakes'}
              </button>

              <button
                onClick={handleOpenAddGateway}
                style={{
                  padding: '0.45rem 1rem',
                  backgroundColor: theme.fg,
                  color: theme.bg,
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '0.76rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem'
                }}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="12" y1="5" x2="12" y2="19"/>
                  <line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
                Add SMTP Gateway
              </button>
            </div>
          </div>

          {/* Gateways Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))',
            gap: '1.25rem',
            width: '100%'
          }}>
            {(!smtpPool?.gateways || smtpPool.gateways.length === 0) ? (
              <div style={{
                padding: '3rem',
                textAlign: 'center',
                backgroundColor: theme.inputBg,
                border: `1px solid ${theme.border}`,
                borderRadius: '12px',
                gridColumn: '1 / -1',
                color: theme.muted
              }}>
                No SMTP gateways configured. Click &quot;Add SMTP Gateway&quot; to configure your outbound relay.
              </div>
            ) : (
              [...smtpPool.gateways]
                .sort((a, b) => (a.priority || 1) - (b.priority || 1))
                .map((gw: SmtpGatewayConfig, index: number) => {
                const limit = gw.dailyLimit || 500;
                const sent = gw.sentToday || 0;
                const remaining = Math.max(0, limit - sent);
                const percent = Math.min(100, Math.round((sent / limit) * 100));
                const isExceeded = sent >= limit;
                const isPrimary = (gw.priority === 1);

                const progressColor = isExceeded ? '#ef4444' : percent > 80 ? '#f59e0b' : (isDark ? '#4ade80' : '#16a34a');

                return (
                  <div
                    key={gw.id}
                    style={{
                      backgroundColor: theme.inputBg,
                      border: `1px solid ${isExceeded ? '#ef4444' : isPrimary ? (isDark ? '#0284c7' : '#38bdf8') : theme.border}`,
                      borderRadius: '12px',
                      padding: '1.35rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '1rem',
                      position: 'relative',
                      boxShadow: isPrimary ? (isDark ? '0 0 20px rgba(56,189,248,0.08)' : '0 0 15px rgba(56,189,248,0.1)') : 'none'
                    }}
                  >
                    {/* Header: Name & Badges */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.75rem' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span style={{
                            fontSize: '0.68rem',
                            fontWeight: 800,
                            padding: '0.18rem 0.55rem',
                            borderRadius: '4px',
                            backgroundColor: isPrimary ? (isDark ? '#082f49' : '#e0f2fe') : (isDark ? '#27272a' : '#f4f4f5'),
                            color: isPrimary ? '#38bdf8' : theme.muted,
                            border: `1px solid ${isPrimary ? (isDark ? '#0284c7' : '#bae6fd') : theme.border}`
                          }}>
                            {isPrimary ? '⭐ PRIORITY 1 (PRIMARY)' : `PRIORITY ${gw.priority || (index + 1)} (FAILOVER)`}
                          </span>
                          <span style={{
                            fontSize: '0.68rem',
                            fontWeight: 700,
                            color: isExceeded ? '#ef4444' : gw.enabled ? (isDark ? '#4ade80' : '#16a34a') : theme.muted,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.3rem'
                          }}>
                            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: isExceeded ? '#ef4444' : gw.enabled ? '#22c55e' : '#71717a' }} />
                            {isExceeded ? 'QUOTA EXCEEDED (500/500)' : gw.enabled ? `ONLINE (${gw.lastLatencyMs || 14}ms TLS 1.3)` : 'PAUSED'}
                          </span>
                        </div>
                        <h4 style={{ margin: '0.4rem 0 0 0', fontSize: '1.05rem', fontWeight: 800, color: theme.fg }}>
                          {gw.name}
                        </h4>
                      </div>

                      {/* Enable / Pause Toggle */}
                      <button
                        onClick={() => handleToggleGateway(gw.id)}
                        title={gw.enabled ? 'Pause this gateway' : 'Activate this gateway'}
                        style={{
                          padding: '0.25rem 0.65rem',
                          borderRadius: '9999px',
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          border: 'none',
                          cursor: 'pointer',
                          backgroundColor: gw.enabled ? (isDark ? 'rgba(74,222,128,0.15)' : '#dcfce7') : (isDark ? '#27272a' : '#f4f4f5'),
                          color: gw.enabled ? (isDark ? '#4ade80' : '#16a34a') : theme.muted
                        }}
                      >
                        {gw.enabled ? '● Active' : '○ Paused'}
                      </button>
                    </div>

                    {/* Server Info Details */}
                    <div style={{
                      backgroundColor: isDark ? '#141417' : '#f4f4f5',
                      border: `1px solid ${theme.border}`,
                      borderRadius: '8px',
                      padding: '0.85rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.45rem',
                      fontSize: '0.76rem'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ color: theme.muted }}>Relay Host:</span>
                        <span style={{ fontFamily: 'monospace', fontWeight: 700, color: theme.fg }}>
                          {gw.host}:{gw.port} ({gw.secure ? 'SSL Strict' : 'STARTTLS'})
                        </span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ color: theme.muted }}>Auth User:</span>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontFamily: 'monospace', color: theme.fg }}>
                          <span>{gw.user}</span>
                          <button
                            onClick={() => navigator.clipboard?.writeText(gw.user)}
                            title="Copy username"
                            style={{ background: 'none', border: 'none', color: theme.muted, cursor: 'pointer', padding: 0 }}
                          >
                            📋
                          </button>
                        </div>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ color: theme.muted }}>Sender Tag:</span>
                        <span style={{ color: theme.fg, fontWeight: 600 }}>
                          &quot;{gw.senderName}&quot; &lt;{gw.senderEmail}&gt;
                        </span>
                      </div>
                    </div>

                    {/* 500 Daily Outbound Quota Tracker Box */}
                    <div style={{
                      border: `1px solid ${theme.border}`,
                      borderRadius: '8px',
                      padding: '0.85rem 1rem',
                      backgroundColor: isDark ? '#18181b' : '#ffffff',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.5rem'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.74rem', fontWeight: 700, color: theme.fg }}>
                          Outbound Daily Limit
                        </span>
                        <span style={{ fontSize: '0.74rem', fontWeight: 800, color: progressColor }}>
                          {sent} / {limit} Mails ({percent}%)
                        </span>
                      </div>

                      {/* Visual Progress Bar */}
                      <div style={{
                        width: '100%',
                        height: '7px',
                        backgroundColor: isDark ? '#27272a' : '#e4e4e7',
                        borderRadius: '9999px',
                        overflow: 'hidden'
                      }}>
                        <div style={{
                          width: `${percent}%`,
                          height: '100%',
                          backgroundColor: progressColor,
                          transition: 'width 0.3s ease'
                        }} />
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.7rem', color: theme.muted }}>
                        <span>{remaining} remaining before failover</span>
                        <span>Auto-resets @ 00:00 midnight</span>
                      </div>
                    </div>

                    {/* Footer Actions */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.5rem', borderTop: `1px solid ${theme.border}`, flexWrap: 'wrap', gap: '0.5rem' }}>
                      <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                        <button
                          onClick={() => handleTestSingleGateway(gw)}
                          disabled={testingGatewayId === gw.id}
                          style={{
                            padding: '0.35rem 0.75rem',
                            backgroundColor: isDark ? '#27272a' : '#f4f4f5',
                            border: `1px solid ${theme.border}`,
                            borderRadius: '6px',
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            color: theme.fg,
                            cursor: testingGatewayId === gw.id ? 'not-allowed' : 'pointer'
                          }}
                        >
                          {testingGatewayId === gw.id ? 'Pinging...' : '⚡ Ping Test'}
                        </button>

                        {!isPrimary && (
                          <button
                            onClick={() => handleSetPrimaryGateway(gw.id)}
                            title="Promote this gateway to Priority 1 Primary"
                            style={{
                              padding: '0.35rem 0.75rem',
                              backgroundColor: isDark ? 'rgba(56,189,248,0.1)' : '#e0f2fe',
                              border: `1px solid ${isDark ? '#0284c7' : '#bae6fd'}`,
                              borderRadius: '6px',
                              fontSize: '0.72rem',
                              fontWeight: 700,
                              color: isDark ? '#38bdf8' : '#0369a1',
                              cursor: 'pointer'
                            }}
                          >
                            ⭐ Set as Primary
                          </button>
                        )}

                        <button
                          onClick={() => handleOpenEditGateway(gw)}
                          style={{
                            padding: '0.35rem 0.75rem',
                            backgroundColor: 'transparent',
                            border: `1px solid ${theme.border}`,
                            borderRadius: '6px',
                            fontSize: '0.72rem',
                            fontWeight: 600,
                            color: theme.fg,
                            cursor: 'pointer'
                          }}
                        >
                          ✏️ Edit
                        </button>

                        <button
                          onClick={() => handleResetDailyQuota(gw.id)}
                          title="Reset daily sent counter to 0"
                          style={{
                            padding: '0.35rem 0.65rem',
                            backgroundColor: 'transparent',
                            border: `1px solid ${theme.border}`,
                            borderRadius: '6px',
                            fontSize: '0.72rem',
                            color: theme.muted,
                            cursor: 'pointer'
                          }}
                        >
                          🔄 Reset Quota
                        </button>
                      </div>

                      {smtpPool.gateways.length > 1 && (
                        <button
                          onClick={() => handleDeleteGateway(gw.id)}
                          title="Delete this gateway"
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#ef4444',
                            fontSize: '0.72rem',
                            cursor: 'pointer',
                            fontWeight: 600
                          }}
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* ── 5. VIEW 5: EXECUTIVE REPORTS & DISTRIBUTION LIST MANAGER ── */}
      {activeTab === 'reports' && (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem',
          overflowY: 'auto',
          padding: '0.25rem 0.5rem 2rem 0.25rem',
          flex: 1,
          minHeight: 0,
          width: '100%',
          height: '100%'
        }}>
          {/* Top Metric Cards Row */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1rem',
            width: '100%'
          }}>
            <div style={{
              backgroundColor: theme.inputBg,
              border: `1px solid ${theme.border}`,
              borderRadius: '12px',
              padding: '1.15rem 1.25rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.35rem'
            }}>
              <span style={{ fontSize: '0.74rem', color: theme.muted, textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>
                Total Distribution List
              </span>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                <span style={{ fontSize: '1.75rem', fontWeight: 800, color: theme.fg }}>
                  {reportConfig?.recipients.length || 0}
                </span>
                <span style={{ fontSize: '0.75rem', color: theme.muted }}>recipients registered</span>
              </div>
            </div>

            <div style={{
              backgroundColor: theme.inputBg,
              border: `1px solid ${theme.border}`,
              borderRadius: '12px',
              padding: '1.15rem 1.25rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.35rem'
            }}>
              <span style={{ fontSize: '0.74rem', color: theme.muted, textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>
                Active Delivery Targets
              </span>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                <span style={{ fontSize: '1.75rem', fontWeight: 800, color: isDark ? '#4ade80' : '#16a34a' }}>
                  {reportConfig?.recipients.filter(r => r.enabled).length || 0}
                </span>
                <span style={{ fontSize: '0.75rem', color: theme.muted }}>receiving daily report</span>
              </div>
            </div>

            <div style={{
              backgroundColor: theme.inputBg,
              border: `1px solid ${theme.border}`,
              borderRadius: '12px',
              padding: '1.15rem 1.25rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.35rem'
            }}>
              <span style={{ fontSize: '0.74rem', color: theme.muted, textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>
                Automated Dispatch Schedule
              </span>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                <span style={{ fontSize: '1.15rem', fontWeight: 800, color: theme.fg }}>
                  Daily @ {reportConfig?.dispatchTime || '05:30'} AM
                </span>
                <span style={{ fontSize: '0.72rem', color: theme.muted }}>IST</span>
              </div>
            </div>

            <div style={{
              backgroundColor: theme.inputBg,
              border: `1px solid ${theme.border}`,
              borderRadius: '12px',
              padding: '1.15rem 1.25rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.35rem'
            }}>
              <span style={{ fontSize: '0.74rem', color: theme.muted, textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>
                Report Automation Status
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.15rem' }}>
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  color: reportConfig?.enabled !== false ? (isDark ? '#4ade80' : '#16a34a') : '#ef4444',
                  backgroundColor: reportConfig?.enabled !== false ? (isDark ? 'rgba(74,222,128,0.1)' : '#dcfce7') : 'rgba(239,68,68,0.1)',
                  padding: '0.25rem 0.65rem',
                  borderRadius: '9999px',
                  border: `1px solid ${reportConfig?.enabled !== false ? (isDark ? '#166534' : '#bbf7d0') : 'rgba(239,68,68,0.3)'}`
                }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: reportConfig?.enabled !== false ? '#22c55e' : '#ef4444' }} />
                  {reportConfig?.enabled !== false ? 'Active (Cron Enabled)' : 'Paused'}
                </span>
              </div>
            </div>
          </div>

          {/* Main 2-Column Split Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1.4fr) minmax(0, 1fr)',
            gap: '1.25rem',
            width: '100%',
            alignItems: 'start'
          }}>
            {/* Left Column: Recipient Distribution List */}
            <div style={{
              backgroundColor: theme.inputBg,
              border: `1px solid ${theme.border}`,
              borderRadius: '12px',
              padding: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: theme.fg }}>
                    Report Distribution List
                  </h3>
                  <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.78rem', color: theme.muted }}>
                    Manage executives and stakeholders who receive the daily automated webmaster intelligence report.
                  </p>
                </div>
                <button
                  onClick={() => setAddRecipientModalOpen(true)}
                  style={{
                    padding: '0.45rem 0.9rem',
                    backgroundColor: theme.fg,
                    color: theme.bg,
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    transition: 'opacity 0.15s'
                  }}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="12" y1="5" x2="12" y2="19"/>
                    <line x1="5" y1="12" x2="19" y2="12"/>
                  </svg>
                  Add Recipient
                </button>
              </div>

              {/* Table */}
              <div style={{ border: `1px solid ${theme.border}`, borderRadius: '8px', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem' }}>
                  <thead>
                    <tr style={{ backgroundColor: isDark ? '#141417' : '#f4f4f5', borderBottom: `1px solid ${theme.border}` }}>
                      <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontWeight: 700, color: theme.fg }}>Recipient</th>
                      <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontWeight: 700, color: theme.fg }}>Email Address</th>
                      <th style={{ padding: '0.75rem 0.75rem', textAlign: 'center', fontWeight: 700, color: theme.fg }}>Type</th>
                      <th style={{ padding: '0.75rem 0.75rem', textAlign: 'center', fontWeight: 700, color: theme.fg }}>Status</th>
                      <th style={{ padding: '0.75rem 1rem', textAlign: 'right', fontWeight: 700, color: theme.fg }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(!reportConfig || reportConfig.recipients.length === 0) ? (
                      <tr>
                        <td colSpan={5} style={{ padding: '2rem', textAlign: 'center', color: theme.muted }}>
                          No recipients added yet. Click &quot;Add Recipient&quot; to register your email.
                        </td>
                      </tr>
                    ) : (
                      reportConfig.recipients.map((rec) => (
                        <tr key={rec.id} style={{ borderBottom: `1px solid ${theme.border}` }}>
                          <td style={{ padding: '0.75rem 1rem' }}>
                            <div style={{ fontWeight: 700, color: theme.fg }}>{rec.name}</div>
                            <div style={{ fontSize: '0.7rem', color: theme.muted }}>{rec.role}</div>
                          </td>
                          <td style={{ padding: '0.75rem 1rem' }}>
                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontFamily: 'monospace', color: isDark ? '#e4e4e7' : '#18181b', fontSize: '0.76rem' }}>
                              <span>{rec.email}</span>
                              <button
                                onClick={() => navigator.clipboard?.writeText(rec.email)}
                                title="Copy email address"
                                style={{ background: 'none', border: 'none', color: theme.muted, cursor: 'pointer', padding: '0 2px' }}
                              >
                                📋
                              </button>
                            </div>
                          </td>
                          <td style={{ padding: '0.75rem 0.75rem', textAlign: 'center' }}>
                            <span style={{
                              fontSize: '0.68rem',
                              fontWeight: 800,
                              padding: '0.15rem 0.45rem',
                              borderRadius: '4px',
                              backgroundColor: rec.type === 'to' ? (isDark ? '#1e293b' : '#e0f2fe') : (isDark ? '#27272a' : '#f4f4f5'),
                              color: rec.type === 'to' ? '#38bdf8' : theme.muted,
                              border: `1px solid ${rec.type === 'to' ? (isDark ? '#0369a1' : '#bae6fd') : theme.border}`
                            }}>
                              {rec.type.toUpperCase()}
                            </span>
                          </td>
                          <td style={{ padding: '0.75rem 0.75rem', textAlign: 'center' }}>
                            <button
                              onClick={() => handleToggleRecipient(rec.id)}
                              style={{
                                padding: '0.2rem 0.55rem',
                                borderRadius: '9999px',
                                fontSize: '0.68rem',
                                fontWeight: 700,
                                border: 'none',
                                cursor: 'pointer',
                                backgroundColor: rec.enabled ? (isDark ? 'rgba(74,222,128,0.15)' : '#dcfce7') : (isDark ? '#27272a' : '#f4f4f5'),
                                color: rec.enabled ? (isDark ? '#4ade80' : '#16a34a') : theme.muted
                              }}
                            >
                              {rec.enabled ? '● Active' : '○ Paused'}
                            </button>
                          </td>
                          <td style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>
                            <button
                              onClick={() => handleDeleteRecipient(rec.id)}
                              title="Delete recipient"
                              style={{
                                background: 'none',
                                border: `1px solid ${theme.border}`,
                                borderRadius: '4px',
                                color: '#ef4444',
                                fontSize: '0.72rem',
                                padding: '0.25rem 0.5rem',
                                cursor: 'pointer'
                              }}
                            >
                              Remove
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Right Column: Schedule & Modules Customizer */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Automation Settings Card */}
              <div style={{
                backgroundColor: theme.inputBg,
                border: `1px solid ${theme.border}`,
                borderRadius: '12px',
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: theme.fg }}>
                    Schedule &amp; Modules
                  </h3>
                  {reportSaveSuccess && (
                    <span style={{ fontSize: '0.72rem', color: '#4ade80', fontWeight: 700 }}>
                      ✓ Saved!
                    </span>
                  )}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 600, color: theme.fg, marginBottom: '0.35rem' }}>
                      Automated Daily Dispatch
                    </label>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        type="button"
                        onClick={() => {
                          if (reportConfig) setReportConfig({ ...reportConfig, enabled: !reportConfig.enabled });
                        }}
                        style={{
                          padding: '0.45rem 0.9rem',
                          backgroundColor: reportConfig?.enabled !== false ? (isDark ? '#052e16' : '#dcfce7') : (isDark ? '#27272a' : '#f4f4f5'),
                          border: `1px solid ${reportConfig?.enabled !== false ? (isDark ? '#166534' : '#bbf7d0') : theme.border}`,
                          color: reportConfig?.enabled !== false ? (isDark ? '#4ade80' : '#166534') : theme.muted,
                          borderRadius: '6px',
                          fontSize: '0.76rem',
                          fontWeight: 700,
                          cursor: 'pointer'
                        }}
                      >
                        {reportConfig?.enabled !== false ? '● Automated Dispatch: ENABLED' : '○ Automated Dispatch: PAUSED'}
                      </button>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 600, color: theme.fg, marginBottom: '0.3rem' }}>
                        Dispatch Time
                      </label>
                      <input
                        type="text"
                        value={reportConfig?.dispatchTime || '05:30'}
                        onChange={(e) => {
                          if (reportConfig) setReportConfig({ ...reportConfig, dispatchTime: e.target.value });
                        }}
                        placeholder="05:30"
                        style={{
                          width: '100%',
                          padding: '0.45rem 0.75rem',
                          backgroundColor: isDark ? '#18181b' : '#ffffff',
                          border: `1px solid ${theme.border}`,
                          borderRadius: '6px',
                          color: theme.fg,
                          fontSize: '0.78rem',
                          fontFamily: 'monospace'
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 600, color: theme.fg, marginBottom: '0.3rem' }}>
                        Subject Prefix
                      </label>
                      <input
                        type="text"
                        value={reportConfig?.subjectPrefix || '[ZAWR EXECUTIVE]'}
                        onChange={(e) => {
                          if (reportConfig) setReportConfig({ ...reportConfig, subjectPrefix: e.target.value });
                        }}
                        style={{
                          width: '100%',
                          padding: '0.45rem 0.75rem',
                          backgroundColor: isDark ? '#18181b' : '#ffffff',
                          border: `1px solid ${theme.border}`,
                          borderRadius: '6px',
                          color: theme.fg,
                          fontSize: '0.78rem'
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 600, color: theme.fg, marginBottom: '0.4rem' }}>
                      Report Modules Included
                    </label>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                      {[
                        { key: 'trafficPerformance', label: '24h Pageviews & Unique Visitors Analytics' },
                        { key: 'formSubmissions', label: 'Form Inquiries & Candidates Breakdown' },
                        { key: 'emailDispatchStats', label: 'Nodemailer Dispatch Telemetry & Latency Logs' },
                        { key: 'antiSpamShield', label: 'Anti-Spam Shield & Bot Firewall Interceptions' },
                        { key: 'smtpDiagnostics', label: 'Google SMTP Relay Status & Server Health' }
                      ].map((mod) => (
                        <label key={mod.key} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: theme.fg, cursor: 'pointer' }}>
                          <input
                            type="checkbox"
                            checked={reportConfig?.sections ? (reportConfig.sections as any)[mod.key] !== false : true}
                            onChange={(e) => {
                              if (reportConfig) {
                                setReportConfig({
                                  ...reportConfig,
                                  sections: {
                                    ...reportConfig.sections,
                                    [mod.key]: e.target.checked
                                  }
                                });
                              }
                            }}
                          />
                          <span>{mod.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={handleSaveReportConfig}
                    disabled={savingReportConfig}
                    style={{
                      marginTop: '0.25rem',
                      padding: '0.55rem 1rem',
                      backgroundColor: theme.fg,
                      color: theme.bg,
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '0.78rem',
                      fontWeight: 800,
                      cursor: savingReportConfig ? 'not-allowed' : 'pointer'
                    }}
                  >
                    {savingReportConfig ? 'Saving Settings...' : 'Save Settings'}
                  </button>
                </div>
              </div>

              {/* Instant Test Dispatch Card */}
              <div style={{
                backgroundColor: theme.inputBg,
                border: `1px solid ${theme.border}`,
                borderRadius: '12px',
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.85rem'
              }}>
                <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: theme.fg }}>
                  Live Dispatch &amp; Testing
                </h3>
                <p style={{ margin: 0, fontSize: '0.76rem', color: theme.muted }}>
                  Trigger an immediate compilation and real email dispatch to test formatting and inbox deliverability.
                </p>

                {reportDispatchResult && (
                  <div style={{
                    padding: '0.65rem 0.85rem',
                    borderRadius: '8px',
                    backgroundColor: reportDispatchResult.success ? (isDark ? '#052e16' : '#dcfce7') : 'rgba(239,68,68,0.1)',
                    border: `1px solid ${reportDispatchResult.success ? (isDark ? '#166534' : '#bbf7d0') : '#ef4444'}`,
                    color: reportDispatchResult.success ? (isDark ? '#4ade80' : '#166534') : '#ef4444',
                    fontSize: '0.75rem',
                    fontWeight: 600
                  }}>
                    {reportDispatchResult.details}
                  </div>
                )}

                <div style={{ display: 'flex', gap: '0.6rem' }}>
                  <button
                    onClick={() => handleTriggerReport()}
                    disabled={dispatchingReport}
                    style={{
                      flex: 1,
                      padding: '0.65rem 1rem',
                      backgroundColor: theme.fg,
                      color: theme.bg,
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '0.78rem',
                      fontWeight: 800,
                      cursor: dispatchingReport ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.4rem'
                    }}
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="22" y1="2" x2="11" y2="13"/>
                      <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                    </svg>
                    {dispatchingReport ? 'Dispatching...' : 'Dispatch to All Active Recipients'}
                  </button>

                  <button
                    onClick={handlePreviewReport}
                    style={{
                      padding: '0.65rem 0.9rem',
                      backgroundColor: isDark ? '#18181b' : '#ffffff',
                      border: `1px solid ${theme.border}`,
                      color: theme.fg,
                      borderRadius: '6px',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    👁️ Preview HTML
                  </button>
                </div>

                <div style={{ paddingTop: '0.5rem', borderTop: `1px solid ${theme.border}` }}>
                  <label style={{ display: 'block', fontSize: '0.72rem', color: theme.muted, marginBottom: '0.3rem' }}>
                    Send Single Test Report to Custom Email:
                  </label>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <input
                      type="email"
                      value={customTestReportEmail}
                      onChange={(e) => setCustomTestReportEmail(e.target.value)}
                      placeholder="e.g. syedismail@zawrindustries.com"
                      style={{
                        flex: 1,
                        padding: '0.45rem 0.75rem',
                        backgroundColor: isDark ? '#18181b' : '#ffffff',
                        border: `1px solid ${theme.border}`,
                        borderRadius: '6px',
                        color: theme.fg,
                        fontSize: '0.76rem'
                      }}
                    />
                    <button
                      onClick={() => handleTriggerReport(customTestReportEmail)}
                      disabled={dispatchingReport || !customTestReportEmail.includes('@')}
                      style={{
                        padding: '0.45rem 0.85rem',
                        backgroundColor: isDark ? '#27272a' : '#f4f4f5',
                        color: theme.fg,
                        border: `1px solid ${theme.border}`,
                        borderRadius: '6px',
                        fontSize: '0.74rem',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      Send Test
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Dispatches Audit Log */}
          {reportConfig?.history && reportConfig.history.length > 0 && (
            <div style={{
              backgroundColor: theme.inputBg,
              border: `1px solid ${theme.border}`,
              borderRadius: '12px',
              padding: '1.25rem 1.5rem',
              marginTop: '0.5rem'
            }}>
              <h4 style={{ margin: '0 0 0.75rem 0', fontSize: '0.92rem', fontWeight: 800, color: theme.fg }}>
                Recent Report Dispatches &amp; Audit Log
              </h4>
              <div style={{ border: `1px solid ${theme.border}`, borderRadius: '8px', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.75rem' }}>
                  <thead>
                    <tr style={{ backgroundColor: isDark ? '#141417' : '#f4f4f5', borderBottom: `1px solid ${theme.border}` }}>
                      <th style={{ padding: '0.6rem 0.85rem', textAlign: 'left', fontWeight: 700, color: theme.fg }}>Dispatch Timestamp</th>
                      <th style={{ padding: '0.6rem 0.85rem', textAlign: 'left', fontWeight: 700, color: theme.fg }}>Trigger</th>
                      <th style={{ padding: '0.6rem 0.85rem', textAlign: 'left', fontWeight: 700, color: theme.fg }}>Delivered Recipients</th>
                      <th style={{ padding: '0.6rem 0.85rem', textAlign: 'right', fontWeight: 700, color: theme.fg }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reportConfig.history.slice(0, 5).map((h, i) => (
                      <tr key={i} style={{ borderBottom: `1px solid ${theme.border}` }}>
                        <td style={{ padding: '0.6rem 0.85rem', color: theme.fg, fontFamily: 'monospace' }}>
                          {new Date(h.timestamp).toLocaleString()}
                        </td>
                        <td style={{ padding: '0.6rem 0.85rem', color: theme.muted }}>
                          {h.triggeredBy}
                        </td>
                        <td style={{ padding: '0.6rem 0.85rem', color: theme.fg }}>
                          {h.recipients ? h.recipients.join(', ') : `${h.recipientsCount} recipient(s)`}
                        </td>
                        <td style={{ padding: '0.6rem 0.85rem', textAlign: 'right' }}>
                          <span style={{ fontSize: '0.7rem', fontWeight: 700, color: isDark ? '#4ade80' : '#16a34a' }}>
                            ✓ Delivered (TLS 1.3)
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── ADD RECIPIENT MODAL ── */}
      {addRecipientModalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.75)',
          backdropFilter: 'blur(4px)',
          zIndex: 10000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1.5rem'
        }}>
          <div style={{
            width: '100%',
            maxWidth: '460px',
            backgroundColor: isDark ? '#121216' : '#ffffff',
            border: `1px solid ${theme.border}`,
            borderRadius: '14px',
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            boxShadow: '0 20px 50px rgba(0,0,0,0.8)'
          }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: theme.fg }}>
                Add Report Recipient
              </h3>
              <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.76rem', color: theme.muted }}>
                Register a new stakeholder email to receive the daily executive summary report.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 600, color: theme.fg, marginBottom: '0.3rem' }}>
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Syed Ismail"
                  value={newRecipientName}
                  onChange={(e) => setNewRecipientName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.55rem 0.85rem',
                    backgroundColor: isDark ? '#18181b' : '#f4f4f5',
                    border: `1px solid ${theme.border}`,
                    borderRadius: '6px',
                    color: theme.fg,
                    fontSize: '0.8rem'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 600, color: theme.fg, marginBottom: '0.3rem' }}>
                  Email Address *
                </label>
                <input
                  type="email"
                  placeholder="e.g. syedismail@zawrindustries.com"
                  value={newRecipientEmail}
                  onChange={(e) => setNewRecipientEmail(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.55rem 0.85rem',
                    backgroundColor: isDark ? '#18181b' : '#f4f4f5',
                    border: `1px solid ${theme.border}`,
                    borderRadius: '6px',
                    color: theme.fg,
                    fontSize: '0.8rem'
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 600, color: theme.fg, marginBottom: '0.3rem' }}>
                    Role / Department
                  </label>
                  <select
                    value={newRecipientRole}
                    onChange={(e) => setNewRecipientRole(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.55rem 0.85rem',
                      backgroundColor: isDark ? '#18181b' : '#f4f4f5',
                      border: `1px solid ${theme.border}`,
                      borderRadius: '6px',
                      color: theme.fg,
                      fontSize: '0.8rem'
                    }}
                  >
                    <option value="Executive Lead">Executive Lead</option>
                    <option value="System Administrator">System Administrator</option>
                    <option value="CTO / Engineering">CTO / Engineering</option>
                    <option value="Operations Desk">Operations Desk</option>
                    <option value="Media & PR Lead">Media &amp; PR Lead</option>
                    <option value="Investor Relations">Investor Relations</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 600, color: theme.fg, marginBottom: '0.3rem' }}>
                    Header Type
                  </label>
                  <select
                    value={newRecipientType}
                    onChange={(e) => setNewRecipientType(e.target.value as any)}
                    style={{
                      width: '100%',
                      padding: '0.55rem 0.85rem',
                      backgroundColor: isDark ? '#18181b' : '#f4f4f5',
                      border: `1px solid ${theme.border}`,
                      borderRadius: '6px',
                      color: theme.fg,
                      fontSize: '0.8rem'
                    }}
                  >
                    <option value="to">TO (Direct Recipient)</option>
                    <option value="cc">CC (Carbon Copy)</option>
                    <option value="bcc">BCC (Blind Copy)</option>
                  </select>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.6rem', marginTop: '0.5rem' }}>
              <button
                type="button"
                onClick={() => setAddRecipientModalOpen(false)}
                style={{
                  padding: '0.55rem 1rem',
                  backgroundColor: 'transparent',
                  color: theme.muted,
                  border: `1px solid ${theme.border}`,
                  borderRadius: '6px',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddRecipient}
                disabled={!newRecipientEmail || !newRecipientEmail.includes('@')}
                style={{
                  padding: '0.55rem 1.25rem',
                  backgroundColor: theme.fg,
                  color: theme.bg,
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '0.78rem',
                  fontWeight: 800,
                  cursor: !newRecipientEmail || !newRecipientEmail.includes('@') ? 'not-allowed' : 'pointer'
                }}
              >
                Add Recipient
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── REPORT LIVE PREVIEW MODAL ── */}
      {reportPreviewModalOpen && (
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
                <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: theme.fg }}>Daily Webmaster Executive Report</h3>
                <span style={{ fontSize: '0.72rem', color: theme.muted }}>Official 24-Hour Operations &amp; Performance Summary</span>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <button
                  type="button"
                  disabled={dispatchingReport}
                  onClick={() => handleTriggerReport()}
                  style={{
                    padding: '0.4rem 0.9rem',
                    backgroundColor: theme.fg,
                    color: theme.bg,
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '0.78rem',
                    fontWeight: 800,
                    cursor: dispatchingReport ? 'not-allowed' : 'pointer'
                  }}
                >
                  {dispatchingReport ? 'Sending...' : 'Email to All Recipients'}
                </button>
                <button
                  type="button"
                  onClick={() => setReportPreviewModalOpen(false)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: theme.muted,
                    fontSize: '1.25rem',
                    cursor: 'pointer',
                    padding: '0.25rem 0.5rem'
                  }}
                >
                  ✕
                </button>
              </div>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', backgroundColor: '#f4f4f5', padding: '1.5rem' }}>
              {previewReportHtml ? (
                <iframe
                  srcDoc={previewReportHtml}
                  title="Daily Webmaster Report"
                  style={{ width: '100%', height: '620px', border: 'none', borderRadius: '8px', backgroundColor: '#ffffff' }}
                />
              ) : (
                <div style={{ textAlign: 'center', padding: '3rem', color: '#666' }}>Loading preview report...</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── 6. DEDICATED SUBMITTER EMAIL INSPECTION MODAL ── */}
      {submitterInspectModalOpen && inspectingTemplate && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(8px)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1.5rem'
        }}>
          <div style={{
            width: '100%',
            maxWidth: '960px',
            height: '85vh',
            backgroundColor: isDark ? '#121216' : '#ffffff',
            border: `1px solid ${theme.border}`,
            borderRadius: '16px',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            boxShadow: isDark ? '0 20px 50px rgba(0,0,0,0.9)' : '0 20px 40px rgba(0,0,0,0.2)'
          }}>
            {/* Modal Header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '1.25rem 1.5rem',
              borderBottom: `1px solid ${theme.border}`,
              backgroundColor: isDark ? '#18181c' : '#f9fafb'
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: theme.fg }}>
                    Submitter Email Receipt: {inspectingTemplate.name}
                  </h3>
                  <span style={{ fontSize: '0.72rem', padding: '0.15rem 0.5rem', backgroundColor: isDark ? '#27272a' : '#e4e4e7', color: theme.fg, borderRadius: '9999px', fontWeight: 600 }}>
                    /{inspectingTemplate.targetForm}
                  </span>
                </div>
                <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.78rem', color: theme.muted }}>
                  Exact rendered confirmation email that the user receives upon submitting this form
                </p>
              </div>

              <button
                onClick={() => setSubmitterInspectModalOpen(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: theme.muted,
                  fontSize: '1.2rem',
                  cursor: 'pointer',
                  padding: '0.25rem 0.5rem'
                }}
              >
                ✕
              </button>
            </div>

            {/* Modal Content Split */}
            <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
              
              {/* Left Column: Email Metadata & Test Sender */}
              <div style={{ width: '360px', borderRight: `1px solid ${theme.border}`, padding: '1.25rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem', backgroundColor: isDark ? '#0c0c0e' : '#f9fafb' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: theme.muted, textTransform: 'uppercase', marginBottom: '0.3rem' }}>Sender (From)</label>
                  <div style={{ fontSize: '0.82rem', fontFamily: 'monospace', color: theme.fg, backgroundColor: isDark ? '#18181b' : '#ffffff', padding: '0.5rem', borderRadius: '6px', border: `1px solid ${theme.border}` }}>
                    "Zawr Industries" &lt;noreply@zawrindustries.com&gt;
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: theme.muted, textTransform: 'uppercase', marginBottom: '0.3rem' }}>Recipient (To)</label>
                  <div style={{ fontSize: '0.82rem', fontFamily: 'monospace', color: theme.fg, backgroundColor: isDark ? '#18181b' : '#ffffff', padding: '0.5rem', borderRadius: '6px', border: `1px solid ${theme.border}` }}>
                    {sampleData.name} &lt;{sampleData.email}&gt;
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: theme.muted, textTransform: 'uppercase', marginBottom: '0.3rem' }}>Subject Line</label>
                  <div style={{ fontSize: '0.82rem', fontWeight: 600, color: theme.fg, backgroundColor: isDark ? '#18181b' : '#ffffff', padding: '0.5rem', borderRadius: '6px', border: `1px solid ${theme.border}` }}>
                    {inspectingTemplate.subject.replace(/{{jobTitle}}/g, sampleData.jobTitle).replace(/{{company}}/g, sampleData.company).replace(/{{eventName}}/g, sampleData.eventName)}
                  </div>
                </div>

                {/* Live Test Sender */}
                <div style={{ marginTop: 'auto', padding: '1rem', backgroundColor: isDark ? '#18181b' : '#ffffff', borderRadius: '8px', border: `1px solid ${theme.border}` }}>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: theme.fg, marginBottom: '0.4rem' }}>
                    Send Live Test to Your Inbox
                  </label>
                  <input
                    type="email"
                    value={testTemplateEmail}
                    onChange={e => setTestTemplateEmail(e.target.value)}
                    style={{ width: '100%', padding: '0.5rem', backgroundColor: isDark ? '#0c0c0e' : '#f4f4f5', border: `1px solid ${theme.border}`, borderRadius: '6px', color: theme.fg, fontSize: '0.8rem', marginBottom: '0.5rem' }}
                  />
                  <button
                    onClick={handleSendTemplateTest}
                    disabled={sendingTemplateTest}
                    style={{
                      width: '100%',
                      padding: '0.55rem',
                      backgroundColor: theme.fg,
                      color: theme.bg,
                      border: 'none',
                      borderRadius: '6px',
                      fontWeight: 600,
                      fontSize: '0.8rem',
                      cursor: sendingTemplateTest ? 'not-allowed' : 'pointer'
                    }}
                  >
                    {sendingTemplateTest ? 'Dispatching...' : 'Send Live Test Email'}
                  </button>
                  {templateTestResult && (
                    <div style={{ marginTop: '0.4rem', fontSize: '0.72rem', color: templateTestResult.success ? '#10b981' : '#ef4444' }}>
                      {templateTestResult.details}
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: Exact Rendered HTML Preview */}
              <div style={{ flex: 1, backgroundColor: isDark ? '#08080a' : '#f1f5f9', display: 'flex', flexDirection: 'column', overflow: 'hidden', minHeight: 0, height: '100%' }}>
                <div style={{ padding: '0.75rem 1.25rem', borderBottom: `1px solid ${theme.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: isDark ? '#121216' : '#ffffff', flexShrink: 0 }}>
                  <span style={{ fontSize: '0.78rem', color: theme.muted, fontWeight: 600 }}>100% Brand Typography (Poppins Minimalist)</span>
                  <button
                    onClick={() => {
                      setSelectedTemplateId(inspectingTemplate.id);
                      setSubmitterInspectModalOpen(false);
                      setActiveTab('templates');
                    }}
                    style={{
                      padding: '0.3rem 0.75rem',
                      backgroundColor: isDark ? '#27272a' : '#f4f4f5',
                      border: `1px solid ${theme.border}`,
                      borderRadius: '6px',
                      color: theme.fg,
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    Edit Template Copy ➔
                  </button>
                </div>

                <div style={{
                  flex: 1,
                  overflowY: 'auto',
                  overflowX: 'hidden',
                  padding: '1.5rem 1.25rem 3rem 1.25rem',
                  minHeight: 0,
                  height: '100%',
                  display: 'block'
                }}>
                  <div
                    style={{
                      width: '100%',
                      maxWidth: '580px',
                      margin: '0 auto',
                      boxShadow: isDark ? '0 10px 30px rgba(0,0,0,0.6)' : '0 10px 25px rgba(0,0,0,0.08)',
                      borderRadius: '8px',
                      overflow: 'hidden'
                    }}
                    dangerouslySetInnerHTML={{ __html: renderEmailHtml(inspectingTemplate, 'submitter') }}
                  />
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* ── 7. TEST SIGNAL MODAL ── */}
      {testModalOpen && testResult && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(5px)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1.5rem'
        }}>
          <div style={{
            width: '100%',
            maxWidth: '520px',
            backgroundColor: isDark ? '#121216' : '#ffffff',
            border: `1px solid ${theme.border}`,
            borderRadius: '12px',
            padding: '1.75rem',
            boxShadow: isDark ? '0 10px 40px rgba(0,0,0,0.8)' : '0 10px 30px rgba(0,0,0,0.15)'
          }}>
            <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.15rem', fontWeight: 800, color: theme.fg }}>
              {testResult.success ? 'Route Signal Dispatched Successfully' : 'Test Dispatch Failed'}
            </h3>
            <p style={{ fontSize: '0.82rem', color: theme.muted, lineHeight: 1.5 }}>
              {testResult.details}
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.25rem' }}>
              <button
                onClick={() => setTestModalOpen(false)}
                style={{
                  padding: '0.55rem 1.25rem',
                  backgroundColor: theme.fg,
                  color: theme.bg,
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: 600,
                  fontSize: '0.82rem',
                  cursor: 'pointer'
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── 7. ADD / EDIT SMTP GATEWAY MODAL ── */}
      {addGatewayModalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(6px)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1.5rem'
        }}>
          <div style={{
            width: '100%',
            maxWidth: '560px',
            maxHeight: '90vh',
            overflowY: 'auto',
            backgroundColor: isDark ? '#121216' : '#ffffff',
            border: `1px solid ${theme.border}`,
            borderRadius: '14px',
            padding: '1.75rem',
            boxShadow: isDark ? '0 10px 40px rgba(0,0,0,0.8)' : '0 10px 30px rgba(0,0,0,0.15)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.4rem' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: theme.fg }}>
                  {editingGatewayId ? 'Edit SMTP Relay Gateway' : 'Add SMTP Gateway to Cluster'}
                </h3>
                <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.78rem', color: theme.muted }}>
                  Each added gateway adds <strong style={{ color: isDark ? '#4ade80' : '#16a34a' }}>+500 outbound mails/day</strong> capacity with automatic failover.
                </p>
              </div>
              <button
                onClick={() => setAddGatewayModalOpen(false)}
                style={{ background: 'none', border: 'none', color: theme.muted, cursor: 'pointer', fontSize: '1.25rem' }}
              >
                ✕
              </button>
            </div>

            {/* Quick Presets */}
            <div style={{
              margin: '1rem 0 1.25rem 0',
              padding: '0.75rem',
              backgroundColor: isDark ? '#18181b' : '#f4f4f5',
              borderRadius: '8px',
              border: `1px solid ${theme.border}`
            }}>
              <span style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: theme.muted, marginBottom: '0.4rem', textTransform: 'uppercase' }}>
                Quick Provider Presets:
              </span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {[
                  { label: 'Google / Gmail', host: 'smtp.gmail.com', port: 465, secure: true, limit: 500 },
                  { label: 'SendGrid SMTP', host: 'smtp.sendgrid.net', port: 587, secure: false, limit: 500 },
                  { label: 'Amazon SES', host: 'email-smtp.us-east-1.amazonaws.com', port: 465, secure: true, limit: 500 },
                  { label: 'Mailgun Relay', host: 'smtp.mailgun.org', port: 587, secure: false, limit: 500 }
                ].map(preset => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => {
                      setGwForm(prev => ({
                        ...prev,
                        host: preset.host,
                        port: preset.port,
                        secure: preset.secure,
                        dailyLimit: preset.limit
                      }));
                    }}
                    style={{
                      padding: '0.25rem 0.55rem',
                      backgroundColor: isDark ? '#27272a' : '#ffffff',
                      border: `1px solid ${theme.border}`,
                      borderRadius: '5px',
                      fontSize: '0.72rem',
                      fontWeight: 600,
                      color: theme.fg,
                      cursor: 'pointer'
                    }}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Form Fields */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.76rem', color: theme.muted, marginBottom: '0.3rem', fontWeight: 600 }}>
                  Gateway Label / Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Primary Google Relay, Secondary Failover..."
                  value={gwForm.name}
                  onChange={e => setGwForm({ ...gwForm, name: e.target.value })}
                  style={{ width: '100%', padding: '0.6rem 0.75rem', backgroundColor: isDark ? '#18181b' : '#f4f4f5', border: `1px solid ${theme.border}`, borderRadius: '8px', color: theme.fg, fontSize: '0.82rem' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.76rem', color: theme.muted, marginBottom: '0.3rem', fontWeight: 600 }}>
                    SMTP Host
                  </label>
                  <input
                    type="text"
                    placeholder="smtp.gmail.com"
                    value={gwForm.host}
                    onChange={e => setGwForm({ ...gwForm, host: e.target.value })}
                    style={{ width: '100%', padding: '0.6rem 0.75rem', backgroundColor: isDark ? '#18181b' : '#f4f4f5', border: `1px solid ${theme.border}`, borderRadius: '8px', color: theme.fg, fontSize: '0.82rem', fontFamily: 'monospace' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.76rem', color: theme.muted, marginBottom: '0.3rem', fontWeight: 600 }}>
                    Port (465 / 587)
                  </label>
                  <input
                    type="number"
                    placeholder="465"
                    value={gwForm.port}
                    onChange={e => setGwForm({ ...gwForm, port: Number(e.target.value), secure: Number(e.target.value) === 465 })}
                    style={{ width: '100%', padding: '0.6rem 0.75rem', backgroundColor: isDark ? '#18181b' : '#f4f4f5', border: `1px solid ${theme.border}`, borderRadius: '8px', color: theme.fg, fontSize: '0.82rem', fontFamily: 'monospace' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.76rem', color: theme.muted, marginBottom: '0.3rem', fontWeight: 600 }}>
                  Authentication Username / Email
                </label>
                <input
                  type="text"
                  placeholder="zawrorganization@gmail.com"
                  value={gwForm.user}
                  onChange={e => setGwForm({ ...gwForm, user: e.target.value })}
                  style={{ width: '100%', padding: '0.6rem 0.75rem', backgroundColor: isDark ? '#18181b' : '#f4f4f5', border: `1px solid ${theme.border}`, borderRadius: '8px', color: theme.fg, fontSize: '0.82rem', fontFamily: 'monospace' }}
                />
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
                  <label style={{ fontSize: '0.76rem', color: theme.muted, fontWeight: 600 }}>
                    App Password / SMTP Secret Token
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPasswordMap(prev => ({ ...prev, modal: !prev.modal }))}
                    style={{ background: 'none', border: 'none', color: '#38bdf8', fontSize: '0.72rem', cursor: 'pointer', padding: 0 }}
                  >
                    {showPasswordMap.modal ? 'Hide Secret' : 'Show Secret'}
                  </button>
                </div>
                <input
                  type={showPasswordMap.modal ? 'text' : 'password'}
                  placeholder="16-character Google App Password or API Key"
                  value={gwForm.pass}
                  onChange={e => setGwForm({ ...gwForm, pass: e.target.value })}
                  style={{ width: '100%', padding: '0.6rem 0.75rem', backgroundColor: isDark ? '#18181b' : '#f4f4f5', border: `1px solid ${theme.border}`, borderRadius: '8px', color: theme.fg, fontSize: '0.82rem', fontFamily: 'monospace' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.76rem', color: theme.muted, marginBottom: '0.3rem', fontWeight: 600 }}>
                    Sender Display Name
                  </label>
                  <input
                    type="text"
                    placeholder="Zawr Industries System"
                    value={gwForm.senderName}
                    onChange={e => setGwForm({ ...gwForm, senderName: e.target.value })}
                    style={{ width: '100%', padding: '0.6rem 0.75rem', backgroundColor: isDark ? '#18181b' : '#f4f4f5', border: `1px solid ${theme.border}`, borderRadius: '8px', color: theme.fg, fontSize: '0.82rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.76rem', color: theme.muted, marginBottom: '0.3rem', fontWeight: 600 }}>
                    Sender Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="noreply@zawrindustries.com"
                    value={gwForm.senderEmail}
                    onChange={e => setGwForm({ ...gwForm, senderEmail: e.target.value })}
                    style={{ width: '100%', padding: '0.6rem 0.75rem', backgroundColor: isDark ? '#18181b' : '#f4f4f5', border: `1px solid ${theme.border}`, borderRadius: '8px', color: theme.fg, fontSize: '0.82rem', fontFamily: 'monospace' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.76rem', color: theme.muted, marginBottom: '0.3rem', fontWeight: 600 }}>
                    Daily Outbound Quota Limit
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <input
                      type="number"
                      placeholder="500"
                      value={gwForm.dailyLimit}
                      onChange={e => setGwForm({ ...gwForm, dailyLimit: Number(e.target.value) })}
                      style={{ width: '100%', padding: '0.6rem 0.75rem', backgroundColor: isDark ? '#18181b' : '#f4f4f5', border: `1px solid ${theme.border}`, borderRadius: '8px', color: theme.fg, fontSize: '0.82rem', fontFamily: 'monospace' }}
                    />
                    <span style={{ fontSize: '0.72rem', color: theme.muted, whiteSpace: 'nowrap' }}>/ day</span>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.76rem', color: theme.muted, marginBottom: '0.3rem', fontWeight: 600 }}>
                    Failover Priority Order
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={gwForm.priority}
                    onChange={e => setGwForm({ ...gwForm, priority: Number(e.target.value) })}
                    style={{ width: '100%', padding: '0.6rem 0.75rem', backgroundColor: isDark ? '#18181b' : '#f4f4f5', border: `1px solid ${theme.border}`, borderRadius: '8px', color: theme.fg, fontSize: '0.82rem', fontFamily: 'monospace' }}
                  />
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem', paddingTop: '1rem', borderTop: `1px solid ${theme.border}` }}>
              <button
                type="button"
                onClick={async () => {
                  if (!gwForm.host || !gwForm.user || !gwForm.pass) {
                    alert('Please enter host, user, and password to test.');
                    return;
                  }
                  try {
                    const res = await fetch('/api/webmaster/smtp-gateways', {
                      method: 'PUT',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ action: 'test_handshake', gatewayConfig: gwForm })
                    });
                    const data = await res.json();
                    alert(data.success ? `✓ Handshake Successful! Response Latency: ${data.latencyMs}ms` : `✗ Connection Failed: ${data.details}`);
                  } catch (e: any) {
                    alert(`Test failed: ${e.message}`);
                  }
                }}
                style={{
                  padding: '0.55rem 0.9rem',
                  backgroundColor: isDark ? '#27272a' : '#f4f4f5',
                  border: `1px solid ${theme.border}`,
                  color: theme.fg,
                  borderRadius: '8px',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                ⚡ Test Handshake First
              </button>

              <div style={{ display: 'flex', gap: '0.6rem' }}>
                <button
                  type="button"
                  onClick={() => setAddGatewayModalOpen(false)}
                  style={{
                    padding: '0.55rem 1rem',
                    backgroundColor: 'transparent',
                    border: `1px solid ${theme.border}`,
                    color: theme.muted,
                    borderRadius: '8px',
                    fontSize: '0.78rem',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveGateway}
                  style={{
                    padding: '0.55rem 1.25rem',
                    backgroundColor: theme.fg,
                    color: theme.bg,
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: 700,
                    fontSize: '0.78rem',
                    cursor: 'pointer'
                  }}
                >
                  {editingGatewayId ? 'Update Gateway' : 'Add Gateway'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── 8. ADD NODE MODAL ── */}
      {addNodeModalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(5px)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1.5rem'
        }}>
          <div style={{
            width: '100%',
            maxWidth: '480px',
            backgroundColor: isDark ? '#121216' : '#ffffff',
            border: `1px solid ${theme.border}`,
            borderRadius: '12px',
            padding: '1.75rem',
            boxShadow: isDark ? '0 10px 40px rgba(0,0,0,0.8)' : '0 10px 30px rgba(0,0,0,0.15)'
          }}>
            <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.2rem', fontWeight: 800, color: theme.fg }}>Add New Flow Node</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: theme.muted, marginBottom: '0.35rem', fontWeight: 600 }}>Node Type</label>
                <select
                  value={newNodeType}
                  onChange={e => setNewNodeType(e.target.value as any)}
                  style={{ width: '100%', padding: '0.65rem', backgroundColor: isDark ? '#18181b' : '#f4f4f5', border: `1px solid ${theme.border}`, borderRadius: '8px', color: theme.fg }}
                >
                  <option value="destination">Destination Mailbox Node (Output)</option>
                  <option value="origin">Form Origin Node (Input)</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: theme.muted, marginBottom: '0.35rem', fontWeight: 600 }}>Node Title</label>
                <input
                  type="text"
                  placeholder={newNodeType === 'origin' ? 'e.g. VIP Portal' : 'e.g. legal@zawrindustries.com'}
                  value={newNodeTitle}
                  onChange={e => setNewNodeTitle(e.target.value)}
                  style={{ width: '100%', padding: '0.65rem', backgroundColor: isDark ? '#18181b' : '#f4f4f5', border: `1px solid ${theme.border}`, borderRadius: '8px', color: theme.fg }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: theme.muted, marginBottom: '0.35rem', fontWeight: 600 }}>
                  {newNodeType === 'origin' ? 'Route Path Endpoint' : 'Target Email / Alias'}
                </label>
                <input
                  type="text"
                  placeholder={newNodeType === 'origin' ? '/api/custom-form' : 'alias@zawrindustries.com'}
                  value={newNodeEmail}
                  onChange={e => setNewNodeEmail(e.target.value)}
                  style={{ width: '100%', padding: '0.65rem', backgroundColor: isDark ? '#18181b' : '#f4f4f5', border: `1px solid ${theme.border}`, borderRadius: '8px', color: theme.fg }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button
                onClick={() => setAddNodeModalOpen(false)}
                style={{ padding: '0.55rem 1rem', backgroundColor: 'transparent', border: `1px solid ${theme.border}`, color: theme.muted, borderRadius: '8px', cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button
                onClick={handleAddNode}
                style={{ padding: '0.55rem 1.25rem', backgroundColor: theme.fg, color: theme.bg, border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}
              >
                Create Node
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
