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

// File type whitelist for security
const ALLOWED_FILE_TYPES = [
  'image/jpeg',
  'image/jpg', 
  'image/png',
  'image/gif',
  'image/webp',
  'application/pdf',
  'text/plain',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
];

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

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
      await onSendMessage(message.trim());
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

  const validateFile = (file: File): boolean => {
    // Check file type
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      toast({
        title: "Error",
        description: "Tipe file tidak diizinkan. Hanya gambar, PDF, dan dokumen yang diperbolehkan.",
        variant: "destructive"
      });
      return false;
    }

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      toast({
        title: "Error",
        description: "File terlalu besar. Maksimal 10MB",
        variant: "destructive"
      });
      return false;
    }

    return true;
  };

  const sanitizeFileName = (fileName: string): string => {
    // Remove special characters and replace with safe characters
    return fileName.replace(/[^a-zA-Z0-9.-]/g, '_').substring(0, 100);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !onUploadFile) return;

    if (!validateFile(file)) {
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    setUploading(true);
    try {
      const uploadResult = await onUploadFile(file);
      if (uploadResult) {
        const sanitizedName = sanitizeFileName(uploadResult.name);
        await onSendMessage('', uploadResult.url, uploadResult.type, sanitizedName);
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
        <div className="absolute bottom-full left-0 mb-2 p-2 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
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
      
      <div className="flex items-center gap-2 p-4 bg-white border-t sticky bottom-0 z-20">
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
          className="flex-1 sticky-bottom-0 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          maxLength={1000}
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
