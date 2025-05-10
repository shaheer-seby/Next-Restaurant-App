import { useState } from "react";
import Link from "next/link";
import styles from "./loginStyles.js"; 


export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submitHandler = (e) => {
    e.preventDefault();
    console.log("Login submitted", { email, password });
    // Backend code commented for now
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
      <h1 style={styles.heading}>FastFoods</h1>
      <img src="/food.png" alt="avatar" style={styles.avatar} />
     
        {/* <h2 style={styles.heading}>Login</h2> */}
        <form onSubmit={submitHandler} style={styles.form}>
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
          <button type="submit" style={styles.buttonPrimary}>
            Login
          </button>
          <Link href="/login/signup" style={styles.link}>
            Create Account
          </Link>
        </form>
      </div>
    </div>
  );
}
