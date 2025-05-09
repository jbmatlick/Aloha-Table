import { NextResponse } from 'next/server';
import Airtable from 'airtable';

// Initialize Airtable
const airtable = new Airtable({
  apiKey: process.env.AIRTABLE_API_KEY
});

const base = airtable.base(process.env.AIRTABLE_BASE_ID!);
const tableName = process.env.AIRTABLE_TABLE_NAME || 'Leads';

export async function POST(request: Request) {
  try {
    const { fullName, email, phone, adults, children, preferredDate, details, preferredContact } = await request.json();

    // Create a record in Airtable
    const record = await base(tableName).create([
      {
        fields: {
          'Full Name': fullName || '',
          'Email': email || '',
          'Phone': phone || '',
          'Number of Adults': adults ? parseInt(adults) : 0,
          'Number of Children': children ? parseInt(children) : 0,
          'Preferred Date': preferredDate || '',
          'Contact Method': preferredContact === 'Text Me' ? 'Text Me' : preferredContact === 'Call Me' ? 'Call Me' : 'Email Me',
          'Additional Details': details || '',
          'Status': 'New'
        }
      }
    ]);

    return NextResponse.json({ success: true, record });
  } catch (error) {
    console.error('Error creating Airtable record:', error);
    return NextResponse.json(
      { error: 'Failed to create record' },
      { status: 500 }
    );
  }
} 