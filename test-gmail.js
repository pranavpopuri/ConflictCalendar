// Simple test script to verify Gmail configuration
require('dotenv').config();
const nodemailer = require('nodemailer');

async function testGmailConfig() {
    console.log('🔍 Testing Gmail configuration...');
    console.log('EMAIL_HOST:', process.env.EMAIL_HOST);
    console.log('EMAIL_PORT:', process.env.EMAIL_PORT);
    console.log('EMAIL_USER:', process.env.EMAIL_USER);
    console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? '[SET]' : '[NOT SET]');

    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        console.log('📧 Testing connection...');
        const verifyResult = await Promise.race([
            transporter.verify(),
            new Promise((_, reject) => setTimeout(() => reject(new Error('Connection timeout after 10 seconds')), 10000))
        ]);
        console.log('✅ Gmail SMTP connection successful!');

        console.log('📤 Sending test email...');
        const result = await transporter.sendMail({
            from: process.env.EMAIL_FROM,
            to: process.env.EMAIL_USER, // Send to yourself
            subject: 'Test Email from ConflictCalendar',
            text: 'This is a test email to verify Gmail configuration is working!',
            html: '<h1>✅ Success!</h1><p>Gmail configuration is working properly!</p>'
        });

        console.log('✅ Test email sent successfully!');
        console.log('📬 Message ID:', result.messageId);
        console.log('🎯 Check your inbox at:', process.env.EMAIL_USER);

    } catch (error) {
        console.error('❌ Error testing Gmail configuration:', error.message);
        if (error.code === 'EAUTH') {
            console.error('🔑 Authentication failed - check your email and app password');
        }
    }
}

testGmailConfig();
