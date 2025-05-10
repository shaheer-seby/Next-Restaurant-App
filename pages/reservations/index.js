import React, { useState } from "react";
import Swal from "sweetalert2";
import 'bootstrap/dist/css/bootstrap.min.css';
import Banner from "../../styles/banner/Banner"; // Adjust path based on your project

const Reservations = () => {
  const [reservation, setReservation] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    time: "",
    people: 1,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setReservation({
      ...reservation,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Mock submission logic
    console.log("Mock reservation data submitted:", reservation);

    Swal.fire({
      icon: "success",
      title: "Reservation Successful",
      text: "Your reservation has been made successfully!",
    });

    // Clear form
    setReservation({
      name: "",
      email: "",
      phone: "",
      date: "",
      time: "",
      people: 1,
    });
  };

  return (
    <>
      <Banner title="Reservation" subtitle="Book Your Reservation" />

      <div className="container py-5">
        <div className="mx-auto" style={{ maxWidth: "600px" }}>
          <h2 className="mb-4 text-center">Reserve a Table</h2>
          <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow-sm">
            <div className="mb-3">
              <label htmlFor="name" className="form-label">Name</label>
              <input
                type="text"
                className="form-control"
                id="name"
                placeholder="Enter your name"
                name="name"
                value={reservation.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email address</label>
              <input
                type="email"
                className="form-control"
                id="email"
                placeholder="Enter your email"
                name="email"
                value={reservation.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="phone" className="form-label">Phone number</label>
              <input
                type="tel"
                className="form-control"
                id="phone"
                placeholder="Enter your phone number"
                name="phone"
                value={reservation.phone}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="date" className="form-label">Reservation Date</label>
              <input
                type="date"
                className="form-control"
                id="date"
                name="date"
                value={reservation.date}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="time" className="form-label">Reservation Time</label>
              <input
                type="time"
                className="form-control"
                id="time"
                name="time"
                value={reservation.time}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="people" className="form-label">Number of People</label>
              <input
                type="number"
                className="form-control"
                id="people"
                name="people"
                value={reservation.people}
                onChange={handleChange}
                min="1"
                required
              />
            </div>

            <div className="d-grid">
              <button type="submit" className="btn btn-warning">
                Book Reservation
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Reservations;
