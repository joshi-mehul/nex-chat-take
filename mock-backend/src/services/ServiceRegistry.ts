import { v4 as uuidv4 } from "uuid";
import {
  ServiceDefinition,
  ServiceCapability,
  ServiceMetadata,
  Node,
  FlowEdge,
  Vector2,
  Size,
  NodeKind,
  NodeStatus,
  SourceNodeMeta,
  TransformNodeMeta,
  DestinationNodeMeta,
  DataFlowMeta,
  ValidationError,
} from "../../types";

export class ServiceRegistry {
  private services = new Map<string, ServiceDefinition>();

  constructor() {
    this.initializeDefaultServices();
  }

  private initializeDefaultServices(): void {
    const defaultServices: ServiceDefinition[] = [
      // Shopify Source
      {
        id: "ecommerce-shopify",
        name: "Shopify Store",
        category: "source",
        version: "2024.01",
        protocol: "rest",
        authentication: {
          type: "api_key",
          fields: [
            {
              name: "store_url",
              type: "url",
              label: "Store URL",
              required: true,
              description: "Your Shopify store URL",
              placeholder: "mystore.myshopify.com",
              validation: ["url"],
            },
            {
              name: "access_token",
              type: "password",
              label: "Access Token",
              required: true,
              description: "Private app access token",
              validation: ["min:32"],
            },
          ],
        },
        capabilities: [
          {
            operation: "read",
            resources: ["orders", "products", "customers", "inventory"],
            constraints: [
              {
                type: "rate_limit",
                value: 2,
                description: "2 requests per second",
              },
            ],
          },
        ],
        connectionSpec: {
          fields: [
            {
              name: "store_url",
              type: "string",
              required: true,
              validation: ["url"],
              group: "connection",
            },
            {
              name: "access_token",
              type: "string",
              required: true,
              group: "authentication",
            },
            {
              name: "resources",
              type: "multiselect",
              label: "Data to Extract",
              required: true,
              options: ["orders", "products", "customers"],
              defaultValue: ["orders"],
              group: "configuration",
            },
          ],
        },
        metadata: {
          vendor: "Shopify",
          category: "E-commerce",
          icon: "🛍️",
          description:
            "Extract orders, products, and customer data from Shopify stores",
          tags: ["ecommerce", "retail", "shopify"],
          documentation: "https://shopify.dev/api/admin-rest",
          popularity: 95,
        },
      },

      // Salesforce CRM
      {
        id: "crm-salesforce",
        name: "Salesforce CRM",
        category: "source",
        version: "59.0",
        protocol: "rest",
        authentication: {
          type: "oauth2",
          fields: [
            {
              name: "instance_url",
              type: "url",
              label: "Instance URL",
              required: true,
              description: "Your Salesforce instance URL",
            },
            {
              name: "client_id",
              type: "string",
              label: "Client ID",
              required: true,
              description: "Connected App Client ID",
            },
            {
              name: "client_secret",
              type: "password",
              label: "Client Secret",
              required: true,
              description: "Connected App Client Secret",
            },
          ],
        },
        capabilities: [
          {
            operation: "read",
            resources: ["Account", "Contact", "Lead", "Opportunity"],
            constraints: [
              {
                type: "daily_api_limit",
                value: 15000,
                description: "Daily API limit",
              },
            ],
          },
        ],
        connectionSpec: {
          fields: [
            {
              name: "instance_url",
              type: "string",
              required: true,
              group: "connection",
            },
            {
              name: "client_id",
              type: "string",
              required: true,
              group: "authentication",
            },
            {
              name: "objects",
              type: "multiselect",
              label: "Salesforce Objects",
              required: true,
              options: ["Contact", "Lead", "Opportunity", "Account"],
              defaultValue: ["Contact"],
              group: "configuration",
            },
          ],
        },
        metadata: {
          vendor: "Salesforce",
          category: "CRM",
          icon: "👥",
          description: "Extract CRM data from Salesforce",
          tags: ["crm", "sales", "salesforce"],
          popularity: 90,
        },
      },

      // MySQL Database
      {
        id: "database-mysql",
        name: "MySQL Database",
        category: "source",
        version: "8.0",
        protocol: "database",
        authentication: {
          type: "basic",
          fields: [
            {
              name: "host",
              type: "string",
              label: "Host",
              required: true,
              description: "MySQL server hostname",
            },
            {
              name: "username",
              type: "string",
              label: "Username",
              required: true,
              description: "MySQL username",
            },
            {
              name: "password",
              type: "password",
              label: "Password",
              required: true,
              description: "MySQL password",
            },
          ],
        },
        capabilities: [
          {
            operation: "read",
            resources: ["tables", "views"],
            constraints: [],
          },
        ],
        connectionSpec: {
          fields: [
            {
              name: "host",
              type: "string",
              required: true,
              group: "connection",
            },
            {
              name: "database",
              type: "string",
              required: true,
              group: "connection",
            },
            {
              name: "username",
              type: "string",
              required: true,
              group: "authentication",
            },
          ],
        },
        metadata: {
          vendor: "Oracle",
          category: "Database",
          icon: "🗄️",
          description: "Connect to MySQL databases",
          tags: ["database", "mysql"],
          popularity: 90,
        },
      },

      // Snowflake Destination
      {
        id: "warehouse-snowflake",
        name: "Snowflake Data Warehouse",
        category: "destination",
        version: "1.0",
        protocol: "database",
        authentication: {
          type: "basic",
          fields: [
            {
              name: "account",
              type: "string",
              label: "Account",
              required: true,
              description: "Snowflake account identifier",
            },
            {
              name: "username",
              type: "string",
              label: "Username",
              required: true,
              description: "Snowflake username",
            },
            {
              name: "password",
              type: "password",
              label: "Password",
              required: true,
              description: "Snowflake password",
            },
          ],
        },
        capabilities: [
          {
            operation: "write",
            resources: ["tables", "stages"],
            constraints: [],
          },
        ],
        connectionSpec: {
          fields: [
            {
              name: "account",
              type: "string",
              required: true,
              group: "connection",
            },
            {
              name: "database",
              type: "string",
              required: true,
              group: "connection",
            },
            {
              name: "schema",
              type: "string",
              defaultValue: "PUBLIC",
              required: true,
              group: "connection",
            },
          ],
        },
        metadata: {
          vendor: "Snowflake",
          category: "Data Warehouse",
          icon: "❄️",
          description: "Load data into Snowflake",
          tags: ["warehouse", "snowflake", "analytics"],
          popularity: 92,
        },
      },

      // BigQuery Destination
      {
        id: "warehouse-bigquery",
        name: "Google BigQuery",
        category: "destination",
        version: "1.0",
        protocol: "rest",
        authentication: {
          type: "oauth2",
          fields: [
            {
              name: "project_id",
              type: "string",
              label: "Project ID",
              required: true,
              description: "Google Cloud Project ID",
            },
          ],
        },
        capabilities: [
          {
            operation: "write",
            resources: ["tables", "views"],
            constraints: [],
          },
        ],
        connectionSpec: {
          fields: [
            {
              name: "project_id",
              type: "string",
              required: true,
              group: "connection",
            },
            {
              name: "dataset_id",
              type: "string",
              required: true,
              group: "connection",
            },
          ],
        },
        metadata: {
          vendor: "Google",
          category: "Data Warehouse",
          icon: "📊",
          description: "Load data into Google BigQuery",
          tags: ["warehouse", "bigquery", "google"],
          popularity: 88,
        },
      },

      // Transform Services
      {
        id: "transform-filter",
        name: "Data Filter",
        category: "transform",
        version: "1.0",
        protocol: "rest",
        authentication: {
          type: "api_key",
          fields: [],
        },
        capabilities: [
          {
            operation: "transform",
            resources: ["records"],
            constraints: [],
          },
        ],
        connectionSpec: {
          fields: [
            {
              name: "filter_conditions",
              type: "json",
              label: "Filter Conditions",
              required: true,
              group: "configuration",
            },
          ],
        },
        metadata: {
          category: "Data Processing",
          icon: "🔍",
          description: "Filter records based on conditions",
          tags: ["transform", "filter"],
          popularity: 95,
        },
      },

      {
        id: "transform-map",
        name: "Field Mapping",
        category: "transform",
        version: "1.0",
        protocol: "rest",
        authentication: {
          type: "api_key",
          fields: [],
        },
        capabilities: [
          {
            operation: "transform",
            resources: ["fields"],
            constraints: [],
          },
        ],
        connectionSpec: {
          fields: [
            {
              name: "mapping_rules",
              type: "json",
              label: "Mapping Rules",
              required: true,
              group: "configuration",
            },
          ],
        },
        metadata: {
          category: "Data Processing",
          icon: "🗺️",
          description: "Map and transform data fields",
          tags: ["transform", "mapping"],
          popularity: 90,
        },
      },

      {
        id: "transform-aggregate",
        name: "Data Aggregation",
        category: "transform",
        version: "1.0",
        protocol: "rest",
        authentication: {
          type: "api_key",
          fields: [],
        },
        capabilities: [
          {
            operation: "transform",
            resources: ["records"],
            constraints: [],
          },
        ],
        connectionSpec: {
          fields: [
            {
              name: "aggregations",
              type: "json",
              label: "Aggregation Functions",
              required: true,
              group: "configuration",
            },
          ],
        },
        metadata: {
          category: "Data Processing",
          icon: "📊",
          description: "Aggregate data using statistical functions",
          tags: ["transform", "aggregate"],
          popularity: 85,
        },
      },
    ];

    defaultServices.forEach((service) => {
      this.services.set(service.id, service);
    });
  }

