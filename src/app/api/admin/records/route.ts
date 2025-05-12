import { NextResponse } from 'next/server';
import Airtable from 'airtable';
import { getSession } from '@auth0/nextjs-auth0';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    // Check authentication using Auth0 session
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Log environment variables (without sensitive data)
    console.log('Environment check:', {
      hasApiKey: !!process.env.AIRTABLE_API_KEY,
      hasBaseId: !!process.env.AIRTABLE_BASE_ID,
      tableName: 'Leads',
      baseId: process.env.AIRTABLE_BASE_ID
    });

    if (!process.env.AIRTABLE_API_KEY) {
      throw new Error('AIRTABLE_API_KEY is not set');
    }
    if (!process.env.AIRTABLE_BASE_ID) {
      throw new Error('AIRTABLE_BASE_ID is not set');
    }

    // Initialize Airtable with error handling
    let airtable;
    try {
      airtable = new Airtable({
        apiKey: process.env.AIRTABLE_API_KEY
      });
      console.log('Airtable initialized successfully');
    } catch (initError) {
      console.error('Failed to initialize Airtable:', initError);
      throw new Error(`Airtable initialization failed: ${initError instanceof Error ? initError.message : 'Unknown error'}`);
    }

    const base = airtable.base(process.env.AIRTABLE_BASE_ID);
    const tableName = 'Leads';
    console.log('Attempting to access table:', tableName);

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = 50;
    const offset = (page - 1) * pageSize;

    // Get total count from Airtable
    console.log('Fetching all records for count...');
    const countQuery = await base(tableName).select().all();
    const total = countQuery.length;

    // Get paginated records
    const records = await base(tableName)
      .select({
        maxRecords: pageSize,
        offset: offset,
        sort: [{ field: 'Created At', direction: 'desc' }]
      })
      .all();

    const formattedRecords = records.map(record => ({
      id: record.id,
      fields: {
        'Full Name': record.get('Full Name') || '',
        'Email': record.get('Email') || '',
        'Phone': record.get('Phone') || '',
        'Preferred Date': record.get('Preferred Date') || '',
        'Contact Method': record.get('Contact Method') || '',
        'Additional Details': record.get('Additional Details') || '',
        'Status': record.get('Status') || 'New'
      }
    }));

    return NextResponse.json({
      records: formattedRecords,
      total,
      page,
      pageSize
    });
  } catch (error) {
    console.error('Error fetching records:', error);
    return NextResponse.json(
      { error: 'Failed to fetch records', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 