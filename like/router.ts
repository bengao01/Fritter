import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import LikeCollection from './collection';
import * as userValidator from '../user/middleware';
import * as freetValidator from '../freet/middleware';
import * as likeValidator from '../like/middleware';
import * as util from './util';

const router = express.Router();

/**
 * Get number of likes on a Freet by freetId.
 *
 * @name GET /api/likes?freetId=id
 *
 * @return {LikeResponse[]} - An array of likes associated with id, freetId
 * @throws {400} - If freetId is not given
 * @throws {404} - If no freet has given freetId
 *
 */
router.get(
  '/',
  async (req: Request, res: Response, next: NextFunction) => {
    // Check if freetId query parameter was supplied
    req.params.freetId = String(req.query.freetId);
    console.log(req.params);
    console.log(req.query)
    if (req.query.freetId !== undefined) {
      next();
      return;
    }
    
    res.status(400).json({
      error: {
        missingQueryField: `Need to pass a freetID with this request.`
      }
    });
    return;
  },
  [
    freetValidator.isFreetExists
  ],
  async (req: Request, res: Response) => {
    const numfreetLikes = await LikeCollection.findFreetLikeCount(req.query.freetId as string);
    res.status(200).json({"likeCount": numfreetLikes});
  }
);

/**
 * Create a new like.
 *
 * @name POST /api/likes
 *
 * @param {string} freetId - The freetId corresponding to the like
 * @return {LikeResponse} - The created like
 * @throws {403} - If the user is not logged in, or the like already exists
 */
router.post(
  '/',
  async (req: Request, res: Response, next: NextFunction) => {
    // add to req.params for freet validator to work
    req.params.freetId = String(req.body.freetId);
    next();
  },
  [
    userValidator.isUserLoggedIn,
    freetValidator.isFreetExists,
    likeValidator.isLikeNotExists
  ],
  async (req: Request, res: Response) => {
    console.log("req params:", req.params);
    console.log("req body:", req.body);
    console.log("Here:", req.session.userId);
    const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    const like = await LikeCollection.addOne(userId, req.body.freetId);
    res.status(201).json({
      message: 'Your like was created successfully.',
      like: util.constructLikeResponse(like)
    });
  }
);

/**
 * Delete a like
 *
 * @name DELETE /api/likes?freetId=freetID
 *
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in or is not the user of
 *                 the like, or if the like doesn't exist
 */
router.delete(
  '/',
  async (req: Request, res: Response, next: NextFunction) => {
    // Check if freetId query parameter was supplied
    req.params.freetId = String(req.query.freetId);
    next();
  },
  [
    userValidator.isUserLoggedIn,
    freetValidator.isFreetExists,
    likeValidator.isLikeExists,
  ],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    await LikeCollection.deleteOne(userId, req.query.freetId as string);
    res.status(200).json({
      message: 'Your like was deleted successfully.'
    });
  }
);

export {router as likeRouter};
