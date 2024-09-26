import { Schema, Document } from 'mongoose';

// Define an interface representing a document in MongoDB.
export interface IBranch extends Document {
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

// Create a Schema corresponding to the document interface.
const BranchSchema = new Schema<IBranch>(
  {
    name: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, // Automatically manages createdAt and updatedAt fields.
  },
);

export { BranchSchema }; // Ensure this line is present
