import { connectToDatabase } from "@/lib/db";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { id } = req.query;
  const { name, rating, comment, customer_id } = req.body;

  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid ID" });
  }

  try {
    const { db } = await connectToDatabase();
    const collection = db.collection("deliverymens");
    const _id = new ObjectId(id);

    const deliveryMan = await collection.findOne({ _id });
    if (!deliveryMan) {
      return res.status(404).json({ message: "Delivery man not found" });
    }

    const review = {
      name,
      rating: Number(rating),
      comment,
      customer: customer_id,
    };

    const updatedReviews = [...(deliveryMan.reviews || []), review];
    const newRating =
      updatedReviews.reduce((acc, item) => item.rating + acc, 0) /
      updatedReviews.length;

    await collection.updateOne(
      { _id },
      {
        $set: {
          reviews: updatedReviews,
          totalReviews: updatedReviews.length,
          rating: newRating,
        },
      }
    );

    return res.status(200).json({ message: "Review submitted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Error submitting review" });
  }
}
