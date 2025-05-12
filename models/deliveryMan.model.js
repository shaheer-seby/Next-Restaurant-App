import mongoose from "mongoose";

const deliveryManSchema = new mongoose.Schema({
  name: String,
  phone: String,
  email: String,
  address: String,
});

// ✅ Prevent model overwrite error in dev
const DeliveryMan = mongoose.models.DeliveryMan || mongoose.model("DeliveryMan", deliveryManSchema);

export default DeliveryMan;
