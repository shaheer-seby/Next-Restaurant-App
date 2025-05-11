import { createContext, useState } from 'react';

const CartContext = createContext({
  cartItems: [],
  addItem: (item) => {},
  deleteItem: (item) => {},
  userId: null,
  address:null,
  phone:null,
  setUser: (id,add,pho) => {}
  
});

export function CartContextProvider(props) {
  const [cart, setCart] = useState([]);
  const [userId,setUserId] = useState();
  const [address,setAddress] = useState();
  const [phone,setPhone] = useState();
  function set(id,add,pho)
  {
    setUserId(id);
    setAddress(add);
    setPhone(pho)
  }
  function add(item) {
    setCart((prevCart) => {
      const existingItem = prevCart.find((i) => i.id === item.id);
      if (existingItem) {
        return prevCart.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      } else {
        return [...prevCart, { ...item, quantity: 1 }];
      }
    });
  }

  function del(item) {
    setCart((prevCart) => {
      const existingItem = prevCart.find((i) => i.id === item.id);
      if (!existingItem) return prevCart;

      if (existingItem.quantity === 1) {
        return prevCart.filter((i) => i.id !== item.id);
      } else {
        return prevCart.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity - 1 } : i
        );
      }
    });
  }

  const ctx = {
    cartItems: cart,
    addItem: add,
    deleteItem: del,
    setUser: set,
    uid:userId,
    address:address,
    phone:phone
  };

  return (
    <CartContext.Provider value={ctx}>
      {props.children}
    </CartContext.Provider>
  );
}

export default CartContext;
