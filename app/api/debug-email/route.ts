import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function GET() {
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;

  if (!user || !pass) {
    return NextResponse.json({ 
      error: 'Variables Gmail manquantes sur Render',
      GMAIL_USER: !!user,
      GMAIL_APP_PASSWORD: !!pass
    }, { status: 500 });
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user, pass }
  });

  try {
    await transporter.verify();
    
    const info = await transporter.sendMail({
      from: `"Test To Easy" <${user}>`,
      to: user,
      subject: "Diagnostic Gmail SMTP - Succès",
      text: "Le serveur parvient à envoyer des emails via votre compte Gmail !",
      html: "<b>Le serveur parvient à envoyer des emails via votre compte Gmail !</b>"
    });

    return NextResponse.json({ 
      status: 'success', 
      message: 'Connexion Gmail établie',
      messageId: info.messageId
    });
  } catch (error: any) {
    return NextResponse.json({ 
      status: 'error', 
      message: error.message,
      code: error.code
    }, { status: 500 });
  }
}
