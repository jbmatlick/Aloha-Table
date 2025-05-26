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

    if (!process.env.AIRTABLE_API_KEY || !process.env.AIRTABLE_BASE_ID) {
      throw new Error('Airtable configuration is missing');
    }

    const airtable = new Airtable({
      apiKey: process.env.AIRTABLE_API_KEY
    });

    const base = airtable.base(process.env.AIRTABLE_BASE_ID);
    const tableName = 'Events';

    // Get the leadId from query params if providedd
    const { searchParams } = new URL(request.url);
    const leadId = searchParams.get('leadId');

    // Build the query
    let query = base(tableName).select({
      sort: [{ field: 'Date of Event', direction: 'desc' }],
      filterByFormula: leadId ? `{Lead} = '${leadId}'` : undefined
    });

    const records = await query.all();
    const events = records.map(record => ({
      id: record.id,
      fields: {
        'Type of Event': record.get('Type of Event') || '',
        'Number of Adults': record.get('Number of Adults') || 0,
        'Number of Children': record.get('Number of Children') || 0,
        'Date of Event': record.get('Date of Event') || '',
        'Status': record.get('Status') || 'New',
        'Notes': record.get('Notes') || '',
        'Lead': record.get('Lead') || [],
      }
    }));

    return NextResponse.json({ events });
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json(
      { error: 'Failed to fetch events', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    // Check authentication using Auth0 session
    const session = await getSession();
    if (!session?.user) {
      console.log('❌ Event creation failed: Unauthorized');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { 
      typeOfEvent,
      numberOfAdults,
      numberOfChildren,
      dateOfEvent,
      status,
      notes,
      leadId
    } = await request.json();

    console.log('📝 Creating event with data:', {
      typeOfEvent,
      numberOfAdults,
      numberOfChildren,
      dateOfEvent,
      status,
      notes,
      leadId
    });

    // Validate required fields
    if (!typeOfEvent || !dateOfEvent || !leadId) {
      console.log('❌ Event creation failed: Missing required fields', {
        hasTypeOfEvent: !!typeOfEvent,
        hasDateOfEvent: !!dateOfEvent,
        hasLeadId: !!leadId
      });
      return NextResponse.json(
        { error: 'Type of Event, Date of Event, and Lead ID are required' },
        { status: 400 }
      );
    }

    // Validate Airtable configuration
    if (!process.env.AIRTABLE_API_KEY) {
      console.log('❌ Event creation failed: Missing AIRTABLE_API_KEY');
      throw new Error('Airtable API key is missing');
    }
    if (!process.env.AIRTABLE_BASE_ID) {
      console.log('❌ Event creation failed: Missing AIRTABLE_BASE_ID');
      throw new Error('Airtable Base ID is missing');
    }

    console.log('🔌 Connecting to Airtable...', {
      hasApiKey: !!process.env.AIRTABLE_API_KEY,
      hasBaseId: !!process.env.AIRTABLE_BASE_ID,
      baseId: process.env.AIRTABLE_BASE_ID
    });

    try {
      const airtable = new Airtable({
        apiKey: process.env.AIRTABLE_API_KEY
      });

      const base = airtable.base(process.env.AIRTABLE_BASE_ID);
      const table = base('Events');

      const eventData = {
        'Type of Event': typeOfEvent,
        'Number of Adults': numberOfAdults || 0,
        'Number of Children': numberOfChildren || 0,
        'Date of Event': dateOfEvent,
        'Status': status || 'New',
        'Notes': notes || '',
        'Lead': [leadId]
      };

      console.log('📤 Creating record in Airtable with data:', eventData);

      const record = await table.create(eventData);
      console.log('✅ Event created successfully:', {
        id: record.id,
        fields: record.fields
      });

      return NextResponse.json({
        id: record.id,
        fields: {
          'Type of Event': record.get('Type of Event'),
          'Number of Adults': record.get('Number of Adults'),
          'Number of Children': record.get('Number of Children'),
          'Date of Event': record.get('Date of Event'),
          'Status': record.get('Status'),
          'Notes': record.get('Notes'),
          'Lead': record.get('Lead')
        }
      });
    } catch (airtableError) {
      console.error('❌ Airtable error:', {
        error: airtableError,
        message: airtableError instanceof Error ? airtableError.message : 'Unknown Airtable error',
        stack: airtableError instanceof Error ? airtableError.stack : undefined
      });
      
      return NextResponse.json(
        { 
          error: 'Failed to create event in Airtable', 
          details: airtableError instanceof Error ? airtableError.message : 'Unknown Airtable error'
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('❌ Error creating event:', {
      error,
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    
    return NextResponse.json(
      { 
        error: 'Failed to create event', 
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 