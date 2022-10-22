import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import FollowCollection from './collection';
import UserCollection from '../user/collection';
import * as userValidator from '../user/middleware';
import * as followValidator from '../follow/middleware';
import * as util from './util';

const router = express.Router();


/**
 * Get Follow objects of people following the user (followee)
 *
 * @name GET /api/follow/followers?followee=FOLLOWEE
 *
 * @return {FollowResponse[]} - An array of follows who are following the followee
 * @throws {400} - If followee param is not passed
 * @throws {404} - If no follow object with the followee exists
 *
 */
router.get(
  '/followers',
  async (req: Request, res: Response, next: NextFunction) => {
    console.log(req.params);
    console.log(req.query)
    if (req.query.followee === undefined) {
      res.status(400).json({
        error: {
          paramNotPassed: `Failed to pass the 'followee' param.`
        }
      });
      return;
    };
    req.query.author = req.query.followee as string;
    next();
  },
  [userValidator.isAuthorExists, followValidator.isUserInFollow],
  async (req: Request, res: Response) => {
    const followee = await UserCollection.findOneByUsername(req.query.followee as string);
    const follows = await FollowCollection.getAllFollowers(followee._id);
    const response = follows.map(util.constructFollowResponse);
    res.status(200).json(response);
  }
);

/**
 * Get Follow objects of people the user follows
 *
 * @name GET /api/follow/following?user=USERNAME
 *
 * @return {FollowResponse[]} - An array of people who the user follows
 */
 router.get(
  '/following',
  async (req: Request, res: Response, next: NextFunction) => {
    console.log(req.params);
    console.log(req.query)
    if (req.query.user === undefined) {
      res.status(400).json({
        error: {
          paramNotPassed: `Failed to pass the 'user' param.`
        }
      });
      return;
    };
    req.query.author = req.query.user as string;
    next();
  },
  [userValidator.isAuthorExists, followValidator.isUserInFollow],
  async (req: Request, res: Response) => {
    const user = await UserCollection.findOneByUsername(req.query.user as string);
    const follows = await FollowCollection.getAllFollowing(user._id);
    const response = follows.map(util.constructFollowResponse);
    res.status(200).json(response);
  }
);

/**
 * Get the feed with posts from people the user follows
 *
 * @name GET /api/follow/feed?user=USERNAME
 *
 * @return {FreetResponse[]} - An array of people who the user follows
 */
 router.get(
  '/feed',
  async (req: Request, res: Response, next: NextFunction) => {
    console.log(req.params);
    console.log(req.query)
    if (req.query.user === undefined) {
      res.status(400).json({
        error: {
          paramNotPassed: `Failed to pass the 'user' param.`
        }
      });
      return;
    };
    req.query.author = req.query.user as string;
    next();
  },
  [userValidator.isUserLoggedIn, followValidator.isUserInFollow],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    console.log("userId:", userId);
    const follows = await FollowCollection.getAllFollowing(userId);
    console.log("follows", follows);
    const freets = await Promise.all(follows.map(util.getUserFreets));
    console.log("return value is:", freets);
    res.status(200).json(freets);
  }
);

/**
 * Create a new follow (pass in usernames of the follower and followee)
 *
 * @name POST /api/follow?follower=FOLLOWER&followee=FOLLOWEE
 *
 * @return {FollowResponse} - The created follow
 * @throws {403} - If the user is not logged in, or the follow already exists
 */
router.post(
  '/',
  [
    userValidator.isUserLoggedIn,
    followValidator.isFollowNotExists,
  ],
  async (req: Request, res: Response) => {
    console.log("req params:", req.params);
    console.log("req body:", req.body);
    console.log("Here:", req.session.userId);
    const follower = await UserCollection.findOneByUsername(req.query.follower as string);
    const followee = await UserCollection.findOneByUsername(req.query.followee as string);

    const follow = await FollowCollection.addOne(follower._id, followee._id);
    res.status(201).json({
      message: 'Your follow was created successfully.',
      follow: util.constructFollowResponse(follow)
    });
  }
);

/**
 * Delete a follow
 *
 * @name DELETE /api/follow?follower=FOLLOWER&followee=FOLLOWEE
 *
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in or is not the user of
 *                 the follow, or if the follow doesn't exist
 */
router.delete(
  '/',
  [
    userValidator.isUserLoggedIn,
    followValidator.isFollowExists,
  ],
  async (req: Request, res: Response) => {
    const follower = await UserCollection.findOneByUsername(req.query.follower as string);
    const followee = await UserCollection.findOneByUsername(req.query.followee as string); 
    await FollowCollection.deleteOne(follower._id, followee._id);
    res.status(200).json({
      message: 'Your follow was deleted successfully.'
    });
  }
);

export {router as followRouter};
