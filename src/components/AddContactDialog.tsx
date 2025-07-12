
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserPlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface AddContactDialogProps {
  groupId: string | null;
  onContactAdded: () => void;
}

const AddContactDialog: React.FC<AddContactDialogProps> = ({ groupId, onContactAdded }) => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const handleAddContact = async () => {
    if (!email.trim() || !name.trim() || !groupId) return;
    
    setLoading(true);
    try {
      // Create invitation record for now - simplified approach
      const { error: inviteError } = await supabase.from('group_invitations').insert({
        group_id: groupId,
        email: email,
        invited_name: name,
        status: 'pending'
      });
      
      if (inviteError) throw inviteError;
      
      toast({
        title: "Undangan Terkirim",
        description: `Undangan telah dikirim ke ${email}`,
      });
      
      setEmail("");
      setName("");
      setOpen(false);
      onContactAdded();
      
    } catch (error: any) {
      console.error('Error adding contact:', error);
      toast({
        title: "Error",
        description: error.message || "Gagal menambahkan kontak",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <UserPlus className="h-4 w-4 mr-2" />
          Tambah Kontak
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tambah Kontak Baru</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="contactName">Nama</Label>
            <Input
              id="contactName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nama lengkap"
            />
          </div>
          <div>
            <Label htmlFor="contactEmail">Email</Label>
            <Input
              id="contactEmail"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@example.com"
            />
          </div>
          <Button 
            onClick={handleAddContact} 
            disabled={!email.trim() || !name.trim() || loading}
            className="w-full"
          >
            {loading ? "Mengirim..." : "Kirim Undangan"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddContactDialog;
