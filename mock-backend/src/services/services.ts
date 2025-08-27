import express from "express";
import { MockDataStore } from "../services/MockDataStore";

const router = express.Router();

// Get all services in registry
router.get("/registry", (req, res) => {
  try {
    const mockDataStore: MockDataStore = req.app.locals.mockDataStore;
    const serviceRegistry = mockDataStore.getServiceRegistry();
    const services = serviceRegistry.getAllServices();

    res.json({
      success: true,
      data: services,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: "REGISTRY_ERROR",
        message: "Failed to fetch services",
        timestamp: new Date().toISOString(),
      },
    });
  }
});

// Get services by category
router.get("/registry/category/:category", (req, res) => {
  try {
    const { category } = req.params;
    const mockDataStore: MockDataStore = req.app.locals.mockDataStore;
    const serviceRegistry = mockDataStore.getServiceRegistry();
    const services = serviceRegistry.getServicesByCategory(category);

    res.json({
      success: true,
      data: services,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: "REGISTRY_ERROR",
        message: "Failed to fetch services by category",
        timestamp: new Date().toISOString(),
      },
    });
  }
});

// Get specific service details
router.get("/registry/:serviceId", (req, res) => {
  try {
    const { serviceId } = req.params;
    const mockDataStore: MockDataStore = req.app.locals.mockDataStore;
    const serviceRegistry = mockDataStore.getServiceRegistry();
    const service = serviceRegistry.getServiceById(serviceId);

    if (!service) {
      return res.status(404).json({
        success: false,
        error: {
          code: "SERVICE_NOT_FOUND",
          message: "Service not found",
          timestamp: new Date().toISOString(),
        },
      });
    }

    res.json({
      success: true,
      data: service,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: "REGISTRY_ERROR",
        message: "Failed to fetch service details",
        timestamp: new Date().toISOString(),
      },
    });
  }
});

// Get service capabilities
router.get("/registry/:serviceId/capabilities", (req, res) => {
  try {
    const { serviceId } = req.params;
    const mockDataStore: MockDataStore = req.app.locals.mockDataStore;
    const serviceRegistry = mockDataStore.getServiceRegistry();
    const capabilities = serviceRegistry.getServiceCapabilities(serviceId);

    res.json({
      success: true,
      data: capabilities,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: "REGISTRY_ERROR",
        message: "Failed to fetch service capabilities",
        timestamp: new Date().toISOString(),
      },
    });
  }
});

// Search services
router.get("/search", (req, res) => {
  try {
    const { q } = req.query;
    if (!q || typeof q !== "string") {
      return res.status(400).json({
        success: false,
        error: {
          code: "INVALID_QUERY",
          message: "Search query is required",
          timestamp: new Date().toISOString(),
        },
      });
    }

    const mockDataStore: MockDataStore = req.app.locals.mockDataStore;
    const serviceRegistry = mockDataStore.getServiceRegistry();
    const services = serviceRegistry.searchServices(q);

    res.json({
      success: true,
      data: services,
      query: q,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: "SEARCH_ERROR",
        message: "Failed to search services",
        timestamp: new Date().toISOString(),
      },
    });
  }
});

// Test service connection
router.post("/:serviceId/test", async (req, res) => {
  try {
    const { serviceId } = req.params;
    const { configuration } = req.body;

    const mockDataStore: MockDataStore = req.app.locals.mockDataStore;

    // Simulate connection testing delay
    await new Promise((resolve) =>
      setTimeout(resolve, 1000 + Math.random() * 2000),
    );

    const result = mockDataStore.testNodeConnection(serviceId, configuration);

    res.json({
      success: true,
      data: result,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: "CONNECTION_TEST_ERROR",
        message: "Failed to test service connection",
        timestamp: new Date().toISOString(),
      },
    });
  }
});

export default router;
