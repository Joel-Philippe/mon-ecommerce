import { db } from '@/components/firebaseConfig';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

export async function GET(req: Request, { params }: { params: { id: string } }) {
    const { id } = params; // id est extrait de l'URL

    try {
        const cardRef = doc(db, "cards", id as string);
        const cardSnap = await getDoc(cardRef);
        if (!cardSnap.exists()) {
            return new Response(JSON.stringify({ success: false }), { status: 404 });
        }
        return new Response(JSON.stringify({ success: true, data: { _id: cardSnap.id, ...cardSnap.data() } }), { status: 200 });
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ success: false }), { status: 400 });
    }
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
    const { id } = params; // id est extrait de l'URL

    try {
        const cardRef = doc(db, "cards", id as string);
        const body = await req.json();
        await updateDoc(cardRef, body);
        const updatedDoc = await getDoc(cardRef);
        if (!updatedDoc.exists()) {
            return new Response(JSON.stringify({ success: false }), { status: 404 });
        }
        return new Response(JSON.stringify({ success: true, data: { _id: updatedDoc.id, ...updatedDoc.data() } }), { status: 200 });
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ success: false }), { status: 400 });
    }
}