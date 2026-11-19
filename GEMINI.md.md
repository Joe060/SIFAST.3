# PROJECT RULES & SPESIFIKASI DEMO — SIFAST FT (UNIVERSITAS SILIWANGI)

## 1. Peran & Tujuan Proyek
Kamu adalah Senior Frontend & UI/UX Engineer yang membangun aplikasi web demo interaktif **SIFAST FT (Sistem Informasi Fasilitas Fakultas Teknik — Universitas Siliwangi)**.
Aplikasi ini difokuskan pada kelengkapan antarmuka (8 halaman sesuai Lampiran B SRS) dan simulasi alur pengguna yang mulus untuk keperluan presentasi, pengambilan tangkapan layar dokumentasi, serta pengujian usability mahasiswa.

## 2. Arsitektur Ringan & Anti-Error (Wajib Dipatuhi)
- **Framework:** Next.js 14 (App Router, TypeScript) + Tailwind CSS + Lucide React + `next-themes`.
- **100% Client-Side State & LocalStorage:** DILARANG menginstal atau menggunakan `prisma`, `@prisma/client`, `sqlite`, `next-auth`, `bcryptjs`, atau database eksternal apa pun.
- **Tanpa File `.env`:** Aplikasi harus langsung berjalan normal dengan perintah `npm install` dan `npm run dev` tanpa membutuhkan variabel lingkungan atau kredensial pihak ketiga.
- **Persistensi Data Demo:** Simpan seluruh data (pengguna aktif, daftar kategori, laporan, dukungan, riwayat status, log akses identitas, dan log simulasi email) di dalam React Context yang tersinkronisasi dengan `localStorage`, dilengkapi data awal (*seed*) yang realistis serta tombol **"Reset Data Demo"** di menu pengaturan/navbar.

## 3. Batasan Lingkup (Anti Scope-Creep — Tabel 1.1 SRS)
DILARANG menambahkan fitur di luar lingkup SRS:
- Tidak ada kolom komentar publik atau fitur chat pada laporan.
- Tidak ada integrasi WhatsApp, peta interaktif, atau integrasi sistem akademik.
- Tidak ada fitur edit atau hapus laporan oleh mahasiswa setelah laporan dikirim.
- Tidak ada perhitungan SLA otomatis atau reservasi ruangan.

## 4. Simulasi Aturan Bisnis & Fungsional (KF-01 s.d. KF-20 & AB-01 s.d. AB-08)
Seluruh aturan SRS tetap disimulasikan secara interaktif di sisi klien:
1. **Akses Terbuka + Simulasi Validasi Email Kampus (KF-01, AB-01):**
   - Halaman Masuk menyediakan tombol **1-Klik Masuk Demo** untuk tiga peran: **Mahasiswa** (`mahasiswa@student.unsil.ac.id`), **Admin** (`admin@unsil.ac.id`), dan **Admin Utama** (`adminutama@unsil.ac.id`), sekaligus menyediakan **Quick Role Switcher** di pojok bawah/navbar agar penguji dapat berpindah peran kapan saja tanpa repot.
   - Halaman Masuk juga memiliki input email manual untuk menguji aturan domain: jika dimasukkan email non-kampus (misalnya `@gmail.com`), tampilkan pesan penolakan yang jelas sesuai `KF-01`.
2. **State Machine Status Laporan (AB-03 & KF-17):**
   - Status awal otomatis: `Diajukan`.
   - Alur perubahan status yang diizinkan: `Diajukan` -> `Diproses` atau `Ditolak`; `Diproses` -> `Selesai` atau `Ditolak`; sedangkan `Selesai` dan `Ditolak` bersifat final.
   - Jika Admin memilih `Ditolak`, kolom catatan alasan wajib diisi.
3. **Pelindungan Identitas & Anonimitas (AB-05, KF-04, KF-19):**
   - Identitas pelapor tidak pernah muncul pada daftar laporan publik mahasiswa.
   - Pada laporan dengan opsi **Anonim** aktif: Admin biasa hanya melihat keterangan *"Identitas Dilindungi (Anonim)"*.
   - Hanya peran **Admin Utama** yang memiliki tombol **"Buka Identitas Pelapor"**. Saat diklik, wajib mengisi alasan dalam modal konfirmasi, lalu identitas pelapor ditampilkan dan aktivitas tersebut otomatis tercatat permanen di halaman **Log Akses Identitas**.
