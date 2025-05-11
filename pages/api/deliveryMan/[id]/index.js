import { connectToDatabase } from "@/lib/db";
import DeliveryMan from "@/models/deliveryMan.model";

export default async function handler(req, res) {
  await connectToDatabase();
  const {
    query: { id },
    method,
  } = req;

  if (!id) return res.status(400).json({ message: "Missing ID" });

  switch (method) {
    case "GET":
      try {
        const man = await DeliveryMan.findById(id);
        if (!man) return res.status(404).json({ message: "Not found" });
        res.status(200).json(man);
      } catch (err) {
        res.status(500).json({ message: "Error fetching delivery man" });
      }
      break;

    case "PUT":
      try {
        const updated = await DeliveryMan.findByIdAndUpdate(id, req.body, {
          new: true,
          runValidators: true,
        });
        if (!updated) return res.status(404).json({ message: "Not found" });
        res.status(200).json(updated);
      } catch (err) {
        res.status(400).json({ message: "Update error", err });
      }
      break;

    case "DELETE":
      try {
        const deleted = await DeliveryMan.findByIdAndDelete(id);
        if (!deleted) return res.status(404).json({ message: "Not found" });
        res.status(200).json({ message: "Deleted successfully" });
      } catch (err) {
        res.status(400).json({ message: "Delete error", err });
      }
      break;

    default:
      res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
