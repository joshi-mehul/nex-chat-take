import { servicesAPI } from "@services/apiClient";
import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

interface ServiceDefinition {
  id: string;
  name: string;
  category: "source" | "destination" | "transform" | "compute";
  metadata: {
    vendor?: string;
    icon: string;
    description: string;
    tags?: string[];
  };
  capabilities: Array<{
    operation: string;
    resources: string[];
  }>;
  connectionSpec: {
    fields: Array<{
      name: string;
      type: string;
      label?: string;
      required: boolean;
      defaultValue?: any;
      options?: string[];
    }>;
  };
}

interface ServicesState {
  services: ServiceDefinition[];
  filteredServices: ServiceDefinition[];
  loading: boolean;
  error: string | null;
  searchQuery: string;
  selectedCategory: string | null;

  // Actions
  loadServices: () => Promise<void>;
  searchServices: (query: string) => void;
  filterByCategory: (category: string | null) => void;
  getServiceById: (id: string) => ServiceDefinition | undefined;
  testServiceConnection: (
    serviceId: string,
    configuration: any,
  ) => Promise<any>;
}

export const useServicesStore = create<ServicesState>()(
  subscribeWithSelector((set, get) => ({
    services: [],
    filteredServices: [],
    loading: false,
    error: null,
    searchQuery: "",
    selectedCategory: null,

    loadServices: async () => {
      set({ loading: true, error: null });
      try {
        const services = await servicesAPI.getAllServices();
        set({
          services,
          filteredServices: services,
          loading: false,
        });
      } catch (error) {
        set({
          error:
            error instanceof Error ? error.message : "Failed to load services",
          loading: false,
        });
      }
    },

    searchServices: (query: string) => {
      set({ searchQuery: query });
      const { services, selectedCategory } = get();

      let filtered = services;

      // Apply category filter first
      if (selectedCategory) {
        filtered = filtered.filter(
          (service) => service.category === selectedCategory,
        );
      }

      // Apply search filter
      if (query.trim()) {
        const lowercaseQuery = query.toLowerCase();
        filtered = filtered.filter(
          (service) =>
            service.name.toLowerCase().includes(lowercaseQuery) ||
            service.metadata.description
              .toLowerCase()
              .includes(lowercaseQuery) ||
            service.metadata.vendor?.toLowerCase().includes(lowercaseQuery) ||
            service.metadata.tags?.some((tag) =>
              tag.toLowerCase().includes(lowercaseQuery),
            ),
        );
      }

      set({ filteredServices: filtered });
    },

    filterByCategory: (category: string | null) => {
      set({ selectedCategory: category });
      const { services, searchQuery } = get();

      let filtered = services;

      // Apply category filter
      if (category) {
        filtered = filtered.filter((service) => service.category === category);
      }

      // Apply existing search filter
      if (searchQuery.trim()) {
        const lowercaseQuery = searchQuery.toLowerCase();
        filtered = filtered.filter(
          (service) =>
            service.name.toLowerCase().includes(lowercaseQuery) ||
            service.metadata.description
              .toLowerCase()
              .includes(lowercaseQuery) ||
            service.metadata.vendor?.toLowerCase().includes(lowercaseQuery) ||
            service.metadata.tags?.some((tag) =>
              tag.toLowerCase().includes(lowercaseQuery),
            ),
        );
      }

      set({ filteredServices: filtered });
    },

    getServiceById: (id: string) => {
      return get().services.find((service) => service.id === id);
    },

    testServiceConnection: async (serviceId: string, configuration: any) => {
      try {
        return await servicesAPI.testServiceConnection(
          serviceId,
          configuration,
        );
      } catch (error) {
        throw error;
      }
    },
  })),
);
