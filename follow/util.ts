import FreetCollection from '../freet/collection';
import { Freet } from 'freet/model';
import type {HydratedDocument} from 'mongoose';
import type {Follow, PopulatedFollow} from '../Follow/model';

type FollowResponse = {
  _id: string;
  follower: string;
  followee: string
};

/**
 * Transform a raw Follow object from the database into an object
 * with all the information needed by the frontend
 *
 * @param {HydratedDocument<Follow>} Follow - A Follow
 * @returns {FollowResponse} - The Follow object formatted for the frontend
 */
const constructFollowResponse = (Follow: HydratedDocument<Follow>): FollowResponse => {
  const FollowCopy: PopulatedFollow = {
    ...Follow.toObject({
      versionKey: false // Cosmetics; prevents returning of __v property
    })
  };
  console.log("followCopy is:", FollowCopy);
  return {
    _id: FollowCopy._id.toString(),
    follower: FollowCopy.followerId.username,
    followee: FollowCopy.followeeId.username,
  };
};

/**
 * Transform a raw Freet object from the database into an object
 * with all the information needed by the frontend
 *
 * @param {HydratedDocument<Freet>} freet - A freet
 * @returns {FreetResponse} - The freet object formatted for the frontend
 */
 const getUserFreets = async (Follow: HydratedDocument<Follow>): Promise<Array<HydratedDocument<Freet>>> => {
  const FollowCopy: PopulatedFollow = {
    ...Follow.toObject({
      versionKey: false // Cosmetics; prevents returning of __v property
    })
  };
  console.log("followCopy is", FollowCopy)
  const freets = await FreetCollection.findAllByUsername(FollowCopy.followeeId.username);
  console.log("freets is:", freets);
  return freets;
};

export {
  constructFollowResponse,
  getUserFreets
};
