import { useEffect, useRef } from "react";
import { usePipelineStore } from "./pipelineStore";
import { useConversationStore } from "./conversationStore";
import { wsClient } from "@utils/websocket";

export const useWebSocket = (conversationId: string | null) => {
  const connected = useRef(false);
  const { updateNode } = usePipelineStore();
  const { loadConversation } = useConversationStore();

  useEffect(() => {
    if (!conversationId || connected.current) return;

    // Connect to WebSocket
    wsClient.connect(conversationId);
    connected.current = true;

    // Set up event listeners
    const handleNodeStatusUpdate = (data: any) => {
      console.log("Node status update:", data);
      if (data.data?.nodeId && data.data?.status) {
        // Update node status in pipeline store
        const currentPipeline = usePipelineStore
          .getState()
          .getCurrentPipeline();
        if (currentPipeline) {
          /*updateNode(data.data.nodeId, {
            status: data.data.status,
          });*/
        }
      }
    };

    const handleAIResponse = (data: any) => {
      console.log("AI response received:", data);
      // Refresh conversation to get latest messages
      if (conversationId) {
        loadConversation(conversationId);
      }
    };

    const handlePipelineCreated = (data: any) => {
      console.log("Pipeline created:", data);
      if (data.data?.pipeline) {
        const { pipelines } = usePipelineStore.getState();
        pipelines.set(data.data.pipeline.id, data.data.pipeline);
        usePipelineStore.setState({
          pipelines: new Map(pipelines),
          currentPipelineId: data.data.pipeline.id,
        });
      }
    };

    const handleValidationResult = (data: any) => {
      console.log("Validation result:", data);
      if (data.data?.result) {
        usePipelineStore.setState({
          validationErrors: data.data.result.errors || [],
        });
      }
    };

    const handleConnectionEstablished = (data: any) => {
      console.log("WebSocket connection established:", data);
    };

    const handleError = (data: any) => {
      console.error("WebSocket error:", data);
    };

    // Register event listeners
    wsClient.on("node_status_update", handleNodeStatusUpdate);
    wsClient.on("ai_response", handleAIResponse);
    wsClient.on("pipeline_created", handlePipelineCreated);
    wsClient.on("validation_result", handleValidationResult);
    wsClient.on("connected", handleConnectionEstablished);
    wsClient.on("error", handleError);

    // Cleanup function
    return () => {
      wsClient.off("node_status_update", handleNodeStatusUpdate);
      wsClient.off("ai_response", handleAIResponse);
      wsClient.off("pipeline_created", handlePipelineCreated);
      wsClient.off("validation_result", handleValidationResult);
      wsClient.off("connected", handleConnectionEstablished);
      wsClient.off("error", handleError);

      wsClient.disconnect();
      connected.current = false;
    };
  }, [conversationId, updateNode, loadConversation]);

  return {
    send: wsClient.send.bind(wsClient),
    connected: connected.current,
  };
};
