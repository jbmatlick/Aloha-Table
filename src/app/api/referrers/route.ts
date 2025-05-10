import { NextResponse } from 'next/server';
import Airtable from 'airtable';

// Email validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  try {
    const { name, email } = await request.json();

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
    const table = base('Referrers');

    const record = await table.create({
      'Full Name': name,
      'Email': email,
      'Environment': process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    });

    // Create the referral link using production URL
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://salt-and-serenity.com';
    const referralUrl = `${baseUrl}/contact?ref=${record.id}`;

    // Send welcome email with referral link
    try {
      if (!process.env.BREVO_API_KEY) {
        console.error('BREVO_API_KEY is missing');
        throw new Error('BREVO_API_KEY is not configured');
      }

      console.log('Attempting to send email to:', email);
      console.log('Using Brevo API key:', process.env.BREVO_API_KEY.substring(0, 5) + '...');
      
      const response = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'api-key': process.env.BREVO_API_KEY,
        },
        body: JSON.stringify({
          sender: {
            name: 'Salt & Serenity',
            email: 'hello@salt-and-serenity.com'
          },
          to: [{
            email: email
          }],
          subject: "You're in! Let's get cooking 🌺",
          htmlContent: `
            <!DOCTYPE html>
            <html>
              <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Welcome to the Referral Program</title>
              </head>
              <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f8f5f0;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
                  <tr>
                    <td style="padding: 40px 30px;">
                      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                          <td style="text-align: center; padding-bottom: 30px;">
                            <h1 style="color: #2F4F4F; font-size: 28px; margin: 0; font-family: Georgia, serif;">You're in! Let's get cooking 🌺</h1>
                          </td>
                        </tr>
                        <tr>
                          <td style="color: #333333; font-size: 16px; line-height: 1.6;">
                            <p style="margin: 0 0 20px;">Hi ${name},</p>
                            <p style="margin: 0 0 20px;">Thanks for joining our referral program — we're so glad to have you on board!</p>
                            <p style="margin: 0 0 20px;">Salt & Serenity is all about creating unforgettable island experiences around food and community. By sharing your personal link, you're helping bring more amazing people to the table — and you'll be rewarded for it.</p>
                            <p style="margin: 0 0 20px;">Whenever someone books an event through your link, you'll earn $50 as a thank you. Simple as that.</p>
                            <div style="background-color: #f8f5f0; padding: 20px; border-radius: 8px; margin: 20px 0;">
                              <p style="margin: 0 0 10px; font-weight: bold;">Here's your personal link to share:</p>
                              <p style="margin: 0;">
                                🔗 <a href="${referralUrl}" style="color: #2F4F4F; word-break: break-all; text-decoration: none; border-bottom: 1px solid #2F4F4F;">${referralUrl}</a>
                              </p>
                            </div>
                            <p style="margin: 0 0 30px;">We'll notify you each time someone signs up through it. Thanks again for helping us grow our ohana.</p>
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
        console.error('Brevo API error details:', error);
        throw new Error(`Failed to send email: ${error.message || 'Unknown error'}`);
      }

      const emailData = await response.json();
      console.log('Email sent successfully:', emailData);
    } catch (emailError) {
      console.error('Error sending email:', emailError);
      // Return error response instead of continuing silently
      return NextResponse.json(
        { error: 'Failed to send email', details: emailError instanceof Error ? emailError.message : 'Unknown error' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      id: record.id,
      name: record.get('Full Name'),
      email: record.get('Email'),
      referralUrl
    });
  } catch (error) {
    console.error('Error creating referrer:', error);
    return NextResponse.json(
      { error: 'Failed to create referrer', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 