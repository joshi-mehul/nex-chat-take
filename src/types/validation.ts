// src/types/validation.ts

export interface ValidationResponse {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
  suggestions?: ConfigurationSuggestion[];
}

export interface ValidationError {
  id: string;
  nodeId?: string;
  connectionId?: string;
  field?: string;
  message: string;
  severity: "error" | "warning" | "info";
  code: ValidationErrorCode;
}

export interface ValidationWarning {
  id: string;
  nodeId?: string;
  message: string;
  suggestion?: string;
}

export interface ConfigurationSuggestion {
  id: string;
  nodeId: string;
  field: string;
  suggestedValue: any;
  reason: string;
  confidence: number;
}

type ValidationErrorCode =
  | "REQUIRED_FIELD_MISSING"
  | "INVALID_CREDENTIALS"
  | "CONNECTION_FAILED"
  | "SCHEMA_MISMATCH"
  | "CIRCULAR_DEPENDENCY"
  | "UNSUPPORTED_OPERATION"
  | "RATE_LIMIT_EXCEEDED";

export interface APIError {
  error: {
    code: string;
    message: string;
    details?: Record<string, any>;
    timestamp: string;
    requestId: string;
  };
}
