import { createContext, useState } from 'react';

const CartContext = createContext({
  cartItems: [],
  addItem: (item) => {},
  deleteItem: (item) => {},
});

export function CartContextProvider(props) {
  const [cart, setCart] = useState([]);

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
  };

  return (
    <CartContext.Provider value={ctx}>
      {props.children}
    </CartContext.Provider>
  );
}

export default CartContext;
