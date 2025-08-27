import { v4 as uuidv4 } from "uuid";
import {
  ConversationResponse,
  Message,
  Pipeline,
  Node,
  FlowEdge,
  IntentParseResult,
  DetectedService,
  ClarificationRequest,
  PipelineBlueprint,
  NodeBlueprint,
  ConnectionBlueprint,
  ValidationState,
  ServiceConfiguration,
  Vector2,
} from "../../types";
import { ServiceRegistry } from "./ServiceRegistry";

export class MockDataStore {
  private conversations = new Map<string, ConversationResponse>();
  private pipelines = new Map<string, Pipeline>();
  private sessions = new Map<string, any>();
  private serviceRegistry: ServiceRegistry;

  constructor() {
    this.serviceRegistry = new ServiceRegistry();
  }

  // Session Management
  createSession(data: any) {
    const sessionId = uuidv4();
    const session = {
      sessionId,
      userId: data.userId || null,
      preferences: data.preferences || { theme: "light", language: "en" },
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    };
    this.sessions.set(sessionId, session);
    return session;
  }

  getSession(sessionId: string) {
    return this.sessions.get(sessionId) || null;
  }

  // Conversation Management
  createConversation(data: any): ConversationResponse {
    const conversationId = uuidv4();
    const conversation: ConversationResponse = {
      id: conversationId,
      sessionId: data.sessionId,
      messages: [],
      status: "active",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.conversations.set(conversationId, conversation);
    return conversation;
  }

  getConversation(conversationId: string): ConversationResponse | null {
    return this.conversations.get(conversationId) || null;
  }

  addMessage(conversationId: string, messageData: any): Message {
    const conversation = this.conversations.get(conversationId);
    if (!conversation) {
      throw new Error("Conversation not found");
    }

    const userMessage: Message = {
      id: uuidv4(),
      content: messageData.content,
      type: "user",
      timestamp: new Date().toISOString(),
    };

    conversation.messages.push(userMessage);

    // Generate AI response
    const aiResponse = this.generateAIResponse(
      messageData.content,
      conversationId,
    );
    conversation.messages.push(aiResponse);

    conversation.updatedAt = new Date().toISOString();
    return aiResponse;
  }

  private generateAIResponse(
    userMessage: string,
    conversationId: string,
  ): Message {
    const responses = [
      "I can help you set up that data pipeline! Let me ask a few questions to configure it properly.",
      "Great choice! What's your source system URL or connection details?",
      "Which specific data fields do you want to sync?",
      "How often would you like to sync this data?",
      "Do you need any data transformations or filtering?",
      "Perfect! I'm building your pipeline now. You can see the progress in the visual canvas.",
    ];

    const response = responses[Math.floor(Math.random() * responses.length)];

    return {
      id: uuidv4(),
      content: response,
      type: "ai",
      timestamp: new Date().toISOString(),
      metadata: {
        clarificationQuestions: this.getRandomClarificationQuestions(),
      },
    };
  }

  // AI Processing - Returns minimum 3 nodes
  parseIntent(naturalLanguage: string, context?: any): IntentParseResult {
    const detectedServices = this.detectServicesFromText(naturalLanguage);
    const suggestedPipeline = this.generateMultiNodePipeline(
      detectedServices,
      naturalLanguage,
    );

    return {
      confidence: 0.85 + Math.random() * 0.15,
      detectedServices,
      suggestedPipeline,
      clarificationNeeded:
        this.generateClarificationQuestions(detectedServices),
      alternatives: [],
      intent: this.extractIntent(naturalLanguage),
    };
  }

  private detectServicesFromText(text: string): DetectedService[] {
    const services = this.serviceRegistry.getAllServices();
    const detected: DetectedService[] = [];
    const lowercaseText = text.toLowerCase();

    services.forEach((service) => {
      const keywords = [
        service.name.toLowerCase(),
        service.metadata?.vendor?.toLowerCase(),
        ...(service.metadata?.tags || []),
      ].filter(Boolean) as string[];

      const confidence = this.calculateMatchConfidence(lowercaseText, keywords);

      if (confidence > 0.3) {
        detected.push({
          serviceId: service.id,
          confidence,
          role: service.category,
          extractedParameters: this.extractParametersFromText(text, service),
          missingParameters: service.connectionSpec.fields
            .filter((f) => f.required)
            .map((f) => f.name),
        });
      }
    });

    return detected.sort((a, b) => b.confidence - a.confidence).slice(0, 4);
  }

  private calculateMatchConfidence(text: string, keywords: string[]): number {
    let matches = 0;
    keywords.forEach((keyword) => {
      if (keyword && text.includes(keyword)) {
        matches++;
      }
    });
    return matches / Math.max(keywords.length, 1);
  }

  private extractParametersFromText(
    text: string,
    service: any,
  ): Record<string, any> {
    const parameters: Record<string, any> = {};

    // Simple URL extraction
    const urlMatch = text.match(/https?:\/\/[^\s]+/);
    if (urlMatch) {
      const urlField = service.connectionSpec.fields.find(
        (f: any) => f.type === "url",
      );
      if (urlField) {
        parameters[urlField.name] = urlMatch[0];
      }
    }

    return parameters;
  }

  private generateMultiNodePipeline(
    detectedServices: DetectedService[],
    prompt: string,
  ): PipelineBlueprint {
    const nodes: NodeBlueprint[] = [];
    const connections: ConnectionBlueprint[] = [];

    // Ensure we always have at least 3 nodes: Source -> Transform -> Destination
    const enhancedServices = this.ensureMinimumThreeNodes(
      detectedServices,
      prompt,
    );

    // Create nodes with proper positioning
    enhancedServices.forEach((detected, index) => {
      const position: Vector2 = {
        x: 50 + index * 280,
        y: 150 + Math.sin(index * 0.5) * 40,
      };

      const nodeBlueprint: NodeBlueprint = {
        id: `node_${index + 1}`,
        serviceId: detected.serviceId,
        role: detected.role,
        position,
        size: { width: 200, height: 100 },
        label: this.generateNodeLabel(detected, index),
        configuration: {
          connection: detected.extractedParameters,
          operation: {
            type: this.getOperationType(detected.role),
            parameters: this.generateOperationParameters(detected),
          },
        },
      };

      nodes.push(nodeBlueprint);
    });

    // Create connections between all consecutive nodes
    for (let i = 0; i < nodes.length - 1; i++) {
      const connection: ConnectionBlueprint = {
        id: `conn_${i + 1}`,
        sourceNodeId: nodes[i].id,
        targetNodeId: nodes[i + 1].id,
        label: this.generateConnectionLabel(nodes[i], nodes[i + 1]),
        type: "default",
      };
      connections.push(connection);
    }

    return {
      nodes,
      connections,
      estimatedComplexity: this.calculateComplexity(nodes.length),
      requiredCapabilities: this.extractRequiredCapabilities(enhancedServices),
    };
  }

  private ensureMinimumThreeNodes(
    detectedServices: DetectedService[],
    prompt: string,
  ): DetectedService[] {
    const services = [...detectedServices];
    const allServices = this.serviceRegistry.getAllServices();

    // Ensure we have at least one source
    if (!services.find((s) => s.role === "source")) {
      const sourceService = this.selectBestSourceService(prompt, allServices);
      services.unshift({
        serviceId: sourceService.id,
        confidence: 0.8,
        role: "source",
        extractedParameters: this.extractParametersForService(
          sourceService,
          prompt,
        ),
        missingParameters: this.getMissingParameters(sourceService),
      });
    }

    // Ensure we have at least one destination
    if (!services.find((s) => s.role === "destination")) {
      const destinationService = this.selectBestDestinationService(
        prompt,
        allServices,
      );
      services.push({
        serviceId: destinationService.id,
        confidence: 0.8,
        role: "destination",
        extractedParameters: this.extractParametersForService(
          destinationService,
          prompt,
        ),
        missingParameters: this.getMissingParameters(destinationService),
      });
    }

    // Add transform nodes to reach minimum of 3 total nodes
    while (services.length < 3) {
      const transformService = this.selectTransformService(
        services.length,
        allServices,
      );
      services.splice(-1, 0, {
        serviceId: transformService.id,
        confidence: 0.7,
        role: "transform",
        extractedParameters: {},
        missingParameters: this.getMissingParameters(transformService),
      });
    }

    // Sometimes add extra nodes for more complex pipelines (4-6 nodes)
    if (Math.random() > 0.4 && services.length < 6) {
      const additionalNodesCount = Math.floor(Math.random() * 2) + 1;

      for (let i = 0; i < additionalNodesCount; i++) {
        const transformService = this.selectTransformService(
          services.length + i,
          allServices,
        );
        services.splice(-1, 0, {
          serviceId: transformService.id,
          confidence: 0.6,
          role: "transform",
          extractedParameters: {},
          missingParameters: this.getMissingParameters(transformService),
        });
      }
    }

    return services;
  }

  private selectBestSourceService(prompt: string, allServices: any[]): any {
    const sources = allServices.filter((s) => s.category === "source");
    const promptLower = prompt.toLowerCase();

    // Try to match based on prompt content
    const keywordMatches = sources.filter((service) => {
      const keywords = [
        service.name.toLowerCase(),
        service.metadata?.vendor?.toLowerCase(),
        ...(service.metadata?.tags || []),
      ].filter(Boolean);

      return keywords.some((keyword) => promptLower.includes(keyword));
    });

    if (keywordMatches.length > 0) {
      return keywordMatches[0];
    }

    // Fallback to popular sources
    const popularSources = [
      "ecommerce-shopify",
      "crm-salesforce",
      "database-mysql",
    ];

    for (const sourceId of popularSources) {
      const service = sources.find((s) => s.id === sourceId);
      if (service) return service;
    }

    return sources[0];
  }

  private selectBestDestinationService(
    prompt: string,
    allServices: any[],
  ): any {
    const destinations = allServices.filter(
      (s) => s.category === "destination",
    );
    const promptLower = prompt.toLowerCase();

    // Try to match based on prompt content
    const keywordMatches = destinations.filter((service) => {
      const keywords = [
        service.name.toLowerCase(),
        service.metadata?.vendor?.toLowerCase(),
        ...(service.metadata?.tags || []),
      ].filter(Boolean);

      return keywords.some((keyword) => promptLower.includes(keyword));
    });

    if (keywordMatches.length > 0) {
      return keywordMatches[0];
    }

    // Fallback to popular destinations
    const popularDestinations = ["warehouse-snowflake", "warehouse-bigquery"];

    for (const destId of popularDestinations) {
      const service = destinations.find((s) => s.id === destId);
      if (service) return service;
    }

    return destinations[0];
  }

  private selectTransformService(index: number, allServices: any[]): any {
    const transforms = allServices.filter((s) => s.category === "transform");
    const transformTypes = [
      "transform-filter",
      "transform-map",
      "transform-aggregate",
    ];

    const selectedType = transformTypes[index % transformTypes.length];
    const service = transforms.find((s) => s.id === selectedType);

    return service || transforms[index % transforms.length];
  }

  private extractParametersForService(
    service: any,
    prompt: string,
  ): Record<string, any> {
    const parameters: Record<string, any> = {};

    // Extract URLs from prompt
    const urlMatch = prompt.match(/https?:\/\/[^\s]+/);
    if (urlMatch) {
      const urlField = service.connectionSpec.fields.find(
        (f: any) => f.type === "url",
      );
      if (urlField) {
        parameters[urlField.name] = urlMatch[0];
      }
    }

    return parameters;
  }

  private getMissingParameters(service: any): string[] {
    return service.connectionSpec.fields
      .filter((f: any) => f.required)
      .map((f: any) => f.name);
  }

  private generateNodeLabel(detected: DetectedService, index: number): string {
    const service = this.serviceRegistry.getServiceById(detected.serviceId);
    if (!service) return `Node ${index + 1}`;

    const roleLabels = {
      source: "Extract from",
      transform: "Process with",
      destination: "Load to",
    };

    return `${roleLabels[detected.role]} ${service.name}`;
  }

  private getOperationType(role: string): string {
    const operationMap = {
      source: "extract",
      transform: "transform",
      destination: "load",
    };
    return operationMap[role as keyof typeof operationMap] || "process";
  }

  private generateOperationParameters(
    detected: DetectedService,
  ): Record<string, any> {
    const baseParams = { ...detected.extractedParameters };

    switch (detected.role) {
      case "source":
        return {
          ...baseParams,
          batchSize: 1000,
          incrementalSync: true,
          syncFrequency: "hourly",
        };
      case "transform":
        return {
          ...baseParams,
          maxMemoryUsage: "512MB",
          parallelProcessing: true,
        };
      case "destination":
        return {
          ...baseParams,
          writeMode: "append",
          createTableIfNotExists: true,
        };
      default:
        return baseParams;
    }
  }

  private generateConnectionLabel(
    fromNode: NodeBlueprint,
    toNode: NodeBlueprint,
  ): string {
    const fromService = this.serviceRegistry.getServiceById(fromNode.serviceId);
    const toService = this.serviceRegistry.getServiceById(toNode.serviceId);

    if (!fromService || !toService) return "Data Flow";

    if (fromNode.role === "source" && toNode.role === "transform") {
      return `Raw ${fromService.metadata.category} Data`;
    }

    if (fromNode.role === "transform" && toNode.role === "transform") {
      return "Processed Data";
    }

    if (toNode.role === "destination") {
      return `Clean ${toService.metadata.category} Data`;
    }

    return "Data Pipeline";
  }

  private calculateComplexity(nodeCount: number): "low" | "medium" | "high" {
    if (nodeCount <= 3) return "low";
    if (nodeCount <= 5) return "medium";
    return "high";
  }

  private extractRequiredCapabilities(services: DetectedService[]): string[] {
    const capabilities = new Set<string>();

    services.forEach((service) => {
      const serviceDefinition = this.serviceRegistry.getServiceById(
        service.serviceId,
      );
      if (serviceDefinition) {
        serviceDefinition.capabilities.forEach((cap) => {
          capabilities.add(cap.operation);
        });
      }
    });

    capabilities.add("data_validation");
    capabilities.add("error_handling");
    capabilities.add("monitoring");

    if (services.length > 4) {
      capabilities.add("parallel_processing");
    }

    return Array.from(capabilities);
  }

  private extractIntent(prompt: string): string {
    const intentKeywords = {
      sync: ["sync", "synchronize", "replicate"],
      migrate: ["migrate", "move", "transfer"],
      analyze: ["analyze", "analytics", "insights", "report"],
      backup: ["backup", "archive", "store"],
      integrate: ["integrate", "connect", "link"],
      transform: ["transform", "clean", "process", "format"],
    };

    const promptLower = prompt.toLowerCase();

    for (const [intent, keywords] of Object.entries(intentKeywords)) {
      if (keywords.some((keyword) => promptLower.includes(keyword))) {
        return intent;
      }
    }

    return "integrate";
  }

  private getRandomClarificationQuestions() {
    const questions = [
      {
        id: uuidv4(),
        question: "What's your source system URL?",
        type: "url",
        required: true,
      },
      {
        id: uuidv4(),
        question: "Which data fields do you want to sync?",
        type: "multiselect",
        options: ["orders", "products", "customers", "inventory"],
        required: true,
      },
      {
        id: uuidv4(),
        question: "How often should we sync the data?",
        type: "select",
        options: ["Real-time", "Every hour", "Daily", "Weekly"],
        required: false,
      },
    ];

    return questions.slice(0, Math.floor(Math.random() * 2) + 1);
  }

  private generateClarificationQuestions(
    services: DetectedService[],
  ): ClarificationRequest[] {
    const questions: ClarificationRequest[] = [];

    services.forEach((detected) => {
      const service = this.serviceRegistry.getServiceById(detected.serviceId);
      if (service) {
        detected.missingParameters.forEach((param) => {
          const field = service.connectionSpec.fields.find(
            (f) => f.name === param,
          );
          if (field) {
            questions.push({
              id: `${detected.serviceId}_${param}`,
              serviceId: detected.serviceId,
              field: param,
              question: `What is your ${field.label || field.name}?`,
              type: field.type as any,
              required: field.required,
              options: field.options,
            });
          }
        });
      }
    });

    return questions.slice(0, 3);
  }

  // Pipeline Management
  createPipeline(data: Partial<Pipeline>): Pipeline {
    const pipelineId = uuidv4();

    let nodes = data.nodes || [];
    let connections = data.connections || [];

    console.log("initial nodes", nodes, connections);

    if (nodes.length === 0) {
      const defaultServices = [
        "ecommerce-shopify",
        "transform-filter",
        "warehouse-snowflake",
      ];

      nodes = defaultServices.map((serviceId, index) => {
        return this.serviceRegistry.createNodeFromService(
          serviceId,
          { x: 100 + index * 250, y: 200 },
          index,
        );
      });

      console.log("empty nodes", nodes);

      for (let i = 0; i < nodes.length - 1; i++) {
        connections.push(
          this.serviceRegistry.createFlowEdge(nodes[i].id, nodes[i + 1].id, i),
        );
      }
    } else {
      nodes = nodes.map((node, index) => {
        if (!node.size || !node.label) {
          return this.serviceRegistry.createNodeFromService(
            node.serviceId,
            node.position || { x: 100 + index * 250, y: 200 },
            index,
          );
        }
        return node;
      });
      console.log("empty connections", nodes);
      connections = [];
      for (let i = 0; i < nodes.length - 1; i++) {
        connections.push(
          this.serviceRegistry.createFlowEdge(nodes[i].id, nodes[i + 1].id, i),
        );
      }
    }

    console.log("connections", connections);

    const pipeline: Pipeline = {
      id: pipelineId,
      name: data.name || this.generatePipelineName(nodes),
      description: data.description || this.generatePipelineDescription(nodes),
      conversationId: data.conversationId || "",
      nodes,
      connections,
      status: "draft",
      configuration: data.configuration || {
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
      viewport: data.viewport || { x: 0, y: 0, zoom: 1 },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.pipelines.set(pipelineId, pipeline);
    console.log(
      `✅ Created pipeline with ${nodes.length} nodes:`,
      pipeline.name,
    );
    return pipeline;
  }

  private generatePipelineName(nodes: Node[]): string {
    if (nodes.length < 2) return "Data Pipeline";

    const sourceNode = nodes.find((n) => n.kind === "source");
    const destNode = nodes.find((n) => n.kind === "destination");

    const sourceName = sourceNode
      ? this.serviceRegistry.getServiceById(sourceNode.serviceId)?.name
      : "Source";
    const destName = destNode
      ? this.serviceRegistry.getServiceById(destNode.serviceId)?.name
      : "Destination";

    return `${sourceName} → ${destName}`;
  }

  private generatePipelineDescription(nodes: Node[]): string {
    const processSteps = nodes
      .map((node) => {
        const service = this.serviceRegistry.getServiceById(node.serviceId);
        return service?.name || "Unknown Service";
      })
      .join(" → ");

    return `Automated data pipeline: ${processSteps}`;
  }

  getPipeline(pipelineId: string): Pipeline | null {
    return this.pipelines.get(pipelineId) || null;
  }

  updatePipeline(
    pipelineId: string,
    updates: Partial<Pipeline>,
  ): Pipeline | null {
    const pipeline = this.pipelines.get(pipelineId);
    if (!pipeline) return null;

    const updatedPipeline = {
      ...pipeline,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.pipelines.set(pipelineId, updatedPipeline);
    return updatedPipeline;
  }

  validatePipeline(pipelineId: string): ValidationState {
    const errors =
      Math.random() > 0.7
        ? [
            {
              id: uuidv4(),
              field: "credentials",
              message: "Invalid API credentials",
              code: "INVALID_CREDENTIALS",
              severity: "error" as const,
            },
          ]
        : [];

    const warnings =
      Math.random() > 0.5
        ? [
            {
              id: uuidv4(),
              field: "configuration",
              message: "Consider adding data validation",
            },
          ]
        : [];

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }

  updateNode(
    pipelineId: string,
    nodeId: string,
    updates: Partial<Node>,
  ): Node | null {
    const pipeline = this.pipelines.get(pipelineId);
    if (!pipeline) return null;

    const nodeIndex = pipeline.nodes.findIndex((n) => n.id === nodeId);
    if (nodeIndex === -1) return null;

    const existingNode = pipeline.nodes[nodeIndex];
    const updatedNode: Node = {
      ...existingNode,
      ...updates,
      meta: {
        ...existingNode.meta,
        ...updates.meta,
        updatedAt: new Date().toISOString(),
      },
    };

    pipeline.nodes[nodeIndex] = updatedNode;
    pipeline.updatedAt = new Date().toISOString();

    return updatedNode;
  }

  testNodeConnection(serviceId: string, configuration: ServiceConfiguration) {
    const success = Math.random() > 0.2;

    return {
      success,
      message: success
        ? "Connection successful"
        : "Connection failed: Invalid credentials",
      metadata: success
        ? {
            latency: Math.floor(Math.random() * 500) + 100,
            availableResources: ["orders", "products", "customers"],
            recordCount: Math.floor(Math.random() * 10000) + 1000,
          }
        : undefined,
      timestamp: new Date().toISOString(),
    };
  }

  getServiceRegistry() {
    return this.serviceRegistry;
  }
}
