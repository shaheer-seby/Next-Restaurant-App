import { useState, useRef, useContext } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import CartContext from "@/context/context";
import { useSession } from 'next-auth/react';
import styles from './loginStyles';

async function createUser(email, password, name, phone, address) {
  try {
    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password, name, phone, address }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Something went wrong!');
    return data;
  } catch (error) {
    console.error('Create user error:', error);
    return { message: error.message || 'Unexpected error' };
  }
}

function AuthForm() {
  const { data: session } = useSession();
  const router = useRouter();
  const eref = useRef();
  const pref = useRef();
  const nref = useRef();
  const phref = useRef();
  const aref = useRef();
  const cartCtx = useContext(CartContext);

  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState('user'); 

  function switchAuthModeHandler() {
    setIsLogin(prev => !prev);
  }

  function isValidEmail(email) {
    return /^\S+@\S+\.\S+$/.test(email);
  }

  function isValidPhone(phone) {
    return /^\d{10,15}$/.test(phone);
  }

  async function submitHandler(event) {
    event.preventDefault();
    const email = eref.current.value.trim();
    const pass = pref.current.value.trim();
    const name = nref.current?.value.trim();
    const phone = phref.current?.value.trim();
    const address = aref.current?.value.trim();

    if (!isValidEmail(email)) {
      alert('Please enter a valid email address.');
      return;
    }

    if (pass.length < 6) {
      alert('Password must be at least 6 characters long.');
      return;
    }

    if (!isLogin) {
      if (!name || name.length < 2) {
        alert('Please enter a valid name.');
        return;
      }
      if (!isValidPhone(phone)) {
        alert('Please enter a valid phone number (10–15 digits).');
        return;
      }
      if (!address || address.length < 5) {
        alert('Please enter a valid address.');
        return;
      }

      const val = await createUser(email, pass, name, phone, address);
      alert(val.message);
      return;
    } else {
      const result = await signIn('credentials', {
        redirect: false,
        email: email,
        password: pass,
      });

      if (!result.error) {
        alert('Signed in successfully');

        
        setTimeout(() => {
          if (session?.user) {
            cartCtx.setUser(session.user.id, session.user.address, session.user.phone);
          }

  
          if (role === 'admin') {
            router.replace('/admin');
          } else {
            router.replace('/home');
          }
        }, 200);
      } else {
        alert(result.error);
      }
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.heading}>FastFoods</h1>
        <img src="/food.png" alt="avatar" style={styles.avatar} />

        <form onSubmit={submitHandler} style={styles.form}>
          {!isLogin && (
            <>
              <input type="text" placeholder="Your Name" required ref={nref} style={styles.input} />
              <input type="tel" placeholder="Phone Number" required ref={phref} style={styles.input} />
              <input type="text" placeholder="Address" required ref={aref} style={styles.input} />
            </>
          )}

          <input type="email" placeholder="Email" required ref={eref} style={styles.input} />
          <input type="password" placeholder="Password" required ref={pref} style={styles.input} />

    
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ marginRight: '10px' }}>
              <input
                type="radio"
                name="role"
                value="user"
                checked={role === 'user'}
                onChange={() => setRole('user')}
              />{' '}
              I'm a User
            </label>
            <label>
              <input
                type="radio"
                name="role"
                value="admin"
                checked={role === 'admin'}
                onChange={() => setRole('admin')}
              />{' '}
              I'm an Admin
            </label>
          </div>

          <button type="submit" style={styles.buttonPrimary}>
            {isLogin ? 'Login' : 'Create Account'}
          </button>

          <button
            type="button"
            onClick={switchAuthModeHandler}
            style={styles.buttonSecondary}
          >
            {isLogin ? 'Create new account' : 'Login with existing account'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AuthForm;
