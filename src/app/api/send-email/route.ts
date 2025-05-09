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
                          <p style="margin: 0 0 20px;">Hi ${templateData.name},</p>
                          <p style="margin: 0 0 20px;">Thanks for signing up! You can now share your personal referral link and invite others to experience Salt & Serenity.</p>
                          <div style="background-color: #f8f5f0; padding: 20px; border-radius: 8px; margin: 20px 0;">
                            <p style="margin: 0 0 10px; font-weight: bold;">Here's your link:</p>
                            <p style="margin: 0;">
                              <a href="${templateData.referralLink}" style="color: #2F4F4F; word-break: break-all; text-decoration: none; border-bottom: 1px solid #2F4F4F;">${templateData.referralLink}</a>
                            </p>
                          </div>
                          <p style="margin: 0 0 30px;">When someone signs up using your link, I'll send you a thank-you message. For now, mahalo for spreading the word!</p>
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
      },
      contact_referral: {
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
                          <p style="margin: 0 0 20px;">Hi ${templateData.name},</p>
                          <p style="margin: 0 0 20px;">Thanks so much for reaching out! I received your request and will be following up soon to help plan something special for you here on Kauai.</p>
                          <p style="margin: 0 0 20px;">I see that ${templateData.referrerName} shared Salt & Serenity with you — that's wonderful! We love building community through great food and memorable experiences, and I'm excited to help create something special for you.</p>
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
      },
      contact_no_referral: {
        subject: "Welcome to Salt and Serenity!",
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Welcome to Salt and Serenity</title>
            </head>
            <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f8f5f0;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
                <tr>
                  <td style="padding: 40px 30px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="text-align: center; padding-bottom: 30px;">
                          <h1 style="color: #2F4F4F; font-size: 28px; margin: 0; font-family: Georgia, serif;">Welcome to Salt and Serenity</h1>
                        </td>
                      </tr>
                      <tr>
                        <td style="color: #333333; font-size: 16px; line-height: 1.6;">
                          <p style="margin: 0 0 20px;">Hi ${templateData.name},</p>
                          <p style="margin: 0 0 20px;">Thanks for reaching out — we're so glad you found us!</p>
                          <p style="margin: 0 0 30px;">Salt and Serenity is all about creating unforgettable meals and meaningful moments. Whether you're hosting an intimate dinner or planning something bigger, we'll be in touch soon to start planning something special.</p>
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
      },
      referrer_notification: {
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
                          <p style="margin: 0 0 20px;">Hi ${templateData.referrerName},</p>
                          <p style="margin: 0 0 20px;">Exciting news — ${templateData.contactName} just reached out through your referral link!</p>
                          <p style="margin: 0 0 20px;">Thanks again for spreading the word. Every person you refer helps build a stronger Salt & Serenity community — and we'll make sure to show our appreciation.</p>
                          <p style="margin: 0 0 20px;">As a reminder, for each confirmed booking from your referrals, you'll earn $50. It's our way of saying mahalo for helping us grow our island table.</p>
                          <div style="background-color: #f8f5f0; padding: 20px; border-radius: 8px; margin: 20px 0;">
                            <p style="margin: 0 0 10px; font-weight: bold;">Keep sharing your link and helping create memorable meals on Kauai:</p>
                            <p style="margin: 0 0 10px; font-weight: bold;">🔗 Your link:</p>
                            <p style="margin: 0;">
                              <a href="${templateData.referralLink}" style="color: #2F4F4F; word-break: break-all; text-decoration: none; border-bottom: 1px solid #2F4F4F;">${templateData.referralLink}</a>
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