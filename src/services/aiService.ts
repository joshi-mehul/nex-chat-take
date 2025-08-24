export const sendMessageToAI = async (
  message: string,
  mode?: string,
  resolveImmediate: boolean = false,
): Promise<string> => {
  // Simulate API delay
  await new Promise((resolve) =>
    setTimeout(resolve, resolveImmediate ? 0 : 1000 + Math.random() * 2000),
  );

  // Mock responses based on mode
  const responses = {
    creative: [
      "That's a fascinating creative concept! Let me help you develop that idea further...",
      "I love the creative direction you're taking. Here are some ways to expand on that...",
      "Your imagination is wonderful! Let's explore this creative path together...",
    ],
    coding: [
      "Great coding question! Here's how I'd approach this problem...",
      "Let me break down this technical concept for you...",
      "That's a common programming challenge. Here's a clean solution...",
    ],
    learning: [
      "Excellent question! Let me explain this step by step...",
      "That's a great topic to explore. Here's what you need to know...",
      "I'm happy to help you understand this concept better...",
    ],
    business: [
      "From a business perspective, here's what I'd recommend...",
      "That's a strategic question. Let me share some insights...",
      "Great business thinking! Here's how you might approach this...",
    ],
    general: [
      "That's an interesting question! Here's what I think...",
      "I'm happy to help with that. Let me share my thoughts...",
      "Thanks for asking! Here's my perspective on that...",
    ],
  };

  const modeResponses =
    responses[mode as keyof typeof responses] || responses.general;
  const randomResponse =
    modeResponses[Math.floor(Math.random() * modeResponses.length)];

  // Occasionally simulate an error
  if (Math.random() < 0.05) {
    throw new Error(
      "Sorry, I encountered an error processing your request. Please try again.",
    );
  }

  return `${randomResponse}\n\nRegarding "${message}" - this is a mock response that demonstrates the AI service integration. In a real implementation, this would connect to your actual AI API endpoint.`;
};
