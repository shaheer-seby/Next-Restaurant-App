import React, { useEffect, useState } from "react";
import PageHeader from "../../styles/header/title/PageHeader";
import "../../styles/food.module.css";
import Link from "next/link";
import Swal from "sweetalert2";
import Rating from "../../styles/rating/Rating";
import moment from "moment";
import ReactPaginate from "react-paginate";
import Banner from "../../styles/banner/Banner";
import { useRouter } from 'next/router';

const SingleFood = () => {
  const router = useRouter();
  const { id } = router.query;

  const mockFood = {
    _id: "1",
    title: "Cheese Burst Pizza",
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
      <section className="food single-food py-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-10 items-start mb-10">
            <div className="w-full md:w-1/2">
              <img
                src={`/foods/${food.thumb}`}
                alt={food.title}
                className="w-full rounded-xl shadow-lg object-cover"
              />
            </div>
            <div className="w-full md:w-1/2 space-y-4">
              <h2 className="text-3xl font-bold text-gray-800">{food.title}</h2>
              <p className="text-gray-600">{food.description}</p>
              <ul className="space-y-2">
                <li><span className="font-semibold">Price:</span> Rs {food.price}</li>
                <li><span className="font-semibold">Category:</span> {food.category}</li>
                <li><span className="font-semibold">Rating:</span> <Rating rating={food.rating} /> ({food.totalReviews})</li>
                <li><span className="font-semibold">Status:</span> {food.active === "on" ? "Available" : "Unavailable"}</li>
              </ul>
              <div>
                {food.active === "on" ? (
                  <Link href={`/food/${food._id}`} className="inline-block px-6 py-2 bg-green-600 text-white rounded-xl shadow hover:bg-green-700">
                    <i className="fas fa-shopping-cart"></i> Add To Cart
                  </Link>
                ) : (
                  <span className="inline-block px-6 py-2 bg-gray-400 text-white rounded-xl cursor-not-allowed">
                    <i className="fas fa-shopping-cart"></i> Out Of Stock
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="mb-10">
            <h3 className="text-2xl font-bold mb-4 text-center">Reviews</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reviews.length === 0 ? (
                <p>No feedback has been given yet.</p>
              ) : (
                currentItems.map((item, index) => (
                  <div key={index} className="p-4 border rounded-lg shadow-md">
                    <div className="flex justify-between items-center mb-2">
                      <h5 className="font-bold">{item.name}</h5>
                      <Rating rating={item.rating} />
                    </div>
                    <p className="text-sm text-gray-500 mb-2">{moment(item.date).format("lll")}</p>
                    <p>{item.comment || "No comment given..."}</p>
                  </div>
                ))
              )}
            </div>
            {reviews.length >= 13 && (
              <div className="mt-6">
                <ReactPaginate
                  breakLabel="..."
                  nextLabel=">>"
                  onPageChange={handlePageClick}
                  pageRangeDisplayed={3}
                  pageCount={pageCount}
                  previousLabel="<<"
                  containerClassName="pagination flex gap-2 justify-center mt-4"
                  activeClassName="font-bold underline"
                />
              </div>
            )}
          </div>

          <div>
            <h3 className="text-2xl font-bold text-center mb-6">Recommended Foods</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {recomFoods.slice(0, 4).map((item, index) => (
                <div key={index} className="border rounded-xl overflow-hidden shadow hover:shadow-lg transition">
                  <img
                    src={`/food/${item.thumb}`}
                    alt={item.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4 text-center space-y-2">
                    <h4 className="font-semibold text-lg">
                      <Link href={`/food/${item._id}`}>{item.title}</Link>
                    </h4>
                    <Rating rating={item.rating} /> <span>({item.totalReviews})</span>
                    <p className="text-sm text-gray-600">{item.description.slice(0, 50)}...</p>
                    <h5 className="font-bold">Rs {item.price}</h5>
                    <div className="flex justify-center gap-2">
                      <Link href={`/food/${item._id}`} className="btn-primary">
                        <i className="fas fa-eye"></i> View Detail
                      </Link>
                      {item.active === "on" ? (
                        <Link href={`/food/${item._id}`} className="btn-primary">
                          <i className="fas fa-shopping-cart"></i> Add To Cart
                        </Link>
                      ) : (
                        <span className="btn-primary bg-gray-400 cursor-not-allowed">
                          <i className="fas fa-shopping-cart"></i> Stock Out
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
