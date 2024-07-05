import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { Twilio } from 'twilio';

@Injectable()
export class NotificationService {
  private transporter: nodemailer.Transporter;
  private twilioClient: Twilio;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('SMTP_HOST'),
      port: this.configService.get<number>('SMTP_PORT'),
      secure: false,
      auth: {
        user: this.configService.get<string>('SMTP_USER'),
        pass: this.configService.get<string>('SMTP_PASS'),
      },
    });

    this.twilioClient = new Twilio(
      this.configService.get<string>('TWILIO_ACCOUNT_SID'),
      this.configService.get<string>('TWILIO_AUTH_TOKEN'),
    );
  }

  async sendEmail(to: string, subject: string, text: string, html?: string) {
    const mailOptions = {
      from: this.configService.get<string>('SMTP_USER'),
      to,
      subject,
      text,
      html,
    };

    await this.transporter.sendMail(mailOptions);
  }

  async sendSms(to: string, body: string) {
    await this.twilioClient.messages.create({
      body,
      from: this.configService.get<string>('TWILIO_PHONE_NUMBER'),
      to,
    });
  }

  async sendBookingConfirmationEmail(userEmail: string, bookingDetails: any) {
    const subject = 'Booking Confirmation';
    const text = `Your booking is confirmed. Booking details: ${JSON.stringify(bookingDetails)}`;
    await this.sendEmail(userEmail, subject, text);
  }

  async sendBookingConfirmationSms(userPhone: string, bookingDetails: any) {
    const body = `Your booking is confirmed. Booking details: ${JSON.stringify(bookingDetails)}`;
    await this.sendSms(userPhone, body);
  }

  // Add more methods for other types of notifications as needed
}
