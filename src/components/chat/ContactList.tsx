import React, { useState } from 'react';
import { Phone, MessageCircle, User, Search, PhoneCall, Video, Mic } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import AddContactDialog from './AddContactDialog';
import ContactChat from './ContactChat';

interface Contact {
  id: string;
  name: string;
  phone: string;
  status: 'online' | 'offline' | 'busy';
  avatar: string;
  lastSeen?: string;
  isFamily?: boolean;
}

// Data contoh 3 kontak berbeda
const initialContacts: Contact[] = [
  {
    id: '1',
    name: 'Ayah',
    phone: '+62 812-3456-7890',
    status: 'online',
    avatar: '👨‍💼',
    isFamily: true,
  },
  {
    id: '2',
    name: 'Ibu',
    phone: '+62 813-9876-5432',
    status: 'busy',
    avatar: '👩‍💼',
    lastSeen: '2 menit yang lalu',
    isFamily: true,
  },
  {
    id: '3',
    name: 'Adik Sarah',
    phone: '+62 814-5555-1234',
    status: 'offline',
    avatar: '👧',
    lastSeen: '1 jam yang lalu',
    isFamily: true,
  },
];

const ContactList: React.FC = () => {
  const [contacts, setContacts] = useState<Contact[]>(initialContacts);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const { toast } = useToast();

  // Filter kontak berdasarkan pencarian
  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.phone.includes(searchTerm)
  );

  const handleCall = (contact: Contact) => {
    // This will be handled by the CallMeDialog
  };

  const handleVoiceCall = (contact: Contact) => {
    toast({
      title: '📞 Voice Call',
      description: `Memanggil ${contact.name} via suara...`,
    });
    // Simulate call duration
    setTimeout(() => {
      toast({
        title: 'Panggilan Berakhir',
        description: `Panggilan dengan ${contact.name} telah berakhir`,
      });
    }, 3000);
  };

  const handleVideoCall = (contact: Contact) => {
    toast({
      title: '📹 Video Call',
      description: `Memulai video call dengan ${contact.name}...`,
    });
    // Simulate call duration
    setTimeout(() => {
      toast({
        title: 'Video Call Berakhir',
        description: `Video call dengan ${contact.name} telah berakhir`,
      });
    }, 3000);
  };

  const handleWhatsAppCall = (contact: Contact) => {
    const phoneNumber = contact.phone.replace(/[^\d]/g, ''); // Remove non-digits
    const whatsappUrl = `https://wa.me/${phoneNumber}`;
    window.open(whatsappUrl, '_blank');
    toast({
      title: '💬 WhatsApp',
      description: `Membuka WhatsApp untuk ${contact.name}`,
    });
  };

  // Call Me Dialog Component
  const CallMeDialog = ({ contact }: { contact: Contact }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button
            size="icon"
            variant="outline"
            className="h-10 w-10 bg-green-50 hover:bg-green-100 border-green-200 rounded-full"
          >
            <Phone className="h-4 w-4 text-green-600" />
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-center">
              <div className="flex items-center justify-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-lg">
                  {contact.avatar}
                </div>
                <div>
                  <h3 className="font-bold text-lg">{contact.name}</h3>
                  <p className="text-sm text-gray-500">{contact.phone}</p>
                </div>
              </div>
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-3">
            {/* Voice Call */}
            <Button
              onClick={() => {
                handleVoiceCall(contact);
                setIsOpen(false);
              }}
              className="w-full h-14 bg-green-500 hover:bg-green-600 text-white rounded-xl flex items-center gap-3"
            >
              <PhoneCall className="h-5 w-5" />
              <div className="text-left">
                <div className="font-semibold">Voice Call</div>
                <div className="text-xs opacity-90">Panggilan suara langsung</div>
              </div>
            </Button>

            {/* Video Call */}
            <Button
              onClick={() => {
                handleVideoCall(contact);
                setIsOpen(false);
              }}
              className="w-full h-14 bg-blue-500 hover:bg-blue-600 text-white rounded-xl flex items-center gap-3"
            >
              <Video className="h-5 w-5" />
              <div className="text-left">
                <div className="font-semibold">Video Call</div>
                <div className="text-xs opacity-90">Panggilan video langsung</div>
              </div>
            </Button>

            {/* WhatsApp Call */}
            <Button
              onClick={() => {
                handleWhatsAppCall(contact);
                setIsOpen(false);
              }}
              variant="outline"
              className="w-full h-14 border-green-200 hover:bg-green-50 rounded-xl flex items-center gap-3"
            >
              <div className="w-5 h-5 bg-green-500 rounded flex items-center justify-center">
                <Phone className="h-3 w-3 text-white" />
              </div>
              <div className="text-left">
                <div className="font-semibold text-green-700">WhatsApp Call</div>
                <div className="text-xs text-green-600">Panggilan via WhatsApp</div>
              </div>
            </Button>

            {/* Regular Phone Call */}
            <Button
              onClick={() => {
                window.open(`tel:${contact.phone}`, '_self');
                setIsOpen(false);
                toast({
                  title: '📱 Phone Call',
                  description: `Membuka dialer untuk ${contact.name}`,
                });
              }}
              variant="outline"
              className="w-full h-14 border-gray-200 hover:bg-gray-50 rounded-xl flex items-center gap-3"
            >
              <Mic className="h-5 w-5 text-gray-600" />
              <div className="text-left">
                <div className="font-semibold text-gray-700">Phone Dialer</div>
                <div className="text-xs text-gray-600">Buka aplikasi telepon</div>
              </div>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  const handleMessage = (contact: Contact) => {
    setSelectedContact(contact);
  };

  const handleAddContact = (newContact: Contact) => {
    setContacts([...contacts, newContact]);
  };

  const getStatusColor = (status: Contact['status']) => {
    switch (status) {
      case 'online':
        return 'bg-green-500';
      case 'busy':
        return 'bg-yellow-500';
      case 'offline':
        return 'bg-gray-400';
      default:
        return 'bg-gray-400';
    }
  };

  // Jika ada kontak yang dipilih, tampilkan chat
  if (selectedContact) {
    return (
      <ContactChat
        contact={selectedContact}
        onBack={() => setSelectedContact(null)}
      />
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 shadow-lg">
        <h2 className="text-xl font-bold mb-3 text-center">Kontak Keluarga</h2>
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari kontak..."
              className="pl-10 bg-white/20 border-white/30 text-white placeholder-white/70 rounded-xl h-12"
            />
          </div>
          <AddContactDialog onContactAdded={handleAddContact} />
        </div>
      </div>

      {/* Contact List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
        {filteredContacts.length > 0 ? (
          filteredContacts.map((contact) => (
            <Card key={contact.id} className="shadow-sm hover:shadow-lg transition-all duration-200 border-0 bg-white">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  {/* Avatar */}
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-lg shadow-lg">
                      {contact.avatar}
                    </div>
                    {/* Status indicator */}
                    <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(contact.status)}`}></div>
                  </div>

                  {/* Contact Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900 text-base truncate">{contact.name}</h3>
                      {contact.isFamily && (
                        <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5">
                          Keluarga
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-1 truncate">{contact.phone}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`inline-block w-2 h-2 rounded-full ${getStatusColor(contact.status)}`}></span>
                      <span className="text-sm text-gray-500">
                        {contact.status === 'online' ? 'Online' : 
                         contact.status === 'busy' ? 'Sibuk' : 
                         contact.lastSeen ? `Terakhir dilihat ${contact.lastSeen}` : 'Offline'}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-1">
                    <CallMeDialog contact={contact} />
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => handleMessage(contact)}
                      className="h-10 w-10 bg-blue-50 hover:bg-blue-100 border-blue-200 rounded-full"
                    >
                      <MessageCircle className="h-4 w-4 text-blue-600" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <User className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="font-semibold text-gray-800 mb-2 text-lg">
              {searchTerm ? 'Kontak tidak ditemukan' : 'Belum ada kontak'}
            </h3>
            <p className="text-gray-600 text-center text-sm max-w-xs">
              {searchTerm 
                ? `Tidak ada kontak yang cocok dengan "${searchTerm}"`
                : 'Tambahkan kontak untuk mulai berkomunikasi'
              }
            </p>
          </div>
        )}
      </div>

      {/* Footer dengan statistik */}
      <div className="border-t bg-white p-4 shadow-sm">
        <div className="flex justify-between items-center text-sm text-gray-700">
          <span>{filteredContacts.length} kontak</span>
          <div className="flex gap-4">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              {contacts.filter(c => c.status === 'online').length} online
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
              {contacts.filter(c => c.status === 'busy').length} sibuk
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactList;