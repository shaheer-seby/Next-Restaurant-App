'use client'
import { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';
import Navbar from '../components/navbar';

const BlogsPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [newBlog, setNewBlog] = useState({
    title: '',
    description: '',
    featured: false,
    thumb: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch the blogs from the API
    const fetchBlogs = async () => {
      try {
        const res = await axios.get('/api/blogs');
        setBlogs(res.data);
      } catch (err) {
        setError('Error fetching blogs.');
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewBlog((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setNewBlog((prev) => ({
      ...prev,
      thumb: e.target.files[0],
    }));
  };

const handleDelete = async (id) => {
  const confirmed = window.confirm("Are you sure you want to delete this blog?");
  if (!confirmed) return;

  try {
    const response = await fetch(`/api/blogs/${id}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      // Remove the deleted blog from the UI
      setBlogs((prev) => prev.filter((blog) => blog._id !== id));
    } else {
      const errorData = await response.json();
      console.error("Delete failed:", errorData.message);
      setError(errorData.message || "Failed to delete blog.");
    }
  } catch (err) {
    console.error("Delete request error:", err);
    setError("Error deleting blog.");
  }
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', newBlog.title);
    formData.append('description', newBlog.description);
    formData.append('featured', newBlog.featured);
    formData.append('thumb', newBlog.thumb);

    try {
      await axios.post('/api/blogs', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      setNewBlog({ title: '', description: '', featured: false, thumb: null });
      setBlogs((prev) => [newBlog, ...prev]);
    } catch (err) {
      setError('Error adding blog.');
    }
  };

  if (loading) {
    return     <><Navbar/><div>Loading blogs...</div></>;
  }

  return (
    <>
    <Navbar/>
    <div className="container my-5">
      <h1 className="text-center mb-4">Blogs</h1>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="row">
       {blogs.map((blog) => (
  <div className="col-md-4 mb-4" key={blog._id}>
    <div className="card shadow-sm border-light rounded">
      <img
        src={`/uploads/food/${blog.thumb}`}
        alt={blog.title}
        className="card-img-top"
        style={{ height: '200px', objectFit: 'cover' }}
      />
      <div className="card-body">
        <h5 className="card-title">{blog.title}</h5>
        <p className="card-text">{blog.description.slice(0, 100)}...</p>
        <Link href={`/admin/blogs/${blog._id}`} passHref>
          <button className="btn btn-primary me-2">View Blog</button>
        </Link>
        <button
          className="btn btn-danger"
          onClick={() => handleDelete(blog._id)}
        >
          Delete
        </button>
      </div>
    </div>
  </div>
))}

      </div>

      <hr />
      <h2>Add New Blog</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="form-group">
          <label>Title</label>
          <input
            type="text"
            name="title"
            value={newBlog.title}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>
        <div className="form-group">
          <label>Description</label>
          <textarea
            name="description"
            value={newBlog.description}
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
            checked={newBlog.featured}
            onChange={(e) => setNewBlog((prev) => ({ ...prev, featured: e.target.checked }))}
          />
        </div>
        <div className="form-group">
          <label>Thumbnail Image</label>
          <input
            type="file"
            name="thumb"
            onChange={handleFileChange}
            className="form-control"
            required
          />
        </div>
        <button type="submit" className="btn btn-success mt-3">
          Add Blog
        </button>
      </form>
    </div>
    </>
  );
};

export default BlogsPage;
