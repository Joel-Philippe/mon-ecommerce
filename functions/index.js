const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { Resend } = require('resend');

admin.initializeApp();

const resend = new Resend(functions.config().resend.api_key);

exports.sendOrderConfirmation = functions.firestore
  .document('orders/{orderId}')
  .onCreate(async (snap, context) => {
    const order = snap.data();
    const orderId = context.params.orderId;

    // Ensure there are items to process
    if (!order.items || order.items.length === 0) {
      console.log(`Order ${orderId} has no items, skipping email.`);
      return;
    }

    // Generate an HTML list of items for the email body
    const itemsHtml = order.items.map(item =>
      `<tr>
        <td style="padding: 10px; border-bottom: 1px solid #ddd;">${item.title}</td>
        <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: center;">${item.quantity}</td>
        <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: right;">${(item.price * item.quantity).toFixed(2)}€</td>
      </tr>`
    ).join('');

    // Calculate total from the amount stored in cents
    const total = (order.amount / 100).toFixed(2);

    const mailOptions = {
      from: `Votre Boutique <${functions.config().email.user}>`,
      to: order.receiverEmail,
      subject: `Confirmation de votre commande #${orderId.substring(0, 6)}`,
      html: `
        <div style="font-family: Arial, sans-serif; color: #333;">
          <h1 style="color: #000;">Merci pour votre commande !</h1>
          <p>Bonjour,</p>
          <p>Nous avons bien reçu votre commande et nous la préparons pour l'expédition. Voici le récapitulatif :</p>
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <thead>
              <tr>
                <th style="padding: 10px; border-bottom: 2px solid #000; text-align: left;">Article</th>
                <th style="padding: 10px; border-bottom: 2px solid #000; text-align: center;">Quantité</th>
                <th style="padding: 10px; border-bottom: 2px solid #000; text-align: right;">Prix</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
            <tfoot>
              <tr>
                <td colspan="2" style="padding: 10px; text-align: right; font-weight: bold;">Total</td>
                <td style="padding: 10px; text-align: right; font-weight: bold;">${total}€</td>
              </tr>
            </tfoot>
          </table>
          <p>Merci de votre confiance.</p>
          <p>L'équipe de Votre Boutique</p>
        </div>
      `
    };

    try {
      const { data, error } = await resend.emails.send(mailOptions);

      if (error) {
        console.error(`Error sending email for order ${orderId}:`, JSON.stringify(error));
      } else {
        console.log(`Email sent successfully for order ${orderId}:`, data);
      }
    } catch (error) {
      console.error(`Unexpected error sending email for order ${orderId}:`, error);
    }
  });