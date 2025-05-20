import express from "express";
import { restaurantsRouter, cuisinesRouter } from "./routes";
import { errorHandler } from "./middlewares/errorHandler";

const app = express();

// Middleares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Router
app.use('/restaurants', restaurantsRouter);
app.use('/cuisines', cuisinesRouter);

app.use(errorHandler);
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`App running at port ${PORT}`);
}).on('error', (error) => {
    throw new Error(error.message);
});