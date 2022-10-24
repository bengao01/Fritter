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
  const freets = await FreetCollection.findAllByUsername(FollowCopy.followeeId.username);

  const user = await UserCollection.findOneByUsername(FollowCopy.followerId.username);
  
  // If user wants to depolarize, only return freets with more likes than downvotes
  if (user.depolarize){
    let filteredFreets: Array<HydratedDocument<Freet>> = [];
    for(let i = 0; i < freets.length; i++){
      const FreetCopy: PopulatedFreet = {
        ...freets[i].toObject({
          versionKey: false // Cosmetics; prevents returning of __v property
        })
      };
      const downvotes = await DownvoteCollection.findFreetDownvoteCount(FreetCopy._id);
      const likes = await LikeCollection.findFreetLikeCount(FreetCopy._id);
      
      if (likes >= downvotes){
        filteredFreets.push(freets[i]);
      }
    }
    return filteredFreets;
  }

  return freets;
};

export {
  constructFollowResponse,
  getUserFreets
};
