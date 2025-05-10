import React, { useEffect, useState } from "react";
import PageHeader from "../../styles/header/title/PageHeader";
import "../../styles/food.module.css";
import Link from "next/link";
import { useCart } from "react-use-cart";
import Swal from "sweetalert2";
import Rating from "../../styles/rating/Rating";
import moment from "moment";
import ReactPaginate from "react-paginate";
import Banner from "../../styles/banner/Banner";
import { useRouter } from 'next/router';

const SingleFood = () => {
  const router = useRouter();
  const { id } = router.query;

  // MOCK FOOD DATA
  const mockFood = {
    _id: "1", // Default ID if router.query.id is not available yet
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

  // USE STATES
  const [food, setFood] = useState(mockFood); // Initialize with default values
  const [reviews, setReviews] = useState([]);
  const [recomFoods, setRecomFoods] = useState(mockRecomFoods);

  useEffect(() => {
    if (id) {
      // Update the ID when it's available from router
      setFood({
        ...mockFood,
        _id: id
      });
      // Set reviews
      const updatedFood = {...mockFood, _id: id};
      setReviews(updatedFood.reviews.reverse());
    }
  }, [id]);

  // PAGINATION
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

  // ADD-TO-CART
  const { addItem } = useCart();
  const addItemHandlar = (item, id) => {
    item.id = id;
    addItem(item);
    Swal.fire({
      icon: "success",
      title: item.title + " Added.",
      showConfirmButton: false,
      timer: 1000,
    });
  };

  // Show loading if no data is available yet
  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Banner title={food.category} subtitle={food.title} />
      <section className="food single-food">
        <div className="container">
          <div className="single-food-item grid-2">
            <div className="left">
              <img src={"/foods/" + food.thumb} alt={food.title} />
            </div>
            <div className="right">
              <h3>{food.title}</h3>
              <p>{food.description}</p>
              <div className="single-order-form">
                <ul>
                  <li>
                    <span>Price</span>
                    <h4>Rs {food.price}</h4>
                  </li>
                  <li>
                    <span>Category</span>
                    <h4>{food.category}</h4>
                  </li>
                  <li>
                    <span>Reviews</span>
                    <h4>
                      <Rating rating={food.rating} />
                      <span>({food.totalReviews})</span>
                    </h4>
                  </li>
                  <li>
                    <span>Status</span>
                    <h4>
                      {food.active === "on" ? "Available" : "Unavailable"}
                    </h4>
                  </li>
                  <li>
                    {food.active === "on" ? (
                      <Link
                        className="btn-primary"
                        href={`/food/${food._id}`}
                        onClick={() => addItemHandlar(food, food._id)}
                      >
                        <i className="fas fa-shopping-cart"></i> Add To Cart
                      </Link>
                    ) : (
                      <Link href="#" className="btn-primary disableLink">
                        <i className="fas fa-shopping-cart"></i> Out Of Stock
                      </Link>
                    )}
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="single-food-item">
            <div className="all-review">
              <h3 className="text-center" style={{ marginBottom: "20px" }}>
                REVIEWS
              </h3>
              <div className="grid-4">
                {reviews.length === 0 ? (
                  <div className="review-item">
                    <p>No feedback has been given yet.</p>
                  </div>
                ) : (
                  currentItems.map((item, index) => (
                    <div key={index} className="review-item">
                      <div className="grid-2">
                        <h5 className="name bold">{item.name}</h5>
                        <Rating rating={item.rating} />
                      </div>
                      <p className="date">
                        {item.date && moment(item.date).format("lll")}
                      </p>
                      <p className="content">
                        {item.comment ? item.comment : "No comment given..."}
                      </p>
                    </div>
                  ))
                )}
              </div>
              {reviews.length >= 13 && (
                <ReactPaginate
                  breakLabel="..."
                  nextLabel=">>"
                  onPageChange={handlePageClick}
                  pageRangeDisplayed={3}
                  pageCount={pageCount}
                  previousLabel="<<"
                  renderOnZeroPageCount={null}
                  containerClassName="pagination"
                />
              )}
            </div>
          </div>
        </div>
        <div className="single-food-item container">
          <h3 className="text-center" style={{ marginBottom: "20px" }}>
            RECOMMENDED FOODS
          </h3>
          <div className="grid-4">
            {recomFoods.slice(0, 4).map((item, index) => (
              <div key={index} className="items shadow">
                <div className="img">
                  <img
                    src={"/food/" + item.thumb}
                    alt={item.title}
                    className="img-responsive img-curve"
                  />
                </div>
                <div className="text text-center">
                  <h4>
                    <Link href={`/food/${item._id}`}>{item.title}</Link>
                  </h4>
                  <h5>
                    <Rating rating={item.rating} />
                    <span>({item.totalReviews})</span>
                  </h5>
                  <p>{item.description.slice(0, 50)}...</p>
                  <h5>Rs {item.price}</h5>
                  <div className="flexSB">
                    <Link href={`/food/${item._id}`} className="btn-primary">
                      <i className="fas fa-eye"></i> View Detail
                    </Link>
                    {item.active === "on" ? (
                      <Link
                        href={`/food/${item._id}`}
                        className="btn-primary"
                        onClick={() => addItemHandlar(item, item._id)}
                      >
                        <i className="fas fa-shopping-cart"></i> Add To Cart
                      </Link>
                    ) : (
                      <Link href="#" className="btn-primary disableLink">
                        <i className="fas fa-shopping-cart"></i> Stock Out
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default SingleFood;