import { NextResponse } from 'next/server';
import Airtable from 'airtable';
import { getSession } from '@auth0/nextjs-auth0';

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!process.env.AIRTABLE_API_KEY || !process.env.AIRTABLE_BASE_ID || !process.env.AIRTABLE_TABLE_NAME_EVENTS) {
      throw new Error('Airtable configuration is missing');
    }

    const airtable = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY });
    const base = airtable.base(process.env.AIRTABLE_BASE_ID);
    const table = base(process.env.AIRTABLE_TABLE_NAME_EVENTS);

    const body = await request.json();
    console.log('PATCH handler received fields:', body);
    const id = params.id;
    if (!id) {
      return NextResponse.json({ error: 'Event ID is required' }, { status: 400 });
    }

    // Only update provided fields
    const updateFields: any = {};
    if (body.typeOfEvent) updateFields['Type of Event'] = body.typeOfEvent;
    if (body.numberOfAdults !== undefined) updateFields['# of Adults'] = body.numberOfAdults;
    if (body.numberOfChildren !== undefined) updateFields['# of Children'] = body.numberOfChildren;
    if (body.dateOfEvent) updateFields['Event Date'] = new Date(body.dateOfEvent).toISOString();
    if (body.status) updateFields['Status'] = body.status;
    if (body.notes !== undefined) updateFields['Notes'] = body.notes;
    console.log('PATCH handler updateFields:', updateFields);

    try {
      const record = await table.update(id, updateFields);
      return NextResponse.json({
        id: record.id,
        fields: record.fields
      });
    } catch (err: any) {
      return NextResponse.json({ error: 'Failed to update event', details: err.message }, { status: 500 });
    }
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to update event', details: error.message }, { status: 500 });
  }
} 