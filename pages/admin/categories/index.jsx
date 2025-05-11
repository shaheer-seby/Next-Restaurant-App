import { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '../components/navbar';

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
    return <div className="text-center my-5"><div className="spinner-border text-primary" role="status"></div></div>;
  }

  if (error) {
    return <div className="text-danger text-center">{error}</div>;
  }

  return (
    <>
    <Navbar/>
    <div className="container my-5">
      <h1 className="text-center my-4">Categories</h1>
      <div className="row">
        {categories.map((category) => (
          <div className="col-md-4 mb-4" key={category._id}>
            <div className="card shadow-sm border-light rounded">
              <img
                src={`/uploads/categories/${category.thumb}`}
                alt={category.title}
                className="card-img-top"
                style={{ height: '200px', objectFit: 'cover' }}
              />
              <div className="card-body">
                <h5 className="card-title">{category.title}</h5>
                <p className="card-text">{category.featured ? 'Featured' : 'Regular'} {category.active ? '(Active)' : '(Inactive)'}</p>
                <Link href={`/categories/${category.title}`}>
                  <button className="btn btn-primary">View Details</button>
                </Link>
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
