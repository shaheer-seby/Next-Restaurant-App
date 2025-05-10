import mongoose from "mongoose";
import dotenv from "dotenv";
import Orders from "../../models/order.model.js";

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

async function insertOrders() {
  try {
    await mongoose.connect(MONGODB_URI, { dbName: "restaurantDB" });

    const sampleOrders = [
      {
        orderID: "ORD12345",
        customer_id: "CUST1",
        customer_name: "Ali",
        items: [
          {
            title: "Zinger Burger",
            thumb: "https://example.com/zinger.jpg",
            price: 450,
            quantity: 2,
            itemTotal: 900,
          },
        ],
        total_foods: 1,
        total_quantity: 2,
        deliveryCost: 100,
        total_price: 1000,
        phone: "03001234567",
        email: "ali@example.com",
        city: "Lahore",
        address: "123 Main Street",
        payment: "Cash",
      },
    ];

    const result = await Orders.insertMany(sampleOrders);
    console.log("✅ Orders inserted:", result);
    mongoose.disconnect();
  } catch (error) {
    console.error("❌ Insertion error:", error);
  }
}

insertOrders();
