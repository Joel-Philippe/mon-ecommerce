import { Resend } from 'resend';
import { clientConfig, getClientUrl } from '@/config/client.config';

const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

const getFromAddress = (label = clientConfig.emailFromName) => {
  const fromEmail = process.env.RESEND_FROM_EMAIL || process.env.NEXT_PUBLIC_SUPPORT_EMAIL || clientConfig.adminEmail;
  return `"${label}" <${fromEmail}>`;
};

const getReplyToAddress = () => process.env.RESEND_REPLY_TO_EMAIL || process.env.NEXT_PUBLIC_SUPPORT_EMAIL || undefined;

type EmailSendResult = {
  success: boolean;
  messageId?: string;
  error?: string;
};

const sendWithResend = async ({
  from,
  to,
  subject,
  html,
  text,
  replyTo,
}: {
  from?: string;
  to: string | string[];
  subject: string;
  html?: string;
  text?: string;
  replyTo?: string;
}): Promise<EmailSendResult> => {
  if (!resend) {
    return { success: false, error: 'RESEND_API_KEY configuration missing' };
  }

  const payload: any = {
    from: from || getFromAddress(),
    to: Array.isArray(to) ? to : [to],
    subject,
    ...(replyTo || getReplyToAddress() ? { replyTo: replyTo || getReplyToAddress() } : {}),
  };

  if (html) {
    payload.html = html;
  } else if (text) {
    payload.text = text;
  } else {
    payload.text = '';
  }

  const { data, error } = await resend.emails.send(payload);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, messageId: data?.id };
};

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
        <div style="background: white; width: 60px; height: 60px; border-radius: 12px; margin: 0 auto 10px auto; padding: 10px; display: flex; align-items: center; justify-content: center;">
          <svg width="40" height="40" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M30 45L50 25L70 45V75H30V45Z" fill="#FF9800" />
            <path d="M40 50H60V65H40V50Z" fill="#f91bf8" opacity="0.8" />
            <path d="M35 50C35 45 40 45 40 45H60C60 45 65 45 65 50" stroke="#FF9800" stroke-width="3" />
          </svg>
        </div>
        <h1 style="margin: 0; font-size: 24px;">${clientConfig.brandName}</h1>
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
           <a href="${getClientUrl('/account')}" style="background: #7c3aed; color: white; padding: 12px 25px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Accéder à mon compte</a>
        </div>
      </div>
      <div style="background: #f1f5f9; padding: 20px; text-align: center; font-size: 12px; color: #64748b;">
        <p style="margin: 0;">&copy; ${new Date().getFullYear()} ${clientConfig.brandName}. Tous droits réservés.</p>
      </div>
    </div>
  `;
};

export const sendGenericEmail = async ({
  to,
  subject,
  message,
  html,
}: {
  to: string | string[];
  subject: string;
  message?: string;
  html?: string;
}): Promise<EmailSendResult> => {
  try {
    const result = await sendWithResend({
      to,
      subject,
      text: message,
      html,
    });

    if (result.success) {
      console.log(`✅ Email Resend envoyé à ${Array.isArray(to) ? to.join(', ') : to}. MessageId: ${result.messageId}`);
    }

    return result;
  } catch (error: any) {
    console.error('❌ Erreur d\'envoi email Resend:', error);
    return { success: false, error: error.message };
  }
};

export const sendStatusUpdateEmail = async (orderData: any, newStatus: string): Promise<EmailSendResult> => {
  try {
    const result = await sendWithResend({
      to: orderData.customer_email,
      subject: `Mise à jour de votre commande #${orderData.id?.slice(-8)}`,
      html: createStatusUpdateEmailHTML(orderData, newStatus),
    });

    if (result.success) {
      console.log(`✅ Email Resend envoyé à ${orderData.customer_email}. MessageId: ${result.messageId}`);
    }

    return result;
  } catch (error: any) {
    console.error('❌ Erreur d\'envoi email Resend:', error);
    return { success: false, error: error.message };
  }
};

export const sendOrderConfirmationEmail = async (orderData: any): Promise<EmailSendResult> => {
  try {
    const itemsHtml = (orderData.items || []).map((item: any) => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.title}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.count}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">${(item.price || 0).toFixed(2)}€</td>
      </tr>
    `).join('');

    const result = await sendWithResend({
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
            <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
              <thead>
                <tr style="background: #f8fafc;"><th style="padding: 10px; text-align: left;">Produit</th><th style="padding: 10px; text-align: center;">Qté</th><th style="padding: 10px; text-align: right;">Prix</th></tr>
              </thead>
              <tbody>${itemsHtml}</tbody>
            </table>
          </div>
        </div>
      `,
    });

    return result;
  } catch (error: any) {
    console.error('❌ Erreur d\'envoi confirmation Resend:', error);
    return { success: false, error: error.message };
  }
};
