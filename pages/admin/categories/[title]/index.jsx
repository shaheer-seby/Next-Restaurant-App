import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Link from 'next/link';

const CategoryDetailPage = () => {
  const router = useRouter();
  const { title } = router.query;

  const [category, setCategory] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!title) return;

    const fetchCategory = async () => {
      const res = await fetch(`/api/foods/ByTitle/${title}`);
      const data = await res.json();
      setCategory(data.category);
      setItems(data.items);
      setLoading(false);
    };

    fetchCategory();
  }, [title]);

  if (loading) return <p className="text-center">Loading...</p>;
  if (!category) return <p className="text-center text-danger">Category not found.</p>;

  return (
    <div className="container my-5">
      <h1>{category.title}</h1>
      <img
        src= {`/uploads/foods/${category.thumb}`}
        alt={category.title}
        className="img-fluid mb-3"
      />
      <p>{category.description}</p>

      <h3 className="mt-5">Items in this category:</h3>
      <div className="row">
        {items.map((item) => (
          <div className="col-md-4 mb-4" key={item._id}>
            <Link href={`/admin/foods/edit/${item._id}`} className="text-decoration-none text-dark">
              <div className="card h-100 shadow-sm">
                <img
                 src= {`/uploads/foods/${item.thumb}`}
                  className="card-img-top"
                  alt={item.title}
                  style={{ height: '200px', objectFit: 'cover' }}
                />
                <div className="card-body">
                  <h5 className="card-title">{item.title}</h5>
                  <p className="card-text">{item.description}</p>
                  <p className="card-text text-primary">Rs {item.price}</p>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryDetailPage;
