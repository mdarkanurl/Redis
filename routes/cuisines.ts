import { Router, Request, Response, NextFunction } from "express";
import redis from "../utils/redis";
import { cuisinesKey } from "../utils/redisKeys";
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

export default router;