import ChatMessage from '@/components/ChatMessage';
import EmptyState from '@/components/ui/EmptyState';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Users } from 'lucide-react';
import { useEffect, useRef } from 'react';

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

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current.querySelector(
        '[data-radix-scroll-area-viewport]'
      );
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight;
      }
    }
  }, [messages]);

  return (
    <div className="flex-1 flex flex-col justify-end">
      <ScrollArea className="p-4 bg-gray-50 flex-1" ref={scrollAreaRef}>
        <div className="space-y-4">
          {messagesLoading ? (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto"></div>
              <p className="text-sm text-gray-500 mt-2">Memuat pesan...</p>
            </div>
          ) : messages.length > 0 ? (
            messages.map((message) => (
              <ChatMessage
                key={message.id}
                message={message}
                currentUserId={currentUserId}
              />
            ))
          ) : (
            <div className="text-center py-12">
              <EmptyState
                icon={Users}
                title="Belum ada pesan"
                description="Mulai percakapan dengan anggota grup!"
                className="bg-white shadow-lg"
              />
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
