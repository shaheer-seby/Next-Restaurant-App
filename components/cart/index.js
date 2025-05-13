import { useContext, useState } from 'react';
import CartContext from '@/context/context';
import Link from 'next/link';
function CartPage() {
  const cart = useContext(CartContext);
  const [address, setAddress] = useState(cart.address);
  const [phone, setPhone] = useState(cart.phone);
  console.log('cart', cart.cartItems);
  const total = cart.cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  async function getPayment() {
  if (!address.trim() || !phone.trim()) {
    alert("Please enter both address and phone number.");
    return;
  }
  
if (cart.cartItems.length > 0) {
        fetch('/api/orders/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            items: cart.cartItems,
            customer_id: cart.uid,
            address: cart.address,
            phone: cart.phone,
          
          }),
        })
          .then((res) => res.json())
          .then((data) => {
            console.log('Order saved:', data);
          })
          .catch((err) => {
            console.error('Error saving order:', err);
          });
      }
  console.log("cart folder",cart.cartItems)
  const line_items = cart.cartItems.map(item => ({
    price: item.prod_id, // assumes each item has a valid `stripePriceId`
    quantity: item.quantity,
  }));

  try {
    const res = await fetch('/api/checkout_sessions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ line_items, address, phone }),
    });

    const data = await res.json();
    console.log('data',data)
    if (data.url) {
      window.location.href = data.url;
    } else {
      console.error("Stripe session creation failed", data);
    }
  } catch (error) {
    console.error("Payment error:", error);
    alert("Something went wrong. Please try again.");
  }
}

  return (
    <div
      style={{
        background: 'linear-gradient(to bottom right, #fef2f2, #ffe5d9)',
        padding: '3rem 1rem',
        fontFamily: 'sans-serif',
      }}
    >
      <div
        style={{
          maxWidth: '960px',
          margin: '0 auto',
          backgroundColor: '#fffaf3',
          padding: '2rem',
          borderRadius: '1.5rem',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
          border: '1px solid #f5d0c5',
        }}
      >
        <h1
          style={{
            fontSize: '2.5rem',
            fontWeight: '800',
            textAlign: 'center',
            color: '#e6007e',
            marginBottom: '2.5rem',
          }}
        >
          🛒 Your Cart
        </h1>

         

        {cart.cartItems.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#6b7280', fontStyle: 'italic' }}>
            Your cart is empty. Start adding items! 🧃
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {cart.cartItems.map((item) => (
              <div
                key={item.name}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  backgroundColor: '#fff1f3',
                  padding: '1rem',
                  borderRadius: '1.25rem',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
                }}
              >
                <div>
                  <h2 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1f2937', marginRight:'20px' }}>
                    {item.name}
                  </h2>
                  <p style={{ color: '#6b7280', marginTop: '0.25rem' }}>
                    PKR {item.price.toFixed(2)} × {item.quantity} ={' '}
                    <span style={{ fontWeight: '700', color: '#ff6b6b',marginRight:'30px' }}>
                      PKR {(item.price * item.quantity).toFixed(2)}
                    </span>
                  </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <button
                    onClick={() => cart.deleteItem(item)}
                    style={{
                      width: '2.5rem',
                      height: '2.5rem',
                      borderRadius: '9999px',
                      backgroundColor: '#ffcccb',
                      color: '#dc2626',
                      fontWeight: '700',
                      fontSize: '1.25rem',
                      border: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    −
                  </button>
                  <span style={{ fontSize: '1rem', fontWeight: '500' }}>{item.quantity}</span>
                  <button
                    onClick={() => cart.addItem(item)}
                    style={{
                      width: '2.5rem',
                      height: '2.5rem',
                      borderRadius: '9999px',
                      backgroundColor: '#ffedd5',
                      color: '#059669',
                      fontWeight: '700',
                      fontSize: '1.25rem',
                      border: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div
          style={{
            marginTop: '3rem',
            textAlign: 'center',
            padding: '1.5rem',
            backgroundColor: '#ffe9e2',
            borderRadius: '1rem',
            fontSize: '1.5rem',
            fontWeight: '700',
            color: '#e6007e',
            boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.05)',
          }}
        >
          Total: PKR {total.toFixed(2)}
        </div>

<div
  style={{
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginTop: "20px",
    gap: "10px", // Optional: adds space between elements
  }}
>
  <label className="form-label">Address</label>
  <input
    className="form-control mb-2"
    type="text"
    value={address}
    onChange={(e) => setAddress(e.target.value)}
    required
    style={{ width: "300px" }}
  />

  <label className="form-label">Phone</label>
  <input
    className="form-control mb-2"
    type="text"
    value={phone}
    onChange={(e) => setPhone(e.target.value)}
    required
    style={{ width: "300px" }}
  />

    {address.trim() !== "" && phone.trim() !== "" ? (
    <button
      onClick={getPayment}
      style={{
        display: "inline-block",
        padding: "12px 24px",
        backgroundColor: "#22c55e",
        color: "#fff",
        fontWeight: "bold",
        borderRadius: "10px",
        textDecoration: "none",
        boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
        marginTop: "10px",
      }}
    >
      <i className="fas fa-shopping-cart" style={{ marginRight: "8px" }}></i>
      Place Order
    </button>
  ) : (
    <button
      disabled
      style={{
        display: "inline-block",
        padding: "12px 24px",
        backgroundColor: "#d1d5db", // gray background
        color: "#9ca3af", // gray text
        fontWeight: "bold",
        borderRadius: "10px",
        textDecoration: "none",
        boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
        marginTop: "10px",
        border: "none",
        cursor: "not-allowed",
      }}
    >
      <i className="fas fa-shopping-cart" style={{ marginRight: "8px" }}></i>
      Enter Details to Order
    </button>)}

    </div>
</div>
</div>
  );
}

export default CartPage;
