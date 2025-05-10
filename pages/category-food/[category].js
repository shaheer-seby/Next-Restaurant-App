import { useRouter } from "next/router";
import React from "react";

const CategoryFood = () => {
  const router = useRouter();
  const { category } = router.query;

  return (
    <div className="container my-5">
      <h1>Category:hehe {category}</h1>
      {/* Fetch and display food items related to this category */}
    </div>
  );
};

export default CategoryFood;
