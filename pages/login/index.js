import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import Link from "next/link";
import styles from "./loginStyles.js";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const router = useRouter();

  const submitHandler = async (e) => {
  e.preventDefault();

  const result = await signIn("credentials", {
    redirect: false,
    email,
    password,
    callbackUrl: "/home", 
  });

  if (result.ok) {
    router.push(result.url);
  } else {
    setError("Invalid email or password");
  }
};


  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.heading}>FastFoods</h1>
        <img src="/food.png" alt="avatar" style={styles.avatar} />
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
          {error && <p style={{ color: "red" }}>{error}</p>}
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
