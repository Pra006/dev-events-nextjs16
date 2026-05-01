import mongoose, { Schema, Document } from 'mongoose';
import Event from './event.model';

// Define the Booking interface for TypeScript
export interface IBooking extends Document {
  eventId: mongoose.Types.ObjectId;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

// Define the Booking schema
const bookingSchema = new Schema(
  {
    eventId: { type: Schema.Types.ObjectId, ref: 'Event', required: true },
    email: {
      type: String,
      required: true,
      validate: {
        validator: function (v: string) {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); // Basic email regex
        },
        message: 'Email must be a valid email address',
      },
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

// Add index on eventId for faster queries
bookingSchema.index({ eventId: 1 });

// Pre-save hook to verify the referenced event exists
bookingSchema.pre('save', async function() {
  const doc = this as any;
  // Check if the eventId corresponds to an existing Event
  const event = await Event.findById(doc.eventId);
  if (!event) {
    throw new Error('Referenced event does not exist');
  }
});

// Create and export the Booking model
const Booking = mongoose.model<IBooking>('Booking', bookingSchema);
export default Booking;