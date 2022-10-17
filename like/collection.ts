import type {HydratedDocument, Types} from 'mongoose';
import type {Like} from './model';
import LikeModel from './model';
var ObjectID = require('mongodb').ObjectID;

/**
 * This files contains a class that has the functionality to explore Likes
 * stored in MongoDB, including adding, finding, and deleting Likes.
 *
 * Note: HydratedDocument<Like> is the output of the LikeModel() constructor,
 * and contains all the information in Like. https://mongoosejs.com/docs/typescript.html
 */
class LikeCollection {
  /**
   * Add a Like to the collection
   *
   * @param {string} userId - The id of the user of the Like
   * @param {string} freetId - The id of the freet the Like belongs to
   * @return {Promise<HydratedDocument<Like>>} - The newly created Like
   */
  static async addOne(userId: Types.ObjectId | string, freetId: Types.ObjectId | string): Promise<HydratedDocument<Like>> {
    const Like = new LikeModel({
      userId,
      freetId
    });
    await Like.save(); // Saves Like to MongoDB
    return Like.populate(['userId', 'freetId']);
  }

  /**
   * Find a Like by userId and freetId
   *
   * @param {string} userId - The Like with the associated userId
   * @param {string} freetId - The Like with the associated freetId
   * @return {Promise<HydratedDocument<Like>> | Promise<null> } - The Like associated the given userId and freetId, if any
   */
  static async findOne(userId: Types.ObjectId | string, freetId: Types.ObjectId | string): Promise<HydratedDocument<Like>> {
    return LikeModel.findOne({userId: userId, freetId: freetId}).populate(['userId', 'freetId']);
  }

  /**
   * Get all the Likes in the database
   *
   * @return {Promise<HydratedDocument<Like>[]>} - An array of all of the Likes
   */
  static async findAll(): Promise<Array<HydratedDocument<Like>>> {
    // Retrieves Likes
    return LikeModel.find({}).populate(['userId', 'freetId']);
  }

  /**
   * Delete a Like with given userId and freetId.
   *
   * @param {string} userId - The Like with the associated userId
   * @param {string} freetId - The Like with the associated freetId
   * @return {Promise<Boolean>} - true if the Like has been deleted, false otherwise
   */
  static async deleteOne(userId: Types.ObjectId | string, freetId: Types.ObjectId | string): Promise<boolean> {
    const Like = await LikeModel.deleteOne({userId: userId, freetId: freetId});
    return Like !== null;
  }

  /**
   * Get all the freets associated with a given freetId
   *
   * @param {string} freetId - The username of the user associated with the freets
   * @return {Promise<HydratedDocument<Freet>[]>} - An array of all of the freets
   */
 static async findAllByFreetId(freetId: Types.ObjectId | string): Promise<Array<HydratedDocument<Like>>> {
    // var id = new ObjectID(freetId);
    return LikeModel.find({freetId: freetId}).populate(['userId', 'freetId']);
  }

  /**
   * Get the like count associated with a given freetId
   *
   * @param {string} freetId - The username of the user associated with the freets
   * @return {Promise<HydratedDocument<Freet>[]>} - An array of all of the freets
   */
 static async findFreetLikeCount(freetId: Types.ObjectId | string): Promise<number> {
    const Likes = await LikeModel.find({freetId: freetId});
    return Likes.length;
  }
}


export default LikeCollection;
