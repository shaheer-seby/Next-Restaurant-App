'use client'
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios"; // Using simple axios
import Navbar from "./components/navbar";

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    totalOrders: 0,
    revenue: 0,
    totalFoods: 0,
    totalCategories: 0,
    totalBlogs: 0,
    totalCustomers: 0,
 
  });
  const [loading, setLoading] = useState(true);

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.2, duration: 0.5, ease: "easeOut" },
    }),
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/dashboard-stats");
      if (response.status === 200) {
        setDashboardData(response.data);
        console.log("Dashboard data loaded:", response.data);
      } else {
        console.error("Failed to fetch dashboard data");
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const cards = [
    {
      title: "Total Orders",
      icon: "ri-shopping-basket-line",
      count: loading ? "0" : `${dashboardData.totalOrders}+`,
    },
    {
      title: "Revenue",
      icon: "ri-currency-fill",
      count: loading ? "0" : `Rs ${dashboardData.revenue}+`,
    },
    {
      title: "Foods",
      icon: "ri-service-line",
      count: loading ? "0" : `${dashboardData.totalFoods}+`,
    },
    {
      title: "Categories",
      icon: "ri-list-check",
      count: loading ? "0" : `${dashboardData.totalCategories}+`,
    },
    {
      title: "Blogs",
      icon: "ri-pages-line",
      count: loading ? "0" : `${dashboardData.totalBlogs}+`,
    },
    {
      title: "Customers",
      icon: "ri-map-pin-user-fill",
      count: loading ? "0" : `${dashboardData.totalCustomers}+`,
    },
 
  ];

  return (
    <>
    <Navbar/>
    <div className="container-fluid bg-light p-5">
      <h1 className="text-center mb-5">Dashboard</h1>
      <div className="row">
        {cards.map((card, index) => (
          <motion.div
            key={index}
            className="col-md-4 mb-4"
            custom={index}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="card shadow-lg border-0 rounded-lg p-4">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h5 className="card-title">{card.title}</h5>
                  <p className="card-text display-4 text-primary">{card.count}</p>
                </div>
                <div className="text-primary" style={{ fontSize: "2rem" }}>
                  <i className={card.icon}></i>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
    </>
  );
};

export default Dashboard;
