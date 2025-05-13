import { CartContextProvider } from "@/context/context";
import "@/styles/globals.css";
import "@/styles/blog.css";
import "@/styles/food.module.css";
import "@/styles/Home.module.css";
import "@/styles/homeStyles.module.css";
import "@/styles/contact.css";
import Header from "@/styles/header/Header";
import Footer from "@/styles/footer/Footer";
import { useRouter } from 'next/router';
import { SessionProvider } from "next-auth/react";
import Layout from "@/components/layout/layout";
export default function App({ Component, pageProps }) {
  const router = useRouter();
const hideHeaderPaths = ['/auth','/admin']; // Add other paths here if needed

    const shouldShowHeader = !hideHeaderPaths.includes(router.pathname);


  return (
    <CartContextProvider>
      <SessionProvider>
       {shouldShowHeader && <Header />}

      <Component {...pageProps} />
      <Footer />
      </SessionProvider>
    </CartContextProvider>
  );
}
