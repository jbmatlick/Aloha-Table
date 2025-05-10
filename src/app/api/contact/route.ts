import { NextResponse } from 'next/server';
import Airtable from 'airtable';
import nodemailer from 'nodemailer';

// Email validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  try {
    // Debug environment variables
    console.log('Environment check:');
    console.log('BREVO_API_KEY exists:', !!process.env.BREVO_API_KEY);
    console.log('BREVO_API_KEY length:', process.env.BREVO_API_KEY?.length);
    console.log('BREVO_API_KEY first 10 chars:', process.env.BREVO_API_KEY?.substring(0, 10));
    console.log('NEXT_PUBLIC_BASE_URL:', process.env.NEXT_PUBLIC_BASE_URL);
    console.log('AIRTABLE_API_KEY exists:', !!process.env.AIRTABLE_API_KEY);
    console.log('AIRTABLE_BASE_ID exists:', !!process.env.AIRTABLE_BASE_ID);

    const { 
      name, 
      email, 
      phone,
      preferredDate,
      contactMethod,
      message,
      referrerId,
      referrerName,
      adults,
      children 
    } = await request.json();

    // Validate inputs
    if (!name || !email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      );
    }

    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    if (!process.env.AIRTABLE_API_KEY || !process.env.AIRTABLE_BASE_ID) {
      throw new Error('Airtable configuration is missing');
    }

    const airtable = new Airtable({
      apiKey: process.env.AIRTABLE_API_KEY
    });

    const base = airtable.base(process.env.AIRTABLE_BASE_ID);
    const table = base('Leads');

    const record = await table.create({
      'Full Name': name,
      'Email': email,
      'Phone': phone || '',
      'Preferred Date': preferredDate || '',
      'Contact Method': contactMethod || '',
      'Additional Details': message || '',
      'Referrer': referrerId ? [referrerId] : [],
      'Environment': process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',
      'Number of Adults': parseInt(adults) || 0,
      'Number of Children': parseInt(children) || 0,
      'Status': 'New'
    });

    // Send confirmation email
    try {
      if (!process.env.BREVO_API_KEY) {
        throw new Error('BREVO_API_KEY is not configured');
      }

      // Create SMTP transporter
      const transporter = nodemailer.createTransport({
        host: 'smtp-relay.brevo.com',
        port: 587,
        secure: false,
        auth: {
          user: 'hello@salt-and-serenity.com',
          pass: process.env.BREVO_API_KEY
        },
        debug: true, // Enable debug logging
        logger: true // Enable logger
      });

      console.log('Attempting to send email to:', email);
      console.log('SMTP Configuration:', {
        host: 'smtp-relay.brevo.com',
        port: 587,
        secure: false,
        user: 'hello@salt-and-serenity.com',
        passLength: process.env.BREVO_API_KEY?.length
      });
      
      // Send welcome email
      await transporter.sendMail({
        from: {
          name: 'Salt & Serenity',
          address: 'hello@salt-and-serenity.com'
        },
        to: email,
        subject: "Welcome to Salt & Serenity 🌴",
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Welcome to Salt & Serenity</title>
            </head>
            <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f8f5f0;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
                <tr>
                  <td style="padding: 40px 30px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="text-align: center; padding-bottom: 30px;">
                          <h1 style="color: #2F4F4F; font-size: 28px; margin: 0; font-family: Georgia, serif;">Welcome to Salt & Serenity 🌴</h1>
                        </td>
                      </tr>
                      <tr>
                        <td style="color: #333333; font-size: 16px; line-height: 1.6;">
                          <p style="margin: 0 0 20px;">Hi ${name},</p>
                          <p style="margin: 0 0 20px;">Thanks so much for reaching out! I received your request and will be following up soon to help plan something special for you here on Kauai.</p>
                          <p style="margin: 0 0 20px;">I see that ${referrerId ? 'someone' : 'you'} shared Salt & Serenity with you — that's wonderful! We love building community through great food and memorable experiences, and I'm excited to help create something special for you.</p>
                          <p style="margin: 0 0 30px;">I'll be in touch soon to discuss your event and answer any questions you might have.</p>
                          <p style="margin: 0; color: #2F4F4F; font-style: italic;">Warmly,<br>Iris<br>Salt & Serenity</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="background-color: #f8f5f0; padding: 20px 30px; text-align: center; font-size: 12px; color: #666666;">
                    <p style="margin: 0;">© ${new Date().getFullYear()} Salt and Serenity. All rights reserved.</p>
                  </td>
                </tr>
              </table>
            </body>
          </html>
        `
      });

      console.log('Welcome email sent successfully');

      // If there's a referrer, send them a notification
      if (referrerId) {
        const referrerRecord = await base('Referrers').find(referrerId);
        const referrerName = referrerRecord.get('Full Name');
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://salt-and-serenity.com';
        const referralUrl = `${baseUrl}/contact?ref=${referrerId}`;

        console.log('Sending notification to referrer:', referrerRecord.get('Email'));
        
        await transporter.sendMail({
          from: {
            name: 'Salt & Serenity',
            address: 'hello@salt-and-serenity.com'
          },
          to: referrerRecord.get('Email') as string,
          subject: '🌟 Someone joined thanks to you!',
          html: `
            <!DOCTYPE html>
            <html>
              <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>New Referral</title>
              </head>
              <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f8f5f0;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
                  <tr>
                    <td style="padding: 40px 30px;">
                      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                          <td style="text-align: center; padding-bottom: 30px;">
                            <h1 style="color: #2F4F4F; font-size: 28px; margin: 0; font-family: Georgia, serif;">🌟 Someone joined thanks to you!</h1>
                          </td>
                        </tr>
                        <tr>
                          <td style="color: #333333; font-size: 16px; line-height: 1.6;">
                            <p style="margin: 0 0 20px;">Hi ${referrerName},</p>
                            <p style="margin: 0 0 20px;">Exciting news — ${name} just reached out through your referral link!</p>
                            <p style="margin: 0 0 20px;">Thanks again for spreading the word. Every person you refer helps build a stronger Salt & Serenity community — and we'll make sure to show our appreciation.</p>
                            <p style="margin: 0 0 20px;">As a reminder, for each confirmed booking from your referrals, you'll earn $50. It's our way of saying mahalo for helping us grow our island table.</p>
                            <div style="background-color: #f8f5f0; padding: 20px; border-radius: 8px; margin: 20px 0;">
                              <p style="margin: 0 0 10px; font-weight: bold;">Keep sharing your link and helping create memorable meals on Kauai:</p>
                              <p style="margin: 0 0 10px; font-weight: bold;">🔗 Your link:</p>
                              <p style="margin: 0;">
                                <a href="${referralUrl}" style="color: #2F4F4F; word-break: break-all; text-decoration: none; border-bottom: 1px solid #2F4F4F;">${referralUrl}</a>
                              </p>
                            </div>
                            <p style="margin: 0; color: #2F4F4F; font-style: italic;">Gratefully,<br>Iris<br>Salt & Serenity</p>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td style="background-color: #f8f5f0; padding: 20px 30px; text-align: center; font-size: 12px; color: #666666;">
                      <p style="margin: 0;">© ${new Date().getFullYear()} Salt and Serenity. All rights reserved.</p>
                    </td>
                  </tr>
                </table>
              </body>
            </html>
          `
        });

        console.log('Referrer notification sent successfully');
      }
    } catch (emailError) {
      console.error('Error sending email:', emailError);
      return NextResponse.json(
        { error: 'Failed to send email', details: emailError instanceof Error ? emailError.message : 'Unknown error' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      id: record.id,
      name: record.get('Full Name'),
      email: record.get('Email'),
      message: record.get('Additional Details'),
      referrerId: referrerId || null
    });
  } catch (error) {
    console.error('Error creating contact:', error);
    return NextResponse.json(
      { error: 'Failed to create contact', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 