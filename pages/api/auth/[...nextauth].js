import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { MongoClient } from 'mongodb';

export default NextAuth({
  session: {
    jwt:true
  },
  providers: [
    CredentialsProvider({
      name: 'credentials',
     
      async authorize(credentials) {
        const client = await MongoClient.connect("mongodb+srv://hira:12345677@cluster0.k927h.mongodb.net/signup?retryWrites=true&w=majority&appName=Cluster0");
        const db = client.db();
        const user = await db.collection("users").findOne({ email: credentials.email });

        if (!user) {
          throw new Error('No user found');
        }

        if (credentials.password === user.password) {
          return {  email: user.email };
        } else {
          throw new Error('Password does not match');
        }
      }
    })
  ]
});
