import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function GET() {
  const user = process.env.NEXT_PUBLIC_EMAIL_USER;
  const pass = process.env.NEXT_PUBLIC_EMAIL_PASS;

  if (!user || !pass) {
    return NextResponse.json({ 
      error: 'Variables d\'environnement manquantes',
      user: !!user,
      pass: !!pass
    }, { status: 500 });
  }

  const transporter = nodemailer.createTransport({
    host: "smtp.office365.com",
    port: 587,
    secure: false,
    auth: { user, pass },
    tls: { ciphers: 'SSLv3', rejectUnauthorized: false }
  });

  try {
    // Vérifier la connexion
    await transporter.verify();
    
    // Envoyer un mail de test à vous-même
    const info = await transporter.sendMail({
      from: `"Debug To Easy" <${user}>`,
      to: user,
      subject: "Test de connexion SMTP - " + new Date().toISOString(),
      text: "La connexion SMTP fonctionne correctement !",
      html: "<b>La connexion SMTP fonctionne correctement !</b>"
    });

    return NextResponse.json({ 
      status: 'success', 
      message: 'Connexion SMTP établie et mail de test envoyé',
      messageId: info.messageId
    });
  } catch (error: any) {
    console.error('❌ Erreur Debug Email:', error);
    return NextResponse.json({ 
      status: 'error', 
      message: error.message,
      code: error.code,
      command: error.command
    }, { status: 500 });
  }
}
