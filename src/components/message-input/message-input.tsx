// components/MessageInput.tsx
import React, { useState, type KeyboardEvent, useCallback, memo, useRef, useEffect } from 'react';
import { Send, Paperclip, Mic } from 'lucide-react';

interface MessageInputProps {
  onSendMessage: (message: string) => Promise<void>;
  disabled: boolean;
}

const MessageInput: React.FC<MessageInputProps> = memo(({ onSendMessage, disabled }) => {
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [input]);

  const handleSubmit = useCallback(async () => {
    if (input.trim() && !disabled && !isSending) {
      setIsSending(true);
      try {
        await onSendMessage(input);
        setInput('');
      } finally {
        setIsSending(false);
      }
    }
  }, [input, disabled, isSending, onSendMessage]);

  const handleKeyPress = useCallback((e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  }, [handleSubmit]);

  const isDisabled = disabled || isSending || !input.trim();

  return (
    <div className="p-4">
      <div className="flex items-end gap-3 max-w-4xl mx-auto">
        {/* Attachment button */}
        <button
          className="p-2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors"
          title="Attach file"
        >
          <Paperclip className="w-5 h-5" />
        </button>

        {/* Input container */}
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message... (Press Enter to send, Shift+Enter for new line)"
            disabled={disabled || isSending}
            rows={1}
            className={`
              w-full px-4 py-3 pr-12 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 
              rounded-2xl resize-none transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent
              text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400
              disabled:bg-gray-50 dark:disabled:bg-gray-800 disabled:cursor-not-allowed
              scrollbar-thin
            `}
            style={{ minHeight: '48px', maxHeight: '120px' }}
          />
          
          {/* Character count */}
          {input.length > 0 && (
            <div className="absolute bottom-1 right-14 text-xs text-gray-400 dark:text-gray-500">
              {input.length}
            </div>
          )}
        </div>

        {/* Voice input button */}
        <button
          className="p-2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors"
          title="Voice input"
        >
          <Mic className="w-5 h-5" />
        </button>

        {/* Send button */}
        <button
          onClick={handleSubmit}
          disabled={isDisabled}
          className={`
            p-3 rounded-full transition-all duration-200 shadow-lg hover:shadow-xl
            ${isDisabled 
              ? 'bg-gray-300 dark:bg-gray-600 cursor-not-allowed' 
              : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 active:scale-95'
            }
          `}
          title="Send message"
        >
          <Send className={`w-5 h-5 ${isDisabled ? 'text-gray-500' : 'text-white'}`} />
        </button>
      </div>

      {/* Input hints */}
      <div className="flex justify-center mt-2">
        <p className="text-xs text-gray-400 dark:text-gray-500 text-center">
          AI can make mistakes. Verify important information.
        </p>
      </div>
    </div>
  );
});

MessageInput.displayName = 'MessageInput';

export default MessageInput;
