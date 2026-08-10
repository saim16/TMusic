require('dotenv').config();
const nodemailer = require('nodemailer');
const dns = require('dns');

// Force IPv4 on Render to prevent network timeouts
dns.setDefaultResultOrder('ipv4first');

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // TLS
    family: 4,     // Force IPv4
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // 16-character App Password
    },
});

// Immediate feedback log
transporter.verify((error, success) => {
    if (error) {
        console.error('❌ EMAIL CONNECTION ERROR:', error.message);
    } else {
        console.log('🚀 EMAIL SERVER IS READY TO SEND MESSAGES!');
    }
});


const sendEmail = async (to, subject, html) => {
    try {
        const info = await transporter.sendMail({
            from: `"TMusic" <${process.env.EMAIL_USER}>`, // sender address
            to, // list of receivers
            subject, // Subject line
            html, // html body
        });

    } catch (error) {
        console.error('Error sending email:', error);
    }
};

async function sendRegistrationEmail(email, name) {

    const subject = "Welcome to TMusic – Let's get the music started! 🎵";
    const html = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; background-color: #0f172a; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #f8fafc;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #0f172a; padding: 40px 10px;">
            <tr>
                <td align="center">
                    <table role="presentation" width="100%" style="max-width: 500px; background-color: #1e293b; border-radius: 12px; border: 1px solid #334155; overflow: hidden; padding: 32px; text-align: left;">
                        <!-- Header / Logo -->
                        <tr>
                            <td align="center" style="padding-bottom: 24px;">
                                <h1 style="margin: 0; font-size: 28px; font-weight: 800; color: #38bdf8; letter-spacing: -0.5px;">TMusic</h1>
                            </td>
                        </tr>
                        <!-- Content -->
                        <tr>
                            <td>
                                <h2 style="margin: 0 0 16px 0; font-size: 20px; font-weight: 600; color: #ffffff;">Welcome aboard, ${name}! 🎉</h2>
                                <p style="margin: 0 0 16px 0; font-size: 15px; line-height: 1.6; color: #94a3b8;">
                                    Your account has been successfully created. You're all set to dive into some music.
                                </p>
                                <p style="margin: 0 0 28px 0; font-size: 15px; line-height: 1.6; color: #94a3b8;">
                                    Thank you for joining our community. We’re excited to accompany you on your musical journey!
                                </p>
                            </td>
                        </tr>
                        <!-- Footer -->
                        <tr>
                            <td style="border-top: 1px solid #334155; padding-top: 20px; text-align: center;">
                                <p style="margin: 0; font-size: 12px; color: #64748b;">
                                    © ${new Date().getFullYear()} TMusic Inc. All rights reserved.
                                </p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>`;

    await sendEmail(email, subject, html);
}

async function sendEmailOTP(email, username, otp) {
    try {
        const subject = `${otp} is your TMusic verification code`;
        const html = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; background-color: #0f172a; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #f8fafc;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #0f172a; padding: 40px 10px;">
            <tr>
                <td align="center">
                    <table role="presentation" width="100%" style="max-width: 500px; background-color: #1e293b; border-radius: 12px; border: 1px solid #334155; overflow: hidden; padding: 32px; text-align: left;">
                        <!-- Header / Logo -->
                        <tr>
                            <td align="center" style="padding-bottom: 24px;">
                                <h1 style="margin: 0; font-size: 28px; font-weight: 800; color: #38bdf8; letter-spacing: -0.5px;">TMusic</h1>
                            </td>
                        </tr>
                        <!-- Content -->
                        <tr>
                            <td>
                                <h2 style="margin: 0 0 12px 0; font-size: 18px; font-weight: 600; color: #ffffff;">Verify Your Account ${username}</h2>
                                <p style="margin: 0 0 20px 0; font-size: 14px; line-height: 1.5; color: #94a3b8;">
                                    Please use the verification code below to complete your authentication request for TMusic:
                                </p>
                            </td>
                        </tr>
                        <!-- OTP Box -->
                        <tr>
                            <td align="center" style="padding: 10px 0 24px 0;">
                                <div style="background-color: #0f172a; border: 1px dashed #0284c7; border-radius: 8px; padding: 16px 24px; display: inline-block; letter-spacing: 6px; font-size: 28px; font-weight: 700; color: #38bdf8;">
                                    ${otp}
                                </div>
                            </td>
                        </tr>
                        <!-- Expiration Note -->
                        <tr>
                            <td>
                                <p style="margin: 0 0 20px 0; font-size: 13px; color: #f43f5e; font-weight: 500;">
                                    ⏱️ This OTP is valid for 10 minutes. Do not share this code with anyone.
                                </p>
                                <p style="margin: 0 0 24px 0; font-size: 13px; line-height: 1.5; color: #64748b;">
                                    If you did not request this code, you can safely ignore this email.
                                </p>
                            </td>
                        </tr>
                        <!-- Footer -->
                        <tr>
                            <td style="border-top: 1px solid #334155; padding-top: 20px; text-align: center;">
                                <p style="margin: 0; font-size: 12px; color: #64748b;">
                                    Regards,<br>
                                    <strong style="color: #94a3b8;">Team TMusic</strong>
                                </p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>`;

        await sendEmail(email, subject, html);
    } catch (err) {
        console.log("error while sending otp ", err);
    }
}


module.exports = { sendRegistrationEmail, sendEmailOTP };