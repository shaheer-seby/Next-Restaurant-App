import React, { useEffect, useState, useContext } from "react";
import PageHeader from "../../styles/header/title/PageHeader";
import "../../styles/food.module.css";
import Link from "next/link";
import Swal from "sweetalert2";
import Rating from "../../styles/rating/Rating";
import moment from "moment";
import ReactPaginate from "react-paginate";
import Banner from "../../styles/banner/Banner";
import { useRouter } from 'next/router';
import CartContext from "@/context/context";
const SingleFood = () => {
  const router = useRouter();
  const { id } = router.query;

  const mockFood = {
    _id: "1",
    title: "PLEASE WAIT",
    description: "A cheesy delight with crispy crust and flavorful toppings.",
    price: 499,
    category: "Pizza",
    thumb: "pizza.jpg",
    rating: 4.5,
    totalReviews: 24,
    active: "on",
    reviews: [
      {
        name: "John Doe",
        rating: 5,
        date: new Date().toISOString(),
        comment: "Absolutely delicious!",
      },
      {
        name: "Jane Smith",
        rating: 4,
        date: new Date().toISOString(),
        comment: "Loved it, could be a bit spicier.",
      },
    ],
  };

  const mockRecomFoods = [
    {
      _id: "2",
      title: "Veg Supreme",
      description: "Loaded with vegetables and cheese",
      price: 399,
      thumb: "veg-supreme.jpg",
      rating: 4.3,
      totalReviews: 12,
      active: "on",
    },
    {
      _id: "3",
      title: "Paneer Tikka",
      description: "Spicy paneer cubes with onion and capsicum",
      price: 459,
      thumb: "paneer-tikka.jpg",
      rating: 4.7,
      totalReviews: 20,
      active: "off",
    },
    {
      _id: "4",
      title: "Farm House",
      description: "Fresh veggies with olives and mushrooms",
      price: 429,
      thumb: "farm-house.jpg",
      rating: 4.2,
      totalReviews: 18,
      active: "on",
    },
    {
      _id: "5",
      title: "Pepperoni Feast",
      description: "Loaded with pepperoni slices",
      price: 549,
      thumb: "pepperoni.jpg",
      rating: 4.8,
      totalReviews: 30,
      active: "on",
    },
  ];

  const [food, setFood] = useState(mockFood);
  const [reviews, setReviews] = useState([]);
  const [recomFoods, setRecomFoods] = useState(mockRecomFoods);

  useEffect(() => {
    if (id) {
      const fetchFood = async () => {
        try {
          const res = await fetch(`/api/foods/${id}`);
          const data = await res.json();
          setFood(data);
          setReviews((data.reviews || []).reverse());
        } catch (error) {
          console.error("Error fetching food:", error);
        }
      };
      fetchFood();
    }
  }, [id]);

  const [itemOffset, setItemOffset] = useState(0);
  const itemsPerPage = 12;
  const cart= useContext(CartContext);

  const endOffset = itemOffset + itemsPerPage;
  const currentItems = reviews.slice(itemOffset, endOffset);
  const pageCount = Math.ceil(reviews.length / itemsPerPage);

  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % reviews.length;
    setItemOffset(newOffset);
    document.documentElement.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  };

  if (router.isFallback) {
    return <div className="text-center py-10">Loading...</div>;
  }

  return (
    <>
      <Banner title={food.category} subtitle={food.title} />
     <section style={{ background: "linear-gradient(to bottom right, #fff7ed, #fff)", padding: "60px 0" }}>
  <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 20px" }}>
    {/* Food Details */}
    <div style={{
      display: "flex",
      flexDirection: "row",
      gap: "40px",
      background: "#fff",
      padding: "30px",
      borderRadius: "20px",
      boxShadow: "0 8px 30px rgba(0,0,0,0.1)",
      marginBottom: "60px"
    }}>
      <img
       src={`/uploads/foods/${food.thumb}` || 'https://via.placeholder.com/400x250'}

        alt={food.title}
        style={{
          width: "100%",
          maxWidth: "500px",
          height: "auto",
          borderRadius: "15px",
          objectFit: "cover",
          boxShadow: "0 5px 15px rgba(0,0,0,0.1)"
        }}
      />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "20px" }}>
        <h1 style={{ fontSize: "32px", fontWeight: "bold", color: "#333" }}>{food.title}</h1>
        <p style={{ fontSize: "16px", color: "#555" }}>{food.description}</p>
        <ul style={{ listStyle: "none", padding: 0, color: "#444", fontSize: "16px", lineHeight: "1.8" }}>
          <li><strong>Price:</strong> Rs {food.price}</li>
          <li><strong>Category:</strong> {food.category}</li>
          <li><strong>Rating:</strong> <Rating rating={food.rating} /> ({food.totalReviews})</li>
          <li><strong>Status:</strong> {food.active === "on" ? "Available" : "Unavailable"}</li>
        </ul>

        {food.active === "on" ? (
          <button onClick={() => cart.addItem({name: food.title,price:food.price, prod_id: food.prod_id})} style={{
            display: "inline-block",
            padding: "12px 24px",
            backgroundColor: "#22c55e",
            color: "#fff",
            fontWeight: "bold",
            borderRadius: "10px",
            textDecoration: "none",
            boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
          }}>
            <i className="fas fa-shopping-cart" style={{ marginRight: "8px" }}></i> Add To Cart
          </button>
        ) : (
          <span style={{
            display: "inline-block",
            padding: "12px 24px",
            backgroundColor: "#a3a3a3",
            color: "#fff",
            borderRadius: "10px",
            cursor: "not-allowed",
            fontWeight: "bold"
          }}>
            <i className="fas fa-shopping-cart" style={{ marginRight: "8px" }}></i> Out Of Stock
          </span>
        )}
      </div>
    </div>

    {/* Reviews */}
    <div style={{ marginBottom: "60px" }}>
      <h2 style={{ fontSize: "28px", fontWeight: "bold", textAlign: "center", marginBottom: "30px", color: "#333" }}>
        Customer Reviews
      </h2>
      {reviews.length === 0 ? (
        <p style={{ textAlign: "center", color: "#666" }}>No feedback has been given yet.</p>
      ) : (
        <>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "20px"
          }}>
            {currentItems.map((item, index) => (
              <div key={index} style={{
                backgroundColor: "#fff",
                padding: "20px",
                borderRadius: "15px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.05)"
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                  <h4 style={{ fontWeight: "bold", color: "#333" }}>{item.name}</h4>
                  <Rating rating={item.rating} />
                </div>
                <p style={{ fontSize: "14px", color: "#999", marginBottom: "10px" }}>
                  {moment(item.date).format("lll")}
                </p>
                <p style={{ color: "#444" }}>{item.comment || "No comment given..."}</p>
              </div>
            ))}
          </div>
          {reviews.length >= 13 && (
            <div style={{ marginTop: "30px" }}>
              <ReactPaginate
                breakLabel="..."
                nextLabel=">>"
                onPageChange={handlePageClick}
                pageRangeDisplayed={3}
                pageCount={pageCount}
                previousLabel="<<"
                containerClassName="pagination"
                activeClassName="selected"
              />
            </div>
          )}
        </>
      )}
    </div>

    {/* Recommended Foods */}
    <div>
      <h2 style={{ fontSize: "28px", fontWeight: "bold", textAlign: "center", marginBottom: "40px", color: "#333" }}>
        Recommended Foods
      </h2>
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: "20px"
      }}>
        {recomFoods.slice(0, 4).map((item, index) => (
          <div key={index} style={{
            backgroundColor: "#fff",
            borderRadius: "15px",
            boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
            overflow: "hidden",
            transition: "transform 0.2s ease"
          }}>
            <img
             src={`/uploads/foods/${food.thumb}` || 'https://via.placeholder.com/400x250'}

              alt={item.title}
              style={{
                width: "100%",
                height: "150px",
                objectFit: "cover"
              }}
            />
            <div style={{ padding: "20px", textAlign: "center" }}>
              <h4 style={{ fontSize: "18px", fontWeight: "bold", color: "#222", marginBottom: "10px" }}>{item.title}</h4>
              <div style={{ marginBottom: "8px", fontSize: "14px", color: "#888" }}>
                <Rating rating={item.rating} /> ({item.totalReviews})
              </div>
              <p style={{ fontSize: "14px", color: "#666", marginBottom: "8px" }}>{item.description.slice(0, 50)}...</p>
              <h5 style={{ fontWeight: "bold", color: "#10b981", marginBottom: "10px" }}>Rs {item.price}</h5>
              <div style={{ display: "flex", justifyContent: "center", gap: "10px", flexWrap: "wrap" }}>
                <Link href={`/food/${item._id}`} style={{
                  padding: "8px 12px",
                  backgroundColor: "#3b82f6",
                  color: "#fff",
                  borderRadius: "8px",
                  textDecoration: "none",
                  fontSize: "14px"
                }}>
                  <i className="fas fa-eye" style={{ marginRight: "5px" }}></i> View
                </Link>
                {item.active === "on" ? (
                  <Link href={`/food/${item._id}`} style={{
                    padding: "8px 12px",
                    backgroundColor: "#22c55e",
                    color: "#fff",
                    borderRadius: "8px",
                    textDecoration: "none",
                    fontSize: "14px"
                  }}>
                    <i className="fas fa-shopping-cart" style={{ marginRight: "5px" }}></i> Add
                  </Link>
                ) : (
                  <span style={{
                    padding: "8px 12px",
                    backgroundColor: "#a3a3a3",
                    color: "#fff",
                    borderRadius: "8px",
                    fontSize: "14px"
                  }}>
                    <i className="fas fa-shopping-cart" style={{ marginRight: "5px" }}></i> Out
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
</section>


    </>
  );
};

export default SingleFood;
