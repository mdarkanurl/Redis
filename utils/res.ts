import type { Response } from "express";

export const successResponse = (
    res: Response,
    statusCode: number,
    data: any,
    message: string = "Success"
) => {
    return res.status(statusCode).json({ success: true, message, data });
};

export const errorResponse = (
    res: Response,
    status: number,
    error: string
) => {
    return res.status(status).json({ success: false, error });
};