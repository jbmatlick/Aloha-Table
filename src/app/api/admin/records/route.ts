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

    console.log('Records fetched:', records.length);

    return NextResponse.json({ 
      records,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize)
    });
  } catch (error) {
    // Log the full error
    console.error('Detailed error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch records', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 