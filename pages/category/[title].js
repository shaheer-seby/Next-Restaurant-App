// pages/category/[title].js

import React from 'react';

const CategoryDetailPage = ({ category, items }) => {
  if (!category) return <h2 className="text-center py-5">Category not found</h2>;

  return (
    <div className="container py-5">
      <h2 className="text-center mb-4">{category.title}</h2>
      <div className="row">
        {items.map(item => (
          <div key={item._id} className="col-md-4 mb-4">
            <div className="card h-100 shadow-sm">
              <img
                src={item.image}
                className="card-img-top"
                alt={item.title}
                style={{ height: '220px', objectFit: 'cover' }}
              />
              <div className="card-body">
                <h5 className="card-title">{item.title}</h5>
                <p className="card-text">{item.description}</p>
                <p className="fw-bold">Rs. {item.price}</p>
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

  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/categories/${title}`);

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
