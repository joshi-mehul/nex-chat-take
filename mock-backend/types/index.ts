// Base primitive types
export type NodeKind = "source" | "destination" | "transform" | "compute";
export type NodeStatus =
  | "pending"
  | "partial"
  | "complete"
  | "error"
  | "idle"
  | "running";
export type PipelineStatus =
  | "draft"
  | "configured"
  | "active"
  | "error"
  | "paused";

// Geometric types
export interface Vector2 {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

// Enhanced Node Interface
export interface Node<TExtras = Record<string, unknown>> {
  id: string;
  kind: NodeKind;
  label: string;
  position: Vector2;
  size: Size;
  status?: NodeStatus;
  color?: string;
  icon?: string;
  locked?: boolean;
  hidden?: boolean;
  meta?: TExtras;
  inputs?: string[];
  outputs?: string[];
  serviceId: string;
  configuration?: ServiceConfiguration;
  validation?: ValidationState;
  runtime?: RuntimeMetrics;
}

// Enhanced FlowEdge Interface
export interface FlowEdge<TExtras = Record<string, unknown>> {
  id: string;
  fromNodeId: string;
  toNodeId: string;
  fromPort?: string;
  toPort?: string;
  label?: string;
  dashed?: boolean;
  color?: string;
  meta?: TExtras;
  animated?: boolean;
  style?: React.CSSProperties;
  type?: "default" | "straight" | "step" | "smoothstep";
}

// Service Definition Types
export interface ServiceDefinition {
  id: string;
  name: string;
  category: NodeKind;
  version: string;
  protocol: "rest" | "graphql" | "grpc" | "webhook" | "database" | "file";
  authentication: AuthenticationSpec;
  capabilities: ServiceCapability[];
  connectionSpec: ConnectionSpec;
  operationSpecs?: OperationSpec[];
  metadata: ServiceMetadata;
}

export interface AuthenticationSpec {
  type: "oauth2" | "api_key" | "basic" | "bearer" | "custom";
  fields: AuthField[];
  testEndpoint?: string;
}

export interface AuthField {
  name: string;
  type:
    | "string"
    | "password"
    | "url"
    | "select"
    | "multiselect"
    | "json"
    | "number"
    | "boolean";
  label: string;
  required: boolean;
  description?: string;
  options?: string[];
  validation?: string[];
  placeholder?: string;
}

export interface ServiceCapability {
  operation: string;
  resources: string[];
  constraints: CapabilityConstraint[];
}

export interface CapabilityConstraint {
  type: string;
  value: any;
  description?: string;
}

export interface ConnectionSpec {
  fields: ConfigurationField[];
  validationRules?: ValidationRule[];
  defaultValues?: Record<string, any>;
}

export interface ConfigurationField {
  name: string;
  type: string;
  label?: string;
  description?: string;
  required: boolean;
  defaultValue?: any;
  options?: string[];
  validation?: string[];
  group?: string;
}

export interface ValidationRule {
  field: string;
  rule: string;
  message: string;
  params?: any[];
}

export interface ServiceMetadata {
  vendor?: string;
  category: string;
  icon: string;
  description: string;
  tags?: string[];
  documentation?: string;
  supportUrl?: string;
  logoUrl?: string;
  popularity?: number;
}

export interface OperationSpec {
  name: string;
  type: string;
  parameters: Record<string, any>;
  description?: string;
}

// Configuration Types
export interface ServiceConfiguration {
  connection: Record<string, any>;
  operation: OperationConfiguration;
  mapping?: DataMapping;
  filters?: FilterConfiguration[];
  options?: Record<string, any>;
}

export interface OperationConfiguration {
  type: string;
  parameters: Record<string, any>;
  schedule?: ScheduleConfig;
  errorHandling?: ErrorHandlingConfig;
}

export interface DataMapping {
  id: string;
  sourceSchema: DataSchema;
  targetSchema: DataSchema;
  mappingRules: MappingRule[];
  transformations: DataTransformation[];
  validation: MappingValidation;
}

export interface MappingRule {
  id: string;
  sourcePath: string;
  targetPath: string;
  transformation?: string;
  condition?: string;
  defaultValue?: any;
}

export interface DataTransformation {
  id: string;
  type: "filter" | "map" | "aggregate" | "join" | "custom";
  function: string;
  parameters: Record<string, any>;
  order: number;
}

export interface MappingValidation {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

export interface FilterConfiguration {
  field: string;
  operator: string;
  value: any;
  dataType?: string;
}

export interface ScheduleConfig {
  type: "manual" | "interval" | "cron";
  value?: string;
  timezone?: string;
}

export interface ErrorHandlingConfig {
  retryCount: number;
  retryDelay: number;
  onFailure: "stop" | "continue" | "notify";
  maxErrors?: number;
  timeout?: number;
}

// Pipeline Types
export interface Pipeline {
  id: string;
  name: string;
  description: string;
  conversationId: string;
  nodes: Node[];
  connections: FlowEdge[];
  status: PipelineStatus;
  configuration: PipelineConfiguration;
  viewport?: Viewport;
  createdAt: string;
  updatedAt: string;
}

export interface PipelineConfiguration {
  schedule?: ScheduleConfig;
  errorHandling: ErrorHandlingConfig;
  notifications: NotificationConfig;
  performance?: PerformanceConfig;
}

export interface NotificationConfig {
  email?: string[];
  webhook?: string;
  slack?: string;
  onSuccess: boolean;
  onFailure: boolean;
  onWarning?: boolean;
}

export interface PerformanceConfig {
  batchSize?: number;
  parallelism?: number;
  timeout?: number;
  memoryLimit?: number;
}

export interface Viewport {
  x: number;
  y: number;
  zoom: number;
  width?: number;
  height?: number;
}

// Validation Types
export interface ValidationState {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
  lastValidated?: string;
}

export interface ValidationError {
  id: string;
  field?: string;
  message: string;
  code: string;
  severity: "error" | "warning" | "info";
  suggestions?: string[];
}

export interface ValidationWarning {
  id: string;
  field?: string;
  message: string;
  suggestion?: string;
}

// Runtime and Metrics
export interface RuntimeMetrics {
  lastExecution?: string;
  executionCount: number;
  avgExecutionTime: number;
  errorRate: number;
  throughput?: number;
  memoryUsage?: number;
  cpuUsage?: number;
}

// Data Schema Types
export interface DataSchema {
  fields: SchemaField[];
  primaryKey?: string[];
  indexes?: SchemaIndex[];
  version?: string;
}

export interface SchemaField {
  name: string;
  type: FieldType;
  nullable: boolean;
  description?: string;
  format?: string;
  constraints?: FieldConstraints;
}

export type FieldType =
  | "string"
  | "number"
  | "boolean"
  | "date"
  | "datetime"
  | "object"
  | "array"
  | "binary";

export interface FieldConstraints {
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  enum?: any[];
  minimum?: number;
  maximum?: number;
  unique?: boolean;
}

export interface SchemaIndex {
  name: string;
  fields: string[];
  unique: boolean;
  type?: "btree" | "hash" | "gin" | "gist";
}

// Conversation Types
export interface ConversationResponse {
  id: string;
  sessionId: string;
  messages: Message[];
  pipelineId?: string;
  status: "active" | "completed" | "error";
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: string;
  content: string;
  type: "user" | "ai";
  timestamp: string;
  metadata?: MessageMetadata;
}

export interface MessageMetadata {
  clarificationQuestions?: ClarificationQuestion[];
  suggestedActions?: string[];
  confidence?: number;
  intent?: string;
  entities?: Entity[];
}

export interface ClarificationQuestion {
  id: string;
  question: string;
  type:
    | "text"
    | "select"
    | "multiselect"
    | "url"
    | "password"
    | "number"
    | "boolean";
  options?: string[];
  required: boolean;
  validation?: ValidationRule[];
}

export interface Entity {
  type: string;
  value: string;
  confidence: number;
  startIndex?: number;
  endIndex?: number;
}

// AI Processing Types
export interface IntentParseResult {
  confidence: number;
  detectedServices: DetectedService[];
  suggestedPipeline: PipelineBlueprint;
  clarificationNeeded: ClarificationRequest[];
  alternatives: AlternativePipeline[];
  intent?: string;
  entities?: Entity[];
  createdPipeline?: Pipeline;
}

export interface DetectedService {
  serviceId: string;
  confidence: number;
  role: NodeKind;
  extractedParameters: Record<string, any>;
  missingParameters: string[];
  suggestions?: string[];
}

export interface PipelineBlueprint {
  nodes: NodeBlueprint[];
  connections: ConnectionBlueprint[];
  estimatedComplexity: "low" | "medium" | "high";
  requiredCapabilities: string[];
  estimatedCost?: number;
  estimatedTime?: number;
}

export interface NodeBlueprint {
  id: string;
  serviceId: string;
  role: NodeKind;
  position: Vector2;
  configuration: Partial<ServiceConfiguration>;
  size?: Size;
  label?: string;
}

export interface ConnectionBlueprint {
  id: string;
  sourceNodeId: string;
  targetNodeId: string;
  label?: string;
  type?: "default" | "straight" | "step" | "smoothstep";
}

export interface AlternativePipeline {
  name: string;
  description: string;
  blueprint: PipelineBlueprint;
  confidence: number;
  reasoning?: string;
}

export interface ClarificationRequest {
  id: string;
  serviceId: string;
  field: string;
  question: string;
  type: "text" | "select" | "multiselect" | "url" | "password";
  required: boolean;
  options?: string[];
  validation?: ValidationRule[];
}

// WebSocket Event Types
export interface WebSocketEvent {
  type: string;
  timestamp: string;
  conversationId: string;
  data: any;
}

export interface NodeStatusUpdateEvent extends WebSocketEvent {
  type: "node_status_update";
  data: {
    nodeId: string;
    status: NodeStatus;
    message?: string;
    progress?: number;
    metrics?: Partial<RuntimeMetrics>;
  };
}

// API Response Types
export interface APIResponse<T = any> {
  data: T;
  success: boolean;
  message?: string;
  timestamp: string;
  requestId?: string;
}

export interface APIError {
  code: string;
  message: string;
  details?: Record<string, any>;
  timestamp: string;
  requestId?: string;
  stackTrace?: string;
}

// Node Metadata Extensions
export interface SourceNodeMeta extends Record<string, unknown> {
  extractionRate?: number;
  lastExtracted?: string;
  recordCount?: number;
  schema?: DataSchema;
  connectionHealth?: "healthy" | "degraded" | "unhealthy";
  dataVolume?: {
    daily: number;
    weekly: number;
    monthly: number;
  };
}

export interface TransformNodeMeta extends Record<string, unknown> {
  transformationType:
    | "filter"
    | "map"
    | "aggregate"
    | "join"
    | "validate"
    | "enrich";
  rules?: MappingRule[];
  performance?: {
    avgProcessingTime: number;
    throughput: number;
    memoryUsage: number;
  };
  complexity?: "low" | "medium" | "high";
}

export interface DestinationNodeMeta extends Record<string, unknown> {
  loadStrategy: "append" | "replace" | "upsert" | "merge";
  batchSize?: number;
  lastLoaded?: string;
  totalRecordsLoaded?: number;
  compressionRatio?: number;
  storageSize?: number;
}

// Edge Metadata Extensions
export interface DataFlowMeta extends Record<string, unknown> {
  dataType?: string;
  recordCount?: number;
  bandwidth?: number;
  latency?: number;
  errorRate?: number;
  compression?: boolean;
  encryption?: boolean;
  backpressure?: boolean;
}
