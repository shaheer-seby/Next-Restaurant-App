import React from 'react';
import { useRouter } from 'next/router';

const CategoryDetailPage = ({ category, items }) => {
  const router = useRouter();

  if (!category) return <h2 className="text-center py-5 text-danger">Category not found</h2>;

  const handleClick = (id) => {
    router.push(`/food/${id}`);
  };

  return (
    <div className="container py-5">
      <h2 className="text-center mb-5 display-5 fw-bold text-primary">
        {category}
      </h2>

      <div className="row g-4">
        {items.map((item) => (
          <div key={item._id} className="col-sm-6 col-lg-4">
            <div
              className="card h-100 shadow-sm border-0 hover-shadow transition"
              style={{ cursor: 'pointer', borderRadius: '15px' }}
              onClick={() => handleClick(item._id)}
            >
              <img
                src={item.thumb || 'https://via.placeholder.com/400x250'}
                className="card-img-top"
                alt={item.title}
                style={{ height: '230px', objectFit: 'cover', borderTopLeftRadius: '15px', borderTopRightRadius: '15px' }}
              />
              <div className="card-body d-flex flex-column">
                <h5 className="card-title text-dark">{item.title}</h5>
                <p className="card-text text-muted small flex-grow-1">{item.description}</p>
                <div className="d-flex justify-content-between align-items-center mt-3">
                  <span className="fw-bold text-success">Rs. {item.price}</span>
                  <span className="badge bg-warning text-dark">
                    {item.rating} ⭐ ({item.totalReviews})
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export async function getServerSideProps(context) {
  const { title } = context.params;

  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/foods/ByTitle/${title}`);

  if (!res.ok) {
    return { props: { category: null, items: [] } };
  }

  const data = await res.json();

  return {
    props: {
      category: data.category || null,
      items: data.items || [],
    },
  };
}

export default CategoryDetailPage;
