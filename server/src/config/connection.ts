import mongoose from 'mongoose';

// Importing it as a deconstructor results in an error
import blueBright from "chalk";
import redBright from "chalk";
import green from "chalk";

const mongodbURI = process.env.MONGODB_URI
const dbName = process.env.MONGODB_NAME

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