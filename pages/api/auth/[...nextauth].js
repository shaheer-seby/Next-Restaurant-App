import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { MongoClient } from 'mongodb';
import CartContext from '@/context/context';
import bcrypt from "bcryptjs";
import { useContext } from 'react';
import { signOut } from 'next-auth/react';


export default NextAuth.default({
    debug: true,
callbacks: {
  async jwt({ token, user }) {
    if (user) {
      token.id = user.id;
      token.address = user.address;
      token.phone = user.phone;
    }
    return token;
  },
  async session({ session, token }) {
    if (token) {
      session.user.id = token.id;
      session.user.address = token.address;
      session.user.phone = token.phone;
    }
    return session;
  }
},

  session: {
    strategy:'jwt'
  },
  providers: [
    CredentialsProvider.default({
      name: 'credentials',
     
      async authorize(credentials) {

        const client = await MongoClient.connect(process.env.MONGODB_URI);
        const db = client.db();
        const user = await db.collection("users").findOne({ email: credentials.email });
      

        if (!user) {
          throw new Error('No user found');
        }
        const isValid = await bcrypt.compare(credentials.password, user.password);
          if (!isValid) {
            throw new Error('Invalid password');
          }
          
          console.log('user',user)

          return {
  id: user._id.toString(),
  email: user.email,
  name: user.name,
  address: user.address,
  phone: user.phone
};


      }
    })
  ]
});
