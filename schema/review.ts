import { z } from "zod";

export const ReviewSchema = z.object({
    review: z.string(),
    rating: z.number().min(1).max(5)
});

export type Review = z.infer<typeof ReviewSchema>;