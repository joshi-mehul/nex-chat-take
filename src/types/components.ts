import type { Message } from "./flow";
import type { Field } from "./integrations";
import type { NodeType } from "./nodes";
import type { Connection } from "./pipeline";
import type { ValidationError } from "./validation";

// Landing Page Components
export interface LandingPageProps {
  onPromptSubmit?: (prompt: string) => void;
}

export interface ExamplePromptButtonProps {
  prompt: string;
  onClick: (prompt: string) => void;
  disabled?: boolean;
}

// Chat Components
export interface Chat {
  conversationId: string;
}

export interface MessageListProps {
  messages: Message[];
  isLoading?: boolean;
}

export interface MessageBubbleProps {
  message: Message;
  isUser: boolean;
}

export interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

// Canvas Components
export interface PipelineCanvasProps {
  conversationId?: string;
  pipelineId?: string;
  readonly?: boolean;
}

export interface NodeComponentProps {
  node: Node;
  isSelected?: boolean;
  onSelect?: (nodeId: string) => void;
  onUpdate?: (nodeId: string, updates: Partial<Node>) => void;
  onDelete?: (nodeId: string) => void;
  readonly?: boolean;
}

export interface ConnectionLineProps {
  connection: Connection;
  nodes: Node[];
  isSelected?: boolean;
  onSelect?: (connectionId: string) => void;
}

export interface PropertiesPanelProps {
  selectedNode?: Node;
  selectedConnection?: Connection;
  onNodeUpdate?: (nodeId: string, updates: Partial<Node>) => void;
  onConnectionUpdate?: (
    connectionId: string,
    updates: Partial<Connection>,
  ) => void;
}

// Form Components
export interface NodeConfigurationFormProps {
  node: Node;
  nodeType: NodeType;
  onUpdate: (updates: Partial<Node>) => void;
  validationErrors?: ValidationError[];
}

export interface FieldInputProps {
  field: Field;
  value: any;
  onChange: (value: any) => void;
  error?: string;
  disabled?: boolean;
}
