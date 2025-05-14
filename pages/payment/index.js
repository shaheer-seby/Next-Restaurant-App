import { useContext, useEffect } from 'react';
import CartContext from '@/context/context';

function IndexPage() {

  const cart = useContext(CartContext);
    console.log('Cart context:', cart);
    
  
  useEffect(() => {
     console.log('Cart context useffect:', cart);
    }, []);
  
  
  async function runlink()
    {
    console.log('GONE')
 if (cart.cartItems.length > 0) {
        fetch('/api/orders/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            items: cart.cartItems,
            customer_id: cart.uid,
            address: cart.address,
            phone: cart.phone,
          
          }),
        })
          .then((res) => res.json())
          .then((data) => {
            console.log('Order saved:', data);
          })
          .catch((err) => {
            console.error('Error saving order:', err);
          });
      }
    const res = await fetch('/api/checkout_sessions', { method: 'POST' });
    const data = await res.json();
    window.location.href = data.url;
    console.log(data.url)

    }

  return (
  
        <button onClick={runlink}>
          Checkout
        </button>
  )
}
export default IndexPage;