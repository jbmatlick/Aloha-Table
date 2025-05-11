import { NextResponse } from 'next/server';
import Airtable from 'airtable';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    // Check authentication
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const token = authHeader.split(' ')[1];
    if (token !== 'dummy-token') {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    if (!process.env.AIRTABLE_API_KEY) {
      throw new Error('AIRTABLE_API_KEY is not set');
    }
    if (!process.env.AIRTABLE_BASE_ID) {
      throw new Error('AIRTABLE_BASE_ID is not set');
    }

    const airtable = new Airtable({
      apiKey: process.env.AIRTABLE_API_KEY
    });
    const base = airtable.base(process.env.AIRTABLE_BASE_ID);
    const tableName = 'Referrers';

    // Fetch all referrers
    const records = await base(tableName).select().all();
    const referrers = records.map(record => ({
      id: record.id,
      fields: {
        'Full Name': record.get('Full Name') || '',
        'Email': record.get('Email') || '',
        'Referrals Count': record.get('Referrals Count') || 0,
      }
    }));

    return NextResponse.json({ referrers });
  } catch (error) {
    console.error('Error fetching referrers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch referrers', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 