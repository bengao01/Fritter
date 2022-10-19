import type {HydratedDocument} from 'mongoose';
import type {Downvote, PopulatedDownvote} from '../Downvote/model';

// Update this if you add a property to the Downvote type!
type DownvoteResponse = {
  _id: string;
  user: string;
  freetId: string
};

/**
 * Transform a raw Downvote object from the database into an object
 * with all the information needed by the frontend
 *
 * @param {HydratedDocument<Downvote>} Downvote - A Downvote
 * @returns {DownvoteResponse} - The Downvote object formatted for the frontend
 */
const constructDownvoteResponse = (Downvote: HydratedDocument<Downvote>): DownvoteResponse => {
  const DownvoteCopy: PopulatedDownvote = {
    ...Downvote.toObject({
      versionKey: false // Cosmetics; prevents returning of __v property
    })
  };
  const {username} = DownvoteCopy.userId;
  delete DownvoteCopy.userId;
  return {
    ...DownvoteCopy,
    _id: DownvoteCopy._id.toString(),
    user: username,
    freetId: DownvoteCopy.freetId._id.toString()
  };
};

export {
  constructDownvoteResponse
};
