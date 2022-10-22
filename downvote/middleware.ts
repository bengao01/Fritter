import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import DownvoteCollection from '../downvote/collection';

/**
 * Checks if a downvote with downvoteId doesn't exist
 */
const isDownvoteNotExists = async (req: Request, res: Response, next: NextFunction) => {
  const validFormat = Types.ObjectId.isValid(req.body.freetId);
  console.log("freetId:", req.body.freetId);
  console.log("user id:", req.session.userId);
  const downvote = validFormat ? await DownvoteCollection.findOne(req.session.userId, req.body.freetId) : '';
  if (downvote) {
    res.status(403).json({
      error: {
        downvoteFound: `Downvote associated with user ID ${req.session.userId} and freet ID ${req.body.freetId} already exists.`
      }
    });
    return;
  }

  next();
};

/**
 * Checks if a downvote with downvoteId is req.params exists
 */
 const isDownvoteExists = async (req: Request, res: Response, next: NextFunction) => {
  const validFormat = Types.ObjectId.isValid(req.query.freetId as string);
  const downvote = validFormat ? await DownvoteCollection.findOne(req.session.userId, req.params.freetId) : '';
  if (!downvote) {
    res.status(403).json({
      error: {
        downvoteNotFound: `Downvote associated with user ID ${req.session.userId} and freet ID ${req.query.freetId} doesn't exists.`
      }
    });
    return;
  }

  next();
};

export {
  isDownvoteNotExists,
  isDownvoteExists
};
