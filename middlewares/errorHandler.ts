import type { Request, Response, NextFunction } from "express";
import { errorResponse } from "../utils/res";

export const errorHandler = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    console.log(err);
    errorResponse(res, 500, err);
};