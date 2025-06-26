
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Bell, Send, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface NotificationDialogProps {
  deviceName: string;
  userName: string;
  userEmail?: string;
}

const NotificationDialog: React.FC<NotificationDialogProps> = ({
  deviceName,
  userName,
  userEmail
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState(userEmail || '');
  const [message, setMessage] = useState(`${userName}, mohon perhatikan penggunaan device Anda!`);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSendNotification = async () => {
    if (!email.trim() || !message.trim()) {
      toast({
        title: "Error",
        description: "Email dan pesan harus diisi",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/functions/v1/send-notification-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: email,
          message,
          deviceName,
          userName
        }),
      });

      if (!response.ok) {
        throw new Error('Gagal mengirim email');
      }

      toast({
        title: "Berhasil!",
        description: `Notifikasi berhasil dikirim ke ${email}`,
      });

      setIsOpen(false);
    } catch (error) {
      console.error('Error sending notification:', error);
      toast({
        title: "Error",
        description: "Gagal mengirim notifikasi email",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Bell className="h-4 w-4 mr-1" />
          Kirim Notifikasi
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Kirim Notifikasi Email
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email Tujuan</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@example.com"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="message">Pesan Notifikasi</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tulis pesan notifikasi..."
              rows={4}
            />
          </div>
          <div className="bg-gray-50 p-3 rounded-lg text-sm">
            <p><strong>Pengguna:</strong> {userName}</p>
            <p><strong>Perangkat:</strong> {deviceName}</p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={handleSendNotification}
              disabled={loading}
              className="flex-1"
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <Send className="mr-2 h-4 w-4" />
              Kirim Email
            </Button>
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={loading}
            >
              Batal
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NotificationDialog;