  // Service Registry Methods
  getAllServices(): ServiceDefinition[] {
    return Array.from(this.services.values());
  }

  getServicesByCategory(category: string): ServiceDefinition[] {
    return Array.from(this.services.values()).filter(
      (service) => service.category === category,
    );
  }

  getServiceById(id: string): ServiceDefinition | undefined {
    return this.services.get(id);
  }

  getServiceCapabilities(serviceId: string): ServiceCapability[] {
    const service = this.services.get(serviceId);
    return service?.capabilities || [];
  }

  searchServices(query: string): ServiceDefinition[] {
    const lowercaseQuery = query.toLowerCase();
    return Array.from(this.services.values()).filter((service) => {
      return (
        service.name.toLowerCase().includes(lowercaseQuery) ||
        service.metadata.description.toLowerCase().includes(lowercaseQuery) ||
        service.metadata.tags?.some((tag) =>
          tag.toLowerCase().includes(lowercaseQuery),
        ) ||
        service.metadata.vendor?.toLowerCase().includes(lowercaseQuery)
      );
    });
  }

  // Enhanced Node Creation Methods
  createNodeFromService(
    serviceId: string,
    position: Vector2,
    index: number = 0,
    overrides: Partial<Node> = {},
  ): Node {
    const service = this.services.get(serviceId);
    if (!service) {
      throw new Error(`Service ${serviceId} not found`);
    }

    const nodeId = overrides.id || `${serviceId}_${Date.now()}_${index}`;
    const baseNode: Node = {
      id: nodeId,
      kind: service.category,
      label: overrides.label || service.name,
      position,
      size: this.getDefaultNodeSize(service.category),
      status: "pending",
      color: overrides.color || this.getServiceColor(service.category),
      icon: overrides.icon || this.getServiceIcon(service),
      locked: overrides.locked || false,
      hidden: overrides.hidden || false,
      serviceId,
      inputs: this.getNodeInputs(service.category),
      outputs: this.getNodeOutputs(service.category),
      configuration: {
        connection: {},
        operation: {
          type:
            service.category === "source"
              ? "extract"
              : service.category === "destination"
                ? "load"
                : "transform",
          parameters: {},
        },
      },
      meta: this.createNodeMeta(service),
      ...overrides,
    };

    return baseNode;
  }

