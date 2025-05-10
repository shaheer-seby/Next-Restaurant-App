'use client'; // Marking it as a client component

import React, { useEffect, useState } from "react";
import PageHeader from "../../styles/header/title/PageHeader";
import FoodItem from "./FoodItem";
import "../../styles/food.module.css";
import Banner from "../../styles/banner/Banner";

const Food = () => {
  const [query, setQuery] = useState("");
  const [foods, setFoods] = useState([]);

  // useEffect to fetch data (currently using mock data)
  useEffect(() => {
    const dummyData = [
      {
        _id: "1",
        title: "Spicy Chicken Biryani",
        description: "Delicious spicy rice with tender chicken pieces.",
        price: 350,
        rating: 4.5,
        totalReviews: 20,
        thumb: "biryani.jpg",
        active: "on",
      },
      {
        _id: "2",
        title: "Paneer Tikka",
        description: "Grilled paneer cubes with aromatic spices.",
        price: 250,
        rating: 4.2,
        totalReviews: 15,
        thumb: "paneer.jpg",
        active: "on",
      },
    ];

    setFoods(dummyData.filter(item =>
      item.title.toLowerCase().includes(query.toLowerCase())
    ));
  }, [query]);

  return (
    <>
      <Banner title="Our Menu" subtitle="Explore Cuisines" />
      <PageHeader title="Our Menu" subtitle="Explore Cuisines" />
      <section className="food">
        <div className="container text-center">
          <div className="search-food-form">
            <input
              type="search"
              name="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for Dishes.."
              required
            />
          </div>
        </div>
        <div className="container">
          <FoodItem foods={foods} />
        </div>
      </section>
    </>
  );
};

export default Food;
