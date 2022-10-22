import type {Types, PopulatedDoc, Document} from 'mongoose';
import {Schema, model} from 'mongoose';
import type {User} from '../user/model';

/**
 * This file defines the properties stored in a Follow
 * DO NOT implement operations here ---> use collection file
 */

// Type definition for Follow on the backend
// User A follows User B
// User is follower, User B is followee
export type Follow = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  followerId: Types.ObjectId;
  followeeId: Types.ObjectId;
};

export type PopulatedFollow = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  followerId: User;
  followeeId: User;
};

// Mongoose schema definition for interfacing with a MongoDB table
// Follows stored in this table will have these fields, with the
// type given by the type property, inside MongoDB
const FollowSchema = new Schema<Follow>({
  // The userId of the user who is following someone else
  followerId: {
    // Use Types.ObjectId outside of the schema
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  // The userId of the user who is being followed
  followeeId: {
    // Use Types.ObjectId outside of the schema
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
});

const FollowModel = model<Follow>('Follow', FollowSchema);
export default FollowModel;
