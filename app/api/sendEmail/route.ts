import nodemailer from 'nodemailer';
import { NextRequest, NextResponse } from 'next/server';

const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || 'hotmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function POST(req: NextRequest) {
  if (req.method === 'POST') {
    const { to, subject, message } = await req.json();

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      text: message,
    };

    try {
      await transporter.sendMail(mailOptions);
      return new Response(JSON.stringify({ success: true }), { status: 200 });
    } catch (error: unknown) { // Explicitly type error as unknown
      let errorMessage = 'An unknown error occurred.';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      return new Response(JSON.stringify({ success: false, error: errorMessage }), { status: 500 });
    }
  } else {
    return new Response(JSON.stringify({ message: 'Method not allowed' }), { status: 405 });
  }
}
