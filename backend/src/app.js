import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import rateLimit from "express-rate-limit";

import  env from "./config/env.js";
import { errorHandler, notFoundHandler } from "./middlewares/error.middleware.js";
import routes from "./routes/index.js";

const app = express();

// Morgan logging - MUST BE FIRST to log all requests
if (env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  console.log("📊 Morgan HTTP request logging ENABLED");
}

console.log(`🔧 Environment: ${env.NODE_ENV}`);

app.use(helmet());

app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true,
  })
);

app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 200,
  message: {
    success: false,
    message: "Too many requests, try again later.",
  },
});

app.use("/api", limiter);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Fitness App API is running 🚀",
  });
});



app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is healthy",
    environment: env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});
app.use("/api/v1",routes)
app.use(notFoundHandler);
app.use(errorHandler);

export default app;