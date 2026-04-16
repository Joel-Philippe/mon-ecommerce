// 📧 Service d'email avec Resend - Intégration directe
import { Resend } from 'resend';

// Interface pour les données d'email de commande
interface OrderEmailData {
  customerName: string;
  customerEmail: string;
  orderDate: string;
  items: Array<{
    title: string;
    count: number;
    price: number;
    total: number;
  }>;
  totalPaid: number;
  deliveryInfo: {
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
    phone: string;
    email?: string;
    notes?: string;
  };
  sessionId: string;
}

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
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mise à jour de votre commande - To Easy Service</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        body { font-family: 'Inter', sans-serif; line-height: 1.6; margin: 0; background: #f8fafc; color: #1a202c; padding: 40px 20px; }
        .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.05); }
        .header { background: linear-gradient(315deg,#FF9800 0%,#f91bf8 100%); color: white; padding: 40px; text-align: center; }
        .content { padding: 40px; }
        .status-box { background: #f1f5f9; border-radius: 16px; padding: 24px; text-align: center; margin: 24px 0; border: 1px solid #e2e8f0; }
        .status-icon { font-size: 48px; margin-bottom: 12px; }
        .status-label { font-size: 20px; font-weight: 700; color: #1e293b; display: block; }
        .status-msg { color: #64748b; font-size: 15px; margin-top: 8px; }
        .order-id { font-family: monospace; background: #e2e8f0; padding: 4px 8px; border-radius: 4px; font-size: 14px; }
        .footer { background: #f8fafc; padding: 32px; text-align: center; color: #64748b; font-size: 14px; }
        .btn { display: inline-block; background: #7c3aed; color: white; text-decoration: none; padding: 12px 24px; border-radius: 12px; font-weight: 600; margin-top: 24px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1 style="margin:0;font-size:24px;">To Easy Service</h1>
        </div>
        <div class="content">
            <h2 style="margin-top:0;">Bonjour ${orderData.displayName || 'Client'},</h2>
            <p>Il y a du nouveau concernant votre commande <span class="order-id">#${orderData.id?.slice(-8)}</span>.</p>
            
            <div class="status-box">
                <div class="status-icon">${statusIcons[newStatus] || '🔔'}</div>
                <span class="status-label">Statut : ${statusLabels[newStatus] || newStatus}</span>
                <p class="status-msg">${statusMessages[newStatus] || 'Le statut de votre commande a été mis à jour.'}</p>
            </div>

            <p>Nous vous tiendrons informé de chaque étape importante jusqu'à la réception de vos services.</p>
            
            <div style="text-align:center;">
                <a href="https://to-easy-service.com/account" class="btn">Suivre ma commande</a>
            </div>
        </div>
        <div class="footer">
            <p>Merci de votre confiance,<br>L'équipe To Easy Service</p>
        </div>
    </div>
</body>
</html>`;
};

// 📧 Envoyer un email de mise à jour de statut
export const sendStatusUpdateEmail = async (orderData: any, newStatus: string) => {
  try {
    if (!process.env.RESEND_API_KEY) return { success: false, error: 'API Key missing' };
    
    const emailPayload = {
      from: 'To Easy Service <onboarding@resend.dev>',
      to: [orderData.customer_email],
      subject: `Mise à jour de votre commande #${orderData.id?.slice(-8)}`,
      html: createStatusUpdateEmailHTML(orderData, newStatus),
    };

    const result = await resend.emails.send(emailPayload);
    return { success: true, data: result };
  } catch (error) {
    console.error('❌ Erreur envoi email statut:', error);
    return { success: false, error };
  }
};

// 🔧 Initialisation de Resend
const resend = new Resend(process.env.RESEND_API_KEY);

// 🎨 Template HTML moderne et responsive pour l'email
const createOrderEmailHTML = (orderData: OrderEmailData): string => {
  return `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Confirmation de commande - To Easy Service</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        
        body { 
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6; 
            margin: 0 auto;
            padding: 0;
            background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
            color: #1a202c;
            padding: 40px 20px;
        }
        
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background: #ffffff;
            border-radius: 24px;
            box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
            overflow: hidden;
        }
        
        .header { 
            background: linear-gradient(315deg,#FF9800 0%,#f91bf8 100%);
            color: white; 
            padding: 50px 40px; 
            text-align: center; 
            position: relative;
            overflow: hidden;
            border-radius: 24px 24px 0 0;
        }
        
        .header::before {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="white" opacity="0.1"/><circle cx="75" cy="75" r="1" fill="white" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
            animation: float 20s ease-in-out infinite;
        }
        
        .header-content {
            position: relative;
            z-index: 2;
        }
        
        .logo {
            font-size: 32px;
            font-weight: 700;
            margin-bottom: 8px;
            letter-spacing: -0.5px;
        }
        
        .header-subtitle {
            font-size: 16px;
            opacity: 0.9;
            font-weight: 300;
        }
        
        .success-badge {
            display: inline-flex;
            align-items: center;
            background: rgba(16, 185, 129, 0.1);
            padding: 8px 16px;
            border-radius: 50px;
            font-size: 14px;
            font-weight: 500;
            margin: 20px 0;
        }
        
        .main-content {
            padding: 50px 40px;
            background: #ffffff;
        }
        
        .section {
            margin-bottom: 40px;
        }
        
        .section-title {
            font-size: 20px;
            font-weight: 600;
            color: #89809a;
            margin-bottom: 24px;
            display: flex;
            align-items: center;
            gap: 12px;
        }
        
        .order-info-card {
            border-radius: 20px;
            padding: 32px;
            position: relative;
            overflow: hidden;
        }
        
        .order-info-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 6px;
            height: 100%;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 0 3px 3px 0;
        }
        
        .order-detail {
            display: grid;
            justify-content: space-between;
            align-items: center;
            padding: 12px 0;
            border-bottom: 1px solid rgba(226, 232, 240, 0.5);
        }
        
        .order-detail:last-child {
            border-bottom: none;
            padding-bottom: 0;
        }
        
        .order-detail-label {
            font-weight: 500;
            color: #64748b;
            font-size: 15px;
        }
        
        .order-detail-value {
            font-weight: 600;
            color: #89809a;
            font-size: 15px;
        }
        
        .items-grid {
            display: grid;
            gap: 20px;
        }
        
        .item-card { 
            border-radius: 18px;
            padding: 28px; 
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
        }
        
        .item-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 4px;
            background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
            border-radius: 2px 2px 0 0;
        }
        
        .item-header {
            display: contents;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 16px;
        }
        
        .item-title {
            font-weight: 600;
            color: #89809a;
            font-size: 17px;
            line-height: 1.4;
            flex: 1;
            margin-right: 20px;
        }
        
        .item-price {
            font-weight: 700;
            color: #888282;
            font-size: 17px;
            white-space: nowrap;
        }
        
        .item-details {
            display: flex;
            justify-content: space-between;
            align-items: center;
            color: #64748b;
            font-size: 15px;
        }
        
        .item-quantity {
            margin-right: 10px;
            border-radius: 25px;
            font-weight: 500;
            color: #475569;
        }
        
        .total-section { 
            background: #f8ede9;
            color: blueviolet;
            padding: 40px;
            border-radius: 22px;
            margin: 40px 0;
            text-align: center;
            position: relative;
            overflow: hidden;
            box-shadow: 0 8px 30px rgba(26, 32, 44, 0.3);
        }
        
        .total-section::before {
            content: '';
            position: absolute;
            top: -50%;
            right: -50%;
            width: 200%;
            height: 200%;
            background: radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px);
            background-size: 20px 20px;
            animation: sparkle 15s linear infinite;
        }
        
        .total-content {
            position: relative;
            z-index: 2;
        }
        
        .total-label {
            font-size: 16px;
            opacity: 0.9;
            margin-bottom: 12px;
            font-weight: 300;
        }
        
        .total-amount { 
            font-size: 48px; 
            font-weight: 800; 
            margin-bottom: 12px;
            letter-spacing: -1px;
        }
        
        .delivery-section {
            border-radius: 20px;
            padding: 32px;
            position: relative;
            box-shadow: 0 4px 20px rgba(16, 185, 129, 0.1);
        }
        
        .delivery-section::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 6px;
            height: 100%;
            background: #10b981;
            border-radius: 0 3px 3px 0;
        }
        
        .delivery-title {
            color: #065f46;
            font-weight: 600;
            margin-bottom: 20px;
            font-size: 18px;
        }
        
        .delivery-card {
            background: #ffffff;
            padding: 24px;
            border-radius: 16px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
        }
        
        .delivery-name {
            font-weight: 600;
            color: #607D8B;
            margin-bottom: 12px;
            font-size: 17px;
        }
        
        .delivery-address {
            color: #4b5563;
            line-height: 1.5;
            margin-bottom: 6px;
            font-size: 15px;
        }
        
        .delivery-contact {
            color: #6b7280;
            font-size: 15px;
            margin-top: 16px;
            padding-top: 16px;
        }
        
        .footer {
            background: #f8fafc;
            padding: 50px 40px;
            text-align: center;
            border-radius: 0 0 24px 24px;
        }
        
        .footer-title {
            font-size: 26px;
            font-weight: 700;
            color: white;
            margin-bottom: 16px;
            background: -webkit-linear-gradient(315deg, #FF9800 0%, #f91bf8 100%);
            border-radius: 8px;
        }
        
        .footer-subtitle {
            color: #64748b;
            margin-bottom: 32px;
            font-size: 17px;
        }
        
        .contact-info {
            display: contents;
            justify-content: center;
            gap: 40px;
            margin-bottom: 32px;
            flex-wrap: wrap;
        }
        
        .contact-item {
            display: inline-table;
            align-items: center;
            gap: 10px;
            color: #475569;
            font-size: 15px;
            background: #ffffff;
            padding: 12px 20px;
            border-radius: 25px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        }
        
        .social-links {
            display: flex;
            justify-content: center;
            gap: 20px;
            margin-bottom: 32px;
        }
        
        .social-link {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 48px;
            height: 48px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            text-decoration: none;
            border-radius: 50%;
            transition: transform 0.3s ease;
            box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
        }
        
        .social-link:hover {
            transform: scale(1.15);
        }
        
        .footer-note {
            font-size: 13px;
            color: #9ca3af;
            line-height: 1.5;
            max-width: 400px;
            margin: 0 auto;
            background: #ffffff;
            padding: 20px;
            border-radius: 16px;
        }
        
        .divider {
            height: 1px;
            background: linear-gradient(90deg, transparent 0%, #e2e8f0 50%, transparent 100%);
            margin: 32px 0;
        }
        
        @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-10px) rotate(180deg); }
        }
        
        @keyframes sparkle {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
        }
        
        @media (max-width: 600px) {
            body { padding: 20px 10px; }
            .email-container { margin: 0; border-radius: 16px; }
            .header { padding: 32px 24px; border-radius: 16px 16px 0 0; }
            .main-content, .footer { padding: 32px 24px; }
            .footer { border-radius: 0 0 16px 16px; }
            .total-section { padding: 32px 24px; }
            .total-amount { font-size: 36px; }
            .contact-info { flex-direction: column; gap: 12px; }
            .item-header { flex-direction: column; align-items: flex-start; gap: 8px; }
            .item-title { margin-right: 0; }
            .order-info-card, .delivery-section { padding: 24px; }
            .item-card { padding: 20px; }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <!-- Header -->
        <div class="header">
            <div class="header-content">
                <div class="logo">To Easy</div>
                <div class="header-subtitle"></div>
                <div class="success-badge">
                    ✓ Commande confirmée
                </div>
            </div>
        </div>

        <!-- Main Content -->
        <div class="main-content">
            <!-- Order Information -->
            <div class="section">
                <h2 class="section-title">
                    📋 
                </h2>
                <div class="order-info-card">
                    <div class="order-detail">
                        <span class="order-detail-label">Client</span>
                        <span class="order-detail-value">${orderData.customerName}</span>
                    </div>
                    <div class="order-detail">
                        <span class="order-detail-label">Email</span>
                        <span class="order-detail-value">${orderData.customerEmail}</span>
                    </div>
                    <div class="order-detail">
                        <span class="order-detail-label">Date de commande</span>
                        <span class="order-detail-value">${orderData.orderDate}</span>
                    </div>
                    <div class="order-detail">
                        <span class="order-detail-label">Numéro de commande</span>
                        <span class="order-detail-value">#${orderData.sessionId.slice(-8)}</span>
                    </div>
                </div>
            </div>

            <!-- Items -->
            <div class="section">
                <h2 class="section-title">
                    🛍️ 
                </h2>
                <div class="items-grid">
                    ${orderData.items.map(item => `
                        <div class="item-card">
                            <div class="item-header">
                                <div class="item-title">${item.title}</div>
                                <div class="item-price">${item.total.toFixed(2)}€</div>
                            </div>
                            <div class="item-details">
                                <div class="item-quantity">Quantité: ${item.count}</div>
                                <div>Prix unitaire: ${item.price.toFixed(2)}€</div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>

            <!-- Total -->
            <div class="total-section">
                <div class="total-content">
                    <div class="total-label">Total payé</div>
                    <div class="total-amount">${orderData.totalPaid.toFixed(2)}€</div>
                </div>
            </div>

            <!-- Delivery Information -->
            <div class="section">
                <div class="delivery-section">
                    <h3 class="delivery-title">🚚 </h3>
                    <div class="delivery-card">
                        <div class="delivery-name">${orderData.deliveryInfo.firstName} ${orderData.deliveryInfo.lastName}</div>
                        <div class="delivery-address">${orderData.deliveryInfo.address}</div>
                        <div class="delivery-address">${orderData.deliveryInfo.postalCode} ${orderData.deliveryInfo.city}</div>
                        <div class="delivery-address">${orderData.deliveryInfo.country}</div>
                        <div class="delivery-contact">
                            📞 ${orderData.deliveryInfo.phone}
                            ${orderData.deliveryInfo.email ? `<br>📧 ${orderData.deliveryInfo.email}` : ''}
                            ${orderData.deliveryInfo.notes ? `<br><em>Note: ${orderData.deliveryInfo.notes}</em>` : ''}
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Footer -->
        <div class="footer">
            <h3 class="footer-title">Merci de votre confiance !</h3>
            <p class="footer-subtitle">Votre commande sera traitée dans les plus brefs délais</p>
            
            <div class="contact-info">
                <div class="contact-item">
                    📧 contact@ToEasy.com
                </div>
                <div class="contact-item">
                    📞 +33 1 23 45 67 89
                </div>
                <div class="contact-item">
                    🌐 www.ToEasy.com
                </div>
            </div>

            <div class="divider"></div>

            <div class="footer-note">
                Cet email a été envoyé automatiquement suite à votre commande.<br>
                Pour toute question, n'hésitez pas à contacter notre service client.<br>
                <strong>To Easy</strong> - Votre partenaire formation premium
            </div>
        </div>
    </div>
</body>
</html>`;
};

// 📧 Fonction principale d'envoi d'email avec Resend
export const sendOrderConfirmationEmail = async (orderData: OrderEmailData) => {
  try {
    console.log('📧 Envoi de l\'email de confirmation avec Resend...');

    // Vérifier que la clé API Resend est configurée
    if (!process.env.RESEND_API_KEY) {
      throw new Error('❌ RESEND_API_KEY non configurée dans les variables d\'environnement');
    }

    // Validation des données requises
    if (!orderData.customerEmail || !orderData.customerName) {
      throw new Error('❌ Données manquantes: customerEmail et customerName sont requis');
    }

    // Validation de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(orderData.customerEmail)) {
      throw new Error('❌ Format d\'email invalide');
    }

    console.log('✅ Validation des données réussie');
    console.log('📧 Destinataire:', orderData.customerEmail);
    console.log('👤 Nom:', orderData.customerName);
    console.log('💰 Total:', orderData.totalPaid);

    // Préparer le payload pour Resend
    const emailPayload = {
      from: 'To Easy Service <onboarding@resend.dev>', // Nom cohérent sans "Test"
      to: [orderData.customerEmail],
      subject: `Confirmation de votre commande #${orderData.sessionId.slice(-8)}`, // Sujet professionnel sans émojis
      html: createOrderEmailHTML(orderData),
      // Version texte de secours
      text: `
To Easy - Confirmation de commande

Bonjour ${orderData.customerName},

Nous vous confirmons la réception de votre commande.

Client: ${orderData.customerName}
Email: ${orderData.customerEmail}
Date: ${orderData.orderDate}
Numéro de commande: #${orderData.sessionId.slice(-8)}

Articles commandés:
${orderData.items.map(item => `- ${item.title} (${item.count}x) : ${item.total.toFixed(2)}€`).join('\n')}

Total payé: ${orderData.totalPaid.toFixed(2)}€

Livraison:
${orderData.deliveryInfo.firstName} ${orderData.deliveryInfo.lastName}
${orderData.deliveryInfo.address}
${orderData.deliveryInfo.postalCode} ${orderData.deliveryInfo.city}
${orderData.deliveryInfo.country}
${orderData.deliveryInfo.phone}

Cordialement,
L'équipe To Easy Service

---
To Easy Service
Email: contact@ToEasy.com
Téléphone: +33 1 23 45 67 89
      `
    };

    console.log('📧 Payload préparé pour Resend');
    console.log('📤 From:', emailPayload.from);
    console.log('📤 To:', emailPayload.to);
    console.log('📤 Subject:', emailPayload.subject);

    // Envoyer l'email avec Resend
    console.log('📤 Envoi en cours via Resend...');
    const result = await resend.emails.send(emailPayload);
    
    console.log('✅ === EMAIL ENVOYÉ AVEC SUCCÈS ===');
    console.log('📧 Résultat Resend:', result);
    console.log('📧 Message ID:', result.data?.id || 'Non fourni');
    console.log('📧 Destinataire:', orderData.customerEmail);
    console.log('💰 Montant:', orderData.totalPaid, '€');
    
    return { 
      success: true, 
      messageId: result.data?.id,
      provider: 'resend',
      result: result
    };

  } catch (error) {
    console.error('❌ === ERREUR ENVOI EMAIL ===');
    console.error('📝 Message:', error instanceof Error ? error.message : 'Erreur inconnue');
    console.error('📋 Stack:', error instanceof Error ? error.stack : 'Pas de stack');
    
    // Diagnostic spécifique selon le type d'erreur
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        console.error('🔑 PROBLÈME: Clé API Resend invalide ou manquante');
        console.error('🔧 SOLUTION: Vérifiez RESEND_API_KEY dans .env.local');
      } else if (error.message.includes('domain')) {
        console.error('🌐 PROBLÈME: Domaine d\'envoi non vérifié');
        console.error('🔧 SOLUTION: Utilisez onboarding@resend.dev pour les tests');
      } else if (error.message.includes('rate limit')) {
        console.error('⏱️ PROBLÈME: Limite de taux dépassée');
        console.error('🔧 SOLUTION: Attendez quelques minutes avant de réessayer');
      }
    }
    
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Erreur inconnue',
      provider: 'resend'
    };
  }
};

