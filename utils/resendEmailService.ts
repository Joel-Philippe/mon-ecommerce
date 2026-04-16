import nodemailer from 'nodemailer';

// Configuration du transporteur Nodemailer (Utilise la même config que complete-purchase)
const transporter = nodemailer.createTransport({
  service: 'hotmail',
  auth: {
    user: process.env.NEXT_PUBLIC_EMAIL_USER,
    pass: process.env.NEXT_PUBLIC_EMAIL_PASS,
  },
});

// 🎨 Template HTML pour la mise à jour du statut de la commande
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

  const statusMessages: Record<string, string> = {
    'pending': 'Votre commande est en attente de validation.',
    'processing': 'Nous préparons actuellement votre commande avec le plus grand soin.',
    'shipped': 'Bonne nouvelle ! Votre commande a été remise au transporteur et est en route.',
    'delivered': 'Votre commande a été livrée. Nous espérons qu\'elle vous apportera entière satisfaction.',
    'completed': 'Votre commande est maintenant terminée. Merci de votre confiance !',
    'paid': 'Votre paiement a été validé et votre commande est en cours de traitement.'
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
          <p style="color: #666; margin-top: 5px;">${statusMessages[newStatus] || ''}</p>
        </div>

        <p>Vous pouvez suivre l'avancement de vos commandes en vous connectant à votre compte sur notre site.</p>
      </div>
      <div style="background: #f4f4f4; padding: 20px; text-align: center; font-size: 12px; color: #888;">
        <p>Merci de votre confiance, l'équipe To Easy Service</p>
      </div>
    </div>
  `;
};

// 📧 Envoyer un email de mise à jour de statut
export const sendStatusUpdateEmail = async (orderData: any, newStatus: string) => {
  try {
    console.log(`📧 Tentative d'envoi d'email via Nodemailer (${newStatus}) à ${orderData.customer_email}...`);
    
    if (!process.env.NEXT_PUBLIC_EMAIL_USER || !process.env.NEXT_PUBLIC_EMAIL_PASS) {
      console.error('❌ Identifiants Email manquants (NEXT_PUBLIC_EMAIL_USER/PASS)');
      return { success: false, error: 'Email credentials missing' };
    }
    
    const mailOptions = {
      from: process.env.NEXT_PUBLIC_EMAIL_USER,
      to: orderData.customer_email,
      subject: `Mise à jour de votre commande #${orderData.id?.slice(-8)}`,
      html: createStatusUpdateEmailHTML(orderData, newStatus),
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email envoyé avec succès via Nodemailer. MessageId:', info.messageId);
    
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Erreur Nodemailer:', error);
    return { success: false, error };
  }
};

// Export factice pour la compatibilité si d'autres imports existent
export const sendOrderConfirmationEmail = async (orderData: any) => {
  // Cette fonction pourrait aussi être migrée vers Nodemailer si besoin
  console.log('Note: sendOrderConfirmationEmail non encore migré vers Nodemailer');
  return { success: false, error: 'Non implémenté avec Nodemailer' };
};
