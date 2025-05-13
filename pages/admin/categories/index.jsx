import { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '../components/navbar';

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');


const handleDelete = async (title) => {
  const confirmed = window.confirm("Are you sure you want to delete this category?");
  if (!confirmed) return;

  try {
    const res = await fetch(`/api/categories/${title}`, {
      method: 'DELETE',
    });

    const data = await res.json();

    if (res.ok) {
      setCategories((prev) => prev.filter((category) => category.title !== title));
    } else {
      setError(data.message || "Failed to delete category.");
    }
  } catch (err) {
    console.error("Delete error:", err);
    setError("An error occurred while deleting the category.");
  }
};



  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('/api/categories');
        const data = await res.json();
        if (res.ok) {
          setCategories(data);
        } else {
          setError('Failed to fetch categories');
        }
      } catch (error) {
        setError('An error occurred while fetching categories');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);


  if (loading) {
    return (
      <div className="text-center my-5">
        loading...
        <div className="spinner-border text-primary" role="status"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-danger text-center">{error}</div>;
  }

  return (
    <>
      <Navbar />
      <div className="container my-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1>Categories</h1>
          <Link href="/admin/categories/add">
            <button className="btn btn-success">Add New Category</button>
          </Link>
        </div>

        <div className="row">
          {categories.map((category) => (
            <div className="col-md-4 mb-4" key={category._id}>
              <div className="card shadow-sm border-light rounded h-100">
                <img
                  src={`/uploads/food/${category.thumb}`}
                  alt={category.title}
                  className="card-img-top"
                  style={{ height: '200px', objectFit: 'cover' }}
                />
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{category.title}</h5>
                  <p className="card-text">
                    {category.featured ? 'Featured' : 'Regular'}{' '}
                    {category.active ? '(Active)' : '(Inactive)'}
                  </p>
                  <div className="mt-auto d-flex justify-content-between">
                    <Link href={`/admin/categories/${category.title}`}>
                      <button className="btn btn-primary">View</button>
                    </Link>
                    <div className="mt-auto d-flex justify-content-between">
 
  <button
    className="btn btn-danger"
    onClick={() => handleDelete(category.title)}
  >
    Delete
  </button>
</div>

                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default CategoriesPage;
