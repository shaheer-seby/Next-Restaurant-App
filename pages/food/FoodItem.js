'use client'; // Required for useState and useCart

import React, { useState } from "react";
import Link from "next/link"; 
import { useCart } from "react-use-cart";

import Rating from "../../styles/rating/Rating";
import ReactPaginate from "react-paginate";

const FoodItem = ({ foods }) => {
  // PAGINATION
  
  const [itemOffset, setItemOffset] = useState(0);
  const itemsPerPage = 12;

  const endOffset = itemOffset + itemsPerPage;
  const currentItems = foods.slice(itemOffset, endOffset);
  const pageCount = Math.ceil(foods.length / itemsPerPage);

  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % foods.length;
    setItemOffset(newOffset);
    document.documentElement.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  };

  // ADD-TO-CART
  const { addItem } = useCart();
  const addItemHandler = (item, id) => {
    item.id = id;
    addItem(item);
    Swal.fire({
      icon: "success",
      text: item.title + " Added.",
      showConfirmButton: false,
      timer: 1000,
    });
  };

  return (
    <>
      <div className="grid-4">
        {currentItems.length === 0 ? (
          <h3 className="text-center">No items found!</h3>
        ) : (
          currentItems.map((item, index) => (
            <div key={index} className="items shadow">
              <div className="img">
                <Link href={`/food/${item._id}`} className="text-decoration-none">
                  <img
                    src={`/food/${item.thumb}`}
                    alt={item.title}
                    className="img-responsive img-curve"
                  />
                </Link>
              </div>
              <div className="text text-center">
                <h4>
                  <Link href={`/food/${item._id}`} className="text-decoration-none">
                    {item.title}
                  </Link>
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
                    <button
                      className="btn-primary"
                      onClick={() => addItemHandler(item, item._id)}
                    >
                      <i className="fas fa-shopping-cart"></i> Add To Cart
                    </button>
                  ) : (
                    <button className="btn-primary disableLink" disabled>
                      <i className="fas fa-shopping-cart"></i> Stock Out
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {foods.length >= itemsPerPage + 1 && (
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
    </>
  );
};

export default FoodItem;
