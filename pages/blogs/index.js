import React, { useState } from 'react';
import Link from 'next/link';
import moment from 'moment';
import ReactPaginate from 'react-paginate';
import Banner from '../../styles/banner/Banner';

const Blog = () => {
  const mockBlogs = [
    {
      _id: '1',
      title: 'Understanding React Basics',
      description: 'This blog explains the fundamentals of React including components, props, and state.',
      post_by: 'Admin',
      date: new Date(),
      thumb: 'https://via.placeholder.com/300x200',
    },
    {
      _id: '2',
      title: 'Next.js for Beginners',
      description: 'Learn how to get started with Next.js, the popular React framework.',
      post_by: 'Jane Doe',
      date: new Date(),
      thumb: 'https://via.placeholder.com/300x200',
    },
    {
      _id: '3',
      title: 'Styling in React: Tailwind vs CSS Modules',
      description: 'We compare Tailwind CSS with CSS Modules to help you choose the right styling approach.',
      post_by: 'John Smith',
      date: new Date(),
      thumb: 'https://via.placeholder.com/300x200',
    },
    // Add more mock items if needed...
  ];

  const [itemOffset, setItemOffset] = useState(0);
  const itemsPerPage = 6;

  const endOffset = itemOffset + itemsPerPage;
  const currentItems = mockBlogs.slice(itemOffset, endOffset);
  const pageCount = Math.ceil(mockBlogs.length / itemsPerPage);

  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % mockBlogs.length;
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
                    <img src={item.thumb} alt={item.title} />
                  </div>
                  <div className="text">
                    <div className="admin flexSB">
                      <span>
                        <i className="fa fa-user"></i>
                        <label>{item.post_by}</label>
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

          {mockBlogs.length > itemsPerPage && (
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

export default Blog;
