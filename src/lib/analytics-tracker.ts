import fs from 'fs';
import path from 'path';

const telemetryFilePath = path.join(process.cwd(), 'public', 'data', 'analytics-telemetry.json');

export interface EmailLogEntry {
  id: string;
  timestamp: string;
  recipient: string;
  sender: string;
  subject: string;
  reason: string;
  status: 'Delivered' | 'Sent' | 'Failed';
  statusCode: number;
  server: string;
  ip: string;
  region: string;
}

export interface WebRequestEntry {
  id: string;
  timestamp: string;
  path: string;
  method: 'GET' | 'POST' | 'HEAD';
  status: number;
  latencyMs: number;
  ip: string;
  country: string;
  city: string;
  device: 'Desktop' | 'Mobile' | 'Tablet';
  userAgent: string;
}

export interface SecurityEventEntry {
  id: string;
  timestamp: string;
  eventType: 'Unauthorized Gate Probe' | 'Rate Limit Exceeded' | 'XSS Sanitization' | 'Bot Crawler Throttled' | 'Invalid CSRF Blocked';
  severity: 'Low' | 'Medium' | 'High';
  targetPath: string;
  ip: string;
  country: string;
  actionTaken: 'Blocked 403' | 'Throttled 429' | 'Sanitized 200' | 'Redirected 301';
  details: string;
}

export interface GeoDemographic {
  country: string;
  code: string;
  flag: string;
  visitors: number;
  percentage: number;
  topCities: Array<{ city: string; count: number }>;
}

export interface AnalyticsData {
  summary: {
    totalVisits: number;
    visitsChange: string;
    totalPageViews: number;
    bounceRate: string;
    avgSessionDuration: string;
    emailsSentToday: number;
    emailsSentWeek: number;
    threatsNeutralized: number;
    activeServerUptime: string;
    avgLatencyMs: number;
    edgeCdnHitRate: string;
  };
  trafficChart: Array<{
    time: string;
    visits: number;
    pageViews: number;
  }>;
  emails: EmailLogEntry[];
  requests: WebRequestEntry[];
  security: SecurityEventEntry[];
  geo: GeoDemographic[];
}

function getInitialData(): AnalyticsData {
  return {
    summary: {
      totalVisits: 14209,
      visitsChange: '+12.4%',
      totalPageViews: 38450,
      bounceRate: '36.8%',
      avgSessionDuration: '3m 12s',
      emailsSentToday: 0,
      emailsSentWeek: 0,
      threatsNeutralized: 0,
      activeServerUptime: '99.99%',
      avgLatencyMs: 28,
      edgeCdnHitRate: '98.1%'
    },
    trafficChart: [
      { time: '00:00', visits: 310, pageViews: 740 },
      { time: '04:00', visits: 190, pageViews: 480 },
      { time: '08:00', visits: 980, pageViews: 2400 },
      { time: '12:00', visits: 2450, pageViews: 5800 },
      { time: '16:00', visits: 3100, pageViews: 7100 },
      { time: '20:00', visits: 2400, pageViews: 5200 },
      { time: 'Now', visits: 2890, pageViews: 6200 }
    ],
    emails: [],
    requests: [],
    security: [],
    geo: [
      {
        country: 'India',
        code: 'IN',
        flag: '🇮🇳',
        visitors: 8740,
        percentage: 61.5,
        topCities: [
          { city: 'Bengaluru', count: 3840 },
          { city: 'Mumbai', count: 2100 },
          { city: 'New Delhi', count: 1600 }
        ]
      },
      {
        country: 'United Arab Emirates',
        code: 'AE',
        flag: '🇦🇪',
        visitors: 2210,
        percentage: 15.6,
        topCities: [
          { city: 'Dubai', count: 1620 },
          { city: 'Abu Dhabi', count: 590 }
        ]
      },
      {
        country: 'United States',
        code: 'US',
        flag: '🇺🇸',
        visitors: 1580,
        percentage: 11.1,
        topCities: [
          { city: 'San Francisco', count: 710 },
          { city: 'New York', count: 530 }
        ]
      },
      {
        country: 'United Kingdom',
        code: 'GB',
        flag: '🇬🇧',
        visitors: 790,
        percentage: 5.6,
        topCities: [
          { city: 'London', count: 620 }
        ]
      },
      {
        country: 'Singapore',
        code: 'SG',
        flag: '🇸🇬',
        visitors: 520,
        percentage: 3.7,
        topCities: [
          { city: 'Singapore', count: 520 }
        ]
      }
    ]
  };
}

