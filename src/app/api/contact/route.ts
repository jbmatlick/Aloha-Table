import { NextResponse } from 'next/server';
import Airtable from 'airtable';

export async function POST(request: Request) {
  try {
    const { name, email, phone, preferredDate, contactMethod, message, referrerId, referrerName, adults, children } = await request.json();

    if (!name || !email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
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

    // If there's a referrer, get their details
    let referrerEmail = '';
    if (referrerId) {
      const referrerTable = base('Referrers');
      const referrer = await referrerTable.find(referrerId);
      referrerEmail = referrer.get('Email') as string;
    }

    const record = await table.create({
      'Full Name': name,
      'Email': email,
      'Phone': phone || '',
      'Preferred Date': preferredDate || '',
      'Contact Method': contactMethod,
      'Additional Details': message || '',
      'Referrer': referrerId ? [referrerId] : [],
      'Environment': process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',
      'Number of Adults': parseInt(adults) || 0,
      'Number of Children': parseInt(children) || 0,
      'Status': 'New'
    });

    // Use production URL
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://salt-and-serenity.com';

    // Send welcome email to the contact
    const contactEmailResponse = await fetch(`${baseUrl}/api/send-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: email,
        template: referrerId ? 'contact_referral' : 'contact_no_referral',
        data: {
          name,
          referrerName
        }
      }),
    });

    if (!contactEmailResponse.ok) {
      console.error('Failed to send contact welcome email:', await contactEmailResponse.text());
    }

    // If there's a referrer, send them a notification
    if (referrerId && referrerEmail) {
      const referrerEmailResponse = await fetch(`${baseUrl}/api/send-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: referrerEmail,
          template: 'referrer_notification',
          data: {
            referrerName,
            contactName: name
          }
        }),
      });

      if (!referrerEmailResponse.ok) {
        console.error('Failed to send referrer notification:', await referrerEmailResponse.text());
      }
    }

    return NextResponse.json({
      id: record.id,
      name: record.get('Full Name'),
      email: record.get('Email')
    });
  } catch (error) {
    console.error('Error creating contact:', error);
    return NextResponse.json(
      { error: 'Failed to submit contact form' },
      { status: 500 }
    );
  }
} 