4. **Dukungan & Batas Harian (AB-04, KF-06, KF-13):**
   - Tombol **"Saya juga mengalami"** hanya dapat ditekan 1 kali per laporan dan tidak muncul pada laporan milik sendiri.
   - Simulasikan batas maksimal 5 laporan per 24 jam per mahasiswa dengan indikator sisa kuota harian pada form buat laporan.
5. **Audit Log & Simulasi Notifikasi Email (KN-12, KF-12):**
   - Daftar riwayat status dan log akses identitas bersifat *read-only* (tidak ada tombol edit/hapus).
   - Setiap kali Admin mengubah status laporan, tambahkan entri baru ke drawer **"Outbox Notifikasi Email (Simulasi)"** yang dapat dibuka dari ikon lonceng/surat di navbar.

## 5. Desain UI/UX (Notion-Inspired Navy & White + Dual Theme)
- **Gaya Visual:** Clean minimal ala Notion — tipografi bersih (`Inter` / `Plus Jakarta Sans`), garis tepi tipis `1px`, sudut membulat halus, ruang kosong lega, dan bebas dekorasi berlebihan.
- **Palet Warna (Wajib mendukung Light Mode & Dark Mode via `next-themes`):**
  - *Light Mode:* Latar utama `#FFFFFF`, latar kartu/permukaan `#F8FAFC`, teks utama `#0F172A`, teks sekunder `#475569`, warna aksen utama **Biru Navy** `#0F294A` (hover `#1E3A8A`), garis tepi `#E2E8F0`.
  - *Dark Mode:* Latar utama `#0B1120`, latar kartu/permukaan `#111827`, teks utama `#F8FAFC`, teks sekunder `#94A3B8`, warna aksen biru terang `#3B82F6` dengan kontras teks memenuhi standar keterbacaan tinggi, garis tepi `#1E293B`.
- **Responsivitas & Bahasa:** Wajib responsif mulai lebar layar ponsel `360px` dan seluruh antarmuka menggunakan **Bahasa Indonesia** yang baku dan rapi.

## 6. Daftar 8 Halaman Wajib (Sesuai Lampiran B SRS)
1. **`/login` — Halaman Masuk (Gambar B.1):** Branding SIFAST FT Universitas Siliwangi, input uji domain email kampus, dan tombol masuk cepat 1-klik untuk peran Mahasiswa, Admin, dan Admin Utama.
2. **`/` — Halaman Beranda & Daftar Laporan Mahasiswa (Gambar B.2):** Kartu ringkasan statistik laporan per kategori dan status (`KF-11`), pencarian serta filter Kategori/Lokasi/Status (`KF-08`), daftar laporan publik tanpa identitas pengirim, badge penanda laporan duplikat, tombol dukungan *"Saya juga mengalami"*, dan tombol utama **"Buat Laporan"**.
3. **`/laporan/baru` — Halaman Buat Laporan (Gambar B.3):** Input Kategori aktif (wajib), Lokasi/Ruangan (wajib), Deskripsi (wajib), Tingkat Urgensi (opsional), Waktu Kejadian (opsional), unggah foto pratinjau lokal berbasis Data URL/Object URL maksimal 3 gambar, dan sakelar **Kirim sebagai Anonim**.
4. **`/laporan-saya` & `/laporan-saya/[id]` — Halaman Laporan Saya & Detail (Gambar B.4):** Daftar laporan milik mahasiswa aktif (termasuk laporan anonim miliknya) beserta halaman detail yang menampilkan foto bukti, catatan admin, dan linimasa vertikal riwayat perubahan status.
5. **`/admin` — Dasbor Admin (Gambar B.5):** Kartu rekap statistik (tidak menghitung laporan yang disembunyikan) serta tabel/daftar laporan masuk terbaru dengan filter Status, Kategori, dan Urgensi.
6. **`/admin/laporan/[id]` — Halaman Detail Laporan Admin (Gambar B.6):** Panel ubah status sesuai alur sah + catatan wajib saat ditolak, panel moderasi (sembunyikan laporan & tandai duplikat dari ID laporan lain), serta panel identitas pelapor dengan tombol buka identitas khusus **Admin Utama**.
7. **`/admin/kategori` — Halaman Kelola Kategori (Gambar B.7):** Tambah kategori baru, ubah nama kategori, dan sakelar status Aktif/Nonaktif.
8. **`/admin/log-identitas` — Halaman Log Akses Identitas khusus Admin Utama (Gambar B.8):** Tabel audit *read-only* berisi waktu akses, nama Admin Utama, ID & lokasi laporan, serta alasan pembukaan identitas.