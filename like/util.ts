import type {HydratedDocument} from 'mongoose';
import moment from 'moment';
import type {Like, PopulatedLike} from '../Like/model';

// Update this if you add a property to the Like type!
type LikeResponse = {
  _id: string;
  author: string;
  freetId: string
};

/**
 * Transform a raw Like object from the database into an object
 * with all the information needed by the frontend
 *
 * @param {HydratedDocument<Like>} Like - A Like
 * @returns {LikeResponse} - The Like object formatted for the frontend
 */
const constructLikeResponse = (Like: HydratedDocument<Like>): LikeResponse => {
  const LikeCopy: PopulatedLike = {
    ...Like.toObject({
      versionKey: false // Cosmetics; prevents returning of __v property
    })
  };
  const {username} = LikeCopy.authorId;
  delete LikeCopy.authorId;
  return {
    ...LikeCopy,
    _id: LikeCopy._id.toString(),
    author: username,
    freetId: LikeCopy.freetId._id.toString()
  };
};

export {
  constructLikeResponse
};
