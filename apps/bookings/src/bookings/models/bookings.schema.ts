// import { Schema, Document, Types } from 'mongoose';

// // Define an interface representing a document in MongoDB.
// export interface IBooking extends Document {
//   meetingRoomId: Types.ObjectId; // Reference to the MeetingRoom collection
//   userId: string; // Regular string reference to the User collection
//   participants: string[]; // Array of userIds as strings
//   name: string;
//   details: string;
//   startTime: Date;
//   endTime: Date;
//   status: 'confirmed' | 'canceled';
//   createdAt: Date;
//   updatedAt: Date;
//   isActive: boolean;
// }

// // Create a Schema corresponding to the document interface.
// const BookingSchema = new Schema<IBooking>(
//   {
//     meetingRoomId: {
//       type: Schema.Types.ObjectId, // MongoDB ObjectId reference to the MeetingRoom collection
//       required: true,
//     },
//     userId: {
//       type: String, // Regular string reference to the UserId in AppWrite
//       required: true,
//     },
//     participants: [
//       {
//         type: String, // Array of userIds as strings
//       },
//     ],
//     name: {
//       type: String,
//       required: true,
//     },
//     details: {
//       type: String,
//       required: true,
//     },
//     startTime: {
//       type: Date,
//       required: true,
//     },
//     endTime: {
//       type: Date,
//       required: true,
//     },
//     status: {
//       type: String,
//       enum: ['confirmed', 'canceled'],
//       required: true,
//       default: 'confirmed',
//     },
//     isActive: {
//       type: Boolean,
//       required: true,
//       default: true,
//     },
//   },
//   {
//     timestamps: true, // Automatically manages createdAt and updatedAt fields.
//   },
// );

// export { BookingSchema };
import { Schema, Document, Types } from 'mongoose';

// Define an interface for the User object.
interface User {
  id: string; // uuidv4
  name: string;
  email: string;
  employeeId: string;
}

// Define an interface representing a document in MongoDB.
export interface IBooking extends Document {
  meetingRoomId: Types.ObjectId; // Reference to the MeetingRoom collection
  user: User; // Embedded User object
  participants: User[]; // Array of User objects
  name: string;
  details: string;
  startTime: Date;
  endTime: Date;
  status: 'confirmed' | 'canceled';
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

// Create a Schema corresponding to the document interface.
const BookingSchema = new Schema<IBooking>(
  {
    meetingRoomId: {
      type: Schema.Types.ObjectId, // MongoDB ObjectId reference to the MeetingRoom collection
      required: true,
    },
    user: {
      id: { type: String, required: true }, // UUIDv4
      name: { type: String, required: true },
      email: { type: String, required: true },
      employeeId: { type: String, required: true },
    },
    participants: [
      {
        id: { type: String, required: true }, // UUIDv4
        name: { type: String, required: true },
        email: { type: String, required: true },
        employeeId: { type: String, required: true },
      },
    ],
    name: {
      type: String,
      required: true,
    },
    details: {
      type: String,
      required: true,
    },
    startTime: {
      type: Date,
      required: true,
    },
    endTime: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ['confirmed', 'canceled'],
      required: true,
      default: 'confirmed',
    },
    isActive: {
      type: Boolean,
      required: true,
      default: true,
    },
  },
  {
    timestamps: true, // Automatically manages createdAt and updatedAt fields.
  },
);

export { BookingSchema };
