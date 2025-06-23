
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Paperclip, Smile, Image, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ChatInputProps {
  onSendMessage: (message: string, fileUrl?: string, fileType?: string, fileName?: string) => Promise<void>;
  onUploadFile?: (file: File) => Promise<{url: string, name: string, type: string} | null>;
  disabled?: boolean;
}

const emojis = ['😀', '😂', '😍', '🤔', '👍', '👎', '❤️', '😢', '😡', '🎉', '🔥', '💯'];

const ChatInput: React.FC<ChatInputProps> = ({ 
  onSendMessage, 
  onUploadFile,
  disabled = false 
}) => {
  const [message, setMessage] = useState('');
  const [showEmojis, setShowEmojis] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleSend = async () => {
    if (!message.trim()) return;
    
    try {
      await onSendMessage(message);
      setMessage('');
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal mengirim pesan",
        variant: "destructive"
      });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleEmojiClick = (emoji: string) => {
    setMessage(prev => prev + emoji);
    setShowEmojis(false);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !onUploadFile) return;

    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "Error",
        description: "File terlalu besar. Maksimal 10MB",
        variant: "destructive"
      });
      return;
    }

    setUploading(true);
    try {
      const uploadResult = await onUploadFile(file);
      if (uploadResult) {
        await onSendMessage('', uploadResult.url, uploadResult.type, uploadResult.name);
        toast({
          title: "Berhasil",
          description: "File berhasil dikirim"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal upload file",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="relative">
      {showEmojis && (
        <div className="absolute bottom-full left-0 mb-2 p-2 bg-white border border-gray-200 rounded-lg shadow-lg">
          <div className="grid grid-cols-6 gap-1">
            {emojis.map((emoji, index) => (
              <button
                key={index}
                onClick={() => handleEmojiClick(emoji)}
                className="p-1 hover:bg-gray-100 rounded text-lg"
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      )}
      
      <div className="flex items-center gap-2 p-2 bg-white border-t">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          accept="image/*,.pdf,.doc,.docx,.txt"
          className="hidden"
        />
        
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading || disabled}
        >
          <Paperclip className="h-4 w-4" />
        </Button>
        
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setShowEmojis(!showEmojis)}
          disabled={disabled}
        >
          <Smile className="h-4 w-4" />
        </Button>
        
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ketik pesan..."
          disabled={disabled || uploading}
          className="flex-1"
        />
        
        <Button
          onClick={handleSend}
          disabled={!message.trim() || disabled || uploading}
          size="sm"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default ChatInput;
