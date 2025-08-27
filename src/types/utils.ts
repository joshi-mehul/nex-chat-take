// src/types/utils.ts

// JSON Schema Types
export interface JSONSchema {
  type: string;
  properties?: Record<string, JSONSchema>;
  required?: string[];
  items?: JSONSchema;
  enum?: any[];
  format?: string;
  pattern?: string;
  minimum?: number;
  maximum?: number;
  minLength?: number;
  maxLength?: number;
  description?: string;
  title?: string;
  default?: any;
}

// Generic API Response
export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  success: boolean;
  timestamp: string;
}

// Pagination
export interface PaginatedResponse<T> {
  items: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
}

// Search and Filter
export interface SearchParams {
  query?: string;
  filters?: Record<string, any>;
  sort?: SortOption[];
  pagination?: {
    page: number;
    limit: number;
  };
}

export interface SortOption {
  field: string;
  direction: "asc" | "desc";
}

// File Upload
export interface FileUploadResponse {
  fileId: string;
  filename: string;
  size: number;
  mimeType: string;
  url: string;
}

// Async State
export interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

// Coordinates and Geometry
export interface Point {
  x: number;
  y: number;
}

export interface Rectangle {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Size {
  width: number;
  height: number;
}
