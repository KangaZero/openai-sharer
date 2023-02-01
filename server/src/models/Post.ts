import mongoose from "mongoose";

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

export const Post = mongoose.model<IPost>('Post', postSchema);
