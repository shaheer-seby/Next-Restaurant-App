import Link from 'next/link';
import { motion } from 'framer-motion';
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState } from 'react';
import Banner from '@/styles/banner/Banner';

const cardVariants = {
  hover: { scale: 1.03, boxShadow: '0 6px 18px rgba(0,0,0,0.15)' }
};

const Categories = ({ categories = [] }) => {
  const [itemOffset, setItemOffset] = useState(0);
  const itemsPerPage = 6;
  const endOffset = itemOffset + itemsPerPage;
  const currentItems = categories.slice(itemOffset, endOffset);

  return (
    <section style={{ padding: '80px 0', backgroundColor: '#fafafa' }}>
      <Banner title="Our Menu" subtitle="Explore Cuisines" />
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
        <motion.div
          style={{ textAlign: 'center', marginBottom: '50px' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <p style={{
            textTransform: 'uppercase',
            color: '#7f8c8d',
            fontSize: '0.85rem',
            marginBottom: '10px'
          }}>
            Curated Categories
          </p>
          <h2 style={{
            fontSize: '2.5rem',
            fontWeight: '700',
            color: '#2c3e50'
          }}>
            Discover Our Signature Flavors
          </h2>
          <div style={{
            width: '80px',
            height: '3px',
            backgroundColor: '#0d6efd',
            margin: '15px auto'
          }} />
        </motion.div>

        {currentItems.length === 0 ? (
          <h4 style={{ textAlign: 'center', marginTop: '30px', color: '#6c757d' }}>
            No categories found.
          </h4>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '30px'
          }}>
            {currentItems.map((cat) => (
              <Link key={cat._id} href={`/category/${encodeURIComponent(cat.title)}`} style={{ textDecoration: 'none' }}>
                <motion.div
                  whileHover="hover"
                  variants={cardVariants}
                  style={{
                    backgroundColor: '#ffffff',
                    borderRadius: '15px',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    position: 'relative',
                    height: '0',
                    paddingBottom: '75%',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <img
                    src={`/uploads/categories/${cat.thumb}`}
                    alt={cat.title}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                  <div style={{
                    position: 'absolute',
                    bottom: 0,
                    width: '100%',
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    color: '#ffffff',
                    textAlign: 'center',
                    padding: '10px 0',
                    fontSize: '1.1rem',
                    fontWeight: '600'
                  }}>
                    {cat.title}
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export async function getServerSideProps() {
  const res = await fetch(`http://localhost:3000/api/categories`);
  if (!res.ok) {
    console.error('Failed to fetch categories:', await res.text());
    return { props: { categories: [] } };
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

export default Categories;
