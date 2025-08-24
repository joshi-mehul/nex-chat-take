import type { ChatMode, ModeState } from "@types/flow";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

const defaultModes: ChatMode[] = [
  {
    id: "creative",
    title: "Creative Writing",
    description:
      "Get help with creative writing, storytelling, and brainstorming ideas",
    icon: "✍️",
    prompt:
      "Act as a creative writing assistant. Help me with storytelling, character development, and creative ideas.",
  },
  {
    id: "coding",
    title: "Code Assistant",
    description: "Get programming help, code reviews, and technical guidance",
    icon: "💻",
    prompt:
      "Act as a programming expert. Help me with coding questions, debugging, and best practices.",
  },
  {
    id: "learning",
    title: "Learning Tutor",
    description: "Explain complex topics and help you learn new subjects",
    icon: "📚",
    prompt:
      "Act as a patient tutor. Explain concepts clearly and help me understand complex topics.",
  },
  {
    id: "business",
    title: "Business Advisor",
    description:
      "Get advice on business strategy, marketing, and professional growth",
    icon: "📈",
    prompt:
      "Act as a business consultant. Provide strategic advice and professional insights.",
  },
  {
    id: "general",
    title: "General Chat",
    description: "Have a casual conversation about anything",
    icon: "💬",
    prompt: "Act as a helpful and friendly conversational AI assistant.",
  },
];

export const useModeStore = create<ModeState>()(
  devtools(
    (set) => ({
      selectedMode: null,
      modes: defaultModes,
      setSelectedMode: (mode: ChatMode | null) => set({ selectedMode: mode }),
    }),
    {
      name: "mode-store",
    },
  ),
);

// Selectors
export const useSelectedMode = () =>
  useModeStore((state) => state.selectedMode);
export const useModes = () => useModeStore((state) => state.modes);
export const useSetSelectedMode = () =>
  useModeStore((state) => state.setSelectedMode);
