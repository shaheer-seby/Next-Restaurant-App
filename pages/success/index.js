import { useEffect, useState, useContext } from 'react';
import { useRouter } from 'next/router';
import confetti from 'canvas-confetti';
import CartContext from '@/context/context';
const SuccessPage = () => {
  const router = useRouter();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const cartCtx = useContext(CartContext);

  useEffect(() => {
    const fetchLatestOrder = async () => {
      try {
        const res = await fetch('/api/orders');
        const orders = await res.json();

        if (Array.isArray(orders) && orders.length > 0) {
          const latestOrder = orders[0]; 
          setOrder(latestOrder);
          cartCtx.setUser(latestOrder.customer_id, latestOrder.address, latestOrder.phone);
          confetti(); 
        } else {
          console.warn('No orders found');
        }
      } catch (error) {
        console.error('Failed to fetch latest order:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestOrder();
  }, []);

  return (
    <div className="d-flex flex-column justify-content-center align-items-center min-vh-100 bg-success text-white text-center p-4">
      <div className="shadow p-5 rounded bg-white text-dark" style={{ maxWidth: 600 }}>
        <h1 className="mb-3">🎉 Payment Successful!</h1>

        {loading && <p>Loading order summary...</p>}

        {order && (
          <>
            <p className="fs-5">
              Thank you for your purchase, <strong>{order.customer_name || 'Customer'}</strong>.
            </p>
            <p><strong>Order ID:</strong> {order.orderID}</p>
            <p><strong>Phone:</strong> {order.phone}</p>
            <p><strong>Address:</strong> {order.address}</p>
            <p><strong>Payment:</strong> {order.payment}</p>
            <p><strong>Total:</strong> Rs. {order.total_price}</p>

            <h5 className="mt-3">Items:</h5>
            <ul className="list-group text-start">
              {order.items.map((item, idx) => (
                <li key={idx} className="list-group-item">
                  {item.title} - Qty: {item.quantity} - Rs. {item.price}
                </li>
              ))}
            </ul>
          </>
        )}

        {!loading && !order && (
          <p>No recent order found.</p>
        )}

        <button onClick={() => router.push('/home')} className="btn btn-success mt-4">
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default SuccessPage;
