import { MongoClient } from "mongodb";

export default async function handler(req, res) {
    if(req.method==='POST')
    {

    const data=req.body;
    const email=data.email;
    const pass=data.password;
    
    const client= await MongoClient.connect("mongodb+srv://hira:12345677@cluster0.k927h.mongodb.net/signup?retryWrites=true&w=majority&appName=Cluster0")
    const db= client.db();

    await db.collection("users").insertOne({
        email:email,
        password:pass
    })
    res.status(200).json({ message:"created user" });
  }
}
  