import express from "express";
import morgan from "morgan";
import cors from "cors";
import logger, { logStream } from "./lib/logger";
import compression from "compression";
import { config } from "./config";
import apiRouter from "./routes";
import mongoose from "mongoose";
import { errorHandler } from "./middlewares/error.middleware";
import { respond } from "./lib/responses";

// Server timeouts (in milliseconds)
const SERVER_TIMEOUTS = {
  KEEP_ALIVE: 65000,
  HEADERS: 66000,
} as const;

// Process exit codes
const EXIT_CODES = {
  SUCCESS: 0,
  ERROR: 1,
} as const;

const app = express();

app.use(
  cors({
    origin: config.cors.origin,
    credentials: true,
  }),
);

app.use(express.json());
app.use(morgan("combined", { stream: logStream }));
app.use(express.urlencoded({ extended: true, limit: config.http.bodyLimit }));
app.use(compression());

app.get("/health", (_, res) => {
  const [status, response] = respond.withData("Service is healthy", {
    service: config.serviceName,
    version: process.env.npm_package_version || "1.0.0",
    environment: config.env,
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
  res.status(status).json(response);
});

app.use("/api", apiRouter);

// 404 handler
app.use((_req, res) => {
  const [status, response] = respond.withError(404, "Resource not found");
  res.status(status).json(response);
});

// Error handler middleware should be last
app.use(errorHandler);

const startServer = async (): Promise<void> => {
  try {
    mongoose.set("strictQuery", true);
    await mongoose.connect(config.dbUri, {
      maxPoolSize: config.mongodb.poolSize,
      maxIdleTimeMS: config.mongodb.maxIdleTimeMS,
    });
    logger.info("Connected to MongoDB");

    const server = app.listen(config.port, () => {
      logger.info(`Server is running on http://localhost:${config.port}`);
    });

    // Enable keep-alive connections with appropriate timeouts
    server.keepAliveTimeout = SERVER_TIMEOUTS.KEEP_ALIVE;
    server.headersTimeout = SERVER_TIMEOUTS.HEADERS;
  } catch (error) {
    logger.error("Failed to initialize the server:", error);
    process.exit(EXIT_CODES.ERROR);
  }
};

const gracefulShutdown = (signal: string): (() => Promise<void>) => {
  return async () => {
    logger.info(`${signal} received. Starting graceful shutdown...`);

    try {
      await mongoose.connection.close();
      logger.info("MongoDB connection closed");
    } catch (err) {
      logger.error("Error closing MongoDB connection", { error: err });
    }

    process.exit(EXIT_CODES.SUCCESS);
  };
};

process.on("uncaughtException", (error) => {
  logger.error("Uncaught Exception", { error });
  process.exit(EXIT_CODES.ERROR);
});

process.on("unhandledRejection", (reason) => {
  logger.error("Unhandled Rejection", { reason });
  process.exit(EXIT_CODES.ERROR);
});

process.on("SIGTERM", gracefulShutdown("SIGTERM"));
process.on("SIGINT", gracefulShutdown("SIGINT"));

startServer();
