import React, { useState } from 'react';
import { Card, CardContent, CardMedia, Button, Typography } from '@mui/material';
import Link from 'next/link';

const HFood = () => {
  const [foods, setFoods] = useState([
    {
      _id: '1',
      thumb: 'food1.jpg',
      title: 'Delicious Pizza',
      description: 'A savory dish with fresh ingredients and melting cheese.',
      price: '299',
      rating: 4.5,
      totalReviews: 120,
      active: 'on',
    },
    // other food items
  ]);

  const addItemHandler = (item) => {
    alert(`${item.title} added to cart!`);
  };

  return (
    <section className="py-5 bg-dark text-light">
      <div className="container">
        <div className="text-center mb-5">
          <p className="text-uppercase text-warning small mb-2">
            Chef’s Featured Selections
          </p>
          <h2 className="display-5 fw-bold">Discover Our Popular Dishes</h2>
        </div>

        {foods.length === 0 ? (
          <h4 className="text-center mt-4">No featured dishes available.</h4>
        ) : (
          <div className="row justify-content-center">
            {foods.map((item) => (
              <div key={item._id} className="col-lg-3 col-md-4 col-sm-6 mb-4">
                <Card sx={{ maxWidth: 345 }} className="bg-secondary text-light rounded-3">
                  <Link href={`/food/${item._id}`} passHref className="text-decoration-none">
                    <CardMedia
                      component="img"
                      height="140"
                      image={`/food/${item.thumb}`}
                      alt={item.title}
                    />
                  </Link>
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div" className="text-warning">
                      {item.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {item.description.slice(0, 60)}…
                    </Typography>
                    <div className="d-flex justify-content-between align-items-center">
                      <Typography variant="body2" color="text.secondary">
                        Rs. {item.price}
                      </Typography>
                      {item.active === 'on' ? (
                        <Button size="small" onClick={() => addItemHandler(item)} color="warning">
                          Add to Cart
                        </Button>
                      ) : (
                        <Button size="small" disabled>
                          Out of Stock
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default HFood;
