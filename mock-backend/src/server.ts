import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";
import { createServer } from "http";

// Import routes
import servicesRoutes from "./routes/services";
import conversationsRoutes from "./routes/conversations";
import pipelinesRoutes from "./routes/pipelines";
import aiRoutes from "./routes/ai";

// Import services
import { WebSocketManager } from "./services/WebSocketManager";
import { MockDataStore } from "./services/MockDataStore";

const app = express();
const server = createServer(app);
const PORT = process.env.PORT || 3001;

// Initialize services
const mockDataStore = new MockDataStore();
const webSocketManager = new WebSocketManager(server);

// Make services available to routes
app.locals.mockDataStore = mockDataStore;
app.locals.webSocketManager = webSocketManager;

// Middleware
app.use(
  helmet({
    crossOriginEmbedderPolicy: false,
  }),
);
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  }),
);
app.use(morgan("combined"));
app.use(compression());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Request ID middleware
app.use((req, res, next) => {
  req.headers["x-request-id"] =
    req.headers["x-request-id"] || Math.random().toString(36).substring(2, 15);
  next();
});

// API Routes
app.use("/api/services", servicesRoutes);
app.use("/api/conversations", conversationsRoutes);
app.use("/api/pipelines", pipelinesRoutes);
app.use("/api/ai", aiRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
    connections: webSocketManager.getActiveConnections(),
  });
});

// API Documentation
app.get("/api/docs", (req, res) => {
  res.json({
    title: "Conversational Data Integration Platform API",
    version: "1.0.0",
    description:
      "Service-agnostic data integration platform with conversational AI",
    endpoints: {
      services: {
        "GET /api/services/registry": "Get all available services",
        "GET /api/services/registry/:serviceId": "Get specific service details",
        "GET /api/services/registry/:serviceId/capabilities":
          "Get service capabilities",
        "POST /api/services/:serviceId/test": "Test service connection",
      },
      conversations: {
        "POST /api/conversations": "Create new conversation",
        "GET /api/conversations/:conversationId": "Get conversation details",
        "POST /api/conversations/:conversationId/messages":
          "Add message to conversation",
      },
      pipelines: {
        "POST /api/pipelines": "Create new pipeline",
        "GET /api/pipelines/:pipelineId": "Get pipeline details",
        "PUT /api/pipelines/:pipelineId": "Update pipeline",
        "POST /api/pipelines/:pipelineId/validate":
          "Validate pipeline configuration",
      },
      ai: {
        "POST /api/ai/parse-intent": "Parse natural language intent",
        "POST /api/ai/clarify": "Generate clarification questions",
      },
    },
  });
});

// Error handling middleware
app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    console.error("Error:", err);
    res.status(500).json({
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: "Something went wrong!",
        timestamp: new Date().toISOString(),
        requestId: req.headers["x-request-id"],
      },
    });
  },
);

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    error: {
      code: "NOT_FOUND",
      message: "Endpoint not found",
      timestamp: new Date().toISOString(),
      path: req.originalUrl,
    },
  });
});

// Start server
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 WebSocket server ready on /ws`);
  console.log(`🌐 API Documentation: http://localhost:${PORT}/api/docs`);
  console.log(`❤️  Health Check: http://localhost:${PORT}/api/health`);
});

export default app;
