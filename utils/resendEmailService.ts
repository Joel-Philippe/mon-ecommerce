import nodemailer from 'nodemailer';

// Configuration du transporteur Nodemailer
const transporter = nodemailer.createTransport({
  service: 'hotmail',
  auth: {
    user: process.env.NEXT_PUBLIC_EMAIL_USER,
    pass: process.env.NEXT_PUBLIC_EMAIL_PASS,
  },
});

// 🎨 Template HTML pour la mise à jour du statut
const createStatusUpdateEmailHTML = (orderData: any, newStatus: string): string => {
  const statusLabels: Record<string, string> = {
    'pending': 'En attente',
    'processing': 'En cours de préparation',
    'shipped': 'Expédiée',
    'delivered': 'Livrée',
    'completed': 'Terminée',
    'paid': 'Payée'
  };

  const statusIcons: Record<string, string> = {
    'pending': '⏳',
    'processing': '🛠️',
    'shipped': '🚚',
    'delivered': '📦',
    'completed': '✅',
    'paid': '💳'
  };

  return `
    <div style="font-family: sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
      <div style="background: linear-gradient(135deg, #FF9800 0%, #f91bf8 100%); color: white; padding: 20px; text-align: center;">
        <h1 style="margin: 0;">To Easy Service</h1>
      </div>
      <div style="padding: 20px;">
        <h2>Bonjour ${orderData.displayName || 'Client'},</h2>
        <p>Le statut de votre commande <strong>#${orderData.id?.slice(-8)}</strong> a été mis à jour :</p>
        <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0; border: 1px solid #eee;">
          <div style="font-size: 40px; margin-bottom: 10px;">${statusIcons[newStatus] || '🔔'}</div>
          <div style="font-size: 18px; font-weight: bold;">Statut : ${statusLabels[newStatus] || newStatus}</div>
        </div>
        <p>Merci de votre confiance, l'équipe To Easy Service</p>
      </div>
    </div>
  `;
};

// 📧 Envoyer un email de mise à jour de statut
export const sendStatusUpdateEmail = async (orderData: any, newStatus: string) => {
  try {
    if (!process.env.NEXT_PUBLIC_EMAIL_USER || !process.env.NEXT_PUBLIC_EMAIL_PASS) {
      return { success: false, error: 'Email credentials missing' };
    }
    
    const mailOptions = {
      from: process.env.NEXT_PUBLIC_EMAIL_USER,
      to: orderData.customer_email,
      subject: `Mise à jour de votre commande #${orderData.id?.slice(-8)}`,
      html: createStatusUpdateEmailHTML(orderData, newStatus),
    };

    const info = await transporter.sendMail(mailOptions);
    return { success: true, messageId: info.messageId };
  } catch (error: any) {
    console.error('❌ Erreur Nodemailer:', error);
    return { success: false, error: error.message };
  }
};

// 📧 Envoyer l'email de confirmation de commande (version complète)
export const sendOrderConfirmationEmail = async (orderData: any) => {
  try {
    if (!process.env.NEXT_PUBLIC_EMAIL_USER || !process.env.NEXT_PUBLIC_EMAIL_PASS) {
      return { success: false, error: 'Email credentials missing' };
    }

    const mailOptions = {
      from: process.env.NEXT_PUBLIC_EMAIL_USER,
      to: orderData.customerEmail || orderData.customer_email,
      subject: `Confirmation de votre commande #${(orderData.sessionId || orderData.id || '').slice(-8)}`,
      html: `<h1>Merci pour votre commande !</h1><p>Nous avons bien reçu votre paiement et traitons votre commande.</p>`,
    };

    const info = await transporter.sendMail(mailOptions);
    return { success: true, messageId: info.messageId };
  } catch (error: any) {
    console.error('❌ Erreur Nodemailer:', error);
    return { success: false, error: error.message };
  }
};
