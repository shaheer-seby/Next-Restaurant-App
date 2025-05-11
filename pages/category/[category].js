import React from 'react';
import mongoose from 'mongoose';
import Category from '@/models/category.model.js';
import Item from '@/models/categoryitem.model.js';

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
  const slug = context.params.slug;

  await mongoose.connect(process.env.MONGODB_URI, {
    dbName: 'restaurantDB',
  });

  const category = await Category.findOne({ slug });

  if (!category) {
    return { props: { category: null, items: [] } };
  }

  const items = await Item.find({ categoryId: category._id }).lean();

  return {
    props: {
      category: JSON.parse(JSON.stringify(category)),
      items: JSON.parse(JSON.stringify(items)),
    },
  };
}

export default CategoryDetailPage;