// 📧 Fonction pour envoyer un email de test
export const sendTestEmail = async (testEmail: string) => {
  try {
    console.log('🧪 Envoi d\'un email de test vers:', testEmail);

    if (!process.env.RESEND_API_KEY) {
      throw new Error('❌ RESEND_API_KEY non configurée');
    }

    const testOrderData: OrderEmailData = {
      customerName: 'Test User',
      customerEmail: testEmail,
      orderDate: new Date().toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      items: [
        {
          title: 'Produit de test - Formation Premium',
          count: 1,
          price: 29.99,
          total: 29.99
        },
        {
          title: 'Bonus - Guide PDF',
          count: 2,
          price: 9.99,
          total: 19.98
        }
      ],
      totalPaid: 49.97,
      deliveryInfo: {
        firstName: 'Test',
        lastName: 'User',
        address: '123 Rue de Test',
        city: 'Paris',
        postalCode: '75001',
        country: 'France',
        phone: '+33 1 23 45 67 89',
        email: testEmail,
        notes: 'Ceci est un test d\'envoi d\'email de confirmation'
      },
      sessionId: 'test_' + Date.now()
    };

    return await sendOrderConfirmationEmail(testOrderData);

  } catch (error) {
    console.error('❌ Erreur email de test:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Erreur inconnue' 
    };
  }
};

