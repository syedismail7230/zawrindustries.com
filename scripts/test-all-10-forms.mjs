// Test script for all 10 public forms
const BASE_URL = 'http://localhost:3000';

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function testAllForms() {
  console.log('====================================================');
  console.log('🚀 TESTING ALL 10 PUBLIC TRANSACTIONAL FORMS ON ZAWR');
  console.log('====================================================\n');

  const results = [];

  // 1. Careers Job Application (/api/apply-job) - multipart/form-data
  try {
    console.log('[1/10] Submitting Careers Job Application Form...');
    const fd = new FormData();
    fd.append('firstName', 'Syed');
    fd.append('lastName', 'Ismail');
    fd.append('email', 'syedismail@zawrindustries.com');
    fd.append('phone', '+91 98765 43210');
    fd.append('jobId', 'principal-ai-architect');
    fd.append('jobTitle', 'Principal AI Systems Architect');
    fd.append('portfolio', 'https://github.com/syedismail');
    fd.append('coverLetter', 'I am writing to express my strong interest in the Principal AI Systems Architect role at Zawr Industries.');
    
    // Create dummy PDF buffer for resume
    const dummyPdf = new Blob(['%PDF-1.4 Resume Content for Syed Ismail'], { type: 'application/pdf' });
    fd.append('resume', dummyPdf, 'Syed_Ismail_Resume.pdf');

    const t0 = performance.now();
    const res = await fetch(`${BASE_URL}/api/apply-job`, {
      method: 'POST',
      body: fd
    });
    const t1 = performance.now();
    const data = await res.json();
    console.log(`  ➔ Status: ${res.status} | Latency: ${(t1 - t0).toFixed(0)}ms | Result:`, data);
    results.push({
      num: 1,
      form: 'Job Candidate Application Form',
      endpoint: '/api/apply-job',
      method: 'POST (FormData + PDF Buffer)',
      status: res.status,
      ok: res.ok,
      latency: `${(t1 - t0).toFixed(0)}ms`,
      response: data
    });
  } catch (err) {
    results.push({ num: 1, form: 'Job Candidate Application Form', endpoint: '/api/apply-job', ok: false, error: err.message });
  }

  await sleep(1500);

  // 2. Freelance Network Application (/api/apply-freelance) - multipart/form-data
  try {
    console.log('[2/10] Submitting Freelance Engineering Network Form...');
    const fd = new FormData();
    fd.append('fullName', 'Syed Ismail');
    fd.append('email', 'syedismail@zawrindustries.com');
    fd.append('phone', '+91 98765 43210');
    fd.append('skill', 'Robotics & Distributed Cloud Systems');
    fd.append('portfolio', 'https://github.com/syedismail');
    fd.append('coverLetter', 'Experienced distributed systems engineer ready for project contracting.');

    const t0 = performance.now();
    const res = await fetch(`${BASE_URL}/api/apply-freelance`, {
      method: 'POST',
      body: fd
    });
    const t1 = performance.now();
    const data = await res.json();
    console.log(`  ➔ Status: ${res.status} | Latency: ${(t1 - t0).toFixed(0)}ms | Result:`, data);
    results.push({
      num: 2,
      form: 'Freelance Engineering Network Form',
      endpoint: '/api/apply-freelance',
      method: 'POST (FormData)',
      status: res.status,
      ok: res.ok,
      latency: `${(t1 - t0).toFixed(0)}ms`,
      response: data
    });
  } catch (err) {
    results.push({ num: 2, form: 'Freelance Engineering Network Form', endpoint: '/api/apply-freelance', ok: false, error: err.message });
  }

  await sleep(1500);

  // 3. Priority Client Callback (/api/request-callback) - JSON
  try {
    console.log('[3/10] Submitting Priority Client Callback Form...');
    const t0 = performance.now();
    const res = await fetch(`${BASE_URL}/api/request-callback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        clientId: 'ZR-CLIENT-9914',
        priority: 'Immediate (< 15 mins)',
        phone: '+91 98765 43210',
        email: 'syedismail@zawrindustries.com'
      })
    });
    const t1 = performance.now();
    const data = await res.json();
    console.log(`  ➔ Status: ${res.status} | Latency: ${(t1 - t0).toFixed(0)}ms | Result:`, data);
    results.push({
      num: 3,
      form: 'Priority Client Callback Form',
      endpoint: '/api/request-callback',
      method: 'POST (JSON)',
      status: res.status,
      ok: res.ok,
      latency: `${(t1 - t0).toFixed(0)}ms`,
      response: data
    });
  } catch (err) {
    results.push({ num: 3, form: 'Priority Client Callback Form', endpoint: '/api/request-callback', ok: false, error: err.message });
  }

  await sleep(1500);

  // 4. Investor Capital Interest (/api/request-investor) - JSON
  try {
    console.log('[4/10] Submitting Investor Relations & Capital Interest Form...');
    const t0 = performance.now();
    const res = await fetch(`${BASE_URL}/api/request-investor`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Syed Ismail',
        email: 'syedismail@zawrindustries.com',
        organization: 'Apex Global Capital Partners',
        investmentSize: '$50,000,000 - $100,000,000',
        inquiry: 'Requesting access to confidential Q3 investor prospectus and holding growth report.'
      })
    });
    const t1 = performance.now();
    const data = await res.json();
    console.log(`  ➔ Status: ${res.status} | Latency: ${(t1 - t0).toFixed(0)}ms | Result:`, data);
    results.push({
      num: 4,
      form: 'Investor Relations & Capital Interest Form',
      endpoint: '/api/request-investor',
      method: 'POST (JSON)',
      status: res.status,
      ok: res.ok,
      latency: `${(t1 - t0).toFixed(0)}ms`,
      response: data
    });
  } catch (err) {
    results.push({ num: 4, form: 'Investor Relations & Capital Interest Form', endpoint: '/api/request-investor', ok: false, error: err.message });
  }

  await sleep(1500);

  // 5. Media Kit & Brand Assets (/api/request-media-kit) - JSON
  try {
    console.log('[5/10] Submitting Media Kit & Brand Assets Delivery Form...');
    const t0 = performance.now();
    const res = await fetch(`${BASE_URL}/api/request-media-kit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Syed Ismail',
        companyName: 'Financial Times Global Tech Review',
        organization: 'Financial Times Media',
        email: 'syedismail@zawrindustries.com',
        purpose: 'Publishing editorial profile on Zawr AI robotics manufacturing ecosystem.',
        resources: ['Brand Logos', 'Executive Photography', 'Fact Sheet']
      })
    });
    const t1 = performance.now();
    const data = await res.json();
    console.log(`  ➔ Status: ${res.status} | Latency: ${(t1 - t0).toFixed(0)}ms | Result:`, data);
    results.push({
      num: 5,
      form: 'Media Kit & Brand Assets Form',
      endpoint: '/api/request-media-kit',
      method: 'POST (JSON)',
      status: res.status,
      ok: res.ok,
      latency: `${(t1 - t0).toFixed(0)}ms`,
      response: data
    });
  } catch (err) {
    results.push({ num: 5, form: 'Media Kit & Brand Assets Form', endpoint: '/api/request-media-kit', ok: false, error: err.message });
  }

  await sleep(1500);

  // 6. Strategic Partnership (/api/request-partner) - JSON
  try {
    console.log('[6/10] Submitting Strategic Partnership & Ecosystem Form...');
    const t0 = performance.now();
    const res = await fetch(`${BASE_URL}/api/request-partner`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        firstName: 'Syed',
        lastName: 'Ismail',
        email: 'syedismail@zawrindustries.com',
        phone: '+91 98765 43210',
        company: 'OmniCloud Technologies Global',
        partnershipType: 'Enterprise Co-Development & Joint Venture',
        message: 'Exploring mutual integration of cloud logistics AI architectures.'
      })
    });
    const t1 = performance.now();
    const data = await res.json();
    console.log(`  ➔ Status: ${res.status} | Latency: ${(t1 - t0).toFixed(0)}ms | Result:`, data);
    results.push({
      num: 6,
      form: 'Strategic Partnership & Ecosystem Form',
      endpoint: '/api/request-partner',
      method: 'POST (JSON)',
      status: res.status,
      ok: res.ok,
      latency: `${(t1 - t0).toFixed(0)}ms`,
      response: data
    });
  } catch (err) {
    results.push({ num: 6, form: 'Strategic Partnership & Ecosystem Form', endpoint: '/api/request-partner', ok: false, error: err.message });
  }

  await sleep(1500);

  // 7. Corporate Sponsorship (/api/sponsorship) - multipart/form-data
  try {
    console.log('[7/10] Submitting Corporate Sponsorship & Summit Grants Form...');
    const fd = new FormData();
    fd.append('fullName', 'Syed Ismail');
    fd.append('companyName', 'Nexus Aerospace & Robotics');
    fd.append('email', 'syedismail@zawrindustries.com');
    fd.append('phone', '+91 98765 43210');
    fd.append('sponsorshipType', 'Title Keynote Partner Tier');
    fd.append('objectives', 'Sponsoring upcoming Industrial AI & Clean Mobility Summit.');

    const t0 = performance.now();
    const res = await fetch(`${BASE_URL}/api/sponsorship`, {
      method: 'POST',
      body: fd
    });
    const t1 = performance.now();
    const data = await res.json();
    console.log(`  ➔ Status: ${res.status} | Latency: ${(t1 - t0).toFixed(0)}ms | Result:`, data);
    results.push({
      num: 7,
      form: 'Corporate Sponsorship & Summit Grants Form',
      endpoint: '/api/sponsorship',
      method: 'POST (FormData)',
      status: res.status,
      ok: res.ok,
      latency: `${(t1 - t0).toFixed(0)}ms`,
      response: data
    });
  } catch (err) {
    results.push({ num: 7, form: 'Corporate Sponsorship & Summit Grants Form', endpoint: '/api/sponsorship', ok: false, error: err.message });
  }

  await sleep(1500);

  // 8. Event RSVP Pass (/api/rsvp) - JSON
  try {
    console.log('[8/10] Submitting Corporate Event & Summit RSVP Form...');
    const t0 = performance.now();
    const res = await fetch(`${BASE_URL}/api/rsvp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Syed Ismail',
        email: 'syedismail@zawrindustries.com',
        phone: '+91 98765 43210',
        company: 'Zawr Tech Ventures',
        designation: 'Managing Director',
        eventId: 'global-industrial-summit-2026',
        eventTitle: 'Zawr Global Industrial & AI Summit 2026'
      })
    });
    const t1 = performance.now();
    const data = await res.json();
    console.log(`  ➔ Status: ${res.status} | Latency: ${(t1 - t0).toFixed(0)}ms | Result:`, data);
    results.push({
      num: 8,
      form: 'Corporate Event & Summit RSVP Form',
      endpoint: '/api/rsvp',
      method: 'POST (JSON)',
      status: res.status,
      ok: res.ok,
      latency: `${(t1 - t0).toFixed(0)}ms`,
      response: data
    });
  } catch (err) {
    results.push({ num: 8, form: 'Corporate Event & Summit RSVP Form', endpoint: '/api/rsvp', ok: false, error: err.message });
  }

  await sleep(1500);

  // 9. PR & General Inquiries (/api/request-pr) - JSON
  try {
    console.log('[9/10] Submitting Public Relations & General Inquiries Form...');
    const t0 = performance.now();
    const res = await fetch(`${BASE_URL}/api/request-pr`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        firstName: 'Syed',
        lastName: 'Ismail',
        email: 'syedismail@zawrindustries.com',
        phone: '+91 98765 43210',
        message: 'Requesting an executive interview regarding Zawr Industries expansion roadmap.'
      })
    });
    const t1 = performance.now();
    const data = await res.json();
    console.log(`  ➔ Status: ${res.status} | Latency: ${(t1 - t0).toFixed(0)}ms | Result:`, data);
    results.push({
      num: 9,
      form: 'Public Relations & General Inquiries Form',
      endpoint: '/api/request-pr',
      method: 'POST (JSON)',
      status: res.status,
      ok: res.ok,
      latency: `${(t1 - t0).toFixed(0)}ms`,
      response: data
    });
  } catch (err) {
    results.push({ num: 9, form: 'Public Relations & General Inquiries Form', endpoint: '/api/request-pr', ok: false, error: err.message });
  }

  await sleep(1500);

  // 10. Newsletter Subscription (/api/newsletter) - JSON
  try {
    console.log('[10/10] Submitting Global Newsletter Subscription Form...');
    const t0 = performance.now();
    const testEmail = `syedismail+test${Date.now()}@zawrindustries.com`;
    const res = await fetch(`${BASE_URL}/api/newsletter`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testEmail
      })
    });
    const t1 = performance.now();
    const data = await res.json();
    console.log(`  ➔ Status: ${res.status} | Latency: ${(t1 - t0).toFixed(0)}ms | Result:`, data);
    results.push({
      num: 10,
      form: 'Global Newsletter Subscription Form',
      endpoint: '/api/newsletter',
      method: 'POST (JSON)',
      status: res.status,
      ok: res.ok,
      latency: `${(t1 - t0).toFixed(0)}ms`,
      response: data
    });
  } catch (err) {
    results.push({ num: 10, form: 'Global Newsletter Subscription Form', endpoint: '/api/newsletter', ok: false, error: err.message });
  }

  console.log('\n====================================================');
  console.log(`✅ TEST RESULTS: ${results.filter(r => r.ok).length} / ${results.length} PASSED`);
  console.log('====================================================\n');
}

testAllForms();
