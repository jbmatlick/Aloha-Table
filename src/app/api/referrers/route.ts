import { NextResponse } from 'next/server';
import Airtable from 'airtable';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

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
      'Email': email
    });

    // Create the referral link using production URL
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://salt-and-serenity.com';
    const referralUrl = `${baseUrl}/contact?ref=${record.id}`;

    // Send welcome email with referral link
    try {
      console.log('Attempting to send email to:', email);
      const emailData = await resend.emails.send({
        from: 'Iris <iris@salt-and-serenity.com>',
        to: email,
        subject: "You're in! Let's get cooking 🌺",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
            <p>Hi ${name},</p>
            <p>Thanks for signing up! You can now share your personal referral link and invite others to experience Salt & Serenity.</p>
            <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <p style="margin: 0;">Here's your link:</p>
              <p style="margin: 10px 0 0 0;">👉 <a href="${referralUrl}" style="color: #2F4F4F; word-break: break-all;">${referralUrl}</a></p>
            </div>
            <p>When someone signs up using your link, I'll send you a thank-you message. For now, mahalo for spreading the word!</p>
            <p>Warmly,<br>Iris<br>Salt & Serenity</p>
          </div>
        `
      });

      console.log('Email sent successfully:', emailData);
    } catch (emailError) {
      console.error('Error sending email:', emailError);
      // Continue with the response even if email fails
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