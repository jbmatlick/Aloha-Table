import { NextResponse } from 'next/server';
import Airtable from 'airtable';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    if (!process.env.AIRTABLE_API_KEY || !process.env.AIRTABLE_BASE_ID) {
      throw new Error('Airtable configuration is missing');
    }

    const airtable = new Airtable({
      apiKey: process.env.AIRTABLE_API_KEY
    });

    const base = airtable.base(process.env.AIRTABLE_BASE_ID);
    const table = base('Referrers');

    const record = await table.find(params.id);

    return NextResponse.json({
      id: record.id,
      name: record.get('Full Name'),
      email: record.get('Email')
    });
  } catch (error) {
    console.error('Error fetching referrer:', error);
    return NextResponse.json(
      { error: 'Failed to fetch referrer', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 