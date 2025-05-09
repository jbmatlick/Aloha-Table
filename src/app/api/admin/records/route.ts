import { NextResponse } from 'next/server';
import Airtable from 'airtable';

// Initialize Airtable
const airtable = new Airtable({
  apiKey: process.env.AIRTABLE_API_KEY
});

const base = airtable.base(process.env.AIRTABLE_BASE_ID!);
const tableName = process.env.AIRTABLE_TABLE_NAME || 'Contact Submissions';

export async function GET() {
  try {
    // Fetch the 10 most recent records
    const records = await base(tableName)
      .select({
        maxRecords: 10,
        sort: [{ field: 'Created At', direction: 'desc' }]
      })
      .all();

    return NextResponse.json({ records });
  } catch (error) {
    console.error('Error fetching Airtable records:', error);
    return NextResponse.json(
      { error: 'Failed to fetch records' },
      { status: 500 }
    );
  }
} 