'use client'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../components/navbar';

export default function Reservations() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch('/api/reservations')
      .then(res => res.json())
      .then(data => {
        setReservations(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching reservations:', err);
        setLoading(false);
      });
  }, []);

  const handleEdit = (id) => {
    router.push(`/admin/reservations/${id}`);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this reservation?');
    if (confirmDelete) {
      try {
        const res = await fetch(`/api/reservations/${id}`, {
          method: 'DELETE',
        });
        const result = await res.json();
        if (res.ok) {
          alert('Reservation deleted successfully.');
          setReservations(reservations.filter(r => r._id !== id));
        } else {
          alert(result.message || 'Failed to delete reservation.');
        }
      } catch (err) {
        console.error('Delete error:', err);
        alert('An error occurred while deleting.');
      }
    }
  };

  return (
        <>
    <Navbar/>
    <div className="container mt-5">
      <h2>Reservations</h2>

      {loading ? (
        <div className="text-center mt-4">
          <div className="spinner-border" role="status" />
        </div>
      ) : reservations.length === 0 ? (
        <p>No reservations found.</p>
      ) : (
        <div className="table-responsive mt-4">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Date</th>
                <th>Time</th>
                <th>Guests</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {reservations.map((reservation) => (
                <tr key={reservation._id}>
                  <td>{reservation.name}</td>
                  <td>{reservation.email}</td>
                  <td>{reservation.date}</td>
                  <td>{reservation.time}</td>
                  <td>{reservation.guests}</td>
                  <td>
                    <button className="btn btn-info me-2" onClick={() => handleEdit(reservation._id)}>
                      Edit
                    </button>
                    <button className="btn btn-danger" onClick={() => handleDelete(reservation._id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
    </>
  );
}
