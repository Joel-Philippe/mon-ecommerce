import { getAdminDb } from '@/utils/firebaseAdmin';

export async function POST(req: Request) {
  if (req.method === 'POST') {
    const { email, items } = await req.json();

    try {
      const db = getAdminDb();
      await db.collection('purchases').add({
        email,
        items,
        timestamp: new Date().toISOString(),
      });

      return new Response(JSON.stringify({ message: 'Purchase added successfully' }), { status: 200 });
    } catch (error) {
      console.error('Error adding purchase:', error);
      return new Response(JSON.stringify({ message: 'Failed to add purchase' }), { status: 500 });
    }
  } else {
    return new Response(JSON.stringify({ message: 'Method not allowed' }), { status: 405 });
  }
}
