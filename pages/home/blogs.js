import React, { useEffect, useState } from "react";
import  Link  from "next/link";
import moment from "moment";
import { motion } from "framer-motion";
import styles from '../../styles/Home.module.css';



const headerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const cardVariants = {
  hidden: i => ({
    opacity: 0,
    y: 20,
    transition: { delay: i * 0.1, type: "spring", stiffness: 100 }
  }),
  visible: { opacity: 1, y: 0 },
  hover: { scale: 1.02, boxShadow: "0 6px 18px rgba(0,0,0,0.15)" }
};

const blogs = () => {
  const [blogs, setBlogs] = useState([
    {
      _id: "1",
      thumb: "food.png",
      title: "The Importance of Nutrition for a Healthy Life",
      description:
        "Nutrition plays a crucial role in our health. A balanced diet is key to maintaining overall well-being...",
      post_by: "John Doe",
      date: "2025-05-04T12:00:00Z",
      featured: "on"
    },
    {
      _id: "2",
      thumb: "exercise.png",
      title: "How Exercise Improves Mental Health",
      description:
        "Exercise is not only beneficial for your physical health but also significantly enhances mental well-being...",
      post_by: "Jane Smith",
      date: "2025-04-25T10:00:00Z",
      featured: "on"
    },
    {
      _id: "3",
      thumb: "recipe.png",
      title: "Healthy Recipes to Try This Summer",
      description:
        "With summer around the corner, here are some fresh and nutritious recipes to keep you feeling energized...",
      post_by: "Alice Johnson",
      date: "2025-04-20T09:00:00Z",
      featured: "off"
    }
  ]);

  // Commenting out the backend fetching code for now
  // useEffect(() => {
  //   axios
  //     .get("http://localhost:1000/api/admin/blogs")
  //     .then(({ data }) =>
  //       setBlogs(data.filter(b => b.featured.toLowerCase() === "on"))
  //     )
  //     .catch(console.error);
  // }, []);

  return (
    <section className="py-5 bg-light">
      <div className="container">
        <motion.div
          className={styles.headerContainer}
          initial="hidden"
          animate="visible"
          variants={headerVariants}
        >
          <p className={styles.headerText}>From Our Journal</p>
          <h2 className={styles.titleText}>Insights & Inspirations</h2>
          <div className={styles.separator} />
        </motion.div>

        {blogs.length === 0 ? (
          <h4 className="text-center text-secondary">No posts found.</h4>
        ) : (
          <div className={styles.cardContainer}>
            {blogs.slice(0, 3).map((post, idx) => (
              <div key={post._id} className={styles.cardItem}>
                <motion.div
                  className="card h-100 border-0 shadow-sm overflow-hidden"
                  custom={idx}
                  initial="hidden"
                  animate="visible"
                  whileHover="hover"
                  variants={cardVariants}
                >
                  <Link href={`/blogs/${post._id}`} passHref>
                    <div className="ratio ratio-4x3">
                      <img
                        src={`/blogs/${post.thumb}`}
                        alt={post.title}
                        className={`${styles.cardImage} card-img-top img-fluid`}
                      />
                    </div>
                  </Link>
                  <div className={styles.cardBody}>
                    <div className={styles.cardHeader}>
                      <span>
                        <i className="fa fa-user me-1" />
                        {post.post_by}
                      </span>
                      <span>
                        <i className="fa fa-calendar-alt me-1" />
                        {moment(post.date).format("MMM D, YYYY")}
                      </span>
                    </div>
                    <Link href={`/blogs/${post._id}`} passHref>
                      <h5 className={styles.cardTitle}>
                        {post.title.length > 60
                          ? post.title.slice(0, 60) + "…"
                          : post.title}
                      </h5>
                    </Link>
                    <p className={styles.cardDescription}>
                      {post.description.length > 100
                        ? post.description.slice(0, 100) + "…"
                        : post.description}
                    </p>
                    <Link
                      href={`/blogs/${post._id}`}
                      passHref
                      className={styles.readMoreBtn}
                    >
                      <i className="fas fa-eye me-1" />
                      Read More
                    </Link>
                  </div>
                </motion.div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default blogs;
