import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { name, email } = await request.json();

    // TODO: Implement referral link generation and email sending
    console.log('Referral request received:', { name, email });

    // For now, just return success
    return NextResponse.json({ 
      success: true,
      message: 'Referral request received'
    });
  } catch (error) {
    console.error('Error processing referral request:', error);
    return NextResponse.json(
      { error: 'Failed to process referral request' },
      { status: 500 }
    );
  }
} 