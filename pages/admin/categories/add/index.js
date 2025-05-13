import { useState } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../../components/navbar';

export default function AddCategoryPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [thumb, setThumb] = useState(null);
  const [featured, setFeatured] = useState(false);
  const [active, setActive] = useState(true);

 const handleSubmit = async (e) => {
  e.preventDefault();

  const formData = new FormData();
  formData.append('title', title);
  if (thumb) formData.append('thumb', thumb);
  formData.append('featured', featured ? 'on' : '');
  formData.append('active', active ? 'on' : '');

  const response = await fetch('/api/categories', {
    method: 'POST',
    body: formData,
  });

  const result = await response.json();
  if (response.ok) {
    alert('Category added!');
    router.push('/admin/categories');
  } else {
    alert('Failed to add category: ' + result.message);
  }
};


  return (
    <>
      <Navbar />
      <div className="container mt-5">
        <h1 className="text-center mb-4">Add New Category</h1>
        <form onSubmit={handleSubmit} className="card p-4 shadow-sm"  encType="multipart/form-data"> 
          <div className="mb-3">
            <label className="form-label">Title</label>
            <input
              type="text"
              className="form-control"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Description</label>
            <textarea
              className="form-control"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            ></textarea>
          </div>
          <div className="mb-3">
            <label className="form-label">Thumbnail</label>
            <input
              type="file"
              className="form-control"
              onChange={(e) => setThumb(e.target.files[0])}
            />
          </div>
          <div className="form-check mb-2">
            <input
              className="form-check-input"
              type="checkbox"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
              id="featured"
            />
            <label className="form-check-label" htmlFor="featured">
              Featured
            </label>
          </div>
          <div className="form-check mb-4">
            <input
              className="form-check-input"
              type="checkbox"
              checked={active}
              onChange={(e) => setActive(e.target.checked)}
              id="active"
            />
            <label className="form-check-label" htmlFor="active">
              Active
            </label>
          </div>
          <div className="text-center">
            <button type="submit" className="btn btn-success w-50">
              Add Category
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
