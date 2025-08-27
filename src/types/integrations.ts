// src/types/integrations.ts

export interface IntegrationResponse {
  isConnected: boolean;
  metadata?: IntegrationMetadata;
  error?: string;
}

export interface IntegrationMetadata {
  availableFields: Field[];
  sampleData?: Record<string, any>;
  rateLimits?: RateLimit;
  supportedOperations?: string[];
  apiVersion?: string;
  lastSync?: string;
}

export interface Field {
  name: string;
  type: FieldType;
  required: boolean;
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
  | "array";

export interface FieldConstraints {
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  enum?: any[];
  minimum?: number;
  maximum?: number;
}

export interface RateLimit {
  requestsPerMinute: number;
  requestsPerHour: number;
  requestsPerDay?: number;
  current: {
    remaining: number;
    resetTime: string;
  };
}

export interface Schema {
  fields: Field[];
  primaryKey?: string[];
  indexes?: SchemaIndex[];
}

export interface SchemaIndex {
  name: string;
  fields: string[];
  unique: boolean;
}
