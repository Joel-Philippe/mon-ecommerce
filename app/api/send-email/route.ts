import { NextResponse } from 'next/server';
import { Resend } from 'resend';

// Initialize Resend with API key from environment variables
// Make sure to set RESEND_API_KEY in your .env.local or environment
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { email, displayName, productName } = await request.json();

    // You might want to define your email content here or use a template
    const { data, error } = await resend.emails.send({
      from: 'Acme <onboarding@resend.dev>', // Replace with your verified Resend domain
      to: [email],
      subject: 'Confirmation de votre demande',
      html: `
        <p>Bonjour ${displayName},</p>
        <p>Nous avons bien reçu votre demande concernant le produit : <strong>${productName}</strong>.</p>
        <p>Nous vous contacterons sous peu.</p>
        <p>Cordialement,</p>
        <p>Votre équipe</p>
      `,
    });

    if (error) {
      console.error('Error sending email with Resend:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Email sent successfully', data }, { status: 200 });
  } catch (error: any) {
    console.error('Failed to send email:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}