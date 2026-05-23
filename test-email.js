
const nodemailer = require('nodemailer');

async function testEmail() {
  console.log('Testing email credentials...');
  console.log('USER:', process.env.GMAIL_USER);
  console.log('PASS:', process.env.GMAIL_APP_PASSWORD ? '********' : 'MISSING');

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });

  try {
    const info = await transporter.sendMail({
      from: `"Zawr Website Bot" <${process.env.GMAIL_USER}>`,
      to: 'business@zawrindustries.com',
      subject: 'Test Email from Node',
      text: 'If you receive this, Nodemailer is working perfectly!',
    });
    console.log('Email sent successfully!', info.messageId);
    console.log('Response:', info.response);
  } catch (error) {
    console.error('FAILED to send email:', error.message);
  }
}

testEmail();
