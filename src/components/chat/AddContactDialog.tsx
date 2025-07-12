
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserPlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AddContactDialogProps {
  onContactAdded: (contact: any) => void;
}

const AddContactDialog: React.FC<AddContactDialogProps> = ({ onContactAdded }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const handleAddContact = async () => {
    if (!firstName.trim() || !lastName.trim() || !phone.trim()) {
      toast({
        title: "Error",
        description: "Mohon isi semua field",
        variant: "destructive"
      });
      return;
    }
    
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newContact = {
        id: Date.now().toString(),
        name: `${firstName} ${lastName}`,
        phone: phone,
        status: 'offline' as const,
        avatar: firstName[0]?.toUpperCase() || '?',
        isFamily: false,
      };
      
      onContactAdded(newContact);
      
      toast({
        title: "Berhasil!",
        description: `Kontak ${firstName} ${lastName} berhasil ditambahkan`,
      });
      
      setFirstName("");
      setLastName("");
      setPhone("");
      setOpen(false);
      
    } catch (error: any) {
      console.error('Error adding contact:', error);
      toast({
        title: "Error",
        description: "Gagal menambahkan kontak",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="text-white hover:bg-white/20 p-2"
        >
          <UserPlus className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Tambah Kontak Baru</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">Nama Depan</Label>
              <Input
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Nama depan"
              />
            </div>
            <div>
              <Label htmlFor="lastName">Nama Belakang</Label>
              <Input
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Nama belakang"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="contactPhone">Nomor Telepon</Label>
            <Input
              id="contactPhone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+62 812-3456-7890"
            />
          </div>
          <Button 
            onClick={handleAddContact} 
            disabled={!firstName.trim() || !lastName.trim() || !phone.trim() || loading}
            className="w-full"
          >
            {loading ? "Menambahkan..." : "Tambah Kontak"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddContactDialog;
