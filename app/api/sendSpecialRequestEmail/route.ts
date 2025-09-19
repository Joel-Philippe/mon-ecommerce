import nodemailer from 'nodemailer';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  if (req.method === 'POST') {
    const { email, displayName, selectedProducts } = await req.json();

    const transporter = nodemailer.createTransport({
      service: 'hotmail', // ou tout autre service de messagerie
      auth: {
        user: process.env.NEXT_PUBLIC_EMAIL_USER,
        pass: process.env.NEXT_PUBLIC_EMAIL_PASS,
      },
    });

    const productList = selectedProducts.map((product: { title: string; price: string | number }) => `${product.title} - ${product.price}€`).join('\n');

    const mailOptions = {
      from: process.env.NEXT_PUBLIC_EMAIL_USER,
      to: email,
      subject: 'Synthèse de votre demande spéciale',
      text: `Bonjour ${displayName},\n\nVoici les détails de votre demande spéciale :\n${productList},\n\nVous recevrez une confirmation dans votre compte TIME, dans la rubrique 'Message' lorsque votre demande sera acceptée. \n\nA bientôt !`,
    };

    try {
      await transporter.sendMail(mailOptions);
      return new Response(JSON.stringify({ message: 'Email envoyé avec succès' }), { status: 200 });
    } catch (error) {
      console.error('Erreur lors de l\'envoi de l\'email:', error);
      return new Response(JSON.stringify({ message: 'Erreur lors de l\'envoi de l\'email', error }), { status: 500 });
    }
  } else {
    return new Response(`Méthode ${req.method} non autorisée`, { status: 405 });
  }
}
