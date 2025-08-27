// src/types/pipeline.ts

// Core Pipeline Types
export interface Pipeline {
  id: string;
  name: string;
  description: string;
  conversationId: string;
  nodes: Node[];
  connections: Connection[];
  status: "draft" | "configured" | "active" | "error" | "paused";
  configuration: PipelineConfiguration;
  createdAt: string;
  updatedAt: string;
}

export type NodeKind = "source" | "destination" | "transform" | "compute";

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

export interface ServiceConfiguration {
  connection: Record<string, any>;
  operation: OperationConfiguration;
  mapping?: DataMapping;
  filters?: FilterConfiguration[];
  options?: Record<string, any>;
}

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

export interface ErrorHandlingConfig {
  retryCount: number;
  retryDelay: number;
  onFailure: "stop" | "continue" | "notify";
  maxErrors?: number;
  timeout?: number;
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

export interface SchemaIndex {
  name: string;
  fields: string[];
  unique: boolean;
  type?: "btree" | "hash" | "gin" | "gist";
}

export interface SchemaField {
  name: string;
  type: FieldType;
  nullable: boolean;
  description?: string;
  format?: string;
  constraints?: FieldConstraints;
}

export interface FieldConstraints {
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  enum?: any[];
  minimum?: number;
  maximum?: number;
  unique?: boolean;
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

export interface Vector2 {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

// Enhanced FlowEdge Interface
export interface Connection<TExtras = Record<string, unknown>> {
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

export interface Position {
  x: number;
  y: number;
}

export type NodeStatus =
  | "pending"
  | "partial"
  | "complete"
  | "error"
  | "running"
  | "success";
export type ConnectionStatus = "active" | "inactive" | "error";

export interface NodePort {
  id: string;
  name: string;
  type: "input" | "output";
  dataType?: string;
  required?: boolean;
}

export interface PipelineConfiguration {
  schedule?: {
    type: "manual" | "interval" | "cron";
    value?: string;
  };
  errorHandling: {
    retryCount: number;
    retryDelay: number;
    onFailure: "stop" | "continue" | "notify";
  };
  notifications: {
    email?: string[];
    webhook?: string;
    onSuccess: boolean;
    onFailure: boolean;
  };
  performance?: {
    batchSize?: number;
    parallelism?: number;
    timeout?: number;
  };
}
