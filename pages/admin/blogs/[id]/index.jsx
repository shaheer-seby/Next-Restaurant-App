'use client'
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Navbar from '../../components/navbar';

const BlogDetailPage = () => {
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatedBlog, setUpdatedBlog] = useState({});
  const [thumb, setThumb] = useState(null);

  const { query } = useRouter();
  const { id } = query;

  useEffect(() => {
    if (!id) return;

    const fetchBlog = async () => {
      try {
        const res = await axios.get(`/api/blogs/${id}`);
        setBlog(res.data);
        setUpdatedBlog(res.data);
      } catch (err) {
        setError('Error fetching blog details.');
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedBlog((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setThumb(e.target.files[0]);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('title', updatedBlog.title);
    formData.append('description', updatedBlog.description);
    formData.append('featured', updatedBlog.featured);
    if (thumb) {
      formData.append('thumb', thumb);
      formData.append('oldThumb', blog.thumb);
    }

    try {
      await axios.put(`/api/blogs/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      setBlog({ ...blog, ...updatedBlog });
      alert('Blog updated successfully');
    } catch (err) {
      setError('Error updating blog.');
    }
  };

  if (loading) {
    return <div>Loading blog...</div>;
  }

  return (
    <>
    <Navbar/>
    <div className="container my-5">
      {error && <div className="alert alert-danger">{error}</div>}
      {blog && (
        <div>
          <h1>{blog.title}</h1>
          <img
            src={`/uploads/blogs/${blog.thumb}`}
            alt={blog.title}
            className="img-fluid"
            style={{ maxWidth: '100%', height: 'auto' }}
          />
          <p>{blog.description}</p>

          <hr />
          <h2>Update Blog</h2>
          <form onSubmit={handleUpdate} encType="multipart/form-data">
            <div className="form-group">
              <label>Title</label>
              <input
                type="text"
                name="title"
                value={updatedBlog.title}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea
                name="description"
                value={updatedBlog.description}
                onChange={handleChange}
                className="form-control"
                rows="3"
                required
              ></textarea>
            </div>
            <div className="form-group">
              <label>Featured</label>
              <input
                type="checkbox"
                name="featured"
                checked={updatedBlog.featured}
                onChange={(e) => setUpdatedBlog((prev) => ({ ...prev, featured: e.target.checked }))}
              />
            </div>
            <div className="form-group">
              <label>Thumbnail Image</label>
              <input
                type="file"
                name="thumb"
                onChange={handleFileChange}
                className="form-control"
              />
            </div>
            <button type="submit" className="btn btn-warning mt-3">
              Update Blog
            </button>
          </form>
        </div>
      )}
    </div>
    </>
  );
};

export default BlogDetailPage;
