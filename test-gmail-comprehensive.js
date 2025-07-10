// Comprehensive Gmail test with multiple approaches
require('dotenv').config();
const nodemailer = require('nodemailer');

async function testGmailMultipleWays() {
    console.log('🔍 Testing Gmail configuration multiple ways...');
    console.log('EMAIL_USER:', process.env.EMAIL_USER);
    console.log('EMAIL_PASS length:', process.env.EMAIL_PASS?.length || 0);

    // Test 1: Using service: 'gmail'
    console.log('\n📧 Test 1: Using service: "gmail"...');
    try {
        const transporter1 = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        await Promise.race([
            transporter1.verify(),
            new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 5000))
        ]);
        console.log('✅ Test 1 SUCCESS - service: gmail works!');
        return transporter1;
    } catch (error) {
        console.log('❌ Test 1 FAILED:', error.message);
    }

    // Test 2: Using explicit SMTP settings
    console.log('\n📧 Test 2: Using explicit SMTP settings...');
    try {
        const transporter2 = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        await Promise.race([
            transporter2.verify(),
            new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 5000))
        ]);
        console.log('✅ Test 2 SUCCESS - explicit SMTP works!');
        return transporter2;
    } catch (error) {
        console.log('❌ Test 2 FAILED:', error.message);
    }

    // Test 3: Using TLS settings
    console.log('\n📧 Test 3: Using TLS settings...');
    try {
        const transporter3 = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
            tls: {
                rejectUnauthorized: false
            }
        });

        await Promise.race([
            transporter3.verify(),
            new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 5000))
        ]);
        console.log('✅ Test 3 SUCCESS - TLS settings work!');
        return transporter3;
    } catch (error) {
        console.log('❌ Test 3 FAILED:', error.message);
    }

    console.log('\n❌ All tests failed. Possible issues:');
    console.log('1. App password might be incorrect');
    console.log('2. App password might need to be regenerated');
    console.log('3. 2-factor authentication might not be enabled');
    console.log('4. Gmail account might have restrictions');

    return null;
}

async function sendTestEmail(transporter) {
    if (!transporter) {
        console.log('❌ No working transporter available');
        return;
    }

    console.log('\n📤 Sending test email...');
    try {
        const result = await transporter.sendMail({
            from: process.env.EMAIL_FROM,
            to: process.env.EMAIL_USER,
            subject: 'ConflictCalendar Test Email - ' + new Date().toLocaleString(),
            text: 'This is a test email from ConflictCalendar! If you received this, the email configuration is working correctly.',
            html: `
                <h2>✅ ConflictCalendar Email Test</h2>
                <p>Congratulations! Your email configuration is working correctly.</p>
                <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
                <p><strong>From:</strong> ${process.env.EMAIL_FROM}</p>
                <hr>
                <p><em>This is an automated test email from ConflictCalendar.</em></p>
            `
        });

        console.log('✅ Test email sent successfully!');
        console.log('📬 Message ID:', result.messageId);
        console.log('🎯 Check your inbox at:', process.env.EMAIL_USER);
        console.log('📱 Also check your spam/junk folder just in case!');

    } catch (error) {
        console.error('❌ Failed to send test email:', error.message);
    }
}

// Run the tests
testGmailMultipleWays().then(sendTestEmail);
