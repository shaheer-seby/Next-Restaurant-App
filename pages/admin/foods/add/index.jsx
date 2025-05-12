// pages/admin/foods/add.js
import { useState } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../../components/navbar';

export default function AddFoodPage() {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [Type, setType] = useState('');
  const [thumb, setThumb] = useState(null);
  const [featured, setFeatured] = useState(false);
  const [active, setActive] = useState(false);
  const router = useRouter();

 const handleSubmit = async (e) => {
  e.preventDefault();

  const formData = new FormData();
  formData.append('title', title);
  formData.append('price', price);
  formData.append('description', description);
  formData.append('type', Type);
  formData.append('thumb', thumb);
  formData.append('featured', featured ? 'on' : 'off');
  formData.append('active', active ? 'on' : 'off');

  const response = await fetch('/api/foods', {
    method: 'POST',
    body: formData,
  });

  if (response.ok) {
    router.push('/admin/foods');
  } else {
    alert('Failed to add food item');
  }
};


  return (
    <>
      <Navbar />
      <div className="container mt-5">
        <h1 className="text-center mb-4">Add New Food</h1>
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
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={4}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Type:</label>
            <input
              type="text"
              className="form-control"
              value={Type}
              onChange={(e) => setType(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="form-label">Thumbnail:</label>
            <input
              type="file"
              className="form-control"
              onChange={(e) => setThumb(e.target.files[0])}
              required
            />
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
              Add Food
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
