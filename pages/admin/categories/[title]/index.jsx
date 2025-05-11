import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../../components/navbar';

const CategoryDetailsPage = () => {
  const [category, setCategory] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();
  const { title } = router.query;

  useEffect(() => {
    if (!title) return;

    const fetchCategoryDetails = async () => {
      try {
        const res = await fetch(`/api/category/${title}`);
        const data = await res.json();

        if (res.ok) {
          setCategory(data.category);
          setItems(data.items);
        } else {
          setError('Category not found');
        }
      } catch (error) {
        setError('An error occurred while fetching category details');
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryDetails();
  }, [title]);

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
      <h1 className="text-center mb-4">{category.title}</h1>
      <div className="row">
        {items.length === 0 ? (
          <div className="col-12 text-center">
            <p>No items available in this category.</p>
          </div>
        ) : (
          items.map((item) => (
            <div className="col-md-4 mb-4" key={item._id}>
              <div className="card shadow-sm border-light rounded">
                <img
                  src={`/uploads/items/${item.image}`} // assuming items have images
                  alt={item.name}
                  className="card-img-top"
                  style={{ height: '200px', objectFit: 'cover' }}
                />
                <div className="card-body">
                  <h5 className="card-title">{item.name}</h5>
                  <p className="card-text">{item.description}</p>
                  <p className="card-text text-muted">Price: ${item.price}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
    </>
  );
};

export default CategoryDetailsPage;
