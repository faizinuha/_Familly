
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Download, Image, FileText } from 'lucide-react';

interface ChatMessageProps {
  message: {
    id: string;
    message: string;
    sender_id: string;
    sender?: { full_name: string };
    created_at: string;
    is_system_notification?: boolean;
    file_url?: string;
    file_type?: string;
    file_name?: string;
    mentions?: string[];
  };
  currentUserId: string;
  onMentionClick?: (userId: string) => void;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ 
  message, 
  currentUserId, 
  onMentionClick 
}) => {
  const isMyMessage = message.sender_id === currentUserId;
  const isSystemMessage = message.is_system_notification;

  const formatMessage = (text: string) => {
    // Format mentions @username
    return text.replace(/@(\w+)/g, (match, username) => {
      return `<span class="bg-blue-100 text-blue-800 px-1 rounded cursor-pointer" onclick="handleMention('${username}')">${match}</span>`;
    });
  };

  const renderFilePreview = () => {
    if (!message.file_url) return null;

    const isImage = message.file_type?.startsWith('image/');
    
    return (
      <div className="mt-2">
        {isImage ? (
          <div className="relative">
            <img 
              src={message.file_url} 
              alt={message.file_name || 'Image'} 
              className="max-w-xs max-h-48 rounded-lg cursor-pointer"
              onClick={() => window.open(message.file_url, '_blank')}
            />
          </div>
        ) : (
          <div className="flex items-center gap-2 p-2 bg-gray-100 rounded-lg max-w-xs">
            <FileText className="h-4 w-4 text-gray-600" />
            <span className="text-sm truncate">{message.file_name}</span>
            <Button
              size="sm"
              variant="outline"
              onClick={() => window.open(message.file_url, '_blank')}
            >
              <Download className="h-3 w-3" />
            </Button>
          </div>
        )}
      </div>
    );
  };

  if (isSystemMessage) {
    return (
      <div className="flex justify-center my-2">
        <Badge variant="secondary" className="bg-yellow-50 border border-yellow-200 text-yellow-800">
          🔔 {message.message}
        </Badge>
      </div>
    );
  }

  return (
    <div className={`flex ${isMyMessage ? 'justify-end' : 'justify-start'} mb-3`}>
      <div className={`max-w-xs lg:max-w-md xl:max-w-lg`}>
        {!isMyMessage && (
          <div className="flex items-center gap-2 mb-1">
            <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-xs font-bold text-blue-700">
              {message.sender?.full_name?.[0]?.toUpperCase() || '?'}
            </div>
            <span className="text-xs text-gray-600 font-medium">
              {message.sender?.full_name || 'Unknown'}
            </span>
            <span className="text-xs text-gray-400">
              {new Date(message.created_at).toLocaleTimeString('id-ID', { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </span>
          </div>
        )}
        
        <div className={`p-3 rounded-2xl ${
          isMyMessage 
            ? 'bg-blue-500 text-white rounded-br-md' 
            : 'bg-gray-100 text-gray-900 rounded-bl-md'
        }`}>
          {message.message && (
            <div 
              className="text-sm leading-relaxed break-words"
              dangerouslySetInnerHTML={{ __html: formatMessage(message.message) }}
            />
          )}
          {renderFilePreview()}
        </div>
        
        {isMyMessage && (
          <div className="text-xs text-gray-400 text-right mt-1">
            {new Date(message.created_at).toLocaleTimeString('id-ID', { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
