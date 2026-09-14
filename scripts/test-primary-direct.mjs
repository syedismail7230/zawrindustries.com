import nodemailer from 'nodemailer';

async function testRelay(name, user, pass) {
  console.log(`\n========================================`);
  console.log(`Testing [${name}] (${user})`);
  console.log(`========================================`);

  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: user,
      pass: pass.replace(/\s+/g, '')
    }
  });

  try {
    console.log('1. Verifying SMTP Handshake & Credentials...');
    await transporter.verify();
    console.log('   ✅ Handshake Verified!');

    console.log('2. Sending Test Message...');
    const info = await transporter.sendMail({
      from: '"Zawr Industries" <noreply@zawrindustries.com>',
      to: 'syedismail7230@gmail.com',
      subject: `Direct Test [${name}]: ${new Date().toLocaleTimeString()}`,
      text: `Testing direct dispatch from ${name} (${user}) to check sender ID and delivery.`
    });

    console.log('   ✅ DELIVERED! Message ID:', info.messageId);
    console.log('   ➔ Response from Google:', info.response);
    console.log('   ➔ Accepted:', info.accepted);
  } catch (err) {
    console.error('   ❌ ERROR:', err.message);
    if (err.response) {
      console.error('   ➔ Google Response:', err.response);
    }
  }
}

async function run() {
  await testRelay('Priority 1 Relay', 'zawrindustries.mails@gmail.com', 'ibpd wsxa wufo modk');
  await testRelay('Priority 2 Relay', 'zawrorganization@gmail.com', 'mszr twjr ewun gkyn');
}

run();
