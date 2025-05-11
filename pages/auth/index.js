import { useState, useRef,useContext } from 'react';
import classes from './auth-form.module.css';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import CartContext from "@/context/context";
import { useSession } from 'next-auth/react';


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

    if (!res.ok) {
      // throw custom error for upstream handling
      throw new Error(data.message || 'Something went wrong!');
    }

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
  const cartCtx = useContext(CartContext); // ✅ useContext at top level

  const phref = useRef();
  const aref = useRef();
  const [isLogin, setIsLogin] = useState(true);

  function switchAuthModeHandler() {
    setIsLogin((prevState) => !prevState);
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
      alert(val.message)
      return;
    } else {
      const result = await signIn('credentials', {
        redirect: false,
        email: email,
        password: pass,
      });
      if (!result.error) {
         setTimeout(() => {
    if (session?.user) {
      cartCtx.setUser(session.user.id, session.user.address, session.user.phone);
    
      router.replace('/');
    }
  }, 100); 
        router.replace('/');
      }
else{
      return alert(result.error)}
    }
  }

  return (
    <section className={classes.auth}>
      <h1>{isLogin ? 'Login' : 'Sign Up'}</h1>
      <form onSubmit={submitHandler}>
        {!isLogin && (
          <>
            <div className={classes.control}>
              <label htmlFor='name'>Your Name</label>
              <input type='text' id='name' required ref={nref} />
            </div>
            <div className={classes.control}>
              <label htmlFor='phone'>Phone Number</label>
              <input type='tel' id='phone' required ref={phref} />
            </div>
            <div className={classes.control}>
              <label htmlFor='address'>Address</label>
              <input type='text' id='address' required ref={aref} />
            </div>
          </>
        )}
        <div className={classes.control}>
          <label htmlFor='email'>Your Email</label>
          <input type='email' id='email' required ref={eref} />
        </div>
        <div className={classes.control}>
          <label htmlFor='password'>Your Password</label>
          <input type='password' id='password' required ref={pref} />
        </div>

        <div className={classes.actions}>
          <button>{isLogin ? 'Login' : 'Create Account'}</button>
          <button
            type='button'
            className={classes.toggle}
            onClick={switchAuthModeHandler}
          >
            {isLogin ? 'Create new account' : 'Login with existing account'}
          </button>
        </div>
      </form>
    </section>
  );
}

export default AuthForm;
