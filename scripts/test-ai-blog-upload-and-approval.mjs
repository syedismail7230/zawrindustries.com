import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function runTest() {
  console.log('===============================================================');
  console.log('   ZAWR INDUSTRIES - AI BLOG AUTONOMOUS RUN & EMAIL TEST       ');
  console.log('===============================================================\n');

  try {
    const { runAutonomousBlogPipeline } = await import('../src/lib/ai-blog-engine.ts');

    console.log('⏳ Running Autonomous AI Blog Generation with Gemini API...');
    console.log('   - Topic Selection & Drafting');
    console.log('   - Blog-assets Random Image Selection');
    console.log('   - Layer 1 Technical Fact-Check');
    console.log('   - Layer 2 Editorial Governance & Sensitivity Check');
    console.log('   - Admin Verification Email Dispatch\n');

    const result = await runAutonomousBlogPipeline({
      customTopic: 'Autonomous Robotic Logistics: Zero-Latency Warehousing Architecture 2026',
      targetCategory: 'Automated Logistics & Supply Chain',
      requireApproval: true, // Forces sending verification email to admin
    });

    console.log('---------------------------------------------------------------');
    console.log('✅ Pipeline Execution Succeeded!');
    console.log(`Action Taken:    ${result.actionTaken}`);
    console.log(`Blog ID:         ${result.blog.id}`);
    console.log(`Title:           ${result.blog.title}`);
    console.log(`Category:        ${result.blog.category}`);
    console.log(`Assigned Image:  ${result.blog.image}`);
    console.log(`Status:          ${result.blog.status}`);
    console.log(`Sensitive:       ${result.blog.sensitive}`);
    console.log(`Reason:          ${result.blog.sensitivityReason || 'Admin verification requested'}`);
    console.log(`Approval Token:  ${result.blog.approvalToken}`);
    console.log(`Sections Count:  ${result.blog.sections.length}`);
    console.log('---------------------------------------------------------------');
    console.log('📧 Check your inbox at: ' + (process.env.WEBMASTER_ALERT_EMAIL || process.env.GMAIL_USER || 'zawrindustries.mails@gmail.com'));
    console.log('===============================================================\n');
  } catch (error) {
    console.error('❌ Pipeline Execution Failed:', error);
    process.exit(1);
  }
}

runTest();
