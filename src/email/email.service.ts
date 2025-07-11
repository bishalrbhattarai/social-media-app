import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendVerificationEmail(to: string, token: string) {
    const url = `http://localhost:3000/verify-email?token=${token}`;

    await this.mailerService.sendMail({
      to,
      subject: 'Verify Your Email - Social-Media-App',
      html: `
      <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 40px;">
        <div style="max-width: 600px; margin: auto; background: white; border-radius: 8px; padding: 30px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);">
          <h2 style="color: #333;">👋 Welcome to <span style="color: #6366f1;">YourApp</span>!</h2>
          <p style="font-size: 16px; color: #555;">
            Thank you for signing up. To complete your registration, please verify your email address by clicking the button below.
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${url}" target="_blank" style="padding: 14px 24px; background-color: #6366f1; color: white; text-decoration: none; border-radius: 6px; font-weight: bold;">
              Verify My Email
            </a>
          </div>
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
  }
}
