import type {HydratedDocument, Types} from 'mongoose';
import type {Downvote} from './model';
import DownvoteModel from './model';

/**
 * This files contains a class that has the functionality to explore Downvotes
 * stored in MongoDB, including adding, finding, and deleting Downvotes.
 *
 * Note: HydratedDocument<Downvote> is the output of the DownvoteModel() constructor,
 * and contains all the information in Downvote. https://mongoosejs.com/docs/typescript.html
 */
class DownvoteCollection {
  /**
   * Add a Downvote to the collection
   *
   * @param {string} userId - The id of the user of the Downvote
   * @param {string} freetId - The id of the freet the Downvote belongs to
   * @return {Promise<HydratedDocument<Downvote>>} - The newly created Downvote
   */
  static async addOne(userId: Types.ObjectId | string, freetId: Types.ObjectId | string): Promise<HydratedDocument<Downvote>> {
    const Downvote = new DownvoteModel({
      userId,
      freetId
    });
    await Downvote.save(); // Saves Downvote to MongoDB
    return Downvote.populate(['userId', 'freetId']);
  }

  /**
   * Find a Downvote by userId and freetId
   *
   * @param {string} userId - The Downvote with the associated userId
   * @param {string} freetId - The Downvote with the associated freetId
   * @return {Promise<HydratedDocument<Downvote>> | Promise<null> } - The Downvote associated the given userId and freetId, if any
   */
  static async findOne(userId: Types.ObjectId | string, freetId: Types.ObjectId | string): Promise<HydratedDocument<Downvote>> {
    return DownvoteModel.findOne({userId: userId, freetId: freetId}).populate(['userId', 'freetId']);
  }

  /**
   * Get all the Downvotes in the database
   *
   * @return {Promise<HydratedDocument<Downvote>[]>} - An array of all of the Downvotes
   */
  static async findAll(): Promise<Array<HydratedDocument<Downvote>>> {
    // Retrieves Downvotes
    return DownvoteModel.find({}).populate(['userId', 'freetId']);
  }

  /**
   * Delete a Downvote with given userId and freetId.
   *
   * @param {string} userId - The Downvote with the associated userId
   * @param {string} freetId - The Downvote with the associated freetId
   * @return {Promise<Boolean>} - true if the Downvote has been deleted, false otherwise
   */
  static async deleteOne(userId: Types.ObjectId | string, freetId: Types.ObjectId | string): Promise<boolean> {
    const Downvote = await DownvoteModel.deleteOne({userId: userId, freetId: freetId});
    return Downvote !== null;
  }

  /**
   * Get all the freets associated with a given freetId
   *
   * @param {string} freetId - The username of the user associated with the freets
   * @return {Promise<HydratedDocument<Freet>[]>} - An array of all of the freets
   */
 static async findAllByFreetId(freetId: Types.ObjectId | string): Promise<Array<HydratedDocument<Downvote>>> {
    // var id = new ObjectID(freetId);
    return DownvoteModel.find({freetId: freetId}).populate(['userId', 'freetId']);
  }

  /**
   * Get the downvote count associated with a given freetId
   *
   * @param {string} freetId - The username of the user associated with the freets
   * @return {Promise<HydratedDocument<Freet>[]>} - An array of all of the freets
   */
 static async findFreetDownvoteCount(freetId: Types.ObjectId | string): Promise<number> {
    const Downvotes = await DownvoteModel.find({freetId: freetId});
    return Downvotes.length;
  }
}


export default DownvoteCollection;
