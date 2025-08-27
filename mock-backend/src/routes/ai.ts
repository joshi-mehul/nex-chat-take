import express from "express";
import { MockDataStore } from "../services/MockDataStore";
import { WebSocketManager } from "../services/WebSocketManager";

const router = express.Router();

// Parse natural language intent
router.post("/parse-intent", async (req, res) => {
  try {
    const { naturalLanguage, context } = req.body;

    if (!naturalLanguage) {
      return res.status(400).json({
        success: false,
        error: {
          code: "MISSING_INPUT",
          message: "Natural language input is required",
          timestamp: new Date().toISOString(),
        },
      });
    }

    const mockDataStore: MockDataStore = req.app.locals.mockDataStore;
    const webSocketManager: WebSocketManager = req.app.locals.webSocketManager;

    // Simulate AI processing delay
    await new Promise((resolve) =>
      setTimeout(resolve, 1200 + Math.random() * 1800),
    );

    const intentResult = mockDataStore.parseIntent(naturalLanguage, context);

    // If a pipeline was suggested, create it
    if (intentResult.suggestedPipeline.nodes.length > 0) {
      const pipeline = mockDataStore.createPipeline({
        name: `Pipeline from: "${naturalLanguage.substring(0, 50)}..."`,
        description: `Auto-generated pipeline based on: ${naturalLanguage}`,
        conversationId: context?.conversationId || "unknown",
        nodes: intentResult.suggestedPipeline.nodes.map(
          (nodeBlueprint, index) => ({
            id: nodeBlueprint.id,
            serviceId: nodeBlueprint.serviceId,
            instanceName:
              nodeBlueprint.role === "source"
                ? "Data Source"
                : nodeBlueprint.role === "destination"
                  ? "Data Destination"
                  : "Data Transform",
            nodeType: nodeBlueprint.role,
            position: nodeBlueprint.position,
            status: "pending" as const,
            configuration: nodeBlueprint.configuration || {
              connection: {},
              operation: { type: nodeBlueprint.role, parameters: {} },
            },
          }),
        ),
        connections: intentResult.suggestedPipeline.connections,
        configuration: {
          errorHandling: {
            retryCount: 3,
            retryDelay: 3000,
            onFailure: "notify",
          },
          notifications: {
            onSuccess: true,
            onFailure: true,
          },
        },
      });

      // Send pipeline creation update via WebSocket
      webSocketManager.sendToClient(context?.conversationId || "unknown", {
        type: "pipeline_created",
        timestamp: new Date().toISOString(),
        conversationId: context?.conversationId || "unknown",
        data: { pipeline },
      });

      // Add pipeline to response
      (intentResult as any).createdPipeline = pipeline;
    }

    res.json({
      success: true,
      data: intentResult,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: "INTENT_PARSING_ERROR",
        message: "Failed to parse intent",
        timestamp: new Date().toISOString(),
      },
    });
  }
});

// Generate clarification questions
router.post("/clarify", async (req, res) => {
  try {
    const { intentId, partialConfiguration, serviceConstraints } = req.body;

    const mockDataStore: MockDataStore = req.app.locals.mockDataStore;

    // Simulate AI processing delay
    await new Promise((resolve) =>
      setTimeout(resolve, 600 + Math.random() * 800),
    );

    // Generate mock clarification based on services
    const clarificationResult = {
      questions: [
        {
          id: "q1",
          question: "What specific data do you want to extract?",
          type: "multiselect",
          options: ["orders", "products", "customers", "inventory"],
          required: true,
        },
        {
          id: "q2",
          question: "How often should this pipeline run?",
          type: "select",
          options: ["Real-time", "Every hour", "Daily", "Weekly"],
          required: false,
        },
      ],
      suggestions: [
        "Consider adding data validation steps",
        "Set up error handling for failed records",
        "Configure monitoring and alerts",
      ],
      confidence: 0.9,
    };

    res.json({
      success: true,
      data: clarificationResult,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: "CLARIFICATION_ERROR",
        message: "Failed to generate clarification",
        timestamp: new Date().toISOString(),
      },
    });
  }
});

export default router;
