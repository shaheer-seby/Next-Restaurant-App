// pages/home.js
import React from "react";
import Link from "next/link";
import HBlog from "./blogs";
import HCategories from "./categories";
import HFood from "./Hfood";
import HeroBanner from "./HeroBanner";

const Home = () => {
  return (
    <>
      <HeroBanner />
      <div className="container text-center my-5">
        <h2 className="display-4 mb-4">Welcome to Our Website</h2>
        <p className="lead mb-4">Choose a page to explore:</p>
        <div className="d-flex justify-content-center mb-5">
          <Link href="/home/Hfood" className="btn btn-primary mx-2 px-4 py-2">
            Explore Food
          </Link>
          <Link href="/home/categories" className="btn btn-primary mx-2 px-4 py-2">
            Explore Categories
          </Link>
          <Link href="/home/blogs" className="btn btn-primary mx-2 px-4 py-2">
            Explore Blogs
          </Link>
        </div>
      </div>

      <HCategories />
      <HFood />
      <HBlog />
    </>
  );
};

export default Home; // Default export
