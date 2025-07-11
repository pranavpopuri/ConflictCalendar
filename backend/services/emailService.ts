/**
 * @fileoverview Email Service - Handles email functionality for the application
 * @description Provides email sending capabilities including transporter initialization,
 * test account creation (Ethereal Email), password reset emails, and general email sending.
 * Supports both development (Ethereal) and production (SMTP) configurations.
 * @author ConflictCalendar Team
 * @version 1.0.0
 */

import nodemailer from 'nodemailer';

/**
 * Email configuration options interface
 * @interface EmailOptions
 * @description Defines the structure for email sending parameters
 */
interface EmailOptions {
    /** Recipient email address */
    to: string;
    /** Email subject line */
    subject: string;
    /** Plain text email content (optional) */
    text?: string;
    /** HTML email content (optional) */
    html?: string;
}

/**
 * Email service class for handling all email operations
 * @class EmailService
 * @description Manages email transporter initialization and provides methods for sending emails
 */
class EmailService {
    /** Nodemailer transporter instance */
    private transporter: nodemailer.Transporter | null = null;
    /** Promise for initialization to prevent multiple initializations */
    private initPromise: Promise<void> | null = null;

    /**
     * Creates an instance of EmailService
     * @description Initializes the email service but defers transporter setup until first use
     */
    constructor() {
        console.log('📧 EmailService constructor called - will initialize on first use');
        // Don't initialize immediately - wait for first use
    }

    /**
     * Initializes the email transporter if not already initialized
     * @description Ensures single initialization of the email transporter
     * @returns {Promise<void>} Promise that resolves when initialization is complete
     * @private
     */
    private async initializeTransporter(): Promise<void> {
        if (this.initPromise) {
            return this.initPromise;
        }

        this.initPromise = this._doInitialize();
        return this.initPromise;
    }

    /**
     * Performs the actual transporter initialization
     * @description Sets up nodemailer transporter with either Ethereal Email (testing) or SMTP credentials
     * @returns {Promise<void>} Promise that resolves when transporter is configured
     * @throws {Error} Configuration or connection errors
     * @private
     */
    private async _doInitialize(): Promise<void> {
        console.log('🔧 Initializing email service with configuration:');
        console.log('EMAIL_HOST:', process.env.EMAIL_HOST);
        console.log('EMAIL_PORT:', process.env.EMAIL_PORT);
        console.log('EMAIL_USER:', process.env.EMAIL_USER);
        console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? '[SET]' : '[NOT SET]');
        console.log('EMAIL_FROM:', process.env.EMAIL_FROM);

