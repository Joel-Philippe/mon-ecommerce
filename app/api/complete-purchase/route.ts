import { db } from '@/components/firebaseConfig';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ message: 'Method not allowed' }), { status: 405 });
  }

  const { email, items, displayName, photoURL } = await req.json();

  try {
    const docRef = await addDoc(collection(db, 'orders'), {
      customer_email: email,
      userDisplayName: displayName || "Anonyme",
      userPhotoURL: photoURL || "",
      items,
      createdAt: serverTimestamp(),
      status: 'paid',
    });

    const transporter = nodemailer.createTransport({
      service: 'hotmail',
      auth: {
        user: process.env.NEXT_PUBLIC_EMAIL_USER,
        pass: process.env.NEXT_PUBLIC_EMAIL_PASS,
      },
    });

    interface OrderItem {
      title: string;
      count: number;
      price: number;
      price_promo?: number;
      deliveryDate: string;
    }

    const generateOrderDetailsHtml = (orderDetails: OrderItem[]) => {
      return `
        <h2>Détails de votre commande</h2>
        <table style="width:100%; border-collapse: collapse;">
          <thead>
            <tr>
              <th style="border: 1px solid #dddddd; text-align: left; padding: 8px;">Produit</th>
              <th style="border: 1px solid #dddddd; text-align: left; padding: 8px;">Quantité</th>
              <th style="border: 1px solid #dddddd; text-align: left; padding: 8px;">Prix</th>
            </tr>
          </thead>
          <tbody>
            ${orderDetails.map(item => `
              <tr>
                <td style="border: 1px solid #dddddd; text-align: left; padding: 8px;">${item.title}</td>
                <td style="border: 1px solid #dddddd; text-align: left; padding: 8px;">${item.count}</td>
                <td style="border: 1px solid #dddddd; text-align: left; padding: 8px;">${item.price}€</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
    };

    const mailOptions = {
      from: process.env.NEXT_PUBLIC_EMAIL_USER,
      to: email,
      subject: 'Confirmation de commande',
      html: `
        <h1>Merci pour votre achat !</h1>
        <p>Voici les détails de votre commande :</p>
        ${generateOrderDetailsHtml(items)}
      `,
    };

    await transporter.sendMail(mailOptions);

    return new Response(JSON.stringify({ message: 'Purchase completed and email sent successfully' }), { status: 200 });
  } catch (error: any) {
    console.error('Error processing purchase:', error);
    return new Response(JSON.stringify({ message: `Error processing purchase: ${error.message}` }), { status: 500 });
  }
}