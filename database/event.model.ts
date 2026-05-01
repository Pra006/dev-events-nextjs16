import mongoose, { Schema, Document } from 'mongoose';

// Define the Event interface for TypeScript
export interface IEvent extends Document {
  title: string;
  slug: string;
  description: string;
  overview: string;
  image: string;
  venue: string;
  location: string;
  date: string;
  time: string;
  mode: string;
  audience: string;
  agenda: string[];
  organizer: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

// Define the Event schema
const eventSchema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, unique: true },
    description: { type: String, required: true },
    overview: { type: String, required: true },
    image: { type: String, required: true },
    venue: { type: String, required: true },
    location: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    mode: { type: String, required: true },
    audience: { type: String, required: true },
    agenda: [{ type: String, required: true }],
    organizer: { type: String, required: true },
    tags: [{ type: String, required: true }],
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

// Add unique index on slug
eventSchema.index({ slug: 1 }, { unique: true });

// Pre-save hook for slug generation, date normalization, and validation
eventSchema.pre('save', async function() {
  const doc = this as any;
  // Generate slug only if title has changed or is new
  if (doc.isModified('title') || doc.isNew) {
    doc.slug = generateSlug(doc.title);
  }

  // Normalize date to ISO format if it's not already
  if (doc.isModified('date') || doc.isNew) {
    doc.date = new Date(doc.date).toISOString().split('T')[0]; // YYYY-MM-DD
  }

  // Ensure time is in HH:MM format (basic validation)
  if (doc.isModified('time') || doc.isNew) {
    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
    if (!timeRegex.test(doc.time)) {
      throw new Error('Time must be in HH:MM format');
    }
  }

  // Validate required fields are non-empty
  const requiredFields = ['title', 'description', 'overview', 'image', 'venue', 'location', 'date', 'time', 'mode', 'audience', 'organizer'];
  for (const field of requiredFields) {
    if (!doc[field] || (typeof doc[field] === 'string' && doc[field].trim() === '')) {
      throw new Error(`${field} is required and cannot be empty`);
    }
  }
});

// Helper function to generate URL-friendly slug
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim();
}

// Create and export the Event model
const Event = mongoose.model<IEvent>('Event', eventSchema);
export default Event;