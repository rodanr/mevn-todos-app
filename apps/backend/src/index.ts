import express from "express";
import morgan from "morgan";
import logger, { logStream } from "./lib/logger";
import compression from "compression";
import { config } from "./config";

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
app.use(express.json());
app.use(morgan("combined", { stream: logStream }));
app.use(express.urlencoded({ extended: true, limit: config.http.bodyLimit }));
app.use(compression());

app.get("/health", (_, res) => {
  res.send({
    status: "ok",
    service: config.serviceName,
    version: process.env.npm_package_version || "1.0.0",
    environment: config.env,
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// 404 handler
app.use((_req, res) => {
  res.status(404).json({
    status: "error",
    message: "Resource not found",
  });
});

const startServer = async () => {
  try {
    const server = app.listen(config.port, () => {
      logger.info(`Server is running on http://localhost:${config.port}`);
    });

    // Enable keep-alive connections with appropriate timeouts
    server.keepAliveTimeout = SERVER_TIMEOUTS.KEEP_ALIVE;
    server.headersTimeout = SERVER_TIMEOUTS.HEADERS;
  } catch (error) {
    process.exit(EXIT_CODES.ERROR);
  }
};

startServer();
