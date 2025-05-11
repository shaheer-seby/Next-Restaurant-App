import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import 'bootstrap/dist/css/bootstrap.min.css';
import path from 'path';

const cardVariants = {
  hover: { scale: 1.03, boxShadow: '0 6px 18px rgba(0,0,0,0.15)' }
};

const Categories = ({ categories }) => {
  return (
    <section className="py-5">
      <div className="container">
        <motion.div
          className="text-center mb-5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <p className="text-uppercase text-muted small mb-2">
            Curated Categories
          </p>
          <h2 className="display-5 fw-bold">Discover Our Signature Flavors</h2>
          <div
            className="mx-auto border-bottom border-3 border-primary my-3"
            style={{ width: '80px' }}
          />
        </motion.div>

        {categories.length === 0 ? (
          <h4 className="text-center mt-4">No categories found.</h4>
        ) : (
          <div className="row">
            {categories.map((cat) => (
              <div key={cat._id} className="col-md-3 col-sm-6 mb-4">
                <Link href={`/category/${cat.title}`} className="text-decoration-none">
                  <motion.div
                    className="card h-100 border-0 overflow-hidden"
                    whileHover="hover"
                    variants={cardVariants}
                  >
                    <div className="ratio ratio-4x3">
                      <img
                        src={`/uploads/categories/${cat.thumb || 'default.jpg'}`}
                        alt={cat.title}
                        className="card-img img-fluid"
                        style={{ objectFit: 'cover' }}
                        onError={(e) => {
                          e.target.src = '/fallback.jpg';
                        }}
                      />
                    </div>
                    <div className="card-img-overlay d-flex align-items-end p-0">
                      <h5 className="w-100 text-center bg-dark bg-opacity-50 m-0 py-2 text-white">
                        {cat.title}
                      </h5>
                    </div>
                  </motion.div>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Categories;

// ✅ Get data from your API route


export async function getStaticProps() {
 
  const res = await fetch(`http://localhost:3000/api/categories`);
  
  if (!res.ok) {
    console.error('Failed to fetch categories:', await res.text());
    return { props: { categories: [] }, revalidate: 60 };
  }

  const data = await res.json();

  const categories = data.map(cat => ({
    _id: cat._id,
    title: cat.title || 'Untitled',
    thumb: cat.thumb || 'default.jpg',
  }));

  return {
    props: {
      categories,
    },
  
  };
}

