import { useContext } from 'react';
import CartContext from '@/context/context';

function CartPage() {
  const cart= useContext(CartContext);

  const total = cart.cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const dummyItems = [
    { id: 1, name: 'Wireless Headphones', price: 79.99 },
    { id: 2, name: 'Smart Watch', price: 129.99 },
    { id: 3, name: 'Bluetooth Speaker', price: 49.99 },
  ];

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(to bottom right, #f0f4ff, #fefeff)',
        padding: '3rem 1rem',
        fontFamily: 'sans-serif',
      }}
    >
      <div
        style={{
          maxWidth: '960px',
          margin: '0 auto',
          backgroundColor: 'white',
          padding: '2rem',
          borderRadius: '1.5rem',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e0e0e0',
        }}
      >
        <h1
          style={{
            fontSize: '2.5rem',
            fontWeight: '800',
            textAlign: 'center',
            color: '#4f46e5',
            marginBottom: '2.5rem',
          }}
        >
          🛒 Your Cart
        </h1>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '2.5rem' }}>
          {dummyItems.map((item) => (
            <button
              key={item.id}
              onClick={() => addItem(item)}
              style={{
                backgroundColor: '#6366f1',
                color: '#fff',
                padding: '0.75rem',
                borderRadius: '1rem',
                fontWeight: '600',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
              }}
            >
              ➕ Add {item.name}
            </button>
          ))}
        </div>

        {cart.cartItems.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#6b7280', fontStyle: 'italic' }}>
            Your cart is empty. Start adding items! 🧃
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {cartItems.map((item) => (
              <div
                key={item.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  backgroundColor: '#f9fafb',
                  padding: '1rem',
                  borderRadius: '1.25rem',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                }}
              >
                <div>
                  <h2 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1f2937' }}>
                    {item.name}
                  </h2>
                  <p style={{ color: '#6b7280', marginTop: '0.25rem' }}>
                    ${item.price.toFixed(2)} × {item.quantity} ={' '}
                    <span style={{ fontWeight: '700', color: '#4f46e5' }}>
                      ${(item.price * item.quantity).toFixed(2)}
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
                      backgroundColor: '#fee2e2',
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
                      backgroundColor: '#d1fae5',
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
            textAlign: 'right',
            padding: '1.5rem',
            backgroundColor: '#eef2ff',
            borderRadius: '1rem',
            fontSize: '1.5rem',
            fontWeight: '700',
            color: '#4338ca',
            boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.05)',
          }}
        >
          Total: ${total.toFixed(2)}
        </div>
      </div>
    </div>
  );
}

export default CartPage;
