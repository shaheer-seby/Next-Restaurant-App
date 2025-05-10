import { useEffect, useState } from 'react';
import Link from 'next/link';
import ReactPaginate from 'react-paginate';
import { motion, AnimatePresence } from 'framer-motion';
import Banner from '@/components/banner/Banner'; // adjust if your Banner is elsewhere

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [itemOffset, setItemOffset] = useState(0);
  const itemsPerPage = 12;

  useEffect(() => {
    // Mock categories for static frontend
    const mockData = [
      { _id: 1, title: 'Pizza', featured: 'on' },
      { _id: 2, title: 'Burger', featured: 'off' },
      { _id: 3, title: 'Pasta', featured: 'on' },
      { _id: 4, title: 'Sushi', featured: 'off' },
      { _id: 5, title: 'Salad', featured: 'on' },
      { _id: 6, title: 'Steak', featured: 'off' },
      { _id: 7, title: 'Tacos', featured: 'on' },
      { _id: 8, title: 'Ramen', featured: 'off' },
      { _id: 9, title: 'Curry', featured: 'on' },
      { _id: 10, title: 'Kebab', featured: 'off' },
      { _id: 11, title: 'Pancakes', featured: 'on' },
      { _id: 12, title: 'Waffles', featured: 'off' },
      { _id: 13, title: 'Ice Cream', featured: 'on' },
    ];
    setCategories(mockData);
  }, []);

  const endOffset = itemOffset + itemsPerPage;
  const currentItems = categories.slice(itemOffset, endOffset);
  const pageCount = Math.ceil(categories.length / itemsPerPage);

  const handlePageClick = ({ selected }) => {
    setItemOffset((selected * itemsPerPage) % categories.length);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: i => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, type: 'spring', stiffness: 120 },
    }),
    hover: { scale: 1.05, boxShadow: '0 8px 24px rgba(0,0,0,0.3)' },
  };

  return (
    <>
      <Banner title="Our Menu" subtitle="Explore Categories" />

      <section className="py-5 bg-white">
        <div className="container">
          <div className="d-flex flex-wrap justify-content-center gap-4">
            <AnimatePresence initial={false}>
              {currentItems.length === 0 ? (
                <div className="col-12">
                  <h3 className="text-center">No categories found!</h3>
                </div>
              ) : (
                currentItems.map((cat, idx) => (
                  <motion.div
                    key={cat._id || idx}
                    custom={idx}
                    initial="hidden"
                    animate="visible"
                    whileHover="hover"
                    variants={cardVariants}
                    className="category-item"
                    style={{
                      flex: '1 1 calc(25% - 1rem)',
                      minWidth: '300px',
                      maxWidth: '300px',
                    }}
                  >
                    <Link
                      href={`/category/${encodeURIComponent(cat.title)}`}
                      className="text-decoration-none"
                    >
                      <div className="card overflow-hidden border border-warning rounded shadow-lg h-100 position-relative">
                        <img
                          src={`https://via.placeholder.com/300x150?text=${encodeURIComponent(cat.title)}`}
                          alt={cat.title}
                          className="card-img-top"
                          style={{
                            objectFit: 'cover',
                            height: '150px',
                            width: '100%',
                          }}
                        />

                        {cat.featured === 'on' && (
                          <div className="badge bg-warning text-dark position-absolute top-0 end-0 m-3">
                            Featured
                          </div>
                        )}

                        <div className="card-body d-flex flex-column">
                          <h5 className="card-title text-center mb-3">{cat.title}</h5>

                          <button className="btn btn-warning w-100">Explore</button>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>

          {categories.length > itemsPerPage && (
            <div className="d-flex justify-content-center mt-5">
              <ReactPaginate
                breakLabel="..."
                nextLabel="›"
                onPageChange={handlePageClick}
                pageRangeDisplayed={3}
                pageCount={pageCount}
                previousLabel="‹"
                containerClassName="pagination"
                pageClassName="page-item"
                pageLinkClassName="page-link"
                previousClassName="page-item"
                previousLinkClassName="page-link"
                nextClassName="page-item"
                nextLinkClassName="page-link"
                breakClassName="page-item disabled"
                breakLinkClassName="page-link"
                activeClassName="active"
              />
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default Categories;
