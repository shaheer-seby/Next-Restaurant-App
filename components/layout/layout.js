import { useContext, useState } from "react";
import CartContext from "@/context/context";
import CartPage from "../cart";
import { ShoppingCart } from "lucide-react"; // Optional icon library
import styles from "./layout.module.css"; // Custom CSS module

export default function Layout(props) {
  const ctx = useContext(CartContext);
  const [showCart, setShowCart] = useState(false);

  const toggleCart = () => {
    setShowCart((prev) => !prev);
  };

  return (
    <>
      <header className={styles.header}>
        <button onClick={toggleCart} className={styles.cartButton}>
          <ShoppingCart size={24} />
          <span className={styles.count}>{ctx.cartItems.length}</span>
        </button>
      </header>

      {showCart && (
        <div className={styles.cartOverlay}>
          <CartPage
            cartItems={ctx.cartItems}
            addItem={ctx.addItem}
            deleteItem={ctx.deleteItem}
          />
        </div>
      )}

      <main>{props.children}</main>
    </>
  );
}
