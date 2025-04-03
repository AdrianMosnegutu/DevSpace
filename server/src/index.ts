import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import bodyParser from "body-parser";
import cors from "cors";
import handleError from "./middleware/handle-error";
import postsRouter from "./routes/post-route";

dotenv.config({});
const PORT = process.env.PORT || 4000;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";

const app = express();

app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(
  cors({
    origin: FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  }),
);

app.use("/api/posts", postsRouter);

app.use(handleError);

app.listen(PORT, () => {
  console.log(`Server is running on localhost:${PORT}`);
});
