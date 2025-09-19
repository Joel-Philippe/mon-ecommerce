import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
    if (req.method !== 'POST') {
      return new Response(JSON.stringify({ message: 'Method Not Allowed' }), { status: 405 });
    }
  
    const { email } = await req.json();
  
    if (!email) {
      return new Response(JSON.stringify({ message: 'Missing email' }), { status: 400 });
    }
  
    // Comparer l'email de l'utilisateur à l'email admin dans la variable d'environnement
    const adminEmail = process.env.NEXT_PUBLIC_FIREBASE_ADMIN_EMAIL;
  
    // S'assurer que la variable d'environnement est bien configurée
    if (!adminEmail) {
      return new Response(JSON.stringify({ message: 'Admin email not set in environment variables' }), { status: 500 });
    }
  
    if (email === adminEmail) {
      return new Response(JSON.stringify({ isAdmin: true }), { status: 200 });
    } else {
      return new Response(JSON.stringify({ isAdmin: false }), { status: 200 });
    }
  }
