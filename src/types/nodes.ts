// src/types/nodes.ts

import type { Schema } from "./integrations";
import type { JSONSchema } from "./utils";

export interface NodeType {
  id: string;
  name: string;
  category: "source" | "transform" | "destination";
  icon: string;
  description: string;
  configurationSchema: JSONSchema;
  authenticationRequired: boolean;
  supportedOperations: string[];
  tags?: string[];
  vendor?: string;
}

// Specific Node Configuration Types
export interface ShopifyNodeConfig {
  storeUrl: string;
  accessToken: string;
  apiVersion?: string;
  resources: ("orders" | "products" | "customers")[];
  filters?: {
    dateRange?: DateRange;
    status?: string[];
  };
}

export interface SnowflakeNodeConfig {
  account: string;
  username: string;
  password: string;
  database: string;
  schema: string;
  warehouse?: string;
  role?: string;
  table: string;
}

export interface BigQueryNodeConfig {
  projectId: string;
  datasetId: string;
  tableId: string;
  credentials: ServiceAccountCredentials;
  location?: string;
}

export interface TransformNodeConfig {
  transformType: "map" | "filter" | "aggregate" | "join" | "custom";
  rules: TransformRule[];
  outputSchema?: Schema;
}

export interface TransformRule {
  id: string;
  type:
    | "field_mapping"
    | "filter_condition"
    | "aggregation"
    | "custom_function";
  source: string;
  target?: string;
  condition?: string;
  function?: string;
}

export interface ServiceAccountCredentials {
  type: string;
  project_id: string;
  private_key_id: string;
  private_key: string;
  client_email: string;
  client_id: string;
  auth_uri: string;
  token_uri: string;
}

export interface DateRange {
  start: string;
  end: string;
}
