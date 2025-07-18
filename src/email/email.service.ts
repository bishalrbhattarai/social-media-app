import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendPasswordResetEmail(to: string, token: string) {
    const url = `http://localhost:3000/reset-password?token=${token}`;

    console.log(`Sending password reset email to: ${to} with token: ${token}`);
    try {
      await this.mailerService.sendMail({
        to,
        subject: 'Reset Your Password - Social-Media-App',
        html: `
          <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 40px;">
            <div style="max-width: 600px; margin: auto; background: white; border-radius: 8px; padding: 30px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);">
              <h2 style="color: #333;">🔒 Password Reset Request</h2>
              <p style="font-size: 16px; color: #555;">
                We received a request to reset your password. Click the button below to reset it:
              </p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${url}" target="_blank" style="padding: 14px 24px; background-color: #6366f1; color: white; text-decoration: none; border-radius: 6px; font-weight: bold;">
                  Reset My Password
                </a>
              </div>
              <p style="font-size: 14px; color: #555;">
                If the button above doesn’t work, copy and paste this link into your browser:
                <br />
                <a href="${url}" target="_blank" style="color:#6366f1;">${url}</a>
              </p>
              <p style="font-size: 14px; color: #555;">
                <strong>Your reset token:</strong>
                <code style="background:#f3f3f3; padding:4px 8px; border-radius:4px; display:inline-block; margin-top:6px;">${token}</code>
              </p>
              <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;" />
              <p style="font-size: 12px; color: #bbb; text-align: center;">
                &copy; ${new Date().getFullYear()} YourApp. All rights reserved.
              </p>
            </div>
          </div>
        `,
      });

      console.log('Password reset email sent successfully.');
    } catch (error) {
      console.log(error);
    }
  }

  async sendVerificationEmail(to: string, token: string) {
    const url = `http://localhost:3000/verify-email?token=${token}`;

    console.log(`inside the main service: ${to} and ${token}`);
    try {
      await this.mailerService.sendMail({
        to,
        subject: 'Verify Your Email - Social-Media-App',
        html: `
          <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 40px;">
            <div style="max-width: 600px; margin: auto; background: white; border-radius: 8px; padding: 30px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);">
              <h2 style="color: #333;">👋 Welcome to <span style="color: #6366f1;">YourApp</span>!</h2>
              <p style="font-size: 16px; color: #555;">
                Thank you for signing up. To complete your registration, please verify your email address by clicking the button below
                <strong>or</strong> manually copy the token provided below:
              </p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${url}" target="_blank" style="padding: 14px 24px; background-color: #6366f1; color: white; text-decoration: none; border-radius: 6px; font-weight: bold;">
                  Verify My Email
                </a>
              </div>
              <p style="font-size: 14px; color: #333; margin-top: 20px;">
                📌 Your verification token:<br />
                <code style="background: #f3f3f3; padding: 8px 12px; border-radius: 4px; display: inline-block;">${token}</code>
              </p>
              <p style="font-size: 14px; color: #999;">
                If you didn't sign up for YourApp, you can safely ignore this email.
              </p>
              <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;" />
              <p style="font-size: 12px; color: #bbb; text-align: center;">
                &copy; ${new Date().getFullYear()} YourApp. All rights reserved.
              </p>
            </div>
          </div>
        `,
      });

      console.log('finally done sending the email');
    } catch (error) {
      console.log(error);
    }
  }
}
