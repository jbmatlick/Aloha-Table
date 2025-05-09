import { NextResponse } from 'next/server';
import Airtable from 'airtable';

// Initialize Airtable
const airtable = new Airtable({
  apiKey: process.env.AIRTABLE_API_KEY
});

const base = airtable.base(process.env.AIRTABLE_BASE_ID!);
const tableName = process.env.AIRTABLE_TABLE_NAME || 'Contact Submissions';

interface ContactFields {
  'Full Name': string;
  'Email': string;
  'Phone': string;
  'Number of Adults': number | null;
  'Number of Children': number | null;
  'Preferred Date': string;
  'Contact Method': string;
  'Additional Details': string;
  'Status': string;
  'Created At': string;
}

export async function POST(request: Request) {
  try {
    const { fullName, email, phone, adults, children, preferredDate, details, preferredContact } = await request.json();

    // Create a record in Airtable
    const record = await base(tableName).create({
      'Full Name': fullName || '',
      'Email': email || '',
      'Phone': phone || '',
      'Number of Adults': adults ? Number(adults) : null,
      'Number of Children': children ? Number(children) : null,
      'Preferred Date': preferredDate || '',
      'Contact Method': preferredContact === 'Text Me' ? 'Text Me' : preferredContact === 'Call Me' ? 'Call Me' : 'Email Me',
      'Additional Details': details || '',
      'Status': 'New'
    });

    return NextResponse.json({ success: true, record });
  } catch (error) {
    console.error('Error creating Airtable record:', error);
    return NextResponse.json(
      { error: 'Failed to create record' },
      { status: 500 }
    );
  }
} 