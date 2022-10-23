import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import FollowCollection from '../follow/collection';
import UserCollection from '../user/collection';

/**
 * Makes sure a follow with follower and followee doesn't exist
 */
const isFollowNotExists = async (req: Request, res: Response, next: NextFunction) => {
  const follower = await UserCollection.findOneByUsername(req.body.follower as string);
  const followee = await UserCollection.findOneByUsername(req.body.followee as string);
  console.log("follower user:", follower);
  console.log("followee user:", followee);
  // Either follower or followee don't exist as usernames in the DB
  if (!follower || !followee){
    res.status(403).json({
      error: {
        userNotFound: `Users associated with username ${req.query.follower as string} or username ${req.query.followee as string} don't exist.`
      }
    });
    return;
  }

  console.log("follower:", follower.username);
  console.log("followee:", followee.username);

  const follow = await FollowCollection.findOne(follower._id, followee._id);

  if (follow) {
    res.status(403).json({
      error: {
        followFound: `Follow associated with follower ID ${follower._id} and followee ID ${followee._id} already exists.`
      }
    });
    return;
  }

  next();
};

/**
 * Checks if a follow with follower and followee exists
 */
 const isFollowExists = async (req: Request, res: Response, next: NextFunction) => {
  const follower = await UserCollection.findOneByUsername(req.query.follower as string);
  const followee = await UserCollection.findOneByUsername(req.query.followee as string);

  // Either follower or followee don't exist as usernames in the DB
  if (!follower || !followee){
    res.status(403).json({
      error: {
        userNotFound: `Users associated with username ${req.query.follower as string} or username ${req.query.followee as string} don't exist.`
      }
    });
    return;
  }

  console.log("follower:", follower.username);
  console.log("followee:", followee.username);

  const follow = await FollowCollection.findOne(follower._id, followee._id);
  if (!follow) {
    res.status(403).json({
      error: {
        followNotFound: `Follow associated with follower ID ${follower._id} and followee ID ${followee._id} doesn't exist.`
      }
    });
    return;
  }

  next();
};

export {
  isFollowNotExists,
  isFollowExists,
};
