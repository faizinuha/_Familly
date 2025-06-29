
# Changelog

All notable changes to the Good Family project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## \[1.1.5 - 1.2.0 ] - 2025-08-01 ( Update )
* Fungsional Ios
* update Ui system
* video call
* Tracking Location
  
## \[1.1.0] - 2025-07-10 ( cooming soon ) 

### Added

* Fitur Voice Call (versi awal)
* UI halaman Telepon: tombol panggil, daftar kontak online
* Notifikasi panggilan masuk & suara ringtone
* Sistem accept/decline panggilan

## \[1.0.9] - 2025-07-07

### Added

* UI tab Call & Contact sudah aktif (belum fungsi penuh)
* Placeholder untuk fitur panggilan
* Ikon status kontak: online/offline

### Changed

* Navigasi antar tab makin halus

## \[1.0.8] - 2025-07-03

### Fixed

* Perbaikan bug scroll saat kirim file
* Penghapusan duplikat subscribe di channel Supabase

## \[1.0.7] - 2025-06-30

### Changed

* Optimasi komponen `ChatView` agar tidak re-subscribe saat kembali ke halaman sebelumnya
* Transisi antar grup dibuat lebih smooth

## \[1.0.6] - 2025-06-28

### Added

* Header chat baru dengan badge anggota dan tombol kembali
* Komponen `EmptyState` universal untuk semua tab kosong

## \[1.0.5] - 2025-06-26

### Fixed

* Bug subscribe Supabase: "subscribe can only be called a single time" diselesaikan
* Cleanup subscription saat unmount

## \[1.0.4] - 2025-06-24

### Added

* Komponen ChatGroupList dengan desain baru (gradien, hover effect)
* Placeholder UI untuk Call dan Contact tab

## \[1.0.3] - 2025-06-22

### Changed

* Desain halaman home diperbarui (modern & elegan)
* Gradient background + avatar user di activity

## \[1.0.2] - 2025-06-20

### Fixed

* Responsiveness diperbaiki di layout tablet
* Transisi hover card lebih halus di perangkat sentuh

## \[1.0.1] - 2025-06-18

### Fixed

* Minor bug di komponen chat (double render)
* Layout header grup chat yang tidak sejajar

## \[1.0.0] - 2025-05-30

### Added

* Semua fitur utama: grup keluarga, real-time chat, monitor perangkat, file upload, email notifikasi, dll.

---

## How to Contribute

1. Follow the existing code style and patterns
2. Add new features to the appropriate section
3. Update documentation when adding new functionality
4. Test thoroughly before committing changes
5. Write clear commit messages

## Versioning Strategy

- **Major versions**: Breaking changes or significant new features
- **Minor versions**: New features that are backward compatible
- **Patch versions**: Bug fixes and small improvements

For more information about the project, see the [README.md](./README.md) file.
