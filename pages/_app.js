import { CartContextProvider } from "@/context/context";
import "@/styles/globals.css";
import "@/styles/blog.css";
import "@/styles/food.module.css";
import "@/styles/Home.module.css";
import "@/styles/homeStyles.module.css";
import "@/styles/contact.css";
import Header from "@/styles/header/Header";
import { SessionProvider } from 'next-auth/react';

import Footer from "@/styles/footer/Footer";
export default function App({ Component, pageProps }) {
  return(
<SessionProvider>
    <CartContextProvider>
            <Component {...pageProps} />
    </CartContextProvider>
</SessionProvider>
  )
   
}
