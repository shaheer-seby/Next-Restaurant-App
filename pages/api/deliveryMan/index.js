import { connectToDatabase } from '@/lib/db';
import DeliveryMan from '@/models/deliveryMan.model';

export default async function handler(req, res) {
  // Allow requests from frontend (adjust origin as needed)
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3001');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Connect to DB
  await connectToDatabase();

  const { method } = req;
  const { id } = req.query;

  switch (method) {
    case 'GET':
      try {
        const deliveryMen = await DeliveryMan.find({});
        res.status(200).json(deliveryMen);
      } catch (error) {
        console.error('❌ GET error:', error);
        res.status(500).json({ message: 'Error fetching delivery men.' });
      }
      break;

    case 'POST':
      try {
        const newMan = await DeliveryMan.create(req.body);
        res.status(201).json(newMan);
      } catch (error) {
        console.error('❌ POST error:', error);
        res.status(400).json({ message: 'Error creating delivery man.', error });
      }
      break;

    case 'PUT':
      if (!id) {
        return res.status(400).json({ message: 'ID is required for update.' });
      }
      try {
        const updatedMan = await DeliveryMan.findByIdAndUpdate(id, req.body, {
          new: true,
          runValidators: true,
        });
        if (!updatedMan) {
          return res.status(404).json({ message: 'Delivery man not found.' });
        }
        res.status(200).json(updatedMan);
      } catch (error) {
        console.error('❌ PUT error:', error);
        res.status(400).json({ message: 'Error updating delivery man.', error });
      }
      break;

    case 'DELETE':
      if (!id) {
        return res.status(400).json({ message: 'ID is required for deletion.' });
      }
      try {
        const deleted = await DeliveryMan.findByIdAndDelete(id);
        if (!deleted) {
          return res.status(404).json({ message: 'Delivery man not found.' });
        }
        res.status(200).json({ message: 'Delivery man deleted.' });
      } catch (error) {
        console.error('❌ DELETE error:', error);
        res.status(400).json({ message: 'Error deleting delivery man.', error });
      }
      break;

    default:
      res.status(405).json({ message: 'Method Not Allowed' });
  }
}
