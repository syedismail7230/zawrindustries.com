import nodemailer from 'nodemailer';
import fs from 'fs';

async function main() {
  console.log('========================================================');
  console.log('🔬 DIAGNOSTIC TEST: SMTP RELAYS & 20-EMAIL DISPATCH FLOW');
  console.log('========================================================\n');

  // Load gateway configs
  const raw = fs.readFileSync('./public/data/smtp-gateways.json', 'utf8');
  const pool = JSON.parse(raw);

  console.log(`Found ${pool.gateways.length} Gateways in cluster:`);
  pool.gateways.forEach(g => {
    console.log(` - [Priority ${g.priority}] ${g.name} (${g.user}) - Limit: ${g.dailyLimit}/day`);
  });
  console.log('\n--- STEP 1: TESTING PRIMARY & SECONDARY GATEWAY HANDSHAKES ---');

  for (const gw of pool.gateways) {
    const isPrimary = gw.priority === 1;
    console.log(`\nTesting ${isPrimary ? 'PRIMARY' : 'SECONDARY'} Relay: ${gw.name} (${gw.user})...`);
    
    const transporter = nodemailer.createTransport({
      host: gw.host || 'smtp.gmail.com',
      port: gw.port || 465,
      secure: gw.secure !== undefined ? gw.secure : true,
      auth: {
        user: gw.user,
        pass: gw.pass.replace(/\s+/g, '')
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    try {
      const t0 = performance.now();
      await transporter.verify();
      const latency = Math.round(performance.now() - t0);
      console.log(`  ✅ HANDSHAKE SUCCESS! Latency: ${latency}ms`);

      // Try sending a test email
      const info = await transporter.sendMail({
        from: `"${gw.senderName || 'Zawr Relay'}" <${gw.senderEmail || 'noreply@zawrindustries.com'}>`,
        to: 'syedismail7230@gmail.com',
        subject: `[SMTP Diagnostic Test] Relay: ${gw.name}`,
        text: `Handshake verified successfully through ${gw.name} (${gw.user}) via TLS 1.3.`
      });
      console.log(`  ✅ TEST EMAIL DELIVERED! Message ID: ${info.messageId}`);
    } catch (err) {
      console.error(`  ❌ RELAY ERROR:`, err.message);
    }
  }
}

main();
