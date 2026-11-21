import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function run() {
  console.log('--- Testing Daily Webmaster Executive Report Dispatch ---');
  try {
    const { sendDailyReportToWebmaster } = await import('../src/lib/webmaster-report.ts');
    console.log('Sending daily report to official webmaster distribution list...');
    const result = await sendDailyReportToWebmaster('Manual Test Verification');
    console.log('Result:', result);
  } catch (err) {
    console.error('Dispatch failed:', err);
    process.exit(1);
  }
}

run();
