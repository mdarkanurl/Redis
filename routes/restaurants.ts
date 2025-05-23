import { Router, Request, Response, NextFunction } from "express";
import { validate } from "../middlewares/validate";
import { Restaurant, RestaurantSchema } from "../schema/restaurants";
import { ReviewSchema, Review } from "../schema/review";
import { nanoid } from "nanoid";
import { restaurantKeyById, reviewDetailsKeyById, reviewKeyById } from "../utils/redisKeys";
import redis from "../utils/redis";
import { errorResponse, successResponse } from "../utils/res";
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

router.post('/:restaurantId/reviews',
    checkRestaurantExists,
    validate(ReviewSchema),
async (req: Request, res: Response, next: NextFunction) => {
    const { restaurantId } = req.params;
    const data = req.body;
    try {
        const reviewId = nanoid();
        const reviewKey = reviewKeyById(restaurantId);
        const reviewDetailsKey = reviewDetailsKeyById(reviewId);
        const reviewData = {
            id: reviewId,
            ...data,
            timestamp: Date.now(),
            restaurantId
        }

        await Promise.all([
            redis.lpush(reviewKey, reviewId),
            redis.hset(reviewDetailsKey, reviewData)
        ]);
        successResponse(res, 201, reviewData, 'Review added');
        return;
    } catch (error) {
        next(error);
    }
});

router.get(
    '/:restaurantId/reviews',
    checkRestaurantExists,
    async (req: Request, res: Response, next: NextFunction) => {
        const { restaurantId } = req.params;
        const { page = 1, limit = 10 } = req.query;
        const start = (Number(page) -1) * Number(limit);
        const end = start + Number(limit) -1;

        try {
            const reviewKey = reviewKeyById(restaurantId);
            const reviewIds = await redis.lrange(
                reviewKey, start, end
            );
            const reviews = await Promise.all(
                reviewIds.map(id => redis.hgetall(reviewDetailsKeyById(id)))
            );

            successResponse(res, 200, reviews);
            return;
        } catch (error) {
            next(error);
        }
    }
);

router.delete(
    '/:restaurantId/reviews/:reviewId',
    checkRestaurantExists,
    async (req: Request, res: Response, next: NextFunction) => {
        const { restaurantId, reviewId } = req.params;

        try {
            const reviewKey = reviewKeyById(restaurantId);
            const reviewDetailsKey = reviewDetailsKeyById(reviewId);
            const [removeResult, deleteResult] = await Promise.all([
                redis.lrem(reviewKey, 0, reviewId),
                redis.del(reviewDetailsKey)
            ]);

            if(removeResult === 0 && deleteResult === 0) {
                errorResponse(res, 404, 'Review not found');
                return;
            }

            successResponse(res, 202, reviewId, 'Review deleted');
            return;
        } catch (error) {
            next(error);
        }
    }
);

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