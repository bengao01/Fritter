import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import DownvoteCollection from './collection';
import * as userValidator from '../user/middleware';
import * as freetValidator from '../freet/middleware';
import * as downvoteValidator from '../downvote/middleware';
import * as util from './util';

const router = express.Router();

/**
 * Get all the downvotes
 *
 * @name GET /api/downvotes
 *
 * @return {DownvoteResponse[]} - A list of all the downvotes on Fritter
 */
/**
 * Get number of downvotes on a Freet by freetId.
 *
 * @name GET /api/downvotes?freetId=id
 *
 * @return {DownvoteResponse[]} - An array of downvotes associated with id, freetId
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
    
    const allDownvotes = await DownvoteCollection.findAll();
    const response = allDownvotes.map(util.constructDownvoteResponse);
    res.status(200).json(response);
  },
  [
    freetValidator.isFreetExists
  ],
  async (req: Request, res: Response) => {
    const numfreetDownvotes = await DownvoteCollection.findFreetDownvoteCount(req.query.freetId as string);
    res.status(200).json({"downvoteCount": numfreetDownvotes});
  }
);

/**
 * Create a new downvote.
 *
 * @name POST /api/downvotes
 *
 * @param {string} freetId - The freetId corresponding to the downvote
 * @return {DownvoteResponse} - The created downvote
 * @throws {403} - If the user is not logged in, or the downvote already exists
 */
router.post(
  '/',
  async (req: Request, res: Response, next: NextFunction) => {
    // Check if freetId query parameter was supplied
    req.params.freetId = String(req.body.freetId);
    next();
  },
  [
    userValidator.isUserLoggedIn,
    freetValidator.isFreetExists,
    downvoteValidator.isDownvoteNotExists
  ],
  async (req: Request, res: Response) => {
    console.log("req params:", req.params);
    console.log("req body:", req.body);
    console.log("Here:", req.session.userId);
    const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    const downvote = await DownvoteCollection.addOne(userId, req.body.freetId);
    res.status(201).json({
      message: 'Your downvote was created successfully.',
      downvote: util.constructDownvoteResponse(downvote)
    });
  }
);

/**
 * Delete a downvote
 *
 * @name DELETE /api/downvotes?freetId=freetID
 *
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in or is not the user of
 *                 the downvote, or if the downvote doesn't exist
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
    downvoteValidator.isDownvoteExists,
  ],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    await DownvoteCollection.deleteOne(userId, req.query.freetId as string);
    res.status(200).json({
      message: 'Your downvote was deleted successfully.'
    });
  }
);

export {router as downvoteRouter};
