import { useEffect, useState } from 'react';
import Navbar from '../components/navbar';

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/orders');
      const data = await res.json();
      setOrders(data);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    }
  };

 const handleDelete = async (orderId) => {
  if (confirm("Are you sure you want to delete this order?")) {
    try {
      const res = await fetch(`http://localhost:3000/api/orders/${orderId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        console.log('Delete successful');
        setOrders(prev => prev.filter(order => order._id !== orderId));
      } else {
        const errorText = await res.text(); // read once
        console.error('Delete failed:', errorText);
      }
    } catch (error) {
      console.error('Delete error:', error);
    }
  }
};


  return (
    <>
      <Navbar />
      <div className="container mt-5">
        <h1 className="mb-4 text-center">Customer Orders</h1>
        <div className="row g-4">
          {orders.map(order => (
            <div className="col-md-6 col-lg-4" key={order._id}>
              <div className="card shadow-sm h-100">
                <div className="card-body">
                  <h5 className="card-title">{order.customer_name}</h5>
                  <p className="card-text mb-1"><strong>Order ID:</strong> {order.orderID}</p>
                 
                  <p className="card-text mb-1"><strong>Phone:</strong> {order.phone}</p>
                  <p className="card-text mb-1"><strong>Address:</strong> {order.address}</p>
                
                  <div className="card-text mb-1">
  <strong>Items:</strong>
  <ul className="mb-0 ps-3">
    {order.items.map((item, idx) => (
      <li key={idx}>
        {item.name} × {item.quantity} (${item.price})
      </li>
    ))}
  </ul>
</div>

                  <p className="card-text mb-1"><strong>Total:</strong> ${order.total_price.toFixed(2)}</p>
                  <button
                    className="btn btn-danger btn-sm mt-3"
                    onClick={() => handleDelete(order._id)}
                  >
                   Order Done
                  </button>
                </div>
                <div className="card-footer text-end">
                  <small className="text-muted">{order.payment}</small>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
