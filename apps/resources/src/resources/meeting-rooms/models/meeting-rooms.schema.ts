import { Schema, Document, Types } from 'mongoose';

// Define an interface representing a document in MongoDB.
export interface IMeetingRoom extends Document {
  branchId: Types.ObjectId; // Reference to Branch
  name: string;
  isAvailable: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Create a Schema corresponding to the document interface.
const MeetingRoomSchema = new Schema<IMeetingRoom>(
  {
    branchId: {
      type: Schema.Types.ObjectId, // Reference to the Branch collection
      required: true,
      ref: 'Branch',
    },
    name: {
      type: String,
      required: true,
    },
    isAvailable: {
      type: Boolean,
      required: true,
      default: true,
    },
  },
  {
    timestamps: true, // Automatically manages createdAt and updatedAt fields.
  },
);

export { MeetingRoomSchema };
