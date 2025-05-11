// File: /pages/api/checkout_sessions.js

import { stripe } from '../../../lib/stripe';

export default async function handler(req, res) {
  // if (req.method !== 'POST') {
  //   return res.status(405).json({ error: 'Method not allowed' });
  // }

  try {
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: 'price_1PGytRJRoEbhRvRPD692b7yn',
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `http://localhost:3000/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `http://localhost:3000/?canceled=true`,
    });

    res.status(200).json({ url: session.url });
  } catch (err) {
    res.status(err.statusCode || 500).json({ error: err.message });
  }
}
