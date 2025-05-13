// pages/home.js
import React, { useContext} from "react";
import Link from "next/link";
import HeroBanner from "./HeroBanner";
import Categories from "../category";
import Blogs from "../blogs"
import CartContext from "@/context/context";
import { useEffect } from "react";
import { useRouter } from "next/router";
const Home = ({ categories, blogs }) => {
  const router = useRouter();

  const cart = useContext(CartContext)

  useEffect(() => {
    if (cart.uid == null) {
      alert('Please login first');
      router.push('/');
    }
  }, [cart.userId, router]);
  return (
  cart.uid == null?
    null
:
    <>
      <HeroBanner />
      <div className="container text-center my-5">
        <h2 className="display-4 mb-4">Welcome to Our Website</h2>
        <p className="lead mb-4">Choose a page to explore:</p>
        <div className="d-flex justify-content-center mb-5">

          <Link href="/category" className="btn btn-primary mx-2 px-4 py-2">
            Explore Categories
          </Link>
          <Link href="/blogs" className="btn btn-primary mx-2 px-4 py-2">
            Explore Blogs
          </Link>
        </div>
      </div>

      <Categories categories={categories} />
      <Blogs blogs={blogs} />
    </>
  );
};

export async function getServerSideProps() {
  try {
    const [catRes, blogRes] = await Promise.all([
      fetch('http://localhost:3000/api/categories'),
      fetch('http://localhost:3000/api/blogs'),
    ]);

    const [catData, blogData] = await Promise.all([
      catRes.ok ? catRes.json() : [],
      blogRes.ok ? blogRes.json() : [],
    ]);

    const categories = Array.isArray(catData)
      ? catData.map(cat => ({
          _id: cat._id,
          title: cat.title || 'Untitled',
          thumb: cat.thumb || 'default.jpg',
        }))
      : [];

    const blogs = Array.isArray(blogData) ? blogData : [];

    return {
      props: { categories, blogs },
    };
  } catch (error) {
    console.error("Error in SSR:", error);
    return {
      props: { categories: [], blogs: [] },
    };
  }
}

export default Home;