        try {
            // Check if using Ethereal Email for testing
            if (process.env.EMAIL_HOST === 'smtp.ethereal.email' &&
                (process.env.EMAIL_USER === 'auto_generated' || !process.env.EMAIL_USER)) {

                console.log('🧪 Creating Ethereal Email test account...');
                const testAccount = await nodemailer.createTestAccount();

                console.log('✅ Ethereal Email account created:');
                console.log('- User:', testAccount.user);
                console.log('- Pass:', testAccount.pass);
                console.log('- Preview URL will be shown after sending emails');

                this.transporter = nodemailer.createTransport({
                    host: 'smtp.ethereal.email',
                    port: 587,
                    secure: false,
                    auth: {
                        user: testAccount.user,
                        pass: testAccount.pass,
                    },
                });
            } else {
                console.log('🔧 Using provided email credentials...');
                // Use provided credentials
                this.transporter = nodemailer.createTransport({
                    service: process.env.EMAIL_HOST === 'smtp.gmail.com' ? 'gmail' : undefined,
                    host: process.env.EMAIL_HOST,
                    port: parseInt(process.env.EMAIL_PORT || '587'),
                    secure: false,
                    auth: {
                        user: process.env.EMAIL_USER,
                        pass: process.env.EMAIL_PASS,
                    },
                    tls: {
                        rejectUnauthorized: false
                    }
                });
            }
            console.log('✅ Email transporter initialized successfully');
        } catch (error) {
            console.error('❌ Failed to initialize email service:', error);
            throw error;
        }
    }

    /**
     * Sends an email using the configured transporter
     * @description Sends an email with the specified options, handling initialization if needed
     * @param {EmailOptions} options - Email configuration object
     * @param {string} options.to - Recipient email address
     * @param {string} options.subject - Email subject line
     * @param {string} [options.text] - Plain text email content
     * @param {string} [options.html] - HTML email content
     * @returns {Promise<void>} Promise that resolves when email is sent
     * @throws {Error} Email sending or configuration errors
     * @example
     * await emailService.sendEmail({
     *   to: 'user@example.com',
     *   subject: 'Welcome!',
     *   html: '<h1>Welcome to ConflictCalendar</h1>'
     * });
     */
    async sendEmail(options: EmailOptions): Promise<void> {
        console.log('📤 sendEmail called with:', { to: options.to, subject: options.subject });

        // Initialize transporter if not already done
        console.log('⏳ Initializing email service...');
        await this.initializeTransporter();

        if (!this.transporter) {
            console.error('❌ Email transporter is null after initialization');
            throw new Error('Email service not properly initialized');
        }

        console.log('✅ Email service ready, preparing to send email...');

        const mailOptions = {
            from: `"Conflict Calendar" <${process.env.EMAIL_FROM}>`,
            to: options.to,
            subject: options.subject,
            text: options.text,
            html: options.html,
        };

        console.log('📧 Attempting to send email with options:', {
            from: mailOptions.from,
            to: mailOptions.to,
            subject: mailOptions.subject,
            textLength: options.text?.length || 0,
            htmlLength: options.html?.length || 0
        });

        try {
            const result = await this.transporter.sendMail(mailOptions);
            console.log(`✅ Email sent successfully to ${options.to}`);
            console.log('📬 Email result:', result);

            // If using Ethereal Email, show preview URL
            if (process.env.EMAIL_HOST === 'smtp.ethereal.email') {
                const previewUrl = nodemailer.getTestMessageUrl(result);
                console.log('🌐 Preview email at:', previewUrl);
                console.log('👆 CLICK THE LINK ABOVE TO SEE YOUR EMAIL! 👆');
            }
        } catch (error) {
            console.error('❌ Email sending failed:', error);
            throw new Error('Failed to send email: ' + (error as Error).message);
        }
    }

    /**
     * Sends a password reset email with a secure reset link
     * @description Creates and sends a formatted password reset email with both HTML and text content
     * @param {string} email - Recipient's email address
     * @param {string} resetToken - Secure password reset token
     * @returns {Promise<void>} Promise that resolves when reset email is sent
     * @throws {Error} Email sending or URL configuration errors
     * @note Reset links expire in 10 minutes for security
     * @example
     * const resetToken = user.generatePasswordResetToken();
     * await emailService.sendPasswordResetEmail('user@example.com', resetToken);
     */
    async sendPasswordResetEmail(email: string, resetToken: string): Promise<void> {
        // Determine the correct frontend URL based on environment
        let frontendUrl = process.env.FRONTEND_URL;

        // Fallback logic for different environments
        if (!frontendUrl) {
            const isProduction = process.env.NODE_ENV === 'production';
            frontendUrl = isProduction
                ? 'https://conflictcalendar.onrender.com'
                : 'http://localhost:5000';
        }

        console.log('🔗 Using frontend URL for reset link:', frontendUrl);

        const resetUrl = `${frontendUrl}/reset-password?token=${resetToken}`;

        const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reset Your Password - Conflict Calendar</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, oklch(0.7 0.1 220), oklch(0.6 0.15 250)); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: white; padding: 30px; border: 1px solid #e0e0e0; border-radius: 0 0 8px 8px; }
          .button { display: inline-block; background: oklch(0.6 0.15 250); color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 20px 0; }
          .button:hover { background: oklch(0.5 0.18 250); }
          .warning { background: #fff3cd; border: 1px solid #ffeaa7; color: #856404; padding: 15px; border-radius: 6px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🗓️ Conflict Calendar</h1>
            <h2>Password Reset Request</h2>
          </div>
          <div class="content">
            <p>Hello,</p>
            <p>You requested a password reset for your Conflict Calendar account. Click the button below to reset your password:</p>

            <div style="text-align: center;">
              <a href="${resetUrl}" class="button">Reset Password</a>
            </div>

            <p>Or copy and paste this link into your browser:</p>
            <p style="word-break: break-all; background: #f8f9fa; padding: 10px; border-radius: 4px;">
              ${resetUrl}
            </p>

            <div class="warning">
              <strong>⚠️ Important:</strong> This link will expire in 10 minutes for security reasons.
            </div>

            <p>If you didn't request this password reset, please ignore this email. Your password will remain unchanged.</p>

            <p>Best regards,<br>The Conflict Calendar Team</p>
          </div>
          <div class="footer">
            <p>This is an automated email. Please do not reply to this message.</p>
          </div>
        </div>
      </body>
      </html>
    `;

        const text = `
      Reset Your Password - Conflict Calendar

      You requested a password reset for your Conflict Calendar account.

      Reset your password by visiting this link:
      ${resetUrl}

      This link will expire in 10 minutes for security reasons.

      If you didn't request this password reset, please ignore this email.

      Best regards,
      The Conflict Calendar Team
    `;

        await this.sendEmail({
            to: email,
            subject: 'Reset Your Password - Conflict Calendar',
            text,
            html,
        });
    }
}

/**
 * Email service singleton instance
 * @description Exported singleton instance of EmailService for application-wide use
 * @example
 * import emailService from './services/emailService';
 * await emailService.sendEmail({ to: 'user@example.com', subject: 'Hello' });
 */
export default new EmailService();
