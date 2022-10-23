import FreetCollection from '../freet/collection';
import { Freet, PopulatedFreet } from '../freet/model';
import type {HydratedDocument} from 'mongoose';
import type {Follow, PopulatedFollow} from '../Follow/model';
import UserCollection from '../user/collection';
import DownvoteCollection from '../downvote/collection';
import LikeCollection from '../like/collection';


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
 * @param {HydratedDocument<Follow>} follow - A follow object
 * @returns {Promise<Array<HydratedDocument<FreetResponse>>>} - The freet object formatted for the frontend
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

  const user = await UserCollection.findOneByUsername(FollowCopy.followerId.username);
  if (user.depolarize){
    const filteredFreets = await Promise.all(freets.filter(notControversialFreet));
    console.log("filtered freets is: ", filteredFreets);
    return filteredFreets
  } else{
    return freets;
  }
};

/**
 * Checks if a freet is controversial or not (more downvotes than likes)
 * @param {HydratedDocument<Freet>} freet - A freet
 * @returns {boolean} - True if freet is not controversial, false otherwise
 */
 const notControversialFreet = async (Freet: HydratedDocument<Freet>): Promise<boolean> => {
  const FreetCopy: PopulatedFreet = {
    ...Freet.toObject({
      versionKey: false // Cosmetics; prevents returning of __v property
    })
  };
  const downvotes = await DownvoteCollection.findFreetDownvoteCount(FreetCopy._id);
  const likes = await LikeCollection.findFreetLikeCount(FreetCopy._id);
  console.log("freet downvote count:", downvotes);
  console.log("freet like count:", likes);
  console.log(likes >= downvotes);
  return likes >= downvotes;
};

export {
  constructFollowResponse,
  getUserFreets
};
