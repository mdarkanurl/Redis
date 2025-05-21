import type { Request, Response, NextFunction } from "express";
import { errorResponse } from "../utils/res";
import { restaurantKeyById } from "../utils/redisKeys";
import redis from "../utils/redis";

export const checkRestaurantExists = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { restaurantId } = req.params;

        if(!restaurantId) {
            errorResponse(res, 400, 'Restaurant ID not found');
            return;
        }
        const restaurantKey = restaurantKeyById(restaurantId);
        const exists = await redis.exists(restaurantKey);

        if(!exists) {
            errorResponse(res, 404, 'Restaurant not found');
            return;
        }
        next();
    } catch (error) {
        next(error);
    }
}