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
   * @param {string} authorId - The id of the author of the Like
   * @param {string} freetId - The id of the freet the Like belongs to
   * @return {Promise<HydratedDocument<Like>>} - The newly created Like
   */
  static async addOne(authorId: Types.ObjectId | string, freetId: Types.ObjectId | string): Promise<HydratedDocument<Like>> {
    const Like = new LikeModel({
      authorId,
      freetId
    });
    await Like.save(); // Saves Like to MongoDB
    return Like.populate(['authorId', 'freetId']);
  }

  /**
   * Find a Like by authorId and freetId
   *
   * @param {string} authorId - The Like with the associated authorId
   * @param {string} freetId - The Like with the associated freetId
   * @return {Promise<HydratedDocument<Like>> | Promise<null> } - The Like associated the given authorId and freetId, if any
   */
  static async findOne(authorId: Types.ObjectId | string, freetId: Types.ObjectId | string): Promise<HydratedDocument<Like>> {
    return LikeModel.findOne({authorId: authorId, freetId: freetId}).populate(['authorId', 'freetId']);
  }

  /**
   * Get all the Likes in the database
   *
   * @return {Promise<HydratedDocument<Like>[]>} - An array of all of the Likes
   */
  static async findAll(): Promise<Array<HydratedDocument<Like>>> {
    // Retrieves Likes
    return LikeModel.find({}).populate(['authorId', 'freetId']);
  }

//   /**
//    * Get all the freets in by given author
//    *
//    * @param {string} username - The username of author of the freets
//    * @return {Promise<HydratedDocument<Freet>[]>} - An array of all of the freets
//    */
//    static async findLikeCountByFreetId(freetId: string): Promise<BigInt> {
//     const author = await UserCollection.findOneByUsername(username);
//     return LikeModel.find({authorId: author._id}).populate('authorId');
//   }

  /**
   * Delete a Like with given authorId and freetId.
   *
   * @param {string} authorId - The Like with the associated authorId
   * @param {string} freetId - The Like with the associated freetId
   * @return {Promise<Boolean>} - true if the Like has been deleted, false otherwise
   */
  static async deleteOne(authorId: Types.ObjectId | string, freetId: Types.ObjectId | string): Promise<boolean> {
    const Like = await LikeModel.deleteOne({authorId: authorId, freetId: freetId});
    return Like !== null;
  }

  /**
   * Get all the freets associated with a given freetId
   *
   * @param {string} freetId - The username of author of the freets
   * @return {Promise<HydratedDocument<Freet>[]>} - An array of all of the freets
   */
 static async findAllByFreetId(freetId: Types.ObjectId | string): Promise<Array<HydratedDocument<Like>>> {
    // var id = new ObjectID(freetId);
    return LikeModel.find({freetId: freetId}).populate(['authorId', 'freetId']);
  }

  /**
   * Get the like count associated with a given freetId
   *
   * @param {string} freetId - The username of author of the freets
   * @return {Promise<HydratedDocument<Freet>[]>} - An array of all of the freets
   */
 static async findFreetLikeCount(freetId: Types.ObjectId | string): Promise<number> {
    // var id = new ObjectID(freetId);
    const Likes = await LikeModel.find({freetId: freetId});
    return Likes.length;
  }
}


export default LikeCollection;
