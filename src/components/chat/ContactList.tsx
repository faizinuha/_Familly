
import React, { useState } from 'react';
import { Phone, MessageCircle, User, Search, UserPlus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

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
const sampleContacts: Contact[] = [
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
  const [contacts, setContacts] = useState<Contact[]>(sampleContacts);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  // Filter kontak berdasarkan pencarian
  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.phone.includes(searchTerm)
  );

  const handleCall = (contact: Contact) => {
    toast({
      title: 'Memanggil',
      description: `Memanggil ${contact.name}...`,
    });
  };

  const handleMessage = (contact: Contact) => {
    toast({
      title: 'Membuka Chat',
      description: `Membuka chat dengan ${contact.name}`,
    });
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

  const getStatusText = (status: Contact['status']) => {
    switch (status) {
      case 'online':
        return 'Online';
      case 'busy':
        return 'Sibuk';
      case 'offline':
        return 'Offline';
      default:
        return 'Tidak diketahui';
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4">
        <h2 className="text-xl font-bold mb-3">Kontak Keluarga</h2>
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari kontak..."
              className="pl-10 bg-white/20 border-white/30 text-white placeholder-white/70"
            />
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/20 p-2"
          >
            <UserPlus className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Contact List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {filteredContacts.length > 0 ? (
          filteredContacts.map((contact) => (
            <Card key={contact.id} className="shadow-md hover:shadow-lg transition-all duration-200 border-l-4 border-l-blue-400">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  {/* Avatar */}
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-2xl shadow-lg">
                      {contact.avatar}
                    </div>
                    {/* Status indicator */}
                    <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${getStatusColor(contact.status)}`}></div>
                  </div>

                  {/* Contact Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-800">{contact.name}</h3>
                      {contact.isFamily && (
                        <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-700">
                          Keluarga
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-1">{contact.phone}</p>
                    <div className="flex items-center gap-2">
                      <span className={`inline-block w-2 h-2 rounded-full ${getStatusColor(contact.status)}`}></span>
                      <span className="text-xs text-gray-500">
                        {contact.status === 'online' ? 'Online' : 
                         contact.status === 'busy' ? 'Sibuk' : 
                         contact.lastSeen ? `Terakhir dilihat ${contact.lastSeen}` : 'Offline'}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleCall(contact)}
                      className="h-8 w-8 p-0 bg-green-50 hover:bg-green-100 border-green-200"
                    >
                      <Phone className="h-4 w-4 text-green-600" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleMessage(contact)}
                      className="h-8 w-8 p-0 bg-blue-50 hover:bg-blue-100 border-blue-200"
                    >
                      <MessageCircle className="h-4 w-4 text-blue-600" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <User className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="font-semibold text-gray-700 mb-2">
              {searchTerm ? 'Kontak tidak ditemukan' : 'Belum ada kontak'}
            </h3>
            <p className="text-gray-500 text-center">
              {searchTerm 
                ? `Tidak ada kontak yang cocok dengan "${searchTerm}"`
                : 'Tambahkan kontak untuk mulai berkomunikasi'
              }
            </p>
          </div>
        )}
      </div>

      {/* Footer dengan statistik */}
      <div className="border-t bg-gray-50 p-3">
        <div className="flex justify-between items-center text-sm text-gray-600">
          <span>{filteredContacts.length} kontak</span>
          <div className="flex gap-4">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
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
