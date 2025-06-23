
import React from 'react';
import { Badge } from "@/components/ui/badge";
import ChatMessage from "@/components/ChatMessage";
import ChatInput from "@/components/ChatInput";

interface ChatViewProps {
  selectedGroup: any;
  messages: any[];
  user: any;
  onSendMessage: (message: string, fileUrl?: string, fileType?: string, fileName?: string) => Promise<void>;
  onUploadFile: (file: File) => Promise<any>;
}

const ChatView: React.FC<ChatViewProps> = ({
  selectedGroup,
  messages,
  user,
  onSendMessage,
  onUploadFile
}) => {
  return (
    <div className="flex flex-col h-full max-h-screen">
      <div className="flex items-center justify-between p-4 border-b bg-white">
        <h2 className="text-xl font-bold">Chat Grup</h2>
        {selectedGroup && (
          <Badge variant="secondary">{selectedGroup.name}</Badge>
        )}
      </div>

      {selectedGroup ? (
        <div className="flex flex-col flex-1 min-h-0">
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-1">
            {messages.map((message) => (
              <ChatMessage
                key={message.id}
                message={message}
                currentUserId={user?.id || ''}
              />
            ))}
            {messages.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">Belum ada pesan. Mulai percakapan!</p>
              </div>
            )}
          </div>
          
          {/* Chat Input */}
          <div className="border-t bg-white">
            <ChatInput
              onSendMessage={onSendMessage}
              onUploadFile={onUploadFile}
            />
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-500">Pilih grup untuk mulai chat</p>
        </div>
      )}
    </div>
  );
};

export default ChatView;
