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
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = 50;
    const offset = (page - 1) * pageSize;

    // First, get the total count
    const countResult = await base(tableName)
      .select({
        maxRecords: 1,
        fields: ['Created At']
      })
      .all();

    const total = countResult.length > 0 ? countResult[0]._rawJson.fields['Created At'] : 0;

    // Then fetch the paginated records
    const records = await base(tableName)
      .select({
        maxRecords: pageSize,
        sort: [{ field: 'Created At', direction: 'desc' }],
        offset: offset
      })
      .all();

    return NextResponse.json({ 
      records,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize)
    });
  } catch (error) {
    console.error('Error fetching Airtable records:', error);
    return NextResponse.json(
      { error: 'Failed to fetch records' },
      { status: 500 }
    );
  }
} 