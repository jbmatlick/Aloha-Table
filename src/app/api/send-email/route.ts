import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

type EmailTemplate = 'referrer_signup' | 'contact_referral' | 'referrer_notification' | 'contact_no_referral';

export async function POST(request: Request) {
  try {
    const { to, template, data: templateData } = await request.json();

    if (!to || !template || !templateData) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const templates = {
      referrer_signup: {
        subject: "You're in! Let's get cooking 🌺",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
            <p>Hi ${templateData.name},</p>
            <p>Thanks for signing up! You can now share your personal referral link and invite others to experience Salt & Serenity.</p>
            <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <p style="margin: 0;">Here's your link:</p>
              <p style="margin: 10px 0 0 0;">👉 <a href="${templateData.referralLink}" style="color: #2F4F4F; word-break: break-all;">${templateData.referralLink}</a></p>
            </div>
            <p>When someone signs up using your link, I'll send you a thank-you message. For now, mahalo for spreading the word!</p>
            <p>Warmly,<br>Iris<br>Salt & Serenity</p>
          </div>
        `
      },
      contact_referral: {
        subject: "Welcome to Salt & Serenity 🌴",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
            <p>Hi ${templateData.name},</p>
            <p>Thanks for your interest! I received your request and will follow up soon to plan something special for you here on Kauai.</p>
            <p>By the way, it looks like you heard about us from someone in our community — we love that!</p>
            <p>More soon,<br>Iris<br>Salt & Serenity</p>
          </div>
        `
      },
      contact_no_referral: {
        subject: "Thanks for reaching out 🌺",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
            <p>Hi ${templateData.name},</p>
            <p>I received your request and I'm excited to hear more about what you're looking for!</p>
            <p>Whether it's a cocktail gathering, a private dinner, or fresh meals for the week — Salt & Serenity is about bringing beautiful food to relaxed, joyful settings.</p>
            <p>I'll follow up soon with more details and availability.</p>
            <p>Mahalo,<br>Iris<br>Salt & Serenity</p>
          </div>
        `
      },
      referrer_notification: {
        subject: "🌟 Someone joined thanks to you!",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
            <p>Hi ${templateData.referrerName},</p>
            <p>Just a heads up — ${templateData.contactName} just submitted a request through your referral link! 🤍</p>
            <p>Thanks again for sharing Salt & Serenity with your friends. You're helping us grow our island table, one guest at a time.</p>
            <p>Gratefully,<br>Iris<br>Salt & Serenity</p>
          </div>
        `
      }
    };

    const selectedTemplate = templates[template as EmailTemplate];
    if (!selectedTemplate) {
      return NextResponse.json(
        { error: 'Invalid template' },
        { status: 400 }
      );
    }

    console.log('Sending email to:', to);
    console.log('Using template:', template);
    console.log('With data:', templateData);

    const emailData = await resend.emails.send({
      from: 'Iris <iris@salt-and-serenity.com>',
      to,
      subject: selectedTemplate.subject,
      html: selectedTemplate.html,
    });

    console.log('Email sent successfully:', emailData);
    return NextResponse.json(emailData);
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { error: 'Failed to send email', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 