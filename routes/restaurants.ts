import { Router, Request, Response, NextFunction } from "express";
import { validate } from "../middlewares/validate";
import { Restaurant, RestaurantSchema } from "../schema/restaurants";
import { nanoid } from "nanoid";
import { restaurantKeyById } from "../utils/redisKeys";
import redis from "../utils/redis";
import { successResponse } from "../utils/res";
import { checkRestaurantExists } from "../middlewares/checkRestaurantId";
const router = Router();

router.post('/', validate(RestaurantSchema), async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const data = req.body as Restaurant;
    try {
        const id = nanoid();
        const restaurantKey = restaurantKeyById(id);
        const hashData = { id, name: data.name, location: data.location };
        const addResult = await redis.hset(restaurantKey, hashData);
        console.log(`Added ${addResult} fields`);
        successResponse(res, 201, hashData, 'Added new restaurant');
        return;
    } catch (error) {
        next(error);
    }
});

router.get('/:restaurantId', checkRestaurantExists, async (
    req: Request<{ restaurantId: string }>,
    res: Response,
    next: NextFunction
) => {
    const { restaurantId } = req.params;
    try {
        const restaurantKey = restaurantKeyById(restaurantId);
        const [viewCount, restaurant] = await Promise.all(
            [
                redis.hincrby(restaurantKey, 'viewCount', '1'),
                redis.hgetall(restaurantKey)
            ]
        );
        successResponse(res, 200, restaurant);
        return;
    } catch (error) {
        next(error);
    }
});

export default router;