export function getTelemetryData(): AnalyticsData {
  try {
    if (fs.existsSync(telemetryFilePath)) {
      const fileData = fs.readFileSync(telemetryFilePath, 'utf8');
      const data: AnalyticsData = JSON.parse(fileData);
      
      // Compute accurate email stats from actual log list
      const now = new Date();
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
      const weekStart = todayStart - 7 * 24 * 60 * 60 * 1000;

      const emailsToday = (data.emails || []).filter(e => new Date(e.timestamp).getTime() >= todayStart).length;
      const emailsWeek = (data.emails || []).filter(e => new Date(e.timestamp).getTime() >= weekStart).length;

      data.summary.emailsSentToday = emailsToday;
      data.summary.emailsSentWeek = emailsWeek;
      data.summary.threatsNeutralized = (data.security || []).length;

      return data;
    }
  } catch (e) {
    console.error('Error reading telemetry file:', e);
  }

  const initial = getInitialData();
  try {
    const dir = path.dirname(telemetryFilePath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(telemetryFilePath, JSON.stringify(initial, null, 2), 'utf8');
  } catch (e) {
    console.error('Error writing initial telemetry file:', e);
  }
  return initial;
}

export function logEmailDispatch(entry: Omit<EmailLogEntry, 'id' | 'timestamp'>) {
  try {
    const current = getTelemetryData();
    const newEntry: EmailLogEntry = {
      id: `em-${Date.now().toString().slice(-6)}`,
      timestamp: new Date().toISOString(),
      ...entry
    };
    if (!current.emails) current.emails = [];
    current.emails.unshift(newEntry);
    
    // Keep max 100 recent email logs
    if (current.emails.length > 100) {
      current.emails = current.emails.slice(0, 100);
    }

    fs.writeFileSync(telemetryFilePath, JSON.stringify(current, null, 2), 'utf8');
  } catch (e) {
    console.error('Error logging email dispatch:', e);
  }
}

export function logWebRequest(entry: Omit<WebRequestEntry, 'id' | 'timestamp'>) {
  try {
    const current = getTelemetryData();
    const newEntry: WebRequestEntry = {
      id: `req-${Date.now().toString().slice(-6)}`,
      timestamp: new Date().toISOString(),
      ...entry
    };
    if (!current.requests) current.requests = [];
    current.requests.unshift(newEntry);
    current.summary.totalVisits += 1;
    current.summary.totalPageViews += 1;
    
    // Keep max 100 recent requests
    if (current.requests.length > 100) {
      current.requests = current.requests.slice(0, 100);
    }

    fs.writeFileSync(telemetryFilePath, JSON.stringify(current, null, 2), 'utf8');
  } catch (e) {
    console.error('Error logging web request:', e);
  }
}

export function logSecurityEvent(entry: Omit<SecurityEventEntry, 'id' | 'timestamp'>) {
  try {
    const current = getTelemetryData();
    const newEntry: SecurityEventEntry = {
      id: `sec-${Date.now().toString().slice(-6)}`,
      timestamp: new Date().toISOString(),
      ...entry
    };
    if (!current.security) current.security = [];
    current.security.unshift(newEntry);
    current.summary.threatsNeutralized = current.security.length;
    
    if (current.security.length > 50) {
      current.security = current.security.slice(0, 50);
    }

    fs.writeFileSync(telemetryFilePath, JSON.stringify(current, null, 2), 'utf8');
  } catch (e) {
    console.error('Error logging security event:', e);
  }
}

export function recordVisitorHit(country: string, city: string, code: string, flag: string) {
  try {
    const current = getTelemetryData();
    if (!current.geo) current.geo = [];

    let targetCountry = current.geo.find(g => g.country.toLowerCase() === country.toLowerCase());
    if (!targetCountry) {
      targetCountry = {
        country,
        code,
        flag,
        visitors: 1,
        percentage: 1,
        topCities: [{ city, count: 1 }]
      };
      current.geo.push(targetCountry);
    } else {
      targetCountry.visitors += 1;
      let targetCity = targetCountry.topCities.find(c => c.city.toLowerCase() === city.toLowerCase());
      if (targetCity) {
        targetCity.count += 1;
      } else {
        targetCountry.topCities.push({ city, count: 1 });
      }
    }

    // Recalculate percentages
    const totalGeo = current.geo.reduce((sum, g) => sum + g.visitors, 0) || 1;
    current.geo.forEach(g => {
      g.percentage = parseFloat(((g.visitors / totalGeo) * 100).toFixed(1));
    });

    // Sort by visitors
    current.geo.sort((a, b) => b.visitors - a.visitors);

    fs.writeFileSync(telemetryFilePath, JSON.stringify(current, null, 2), 'utf8');
  } catch (e) {
    console.error('Error recording visitor hit:', e);
  }
}
