
import ChatMessage from '@/components/ChatMessage';
import EmptyState from '@/components/ui/EmptyState';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Users, MessageCircle } from 'lucide-react';
import { useEffect, useRef, useCallback } from 'react';

interface ChatMessagesProps {
  messages: any[];
  messagesLoading: boolean;
  currentUserId: string;
}

export default function ChatMessages({
  messages,
  messagesLoading,
  currentUserId,
}: ChatMessagesProps) {
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Optimized scroll function with useCallback
  const scrollToBottom = useCallback(() => {
    if (scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current.querySelector(
        '[data-radix-scroll-area-viewport]'
      );
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight;
      }
    }
  }, []);

  // Auto scroll to bottom when new messages arrive (debounced)
  useEffect(() => {
    const timeoutId = setTimeout(scrollToBottom, 100);
    return () => clearTimeout(timeoutId);
  }, [messages.length, scrollToBottom]);

  if (messagesLoading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50/50 dark:bg-gray-900/50">
        <div className="flex flex-col items-center gap-3 p-8">
          <div className="relative">
            <div className="w-8 h-8 rounded-full border-3 border-blue-200 dark:border-blue-800"></div>
            <div className="absolute inset-0 w-8 h-8 rounded-full border-3 border-blue-500 border-t-transparent animate-spin"></div>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Memuat pesan...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col justify-end bg-gradient-to-b from-gray-50/30 to-white dark:from-gray-900/30 dark:to-gray-900">
      <ScrollArea className="flex-1 p-3" ref={scrollAreaRef}>
        <div className="space-y-3 min-h-full flex flex-col justify-end">
          {messages.length > 0 ? (
            messages.map((message) => (
              <ChatMessage
                key={message.id}
                message={message}
                currentUserId={currentUserId}
              />
            ))
          ) : (
            <div className="flex-1 flex items-center justify-center py-16">
              <EmptyState
                icon={MessageCircle}
                title="Belum ada percakapan"
                description="Mulai chat dengan mengirim pesan pertama!"
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg border-0 max-w-xs"
              />
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
