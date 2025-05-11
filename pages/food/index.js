'use client';

import React, { useEffect, useState } from "react";
import PageHeader from "../../styles/header/title/PageHeader";
import FoodItem from "./FoodItem";
import "../../styles/food.module.css";
import Banner from "../../styles/banner/Banner";

const Food = () => {
  const [query, setQuery] = useState("");
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFoods = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/item?q=${encodeURIComponent(query)}`);
        if (!res.ok) throw new Error("Failed to fetch foods");
        const data = await res.json();
        setFoods(data);
      } catch (error) {
        console.error("Error fetching food items:", error);
        setFoods([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFoods();
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
          {loading ? (
            <p>Loading...</p>
          ) : (
            <FoodItem foods={foods} />
          )}
        </div>
      </section>
    </>
  );
};

export default Food;