// 📧 Fonction pour vérifier la configuration Resend
export const verifyResendConfig = async () => {
  try {
    console.log('🔍 Vérification de la configuration Resend...');
    
    if (!process.env.RESEND_API_KEY) {
      return { 
        success: false, 
        error: '❌ RESEND_API_KEY non configurée dans les variables d\'environnement' 
      };
    }

    // Test simple de l'API Resend
    const testResult = await resend.emails.send({
      from: 'test@resend.dev',
      to: ['test@example.com'],
      subject: 'Test de configuration',
      html: '<p>Test</p>',
      // Mode test - ne sera pas envoyé
    }).catch(error => {
      // Si l'erreur est liée à l'authentification, c'est que la clé est invalide
      if (error.message?.includes('API key')) {
        throw new Error('Clé API Resend invalide');
      }
      // Autres erreurs sont acceptables pour ce test
      return { data: { id: 'test' } };
    });

    console.log('✅ Configuration Resend valide !');
    return { 
      success: true, 
      message: '✅ Configuration Resend valide' 
    };
    
  } catch (error) {
    console.error('❌ Erreur de vérification Resend:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Erreur inconnue' 
    };
  }
};

// 📧 Fonction utilitaire pour formater les emails
export const formatEmailForDisplay = (email: string): string => {
  if (!email) return '';
  
  const [localPart, domain] = email.split('@');
  if (!domain) return email;
  
  // Masquer une partie de l'email pour la confidentialité
  const maskedLocal = localPart.length > 3 
    ? localPart.substring(0, 2) + '*'.repeat(localPart.length - 3) + localPart.slice(-1)
    : localPart;
    
  return `${maskedLocal}@${domain}`;
};

// 📧 Fonction pour valider un email
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};