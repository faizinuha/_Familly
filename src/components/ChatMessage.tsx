
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Download, FileText, Image } from 'lucide-react';
import React, { memo } from 'react';

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

const ChatMessage: React.FC<ChatMessageProps> = memo(({
  message,
  currentUserId,
  onMentionClick,
}) => {
  const isMyMessage = message.sender_id === currentUserId;
  const isSystemMessage = message.is_system_notification;

  const formatMessage = (text: string) => {
    return text.replace(/@(\w+)/g, (match, username) => {
      return `<span class="bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300 px-2 py-0.5 rounded-full text-xs font-medium">${match}</span>`;
    });
  };

  const renderFilePreview = () => {
    if (!message.file_url) return null;

    const isImage = message.file_type?.startsWith('image/');

    return (
      <div className="mt-2">
        {isImage ? (
          <div className="relative group">
            <img
              src={message.file_url}
              alt={message.file_name || 'Image'}
              className="max-w-xs max-h-48 rounded-xl cursor-pointer transition-transform group-hover:scale-[1.02] shadow-sm"
              onClick={() => window.open(message.file_url, '_blank')}
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors rounded-xl pointer-events-none"></div>
          </div>
        ) : (
          <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl max-w-xs border border-gray-200/50 dark:border-gray-700/50">
            <div className="flex-shrink-0 w-8 h-8 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex items-center justify-center">
              <FileText className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate block">
                {message.file_name}
              </span>
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => window.open(message.file_url, '_blank')}
              className="flex-shrink-0 h-8 w-8 p-0 hover:bg-gray-200 dark:hover:bg-gray-700"
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
      <div className="flex justify-center my-3">
        <Badge
          variant="secondary"
          className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/50 text-amber-800 dark:text-amber-300 px-3 py-1.5 text-xs font-medium"
        >
          🔔 {message.message}
        </Badge>
      </div>
    );
  }

  const timeString = new Date(message.created_at).toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className={`flex ${isMyMessage ? 'justify-end' : 'justify-start'} mb-2`}>
      <div className="max-w-[75%] sm:max-w-xs">
        {!isMyMessage && (
          <div className="flex items-center gap-2 mb-1.5 px-1">
            <div className="w-5 h-5 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-bold text-white">
                {message.sender?.full_name?.[0]?.toUpperCase() || '?'}
              </span>
            </div>
            <span className="text-xs font-medium text-gray-700 dark:text-gray-300 truncate">
              {message.sender?.full_name || 'Unknown'}
            </span>
            <span className="text-xs text-gray-400 dark:text-gray-500 flex-shrink-0">
              {timeString}
            </span>
          </div>
        )}

        <div
          className={`relative p-3 rounded-2xl shadow-sm ${
            isMyMessage
              ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-br-md ml-2'
              : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-bl-md mr-2 border border-gray-200/50 dark:border-gray-700/50'
          }`}
        >
          {message.message && (
            <div
              className="text-sm leading-relaxed break-words"
              dangerouslySetInnerHTML={{
                __html: formatMessage(message.message),
              }}
            />
          )}
          {renderFilePreview()}
        </div>

        {isMyMessage && (
          <div className="text-xs text-gray-400 dark:text-gray-500 text-right mt-1 px-1">
            {timeString}
          </div>
        )}
      </div>
    </div>
  );
});

ChatMessage.displayName = 'ChatMessage';

export default ChatMessage;
