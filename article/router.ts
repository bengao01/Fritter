import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import ArticleCollection from './collection';
import * as userValidator from '../user/middleware';
import * as articleValidator from '../article/middleware';
import * as util from '../article/util';

const router = express.Router();

/**
 * Get all the articles
 *
 * @name GET /api/article
 *
 * @return {ArticleResponse[]} - A list of all the articles sorted in descending
 *                      order by date modified
 */
router.get(
  '/',
  async (req: Request, res: Response, next: NextFunction) => {
    const allArticles = await ArticleCollection.findAll();
    const response = allArticles.map(util.constructArticleResponse);
    res.status(200).json(response);
  },
);

/**
 * Create a new article.
 *
 * @name POST /api/article
 *
 * @param {string} content - The content of the article
 * @param {string} title - The title of the article
 * @return {ArticleResponse} - The created article
 * @throws {403} - If the user is not logged in or is not an admin user
 */
router.post(
  '/',
  [
    userValidator.isUserLoggedIn,
    articleValidator.isAdminUser,
  ],
  async (req: Request, res: Response) => {
    const article = await ArticleCollection.addOne(req.body.title, req.body.content);

    res.status(201).json({
      message: 'Your article was created successfully.',
      article: util.constructArticleResponse(article)
    });
  }
);

/**
 * Delete a article
 *
 * @name DELETE /api/article/:articleid
 *
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in or is not an admin user
 * @throws {404} - If the articleId is not valid
 */
router.delete(
  '/:articleId?',
  [
    userValidator.isUserLoggedIn,
    articleValidator.isAdminUser,
    articleValidator.isArticleExists
  ],
  async (req: Request, res: Response) => {
    await ArticleCollection.deleteOne(req.params.articleId);
    res.status(200).json({
      message: 'Your article was deleted successfully.'
    });
  }
);

/**
 * Modify a article
 *
 * @name PUT /api/articles/:id
 *
 * @param {string} content - the new content for the article
 * @param {string} title - the new title for the article
 * @return {ArticleResponse} - the updated article
 * @throws {403} - if the user is not logged in or not an admin user
 * @throws {404} - If the articleId is not valid
 */
router.put(
  '/:articleId?',
  [
    articleValidator.isArticleExists,
    articleValidator.isAdminUser,
  ],
  async (req: Request, res: Response) => {
    let article;
    if (req.body.content){
      article = await ArticleCollection.updateOneContent(req.params.articleId, req.body.content);
    }
    if (req.body.title){
      article = await ArticleCollection.updateOneTitle(req.params.articleId, req.body.title);
    }
    res.status(200).json({
      message: 'Your article was updated successfully.',
      article: util.constructArticleResponse(article)
    });
  }
);

export {router as articleRouter};
