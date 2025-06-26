
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Paperclip, X } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (message: string, fileUrl?: string, fileType?: string, fileName?: string) => void;
  onUploadFile: (file: File) => Promise<{ url: string; name: string; type: string } | null>;
  onTyping?: () => void;
  onStopTyping?: () => void;
  disabled?: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  onUploadFile,
  onTyping,
  onStopTyping,
  disabled = false
}) => {
  const [message, setMessage] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
    
    // Trigger typing indicator
    if (onTyping) {
      onTyping();
      
      // Clear existing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      
      // Stop typing after 1 second of inactivity
      typingTimeoutRef.current = setTimeout(() => {
        if (onStopTyping) {
          onStopTyping();
        }
      }, 1000);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (onStopTyping) {
      onStopTyping();
    }
    
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    if (!message.trim() && !selectedFile) return;

    try {
      let fileUrl, fileType, fileName;
      
      if (selectedFile) {
        setIsUploading(true);
        const uploadResult = await onUploadFile(selectedFile);
        if (uploadResult) {
          fileUrl = uploadResult.url;
          fileType = uploadResult.type;
          fileName = uploadResult.name;
        }
        setIsUploading(false);
        setSelectedFile(null);
      }

      await onSendMessage(message, fileUrl, fileType, fileName);
      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      setIsUploading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        alert('File terlalu besar. Maksimal 10MB.');
        return;
      }
      setSelectedFile(file);
    }
  };

  const removeSelectedFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="p-4 space-y-2">
      {selectedFile && (
        <div className="flex items-center gap-2 p-2 bg-gray-100 rounded-lg">
          <Paperclip className="h-4 w-4 text-gray-500" />
          <span className="text-sm text-gray-700 flex-1 truncate">
            {selectedFile.name}
          </span>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={removeSelectedFile}
            className="h-6 w-6 p-0"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="flex-1 flex gap-2">
          <Input
            type="text"
            value={message}
            onChange={handleInputChange}
            placeholder="Ketik pesan..."
            disabled={disabled || isUploading}
            className="flex-1"
          />
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileSelect}
            className="hidden"
            accept="image/*,video/*,.pdf,.doc,.docx,.txt"
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled || isUploading}
            className="px-3"
          >
            <Paperclip className="h-4 w-4" />
          </Button>
        </div>
        <Button
          type="submit"
          disabled={disabled || isUploading || (!message.trim() && !selectedFile)}
          size="sm"
          className="px-4"
        >
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
};

export default ChatInput;
