import { useState } from "react";
import Link from "next/link";
import styles from "./loginStyles.js"; 

export default function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [conPassword, setConPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const submitHandler = (e) => {
    e.preventDefault();

    if (password !== conPassword) {
      console.log("Confirm password doesn't match.");
      return;
    }

    console.log("SignUp submitted", { name, email, password, phone, address });
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
      <h1 style={styles.heading}>FastFoods</h1>
      <img src="/food.png" alt="avatar" style={styles.avatar} />
     
        {/* <h2 style={styles.heading}>Register</h2> */}
        <form onSubmit={submitHandler} style={styles.form}>
          <input
            type="text"
            placeholder="Name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={styles.input}
          />
          <input
            type="email"
            placeholder="Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
          />
          <input
            type="password"
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
          />
          <input
            type="password"
            placeholder="Confirm Password"
            required
            value={conPassword}
            onChange={(e) => setConPassword(e.target.value)}
            style={styles.input}
          />
          <input
            type="tel"
            placeholder="Phone"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            style={styles.input}
          />
          <input
            type="text"
            placeholder="Address"
            required
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            style={styles.input}
          />
          
          <button type="submit" style={styles.buttonPrimary}>
            Register
          </button>
          <Link href="/login/login" passHref>
            <button type="button" style={styles.buttonSecondary}>
              Already have an account? Login
            </button>
          </Link>
        </form>
      </div>
    </div>
  );
}
