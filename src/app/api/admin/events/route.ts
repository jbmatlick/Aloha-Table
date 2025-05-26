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
    if (!process.env.AIRTABLE_TABLE_NAME_EVENTS) {
      console.log('❌ Event creation failed: Missing AIRTABLE_TABLE_NAME_EVENTS');
      throw new Error('Airtable Events table name is missing');
    }

    console.log('🔌 Connecting to Airtable...', {
      hasApiKey: !!process.env.AIRTABLE_API_KEY,
      hasBaseId: !!process.env.AIRTABLE_BASE_ID,
      baseId: process.env.AIRTABLE_BASE_ID?.substring(0, 4) + '...',
      eventsTableName: process.env.AIRTABLE_TABLE_NAME_EVENTS
    });

    try {
      // Initialize Airtable with explicit configuration
      const airtable = new Airtable({
        apiKey: process.env.AIRTABLE_API_KEY,
        endpointUrl: 'https://api.airtable.com'
      });

      console.log('✅ Airtable client initialized');

      const base = airtable.base(process.env.AIRTABLE_BASE_ID);
      console.log('✅ Airtable base connected');

      // First, verify the lead exists
      try {
        const leadRecord = await base('Leads').find(leadId);
        console.log('✅ Lead record found:', leadRecord.id);
      } catch (leadError) {
        console.error('❌ Lead not found:', leadError);
        return NextResponse.json(
          { error: 'Lead not found', details: 'The specified lead ID does not exist' },
          { status: 400 }
        );
      }

      const table = base(process.env.AIRTABLE_TABLE_NAME_EVENTS);
      console.log('✅ Airtable table selected:', process.env.AIRTABLE_TABLE_NAME_EVENTS);

      // Format the date to ensure it's in the correct format for Airtable
      const formattedDate = new Date(dateOfEvent).toISOString().split('T')[0];

      const eventData = {
        'Type of Event': typeOfEvent,
        'Number of Adults': numberOfAdults || 0,
        'Number of Children': numberOfChildren || 0,
        'Date of Event': formattedDate,
        'Status': status || 'New',
        'Notes': notes || '',
        'Lead': [leadId]
      };

      console.log('📤 Creating record in Airtable with data:', {
        ...eventData,
        Lead: eventData.Lead[0] // Log just the ID for clarity
      });

      // Validate the data before sending to Airtable
      if (typeof eventData['Number of Adults'] !== 'number' || 
          typeof eventData['Number of Children'] !== 'number') {
        throw new Error('Invalid number format for adults or children');
      }

      try {
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
      } catch (createError) {
        console.error('❌ Error creating Airtable record:', {
          error: createError,
          message: createError instanceof Error ? createError.message : 'Unknown error',
          stack: createError instanceof Error ? createError.stack : undefined,
          name: createError instanceof Error ? createError.name : 'Unknown',
          data: eventData,
          errorString: JSON.stringify(createError, Object.getOwnPropertyNames(createError))
        });

        // Check for specific Airtable error patterns
        const errorMessage = createError instanceof Error ? createError.message : 'Unknown error';
        
        if (errorMessage.includes('INVALID_PERMISSIONS')) {
          return NextResponse.json(
            { error: 'Airtable permissions error', details: 'The API key does not have permission to create records' },
            { status: 403 }
          );
        }
        if (errorMessage.includes('INVALID_BASE')) {
          return NextResponse.json(
            { error: 'Invalid Airtable base', details: 'The specified base ID is invalid' },
            { status: 400 }
          );
        }
        if (errorMessage.includes('INVALID_TABLE')) {
          return NextResponse.json(
            { error: 'Invalid Airtable table', details: `The ${process.env.AIRTABLE_TABLE_NAME_EVENTS} table does not exist` },
            { status: 400 }
          );
        }
        if (errorMessage.includes('INVALID_FIELD')) {
          return NextResponse.json(
            { error: 'Invalid field', details: 'One or more fields in the event data are invalid' },
            { status: 400 }
          );
        }

        return NextResponse.json(
          { 
            error: 'Failed to create event in Airtable', 
            details: errorMessage,
            data: eventData,
            errorDetails: createError instanceof Error ? {
              name: createError.name,
              message: createError.message,
              stack: createError.stack
            } : 'Unknown error type'
          },
          { status: 500 }
        );
      }
    } catch (airtableError) {
      console.error('❌ Airtable error:', {
        error: airtableError,
        message: airtableError instanceof Error ? airtableError.message : 'Unknown Airtable error',
        stack: airtableError instanceof Error ? airtableError.stack : undefined,
        name: airtableError instanceof Error ? airtableError.name : 'Unknown',
        errorString: JSON.stringify(airtableError, Object.getOwnPropertyNames(airtableError))
      });
      
      return NextResponse.json(
        { 
          error: 'Failed to create event in Airtable', 
          details: airtableError instanceof Error ? airtableError.message : 'Unknown Airtable error',
          errorDetails: airtableError instanceof Error ? {
            name: airtableError.name,
            message: airtableError.message,
            stack: airtableError.stack
          } : 'Unknown error type'
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('❌ Error creating event:', {
      error,
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : 'Unknown',
      errorString: JSON.stringify(error, Object.getOwnPropertyNames(error))
    });
    
    return NextResponse.json(
      { 
        error: 'Failed to create event', 
        details: error instanceof Error ? error.message : 'Unknown error',
        errorDetails: error instanceof Error ? {
          name: error.name,
          message: error.message,
          stack: error.stack
        } : 'Unknown error type'
      },
      { status: 500 }
    );
  }
} 