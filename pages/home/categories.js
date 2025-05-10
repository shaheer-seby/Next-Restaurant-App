import React, { useState, useEffect } from 'react';
import Link from 'next/link'; // Use Next.js Link component
import { motion } from 'framer-motion';
import 'bootstrap/dist/css/bootstrap.min.css';

const cardVariants = {
  hover: { scale: 1.03, boxShadow: '0 6px 18px rgba(0,0,0,0.15)' }
};

const Categories = () => {
  const [categories, setCategories] = useState([]);

  // Dummy data for frontend testing
  useEffect(() => {
    setCategories([
      { _id: '1', title: 'Italian', thumb: 'italian.jpg' },
      { _id: '2', title: 'Chinese', thumb: 'chinese.jpg' },
      { _id: '3', title: 'Desserts', thumb: 'desserts.jpg' },
      { _id: '4', title: 'Burgers', thumb: 'burgers.jpg' }
    ]);
  }, []);

  return (
    <section className="py-5">
      <div className="container">
        {/* Header */}
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
          <h3 className="text-center mt-4">No items found!</h3>
        ) : (
          <div className="row">
            {categories.map((item, idx) => (
              <div key={item._id || idx} className="col-md-3 col-sm-6 mb-4">
                <Link
                  href={`/category-food/${encodeURIComponent(item.title)}`}
                  className="text-decoration-none"
                >
                  <motion.div
                    className="card h-100 border-0 overflow-hidden"
                    whileHover="hover"
                    variants={cardVariants}
                  >
                    <div className="ratio ratio-4x3">
                      <img
                        src={`/categories/${item.thumb}`}
                        alt={item.title}
                        className="card-img img-fluid"
                        style={{ objectFit: 'cover' }}
                      />
                    </div>
                    <div className="card-img-overlay d-flex align-items-end p-0">
                      <h5 className="w-100 text-center bg-dark bg-opacity-50 m-0 py-2 text-white">
                        {item.title}
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
