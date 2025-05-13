import { useEffect, useState, useContext } from "react";
import Link from "next/link";
import Cookies from "js-cookie";
import Banner from "../../styles/banner/Banner";
import styles from "../../styles/order.module.css";
import { CartContext } from "@/store/CartContext"; // If you want to use cart context too

const Order = () => {
  const customer_id = Cookies.get("customer");
  const customer_name = Cookies.get("customerName");

  const [order, setOrder] = useState(null);
  const [deliveryCost, setDeliveryCost] = useState(0);

  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [payment, setPayment] = useState("");

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        // Example: Fetch the most recent order for this customer
        const res = await fetch(`/api/orders?id=${customer_id}`);
        const data = await res.json();
        if (res.ok) {
          setOrder(data);
          setPhone(data.phone);
          setEmail(data.email);
          setAddress(data.address);
          setCity(data.city);
          setPayment(data.payment);
          setDeliveryCost(data.deliveryCost || (data.city === "Gulberg" ? 80 : 100));
        } else {
          console.error("Error fetching order", data.message);
        }
      } catch (error) {
        console.error("Failed to load order:", error);
      }
    };

    if (customer_id) {
      fetchOrder();
    }
  }, [customer_id]);

  const submitHandler = (e) => {
    e.preventDefault();
    alert("Order submitted!");
  };

  const calculateTotal = () => {
    if (!order) return 0;
    return order.items.reduce((sum, item) => sum + item.price * item.quantity, 0) + deliveryCost;
  };

  return (
    <>
      <Banner title="Order" subtitle="Place Order" />
      <section className={styles.order}>
        <div className="container">
          <div className={styles.orderItems}>
            {order ? (
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
                  {order.items.map((item, index) => (
                    <tr key={index}>
                      <td><img src={item.thumb || "/foods/sample.jpg"} alt="food" width={50} /></td>
                      <td>{item.name}</td>
                      <td>Rs. {item.price}</td>
                      <td>{item.quantity}</td>
                      <td>Rs. {item.price * item.quantity}</td>
                    </tr>
                  ))}
                  <tr className="fw-bold">
                    <td colSpan="4">Sub-Total</td>
                    <td>Rs. {order.total_price - deliveryCost}</td>
                  </tr>
                  <tr className="fw-bold">
                    <td colSpan="4">Delivery Cost</td>
                    <td>Rs. {deliveryCost}</td>
                  </tr>
                  <tr className="fw-bold">
                    <td colSpan="4">Total Cost</td>
                    <td>Rs. {order.total_price}</td>
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
            ) : (
              <p>Loading order...</p>
            )}
          </div>

          <form className="px-5 py-3" onSubmit={submitHandler}>
            <fieldset>
              <legend>Delivery Details</legend>

              <label className="form-label">Phone Number</label>
              <input className="form-control mb-2" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required />

              <label className="form-label">Email</label>
              <input className="form-control mb-2" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />

              <label className="form-label">City</label>
              <input className="form-control mb-2" type="text" value={city} disabled />

              <label className="form-label">Address</label>
              <input className="form-control mb-2" type="text" value={address} onChange={(e) => setAddress(e.target.value)} required />

              <label className="form-label">Payment Method</label><br />
              <input className="form-control mb-2" type="text" value={payment} disabled />

              <button className="btn btn-success" type="submit">Confirm Order</button>
            </fieldset>
          </form>
        </div>
      </section>
    </>
  );
};

export default Order;
