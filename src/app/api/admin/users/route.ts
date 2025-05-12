import { NextResponse } from 'next/server';
import { Resend } from 'resend';

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
  const resendApiKey = process.env.RESEND_API_KEY;

  if (!domain || !clientId || !clientSecret || !audience || !resendApiKey) {
    console.error('Missing Auth0 Management API or Resend environment variables');
    return NextResponse.json({ error: 'Server misconfiguration' }, { status: 500 });
  }

  try {
    const { email, password } = await req.json();
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Generate a secure random password if not provided
    const tempPassword = password || Math.random().toString(36).slice(-12) + Math.random().toString(36).slice(-4);

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

    // Create user
    const createUserRes = await fetch(`https://${domain}/api/v2/users`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${mgmtToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password: tempPassword,
        connection: 'Username-Password-Authentication',
        email_verified: false,
        verify_email: false,
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

    // Send welcome email via Resend
    const resend = new Resend(resendApiKey);
    const loginUrl = `${process.env.AUTH0_BASE_URL || 'http://localhost:3000'}/api/auth/login`;
    const html = `
      <div style="font-family: sans-serif;">
        <h2>Welcome to Salt & Serenity Admin</h2>
        <p>Hi${createdUser.name ? ' ' + createdUser.name : ''},</p>
        <p>You've been invited to the Salt & Serenity Admin Center.</p>
        <p><b>Login:</b> ${email}<br/>
        <b>Temporary Password:</b> ${tempPassword}</p>
        <p><a href="${loginUrl}" style="color: #10b981;">Login here</a></p>
        <p>After logging in, you'll be asked to reset your password.</p>
        <p>Welcome aboard!<br/>– Salt & Serenity</p>
      </div>
    `;
    try {
      await resend.emails.send({
        from: 'Salt & Serenity <noreply@salt-and-serenity.com>',
        to: email,
        subject: 'Welcome to Salt & Serenity Admin',
        html,
      });
    } catch (emailErr) {
      console.error('Failed to send welcome email:', emailErr);
      // Continue, but include a warning in the response
      return NextResponse.json({
        success: true,
        user: createdUser,
        password: tempPassword,
        emailWarning: 'User created, but failed to send welcome email. Please send credentials manually.'
      });
    }

    return NextResponse.json({ success: true, user: createdUser, password: tempPassword });
  } catch (err) {
    console.error('Error creating user and assigning admin role:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 