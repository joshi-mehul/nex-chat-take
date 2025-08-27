import express from "express";
import { MockDataStore } from "../services/MockDataStore";
import { WebSocketManager } from "../services/WebSocketManager";

const router = express.Router();

// Create new pipeline
router.post("/", async (req, res) => {
  try {
    const pipelineData = req.body;
    const mockDataStore: MockDataStore = req.app.locals.mockDataStore;

    const pipeline = mockDataStore.createPipeline(pipelineData);

    res.status(201).json({
      success: true,
      data: pipeline,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: "PIPELINE_CREATION_ERROR",
        message: "Failed to create pipeline",
        timestamp: new Date().toISOString(),
      },
    });
  }
});

// Get pipeline details
router.get("/:pipelineId", (req, res) => {
  try {
    const { pipelineId } = req.params;
    const mockDataStore: MockDataStore = req.app.locals.mockDataStore;
    const pipeline = mockDataStore.getPipeline(pipelineId);

    if (!pipeline) {
      return res.status(404).json({
        success: false,
        error: {
          code: "PIPELINE_NOT_FOUND",
          message: "Pipeline not found",
          timestamp: new Date().toISOString(),
        },
      });
    }

    res.json({
      success: true,
      data: pipeline,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: "PIPELINE_FETCH_ERROR",
        message: "Failed to fetch pipeline",
        timestamp: new Date().toISOString(),
      },
    });
  }
});

// Update pipeline
router.put("/:pipelineId", async (req, res) => {
  try {
    const { pipelineId } = req.params;
    const updates = req.body;
    const mockDataStore: MockDataStore = req.app.locals.mockDataStore;
    const webSocketManager: WebSocketManager = req.app.locals.webSocketManager;

    const updatedPipeline = mockDataStore.updatePipeline(pipelineId, updates);

    if (!updatedPipeline) {
      return res.status(404).json({
        success: false,
        error: {
          code: "PIPELINE_NOT_FOUND",
          message: "Pipeline not found",
          timestamp: new Date().toISOString(),
        },
      });
    }

    // Send real-time update via WebSocket
    webSocketManager.broadcast({
      type: "pipeline_updated",
      timestamp: new Date().toISOString(),
      conversationId: updatedPipeline.conversationId,
      data: { pipeline: updatedPipeline },
    });

    res.json({
      success: true,
      data: updatedPipeline,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: "PIPELINE_UPDATE_ERROR",
        message: "Failed to update pipeline",
        timestamp: new Date().toISOString(),
      },
    });
  }
});

// Validate pipeline configuration
router.post("/:pipelineId/validate", async (req, res) => {
  try {
    const { pipelineId } = req.params;
    const mockDataStore: MockDataStore = req.app.locals.mockDataStore;
    const webSocketManager: WebSocketManager = req.app.locals.webSocketManager;

    // Simulate validation delay
    await new Promise((resolve) =>
      setTimeout(resolve, 500 + Math.random() * 1000),
    );

    const validationResult = mockDataStore.validatePipeline(pipelineId);

    // Send real-time validation result via WebSocket
    webSocketManager.broadcast({
      type: "validation_result",
      timestamp: new Date().toISOString(),
      conversationId: "unknown", // Would be extracted from pipeline
      data: {
        pipelineId,
        result: validationResult,
      },
    });

    res.json({
      success: true,
      data: validationResult,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: "VALIDATION_ERROR",
        message: "Failed to validate pipeline",
        timestamp: new Date().toISOString(),
      },
    });
  }
});

// Update node in pipeline
router.put("/:pipelineId/nodes/:nodeId", async (req, res) => {
  try {
    const { pipelineId, nodeId } = req.params;
    const updates = req.body;
    const mockDataStore: MockDataStore = req.app.locals.mockDataStore;
    const webSocketManager: WebSocketManager = req.app.locals.webSocketManager;

    const updatedNode = mockDataStore.updateNode(pipelineId, nodeId, updates);

    if (!updatedNode) {
      return res.status(404).json({
        success: false,
        error: {
          code: "NODE_NOT_FOUND",
          message: "Node not found",
          timestamp: new Date().toISOString(),
        },
      });
    }

    // Send real-time node update via WebSocket
    webSocketManager.broadcast({
      type: "node_status_update",
      timestamp: new Date().toISOString(),
      conversationId: "unknown",
      data: {
        nodeId,
        status: updatedNode.status,
        message: "Node configuration updated",
      },
    });

    res.json({
      success: true,
      data: updatedNode,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: "NODE_UPDATE_ERROR",
        message: "Failed to update node",
        timestamp: new Date().toISOString(),
      },
    });
  }
});

export default router;
