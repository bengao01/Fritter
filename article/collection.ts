import type {HydratedDocument, Types} from 'mongoose';
import type {Article} from './model';
import ArticleModel from './model';
import UserCollection from '../user/collection';

/**
 * This files contains a class that has the functionality to explore articles
 * stored in MongoDB, including adding, finding, updating, and deleting articles.
 * Feel free to add additional operations in this file.
 *
 * Note: HydratedDocument<Article> is the output of the ArticleModel() constructor,
 * and contains all the information in Article. https://mongoosejs.com/docs/typescript.html
 */
class ArticleCollection {
  /**
   * Add a article to the collection
   *
   * @param {string} authorId - The title of the article
   * @param {string} content - The content of the article
   * @return {Promise<HydratedDocument<Article>>} - The newly created article
   */
  static async addOne(title: string, content: string): Promise<HydratedDocument<Article>> {
    const date = new Date();
    const article = new ArticleModel({
      dateCreated: date,
      content,
      title,
      dateModified: date
    });
    await article.save(); // Saves article to MongoDB
    return article;
  }

  /**
   * Find a article by articleId
   *
   * @param {string} articleId - The id of the article to find
   * @return {Promise<HydratedDocument<Article>> | Promise<null> } - The article with the given articleId, if any
   */
  static async findOne(articleId: Types.ObjectId | string): Promise<HydratedDocument<Article>> {
    return ArticleModel.findOne({_id: articleId});
  }

  /**
   * Get all the articles in the database
   *
   * @return {Promise<HydratedDocument<Article>[]>} - An array of all of the articles
   */
  static async findAll(): Promise<Array<HydratedDocument<Article>>> {
    // Retrieves articles and sorts them from most to least recent
    return ArticleModel.find({}).sort({dateModified: -1});
  }

  /**
   * Update a article with the new content
   *
   * @param {string} articleId - The id of the article to be updated
   * @param {string} content - The new content of the article
   * @return {Promise<HydratedDocument<Article>>} - The newly updated article
   */
  static async updateOneContent(articleId: Types.ObjectId | string, content: string): Promise<HydratedDocument<Article>> {
    const article = await ArticleModel.findOne({_id: articleId});
    article.content = content;
    article.dateModified = new Date();
    await article.save();
    return article;
  }

  /**
   * Update a article with the new content
   *
   * @param {string} articleId - The id of the article to be updated
   * @param {string} content - The new content of the article
   * @return {Promise<HydratedDocument<Article>>} - The newly updated article
   */
   static async updateOneTitle(articleId: Types.ObjectId | string, title: string): Promise<HydratedDocument<Article>> {
    const article = await ArticleModel.findOne({_id: articleId});
    article.title = title;    
    article.dateModified = new Date();
    await article.save();
    return article;
  }

  /**
   * Delete a article with given articleId.
   *
   * @param {string} articleId - The articleId of article to delete
   * @return {Promise<Boolean>} - true if the article has been deleted, false otherwise
   */
  static async deleteOne(articleId: Types.ObjectId | string): Promise<boolean> {
    const article = await ArticleModel.deleteOne({_id: articleId});
    return article !== null;
  }
}

export default ArticleCollection;
