import React, { useState } from "react";
import PageHeader from "../../styles/header/title/PageHeader";
import FoodItem from "./FoodItem";
import "../../styles/food.module.css";
import Banner from "../../styles/banner/Banner";

const Food = ({ foods = [] }) => {
  const [query, setQuery] = useState("");

  const filteredFoods = foods.filter((food) =>
    food.title.toLowerCase().includes(query.toLowerCase())
  );

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
          {filteredFoods.length === 0 ? (
            <p>No matching dishes found.</p>
          ) : (
            <FoodItem foods={filteredFoods} />
          )}
        </div>
      </section>
    </>
  );
};

export async function getServerSideProps() {
  try {
    const res = await fetch("http://localhost:3000/api/foods");
    const data = await res.json();
    const foods = Array.isArray(data) ? data : [];

    return {
      props: { foods },
    };
  } catch (error) {
    console.error("Failed to fetch food items:", error);
    return {
      props: { foods: [] },
    };
  }
}

export default Food;
