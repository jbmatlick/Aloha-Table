import { NextResponse } from 'next/server';
import Airtable from 'airtable';

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
    try {
      const allRecords = await base(tableName)
        .select()
        .all();
      
      const total = allRecords.length;
      console.log('Total records found:', total);

      // Then fetch the paginated records
      console.log('Fetching paginated records...');
      const records = await base(tableName)
        .select({
          maxRecords: pageSize,
          sort: [{ field: 'Created At', direction: 'desc' }],
          offset: offset
        })
        .all();

      // Transform the records to match the expected format
      const formattedRecords = records.map(record => ({
        id: record.id,
        fields: {
          'Full Name': record.get('Full Name') || '',
          'Email': record.get('Email') || '',
          'Preferred Date': record.get('Preferred Date') || '',
          'Contact Method': record.get('Contact Method') || '',
          'Created At': record.get('Created At') || new Date().toISOString()
        }
      }));

      console.log('Records fetched:', formattedRecords.length);

      return NextResponse.json({ 
        records: formattedRecords,
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize)
      });
    } catch (airtableError) {
      console.error('Airtable query error:', {
        error: airtableError,
        message: airtableError instanceof Error ? airtableError.message : 'Unknown error',
        stack: airtableError instanceof Error ? airtableError.stack : undefined
      });
      throw airtableError;
    }
  } catch (error) {
    // Enhanced error logging
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : 'Unknown error type',
      error: error // Log the full error object
    });
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch records', 
        details: error instanceof Error ? error.message : 'Unknown error',
        type: error instanceof Error ? error.name : 'Unknown error type'
      },
      { status: 500 }
    );
  }
} 