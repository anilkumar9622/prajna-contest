import nodemailer from 'nodemailer';
import { google } from 'googleapis';
import type SMTPTransport from 'nodemailer/lib/smtp-transport';

const OAuth2 = google.auth.OAuth2;

const oauth2Client = new OAuth2
(process.env.GOOGLE_CLIENT_ID,
 process.env.GOOGLE_CLIENT_SECRET,
  'https://developers.google.com/oauthplayground');

oauth2Client.setCredentials({
    refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
});

interface SendEmailParams {
    to: string;
    subject: string;
    message: string;
}

export async function sendEmail({ to, subject, message }: SendEmailParams) {
    try {
        // Get fresh access token
        const { token } = await oauth2Client.getAccessToken();

        // Configure transporter
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: process.env.EMAIL_FROM,
                clientId: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
                accessToken: token,
            },
        } as SMTPTransport.Options);

        // Send the email
        const result = await transporter.sendMail({
            from: `My App <${process.env.EMAIL_FROM}>`,
            to,
            subject,
            html:message
        });

        return { success: true, result };
    } catch (error) {
        const err = error as Error;
        console.error('Error sending email:', err.message);
        return { success: false, error: err.message };
    }
}
