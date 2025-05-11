import { CartContextProvider } from "@/context/context";
import "@/styles/globals.css";
import "@/styles/blog.css";
import "@/styles/food.module.css";
import "@/styles/Home.module.css";
import "@/styles/homeStyles.module.css";
import "@/styles/contact.css";
import Header from "@/styles/header/Header";
import Footer from "@/styles/footer/Footer";
import HeroBanner from "./home/HeroBanner";

export default function App({ Component, pageProps }) {
  return (
    <CartContextProvider>
      <Header />
      
      <main>
        <Component {...pageProps} />
      </main>
      <Footer />
    </CartContextProvider>
  );
}
