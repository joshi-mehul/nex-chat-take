import { getOrCreateSessionId } from "@utils/session";
import axios from "axios";

const API_BASE_URL = "http://localhost:3001/api";

// Axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add session ID to all requests
api.interceptors.request.use((config) => {
  const sessionId = getOrCreateSessionId();
  if (sessionId) {
    config.headers["X-Session-ID"] = sessionId;
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  },
);

// Service Registry API
export const servicesAPI = {
  getAllServices: () =>
    api.get("/services/registry").then((res) => res.data.data),

  getServicesByCategory: (category: string) =>
    api
      .get(`/services/registry/category/${category}`)
      .then((res) => res.data.data),

  getServiceById: (serviceId: string) =>
    api.get(`/services/registry/${serviceId}`).then((res) => res.data.data),

  getServiceCapabilities: (serviceId: string) =>
    api
      .get(`/services/registry/${serviceId}/capabilities`)
      .then((res) => res.data.data),

  testServiceConnection: (serviceId: string, configuration: any) =>
    api
      .post(`/services/${serviceId}/test`, { configuration })
      .then((res) => res.data.data),

  searchServices: (query: string) =>
    api
      .get(`/services/search?q=${encodeURIComponent(query)}`)
      .then((res) => res.data.data),
};

// Conversation API
export const conversationAPI = {
  createConversation: (initialPrompt: string, sessionId: string) =>
    api
      .post("/conversations", { initialPrompt, sessionId })
      .then((res) => res.data.data),

  getConversation: (conversationId: string) =>
    api.get(`/conversations/${conversationId}`).then((res) => res.data.data),

  addMessage: (conversationId: string, content: string) =>
    api
      .post(`/conversations/${conversationId}/messages`, { content })
      .then((res) => res.data.data),
};

// Pipeline API
export const pipelineAPI = {
  createPipeline: (pipelineData: any) =>
    api.post("/pipelines", pipelineData).then((res) => res.data.data),

  getPipeline: (pipelineId: string) =>
    api.get(`/pipelines/${pipelineId}`).then((res) => res.data.data),

  updatePipeline: (pipelineId: string, updates: any) =>
    api.put(`/pipelines/${pipelineId}`, updates).then((res) => res.data.data),

  validatePipeline: (pipelineId: string) =>
    api.post(`/pipelines/${pipelineId}/validate`).then((res) => res.data.data),

  updateNode: (pipelineId: string, nodeId: string, updates: any) =>
    api
      .put(`/pipelines/${pipelineId}/nodes/${nodeId}`, updates)
      .then((res) => res.data.data),
};

// AI Processing API
export const aiAPI = {
  parseIntent: (naturalLanguage: string, context?: any) =>
    api
      .post("/ai/parse-intent", { naturalLanguage, context })
      .then((res) => res.data.data),

  clarify: (
    intentId: string,
    partialConfiguration: any,
    serviceConstraints: any,
  ) =>
    api
      .post("/ai/clarify", {
        intentId,
        partialConfiguration,
        serviceConstraints,
      })
      .then((res) => res.data.data),
};

export default api;
