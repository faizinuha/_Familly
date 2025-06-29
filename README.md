
# Good Family - Family Management App

Aplikasi manajemen keluarga yang lengkap dengan fitur monitoring, chat grup, dan notifikasi real-time.

## ✨ Fitur Utama

### 🏠 Dashboard Home
- **Status Online**: Tracking user yang sedang online dengan indikator real-time
- **Statistik Keluarga**: Device online, jumlah grup, user aktif, dan aktivitas
- **Aktivitas Terbaru**: Monitor aktivitas anggota keluarga secara real-time
- **Quick Stats**: Overview cepat dengan visual menarik dan design modern
- **Gradient UI**: Tampilan elegan dengan gradient dan animasi smooth

### 👥 Manajemen Grup Keluarga
- **Buat Grup**: Kepala keluarga dapat membuat grup baru
- **Gabung Grup**: Join grup menggunakan kode undangan
- **Avatar Grup**: Huruf pertama nama grup sebagai avatar
- **Member Management**: Lihat semua anggota dengan avatar dan nama
- **Kode Undangan**: Unique code untuk setiap grup
- **Delete Grup**: Hanya kepala keluarga yang bisa menghapus

### 💬 Chat Grup (Fitur Terbaru)
- **UI Responsif**: Tampilan chat yang smooth di semua device
- **Bubble Chat**: Design modern dengan bubble chat kiri-kanan
- **Real-time Messaging**: Pesan langsung terkirim tanpa refresh
- **File Upload**: 
  - Upload gambar (preview langsung)
  - Upload dokumen (PDF, DOC, TXT)
  - Maksimal file 10MB
- **Emoji Support**: 12 emoji populer dengan picker
- **Mention System**: Mention user dengan @username (coming soon)
- **Timestamps**: Jam kirim pesan dengan format lokal Indonesia
- **System Notifications**: Notifikasi khusus dari sistem
- **Attachment Preview**: Preview gambar dan file yang di-upload
- **Typing Indicators**: Indikator ketika user sedang mengetik

### 📱 Device Monitoring (Khusus Kepala Keluarga)
- **Status Online/Offline**: Real-time device status
- **Current App**: Aplikasi yang sedang digunakan
- **WiFi Information**: Nama WiFi yang terkoneksi
- **Send Notifications**: Kirim notifikasi ke device anggota
- **Email Alerts**: Kirim notifikasi melalui email
- **Device Details**: Nama device dan informasi teknis

### 🔔 Sistem Notifikasi
- **Push Notifications**: Support untuk notifikasi bubble di HP
- **System Alerts**: Notifikasi sistem untuk aktivitas penting
- **Real-time Updates**: Notifikasi langsung tanpa delay
- **Toast Messages**: Feedback visual untuk setiap aksi

### 👤 Profile & Authentication
- **User Profiles**: Full name dan role management
- **Role System**: Kepala keluarga vs Member
- **Online Status**: Track kapan terakhir online
- **Activity Tracking**: Monitor aktivitas user
- **Modern Auth UI**: Tampilan login/register yang elegant

### 🔒 Security & Privacy
- **PIN Authentication**: Optional PIN protection untuk keamanan
- **Row Level Security**: Data aman dengan RLS policies
- **File Storage**: Secure file storage dengan Supabase
- **Authentication**: Email/password dengan Supabase Auth
- **Permission System**: Role-based access control

## 🛠️ Teknologi yang Digunakan

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **UI Components**: Shadcn/UI dengan Radix UI
- **Backend**: Supabase (Database, Auth, Storage, Realtime)
- **State Management**: React Hooks + Custom Hooks
- **Icons**: Lucide React
- **Styling**: Responsive design dengan mobile-first approach + modern gradients
- **Real-time**: Supabase Realtime untuk live updates
- **File Upload**: Supabase Storage dengan policies
- **Email Service**: Resend API untuk email notifications

## 📱 Mobile Experience

