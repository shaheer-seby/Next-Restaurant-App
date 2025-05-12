'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../../../components/navbar';

export default function EditFoodPage() {
  const router = useRouter();
  const { id } = router.query;

  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [thumb, setThumb] = useState(null);
  const [oldThumb, setOldThumb] = useState('');
  const [featured, setFeatured] = useState(false);
  const [active, setActive] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    async function fetchFood() {
      try {
        const res = await fetch(`/api/foods/${id}`);
        if (!res.ok) throw new Error('Failed to fetch food');
        const data = await res.json();
        setTitle(data.title);
        setPrice(data.price);
        setDescription(data.description);
        setCategory(data.category);
        setOldThumb(data.thumb);
        setFeatured(data.featured || false);
        setActive(data.active || false);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    }

    fetchFood();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('title', title);
    formData.append('price', price);
    formData.append('description', description);
    formData.append('category', category);
    formData.append('oldThumb', oldThumb);
    formData.append('featured', featured ? 'on' : 'off');
    formData.append('active', active ? 'on' : 'off');
    if (thumb) {
      formData.append('thumb', thumb);
    }

    const response = await fetch(`/api/foods/${id}`, {
      method: 'PUT',
      body: formData,
    });

    if (response.ok) {
      router.push('/admin/foods');
    } else {
      alert('Failed to update food item');
    }
  };

  if (loading) return <><Navbar /><div>Loading...</div></>;

  return (
    <>
      <Navbar />
      <div className="container mt-5">
        <h1 className="text-center mb-4">Edit Food</h1>
        <form onSubmit={handleSubmit} className="card p-4 shadow-sm">
          <div className="mb-3">
            <label className="form-label">Title:</label>
            <input
              type="text"
              className="form-control"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Price:</label>
            <input
              type="number"
              className="form-control"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Description:</label>
            <textarea
              className="form-control"
              rows="4"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            ></textarea>
          </div>
          <div className="mb-3">
            <label className="form-label">Category:</label>
            <input
              type="text"
              className="form-control"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="form-label">Thumbnail:</label>
            {oldThumb && (
              <div className="mb-2">
                <img
                  src={`/uploads/foods/${oldThumb}`}
                  alt="Current Thumbnail"
                  style={{ width: '150px', borderRadius: '8px' }}
                />
              </div>
            )}
            <input
              type="file"
              className="form-control"
              onChange={(e) => setThumb(e.target.files[0])}
            />
            <small className="text-muted">Leave blank to keep current thumbnail.</small>
          </div>

          <div className="form-check mb-2">
            <input
              type="checkbox"
              className="form-check-input"
              id="featured"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
            />
            <label className="form-check-label" htmlFor="featured">
              Featured
            </label>
          </div>

          <div className="form-check mb-4">
            <input
              type="checkbox"
              className="form-check-input"
              id="active"
              checked={active}
              onChange={(e) => setActive(e.target.checked)}
            />
            <label className="form-check-label" htmlFor="active">
              Active
            </label>
          </div>

          <div className="text-center">
            <button type="submit" className="btn btn-success w-50">
              Update Food
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
