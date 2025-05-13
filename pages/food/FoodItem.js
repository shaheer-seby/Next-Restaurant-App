'use client';

import React, { useState } from "react";
import Link from "next/link"; 
import Rating from "../../styles/rating/Rating";
import ReactPaginate from "react-paginate";
import styles from "../../styles/food.module.css"; // Make sure the path matches your CSS file location

const FoodItem = ({ foods }) => {
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

  return (
    <>
      <div className={styles["food-grid"]}>
        {currentItems.length === 0 ? (
          <h3 className="text-center">No items found!</h3>
        ) : (
          currentItems.map((item, index) => (
            <div key={index} className={styles["food-card"] + " shadow"}>
              <div className={styles["img-wrapper"]}>
                <Link href={`/food/${item._id}`} className="text-decoration-none">
                  <img
                    src={item.thumb ? `/uploads/foods/${item.thumb}` : 'https://via.placeholder.com/400x250'}
                    alt={item.title}
                    className={styles["food-image"]}
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
                  {/* {item.active === "on" ? (
                    <button className="btn-primary">
                      <i className="fas fa-shopping-cart"></i> Add To Cart
                    </button>
                  ) : (
                    <button className="btn-primary disableLink" disabled>
                      <i className="fas fa-shopping-cart"></i> Stock Out
                    </button>
                  )} */}
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
