
import mongoose, { Mongoose } from "mongoose";
import logger from './logger';

const MONGODB_URI = process.env.MONGO_URI ;

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI is not defined");
}

interface MongooseCache {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

// Augment global type for TypeScript
declare global {
 // eslint-disable-next-line no-var
  var mongoose: MongooseCache | undefined;
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

cached = global.mongoose as MongooseCache; // <-- ensure cached is not undefined

const dbConnect = async (): Promise<Mongoose> => {
  if (cached.conn){
 logger.info("Using cached MongoDB connection");
   return cached.conn;
  } 

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      dbName:'devflow'
    }).then((result)=>{
        console.log("connected to mongodb");
        return result;
    }).catch((error)=>{
       console.log("Error connection to mongodb",error); 
       throw error;
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
};

export default dbConnect;