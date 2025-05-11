import React, { useState } from 'react';
import Link from 'next/link';
import moment from 'moment';
import ReactPaginate from 'react-paginate';
import Banner from '../../styles/banner/Banner';

const Blog = ({ blogs = [] }) => {
  const [itemOffset, setItemOffset] = useState(0);
  const itemsPerPage = 6;

  const endOffset = itemOffset + itemsPerPage;
<<<<<<< HEAD
  console.log(blogs)
=======
>>>>>>> 35398736c358d154cc38fb7b86828290cce539bb
  const currentItems = blogs.slice(itemOffset, endOffset);
  const pageCount = Math.ceil(blogs.length / itemsPerPage);

  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % blogs.length;
    setItemOffset(newOffset);

    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <>
      <Banner title="Our Blogs" subtitle="Explore Blogs" />
      <section className="blog">
        <div className="container">
          <div className="grid-3">
            {currentItems.length === 0 ? (
              <h3 className="text-center">No items found!</h3>
            ) : (
              currentItems.map((item) => (
                <div className="items shadow" key={item._id}>
                  <div className="img">
                    <img
                      src={
                        item.thumb.startsWith('http')
                          ? item.thumb
                          : `/blogs/${item.thumb}`
                      }
                      alt={item.title}
                    />
                  </div>
                  <div className="text">
                    <div className="admin flexSB">
                      <span>
                        <i className="fa fa-user"></i>
                        <label>{item.post_by || 'Admin'}</label>
                      </span>
                      <span>
                        <i className="fa fa-calendar-alt"></i>
                        <label>{moment(item.date).format('lll')}</label>
                      </span>
                    </div>
                    <Link href={`/blogs/${item._id}`} className="blog-title">
                      <h1>{item.title.slice(0, 60)}...</h1>
                    </Link>
                    <p>
                      {item.description.slice(0, 100)}...{' '}
                      <Link href={`/blogs/${item._id}`} className="success-btn">
                        <i className="fas fa-eye"></i> Read More
                      </Link>
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>

          {blogs.length > itemsPerPage && (
            <div className="mt-4 d-flex justify-content-center">
              <ReactPaginate
                breakLabel="..."
                nextLabel=">>"
                onPageChange={handlePageClick}
                pageRangeDisplayed={3}
                pageCount={pageCount}
                previousLabel="<<"
                containerClassName="pagination"
                pageClassName="page-item"
                pageLinkClassName="page-link"
                activeClassName="active"
                previousClassName="page-item"
                nextClassName="page-item"
              />
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export async function getServerSideProps() {
  try {
    const res = await fetch('http://localhost:3000/api/blogs');
    const data = await res.json();

    const blogs = Array.isArray(data) ? data : [];
<<<<<<< HEAD
=======

>>>>>>> 35398736c358d154cc38fb7b86828290cce539bb
    return {
      props: { blogs },
    };
  } catch (error) {
    console.error('Failed to fetch blogs:', error);
    return {
      props: { blogs: [] },
    };
  }
}

export default Blog;
