import { NextResponse } from 'next/server';
import Airtable from 'airtable';

// Email validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  try {
    const { name, email, message, referrerId } = await request.json();

    // Validate inputs
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required' },
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
    const table = base('Contacts');

    const record = await table.create({
      'Full Name': name,
      'Email': email,
      'Message': message,
      'Referrer': referrerId ? [referrerId] : [],
      'Environment': process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    });

    // Send confirmation email
    try {
      console.log('Attempting to send email to:', email);
      const response = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'api-key': process.env.BREVO_API_KEY || '',
        },
        body: JSON.stringify({
          sender: {
            name: 'Salt & Serenity',
            email: 'hello@salt-and-serenity.com'
          },
          to: [{
            email: email
          }],
          subject: "Welcome to Salt & Serenity 🌴",
          htmlContent: `
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
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to send email');
      }

      const emailData = await response.json();
      console.log('Email sent successfully:', emailData);
    } catch (emailError) {
      console.error('Error sending email:', emailError);
      // Continue with the response even if email fails
    }

    // If there's a referrer, send them a notification
    if (referrerId) {
      try {
        const referrerRecord = await base('Referrers').find(referrerId);
        const referrerName = referrerRecord.get('Full Name');
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://salt-and-serenity.com';
        const referralUrl = `${baseUrl}/contact?ref=${referrerId}`;

        console.log('Sending notification to referrer:', referrerRecord.get('Email'));
        const response = await fetch('https://api.brevo.com/v3/smtp/email', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'api-key': process.env.BREVO_API_KEY || '',
          },
          body: JSON.stringify({
            sender: {
              name: 'Salt & Serenity',
              email: 'hello@salt-and-serenity.com'
            },
            to: [{
              email: referrerRecord.get('Email') as string
            }],
            subject: '🌟 Someone joined thanks to you!',
            htmlContent: `
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
          })
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || 'Failed to send email');
        }

        const emailData = await response.json();
        console.log('Referrer notification sent successfully:', emailData);
      } catch (referrerEmailError) {
        console.error('Error sending referrer notification:', referrerEmailError);
        // Continue with the response even if referrer notification fails
      }
    }

    return NextResponse.json({
      id: record.id,
      name: record.get('Full Name'),
      email: record.get('Email'),
      message: record.get('Message'),
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