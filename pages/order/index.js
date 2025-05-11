import { useEffect, useState } from "react";
import Link from "next/link";
import Cookies from "js-cookie";
import Banner from "../../styles/banner/Banner";
import styles from "../../styles/order.module.css";

const Order = () => {
  const customer_id = Cookies.get("customer");
  const customer_name = Cookies.get("customerName");

  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [payment, setPayment] = useState("");

  const deliveryCost = city === "Gulberg" ? 80 : city ? 100 : 0;

  useEffect(() => {
    if (customer_id) {
      setPhone("03001234567");
      setEmail("user@example.com");
      setAddress("123 Street, Lahore");
    }
  }, [customer_id]);

  const submitHandler = (e) => {
    e.preventDefault();
    alert("Order submitted!");
  };

  return (
    <>
      <Banner title="Order" subtitle="Place Order" />
      <section className={styles.order}>
        <div className="container">
          <div className={styles.orderItems}>
            <table>
              <thead>
                <tr>
                  <th>Food</th>
                  <th>Title</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <img src="/foods/sample.jpg" alt="food" width={50} />
                  </td>
                  <td>Sample Dish</td>
                  <td>Rs. 500</td>
                  <td>2</td>
                  <td>Rs. 1000</td>
                </tr>
                <tr className="fw-bold">
                  <td colSpan="4">Sub-Total</td>
                  <td>Rs. 1000</td>
                </tr>
                <tr className="fw-bold">
                  <td colSpan="4">Delivery Cost</td>
                  <td>Rs. {deliveryCost}</td>
                </tr>
                <tr className="fw-bold">
                  <td colSpan="4">Total Cost</td>
                  <td>Rs. {1000 + deliveryCost}</td>
                </tr>
                <tr>
                  <td colSpan="5">
                    <span className="text-muted">
                      (Delivery cost Rs 80 for inside Gulberg and Rs 100 for outside)
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <form className="px-5 py-3" onSubmit={submitHandler}>
            <fieldset>
              <legend>Delivery Details</legend>

              <label className="form-label">Phone Number</label>
              <input className="form-control mb-2" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required />

              <label className="form-label">Email</label>
              <input className="form-control mb-2" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />

              <label className="form-label">City</label>
              <select className="form-select mb-2" value={city} onChange={(e) => setCity(e.target.value)} required>
                <option value="">Select</option>
                <option value="Gulberg">Gulberg</option>
                <option value="Johar Town">Johar Town</option>
                <option value="Defence">Defence</option>
                <option value="Valencia Town">Valencia Town</option>
                <option value="Bahria Town">Bahria Town</option>
                <option value="Lake City">Lake City</option>
                <option value="Walton">Walton</option>
                <option value="Township">Township</option>
              </select>

              <label className="form-label">Address</label>
              <input className="form-control mb-2" type="text" value={address} onChange={(e) => setAddress(e.target.value)} required />

              <label className="form-label">Payment Method</label><br />
              <div className="form-check">
                <input className="form-check-input" type="radio" name="payment" value="Credit Card" onChange={(e) => setPayment(e.target.value)} required />
                <label className="form-check-label">Credit Card</label>
              </div>
              <div className="form-check">
                <input className="form-check-input" type="radio" name="payment" value="Bank Transfer" onChange={(e) => setPayment(e.target.value)} required />
                <label className="form-check-label">Bank Transfer</label>
              </div>
              <div className="form-check mb-3">
                <input className="form-check-input" type="radio" name="payment" value="Cash On Delivery" onChange={(e) => setPayment(e.target.value)} required />
                <label className="form-check-label">Cash On Delivery</label>
              </div>

              <button className="btn btn-success" type="submit">Confirm Order</button>
            </fieldset>
          </form>
        </div>
      </section>
    </>
  );
};

export default Order;
