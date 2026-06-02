import { NextRequest } from 'next/server';
import { sendGenericEmail } from '@/utils/resendEmailService';

export async function POST(req: NextRequest) {
  if (req.method === 'POST') {
    const { to, subject, message } = await req.json();

    try {
      const result = await sendGenericEmail({ to, subject, message });

      if (!result.success) {
        return new Response(JSON.stringify({ success: false, error: result.error }), { status: 500 });
      }

      return new Response(JSON.stringify({ success: true, messageId: result.messageId }), { status: 200 });
    } catch (error: unknown) {
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
