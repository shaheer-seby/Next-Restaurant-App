import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import moment from 'moment';
import Banner from '../../styles/banner/Banner'; // Adjust path if needed

const SingleBlog = () => {
  const { query } = useRouter();
  const { id } = query;
  const [blog, setBlog] = useState({});

  useEffect(() => {
    // Mock data instead of fetching from backend
    const mockData = {
      title: 'React Design Patterns: Best Practices',
      post_by: 'John Doe',
      date: '2024-12-01',
      description: `
        React is a powerful JavaScript library for building user interfaces. 
        In this article, we explore several common design patterns including 
        container/presenter components, higher-order components (HOCs), render props, 
        and hooks — each helping improve code reusability, readability, and maintainability.

        Additionally, we'll look at how to effectively structure your project, 
        organize components, and manage global state using Context API and third-party tools like Redux and Zustand.
      `,
      thumb: 'urlreact.png', // Place a placeholder image in /public/blogs/urlreact.png
    };
    setBlog(mockData);
  }, [id]);

  return (
    <>
      <Banner title={blog.post_by} subtitle={blog.title} />

      <section className="py-5 bg-light">
        <div className="container">
          {/* Blog Header Section */}
          <div className="row align-items-center mb-5">
            <div className="col-md-8">
              <h2 className="fw-bold mb-3">{blog.title}</h2>
              <div className="d-flex flex-wrap gap-4 text-secondary small">
                <div className="d-flex align-items-center gap-2">
                  <i className="fa fa-user"></i>
                  <span>{blog.post_by}</span>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <i className="fa fa-calendar-alt"></i>
                  <span>{moment(blog.date).format('MMMM Do, YYYY')}</span>
                </div>
              </div>
            </div>
            <div className="col-md-4 text-center">
              <img
                src={`/blogs/${blog.thumb}`}
                alt={blog.title}
                className="img-fluid rounded shadow-sm"
                style={{ maxHeight: '200px', objectFit: 'cover', width: '100%' }}
              />
            </div>
          </div>

          {/* Blog Content */}
          <div className="bg-white p-4 rounded shadow-sm">
            <p className="fs-6 lh-lg" style={{ whiteSpace: 'pre-line' }}>
              {blog.description}
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default SingleBlog;
