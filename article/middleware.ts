import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import UserCollection from '../user/collection';
import ArticleCollection from '../article/collection';

/**
 * Checks if a article with articleId is req.params exists
 */
const isArticleExists = async (req: Request, res: Response, next: NextFunction) => {
  const validFormat = Types.ObjectId.isValid(req.params.articleId);
  const article = validFormat ? await ArticleCollection.findOne(req.params.articleId) : '';
  if (!article) {
    res.status(404).json({
      error: {
        articleNotFound: `Article with article ID ${req.params.articleId} does not exist.`
      }
    });
    return;
  }

  next();
};

/**
 * Checks if a user is an Admin with priviledges to modify articles
 */
 const isAdminUser = async (req: Request, res: Response, next: NextFunction) => {
  const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
  const user = await UserCollection.findOneByUsername("admin");
  if (userId != user._id.toString()) {
    res.status(404).json({
      error: {
        insufficientPermissions: `User needs to be an admin user to modify articles.`
      }
    });
    return;
  }

  next();
};


export {
  isAdminUser,
  isArticleExists,
};
