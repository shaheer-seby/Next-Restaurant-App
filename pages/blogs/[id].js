import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import moment from 'moment';
import Banner from '../../styles/banner/Banner'; 

const SingleBlog = () => {
  const { query } = useRouter();
  const { id } = query;

  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;

    const fetchBlog = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/blogs/${id}`);
        if (!res.ok) {
          throw new Error('Blog not found or error fetching blog');
        }
        const data = await res.json();
        setBlog(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  if (loading) return <div className="text-center py-5">Loading blog...</div>;
  if (error) return <div className="text-center py-5 text-danger">Error: {error}</div>;

  return (
    <>
      <Banner title={blog.post_by || 'Blog'} subtitle={blog.title} />

      <section className="py-5 bg-light">
        <div className="container">
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
               src={`/uploads/food/${blog.thumb}`}
        alt={blog.title}
                className="img-fluid rounded shadow-sm"
                style={{ maxHeight: '200px', objectFit: 'cover', width: '100%' }}
              />
            </div>
          </div>

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
