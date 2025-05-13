// File: /pages/api/checkout_sessions.js

import { stripe } from '../../../lib/stripe';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { line_items, address, phone } = req.body;
    console.log('before line items: ',line_items)

for (let i = 0; i < line_items.length; i++) {
  const prices = await stripe.prices.list({
    product: line_items[i].price, // 'price' here is actually a product ID like 'prod_ABC123'
    active: true,
    limit: 1,
  });

  if (prices.data.length === 0) {
    throw new Error(`No active price found for product ${line_items[i].price}`);
  }

  line_items[i].price = prices.data[0].id; // Replace with actual price ID
}

    console.log('line items: ',line_items)

    const session = await stripe.checkout.sessions.create({
      line_items,
      mode: 'payment',
      success_url: `http://localhost:3000/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `http://localhost:3000/?canceled=true`,
      metadata: {
        address,
        phone,
      },
    });

    res.status(200).json({ url: session.url });
  } catch (err) {
    res.status(err.statusCode || 500).json({ error: err.message });
  }
}

