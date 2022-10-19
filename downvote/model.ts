import type {Types, PopulatedDoc, Document} from 'mongoose';
import {Schema, model} from 'mongoose';
import type {User} from '../user/model';
import type {Freet} from '../freet/model'

/**
 * This file defines the properties stored in a Downvote
 * DO NOT implement operations here ---> use collection file
 */

// Type definition for Downvote on the backend
export type Downvote = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  userId: Types.ObjectId;
  freetId: Types.ObjectId;
};

export type PopulatedDownvote = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  userId: User;
  freetId: Freet;
};

// Mongoose schema definition for interfacing with a MongoDB table
// Downvotes stored in this table will have these fields, with the
// type given by the type property, inside MongoDB
const DownvoteSchema = new Schema<Downvote>({
  // The userId of the user who made the downvote
  userId: {
    // Use Types.ObjectId outside of the schema
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  // The associated Freet's  userId
  freetId: {
    // Use Types.ObjectId outside of the schema
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Freet'
  },
});

const DownvoteModel = model<Downvote>('Downvote', DownvoteSchema);
export default DownvoteModel;
