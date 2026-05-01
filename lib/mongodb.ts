import mongoose from 'mongoose';

// Define the global type for caching the Mongoose connection
declare global {
  var mongoose: {
    conn: mongoose.Connection | null;
    promise: Promise<mongoose.Connection> | null;
  };
}

// Retrieve the MongoDB URI from environment variables
const MONGODB_URI = process.env.MONGODB_URI!;

// Ensure the MongoDB URI is defined
if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

// Initialize the cached connection object if it doesn't exist
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

/**
 * Connects to the MongoDB database using Mongoose.
 * Caches the connection to prevent multiple connections during development.
 * @returns A promise that resolves to the Mongoose connection.
 */
async function connectToDatabase(): Promise<mongoose.Connection> {
  // Return the cached connection if it exists
  if (cached.conn) {
    return cached.conn;
  }

  // Create a new connection promise if one doesn't exist
  if (!cached.promise) {
    const opts: mongoose.ConnectOptions = {
      bufferCommands: false, // Disable mongoose buffering
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongooseInstance) => {
      return mongooseInstance.connection;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectToDatabase;