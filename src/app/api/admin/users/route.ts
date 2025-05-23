import { NextResponse } from 'next/server';

export async function GET() {
  const domain = process.env.AUTH0_DOMAIN;
  const clientId = process.env.AUTH0_MGMT_CLIENT_ID;
  const clientSecret = process.env.AUTH0_MGMT_CLIENT_SECRET;
  const audience = process.env.AUTH0_MGMT_AUDIENCE;

  if (!domain || !clientId || !clientSecret || !audience) {
    console.error('Missing Auth0 Management API environment variables');
    return NextResponse.json({ error: 'Server misconfiguration' }, { status: 500 });
  }

  try {
    // Get a Management API token
    const tokenRes = await fetch(`https://${domain}/oauth/token`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        grant_type: 'client_credentials',
        client_id: clientId,
        client_secret: clientSecret,
        audience,
      }),
    });
    const tokenData = await tokenRes.json();
    if (!tokenRes.ok) {
      console.error('Failed to get Auth0 Management token:', tokenData);
      return NextResponse.json({ error: 'Failed to get Auth0 Management token' }, { status: 500 });
    }
    const mgmtToken = tokenData.access_token;

    // Fetch users
    const usersRes = await fetch(`https://${domain}/api/v2/users?fields=user_id,email,name,email_verified,last_login`, {
      headers: {
        Authorization: `Bearer ${mgmtToken}`,
      },
    });
    const users = await usersRes.json();
    if (!usersRes.ok) {
      console.error('Failed to fetch users:', users);
      return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
    }
    return NextResponse.json({ users });
  } catch (err) {
    console.error('Error fetching users from Auth0:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const domain = process.env.AUTH0_DOMAIN;
  const clientId = process.env.AUTH0_MGMT_CLIENT_ID;
  const clientSecret = process.env.AUTH0_MGMT_CLIENT_SECRET;
  const audience = process.env.AUTH0_MGMT_AUDIENCE;

  if (!domain || !clientId || !clientSecret || !audience) {
    console.error('Missing Auth0 Management API environment variables');
    return NextResponse.json({ error: 'Server misconfiguration' }, { status: 500 });
  }

  try {
    const { email } = await req.json();
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Get a Management API token
    const tokenRes = await fetch(`https://${domain}/oauth/token`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        grant_type: 'client_credentials',
        client_id: clientId,
        client_secret: clientSecret,
        audience,
      }),
    });
    const tokenData = await tokenRes.json();
    if (!tokenRes.ok) {
      console.error('Failed to get Auth0 Management token:', tokenData);
      return NextResponse.json({ error: 'Failed to get Auth0 Management token' }, { status: 500 });
    }
    const mgmtToken = tokenData.access_token;

    // Create user (no password)
    const createUserRes = await fetch(`https://${domain}/api/v2/users`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${mgmtToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        connection: 'Username-Password-Authentication',
        email_verified: false,
        verify_email: false,
        password: crypto.randomUUID() + 'Aa1!', // Temporary strong password to satisfy Auth0
      }),
    });
    const createdUser = await createUserRes.json();
    if (!createUserRes.ok) {
      console.error('Failed to create user:', createdUser);
      return NextResponse.json({ error: 'Failed to create user', details: createdUser }, { status: 500 });
    }

    // Assign "admin" role
    const rolesRes = await fetch(`https://${domain}/api/v2/roles`, {
      headers: {
        Authorization: `Bearer ${mgmtToken}`,
      },
    });
    const roles = await rolesRes.json();
    if (!rolesRes.ok) {
      console.error('Failed to fetch roles:', roles);
      return NextResponse.json({ error: 'Failed to fetch roles' }, { status: 500 });
    }
    const adminRole = roles.find((role: any) => role.name === 'admin');
    if (!adminRole) {
      console.error('Admin role not found');
      return NextResponse.json({ error: 'Admin role not found' }, { status: 500 });
    }

    // Assign the role to the user
    const assignRoleRes = await fetch(`https://${domain}/api/v2/users/${encodeURIComponent(createdUser.user_id)}/roles`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${mgmtToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ roles: [adminRole.id] }),
    });
    if (!assignRoleRes.ok) {
      const assignRoleErr = await assignRoleRes.json();
      console.error('Failed to assign admin role:', assignRoleErr);
      return NextResponse.json({ error: 'Failed to assign admin role', details: assignRoleErr }, { status: 500 });
    }

    // Generate Auth0 password reset ticket
    const ticketRes = await fetch(`https://${domain}/api/v2/tickets/password-change`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${mgmtToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: createdUser.user_id,
        result_url: 'https://salt-and-serenity.com/reset-complete',
        mark_email_as_verified: true,
      }),
    });
    const ticketData = await ticketRes.json();
    if (!ticketRes.ok) {
      console.error('Failed to generate password reset ticket:', ticketData);
      return NextResponse.json({ error: 'Failed to generate password reset ticket', details: ticketData }, { status: 500 });
    }
    const resetLink = ticketData.ticket;

    // Send welcome email via Brevo with reset link
    const html = `
      <div style="font-family: sans-serif;">
        <h2>Welcome to Salt & Serenity Admin</h2>
        <p>Hi${createdUser.name ? ' ' + createdUser.name : ''},</p>
        <p>You've been invited to the Salt & Serenity Admin Center.</p>
        <p><a href="${resetLink}" style="color: #10b981;">Set your password and activate your account</a></p>
        <p>After setting your password, you'll be able to log in.</p>
        <p>Welcome aboard!<br/>– Salt & Serenity</p>
      </div>
    `;
    try {
      const response = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'api-key': process.env.BREVO_API_KEY || '',
        },
        body: JSON.stringify({
          sender: {
            name: 'Salt & Serenity',
            email: 'hello@salt-and-serenity.com'
          },
          to: [{ email }],
          subject: 'Welcome to admin access to Salt and Serenity',
          htmlContent: html,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error('Brevo API error details:', error);
        throw new Error(`Failed to send email: ${error.message || 'Unknown error'}`);
      }

      const emailData = await response.json();
      console.log('Welcome email sent successfully:', emailData);
    } catch (emailErr) {
      console.error('Failed to send welcome email:', emailErr);
      // Continue, but include a warning in the response
      return NextResponse.json({
        success: true,
        user: createdUser,
        emailWarning: 'User created, but failed to send welcome email. Please send credentials manually.'
      });
    }

    return NextResponse.json({ success: true, user: createdUser });
  } catch (err) {
    console.error('Error creating user and assigning admin role:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    console.log('[DELETE] Incoming request body:', body);
    const userId = body.user_id;
    if (!userId || typeof userId !== 'string') {
      console.error('[DELETE] Invalid user_id:', userId);
      return NextResponse.json({ error: 'Invalid user_id' }, { status: 400 });
    }
    console.log('[DELETE] Attempting to delete user with user_id:', userId);

    const domain = process.env.AUTH0_DOMAIN;
    const clientId = process.env.AUTH0_MGMT_CLIENT_ID;
    const clientSecret = process.env.AUTH0_MGMT_CLIENT_SECRET;
    const audience = process.env.AUTH0_MGMT_AUDIENCE;

    if (!domain || !clientId || !clientSecret || !audience) {
      console.error('[DELETE] Missing Auth0 Management API environment variables');
      return NextResponse.json({ error: 'Server misconfiguration' }, { status: 500 });
    }

    // Get a Management API token
    const tokenRes = await fetch(`https://${domain}/oauth/token`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        grant_type: 'client_credentials',
        client_id: clientId,
        client_secret: clientSecret,
        audience,
      }),
    });
    const tokenData = await tokenRes.json();
    if (!tokenRes.ok) {
      console.error('[DELETE] Failed to get Auth0 Management token:', tokenData);
      return NextResponse.json({ error: 'Failed to get Auth0 Management token' }, { status: 500 });
    }
    const mgmtToken = tokenData.access_token;

    // Fetch all users to check count
    const usersRes = await fetch(`https://${domain}/api/v2/users`, {
      headers: {
        Authorization: `Bearer ${mgmtToken}`,
      },
    });
    const users = await usersRes.json();
    if (!usersRes.ok) {
      console.error('Failed to fetch users:', users);
      return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
    }
    if (users.length <= 1) {
      return NextResponse.json({ error: 'Cannot delete the last user.' }, { status: 400 });
    }

    // Delete the user
    const deleteRes = await fetch(`https://${domain}/api/v2/users/${encodeURIComponent(userId)}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${mgmtToken}`,
      },
    });
    console.log('[DELETE] Auth0 delete user response status:', deleteRes.status);
    if (!deleteRes.ok) {
      const deleteErr = await deleteRes.json();
      console.error('[DELETE] Failed to delete user:', deleteErr);
      return NextResponse.json({ error: 'Failed to delete user', details: deleteErr }, { status: 500 });
    }
    console.log('[DELETE] User deleted successfully:', userId);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[DELETE] Unexpected error:', err);
    return NextResponse.json({ error: 'Internal server error', details: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
} 