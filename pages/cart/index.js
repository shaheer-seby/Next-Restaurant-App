import { useContext } from 'react';
import CartContext from '@/context/context';

function CartPage() {
  const cart = useContext(CartContext);
  console.log('cart', cart.cartItems);
  const total = cart.cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const dummyItems = [
    { name: 'Wireless Headphones', price: 79.99 },
    { name: 'Smart Watch', price: 129.99 },
    { name: 'Bluetooth Speaker', price: 49.99 },
  ];

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(to bottom right, #fbe8e8, #fbded9)',
        padding: '3rem 1rem',
        fontFamily: 'sans-serif',
      }}
    >
      <div
        style={{
          maxWidth: '960px',
          margin: '0 auto',
          backgroundColor: '#fef2f1',
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
            color: '#ff6f61',
            marginBottom: '2.5rem',
          }}
        >
          🛒 Your Cart
        </h1>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '2.5rem' }}>
          {dummyItems.map((item) => (
            <button
              key={item.id}
              onClick={() => cart.addItem(item)}
              style={{
                backgroundColor: '#fbbf24',
                color: '#fff',
                padding: '0.75rem',
                borderRadius: '1rem',
                fontWeight: '600',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
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
            {cart.cartItems.map((item) => (
              <div
                key={item.name}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  backgroundColor: '#f9f0f2', 
                  padding: '1rem',
                  borderRadius: '1.25rem',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
                }}
              >
                <div>
                  <h2 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1f2937' }}>
                    {item.name}
                  </h2>
                  <p style={{ color: '#6b7280', marginTop: '0.25rem' }}>
                    ${item.price.toFixed(2)} × {item.quantity} ={' '}
                    <span style={{ fontWeight: '700', color: '#f76c5e' }}>
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
                      backgroundColor: '#ffb3b3', 
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
                      backgroundColor: '#fff0e6', 
                      color: '#4caf50',
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
            backgroundColor: '#fff5e6', 
            borderRadius: '1rem',
            fontSize: '1.5rem',
            fontWeight: '700',
            color: '#ff6f61',
            boxShadow: 'inset 0 2px 6px rgba(0, 0, 0, 0.05)',
          }}
        >
          Total: ${total.toFixed(2)}
        </div>
        <Link href="/order" style={{
            display: "inline-block",
            padding: "12px 24px",
            backgroundColor: "#22c55e",
            color: "#fff",
            fontWeight: "bold",
            borderRadius: "10px",
            textDecoration: "none",
            boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
          }}>
            <i className="fas fa-shopping-cart" style={{ marginRight: "8px" }}></i> Place Order
          </Link>
      </div>
    </div>
  );
}

export default CartPage;
