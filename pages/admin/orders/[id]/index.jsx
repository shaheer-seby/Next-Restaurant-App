import { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../../components/navbar';

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = () => {
    axios.get('http://localhost:3000/api/orders')
      .then(res => setOrders(res.data))
      .catch(err => console.error(err));
  };

  const handleEditClick = (order) => {
    setSelectedOrder(order);
    setFormData({ ...order });

  
    const modal = new bootstrap.Modal(document.getElementById('editModal'));
    modal.show();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:3000/api/orders/${selectedOrder._id}`, {
        ...formData,
        items: JSON.stringify(formData.items || []),
        oldThumb: selectedOrder.thumb,
      }, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
     
      const modalEl = document.getElementById('editModal');
      const modal = bootstrap.Modal.getInstance(modalEl);
      modal.hide();
      fetchOrders();
    } catch (error) {
      console.error(error);
      alert("Failed to update order.");
    }
  };

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
              <div className="card-footer d-flex justify-content-between align-items-center">
                <small className="text-muted">{order.payment}</small>
                <button className="btn btn-sm btn-outline-primary" onClick={() => handleEditClick(order)}>
                  Edit
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

     
      <div className="modal fade" id="editModal" tabIndex="-1" aria-labelledby="editModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <form onSubmit={handleSubmit}>
              <div className="modal-header">
                <h5 className="modal-title" id="editModalLabel">Edit Order</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Customer Name</label>
                  <input className="form-control" name="customer_name" value={formData.customer_name || ''} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input className="form-control" name="email" value={formData.email || ''} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                  <label className="form-label">Phone</label>
                  <input className="form-control" name="phone" value={formData.phone || ''} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                  <label className="form-label">City</label>
                  <input className="form-control" name="city" value={formData.city || ''} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                  <label className="form-label">Payment</label>
                  <input className="form-control" name="payment" value={formData.payment || ''} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                  <label className="form-label">Total Price</label>
                  <input className="form-control" type="number" name="total_price" value={formData.total_price || ''} onChange={handleChange} required />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                <button type="submit" className="btn btn-primary">Update Order</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
