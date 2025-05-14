import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../components/navbar';

export default function DeliveryMenAdmin() {
  const [deliveryMen, setDeliveryMen] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchDeliveryMen = async () => {
      try {
        const res = await fetch('/api/deliveryMan');
        const data = await res.json();

        if (Array.isArray(data)) {
          setDeliveryMen(data);
        } else {
          console.error('Unexpected response:', data);
          setDeliveryMen([]);
        }
      } catch (err) {
        console.error('Error fetching delivery men:', err);
        setDeliveryMen([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDeliveryMen();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleAddEdit = async (e) => {
    e.preventDefault();
    const method = isEditing ? 'PUT' : 'POST';
    const url = isEditing ? `/api/deliveryMan/${selectedId}` : '/api/deliveryMan';

    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      alert(isEditing ? 'Delivery boy updated' : 'Delivery boy added');
      setFormData({ name: '', email: '', phone: '', address: '' });
      setIsEditing(false);
      setSelectedId(null);
      fetchData(); // Refresh data
    } else {
      const data = await res.json();
      alert(data.message || 'Error occurred');
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this delivery boy?');
    if (confirmDelete) {
      const res = await fetch(`/api/deliveryMan/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        alert('Delivery boy deleted');
        fetchData(); 
      } else {
        const data = await res.json();
        alert(data.message || 'Error occurred');
      }
    }
  };

  const fetchData = async () => {
    try {
      const res = await fetch('/api/deliveryMan');
      const data = await res.json();
      setDeliveryMen(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching data:', err);
      setDeliveryMen([]);
    }
  };

  const handleEdit = (deliveryMan) => {
    setFormData({
      name: deliveryMan.name,
      email: deliveryMan.email,
      phone: deliveryMan.phone,
      address: deliveryMan.address,
    });
    setIsEditing(true);
    setSelectedId(deliveryMan._id);
  };

  return (
    <>
      <Navbar />
      <div className="container mt-5">
        <h2>Delivery Boy Management</h2>

        <form onSubmit={handleAddEdit} className="mt-4">
          <h3>{isEditing ? 'Edit Delivery Boy' : 'Add New Delivery Boy'}</h3>
          <div className="mb-3">
            <label className="form-label">Name</label>
            <input
              type="text"
              className="form-control"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Phone</label>
            <input
              type="tel"
              className="form-control"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Address</label>
            <input
              type="text"
              className="form-control"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary">
            {isEditing ? 'Update Delivery Boy' : 'Add Delivery Boy'}
          </button>
        </form>

        <div className="table-responsive mt-4">
          <h3 className="mt-5">Delivery Boy List</h3>
          {loading ? (
            <div className="text-center mt-4">
              <div className="spinner-border" role="status" />
            </div>
          ) : deliveryMen.length === 0 ? (
            <p>No delivery boys found.</p>
          ) : (
            <table className="table table-striped mt-4">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Address</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {deliveryMen.map((deliveryMan) => (
                  <tr key={deliveryMan._id}>
                    <td>{deliveryMan.name}</td>
                    <td>{deliveryMan.email}</td>
                    <td>{deliveryMan.phone}</td>
                    <td>{deliveryMan.address}</td>
                    <td>
                      <button
                        className="btn btn-warning me-2"
                        onClick={() => handleEdit(deliveryMan)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-danger"
                        onClick={() => handleDelete(deliveryMan._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
}
