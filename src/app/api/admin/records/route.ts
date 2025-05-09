import { NextResponse } from 'next/server';
import Airtable from 'airtable';

// Initialize Airtable
const airtable = new Airtable({
  apiKey: process.env.AIRTABLE_API_KEY
});

const base = airtable.base(process.env.AIRTABLE_BASE_ID!);
const tableName = process.env.AIRTABLE_TABLE_NAME || 'Contact Submissions';

export async function GET(request: Request) {
  try {
    // Log environment variables (without sensitive data)
    console.log('Airtable Base ID:', process.env.AIRTABLE_BASE_ID ? 'Set' : 'Not Set');
    console.log('Airtable Table Name:', process.env.AIRTABLE_TABLE_NAME || 'Using default');
    console.log('Airtable API Key:', process.env.AIRTABLE_API_KEY ? 'Set' : 'Not Set');

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = 50;
    const offset = (page - 1) * pageSize;

    // Get total count from Airtable
    const allRecords = await base(tableName)
      .select()
      .all();
    
    const total = allRecords.length;
    console.log('Total records found:', total);

    // Then fetch the paginated records
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
  } catch (error) {
    // Enhanced error logging
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : 'Unknown error type'
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