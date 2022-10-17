import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import LikeCollection from '../like/collection';

/**
 * Checks if a like with likeId doesn't exist
 */
const isLikeNotExists = async (req: Request, res: Response, next: NextFunction) => {
  const validFormat = Types.ObjectId.isValid(req.body.freetId);
  console.log("freetId:", req.body.freetId);
  console.log("user id:", req.session.userId);
  const like = validFormat ? await LikeCollection.findOne(req.session.userId, req.body.freetId) : '';
  if (like) {
    res.status(403).json({
      error: {
        likeNotFound: `Like associated with author ID ${req.session.userId} and freet ID ${req.body.freetId} already exists.`
      }
    });
    return;
  }

  next();
};

/**
 * Checks if a like with likeId is req.params exists
 */
 const isLikeExists = async (req: Request, res: Response, next: NextFunction) => {
  const validFormat = Types.ObjectId.isValid(req.query.freetId as string);
  const like = validFormat ? await LikeCollection.findOne(req.session.userId, req.params.freetId) : '';
  if (!like) {
    res.status(403).json({
      error: {
        likeNotFound: `Like associated with author ID ${req.session.userId} and freet ID ${req.query.freetId} doesn't exists.`
      }
    });
    return;
  }

  next();
};

export {
  isLikeNotExists,
  isLikeExists
};
