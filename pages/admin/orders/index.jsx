import { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/navbar';

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3000/api/orders')
      .then((res) => setOrders(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <>
    <Navbar/>
    <div className="container mt-5">
      <h1 className="mb-4 text-center">Customer Orders</h1>
      <div className="row g-4">
        {orders.map(order => (
          <div className="col-md-6 col-lg-4" key={order._id}>
            <div className="card shadow-sm h-100">
              {order.thumb ? (
                <img
                  src={`/uploads/orders/${order.thumb}`}
                  className="card-img-top"
                  alt="Order Thumbnail"
                  style={{ height: '200px', objectFit: 'cover' }}
                />
              ) : (
                <div className="bg-secondary text-white d-flex align-items-center justify-content-center" style={{ height: '200px' }}>
                  No Image
                </div>
              )}
              <div className="card-body">
                <h5 className="card-title">{order.customer_name}</h5>
                <p className="card-text mb-1"><strong>Order ID:</strong> {order.orderID}</p>
                <p className="card-text mb-1"><strong>Email:</strong> {order.email}</p>
                <p className="card-text mb-1"><strong>Phone:</strong> {order.phone}</p>
                <p className="card-text mb-1"><strong>City:</strong> {order.city}</p>
                <p className="card-text mb-1"><strong>Total:</strong> ${order.total_price.toFixed(2)}</p>
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
