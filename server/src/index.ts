import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import express from 'express';
import http from 'http';
import cors from 'cors';
import pkg from 'body-parser';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import blueBright from "chalk";
import redBright from "chalk";
import green from "chalk";
import jwt from 'jsonwebtoken';
dotenv.config();

// import { typeDefs, resolvers } from './schema';
// import {Post}  from './models/index';
// import { typeDefs, resolvers } from './schema';
// import { connectDB } from './config/connection';
// import { auth } from './utils/auth';

const secret: string = 'lisztomania';
const expiration: string = '2h';

export var auth = ({ req }) => {
  // allows token to be sent via req.body, req.query, or headers
  let token = req.body.token || req.query.token || req.headers.authorization;

  // ["Bearer", "<tokenvalue>"]
  if (req.headers.authorization) {
    token = token.split(' ').pop().trim();
  }

  if (!token) {
    return req;
  }

  try {
    const { data }: any = jwt.verify(token, secret, { maxAge: expiration });
    req.user = data;
   
  } catch {
    console.log('Invalid token');
  }

  return req;
}

const mongodbURI = process.env.MONGODB_URI
const dbName = process.env.MONGODB_NAME

const { Schema } = mongoose;

export interface IPost {
  name: string
  prompt: string
  photo: string
}

export interface IPostDocument extends IPost, mongoose.Document {}

const postSchema = new Schema({
name: {
  type: String,
  required: true,
  trim: true
},
prompt: {
  type: String,
  required: true,
  trim: true
},
photo: {
  type: String,
  required: true,
  trim: true
},
});

const Post = mongoose.model<IPost>('Post', postSchema);

const connectOptions = {
  autoIndex: false,
}

export const connectDB = async (mongodbURI: string, dbName: string) => {
  if (!mongodbURI || !dbName) {
    return Promise.reject('MongoDB URI or DB Name is not defined')
  }
  try {
    await mongoose.connect(
      mongodbURI,
      { ...connectOptions, dbName },
      (error) => {
        if (error) {
          console.log(redBright(error))
        }
      }
    )
    console.log(blueBright('🐣 mongodb database started'))
    console.log(green(`🙉 dbURL `, mongodbURI))
    console.log(green(`🙉 dbName `, dbName))
  } catch (error) {
    console.log(error)
    return undefined
  }
}

const resolvers = {
  Query: {
    posts: async () => {
      return await Post.find({});
    },
  },
  Mutation: {
    createPost: async (parent, args, context) => {
      const post = new context.models.Post(args);
      return post.save();
    },
  },
};

const typeDefs = `#graphql
type Post {
    name: String!
    prompt: String!
    photo: String!
  }
  
  type Query {
    posts: [Post]!
  }
  
  type Mutation {
    createPost(name: String!, prompt: String!, photo: String!): Post!
  }
`

  interface MyContext {
    typeDefs: any,
    resolvers: any,
    // token?: String;
  }

  const app = express();

  const httpServer = http.createServer(app);

   const { json } = pkg;

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    // context: auth,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });

  app.use(
    '/graphql',
    cors<cors.CorsRequest>(),
    json(),
    
  );

export const startApolloServer = async () => {
try {
  await connectDB(mongodbURI, dbName)
  await server.start();

  app.listen({ port: 4000 }, () => {
    console.log(`🚀 Server ready at http://localhost:4000/graphql`);

  })

  //  await new Promise<void>((resolve) =>
  //  startStandaloneServer(server, {
  //   listen: { port: 4000 },
  // })
  //  )

  // await new Promise<void>((resolve) =>
  //     httpServer.listen({ port: 4000 }, resolve)
  //   )
  


} catch (err) {

  throw console.error('Something went wrong in Apollo')

}
};

startApolloServer();