import nodemailer from 'nodemailer';

// Configuration robuste pour une compatibilité maximale (Gmail, Outlook, etc.)
const transporter = nodemailer.createTransport({
  host: "smtp.office365.com", // Serveur officiel Outlook/Hotmail
  port: 587,
  secure: false, // TLS
  auth: {
    user: process.env.NEXT_PUBLIC_EMAIL_USER,
    pass: process.env.NEXT_PUBLIC_EMAIL_PASS,
  },
  tls: {
    ciphers: 'SSLv3',
    rejectUnauthorized: false
  }
});

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
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 12px; overflow: hidden;">
      <div style="background: linear-gradient(135deg, #FF9800 0%, #f91bf8 100%); color: white; padding: 30px 20px; text-align: center;">
        <h1 style="margin: 0; font-size: 24px;">To Easy Service</h1>
        <p style="margin: 5px 0 0 0; opacity: 0.8;">Suivi de votre commande</p>
      </div>
      <div style="padding: 30px 20px;">
        <h2 style="color: #444; margin-top: 0;">Bonjour ${orderData.userDisplayName || orderData.displayName || 'Client'},</h2>
        <p>Du nouveau concernant votre commande <strong style="color: #7c3aed;">#${orderData.id?.slice(-8)}</strong> :</p>
        
        <div style="background: #f8fafc; padding: 25px; border-radius: 10px; text-align: center; margin: 25px 0; border: 1px solid #e2e8f0;">
          <div style="font-size: 50px; margin-bottom: 10px;">${statusIcons[newStatus] || '🔔'}</div>
          <div style="font-size: 20px; font-weight: bold; color: #1e293b;">Statut : ${statusLabels[newStatus] || newStatus}</div>
        </div>

        <p>Vous recevrez une nouvelle notification à chaque étape importante de la livraison.</p>
        <div style="text-align: center; margin-top: 30px;">
           <a href="https://mon-ecommerce-edbs.onrender.com/account" style="background: #7c3aed; color: white; padding: 12px 25px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Accéder à mon compte</a>
        </div>
      </div>
      <div style="background: #f1f5f9; padding: 20px; text-align: center; font-size: 12px; color: #64748b;">
        <p style="margin: 0;">Ceci est un message automatique, merci de ne pas y répondre directement.</p>
        <p style="margin: 5px 0 0 0;">&copy; ${new Date().getFullYear()} To Easy Service. Tous droits réservés.</p>
      </div>
    </div>
  `;
};

export const sendStatusUpdateEmail = async (orderData: any, newStatus: string) => {
  try {
    if (!process.env.NEXT_PUBLIC_EMAIL_USER) return { success: false, error: 'Email configuration missing' };
    
    const mailOptions = {
      from: `"To Easy Service" <${process.env.NEXT_PUBLIC_EMAIL_USER}>`, // Expéditeur plus "pro"
      to: orderData.customer_email,
      // BCC: vous pouvez décommenter la ligne suivante pour recevoir une copie sur votre propre Gmail
      // bcc: "votre-email@gmail.com", 
      subject: `Mise à jour de votre commande #${orderData.id?.slice(-8)}`,
      html: createStatusUpdateEmailHTML(orderData, newStatus),
      headers: {
        'X-Priority': '1 (Highest)',
        'X-Mailer': 'Nodemailer'
      }
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Email (Statut: ${newStatus}) envoyé à ${orderData.customer_email}. MessageId: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error: any) {
    console.error('❌ Erreur d\'envoi email:', error);
    return { success: false, error: error.message };
  }
};

export const sendOrderConfirmationEmail = async (orderData: any) => {
  try {
    if (!process.env.NEXT_PUBLIC_EMAIL_USER) return { success: false, error: 'Email configuration missing' };

    const itemsHtml = (orderData.items || []).map((item: any) => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.title}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.count}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">${(item.price || 0).toFixed(2)}€</td>
      </tr>
    `).join('');

    const mailOptions = {
      from: `"To Easy Service" <${process.env.NEXT_PUBLIC_EMAIL_USER}>`,
      to: orderData.customerEmail || orderData.customer_email,
      subject: `Confirmation de votre commande #${(orderData.sessionId || orderData.id || '').slice(-8)}`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 12px; overflow: hidden;">
          <div style="background: linear-gradient(135deg, #FF9800 0%, #f91bf8 100%); color: white; padding: 30px 20px; text-align: center;">
            <h1 style="margin: 0; font-size: 24px;">Merci pour votre achat !</h1>
          </div>
          <div style="padding: 30px 20px;">
            <p>Bonjour ${orderData.userDisplayName || orderData.displayName || 'Client'},</p>
            <p>Nous vous confirmons la réception de votre commande <strong>#${(orderData.sessionId || orderData.id || '').slice(-8)}</strong>.</p>
            
            <h3 style="border-bottom: 2px solid #f91bf8; padding-bottom: 5px;">Détails de la commande</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <thead>
                <tr style="background: #f8fafc;">
                  <th style="padding: 10px; text-align: left;">Produit</th>
                  <th style="padding: 10px; text-align: center;">Qté</th>
                  <th style="padding: 10px; text-align: right;">Prix</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
            </table>
            
            <p style="margin-top: 20px;">Vous recevrez des emails de suivi à chaque étape de l'avancement de votre commande.</p>
          </div>
          <div style="background: #f1f5f9; padding: 20px; text-align: center; font-size: 12px; color: #64748b;">
            <p>&copy; ${new Date().getFullYear()} To Easy Service. Tous droits réservés.</p>
          </div>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Confirmation d'achat envoyée à ${orderData.customerEmail || orderData.customer_email}`);
    return { success: true, messageId: info.messageId };
  } catch (error: any) {
    console.error('❌ Erreur d\'envoi confirmation:', error);
    return { success: false, error: error.message };
  }
};
