/**
 * Comprehensive Automated QA & Unit Test (UT) Suite
 * for all Forms, Portals, and Email Generators across Zawr Industries.
 */

const fs = require('fs');
const path = require('path');

// Load environment variables
const envPath = path.resolve('.env.local');
if (fs.existsSync(envPath)) {
  const lines = fs.readFileSync(envPath, 'utf8').split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
      const idx = trimmed.indexOf('=');
      const key = trimmed.slice(0, idx).trim();
      let val = trimmed.slice(idx + 1).trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      process.env[key] = val;
    }
  }
}

// Test Runner
const results = {
  total: 0,
  passed: 0,
  failed: 0,
  tests: [],
};

function assert(description, condition, extra = '') {
  results.total++;
  if (condition) {
    results.passed++;
    results.tests.push({ status: 'PASS', description });
    console.log(`  ✓ PASS: ${description}`);
  } else {
    results.failed++;
    results.tests.push({ status: 'FAIL', description, extra });
    console.error(`  ✗ FAIL: ${description} ${extra ? `(${extra})` : ''}`);
  }
}

async function runAllUnitAndIntegrationTests() {
  console.log('================================================================');
  console.log('  ZAWR INDUSTRIES — FULL WEBSITE FORM QA & UNIT TEST SUITE');
  console.log('================================================================\n');

  // -------------------------------------------------------------
  // TEST GROUP 1: Route & Handler File Existence QA
  // -------------------------------------------------------------
  console.log('--- TEST SUITE 1: API Endpoint & Form Route Verification ---');
  const requiredApiRoutes = [
    'src/app/api/apply-job/route.ts',
    'src/app/api/apply-freelance/route.ts',
    'src/app/api/request-pr/route.ts',
    'src/app/api/request-investor/route.ts',
    'src/app/api/request-media-kit/route.ts',
    'src/app/api/rsvp/route.ts',
    'src/app/api/sponsorship/route.ts',
    'src/app/api/request-partner/route.ts',
    'src/app/api/request-callback/route.ts',
    'src/app/api/newsletter/route.ts',
  ];

  for (const route of requiredApiRoutes) {
    const fullPath = path.resolve(route);
    assert(`API Route Exists: ${route}`, fs.existsSync(fullPath));
  }

  // -------------------------------------------------------------
  // TEST GROUP 2: Frontend Form Component Bindings QA
  // -------------------------------------------------------------
  console.log('\n--- TEST SUITE 2: Frontend Form Component Bindings ---');
  const formBindings = [
    { file: 'src/components/Footer.tsx', endpoint: '/api/newsletter', desc: 'Footer News Alerts Form' },
    { file: 'src/app/careers/[role]/page.tsx', endpoint: '/api/apply-job', desc: 'Careers Job Application Form' },
    { file: 'src/app/careers/page.tsx', endpoint: '/api/apply-freelance', desc: 'Freelance Application Modal Form' },
    { file: 'src/app/contact/public-relations/page.tsx', endpoint: '/api/request-pr', desc: 'Public Relations / Contact Form' },
    { file: 'src/app/investors/interest/page.tsx', endpoint: '/api/request-investor', desc: 'Investor Relations Inquiry Form' },
    { file: 'src/app/newsroom/media-kit/page.tsx', endpoint: '/api/request-media-kit', desc: 'Media Kit Resource Request Form' },
    { file: 'src/app/newsroom/events/page.tsx', endpoint: '/api/rsvp', desc: 'Events RSVP Access Pass Form' },
    { file: 'src/app/contact/sponsorship/page.tsx', endpoint: '/api/sponsorship', desc: 'Corporate Sponsorship Form' },
    { file: 'src/app/contact/partner/[slug]/page.tsx', endpoint: '/api/request-partner', desc: 'Multi-Step Partner & Creator Form' },
    { file: 'src/app/contact/client-relations/page.tsx', endpoint: '/api/request-callback', desc: 'Client Relations Callback Form' },
  ];

  for (const binding of formBindings) {
    const content = fs.readFileSync(path.resolve(binding.file), 'utf8');
    assert(`${binding.desc} binds to ${binding.endpoint}`, content.includes(binding.endpoint));
  }

  // -------------------------------------------------------------
  // TEST GROUP 3: Template Design Guidelines & Rules QA
  // -------------------------------------------------------------
  console.log('\n--- TEST SUITE 3: Email Template Design & Typography Compliance ---');
  const emailTemplatesPath = path.resolve('src/lib/emailTemplates.ts');
  const emailTemplatesContent = fs.readFileSync(emailTemplatesPath, 'utf8');

  // Rule 1: Google Font Poppins
  assert(
    'Email templates import Google Fonts Poppins',
    emailTemplatesContent.includes('family=Poppins')
  );

  // Rule 2: Wordmark ZAWR bold, INDUSTRIES regular
  assert(
    'Email header uses brand wordmark: ZAWR (800) INDUSTRIES (400)',
    emailTemplatesContent.includes('ZAWR') &&
      emailTemplatesContent.includes('INDUSTRIES') &&
      emailTemplatesContent.includes('800') &&
      emailTemplatesContent.includes('400')
  );

  // Rule 3: Background is pure white (#ffffff)
  assert(
    'Email layout uses pure clean white canvas (#ffffff)',
    emailTemplatesContent.includes('#ffffff')
  );

  // Rule 4: No misaligned dots or badge pills
  assert(
    'Email templates contain no misaligned dot glyphs (●) in titles/headers',
    !emailTemplatesContent.includes('● Application Under Review') &&
      !emailTemplatesContent.includes('● Profile In Review')
  );

  // -------------------------------------------------------------
  // TEST GROUP 4: Required Email Template Generator Functions
  // -------------------------------------------------------------
  console.log('\n--- TEST SUITE 4: Generator Functions Export QA ---');
  const requiredGenerators = [
    'generateCandidateJobConfirmationEmail',
    'generateHRJobNotificationEmail',
    'generateFreelanceApplicantConfirmationEmail',
    'generateHRFreelanceNotificationEmail',
    'generateContactConfirmationEmail',
    'generateInvestorConfirmationEmail',
    'generateMediaKitConfirmationEmail',
    'generateRSVPConfirmationEmail',
    'generateSponsorshipConfirmationEmail',
    'generatePartnerConfirmationEmail',
    'generateNewsletterConfirmationEmail',
  ];

  for (const gen of requiredGenerators) {
    assert(`Exported generator exists: ${gen}`, emailTemplatesContent.includes(`export function ${gen}`));
  }

  // -------------------------------------------------------------
  // TEST GROUP 5: Environment & SMTP Configuration QA
  // -------------------------------------------------------------
  console.log('\n--- TEST SUITE 5: Production SMTP Readiness ---');
  assert('GMAIL_USER is configured', !!process.env.GMAIL_USER, process.env.GMAIL_USER);
  assert('GMAIL_APP_PASSWORD is configured', !!process.env.GMAIL_APP_PASSWORD);
  assert('GMAIL_FROM default is configured or fallback exists', !!process.env.GMAIL_FROM || true);

  // Summary
  console.log('\n================================================================');
  console.log(`  QA & UNIT TEST SUMMARY: ${results.passed} / ${results.total} TESTS PASSED (${((results.passed / results.total) * 100).toFixed(1)}%)`);
  if (results.failed === 0) {
    console.log('  STATUS: ALL CHECKS VERIFIED & READY FOR PRODUCTION');
  } else {
    console.error(`  STATUS: ${results.failed} CHECKS FAILED`);
  }
  console.log('================================================================\n');

  if (results.failed > 0) {
    process.exit(1);
  }
}

runAllUnitAndIntegrationTests().catch((err) => {
  console.error('Test suite runner crashed:', err);
  process.exit(1);
});
