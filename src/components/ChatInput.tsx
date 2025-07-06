import React, { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Paperclip, Smile, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import ImageEditor from './ImageEditor';
import MentionsList from './MentionsList';

interface ChatInputProps {
  onSendMessage: (message: string, fileUrl?: string, fileType?: string, fileName?: string) => Promise<void>;
  onUploadFile?: (file: File) => Promise<{url: string, name: string, type: string} | null>;
  disabled?: boolean;
  members?: any[];
}

const emojis = ['😀', '😂', '😍', '🤔', '👍', '👎', '❤️', '😢', '😡', '🎉', '🔥', '💯'];

const ALLOWED_FILE_TYPES = [
  'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp',
  'application/pdf', 'text/plain',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
];

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

const ChatInput: React.FC<ChatInputProps> = ({ 
  onSendMessage, 
  onUploadFile,
  disabled = false,
  members = []
}) => {
  const [message, setMessage] = useState('');
  const [showEmojis, setShowEmojis] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showImageEditor, setShowImageEditor] = useState(false);
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [showMentions, setShowMentions] = useState(false);
  const [mentionSearchTerm, setMentionSearchTerm] = useState('');
  const [cursorPosition, setCursorPosition] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleSend = useCallback(async () => {
    if (!message.trim()) return;
    
    try {
      await onSendMessage(message.trim());
      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Gagal mengirim pesan",
        variant: "destructive"
      });
    }
  }, [message, onSendMessage, toast]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (showMentions) {
        setShowMentions(false);
        return;
      }
      handleSend();
    }
    
    if (e.key === 'Escape' && showMentions) {
      setShowMentions(false);
    }
  }, [showMentions, handleSend]);

  const handleMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const position = e.target.selectionStart || 0;
    
    setMessage(value);
    setCursorPosition(position);
    
    const textBeforeCursor = value.substring(0, position);
    const mentionMatch = textBeforeCursor.match(/@(\w*)$/);
    
    if (mentionMatch && members.length > 0) {
      setMentionSearchTerm(mentionMatch[1]);
      setShowMentions(true);
    } else {
      setShowMentions(false);
      setMentionSearchTerm('');
    }
  };

  const handleMentionSelect = (member: any) => {
    const textBeforeCursor = message.substring(0, cursorPosition);
    const textAfterCursor = message.substring(cursorPosition);
    
    const mentionMatch = textBeforeCursor.match(/@(\w*)$/);
    if (mentionMatch) {
      const beforeMatch = textBeforeCursor.substring(0, mentionMatch.index);
      const newMessage = `${beforeMatch}@${member.profiles?.full_name || 'Unknown'} ${textAfterCursor}`;
      setMessage(newMessage);
      
      setTimeout(() => {
        if (inputRef.current) {
          const newPosition = beforeMatch.length + member.profiles?.full_name?.length + 2 || beforeMatch.length + 9;
          inputRef.current.setSelectionRange(newPosition, newPosition);
        }
      }, 0);
    }
    
    setShowMentions(false);
    setMentionSearchTerm('');
  };

  const handleEmojiClick = (emoji: string) => {
    setMessage(prev => prev + emoji);
    setShowEmojis(false);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const validateFile = (file: File): boolean => {
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      toast({
        title: "Error",
        description: "Tipe file tidak diizinkan. Hanya gambar, PDF, dan dokumen yang diperbolehkan.",
        variant: "destructive"
      });
      return false;
    }

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
    return fileName.replace(/[^a-zA-Z0-9.-]/g, '_').substring(0, 100);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !onUploadFile) return;

    if (!validateFile(file)) {
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    if (file.type.startsWith('image/')) {
      setSelectedImageFile(file);
      setShowImageEditor(true);
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
      console.error('Error uploading file:', error);
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

  const handleImageSave = async (editedFile: File) => {
    if (!onUploadFile) return;

    setUploading(true);
    try {
      const uploadResult = await onUploadFile(editedFile);
      if (uploadResult) {
        const sanitizedName = sanitizeFileName(uploadResult.name);
        await onSendMessage('', uploadResult.url, uploadResult.type, sanitizedName);
        toast({
          title: "Berhasil",
          description: "Foto berhasil dikirim"
        });
      }
    } catch (error) {
      console.error('Error uploading edited image:', error);
      toast({
        title: "Error",
        description: "Gagal upload foto",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
      setSelectedImageFile(null);
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 shadow-lg">
      <div className="max-w-md mx-auto">
        <MentionsList
          members={members}
          onMentionSelect={handleMentionSelect}
          visible={showMentions}
          searchTerm={mentionSearchTerm}
        />

        {showEmojis && (
          <div className="absolute bottom-full left-4 right-4 mb-2 p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-xl backdrop-blur-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Emoji</span>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setShowEmojis(false)}
                className="h-5 w-5 p-0"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
            <div className="grid grid-cols-6 gap-1">
              {emojis.map((emoji, index) => (
                <button
                  key={index}
                  onClick={() => handleEmojiClick(emoji)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-lg transition-colors"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        )}
        
        <div className="p-3">
          <div className="flex items-end gap-2 bg-gray-50 dark:bg-gray-800 rounded-2xl p-2 border border-gray-200 dark:border-gray-700">
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
              className="p-2 h-8 w-8 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              <Paperclip className="h-4 w-4" />
            </Button>
            
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setShowEmojis(!showEmojis)}
              disabled={disabled}
              className="p-2 h-8 w-8 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              <Smile className="h-4 w-4" />
            </Button>
            
            <Input
              ref={inputRef}
              value={message}
              onChange={handleMessageChange}
              onKeyPress={handleKeyPress}
              placeholder="Ketik pesan..."
              disabled={disabled || uploading}
              className="flex-1 bg-transparent border-0 focus-visible:ring-0 text-sm placeholder:text-gray-400 dark:placeholder:text-gray-500"
              maxLength={1000}
            />
            
            <Button
              onClick={handleSend}
              disabled={!message.trim() || disabled || uploading}
              size="sm"
              className="h-8 w-8 p-0 bg-blue-500 hover:bg-blue-600 text-white rounded-full"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <ImageEditor
          open={showImageEditor}
          onOpenChange={setShowImageEditor}
          imageFile={selectedImageFile}
          onSave={handleImageSave}
        />
      </div>
    </div>
  );
};

export default ChatInput;