  createFlowEdge(
    fromNodeId: string,
    toNodeId: string,
    index: number = 0,
    options: Partial<FlowEdge> = {},
  ): FlowEdge {
    return {
      id: options.id || `edge_${fromNodeId}_${toNodeId}_${index}`,
      fromNodeId,
      toNodeId,
      fromPort: options.fromPort || "output",
      toPort: options.toPort || "input",
      label: options.label || `Data Flow ${index + 1}`,
      dashed: options.dashed || false,
      color: options.color || "#94A3B8",
      animated: options.animated || false,
      type: options.type || "default",
      meta: {
        dataType: "records",
        recordCount: Math.floor(Math.random() * 10000) + 100,
        bandwidth: Math.floor(Math.random() * 1000) + 100,
        latency: Math.floor(Math.random() * 100) + 10,
        errorRate: Math.random() * 0.05,
        createdAt: new Date().toISOString(),
        ...options.meta,
      } as DataFlowMeta,
      ...options,
    };
  }

  // Helper Methods
  private getDefaultNodeSize(category: string): Size {
    const sizeMap = {
      source: { width: 180, height: 80 },
      destination: { width: 180, height: 80 },
      transform: { width: 160, height: 70 },
      compute: { width: 160, height: 70 },
    };
    return (
      sizeMap[category as keyof typeof sizeMap] || { width: 160, height: 70 }
    );
  }

