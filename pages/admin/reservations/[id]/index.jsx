'use client'
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Navbar from '../../components/navbar';

export default function EditReservation() {
  const router = useRouter();
  const { id } = router.query;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    guests: '',
    notes: '',
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    fetch(`/api/reservations/${id}`)
      .then(res => res.json())
      .then(data => {
        setFormData({
          name: data.name || '',
          email: data.email || '',
          phone: data.phone || '',
          date: data.date || '',
          time: data.time || '',
          guests: data.guests || '',
          notes: data.notes || '',
        });
        setLoading(false);
      })
      .catch(err => {
        console.error('Error loading reservation:', err);
        setLoading(false);
      });
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`/api/reservations/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await res.json();
      if (res.ok) {
        alert('Reservation updated successfully!');
        router.push('/admin/reservations');
      } else {
        alert(result.message || 'Failed to update reservation.');
      }
    } catch (err) {
      console.error('Update error:', err);
      alert('An error occurred while updating.');
    }
  };

  return (
        <>
    <Navbar/>
    <div className="container mt-5">
      <h2>Edit Reservation</h2>

      {loading ? (
        <div className="text-center mt-4">
          <div className="spinner-border" role="status" />
        </div>
      ) : (
        <form className="mt-4" onSubmit={handleSubmit}>
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label">Name</label>
              <input type="text" name="name" className="form-control" value={formData.name} onChange={handleChange} required />
            </div>

            <div className="col-md-6">
              <label className="form-label">Email</label>
              <input type="email" name="email" className="form-control" value={formData.email} onChange={handleChange} required />
            </div>

            <div className="col-md-6">
              <label className="form-label">Phone</label>
              <input type="text" name="phone" className="form-control" value={formData.phone} onChange={handleChange} required />
            </div>

            <div className="col-md-3">
              <label className="form-label">Date</label>
              <input type="date" name="date" className="form-control" value={formData.date} onChange={handleChange} required />
            </div>

            <div className="col-md-3">
              <label className="form-label">Time</label>
              <input type="time" name="time" className="form-control" value={formData.time} onChange={handleChange} required />
            </div>

            <div className="col-md-3">
              <label className="form-label">Guests</label>
              <input type="number" name="guests" className="form-control" value={formData.guests} onChange={handleChange} required />
            </div>

            <div className="col-md-12">
              <label className="form-label">Notes</label>
              <textarea name="notes" className="form-control" value={formData.notes} onChange={handleChange} />
            </div>
          </div>

          <div className="mt-4">
            <button type="submit" className="btn btn-primary me-2">Update</button>
            <button type="button" className="btn btn-secondary" onClick={() => router.push('/admin/reservations')}>Cancel</button>
          </div>
        </form>
      )}
    </div>
    </>
  );
}
