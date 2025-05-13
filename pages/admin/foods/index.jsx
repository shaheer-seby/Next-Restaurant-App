'use client'
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '../components/navbar';

export default function FoodsPage() {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFoods() {
      try {
        const response = await fetch('/api/foods');
        const data = await response.json();
        
        setFoods(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching foods:', error);
        setLoading(false);
      }
    }

    fetchFoods();
  }, []);

  const deleteFood = async (id) => {
    if (window.confirm('Are you sure you want to delete this food item?')) {
      try {
        const response = await fetch(`/api/foods/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          setFoods(foods.filter((food) => food._id !== id));
        } else {
          alert('Error deleting food item');
        }
      } catch (error) {
        console.error('Error deleting food:', error);
      }
    }
  };

  if (loading) return <><Navbar/><div>Loading...</div></>;

  return (
    <>
    <Navbar/>
    <div className="container mt-5">
      <h1 className="text-center mb-4">Food Items</h1>
      <Link href="/admin/foods/add" className="btn btn-primary mb-3">
        Add New Food
      </Link>
      <div className="row">
        {foods.map((food) => (
          <div className="col-md-4 mb-4" key={food._id}>
            <div className="card h-100">
              <img
                src={`/uploads/foods/${food.thumb}`}
                alt={food.title}
                className="card-img-top"
                style={{ objectFit: 'cover', height: '200px' }}
              />
              <div className="card-body">
                <h5 className="card-title">{food.title}</h5>
                <p className="card-text">{food.description}</p>
                <p className="card-text"><strong>Price: </strong>${food.price}</p>
                <div className="d-flex justify-content-between">
                  <Link href={`/admin/foods/edit/${food._id}`} className="btn btn-warning btn-sm">Edit</Link>
                  <button
                    onClick={() => deleteFood(food._id)}
                    className="btn btn-danger btn-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
    </>
  );
}