  private getServiceColor(category: string): string {
    const colorMap = {
      source: "#3B82F6",
      destination: "#10B981",
      transform: "#8B5CF6",
      compute: "#F59E0B",
    };
    return colorMap[category as keyof typeof colorMap] || "#6B7280";
  }

  private getServiceIcon(service: ServiceDefinition): string {
    return service.metadata.icon;
  }

  private getNodeInputs(category: string): string[] {
    const inputMap = {
      source: [],
      destination: ["data"],
      transform: ["input"],
      compute: ["input"],
    };
    return inputMap[category as keyof typeof inputMap] || [];
  }

  private getNodeOutputs(category: string): string[] {
    const outputMap = {
      source: ["data"],
      destination: [],
      transform: ["output"],
      compute: ["result"],
    };
    return outputMap[category as keyof typeof outputMap] || [];
  }

  private createNodeMeta(service: ServiceDefinition): Record<string, unknown> {
    const baseMeta = {
      serviceType: service.id,
      vendor: service.metadata.vendor,
      version: service.version,
      tags: service.metadata.tags,
      capabilities: service.capabilities.map((c) => c.operation),
      createdAt: new Date().toISOString(),
      popularity: service.metadata.popularity || 50,
    };

    switch (service.category) {
      case "source":
        return {
          ...baseMeta,
          extractionRate: Math.floor(Math.random() * 1000) + 100,
          recordCount: Math.floor(Math.random() * 100000) + 1000,
          lastExtracted: new Date(
            Date.now() - Math.random() * 86400000,
          ).toISOString(),
          connectionHealth: "healthy",
        } as SourceNodeMeta;

      case "transform":
        return {
          ...baseMeta,
          transformationType: "filter",
          performance: {
            avgProcessingTime: Math.floor(Math.random() * 500) + 50,
            throughput: Math.floor(Math.random() * 10000) + 1000,
            memoryUsage: Math.floor(Math.random() * 512) + 128,
          },
          complexity: "medium",
        } as TransformNodeMeta;

      case "destination":
        return {
          ...baseMeta,
          loadStrategy: "append",
          batchSize: 1000,
          lastLoaded: new Date(
            Date.now() - Math.random() * 86400000,
          ).toISOString(),
          totalRecordsLoaded: Math.floor(Math.random() * 1000000) + 10000,
        } as DestinationNodeMeta;

      default:
        return baseMeta;
    }
  }
}

export default ServiceRegistry;
