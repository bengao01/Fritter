import type {HydratedDocument, Types} from 'mongoose';
import type {Follow} from './model';
import FollowModel from './model';

/**
 * This files contains a class that has the functionality to explore Follows
 * stored in MongoDB, including adding, finding, and deleting Follows.
 *
 * Note: HydratedDocument<Follow> is the output of the FollowModel() constructor,
 * and contains all the information in Follow. https://mongoosejs.com/docs/typescript.html
 */
class FollowCollection {
  /**
   * Add a Follow to the collection
   *
   * @param {string} followerId - The id of the user who is following someone
   * @param {string} followeeId - The id of the user of is being followed
   * @return {Promise<HydratedDocument<Follow>>} - The newly created Follow
   */
  static async addOne(followerId: Types.ObjectId | string, followeeId: Types.ObjectId | string): Promise<HydratedDocument<Follow>> {
    const Follow = new FollowModel({
      followerId,
      followeeId
    });
    await Follow.save(); // Saves Follow to MongoDB
    return Follow.populate(['followerId', "followeeId"]);
  }

  /**
   * Find a Follow by followerId and followeeId
   *
   * @param {string} followerId - The Follow with the associated userId
   * @param {string} followeeId - The Follow with the associated freetId
   * @return {Promise<HydratedDocument<Follow>> | Promise<null> } - The Follow associated the given userId and freetId, if any
   */
  static async findOne(followerId: Types.ObjectId | string, followeeId: Types.ObjectId | string): Promise<HydratedDocument<Follow>> {
    return FollowModel.findOne({followerId: followerId, followeeId: followeeId}).populate(['followerId', 'followeeId']);
  }

  /**
   * Get all the Follows in the database
   *
   * @return {Promise<HydratedDocument<Follow>[]>} - An array of all of the Follows
   */
  static async findAll(): Promise<Array<HydratedDocument<Follow>>> {
    // Retrieves Follows
    return FollowModel.find({}).populate(['followerId', 'followeeId']);
  }

  /**
   * Delete a Follow with followerId and followeeId
   *
   * @param {string} followerId - The Follow with the associated followerId
   * @param {string} followeeId - The Follow with the associated followeeId
   * @return {Promise<Boolean>} - true if the Follow has been deleted, false otherwise
   */
  static async deleteOne(followerId: Types.ObjectId | string, followeeId: Types.ObjectId | string): Promise<boolean> {
    const Follow = await FollowModel.deleteOne({followerId: followerId, followeeId: followeeId});
    return Follow !== null;
  }

  /**
   * Get all the followers who are following a given followeeId
   *
   * @param {string} followeeId - The id of the user whose followers we are getting
   * @return {Promise<HydratedDocument<Follow>[]>} - An array of all of the follow objects
   */
 static async getAllFollowers(followeeId: Types.ObjectId | string): Promise<Array<HydratedDocument<Follow>>> {
    // var id = new ObjectID(freetId);
    return FollowModel.find({followeeId: followeeId}).populate(['followerId', 'followeeId']);
  }

  /**
   * Get all the people userId is following
   *
   * @param {string} userId - The id of the user whose following objects we are retrieving
   * @return {Promise<HydratedDocument<Follow>[]>} - An array of all of the follow objects
   */
 static async getAllFollowing(userId: Types.ObjectId | string): Promise<Array<HydratedDocument<Follow>>> {
  // var id = new ObjectID(freetId);
  return FollowModel.find({followerId: userId}).populate(['followerId', 'followeeId']);
  }
}


export default FollowCollection;
