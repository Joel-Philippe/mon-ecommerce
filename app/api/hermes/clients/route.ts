import { NextRequest, NextResponse } from 'next/server';
import { getAdminDb } from '@/utils/firebaseAdmin';

// Endpoint: POST /api/hermes/clients
export async function POST(req: NextRequest) {
    const { name, email } = await req.json();

    // Validation
    if (!name || typeof name !== 'string' || !email || !email.includes('@')) {
        return NextResponse.json({ message: 'Invalid name or email.' }, { status: 400 });
    }

    // Create client document in Firestore
    const clientData = {
        name,
        email,
        status: 'draft',
        integrations: {
            firebase: 'pending',
            vercel: 'pending',
            render: 'pending',
            resend: 'pending',
            stripe: 'pending'
        },
        createdAt: new Date(),
        updatedAt: new Date()
    };

    try {
        const db = getAdminDb();
        const clientRef = await db.collection('hermes_clients').add(clientData);
        return NextResponse.json({ success: true, clientId: clientRef.id }, { status: 201 });
    } catch (error) {
        console.error('Server error:', error);
        return NextResponse.json({ message: 'Internal server error.' }, { status: 500 });
    }
}

// TODO: Add authentication for future versions.