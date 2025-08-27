import { WebSocketServer, WebSocket } from "ws";
import { Server } from "http";
import { WebSocketEvent, NodeStatusUpdateEvent } from "../../types";
import { MockDataStore } from "./MockDataStore";

export class WebSocketManager {
  private wss: WebSocketServer;
  private connections = new Map<string, WebSocket>();
  private mockDataStore?: MockDataStore;

  constructor(server: Server, mockDataStore?: MockDataStore) {
    this.mockDataStore = mockDataStore;
    this.wss = new WebSocketServer({
      server,
      path: "/ws",
    });
    this.setupWebSocket();
  }

  private setupWebSocket(): void {
    this.wss.on("connection", (ws: WebSocket, req) => {
      const conversationId = this.extractConversationId(req.url);
      console.log(`WebSocket connected for conversation: ${conversationId}`);

      this.connections.set(conversationId, ws);

      this.sendToClient(conversationId, {
        type: "connection_established",
        timestamp: new Date().toISOString(),
        conversationId,
        data: { message: "WebSocket connected successfully" },
      });

      const interval = setInterval(() => {
        if (ws.readyState === ws.OPEN) {
          this.sendMockStatusUpdate(conversationId);
        }
      }, 5000);

      ws.on("message", (data) => {
        try {
          const message = JSON.parse(data.toString());
          this.handleClientMessage(conversationId, message);
        } catch (error) {
          console.error("Error parsing WebSocket message:", error);
        }
      });

      ws.on("close", () => {
        console.log(
          `WebSocket disconnected for conversation: ${conversationId}`,
        );
        clearInterval(interval);
        this.connections.delete(conversationId);
      });

      ws.on("error", (error) => {
        console.error("WebSocket error:", error);
      });
    });
  }

  private extractConversationId(url: string | undefined): string {
    if (!url) return "unknown";
    const match = url.match(/conversationId=([^&]+)/);
    return match ? match[1] : "unknown";
  }

  private handleClientMessage(conversationId: string, message: any): void {
    console.log(`Received message from ${conversationId}:`, message);

    this.sendToClient(conversationId, {
      type: "message_received",
      timestamp: new Date().toISOString(),
      conversationId,
      data: { originalMessage: message },
    });
  }

  private sendMockStatusUpdate(conversationId: string): void {
    const conversation = this.mockDataStore?.getConversation(conversationId);
    const pipeline = conversation?.pipelineId
      ? this.mockDataStore?.getPipeline(conversation.pipelineId)
      : null;

    if (pipeline && pipeline.nodes.length >= 0) {
      const updates = [];
      const nodesToUpdate = Math.floor(Math.random() * 3) + 1;
      const shuffledNodes = [...pipeline.nodes].sort(() => 0.5 - Math.random());

      for (let i = 0; i < Math.min(nodesToUpdate, shuffledNodes.length); i++) {
        const node = shuffledNodes[i];
        const newStatus = this.getNextNodeStatus(node.status);

        updates.push({
          type: "node_status_update",
          data: {
            nodeId: node.id,
            status: newStatus,
            progress:
              newStatus === "complete"
                ? 100
                : Math.floor(Math.random() * 80) + 20,
            message: this.getStatusMessage(newStatus, node.kind),
          },
        });
      }

      updates.forEach((update) => {
        this.sendToClient(conversationId, {
          ...update,
          timestamp: new Date().toISOString(),
          conversationId,
        } as WebSocketEvent);
      });
    } else {
      const events: Partial<WebSocketEvent>[] = [
        {
          type: "node_status_update",
          data: {
            nodeId: `node_${Math.floor(Math.random() * 3) + 1}`,
            status: ["pending", "partial", "complete", "error"][
              Math.floor(Math.random() * 4)
            ],
            progress: Math.floor(Math.random() * 100),
          },
        },
      ];

      const randomEvent = events[Math.floor(Math.random() * events.length)];
      this.sendToClient(conversationId, {
        ...randomEvent,
        timestamp: new Date().toISOString(),
        conversationId,
      } as WebSocketEvent);
    }
  }

  private getNextNodeStatus(currentStatus?: string): string {
    const statusProgression = {
      pending: ["partial", "complete"][Math.floor(Math.random() * 2)],
      partial: Math.random() > 0.3 ? "complete" : "partial",
      complete: "complete",
      error: Math.random() > 0.8 ? "pending" : "error",
    };

    return (
      statusProgression[currentStatus as keyof typeof statusProgression] ||
      "pending"
    );
  }

  private getStatusMessage(status: string, nodeKind: string): string {
    const messages = {
      pending: {
        source: "Connecting to data source...",
        transform: "Preparing transformation...",
        destination: "Setting up destination...",
      },
      partial: {
        source: "Extracting data...",
        transform: "Processing records...",
        destination: "Loading data...",
      },
      complete: {
        source: "Data extraction completed",
        transform: "Transformation finished",
        destination: "Data loaded successfully",
      },
      error: {
        source: "Connection failed",
        transform: "Processing error",
        destination: "Load failed",
      },
    };

    return (
      messages[status as keyof typeof messages]?.[
        nodeKind as keyof typeof messages.pending
      ] || "Processing..."
    );
  }

  sendToClient(conversationId: string, data: WebSocketEvent): void {
    const ws = this.connections.get(conversationId);
    if (ws && ws.readyState === ws.OPEN) {
      ws.send(JSON.stringify(data));
    }
  }

  broadcast(data: WebSocketEvent): void {
    this.connections.forEach((ws, conversationId) => {
      if (ws.readyState === ws.OPEN) {
        ws.send(
          JSON.stringify({
            ...data,
            conversationId,
          }),
        );
      }
    });
  }
}
