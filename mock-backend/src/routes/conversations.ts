import express from "express";
import { MockDataStore } from "../services/MockDataStore";
import { WebSocketManager } from "../services/WebSocketManager";

const router = express.Router();

// Create new conversation
router.post("/", async (req, res) => {
  try {
    const { initialPrompt, sessionId } = req.body;

    if (!sessionId) {
      return res.status(400).json({
        success: false,
        error: {
          code: "MISSING_SESSION_ID",
          message: "Session ID is required",
          timestamp: new Date().toISOString(),
        },
      });
    }

    const mockDataStore: MockDataStore = req.app.locals.mockDataStore;
    const conversation = mockDataStore.createConversation({ sessionId });

    // If initial prompt provided, add it as first message
    if (initialPrompt) {
      mockDataStore.addMessage(conversation.id, {
        content: initialPrompt,
        type: "user",
      });
    }

    res.status(201).json({
      success: true,
      data: conversation,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: "CONVERSATION_CREATION_ERROR",
        message: "Failed to create conversation",
        timestamp: new Date().toISOString(),
      },
    });
  }
});

// Get conversation details
router.get("/:conversationId", (req, res) => {
  try {
    const { conversationId } = req.params;
    const mockDataStore: MockDataStore = req.app.locals.mockDataStore;
    const conversation = mockDataStore.getConversation(conversationId);

    if (!conversation) {
      return res.status(404).json({
        success: false,
        error: {
          code: "CONVERSATION_NOT_FOUND",
          message: "Conversation not found",
          timestamp: new Date().toISOString(),
        },
      });
    }

    res.json({
      success: true,
      data: conversation,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: "CONVERSATION_FETCH_ERROR",
        message: "Failed to fetch conversation",
        timestamp: new Date().toISOString(),
      },
    });
  }
});

// Add message to conversation
router.post("/:conversationId/messages", async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { content, type = "user" } = req.body;

    if (!content) {
      return res.status(400).json({
        success: false,
        error: {
          code: "MISSING_CONTENT",
          message: "Message content is required",
          timestamp: new Date().toISOString(),
        },
      });
    }

    const mockDataStore: MockDataStore = req.app.locals.mockDataStore;
    const webSocketManager: WebSocketManager = req.app.locals.webSocketManager;

    // Simulate AI processing delay
    await new Promise((resolve) =>
      setTimeout(resolve, 800 + Math.random() * 1200),
    );

    const aiMessage = mockDataStore.addMessage(conversationId, {
      content,
      type,
    });

    // Send real-time update via WebSocket
    webSocketManager.sendToClient(conversationId, {
      type: "ai_response",
      timestamp: new Date().toISOString(),
      conversationId,
      data: {
        message: aiMessage,
      },
    });

    res.json({
      success: true,
      data: aiMessage,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: "MESSAGE_CREATION_ERROR",
        message: "Failed to add message",
        timestamp: new Date().toISOString(),
      },
    });
  }
});

export default router;