- **Responsive Design**: Perfect di semua ukuran layar
- **Touch Optimized**: UI yang user-friendly untuk mobile
- **Bottom Navigation**: Akses mudah dengan navigation bar
- **Smooth Animations**: Transisi halus antar halaman dengan gradient effects
- **Mobile Chat**: Chat experience seperti WhatsApp
- **Emoji Picker**: Native feel emoji selection
- **File Upload**: Drag & drop atau click to upload

## 🚀 Fitur Real-time

- **Live Chat**: Pesan langsung muncul tanpa refresh
- **Typing Indicators**: Lihat ketika user sedang mengetik
- **Online Status**: User online/offline real-time
- **Activity Logs**: Live tracking aktivitas keluarga
- **Device Status**: Monitor device secara live
- **Notifications**: Push notification real-time

## 🎨 UI/UX Features

- **Modern Design**: Clean dan intuitive interface dengan gradient backgrounds
- **Elegant Colors**: Sophisticated color palette dengan smooth transitions
- **Animations**: Smooth transitions, hover effects, dan micro-interactions
- **Loading States**: Proper loading indicators dengan skeleton screens
- **Error Handling**: User-friendly error messages
- **Toast Notifications**: Instant feedback untuk user actions
- **Card Hover Effects**: Interactive elements dengan shadow dan scale effects

## 📊 Analytics & Monitoring

- **Device Analytics**: Monitor penggunaan device keluarga
- **Activity Tracking**: Log semua aktivitas anggota
- **Usage Statistics**: Statistik penggunaan aplikasi
- **Online Time**: Track waktu online setiap anggota
- **Email Reports**: Laporan monitoring via email

## 🔐 Permission System

### Kepala Keluarga:
- Buat dan hapus grup
- Monitor semua device
- Kirim notifikasi ke anggota (app dan email)
- Akses full analytics
- Manage group members

### Member:
- Join grup dengan kode
- Chat dalam grup
- Update profile sendiri
- View group activities
- Receive notifications

## 🎯 Roadmap

- [ ] **Mention System**: Complete mention functionality dengan notification
- [ ] **Video Call**: Group video call feature
- [ ] **Task Management**: Assign tasks to family members
- [ ] **Calendar Integration**: Family calendar dan events
- [ ] **Location Sharing**: Safe location sharing untuk keluarga
- [ ] **Screen Time Control**: Kontrol waktu layar untuk anak
- [ ] **Emergency Features**: Emergency contact dan panic button
- [ ] **Multi-language**: Support bahasa Indonesia dan English
- [ ] **Dark Mode**: Theme switching untuk preferensi user

## 🚀 Deployment & Setup

### Deployment Options
- **Vercel/Netlify**: Frontend hosting dengan Supabase backend

## 💡 Cara Penggunaan

1. **Daftar/Login**: Buat akun atau login dengan design auth yang modern
2. **Setup Profile**: Isi nama lengkap dan pilih role
3. **Buat/Join Grup**: Buat grup baru atau join dengan kode
4. **Mulai Chat**: Chat dengan anggota keluarga + typing indicators
5. **Monitor Device**: (Kepala keluarga) Monitor device anggota + email alerts
6. **Upload File**: Share foto dan dokumen dalam chat 
7. **Gunakan Emoji**: Express dengan emoji dalam chat
8. **Setup PIN**: Optional PIN authentication untuk keamanan

## 🎨 Screenshots & Preview


## 📈 Changelog

Untuk melihat history perubahan dan update terbaru, silakan cek [CHANGELOG.md](./CHANGELOG.md).

## 📞 Support & Contact

Untuk bantuan dan support, hubungi developer atau buat issue di repository.

## 🤝 Contributing

1. Fork repository ini
2. Buat feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push ke branch (`git push origin feature/amazing-feature`)
5. Buat Pull Request

---

**Good Family** - Keeping families connected and safe with modern, elegant design! 👨‍👩‍👧‍👦✨

Built with ❤️ using React, TypeScript, Tailwind CSS, and Supabase.
