import type { PredefinedPrompts, PredefinedPromptsState } from "@types/flow";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import {
  Database,
  GanttChartSquare,
  HelpingHand,
  MailCheck,
  Currency,
} from "lucide-react";

const defaultPrompts: PredefinedPrompts[] = [
  {
    id: "Shopify",
    title: "Connect Shopify to BigQuery",
    description: "Shopify to BigQuery setup and observe",
    icon: <Database />,
    prompt: "Shopify to BigQuery setup and observe",
  },
  {
    id: "Code",
    title: "Code Your way thru Nexla",
    description: "Get programming help for nexla intergrations",
    icon: <GanttChartSquare />,
    prompt: "Get programming help for nexla intergrations.",
  },
  {
    id: "Salesforce",
    title: "Sync Salesforce contacts to Mailchimp",
    description:
      "Salesforce contacts to Mailchimp, Start running your campaign",
    icon: <MailCheck />,
    prompt: "Salesforce contacts to Mailchimp, Start running your campaign.",
  },
  {
    id: "Stream",
    title: "Stream Stripe payments to Google Sheets",
    description: "Stripe payments to Google Sheets transactions or logs",
    icon: <Currency />,
    prompt: "Stripe payments to Google Sheets transactions or logs",
  },
  {
    id: "general",
    title: "Help",
    description: "Have a casual conversation about anything",
    icon: <HelpingHand />,
    prompt: "Have a casual conversation about anything",
  },
];

export const usePredefinedPrompts = create<PredefinedPromptsState>()(
  devtools(
    (set) => ({
      selectedPrompt: null,
      prompts: defaultPrompts,
      setSelectedPrompt: (prompt: PredefinedPrompts | null) =>
        set({ selectedPrompt: prompt }),
    }),
    {
      name: "prompt-store",
    },
  ),
);

// Selectors
export const useSelectedPrompt = () =>
  usePredefinedPrompts((state) => state.selectedPrompt);
export const usePrompts = () => usePredefinedPrompts((state) => state.prompts);
export const useSetSelectedMode = () =>
  usePredefinedPrompts((state) => state.setSelectedPrompt);
