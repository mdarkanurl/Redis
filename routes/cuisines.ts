import { Router, Request, Response, NextFunction } from "express";
import redis from "../utils/redis";
import { cuisineKey, cuisinesKey, restaurantKeyById } from "../utils/redisKeys";
import { successResponse } from "../utils/res";
const router = Router();

router.get('/', async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const cuisines = await redis.smembers(cuisinesKey);
        successResponse(res, 200, cuisines);
        return;
    } catch (error) {
        next(error);
    }
});


router.get("/:cuisine", async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
  const { cuisine } = req.params;
  try {
    const restaurantIds = await redis.smembers(cuisineKey(cuisine));
    const restaurants = await Promise.all(
      restaurantIds.map((id) => redis.hget(restaurantKeyById(id), "name"))
    );
    successResponse(res, 200, restaurants);
    return;
  } catch (error) {
    next(error);
  }
});

export default router;