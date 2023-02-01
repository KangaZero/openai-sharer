import {Post}   from "../models/post";
import { signToken } from "../utils/auth";

const resolvers = {
    Query: {
      posts: async () => {
        return await Post.find({});
      },
    },
    Mutation: {
      createPost: async (_, args, context) => {
        const post = new context.models.Post(args);
        return post.save();
      },
    },
  };
  
//   export default resolvers;
