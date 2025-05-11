'use client'
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Navbar from '@/pages/admin/components/navbar';

export default function EditFoodPage() {
  const [food, setFood] = useState(null);
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [thumb, setThumb] = useState(null);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (id) {
      async function fetchFood() {
        const response = await fetch(`/api/foods/${id}`);
        const data = await response.json();
        setFood(data);
        setTitle(data.title);
        setPrice(data.price);
        setDescription(data.description);
        setCategory(data.category);
      }

      fetchFood();
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('title', title);
    formData.append('price', price);
    formData.append('description', description);
    formData.append('category', category);
    if (thumb) formData.append('thumb', thumb);

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

  if (!food) return <div className="text-center">Loading...</div>;

  return (
    <>
    <Navbar/>
    <div className="container mt-5">
      <h1 className="text-center mb-4">Edit Food</h1>
      <form onSubmit={handleSubmit}>
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
          />
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
        <div className="mb-3">
          <label className="form-label">Thumbnail:</label>
          <input
            type="file"
            className="form-control"
            onChange={(e) => setThumb(e.target.files[0])}
          />
        </div>
        <div className="text-center">
          <button type="submit" className="btn btn-primary">Update Food</button>
        </div>
      </form>
    </div>
    </>
  );
}
